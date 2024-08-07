---
layout: default
title: Neural sparse search
nav_order: 50
has_children: false
redirect_from:
  - /search-plugins/neural-sparse-search/
  - /search-plugins/sparse-search/
---

# Neural sparse search
Introduced 2.11
{: .label .label-purple }

[Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) relies on dense retrieval that is based on text embedding models. However, dense methods use k-NN search, which consumes a large amount of memory and CPU resources. An alternative to semantic search, neural sparse search is implemented using an inverted index and is thus as efficient as BM25. Neural sparse search is facilitated by sparse embedding models. When you perform a neural sparse search, it creates a sparse vector (a list of `token: weight` key-value pairs representing an entry and its weight) and ingests data into a rank features index.

Neural sparse search can also be combined with dense [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) to further boost the search relevance using [hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/).

## Tutorial overview

The tutorials include using neural sparse search with OpenSearch built-in pipelines and using neural sparse search with raw sparse vectors. You can follow the tutorials using your command line or the OpenSearch Dashboards [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/run-queries/).

### Using neural sparse search with OpenSearch built-in pipelines
For this tutorial, you'll use neural sparse search with OpenSearch's built-in ML model hosting and internal pipelines. The ingestion and search processes are conducted using raw text. This tutorial consists of the following steps:

1. [**Set up an ML sparse encoding model**](#step-1-set-up-an-ml-sparse-encoding-model).
    1. [Choose a sparse encoding model](#step-1a-choose-a-sparse-encoding-model).
    1. [Register a model group](#step-1b-register-a-model-group).
    1. [Register the model/tokenizer to the model group](#step-1c-register-the-modeltokenizer-to-the-model-group).
    1. [Deploy the model/tokenizer](#step-1d-deploy-the-modeltokenizer).
1. [**Ingest data with neural sparse search**](#step-2-ingest-data-with-neural-sparse-search).
    1. [Create an ingest pipeline](#step-2a-create-an-ingest-pipeline).
    1. [Create an index with the ingest pipeline](#step-2b-create-an-index-with-the-ingest-pipeline).
    1. [Ingest documents into the index](#step-2c-ingest-documents-into-the-index).
1. [**Search the data using raw text**](#step-3-search-the-data-using-raw-text).
1. _Optional_ [**Set up search processors for neural sparse search**](#step-4-set-up-search-processors-for-neural-sparse-search-optional).
    1. [Create and enable the two-phase processor for search speed up](#step-4a-create-and-enable-the-two-phase-processor-for-search-speed-up)
    1. [Setting a default model on an index or field](#step-4b-setting-a-default-model-on-an-index-or-field)

### Using neural sparse search with raw sparse vectors

If you're using self-hosted sparse embedding models, neural sparse search supports ingestion and search using raw sparse vectors. This tutorial consists of the following steps:

1. [**Ingest data with neural sparse search**](#step-1-ingest-data-with-neural-sparse-search).
    1. [Create an index](#step-1a-create-an-index).
    1. [Ingest documents into the index](#step-1b-ingest-documents-into-the-index).
1. [**Search the data using raw sparse vector**](#step-2-search-the-data-using-raw-sparse-vector).
1. _Optional_ [**Set up search processors for neural sparse search**](#step-3-set-up-search-processors-for-neural-sparse-search-optional).
    1. [Create and enable the two-phase processor for search speed up](#step-3a-create-and-enable-the-two-phase-processor-for-search-speed-up)

## Tutorial for using neural sparse search with OpenSearch built-in pipelines

## Step 1: Set up an ML sparse encoding model

Neural sparse search requires a sparse encoding model to generate sparse vector embeddings from text fields during ingestion. At query time, it operates in two modes: doc-only and bi-encoder. In the **doc-only mode**, neural sparse search only tokenizes queries and retrieves their weights from a lookup table, **balancing search relevance and efficiency**. In the **bi-encoder mode**, a sparse encoding model generates sparse vector embeddings for queries, **providing extreme search relevance**. When selecting a model, first choose the working mode that best suits your workload.

In the doc-only mode, tokenization does not involve model inference; however, a tokenizer is still deployed and invoked using the ML Commons Model API for a more streamlined experience.

### Prerequisites

For this simple setup, you'll use an OpenSearch-provided machine learning (ML) model and a cluster with no dedicated ML nodes. To ensure that this basic local setup works, send the following request to update ML-related cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins": {
      "ml_commons": {
        "only_run_on_ml_node": "false",
        "model_access_control_enabled": "true",
        "native_memory_threshold": "99"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Advanced

For a [custom local model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/) setup, note the following requirements:

- To register a custom local model, you need to specify an additional `"allow_registering_model_via_url": "true"` cluster setting. 
- In production, it's best practice to separate the workloads by having dedicated ML nodes. On clusters with dedicated ML nodes, specify `"only_run_on_ml_node": "true"` for improved performance. 

### Step 1(a): Choose a sparse encoding model

For this tutorial, you'll use the pretrained sparse encoding models provided by OpenSearch. You'll need the model's name and version to register it. You can find this information in the [pretrained model table]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sparse-encoding-models). To select the appropriate models during ingestion and search, OpenSearch offers the following combinations:

| Mode      | Ingestion model                                               | Search model                                                  | Avg search relevance on BEIR | Model parameters |
|-----------|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|------------------|
| doc-only  | amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1 | amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1    | 0.49                         | 133M             |
| bi-encoder| amazon/neural-sparse/opensearch-neural-sparse-encoding-v1     | amazon/neural-sparse/opensearch-neural-sparse-encoding-v1     | 0.524                        | 133M             |

For information about choosing a model, see [Further reading](#further-reading).

### Step 1(b): Register a model group

For access control, models are organized into model groups (collections of versions of a particular model). Each model group name in the cluster must be globally unique. Registering a model group ensures the uniqueness of the model group name.

If you are registering the first version of a model without first registering the model group, a new model group is created automatically. For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
{: .tip}

To register a model group with the access mode set to `public`, send the following request:

```json
POST /_plugins/_ml/model_groups/_register
{
  "name": "NLP_model_group",
  "description": "A model group for NLP models",
  "access_mode": "public"
}
```
{% include copy-curl.html %}

OpenSearch sends back the model group ID:

```json
{
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "status": "CREATED"
}
```

You'll use this ID to register the chosen model to the model group.

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Search for the newly created model group by providing its model group ID in the request:

```json
POST /_plugins/_ml/model_groups/_search
{
  "query": {
    "match": {
      "_id": "Z1eQf4oB5Vm0Tdw8EIP2"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the model group:

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-ml-model-group",
        "_id": "Z1eQf4oB5Vm0Tdw8EIP2",
        "_version": 1,
        "_seq_no": 14,
        "_primary_term": 2,
        "_score": 1,
        "_source": {
          "created_time": 1694357262582,
          "access": "public",
          "latest_version": 0,
          "last_updated_time": 1694357262582,
          "name": "NLP_model_group",
          "description": "A model group for NLP models"
        }
      }
    ]
  }
}
```
</details>


### Step 1(c): Register the model/tokenizer to the model group

To register the model to the model group, provide the model group ID in the register request:

**Register A Sparse Encoding Model**
```json
POST /_plugins/_ml/models/_register
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1",
  "version": "1.0.1",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

**Register A Sparse Tokenizer**
```json
POST /_plugins/_ml/models/_register
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1",
  "version": "1.0.1",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model/tokenizer is an asynchronous task. OpenSearch sends back a task ID for this task:

```json
{
  "task_id": "aFeif4oB5Vm0Tdw8yoN7",
  "status": "CREATED"
}
```

OpenSearch downloads the config file for the model/tokenizer and the model/tokenizer contents from the URL. Because the model is larger than 10 MB in size, OpenSearch splits it into chunks of up to 10 MB and saves those chunks in the model index. You can check the status of these tasks by using the Tasks API:

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```
{% include copy-curl.html %}

Once the task is complete, the task state will be `COMPLETED` and the Tasks API response will contain a model ID for the registered model/tokenizer:

```json
{
  "model_id": "aVeif4oB5Vm0Tdw8zYO2",
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
```json
{
  "model_id": "aP2Q8ooBpBj3wT4HVS8a",
  "task_type": "REGISTER_MODEL",
  "function_name": "SPARSE_TOKENIZE",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

You'll need the model ID and tokenizer ID in order to use this model for several of the following steps.

> **_NOTE:_**  For the bi-encoder mode, you only need to register one sparse encoding model. Tokenizer is no longer needed.

### Step 1(d): Deploy the model/tokenizer

Once the model/tokenizer is registered, it is saved in the model index. Next, you'll need to deploy the model. Deploying a model creates a model instance and caches the model in memory. To deploy the model, provide its model ID to the `_deploy` endpoint:

```json
# deploy the model
POST /_plugins/_ml/models/aVeif4oB5Vm0Tdw8zYO2/_deploy
# deploy the tokenizer
POST /_plugins/_ml/models/aP2Q8ooBpBj3wT4HVS8a/_deploy
```
{% include copy-curl.html %}

Like the register operation, the deploy operation is asynchronous, so you'll get a task ID in the response:

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

Once the task is complete, the task state will be `COMPLETED`:

```json
{
  "model_id": "aVeif4oB5Vm0Tdw8zYO2",
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

```json
{
  "model_id": "aP2Q8ooBpBj3wT4HVS8a",
  "task_type": "DEPLOY_MODEL",
  "function_name": "SPARSE_TOKENIZE",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694360024141,
  "last_update_time": 1694360027940,
  "is_async": true
}
```

## Step 2: Ingest data with neural sparse search

### Step 2(a): Create an ingest pipeline
To generate sparse vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`sparse_encoding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/sparse-encoding/), which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields in which to store the embeddings.

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline-sparse
{
  "description": "An sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
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


### Step 2(b): Create an index with the ingest pipeline

In order to use the sparse encoding processor defined in your pipeline, create a rank features index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as [`rank_features`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/#rank-features). Similarly, the `passage_text` field should be mapped as `text`.

The following example request creates a rank features index that is set up with a default ingest pipeline:

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

## Step 2(c): Ingest documents into the index

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

## Step 3: Search the data using raw text

To perform a neural sparse search on your index, use the `neural_sparse` query clause in [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries. 

The following example request uses a `neural_sparse` query to search for relevant documents using a raw text query:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "aP2Q8ooBpBj3wT4HVS8a"
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

## step 4: Set up search processors for neural sparse search (Optional)

### Step 4(a): Create and enable the two-phase processor for search speed up

The `neural_sparse_two_phase_processor` is a feature introduced in OpenSearch 2.15. Using the two-phase processor can significantly speed up the neural sparse queries.

To quickly launch a search pipeline with neural sparse search, use the following example pipeline: 

```json
PUT /_search/pipeline/two_phase_search_pipeline
{
  "request_processors": [
    {
      "neural_sparse_two_phase_processor": {
        "tag": "neural-sparse",
        "description": "This processor is making two-phase processor."
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then choose the index you want to configure with the search pipeline and set the `index.search.default_pipeline` to the pipeline name, as shown in the following example:
```json
PUT /index-name/_settings 
{
  "index.search.default_pipeline" : "two_phase_search_pipeline"
}
```
{% include copy-curl.html %}

For information about `two_phase_search_pipeline`, see [this documentation]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/).

## Step 4(b): Setting a default model on an index or field

A [`neural_sparse`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/) query requires a model/tokenizer ID for generating sparse embeddings. To eliminate passing the model/tokenizer ID with each neural_sparse query request, you can set a default model on index-level or field-level. 

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
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

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

## Tutorial for using neural sparse search with raw sparse vectors

## Step 1: Ingest data with neural sparse search

### Step 1(a): Create an index

In order to ingest documents of raw sparse vectors, create a rank features index. The following example request creates a rank features index.

```json
PUT /my-nlp-index
{
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

## Step 1(b): Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

```json
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1",
  "passage_embedding": {
    "hi" : 4.338913,
    "planets" : 2.7755864,
    "planet" : 5.0969057,
    "mars" : 1.7405145,
    "earth" : 2.6087382,
    "hello" : 3.3210192
  }
}
```
{% include copy-curl.html %}

## Step 2: Search the data using raw sparse vector

You can also use the `neural_sparse` query with raw sparse vector embeddings:
```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_tokens": {
          "hi" : 4.338913,
          "planets" : 2.7755864,
          "planet" : 5.0969057,
          "mars" : 1.7405145,
          "earth" : 2.6087382,
          "hello" : 3.3210192
        }
      }
    }
  }
}
```

## step 3: Set up search processors for neural sparse search (Optional)

### Step 3(a): Create and enable the two-phase processor for search speed up

The `neural_sparse_two_phase_processor` is a feature introduced in OpenSearch 2.15. Using the two-phase processor can significantly speed up the neural sparse queries.

To quickly launch a search pipeline with neural sparse search, use the following example pipeline: 

```json
PUT /_search/pipeline/two_phase_search_pipeline
{
  "request_processors": [
    {
      "neural_sparse_two_phase_processor": {
        "tag": "neural-sparse",
        "description": "This processor is making two-phase processor."
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then choose the index you want to configure with the search pipeline and set the `index.search.default_pipeline` to the pipeline name, as shown in the following example:
```json
PUT /index-name/_settings 
{
  "index.search.default_pipeline" : "two_phase_search_pipeline"
}
```
{% include copy-curl.html %}

For information about `two_phase_search_pipeline`, see [this documentation]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/).

## Further reading
- Read about how sparse encoding models work and benchmarks of OpenSearch neural sparse search in [Improving document retrieval with sparse semantic encoders](https://opensearch.org/blog/improving-document-retrieval-with-sparse-semantic-encoders/).
- Read about fundamentals of neural sparse search and quantitative study in [A deep dive into faster semantic sparse retrieval in OpenSearch 2.12](https://opensearch.org/blog/A-deep-dive-into-faster-semantic-sparse-retrieval-in-OS-2.12/).
- To learn more about splitting long text into passages for neural search, see [Text chunking]({{site.url}}{{site.baseurl}}/search-plugins/text-chunking/).

## FAQ

Refer to the following frequently asked questions for more information about neural sparse search.

### How do I mitigate remote connector throttling exceptions?

When using connectors to call a remote service like SageMaker, ingestion and search calls sometimes fail due to remote connector throttling exceptions. 

To mitigate throttling exceptions, modify the connector's [`client_config`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters) parameter to decrease the number of maximum connections, using the `max_connection` setting to prevent the maximum number of concurrent connections from exceeding the threshold of the remote service. You can also modify the retry settings to flatten the request spike during ingestion.

For versions earlier than OpenSearch 2.15, the SageMaker throttling exception will be thrown as the following "error": 

```
   {
          "type": "status_exception",
          "reason": "Error from remote service: {\"message\":null}"
        }
```