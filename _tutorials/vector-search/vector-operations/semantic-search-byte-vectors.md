---
layout: default
title: Semantic search using byte vectors
parent: Vector operations
grand_parent: Vector search
nav_order: 10
redirect_from:
  - /ml-commons-plugin/tutorials/semantic-search-byte-vectors/
  - /vector-search/tutorials/vector-operations/semantic-search-byte-vectors/
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/vector-operations/semantic-search-byte-vectors/
---

# Semantic search using byte-quantized vectors

This tutorial shows you how to build a semantic search using the [Cohere Embed model](https://docs.cohere.com/reference/embed) and byte-quantized vectors. For more information about using byte-quantized vectors, see [Byte vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#byte-vectors) and [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

The Cohere Embed v3 model supports several `embedding_types`. For this tutorial, you'll use the `INT8` type to encode byte-quantized vectors. 

The Cohere Embed v3 model supports several input types. This tutorial uses the following input types:

- `search_document`: Use this input type when you have text (in the form of documents) that you want to store in a vector database.
- `search_query`: Use this input type when structuring search queries to find the most relevant documents in your vector database.

For more information about input types, see the [Cohere documentation](https://docs.cohere.com/docs/embed-api#the-input_type-parameter).

In this tutorial, you will create two models:

- A model used for ingestion, whose `input_type` is `search_document` 
- A model used for search, whose `input_type` is `search_query`

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Create an embedding model for ingestion

Create a connector for the Cohere model, specifying the `search_document` input type:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Cohere embedding connector with int8 embedding type for ingestion",
    "description": "Test connector for Cohere embedding model",
    "version": 1,
    "protocol": "http",
    "credential": {
        "cohere_key": "your_cohere_api_key"
    },
    "parameters": {
        "model": "embed-english-v3.0",
        "embedding_types": ["int8"],
        "input_type": "search_document"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}",
                "Request-Source": "unspecified:opensearch"
            },
            "url": "https://api.cohere.ai/v1/embed",
            "request_body": "{ \"model\": \"${parameters.model}\", \"texts\": ${parameters.texts}, \"input_type\":\"${parameters.input_type}\", \"embedding_types\": ${parameters.embedding_types} }",
            "pre_process_function": "connector.pre_process.cohere.embedding",
            "post_process_function": "\n    def name = \"sentence_embedding\";\n    def data_type = \"FLOAT32\";\n    def result;\n    if (params.embeddings.int8 != null) {\n      data_type = \"INT8\";\n      result = params.embeddings.int8;\n    } else if (params.embeddings.uint8 != null) {\n      data_type = \"UINT8\";\n      result = params.embeddings.uint8;\n    } else if (params.embeddings.float != null) {\n      data_type = \"FLOAT32\";\n      result = params.embeddings.float;\n    }\n    \n    if (result == null) {\n      return \"Invalid embedding result\";\n    }\n    \n    def embedding_list = new StringBuilder(\"[\");\n    \n    for (int m=0; m<result.length; m++) {\n      def embedding_size = result[m].length;\n      def embedding = new StringBuilder(\"[\");\n      def shape = [embedding_size];\n      for (int i=0; i<embedding_size; i++) {\n        def val;\n        if (\"FLOAT32\".equals(data_type)) {\n          val = result[m][i].floatValue();\n        } else if (\"INT8\".equals(data_type) || \"UINT8\".equals(data_type)) {\n          val = result[m][i].intValue();\n        }\n        embedding.append(val);\n        if (i < embedding_size - 1) {\n          embedding.append(\",\");  \n        }\n      }\n      embedding.append(\"]\");  \n      \n      // workaround for compatible with neural-search\n      def dummy_data_type = 'FLOAT32';\n      \n      def json = '{' +\n                   '\"name\":\"' + name + '\",' +\n                   '\"data_type\":\"' + dummy_data_type + '\",' +\n                   '\"shape\":' + shape + ',' +\n                   '\"data\":' + embedding +\n                   '}';\n      embedding_list.append(json);\n      if (m < result.length - 1) {\n        embedding_list.append(\",\");  \n      }\n    }\n    embedding_list.append(\"]\");  \n    return embedding_list.toString();\n    "
        }
    ]
}
```
{% include copy-curl.html %}

To ensure compatibility with OpenSearch, the `data_type` (output in the `inference_results.output.data_type` field of the response) must be set to `FLOAT32` in the post-processing function, even though the actual embedding type will be `INT8`.
{: .important}

Note the connector ID in the response; you'll use it to register the model.

Register the model, providing its connector ID:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Cohere embedding model for INT8 with search_document input type",
    "function_name": "remote",
    "description": "test model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID in the response; you'll use it in the following steps.

Test the model, providing the model ID:

```json
POST /_plugins/_ml/models/your_embedding_model_id/_predict
{
    "parameters": {
        "texts": ["hello", "goodbye"]
    }
}
```
{% include copy-curl.html %}

The response contains inference results:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "sentence_embedding",
                    "data_type": "FLOAT32",
                    "shape": [
                        1024
                    ],
                    "data": [
                        20,
                        -11,
                        -60,
                        -91,
                        ...
                    ]
                },
                {
                    "name": "sentence_embedding",
                    "data_type": "FLOAT32",
                    "shape": [
                        1024
                    ],
                    "data": [
                        58,
                        -30,
                        9,
                        -51,
                        ...
                    ]
                }
            ],
            "status_code": 200
        }
    ]
}
```

