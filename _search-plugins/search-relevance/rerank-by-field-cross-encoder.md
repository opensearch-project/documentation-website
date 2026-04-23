---
layout: default
title: Reranking by a field using a cross-encoder
parent: Reranking search results
grand_parent: Search relevance
has_children: false
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/rerank-by-field-cross-encoder/
---

# Reranking by a field using an externally hosted cross-encoder model
Introduced 2.18
{: .label .label-purple }

In this tutorial, you'll learn how to use a cross-encoder model hosted on Amazon SageMaker to rerank search results and improve search relevance. 

To rerank documents, you'll configure a search pipeline that processes search results at query time. The pipeline intercepts search results and passes them to the [`ml_inference` search response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-response/), which invokes the cross-encoder model. The model generates scores used to rerank the matching documents [`by_field`]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field/).

## Prerequisite: Deploy a model on Amazon SageMaker

Run the following code to deploy a model on Amazon SageMaker. For this example, you'll use the [`ms-marco-MiniLM-L-6-v2`](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2) Hugging Face cross-encoder model hosted on Amazon SageMaker. We recommend using a GPU for better performance:

```python
import sagemaker
import boto3
from sagemaker.huggingface import HuggingFaceModel

sess = sagemaker.Session()
role = sagemaker.get_execution_role()

hub = {
    'HF_MODEL_ID':'cross-encoder/ms-marco-MiniLM-L-6-v2',
    'HF_TASK':'text-classification'
}
huggingface_model = HuggingFaceModel(
    transformers_version='4.37.0',
    pytorch_version='2.1.0',
    py_version='py310',
    env=hub,
    role=role, 
)
predictor = huggingface_model.deploy(
    initial_instance_count=1, # number of instances
    instance_type='ml.m5.xlarge' # ec2 instance type
)
```
{% include copy.html %}

After deploying the model, you can find the model endpoint by going to the Amazon SageMaker console in the AWS Management Console and selecting **Inference > Endpoints** on the left tab. Note the URL for the created model; you'll use it to create a connector.

## Running a search with reranking

To run a search with reranking, follow these steps:

