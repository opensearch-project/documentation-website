---
layout: default
title: Neural search
nav_order: 200
has_children: false
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
---

# Neural search

Neural search transforms text into vectors and facilitates vector search both at ingestion time and at search time. During ingestion, neural search transforms document text into vector embeddings and indexes both the text and its vector embeddings in a k-NN index. When you use a neural query during search, neural search converts the query text into vector embeddings, uses vector search to compare the query and document embeddings, and returns the closest results.

The Neural Search plugin comes bundled with OpenSearch and is generally available as of OpenSearch 2.9. For more information, see [Managing plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#managing-plugins).

## Using neural search

To use neural search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search the index using neural search](#step-4-search-the-index-using-neural-search).

## Step 1: Create an ingest pipeline

To generate vector embeddings for text fields, you need to create a neural search [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/). An ingest pipeline consists of a series of processors that manipulate documents during ingestion, allowing the documents to be vectorized. 

### Path and HTTP method

The following API operation creates a neural search ingest pipeline:

```json
PUT _ingest/pipeline/<pipeline_name>
```

### Path parameter

Use `pipeline_name` to create a name for your neural search ingest pipeline. 

### Request fields

In the pipeline request body, you must set up a `text_embedding` processor, the only processor supported by neural search, which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields into which to store the embeddings:

```json
"text_embedding": {
  "model_id": "<model_id>",
  "field_map": {
      "<input_field>": "<vector_field>"
  }
}
```

The following table lists the `text_embedding` processor request fields.

Field | Data type | Description
:--- | :--- | :--- 
`model_id` | String | The ID of the model that will be used to generate the embeddings. The model must be indexed in OpenSearch before it can be used in neural search. For more information, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).
`field_map.<input_field>` | String | The name of the field from which to obtain text for generating text embeddings.
`field_map.<vector_field>`  | String | The name of the vector field in which to store the generated text embeddings.

### Example request

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "An NLP ingest pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "bQ1J8ooBpBj3wT4HVUsb",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 2: Create an index for ingestion

In order to use the text embedding processor defined in your pipelines, create a k-NN index with mapping data that aligns with the maps specified in your pipeline. For example, the `<vector_field>` defined in the `field_map` of your processor must be mapped as a k-NN vector field with a dimension that matches the model dimension. Similarly, the `<input_field>` defined in your processor should be mapped as `text` in your index.

### Example request

The following example request creates a k-NN index that is set up with a default ingest pipeline:

```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline"
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 768,
        "method": {
          "engine": "lucene",
          "space_type": "l2",
          "name": "hnsw",
          "parameters": {}
        }
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about creating a k-NN index and the methods it supports, see [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

## Step 3: Ingest documents into the index

To ingest documents into the index created in the previous section, send a POST request for each document:

```json
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/2
{
  "passage_text": "Hi planet",
  "id": "s2"
}
```
{% include copy-curl.html %}

Before the document is ingested into the index, the ingest pipeline runs the `text_embedding` processor on the document, generating text embeddings for the `passage_text` field. The indexed document contains the `passage_text` field that has the original text and the `passage_embedding` field that has the vector embeddings. 

## Step 4: Search the index using neural search

To perform vector search on your index, use the `neural` query clause either in the [k-NN plugin API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api/#search-model) or [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries. You can refine the results by using a [k-NN search filter]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).

### Neural query request fields

Include the following request fields under the `neural` query clause:

```json
"neural": {
  "<vector_field>": {
    "query_text": "<query_text>",
    "model_id": "<model_id>",
    "k": 100
  }
}
```

The top-level `vector_field` specifies the vector field against which to run a search query. The following table lists the other neural query fields.

Field | Data type | Description
:--- | :--- | :--- 
`query_text` | String | The query text from which to generate text embeddings.
`model_id` | String | The ID of the model that will be used to generate text embeddings from the query text. The model must be indexed in OpenSearch before it can be used in neural search.
`k` | Integer | The number of results the k-NN search returns.

### Example request

The following example request uses a Boolean query to combine a filter clause and two query clauses---a neural query and a `match` query. The `script_score` query assigns custom weights to the query clauses:

```json
GET /my-nlp-index/_search
{
    "_source": {
    "excludes": [
      "passage_embedding"
    ]
  },
  "query": {
    "bool": {
      "filter": {
         "wildcard":  { "id": "*1" }
      },
      "should": [
        {
          "script_score": {
            "query": {
              "neural": {
                "passage_embedding": {
                  "query_text": "Hi world",
                  "model_id": "bQ1J8ooBpBj3wT4HVUsb",
                  "k": 100
                }
              }
            },
            "script": {
              "source": "_score * 1.5"
            }
          }
        },
        {
          "script_score": {
            "query": {
              "match": {
                "passage_text": "Hi world"
              }
            },
            "script": {
              "source": "_score * 1.7"
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took" : 36,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.2251667,
    "hits" : [
      {
        "_index" : "my-nlp-index",
        "_id" : "1",
        "_score" : 1.2251667,
        "_source" : {
          "passage_text" : "Hello world",
          "id" : "s1"
        }
      }
    ]
  }
}
```

### Setting a default model on an index or field

To eliminate passing the model ID with each neural query request, you can set a default model on a k-NN index or a field. 

First, create a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) with a [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) request processor. To set a default model on an index, provide the model ID in the `default_model_id` parameter. To set a default model on a specific field, provide the field name and the corresponding model ID in the `neural_field_default_id` map. If you provide both `default_model_id` and `neural_field_default_id`, `neural_field_default_id` takes precedence:

```json
PUT /_search/pipeline/default_model_pipeline 
{
  "request_processors": [
    {
      "neural_query_enricher" : {
        "default_model_id": "bQ1J8ooBpBj3wT4HVUsb",
        "neural_field_default_id": {
           "my_field_1": "uZj0qYoBMtvQlfhaYeud",
           "my_field_2": "upj0qYoBMtvQlfhaZOuM"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then set the default model for your index:

```json
PUT /my-nlp-index/_settings
{
  "index.search.default_pipeline" : "default_model_pipeline"
}
```
{% include copy-curl.html %}

You can now omit the model ID when searching:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "excludes": [
      "passage_embedding"
    ]
  },
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "k": 100
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took" : 41,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.22762,
    "hits" : [
      {
        "_index" : "my-nlp-index",
        "_id" : "2",
        "_score" : 1.22762,
        "_source" : {
          "passage_text" : "Hi planet",
          "id" : "s2"
        }
      },
      {
        "_index" : "my-nlp-index",
        "_id" : "1",
        "_score" : 1.2251667,
        "_source" : {
          "passage_text" : "Hello world",
          "id" : "s1"
        }
      }
    ]
  }
}
```