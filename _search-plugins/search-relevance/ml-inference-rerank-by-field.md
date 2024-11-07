---
layout: default
title: ML Inference Processor with By Field Rerank type
parent: Reranking search results
grand_parent: Search relevance
has_children: false
nav_order: 20
---
# ML Inference Processor with By Field Rerank type
Introduced 2.18
{: .label .label-purple }

You can use the results of a remote model via the [ml_inference]({{site.url}}{{site.baseurl}}/_ingest-pipelines/processors/ml-inference.md) processor, with a [by_field]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field/) rerank type to get better search results.
In order to do this you need to configure a search pipeline that runs at search time. The search pipeline will intercept search results
pass them to the ml_inference processor which will apply a remote cross encoder model. Then once the results are returned it will apply the 
reranker to use that metric in order to rerank your documents.

In this tutorial we will showcase a scenario with documents related to New York City areas with emphasis on finding better search results based
on the provided search query. We will use [Huggingface cross-encoder/ms-marco-MiniLM-L-6-v2](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2)
hosted on Amazon SageMaker.

## Running a search with both processors

To run a search with reranking, follow these steps:

0. [Deploy the model on Amazon SageMaker](#0-deploy-the-model-on-amazon-sagemaker)
1. [Create an index for ingestion](#step-1-create-an-index-for-ingestion).
2. [Create a connector](#step-2-create-a-connector).
3. [Create a model](#step-3-create-a-model).
4. [Create the Search pipeline](#step-4-create-the-search-pipeline).
5. [apply the pipeline on a search query](#step-5-apply-the-pipeline-on-a-search-query).

## 0. Deploy the model on Amazon Sagemaker
Use the following code to deploy the model on Amazon Sagemaker. 
You can find all supported instance type and price on [Amazon Sagemaker Pricing document](https://aws.amazon.com/sagemaker/pricing/). Suggest to use GPU for better performance.
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
To find the endpoint make sure to the SageMaker homepage and navigate in the left tab **Inference > Endpoints** make note of the url specific to the model created it will be used when creating the connector.

## Step 1: Create an Index for Ingestion
Create an index called nyc_areas
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

## Step 2: Create a connector
Create a conector assuming you have created a sagemaker model with a cross encoder 

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "SageMaker cross-encoder model",
  "description": "Test connector for Sagemaker cross-encoder model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
		"access_key": "<Access key>",
		"secret_key": "<Secret key>",
		"session_token": "<Session token>"
  },
  "parameters": {
    "region": "us-east-1",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "<SageMaker Endpoint>",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"inputs\":${parameters.inputs}}" ,
       "pre_process_function": 
      """
        def json = params.json;
        def inputs = json.parameters.inputs;
        
        def result = [:];
        result.query_text = inputs.text;
        result.text_docs = [inputs.text_pair];
        
        return result;
      """
    }
  ]
}
```
{% include copy-curl.html %}


## Step 3: Create a model
```json
POST /_plugins/_ml/models/_register
{
  "name": "text classification model",
  "version": "1.0.1",
  "function_name": "remote",
  "description": "Text Classification",
  "connector_id": "<connector_id_from_step_2>"
} 

```
{% include copy-curl.html %}


## Step 4: Create the search pipeline
Now we will apply our search pipeline our input will use the facts from each document. and the text pair will come from our initial query
to the documents we want to compare with.

As for reranking; the data returned will be `rank_score` which will be used to reorder the documents based on the data the cross encoder provided. We will to remove the `rank_score`
field as retaining will show the same value for the `_score` field and the `_source.rank_score` field. We will also keep the previous score metric before the reranking for debugging purposes
and for emphasis of improvement of search relevancy according the search query.

```json
PUT /_search/pipeline/my_pipeline
{
  "response_processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor runs ml inference during search response",
        "model_id": "<model_id_from_step_3>",
        "model_input":"""{"parameters":{"inputs":{"text":"${input_map.text}","text_pair":"${input_map.text_pair}"}}}""",
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
          "remove_target_field":true,
          "keep_previous_score" : true
          }
      }
    
    }
  ]
}
```

## Step 5: Apply the pipeline on a search query
Now we want to first grab documents that have any of the following in the description or the facts field. Once we have this we will use "artist art creative community" to 
compare our other documents.
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

Notice that in the result of this search pipeline we added the previous score to observe the difference from BM25 with the cross encoder.
See how Astoria ranked higher even though it didnt have as much keyword matches as Harlem did.

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

