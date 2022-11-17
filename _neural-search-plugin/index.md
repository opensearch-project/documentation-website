---
layout: default
title: Neural Search plugin
nav_order: 1
has_children: false
has_toc: false
---

The Neural Search plugin is an experimental feature. For updates on the progress of the Neural Search plugin, or if you want to leave feedback that could help improve the feature, join the discussion in the [Neural Search forum](https://forum.opensearch.org/t/feedback-neural-search-plugin-experimental-release/11501).    
{: .warning}

The OpenSearch Neural Search plugin enables the integration of Machine Learning (ML) language models into user's search workloads. During ingestion and search, the Neural Search plugin transforms text into vectors. Then, Neural Search uses the transformed vectors in vector-based search."

The Neural Search plugin comes bundled with OpenSearch. For more information, see [Managing plugins](({{site.url}}{{site.baseurl}}/opensearch/install/plugins#managing-plugins)).

## Ingest data with Neural Search

In order to ingest vectorized documents, you need to create a Neural Search _pipeline_. A pipeline consists of a series of processors that manipulate documents during ingestion, allowing the documents to be vectorized. The following API operation creates a Neural Search pipeline:

```
PUT _ingest/pipeline/<pipeline_name>
```

In the pipeline request body, The `text_embedding` processor, the only processor supported by Neural Search, converts a document's text to vector embeddings. `text_embedding` uses a `field_map` to know what fields from which to generate vector embeddings and also what field to store the embedding. 

### Path parameter

Use `pipeline_name` to create a name for your Neural Search pipeline. 

### Request fields

Field | Data Type | Description
:--- | :--- | :--- 
description | string | A description of the processor.
model_id | string | The ID of the model that will be used in the embedding interface. Model must be indexed in OpenSearch before it can be used in Neural Search. For more information, see [Model Serving Framework]
input_field_name | string | The field name used to cache text for text embeddings.
output_field_name  | string | The field name where the output text is stored.

### Example Request

Use the following example request to create a pipeline.

```json
PUT _ingest/pipeline/nlp-pipeline
{
  "description": "An example neural search pipeline",
  "processors" : [
    {
      "text_embedding": {
        "model_id": "bxoDJ7IHGM14UqatWc_2j",
        "field_map": {
           "text": "text_knn"
        }
      }
    }
  ]
}
```

## Example response

```json
PUT _ingest/pipeline/nlp-pipeline
{
  "acknowledged" : true
}
```

## Create an index for ingestion

In order to use the text embedding processor defined in pipelines, create an index with mapping data that aligns with the maps specified in your pipeline. For example, `output_fields` defined in the `field_map` field of your processor request must map to the k-NN vector fields with a dimension that matches the model. Similarly, `text_fields` defined in your processor should map to `text_fields` in your index.

### Example request

The following example creates an index that attaches to a Neural Search pipeline. Since the index maps to K-NN vector fields, the index setting field `index-knn` is set to `true`. Furthermore, `mapping` settings use [K-NN method definitions](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to match the maps defined in the Neural Search pipeline.

```json
PUT /my-nlp-index-1
{
    "settings": {
        "index.knn": true,
        "default_pipeline": "<pipeline_name>"
    },
    "mappings": {
        "properties": {
            "passage_embedding": {
                "type": "knn_vector",
                "dimension": int,
                "method": {
                    "name": "string",
                    "space_type": "string",
                    "engine": "string",
                    "parameters": json_object
                }
            },
            "passage_text": { 
                "type": "text"            
            },
        }
    }
}
```

### Example response

```json
PUT /my-nlp-index-1
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "my-nlp-index-1"
}
```

## Ingest documents into the Neural Search

Document ingestion occurs with OpenSearch's [Ingest API](https://opensearch.org/docs/latest/api-reference/ingest-apis/index/), similar to other OpenSearch indexes. For example, you can ingest a document that contains the `passage_text: "Hello world"` with a simple POST method.

```json
POST /my-nlp-index-1/_doc
{
   "passage_text": "Hello world"
}
```

With the text_embedding processor in place through a Neural Search pipeline, the above example indexes "Hello world" as a `text_field` and converts "Hello world" into an associated k-NN vector field. 

## Search a Neural index 

If you want to use a language model to convert a text query to k-NN vector query, use the Neural query type in your query. The Neural query request fields can be used in both the [Search API](https://opensearch.org/docs/latest/search-plugins/knn/api/#search-model) and [Query DSL](https://opensearch.org/docs/latest/opensearch/query-dsl/index/). 

### Neural request fields

Field | Data Type | Description
:--- | :--- | :--- 
vector_field | string | The vector field to execute a search query against.
query_text | string | Query text from which to produce queries.
model_id | string | The ID of the model that will be used in the embedding interface. Model must be indexed in OpenSearch before it can be used in Neural Search.
k | integer | Number of results the k-NN search returns.


### Example request

The following example uses a search query that returns vectors against a "Hello World" query:


```json
GET my_index/_search
{
  "query": {
    "bool" : {
      "filter": {
        "range": {
          "distance": { "lte" : 20 }
        }
      },
      "should" : [
        {
          "script_score": {
            "query": {
              "neural": {
                "passage_vector": {
                  "query_text": "Hello world",
                  "model_id": "xzy76xswsd",
                  "k": 100
                }
              }
            },
            "script": {
              "source": "_score * 1.5"
            }
          }
        }
        ,
        {
          "script_score": {
            "query": {
              "match": { "passage_text": "Hello world" }
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




