---
layout: default
title: Generating sparse vector embeddings automatically
parent: Neural sparse search
grand_parent: AI search
nav_order: 10
has_children: false
redirect_from:
  - /search-plugins/neural-sparse-with-pipelines/
---

# Generating sparse vector embeddings automatically

Generating sparse vector embeddings automatically enables neural sparse search to function like lexical search. To take advantage of this encapsulation, set up an ingest pipeline to create and store sparse vector embeddings from document text during ingestion. At query time, input plain text, which will be automatically converted into vector embeddings for search.

For this tutorial, you'll use neural sparse search with OpenSearch's built-in machine learning (ML) model hosting and ingest pipelines. Because the transformation of text to embeddings is performed within OpenSearch, you'll use text when ingesting and searching documents. 

At ingestion time, neural sparse search uses a sparse encoding model to generate sparse vector embeddings from text fields. 

At query time, neural sparse search operates in one of two search modes: 

- **Bi-encoder mode** (requires a sparse encoding model): A sparse encoding model generates sparse vector embeddings from both documents and query text. This approach provides better search relevance at the cost of an increase in latency. 

- **Doc-only mode** (requires a sparse encoding model and a tokenizer): A sparse encoding model generates sparse vector embeddings from documents. In this mode, neural sparse search tokenizes query text using a tokenizer and obtains the token weights from a lookup table. This approach provides faster retrieval at the cost of a slight decrease in search relevance. The tokenizer is deployed and invoked using the [Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/) for a uniform neural sparse search experience.