1. [Create a connector](#step-1-create-a-connector).
1. [Register the model](#step-2-register-the-model).
1. [Ingest documents into an index](#step-3-ingest-documents-into-an-index).
1. [Create a search pipeline](#step-4-create-a-search-pipeline).
1. [Search using reranking](#step-5-search-using-reranking).

## Step 1: Create a connector

Create a connector to the cross-encoder model by providing the model URL in the `actions.url` parameter:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "SageMaker cross-encoder model",
  "description": "Test connector for SageMaker cross-encoder hosted model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
		"access_key": "<YOUR_ACCESS_KEY>",
		"secret_key": "<YOUR_SECRET_KEY>",
		"session_token": "<YOUR_SESSION_TOKEN>"
  },
  "parameters": {
    "region": "<REGION>",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "<YOUR_SAGEMAKER_ENDPOINT_URL>",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"inputs\": { \"text\": \"${parameters.text}\", \"text_pair\": \"${parameters.text_pair}\" }}"
    }
  ]
}
```
{% include copy-curl.html %}

Note the connector ID contained in the response; you'll use it in the following step.

## Step 2: Register the model

To register the model, provide the connector ID in the `connector_id` parameter:

```json
POST /_plugins/_ml/models/_register
{
  "name": "Cross encoder model",
  "version": "1.0.1",
  "function_name": "remote",
  "description": "Using a SageMaker endpoint to apply a cross encoder model",
  "connector_id": "<YOUR_CONNECTOR_ID>"
} 
```
{% include copy-curl.html %}


## Step 3: Ingest documents into an index

Create an index and ingest sample documents containing facts about the New York City boroughs:

```json
POST /nyc_areas/_bulk
{ "index": { "_id": 1 } }
{ "borough": "Queens", "area_name": "Astoria", "description": "Astoria is a neighborhood in the western part of Queens, New York City, known for its diverse community and vibrant cultural scene.", "population": 93000, "facts": "Astoria is home to many artists and has a large Greek-American community. The area also boasts some of the best Mediterranean food in NYC." } 
{ "index": { "_id": 2 } }
{ "borough": "Queens", "area_name": "Flushing", "description": "Flushing is a neighborhood in the northern part of Queens, famous for its Asian-American population and bustling business district.", "population": 227000, "facts": "Flushing is one of the most ethnically diverse neighborhoods in NYC, with a large Chinese and Korean population. It is also home to the USTA Billie Jean King National Tennis Center." } 
{ "index": { "_id": 3 } }
{ "borough": "Brooklyn", "area_name": "Williamsburg", "description": "Williamsburg is a trendy neighborhood in Brooklyn known for its hipster culture, vibrant art scene, and excellent restaurants.", "population": 150000, "facts": "Williamsburg is a hotspot for young professionals and artists. The neighborhood has seen rapid gentrification over the past two decades." } 
{ "index": { "_id": 4 } }
{ "borough": "Manhattan", "area_name": "Harlem", "description": "Harlem is a historic neighborhood in Upper Manhattan, known for its significant African-American cultural heritage.", "population": 116000, "facts": "Harlem was the birthplace of the Harlem Renaissance, a cultural movement that celebrated Black culture through art, music, and literature." } 
{ "index": { "_id": 5 } }
{ "borough": "The Bronx", "area_name": "Riverdale", "description": "Riverdale is a suburban-like neighborhood in the Bronx, known for its leafy streets and affluent residential areas.", "population": 48000, "facts": "Riverdale is one of the most affluent areas in the Bronx, with beautiful parks, historic homes, and excellent schools." } 
{ "index": { "_id": 6 } }
{ "borough": "Staten Island", "area_name": "St. George", "description": "St. George is the main commercial and cultural center of Staten Island, offering stunning views of Lower Manhattan.", "population": 15000, "facts": "St. George is home to the Staten Island Ferry terminal and is a gateway to Staten Island, offering stunning views of the Statue of Liberty and Ellis Island." }
```
{% include copy-curl.html %}

## Step 4: Create a search pipeline

Next, create a search pipeline for reranking. In the search pipeline configuration, the `input_map` and `output_map` define how the input data is prepared for the cross-encoder model and how the model's output is interpreted for reranking:

- The `input_map` specifies which fields in the search documents and the query should be used as model inputs:
    - The `text` field maps to the `facts` field in the indexed documents. It provides the document-specific content that the model will analyze.
    - The `text_pair` field dynamically retrieves the search query text (`multi_match.query`) from the search request. 

    The combination of `text` (document `facts`) and `text_pair` (search `query`) allows the cross-encoder model to compare the relevance of the document to the query, considering their semantic relationship.

- The `output_map` field specifies how the output of the model is mapped to the fields in the response:
    - The `rank_score` field in the response will store the model's relevance score, which will be used to perform reranking.
    
When using the `by_field` rerank type, the `rank_score` field will contain the same score as the `_score` field. To remove the `rank_score` field from the search results, set `remove_target_field` to `true`. The original BM25 score, before reranking, is included for debugging purposes by setting `keep_previous_score` to `true`. This allows you to compare the original score with the reranked score to evaluate improvements in search relevance.
    
To create the search pipeline, send the following request:

```json
PUT /_search/pipeline/my_pipeline
{
  "response_processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor runs ml inference during search response",
        "model_id": "<model_id_from_step_3>",
        "function_name": "REMOTE",
        "input_map": [
          {
            "text": "facts",
            "text_pair":"$._request.query.multi_match.query"
          }
        ],
        "output_map": [
          {
            "rank_score": "$.score"
          }
        ],
        "full_response_path": false,
        "model_config": {},
        "ignore_missing": false,
        "ignore_failure": false,
        "one_to_one": true
      },
       
      "rerank": {
        "by_field": {
          "target_field": "rank_score",
          "remove_target_field": true,
          "keep_previous_score" : true
          }
      }
    
    }
  ]
}
```
{% include copy-curl.html %}

## Step 5: Search using reranking

Use the following request to search indexed documents and rerank them using the cross-encoder model. The request retrieves documents containing any of the specified terms in the `description` or `facts` fields. These terms are then used to compare and rerank the matched documents:

```json
POST /nyc_areas/_search?search_pipeline=my_pipeline
{
  "query": {
    "multi_match": {
      "query": "artists art creative community",
      "fields": ["description", "facts"]
    }
  }
}
```
{% include copy-curl.html %}

In the response, the `previous_score` field contains the document's BM25 score, which it would have received if you hadn't applied the pipeline. Note that while BM25 ranked "Astoria" the highest, the cross-encoder model prioritized "Harlem" because it matched more search terms:

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.03418137,
    "hits": [
      {
        "_index": "nyc_areas",
        "_id": "4",
        "_score": 0.03418137,
        "_source": {
          "area_name": "Harlem",
          "description": "Harlem is a historic neighborhood in Upper Manhattan, known for its significant African-American cultural heritage.",
          "previous_score": 1.6489418,
          "borough": "Manhattan",
          "facts": "Harlem was the birthplace of the Harlem Renaissance, a cultural movement that celebrated Black culture through art, music, and literature.",
          "population": 116000
        }
      },
      {
        "_index": "nyc_areas",
        "_id": "1",
        "_score": 0.0090838,
        "_source": {
          "area_name": "Astoria",
          "description": "Astoria is a neighborhood in the western part of Queens, New York City, known for its diverse community and vibrant cultural scene.",
          "previous_score": 2.519608,
          "borough": "Queens",
          "facts": "Astoria is home to many artists and has a large Greek-American community. The area also boasts some of the best Mediterranean food in NYC.",
          "population": 93000
        }
      },
      {
        "_index": "nyc_areas",
        "_id": "3",
        "_score": 0.0032599436,
        "_source": {
          "area_name": "Williamsburg",
          "description": "Williamsburg is a trendy neighborhood in Brooklyn known for its hipster culture, vibrant art scene, and excellent restaurants.",
          "previous_score": 1.5632852,
          "borough": "Brooklyn",
          "facts": "Williamsburg is a hotspot for young professionals and artists. The neighborhood has seen rapid gentrification over the past two decades.",
          "population": 150000
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```
 