---
layout: default
title: Semantic search
parent: AI search
nav_order: 35
has_children: false
redirect_from:
  - /search-plugins/neural-text-search/
  - /search-plugins/semantic-search/
---

# Semantic search

Semantic search considers the context and intent of a query. In OpenSearch, semantic search is facilitated by text embedding models. Semantic search creates a dense vector (a list of floats) and ingests data into a vector index. 

**PREREQUISITE**<br>
Before using semantic search, you must set up a text embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
{: .note}

## Configuring semantic search

You can configure semantic search in one of two ways. In the [manual setup](#manual-setup), you configure the ingest pipeline and the index yourself, which gives you control over each component. Alternatively, you can [use a semantic field](#using-a-semantic-field), which simplifies the setup and still lets you customize some of the configuration.

## Manual setup

To manually configure semantic search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search the index](#step-4-search-the-index).

### Step 1: Create an ingest pipeline

To generate vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`text_embedding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-embedding/), which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields in which to store the embeddings.

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text embedding pipeline",
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

To split long text into passages, use the `text_chunking` ingest processor before the `text_embedding` processor. For more information, see [Text chunking]({{site.url}}{{site.baseurl}}/search-plugins/text-chunking/).

### Step 2: Create an index for ingestion

In order to use the text embedding processor defined in your pipeline, create a vector index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as a k-NN vector with a dimension that matches the model dimension. Similarly, the `passage_text` field should be mapped as `text`.

The following example request creates a vector index that is set up with a default ingest pipeline:

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

For more information about creating a vector index and its supported methods, see [Creating a vector index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

### Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

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

Before the document is ingested into the index, the ingest pipeline runs the `text_embedding` processor on the document, generating text embeddings for the `passage_text` field. The indexed document includes the `passage_text` field, which contains the original text, and the `passage_embedding` field, which contains the vector embeddings. 

### Step 4: Search the index

To perform a vector search on your index, use the `neural` query clause in a [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) query. To limit the search to documents that match a condition, use a [vector search filter]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/index/).

The following example request uses a Boolean query to combine two query clauses---a neural query and a `match` query. The `script_score` query assigns custom weights to the query clauses:

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

The response contains both documents, sorted by the combined score of the two clauses:

```json
{
  "took": 211,
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
    "max_score": 0.5848836,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.5848836,
        "_source": {
          "passage_text": "Hi planet",
          "id": "s2"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.5824303,
        "_source": {
          "passage_text": "Hello world",
          "id": "s1"
        }
      }
    ]
  }
}
```

To create the ingest pipeline and index in one step, you can use the [semantic search workflow template]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-templates/#semantic-search).
{: .tip}

### Setting a default model on an index or field

A [`neural`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) query requires a model ID for generating vector embeddings. To eliminate passing the model ID with each neural query request, you can set a default model on a vector index or a field. 

First, create a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) with a [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) request processor. To set a default model for an index, provide the model ID in the `default_model_id` parameter. To set a default model for a specific field, provide the field name and the corresponding model ID in the `neural_field_default_id` map. If you provide both `default_model_id` and `neural_field_default_id`, `neural_field_default_id` takes precedence:

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

## Using a semantic field

To manually configure semantic search using a `semantic` field, follow these steps. For more information, including about limitations when using `semantic` fields, see [Semantic field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/semantic/). 

### Step 1: Create an index with a semantic field

Create an index and specify the `model_id` in the `semantic` field. In this example, the `semantic` field is `passage_text`. OpenSearch automatically creates the corresponding embedding field based on the model configuration. An ingest pipeline is not required---OpenSearch automatically generates the embeddings using the specified model during indexing:

```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_text": {
        "type": "semantic",
        "model_id": "9kPWYJcBmp4cG9LrbAvW"
      }
    }
  }
}
```
{% include copy-curl.html %}

After creating the index, you can retrieve its mapping to verify that the embedding field was automatically created:

```json
GET /my-nlp-index/_mapping
```
{% include copy-curl.html %}

The response shows the automatically created `passage_text_semantic_info` field:

```json
{
  "my-nlp-index": {
    "mappings": {
      "properties": {
        "id": {
          "type": "text"
        },
        "passage_text": {
          "type": "semantic",
          "model_id": "9kPWYJcBmp4cG9LrbAvW",
          "raw_field_type": "text"
        },
        "passage_text_semantic_info": {
          "properties": {
            "embedding": {
              "type": "knn_vector",
              "dimension": 384,
              "method": {
                "engine": "faiss",
                "space_type": "l2",
                "name": "hnsw",
                "parameters": {}
              }
            },
            "model": {
              "properties": {
                "id": {
                  "type": "text",
                  "index": false
                },
                "name": {
                  "type": "text",
                  "index": false
                },
                "type": {
                  "type": "text",
                  "index": false
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Step 2: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

```json
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1"
}
```
{% include copy-curl.html %}

Before the document is ingested into the index, OpenSearch runs a built-in ingest pipeline that generates embeddings and stores them in the `passage_text_semantic_info.embedding` field. To verify that the embedding is generated properly, retrieve the document:

```json
GET /my-nlp-index/_doc/1
```
{% include copy-curl.html %}

The response contains the generated embedding in the `passage_text_semantic_info` field:

```json
{
  "_index": "my-nlp-index",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "passage_text": "Hello world",
    "passage_text_semantic_info": {
      "model": {
        "name": "huggingface/sentence-transformers/all-MiniLM-L6-v2",
        "id": "9kPWYJcBmp4cG9LrbAvW",
        "type": "TEXT_EMBEDDING"
      },
      "embedding": [
        -0.034477286,
        ...
      ]
    },
    "id": "s1"
  }
}
```

### Step 3: Search the index

To query the embedding of the `semantic` field, provide the `semantic` field's name (in this example, `passage_text`) and the query text. There's no need to specify the `model_id`---OpenSearch automatically retrieves it from the field's configuration in the index mapping and rewrites the query to target the underlying embedding field:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "excludes": [
      "passage_text_semantic_info"
    ]
  },
  "query": {
    "neural": {
      "passage_text": {
        "query_text": "Hi world"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took": 48,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.7564365,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.7564365,
        "_source": {
          "passage_text": "Hello world",
          "id": "s1"
        }
      }
    ]
  }
}
```

## Next steps

- To limit search results to documents that match a condition, see [Filtering vector search results]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/index/).
- To learn how to build AI search applications, explore our [semantic search tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/).
