---
layout: default
title: Neural Search plugin
nav_order: 200
has_children: false
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
---

# Neural Search plugin

The Neural Search plugin is Generally Available as of OpenSearch 2.9  
{: .note}

The OpenSearch Neural Search plugin enables the integration of machine learning (ML) language models into your search workloads. During ingestion and search, the Neural Search plugin transforms text into vectors. Then, Neural Search uses the transformed vectors in vector-based search.

The Neural Search plugin comes bundled with OpenSearch. For more information, see [Managing plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#managing-plugins).

## Ingest data with Neural Search

In order to ingest vectorized documents, you need to create a Neural Search ingest _pipeline_. An ingest pipeline consists of a series of processors that manipulate documents during ingestion, allowing the documents to be vectorized. The following API operation creates a Neural Search ingest pipeline:

```
PUT _ingest/pipeline/<pipeline_name>
```

In the pipeline request body, The `text_embedding` processor, the only processor supported by Neural Search, converts a document's text to vector embeddings. `text_embedding` uses  `field_map`s to determine what fields from which to generate vector embeddings and also which field to store the embedding. 

### Path parameter

Use `pipeline_name` to create a name for your Neural Search ingest pipeline. 

### Request fields

Field | Data type | Description
:--- | :--- | :--- 
description | string | A description of the processor.
model_id | string | The ID of the model that will be used in the embedding interface. The model must be indexed in OpenSearch before it can be used in Neural Search. For more information, see [Model Serving Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/)
input_field_name | string | The field name used to cache text for text embeddings.
output_field_name  | string | The name of the field in which output text is stored.

### Example request

Use the following example request to create a pipeline:

```
PUT _ingest/pipeline/nlp-pipeline
{
  "description": "An example neural search pipeline",
  "processors" : [
    {
      "text_embedding": {
        "model_id": "bxoDJ7IHGM14UqatWc_2j",
        "field_map": {
           "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```

### Example response

OpenSearch responds with an acknowledgment of the pipeline's creation.

```json
PUT _ingest/pipeline/nlp-pipeline
{
  "acknowledged" : true
}
```

## Create an index for ingestion

In order to use the text embedding processor defined in your pipelines, create an index with mapping data that aligns with the maps specified in your pipeline. For example, the `output_fields` defined in the `field_map` field of your processor request must map to the k-NN vector fields with a dimension that matches the model. Similarly, the `text_fields` defined in your processor should map to the `text_fields` in your index.

### Example request

The following example request creates an index that attaches to a Neural Search ingest pipeline. Because the index maps to k-NN vector fields, the index setting field `index-knn` is set to `true`. Furthermore, `mapping` settings use [k-NN method definitions]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#method-definitions) to match the maps defined in the Neural Search ingest pipeline.

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

OpenSearch responds with information about your new index:

```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "my-nlp-index-1"
}
```

## Ingest documents into Neural Search

Document ingestion is managed by OpenSearch's [Ingest API]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/), similarly to other OpenSearch indexes. For example, you can ingest a document that contains the `passage_text: "Hello world"` with a simple POST method:

```json
POST /my-nlp-index-1/_doc
{
   "passage_text": "Hello world"
}
```

With the text_embedding processor in place through a Neural Search ingest pipeline, the example indexes "Hello world" as a `text_field` and converts "Hello world" into an associated k-NN vector field. 

## Search a neural index 

If you want to use a language model to convert a text query into a k-NN vector query, use the `neural` query fields in your query. The neural query request fields can be used in both the [k-NN plugin API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api/#search-model) and [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/). Furthermore, you can use a [k-NN search filter]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/) to refine your neural search query.



### Neural request fields

Include the following request fields under the `neural` field in your query:

Field | Data type | Description
:--- | :--- | :--- 
vector_field | string | The vector field against which to run a search query.
query_text | string | The query text from which to produce queries.
model_id | string | The ID of the model that will be used in the embedding interface. The model must be indexed in OpenSearch before it can be used in Neural Search.
k | integer | The number of results the k-NN search returns.


### Example request

The following example request uses a search query that returns vectors for the "Hello World" query text:


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