## Step 2: Ingest data

First, create an ingest pipeline:

```json
PUT /_ingest/pipeline/pipeline-cohere
{
  "description": "Cohere embedding ingest pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "your_embedding_model_id_created_in_step1",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Next, create a vector index and set the `data_type` for the `passage_embedding` field to `byte` so that it can store byte-quantized vectors:

```json
PUT my_test_data
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100,
      "default_pipeline": "pipeline-cohere"
    }
  },
  "mappings": {
    "properties": {
      "passage_text": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "data_type": "byte",
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Last, ingest test data:

```json
POST _bulk
{ "index" : { "_index" : "my_test_data" } }
{ "passage_text" : "OpenSearch is the flexible, scalable, open-source way to build solutions for data-intensive applications. Explore, enrich, and visualize your data with built-in performance, developer-friendly tools, and powerful integrations for machine learning, data processing, and more." }
{ "index" : { "_index" : "my_test_data"} }
{ "passage_text" : "BM25 is a keyword-based algorithm that performs well on queries containing keywords but fails to capture the semantic meaning of the query terms. Semantic search, unlike keyword-based search, takes into account the meaning of the query in the search context. Thus, semantic search performs well when a query requires natural language understanding." }
```
{% include copy-curl.html %}

## Step 3: Configure semantic search

Create a connector to an embedding model with the `search_query` input type:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "Cohere embedding connector with int8 embedding type for search",
    "description": "Test connector for Cohere embedding model. Use this connector for search.",
    "version": 1,
    "protocol": "http",
    "credential": {
        "cohere_key": "your_cohere_api_key"
    },
    "parameters": {
        "model": "embed-english-v3.0",
        "embedding_types": ["int8"],
        "input_type": "search_query"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}",
                "Request-Source": "unspecified:opensearch"
            },
            "url": "https://api.cohere.ai/v1/embed",
            "request_body": "{ \"model\": \"${parameters.model}\", \"texts\": ${parameters.texts}, \"input_type\":\"${parameters.input_type}\", \"embedding_types\": ${parameters.embedding_types} }",
            "pre_process_function": "connector.pre_process.cohere.embedding",
            "post_process_function": "\n    def name = \"sentence_embedding\";\n    def data_type = \"FLOAT32\";\n    def result;\n    if (params.embeddings.int8 != null) {\n      data_type = \"INT8\";\n      result = params.embeddings.int8;\n    } else if (params.embeddings.uint8 != null) {\n      data_type = \"UINT8\";\n      result = params.embeddings.uint8;\n    } else if (params.embeddings.float != null) {\n      data_type = \"FLOAT32\";\n      result = params.embeddings.float;\n    }\n    \n    if (result == null) {\n      return \"Invalid embedding result\";\n    }\n    \n    def embedding_list = new StringBuilder(\"[\");\n    \n    for (int m=0; m<result.length; m++) {\n      def embedding_size = result[m].length;\n      def embedding = new StringBuilder(\"[\");\n      def shape = [embedding_size];\n      for (int i=0; i<embedding_size; i++) {\n        def val;\n        if (\"FLOAT32\".equals(data_type)) {\n          val = result[m][i].floatValue();\n        } else if (\"INT8\".equals(data_type) || \"UINT8\".equals(data_type)) {\n          val = result[m][i].intValue();\n        }\n        embedding.append(val);\n        if (i < embedding_size - 1) {\n          embedding.append(\",\");  \n        }\n      }\n      embedding.append(\"]\");  \n      \n      // workaround for compatible with neural-search\n      def dummy_data_type = 'FLOAT32';\n      \n      def json = '{' +\n                   '\"name\":\"' + name + '\",' +\n                   '\"data_type\":\"' + dummy_data_type + '\",' +\n                   '\"shape\":' + shape + ',' +\n                   '\"data\":' + embedding +\n                   '}';\n      embedding_list.append(json);\n      if (m < result.length - 1) {\n        embedding_list.append(\",\");  \n      }\n    }\n    embedding_list.append(\"]\");  \n    return embedding_list.toString();\n    "
        }
    ]
}
```
{% include copy-curl.html %}

Note the connector ID in the response; you'll use it to register the model.

Register the model, providing its connector ID:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Cohere embedding model for INT8 with search_document input type",
    "function_name": "remote",
    "description": "test model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID in the response; you'll use it to run queries.

Run a vector search, providing the model ID:

```json
POST /my_test_data/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "semantic search",
        "model_id": "your_embedding_model_id",
        "k": 100
      }
    }
  },
  "size": "1",
  "_source": ["passage_text"]
}
```
{% include copy-curl.html %}

The response contains the query results:

```json
{
  "took": 143,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 9.345969e-7,
    "hits": [
      {
        "_index": "my_test_data",
        "_id": "_IXCuY0BJr_OiKWden7i",
        "_score": 9.345969e-7,
        "_source": {
          "passage_text": "BM25 is a keyword-based algorithm that performs well on queries containing keywords but fails to capture the semantic meaning of the query terms. Semantic search, unlike keyword-based search, takes into account the meaning of the query in the search context. Thus, semantic search performs well when a query requires natural language understanding."
        }
      }
    ]
  }
}
```