For more information about choosing the neural sparse search mode that best suits your workload, see [Choose the search mode](#step-1a-choose-the-search-mode).

## Tutorial

This tutorial consists of the following steps:

1. [**Configure a sparse encoding model/tokenizer**](#step-1-configure-a-sparse-encoding-modeltokenizer).
    1. [Choose the search mode](#step-1a-choose-the-search-mode)
    1. [Register the model/tokenizer](#step-1b-register-the-modeltokenizer)
    1. [Deploy the model/tokenizer](#step-1c-deploy-the-modeltokenizer)
1. [**Ingest data**](#step-2-ingest-data)
    1. [Create an ingest pipeline](#step-2a-create-an-ingest-pipeline)
    1. [Create an index for ingestion](#step-2b-create-an-index-for-ingestion)
    1. [Ingest documents into the index](#step-2c-ingest-documents-into-the-index)
1. [**Search the data**](#step-3-search-the-data)

### Prerequisites

Before you start, complete the [prerequisites]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/#prerequisites). 

## Step 1: Configure a sparse encoding model/tokenizer

Both the bi-encoder and doc-only search modes require you to configure a sparse encoding model. Doc-only mode requires you to configure a tokenizer in addition to the model.

### Step 1(a): Choose the search mode

Choose the search mode and the appropriate model/tokenizer combination:

- **Bi-encoder**: Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill` model during both ingestion and search. 

- **Doc-only**: Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` model during ingestion and the `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` tokenizer during search.

The following tables provide a search relevance comparison for all available combinations of the two search modes so that you can choose the best combination for your use case.

**For English:**

| Mode      | Ingestion model                                               | Search model                                                  | Avg search relevance on BEIR | Model parameters |
|-----------|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|------------------|
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.49                         | 133M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-distill` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.504                         | 67M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-mini` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.497                         | 23M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.517                         | 67M             |
| Bi-encoder| `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1`     | `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1`     | 0.524                        | 133M             |
| Bi-encoder| `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill`     | `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill`     | 0.528                        | 67M             |

**For Multilingual:**

| Mode      | Ingestion model                                               | Search model                                                  | Avg search relevance on MIRACL | Model parameters |
|-----------|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|------------------|
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-multilingual-v1` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-multilingual-v1`    | 0.629                         | 168M             |

### Step 1(b): Register the model/tokenizer

When you register a model/tokenizer, OpenSearch creates a model group for the model/tokenizer. You can also explicitly create a model group before registering models. For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

#### Bi-encoder mode

When using bi-encoder mode, you only need to register the `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill` model.

Register the sparse encoding model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch returns a task ID for every model you register:

```json
{
  "task_id": "aFeif4oB5Vm0Tdw8yoN7",
  "status": "CREATED"
}
```

You can check the status of the task by calling the Tasks API:

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```
{% include copy-curl.html %}

Once the task is complete, the task state will change to `COMPLETED` and the Tasks API response will contain the model ID of the registered model:

```json
{
  "model_id": "<bi-encoder model ID>",
  "task_type": "REGISTER_MODEL",
  "function_name": "SPARSE_ENCODING",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

Note the `model_id` of the model you've created; you'll need it for the following steps.

#### Doc-only mode

When using doc-only mode, you need to register the `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` model, which you'll use at ingestion time, and the `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` tokenizer, which you'll use at search time.

Register the sparse encoding model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Register the tokenizer:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1",
  "version": "1.0.1",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Like in the bi-encoder mode, use the Tasks API to check the status of the registration task. After the Tasks API returns the task state as `COMPLETED`. Note the `model_id` of the model and the tokenizer you've created; you'll need them for the following steps.

### Step 1(c): Deploy the model/tokenizer

Next, you'll need to deploy the model/tokenizer you registered. Deploying a model creates a model instance and caches the model in memory. 

#### Bi-encoder mode

To deploy the model, provide its model ID to the `_deploy` endpoint:

```json
POST /_plugins/_ml/models/<bi-encoder model ID>/_deploy
```
{% include copy-curl.html %}

As with the register operation, the deploy operation is asynchronous, so you'll get a task ID in the response:

```json
{
  "task_id": "ale6f4oB5Vm0Tdw8NINO",
  "status": "CREATED"
}
```

You can check the status of the task by using the Tasks API:

```json
GET /_plugins/_ml/tasks/ale6f4oB5Vm0Tdw8NINO
```
{% include copy-curl.html %}

Once the task is complete, the task state will change to `COMPLETED`:

```json
{
  "model_id": "<bi-encoder model ID>",
  "task_type": "DEPLOY_MODEL",
  "function_name": "SPARSE_ENCODING",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694360024141,
  "last_update_time": 1694360027940,
  "is_async": true
}
```

#### Doc-only mode

To deploy the model, provide its model ID to the `_deploy` endpoint:

```json
POST /_plugins/_ml/models/<doc-only model ID>/_deploy
```
{% include copy-curl.html %}

You can deploy the tokenizer in the same way:

```json
POST /_plugins/_ml/models/<tokenizer ID>/_deploy
```
{% include copy-curl.html %}

As with bi-encoder mode, you can check the status of both deploy tasks by using the Tasks API. Once the task is complete, the task state will change to `COMPLETED`.

## Step 2: Ingest data 

In both the bi-encoder and doc-only modes, you'll use a sparse encoding model at ingestion time to generate sparse vector embeddings.

### Step 2(a): Create an ingest pipeline

To generate sparse vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`sparse_encoding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/sparse-encoding/), which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields in which to store the embeddings.

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into sparse vector embeddings, which will be stored in `passage_embedding`. Provide the model ID of the registered model in the request:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline-sparse
{
  "description": "An sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "<bi-encoder or doc-only model ID>",
        "prune_type": "max_ratio",
        "prune_ratio": 0.1,
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

To split long text into passages, use the `text_chunking` ingest processor before the `sparse_encoding` processor. For more information, see [Text chunking]({{site.url}}{{site.baseurl}}/search-plugins/text-chunking/).

### Step 2(b): Create an index for ingestion

In order to use the sparse encoding processor defined in your pipeline, create a rank features index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as [`rank_features`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/#rank-features). Similarly, the `passage_text` field must be mapped as `text`.

The following example request creates a rank features index configured with a default ingest pipeline:

```json
PUT /my-nlp-index
{
  "settings": {
    "default_pipeline": "nlp-ingest-pipeline-sparse"
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "rank_features"
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

To save disk space, you can exclude the embedding vector from the source as follows:

```json
PUT /my-nlp-index
{
  "settings": {
    "default_pipeline": "nlp-ingest-pipeline-sparse"
  },
  "mappings": {
    "_source": {
      "excludes": [
        "passage_embedding"
      ]
    },
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "rank_features"
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Once the `<token, weight>` pairs are excluded from the source, they cannot be recovered. Before applying this optimization, make sure you don't need the  `<token, weight>` pairs for your application.
{: .important}

### Step 2(c): Ingest documents into the index

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

Before the document is ingested into the index, the ingest pipeline runs the `sparse_encoding` processor on the document, generating vector embeddings for the `passage_text` field. The indexed document includes the `passage_text` field, which contains the original text, and the `passage_embedding` field, which contains the vector embeddings. 

## Step 3: Search the data

To perform a neural sparse search on your index, use the `neural_sparse` query clause in [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries. 

The following example request uses a `neural_sparse` query to search for relevant documents using a raw text query. Provide the model ID for bi-encoder mode or the tokenizer ID for doc-only mode:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "<bi-encoder or tokenizer ID>"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents:

```json
{
  "took" : 688,
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
    "max_score" : 30.0029,
    "hits" : [
      {
        "_index" : "my-nlp-index",
        "_id" : "1",
        "_score" : 30.0029,
        "_source" : {
          "passage_text" : "Hello world",
          "passage_embedding" : {
            "!" : 0.8708904,
            "door" : 0.8587369,
            "hi" : 2.3929274,
            "worlds" : 2.7839446,
            "yes" : 0.75845814,
            "##world" : 2.5432441,
            "born" : 0.2682308,
            "nothing" : 0.8625516,
            "goodbye" : 0.17146169,
            "greeting" : 0.96817183,
            "birth" : 1.2788506,
            "come" : 0.1623208,
            "global" : 0.4371151,
            "it" : 0.42951578,
            "life" : 1.5750692,
            "thanks" : 0.26481047,
            "world" : 4.7300377,
            "tiny" : 0.5462298,
            "earth" : 2.6555297,
            "universe" : 2.0308156,
            "worldwide" : 1.3903781,
            "hello" : 6.696973,
            "so" : 0.20279501,
            "?" : 0.67785245
          },
          "id" : "s1"
        }
      },
      {
        "_index" : "my-nlp-index",
        "_id" : "2",
        "_score" : 16.480486,
        "_source" : {
          "passage_text" : "Hi planet",
          "passage_embedding" : {
            "hi" : 4.338913,
            "planets" : 2.7755864,
            "planet" : 5.0969057,
            "mars" : 1.7405145,
            "earth" : 2.6087382,
            "hello" : 3.3210192
          },
          "id" : "s2"
        }
      }
    ]
  }
}
```

To minimize disk and network I/O latency related to sparse embedding sources, you can exclude the embedding vector source from the query as follows:

```json
GET my-nlp-index/_search
{
  "_source": {
    "excludes": [
      "passage_embedding"
    ]
  },
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "<bi-encoder or tokenizer ID>"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Using a semantic field

Using a `semantic` field simplifies neural sparse search configuration. To use a `semantic` field, follow these steps. For more information, see [Semantic field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/semantic/).

### Step 1: Register and deploya sparse encoding model

First, register and deploy a sparse encoding model as described in [Step 1](#step-1-configure-a-sparse-encoding-modeltokenizer).

## Step 2: Create an index with a semantic field for ingestion

The sparse encoding model configured in the previous step is used at ingestion time to generate sparse vector embeddings. When using a `semantic` field, set the `model_id` to the ID of the model used for ingestion. For doc-only mode, you can additionally specify the model to be used at query time by providing its ID in the `search_model_id` field.

The following example shows how to create an index with a `semantic` field configured in the doc-only mode using a sparse encoding model. To enable automatic splitting of long text into smaller passages, set `chunking` to `true` in the semantic field configuration:

```json
PUT /my-nlp-index
{
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_text": {
        "type": "semantic",
         "model_id": "_kPwYJcBmp4cG9LrUQsE",
         "search_model_id": "AUPwYJcBmp4cG9LrmQy8",
         "chunking": true
      }
    }
  }
}
```
{% include copy-curl.html %}

After creating the index, you can retrieve its mapping to verify that the embedding field was automatically created:

```json
GET /my-nlp-index/_mapping
{
   "my-nlp-index": {
      "mappings": {
         "properties": {
            "id": {
               "type": "text"
            },
            "passage_text": {
               "type": "semantic",
               "model_id": "_kPwYJcBmp4cG9LrUQsE",
               "search_model_id": "AUPwYJcBmp4cG9LrmQy8",
               "raw_field_type": "text",
               "chunking": true
            },
            "passage_text_semantic_info": {
               "properties": {
                  "chunks": {
                     "type": "nested",
                     "properties": {
                        "embedding": {
                           "type": "rank_features"
                        },
                        "text": {
                           "type": "text"
                        }
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
{% include copy-curl.html %}

An object field named `passage_text_semantic_info` is automatically created. It includes a `ran_features` subfield to store the embedding, along with additional text fields to capture model metadata.

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

Before a document is ingested into the index, OpenSearch automatically chunks the text and generates sparse vector embeddings for each chunk. To verify that the embedding is generated properly, you can run a search request to retrieve the document:

```json
GET /my-nlp-index/_doc/1
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
         "chunks": [
            {
               "text": "Hello world",
               "embedding": {
                  "hi": 0.5843902,
                  ...
               }
            }
         ],
         "model": {
            "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill",
            "id": "_kPwYJcBmp4cG9LrUQsE",
            "type": "SPARSE_ENCODING"
         }
      },
      "id": "s1"
   }
}
```
{% include copy-curl.html %}

## Step 3: Search the data

To search the embeddings of the semantic field, use the `neural` query clause in [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries.

The following example uses a `neural` query to search for relevant documents using text input. You only need to specify the `semantic` field name---OpenSearch automatically rewrites the query and applies it to the underlying embedding field, appropriately handling any nested objects. There's no need to provide the `model_id` in the query, because OpenSearch retrieves it from the semantic field's configuration in the index mapping:

```json
GET my-nlp-index/_search
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

The response contains the matching documents:

```json
{
   "took": 19,
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
      "max_score": 6.437132,
      "hits": [
         {
            "_index": "my-nlp-index",
            "_id": "1",
            "_score": 6.437132,
            "_source": {
               "passage_text": "Hello world",
               "id": "s1"
            }
         },
         {
            "_index": "my-nlp-index",
            "_id": "2",
            "_score": 5.063226,
            "_source": {
               "passage_text": "Hi planet",
               "id": "s2"
            }
         }
      ]
   }
}
```

Alternatively, you can use a built-in analyzer to tokenize the query text:

```json
GET my-nlp-index/_search
{
   "_source": {
      "excludes": [
         "passage_text_semantic_info"
      ]
   },
   "query": {
      "neural": {
         "passage_text": {
            "query_text": "Hi world",
            "semantic_field_search_analyzer": "bert-uncased"
         }
      }
   }
}
```
{% include copy-curl.html %}

To simplify the query further, you can define the `semantic_field_search_analyzer` in the `semantic` field configuration. This allows you to omit the analyzer from the query itself because OpenSearch automatically applies the configured analyzer during search.

## Accelerating neural sparse search

To learn more about improving retrieval time for neural sparse search, see [Accelerating neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/#accelerating-neural-sparse-search).

If you're using `semantic` fields with a `neural` query, query acceleration is currently **not supported**. You can achieve acceleration by running a `neural_sparse` query directly against the underlying `rank_features` field.
{: .note}

## Creating a search pipeline for neural sparse search

You can create a search pipeline that augments neural sparse search functionality by:

- Accelerating neural sparse search for faster retrieval.
- Setting the default model ID on an index for easier use. 

To configure the pipeline, add a [`neural_sparse_two_phase_processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/) or a [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) processor. The following request creates a pipeline with both processors:

```json
PUT /_search/pipeline/neural_search_pipeline
{
  "request_processors": [
    {
      "neural_sparse_two_phase_processor": {
        "tag": "neural-sparse",
        "description": "Creates a two-phase processor for neural sparse search."
      }
    },
    {
      "neural_query_enricher" : {
        "default_model_id": "<bi-encoder model/tokenizer ID>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then set the default pipeline for your index to the newly created search pipeline:

```json
PUT /my-nlp-index/_settings 
{
  "index.search.default_pipeline" : "neural_search_pipeline"
}
```
{% include copy-curl.html %}

For more information about setting a default model on an index, or to learn how to set a default model on a specific field, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/#setting-a-default-model-on-an-index-or-field).

## Troubleshooting

This section contains information about resolving common issues encountered while running neural sparse search.

### Remote connector throttling exceptions

When using connectors to call a remote service such as Amazon SageMaker, ingestion and search calls sometimes fail because of remote connector throttling exceptions. 

For OpenSearch versions earlier than 2.15, a throttling exception will be returned as an error from the remote service:

```json
{
  "type": "status_exception",
  "reason": "Error from remote service: {\"message\":null}"
}
```

To mitigate throttling exceptions, decrease the maximum number of connections specified in the `max_connection` setting in the connector's [`client_config`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters) object. Doing so will prevent the maximum number of concurrent connections from exceeding the threshold of the remote service. You can also modify the retry settings to avoid a request spike during ingestion.

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 
