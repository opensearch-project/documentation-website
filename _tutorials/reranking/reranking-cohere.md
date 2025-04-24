---
layout: default
title: Reranking using Cohere Rerank
parent: Reranking search results
nav_order: 90
redirect_from:
  - /ml-commons-plugin/tutorials/reranking-cohere/
  - /vector-search/tutorials/reranking/reranking-cohere/
canonical_url: https://docs.opensearch.org/docs/latest/tutorials/reranking/reranking-cohere/
---

# Reranking search results using Cohere Rerank

A [reranking pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/) can rerank search results, providing a relevance score for each document in the search results with respect to the search query. The relevance score is calculated by a cross-encoder model. 

This tutorial shows you how to use the [Cohere Rerank](https://docs.cohere.com/reference/rerank-1) model in a reranking pipeline. 

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Register a Cohere Rerank model

Create a connector for the Cohere Rerank model:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "cohere-rerank",
    "description": "The connector to Cohere reanker model",
    "version": "1",
    "protocol": "http",
    "credential": {
        "cohere_key": "your_cohere_api_key"
    },
    "parameters": {
        "model": "rerank-english-v2.0"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://api.cohere.ai/v1/rerank",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}"
            },
            "request_body": "{ \"documents\": ${parameters.documents}, \"query\": \"${parameters.query}\", \"model\": \"${parameters.model}\", \"top_n\": ${parameters.top_n} }",
            "pre_process_function": "connector.pre_process.cohere.rerank",
            "post_process_function": "connector.post_process.cohere.rerank"
        }
    ]
}
```
{% include copy-curl.html %}

Use the connector ID from the response to register a Cohere Rerank model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "cohere rerank model",
    "function_name": "remote",
    "description": "test rerank model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID in the response; you'll use it in the following steps.

Test the model by calling the Predict API:

```json
POST _plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "query": "What is the capital of the United States?",
    "documents": [
      "Carson City is the capital city of the American state of Nevada.",
      "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan.",
      "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
      "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
    ],
    "top_n": 4
  }
}
```

To ensure compatibility with the rerank pipeline, the `top_n` value must be the same as the length of the `documents` list. 
{: .important}

You can customize the number of top documents returned in the response by providing the `size` parameter. For more information, see [Step 2.3](#step-23-test-the-reranking).

OpenSearch responds with the inference results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.10194652
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.0721122
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.98005307
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.27904198
          ]
        }
      ],
      "status_code": 200
    }
  ]
}
```

The response contains four `similarity` objects. For each `similarity` object, the `data` array contains a relevance score for each document with respect to the query. The `similarity` objects are provided in the order of the input documents; the first object pertains to the first document. This differs from the default output of the Cohere Rerank model, which orders documents by relevance score. The document order is changed in the `connector.post_process.cohere.rerank` post-processing function in order to make the output compatible with a reranking pipeline.

## Step 2: Configure a reranking pipeline

Follow these steps to configure a reranking pipeline.

### Step 2.1: Ingest test data

Send a bulk request to ingest test data:

```json
POST _bulk
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Carson City is the capital city of the American state of Nevada." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states." }
```
{% include copy-curl.html %}

### Step 2.2: Create a reranking pipeline

Create a reranking pipeline with the Cohere Rerank model:

```json
PUT /_search/pipeline/rerank_pipeline_cohere
{
    "description": "Pipeline for reranking with Cohere Rerank model",
    "response_processors": [
        {
            "rerank": {
                "ml_opensearch": {
                    "model_id": "your_model_id_created_in_step1"
                },
                "context": {
                    "document_fields": ["passage_text"]
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 2.3: Test the reranking

To limit the number of returned results, you can specify the `size` parameter. For example, set `"size": 2` to return the top two documents:

```json
GET my-test-data/_search?search_pipeline=rerank_pipeline_cohere
{
  "query": {
    "match_all": {}
  },
  "size": 4,
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "What is the capital of the United States?"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two most relevant documents:

```json
{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 0.98005307,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "zbUOw40B8vrNLhb9vBif",
        "_score": 0.98005307,
        "_source": {
          "passage_text": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "zrUOw40B8vrNLhb9vBif",
        "_score": 0.27904198,
        "_source": {
          "passage_text": "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "y7UOw40B8vrNLhb9vBif",
        "_score": 0.10194652,
        "_source": {
          "passage_text": "Carson City is the capital city of the American state of Nevada."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "zLUOw40B8vrNLhb9vBif",
        "_score": 0.0721122,
        "_source": {
          "passage_text": "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

To compare these results to results without reranking, run the search without a reranking pipeline:

```json
GET my-test-data/_search
{
  "query": {
    "match_all": {}
  },
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "What is the capital of the United States?"
      }
    }
  }
}
```
{% include copy-curl.html %}

The first document in the response pertains to Carson City, which is not the capital of the United States:

```json
{
  "took": 0,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "y7UOw40B8vrNLhb9vBif",
        "_score": 1,
        "_source": {
          "passage_text": "Carson City is the capital city of the American state of Nevada."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "zLUOw40B8vrNLhb9vBif",
        "_score": 1,
        "_source": {
          "passage_text": "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "zbUOw40B8vrNLhb9vBif",
        "_score": 1,
        "_source": {
          "passage_text": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "zrUOw40B8vrNLhb9vBif",
        "_score": 1,
        "_source": {
          "passage_text": "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
        }
      }
    ]
  }
}
```