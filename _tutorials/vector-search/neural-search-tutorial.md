---
layout: default
title: Getting started with semantic and hybrid search
has_children: false
parent: Vector search
nav_order: 3
redirect_from:
  - /ml-commons-plugin/semantic-search/
  - /search-plugins/neural-search-tutorial/
  - /vector-search/tutorials/neural-search-tutorial/
steps:
  - heading: "Choose a model for embedding generation"
    link: "/tutorials/vector-search/neural-search-tutorial/#step-1-choose-a-model"
  - heading: "Register and deploy the model"
    link: "/tutorials/vector-search/neural-search-tutorial/#step-2-register-and-deploy-the-model"
  - heading: "Ingest data"
    link: "/tutorials/vector-search/neural-search-tutorial/#step-3-ingest-data"
  - heading: "Search the data"
    link: "/tutorials/vector-search/neural-search-tutorial/#step-4-search-the-data"
---

# Getting started with semantic and hybrid search

By default, OpenSearch calculates document scores using the [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) algorithm. BM25 is a keyword-based algorithm that performs well on queries containing keywords but fails to capture the semantic meaning of the query terms. Semantic search, unlike keyword-based search, takes into account the meaning of the query in the search context. Thus, semantic search performs well when a query requires natural language understanding. 

In this tutorial, you'll learn how to implement the following types of search:

- **Semantic search**: Considers semantic meaning in order to determine the intention of the user's query in the search context, thereby improving search relevance.
- **Hybrid search**: Combines semantic and keyword search to improve search relevance. 

## OpenSearch components for semantic search

In this tutorial, you'll use the following OpenSearch components:

- [Pretrained language models provided by OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/)
- [Ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
- [k-NN vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/)
- [Search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/)
- [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/)
- [Hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/)

You'll find descriptions of all these components as you follow the tutorial, so don't worry if you're not familiar with some of them. Each link in the preceding list will take you to the documentation section for the corresponding component.

## Prerequisites

For this simple setup, you'll use an OpenSearch-provided machine learning (ML) model and a cluster with no dedicated ML nodes. To ensure that this basic local setup works, send the following request to update ML-related cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.native_memory_threshold": "99"
  }
}
```
{% include copy-curl.html %}

#### Advanced

For a [custom local model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/) setup, note the following requirements:

- To register a custom local model, you need to specify an additional `"allow_registering_model_via_url": "true"` cluster setting. 
- In production, it's best practice to separate the workloads by having dedicated ML nodes. On clusters with dedicated ML nodes, specify `"only_run_on_ml_node": "true"` for improved performance. 

For more information about ML-related cluster settings, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Tutorial

This tutorial consists of the following steps:

{% include list.html list_items=page.steps%}

You can follow this tutorial by using your command line or the OpenSearch Dashboards [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/run-queries/).

Some steps in the tutorial contain optional <span>Test it</span>{: .text-delta} sections. You can confirm that the step completed successfully by running the requests in these sections.

After you're done, follow the steps in the [Clean up](#clean-up) section to delete all created components.

### Step 1: Choose a model

First, you'll need to choose a language model in order to generate vector embeddings from text fields, both at ingestion time and query time.

For this tutorial, you'll use the [DistilBERT](https://huggingface.co/docs/transformers/model_doc/distilbert) model from Hugging Face. It is one of the pretrained sentence transformer models available in OpenSearch that has shown some of the best results in benchmarking tests (for more information, see [this blog post](https://opensearch.org/blog/semantic-science-benchmarks/)). You'll need the name, version, and dimension of the model to register it. You can find this information in the [pretrained model table]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers) by selecting the `config_url` link corresponding to the model's TorchScript artifact:

- The model name is `huggingface/sentence-transformers/msmarco-distilbert-base-tas-b`.
- The model version is `1.0.3`.
- The number of dimensions for this model is `768`.

Take note of the dimensionality of the model because you'll need it when you set up a vector index.
{: .important}

#### Advanced: Using a different model

Alternatively, you can choose one of the following options for your model:

- Use any other pretrained model provided by OpenSearch. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

- Upload your own model to OpenSearch. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

- Connect to a foundation model hosted on an external platform. For more information, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

For information about choosing a model, see [Further reading](#further-reading). 

### Step 2: Register and deploy the model 

To register and deploy the model, provide the model group ID in the register request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.3",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch sends back a task ID for this task:

```json
{
  "task_id": "aFeif4oB5Vm0Tdw8yoN7",
  "status": "CREATED"
}
```

OpenSearch downloads the config file for the model and the model contents from the URL. Because the model is larger than 10 MB in size, OpenSearch splits it into chunks of up to 10 MB and saves those chunks in the model index. You can check the status of the task by using the Tasks API:

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```
{% include copy-curl.html %}

OpenSearch saves the registered model in the model index. Deploying a model creates a model instance and caches the model in memory. 

Once the task is complete, the task state will be `COMPLETED` and the Tasks API response will contain a model ID for the deployed model:

```json
{
  "model_id": "aVeif4oB5Vm0Tdw8zYO2",
  "task_type": "REGISTER_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

You'll need the model ID in order to use this model for several of the following steps.

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Search for the newly created model by providing its ID in the request:

```json
GET /_plugins/_ml/models/aVeif4oB5Vm0Tdw8zYO2
```
{% include copy-curl.html %}

The response contains the model:

```json
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "algorithm": "TEXT_EMBEDDING",
  "model_version": "1",
  "model_format": "TORCH_SCRIPT",
  "model_state": "REGISTERED",
  "model_content_size_in_bytes": 266352827,
  "model_content_hash_value": "acdc81b652b83121f914c5912ae27c0fca8fabf270e6f191ace6979a19830413",
  "model_config": {
    "model_type": "distilbert",
    "embedding_dimension": 768,
    "framework_type": "SENTENCE_TRANSFORMERS",
    "all_config": """{"_name_or_path":"old_models/msmarco-distilbert-base-tas-b/0_Transformer","activation":"gelu","architectures":["DistilBertModel"],"attention_dropout":0.1,"dim":768,"dropout":0.1,"hidden_dim":3072,"initializer_range":0.02,"max_position_embeddings":512,"model_type":"distilbert","n_heads":12,"n_layers":6,"pad_token_id":0,"qa_dropout":0.1,"seq_classif_dropout":0.2,"sinusoidal_pos_embds":false,"tie_weights_":true,"transformers_version":"4.7.0","vocab_size":30522}"""
  },
  "created_time": 1694482261832,
  "last_updated_time": 1694482324282,
  "last_registered_time": 1694482270216,
  "last_deployed_time": 1694482324282,
  "total_chunks": 27,
  "planning_worker_node_count": 1,
  "current_worker_node_count": 1,
  "planning_worker_nodes": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "deploy_to_all_nodes": true
}
```

The response contains the model information. You can see that the `model_state` is `REGISTERED`. Additionally, the model was split into 27 chunks, as shown in the `total_chunks` field.
</details>

#### Advanced: Registering a custom model

To register a custom model, you must provide a model configuration in the register request. For more information, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Search for the deployed model by providing its ID in the request:

```json
GET /_plugins/_ml/models/aVeif4oB5Vm0Tdw8zYO2
```
{% include copy-curl.html %}

The response shows the model state as `DEPLOYED`:

```json
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "model_group_id": "Z1eQf4oB5Vm0Tdw8EIP2",
  "algorithm": "TEXT_EMBEDDING",
  "model_version": "1",
  "model_format": "TORCH_SCRIPT",
  "model_state": "DEPLOYED",
  "model_content_size_in_bytes": 266352827,
  "model_content_hash_value": "acdc81b652b83121f914c5912ae27c0fca8fabf270e6f191ace6979a19830413",
  "model_config": {
    "model_type": "distilbert",
    "embedding_dimension": 768,
    "framework_type": "SENTENCE_TRANSFORMERS",
    "all_config": """{"_name_or_path":"old_models/msmarco-distilbert-base-tas-b/0_Transformer","activation":"gelu","architectures":["DistilBertModel"],"attention_dropout":0.1,"dim":768,"dropout":0.1,"hidden_dim":3072,"initializer_range":0.02,"max_position_embeddings":512,"model_type":"distilbert","n_heads":12,"n_layers":6,"pad_token_id":0,"qa_dropout":0.1,"seq_classif_dropout":0.2,"sinusoidal_pos_embds":false,"tie_weights_":true,"transformers_version":"4.7.0","vocab_size":30522}"""
  },
  "created_time": 1694482261832,
  "last_updated_time": 1694482324282,
  "last_registered_time": 1694482270216,
  "last_deployed_time": 1694482324282,
  "total_chunks": 27,
  "planning_worker_node_count": 1,
  "current_worker_node_count": 1,
  "planning_worker_nodes": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "deploy_to_all_nodes": true
}
```

You can also receive statistics for all deployed models in your cluster by sending a [Models Profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/profile/) request:

```json
GET /_plugins/_ml/profile/models
```
</details>

### Step 3: Ingest data

OpenSearch uses a language model to transform text into vector embeddings. During ingestion, OpenSearch creates vector embeddings for the text fields in the request. During search, you can generate vector embeddings for the query text by applying the same model, allowing you to perform vector similarity search on the documents.

#### Step 3(a): Create an ingest pipeline

Now that you have deployed a model, you can use this model to configure an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains one processor: a task that transforms document fields before documents are ingested into an index. In this example, you'll set up a `text_embedding` processor that creates vector embeddings from text. You'll need the `model_id` of the model you set up in the previous section and a `field_map`, which specifies the name of the field from which to take the text (`text`) and the name of the field in which to record embeddings (`passage_embedding`):

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "An NLP ingest pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "field_map": {
          "text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Search for the created ingest pipeline by using the Ingest API:

```json
GET /_ingest/pipeline
```
{% include copy-curl.html %}

The response contains the ingest pipeline:

```json
{
  "nlp-ingest-pipeline": {
    "description": "An NLP ingest pipeline",
    "processors": [
      {
        "text_embedding": {
          "model_id": "aVeif4oB5Vm0Tdw8zYO2",
          "field_map": {
            "text": "passage_embedding"
          }
        }
      }
    ]
  }
}
```
</details>

#### Step 3(b): Create a vector index

Now you'll create a vector index with a field named `text`, which contains an image description, and a [`knn_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/) field named `passage_embedding`, which contains the vector embedding of the text. Additionally, set the default ingest pipeline to the `nlp-ingest-pipeline` you created in the previous step:


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
        "space_type": "l2"
      },
      "text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Setting up a vector index allows you to later perform a vector search on the `passage_embedding` field.

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Use the following requests to get the settings and mappings of the created index:

```json
GET /my-nlp-index/_settings
```
{% include copy-curl.html %}

```json
GET /my-nlp-index/_mappings
```
{% include copy-curl.html %}

</details>

#### Step 3(c): Ingest documents into the index

In this step, you'll ingest several sample documents into the index. The sample data is taken from the [Flickr image dataset](https://www.kaggle.com/datasets/hsankesara/flickr-image-dataset). Each document contains a `text` field corresponding to the image description and an `id` field corresponding to the image ID:

```json
PUT /my-nlp-index/_doc/1
{
  "text": "A West Virginia university women 's basketball team , officials , and a small gathering of fans are in a West Virginia arena .",
  "id": "4319130149.jpg"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/2
{
  "text": "A wild animal races across an uncut field with a minimal amount of trees .",
  "id": "1775029934.jpg"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/3
{
  "text": "People line the stands which advertise Freemont 's orthopedics , a cowboy rides a light brown bucking bronco .",
  "id": "2664027527.jpg"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/4
{
  "text": "A man who is riding a wild horse in the rodeo is very near to falling off .",
  "id": "4427058951.jpg"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/5
{
  "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
  "id": "2691147709.jpg"
}
```
{% include copy-curl.html %}

When the documents are ingested into the index, the `text_embedding` processor creates an additional field that contains vector embeddings and adds that field to the document. To see an example document that is indexed, search for document 1:

```json
GET /my-nlp-index/_doc/1
```
{% include copy-curl.html %}

The response includes the document `_source` containing the original `text` and `id` fields and the added `passage_embedding` field:

```json
{
  "_index": "my-nlp-index",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "passage_embedding": [
      0.04491629,
      -0.34105563,
      0.036822468,
      -0.14139028,
      ...
    ],
    "text": "A West Virginia university women 's basketball team , officials , and a small gathering of fans are in a West Virginia arena .",
    "id": "4319130149.jpg"
  }
}
```

### Step 4: Search the data

Now you'll search the index using a keyword search, a semantic search, and a combination of the two.

### Search using a keyword search

To search using a keyword search, use a `match` query. You'll exclude embeddings from the results:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "excludes": [
      "passage_embedding"
    ]
  },
  "query": {
    "match": {
      "text": {
        "query": "wild west"
      }
    }
  }
}
```
{% include copy-curl.html %}

Document 3 is not returned because it does not contain the specified keywords. Documents containing the words `rodeo` and `cowboy` are scored lower because their semantic meaning is not considered:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
  "took": 647,
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
    "max_score": 1.7878418,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 1.7878418,
        "_source": {
          "text": "A West Virginia university women 's basketball team , officials , and a small gathering of fans are in a West Virginia arena .",
          "id": "4319130149.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.58093566,
        "_source": {
          "text": "A wild animal races across an uncut field with a minimal amount of trees .",
          "id": "1775029934.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "5",
        "_score": 0.55228686,
        "_source": {
          "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
          "id": "2691147709.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "4",
        "_score": 0.53899646,
        "_source": {
          "text": "A man who is riding a wild horse in the rodeo is very near to falling off .",
          "id": "4427058951.jpg"
        }
      }
    ]
  }
}
```
</details>

### Search using a semantic search

To search using a semantic search, use a `neural` query and provide the model ID of the model you set up earlier so that vector embeddings for the query text are generated with the model used at ingestion time:

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
        "query_text": "wild west",
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "k": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

This time, the response not only contains all five documents, but the document order is also improved because semantic search considers semantic meaning:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
  "took": 25,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 0.01585195,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "4",
        "_score": 0.01585195,
        "_source": {
          "text": "A man who is riding a wild horse in the rodeo is very near to falling off .",
          "id": "4427058951.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.015748845,
        "_source": {
          "text": "A wild animal races across an uncut field with a minimal amount of trees.",
          "id": "1775029934.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "5",
        "_score": 0.015177963,
        "_source": {
          "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
          "id": "2691147709.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.013272902,
        "_source": {
          "text": "A West Virginia university women 's basketball team , officials , and a small gathering of fans are in a West Virginia arena .",
          "id": "4319130149.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "3",
        "_score": 0.011347735,
        "_source": {
          "text": "People line the stands which advertise Freemont 's orthopedics , a cowboy rides a light brown bucking bronco .",
          "id": "2664027527.jpg"
        }
      }
    ]
  }
}
```
</details>

### Search using a hybrid search

Hybrid search combines keyword and semantic search to improve search relevance. To implement hybrid search, you need to set up a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline you'll configure intercepts search results at an intermediate stage and applies the [`normalization-processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) to them. The `normalization-processor` normalizes and combines the document scores from multiple query clauses, rescoring the documents according to the chosen normalization and combination techniques. 

#### Step 1: Configure a search pipeline

To configure a search pipeline with a `normalization-processor`, use the following request. The normalization technique in the processor is set to `min_max`, and the combination technique is set to `arithmetic_mean`. The `weights` array specifies the weights assigned to each query clause as decimal percentages:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [
              0.3,
              0.7
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Step 2: Search using a hybrid query

You'll use the [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) to combine the `match` and `neural` query clauses. Make sure to apply the previously created `nlp-search-pipeline` to the request in the query parameter:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "text": {
              "query": "cowboy rodeo bronco"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "wild west",
              "model_id": "aVeif4oB5Vm0Tdw8zYO2",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Not only does OpenSearch return documents that match the semantic meaning of `wild west`, but now the documents containing words related to the wild west theme are also scored higher relative to the others:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
  "took": 27,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 0.86481035,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "5",
        "_score": 0.86481035,
        "_source": {
          "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
          "id": "2691147709.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "4",
        "_score": 0.7003,
        "_source": {
          "text": "A man who is riding a wild horse in the rodeo is very near to falling off .",
          "id": "4427058951.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.6839765,
        "_source": {
          "text": "A wild animal races across an uncut field with a minimal amount of trees.",
          "id": "1775029934.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "3",
        "_score": 0.3007,
        "_source": {
          "text": "People line the stands which advertise Freemont 's orthopedics , a cowboy rides a light brown bucking bronco .",
          "id": "2664027527.jpg"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.29919013,
        "_source": {
          "text": "A West Virginia university women 's basketball team , officials , and a small gathering of fans are in a West Virginia arena .",
          "id": "4319130149.jpg"
        }
      }
    ]
  }
}
```
</details>

Instead of specifying the search pipeline in every request, you can set it as a default search pipeline for the index as follows:

```json
PUT /my-nlp-index/_settings 
{
  "index.search.default_pipeline" : "nlp-search-pipeline"
}
```
{% include copy-curl.html %}

You can now experiment with different weights, normalization techniques, and combination techniques. For more information, see the [`normalization-processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) documentation.

#### Advanced

You can parameterize the search by using search templates. Search templates hide implementation details, reducing the number of nested levels and thus the query complexity. For more information, see [search templates]({{site.url}}{{site.baseurl}}/search-plugins/search-template/).

## Using automated workflows

You can quickly set up semantic or hybrid search using [_automated workflows_]({{site.url}}{{site.baseurl}}/automating-configurations/). This approach automatically creates and provisions all necessary resources. For more information, see [Workflow templates]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/).

### Automated semantic search setup

OpenSearch provides a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/) that automatically registers and deploys a default local model (`huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2`) and creates an ingest pipeline and a vector index: 

```json
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_local_model&provision=true
```
{% include copy-curl.html %}

Review the semantic search workflow template [defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/semantic-search-with-local-model-defaults.json) to determine whether you need to update any of the parameters. For example, if you want to use a different model, specify the model name in the request body:

```json
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_local_model&provision=true
{
  "register_local_pretrained_model.name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b"
}
```
{% include copy-curl.html %}

OpenSearch responds with a workflow ID for the created workflow:

```json
{
  "workflow_id" : "U_nMXJUBq_4FYQzMOS4B"
}
```

To check the workflow status, send the following request:

```json
GET /_plugins/_flow_framework/workflow/U_nMXJUBq_4FYQzMOS4B/_status
```
{% include copy-curl.html %}

Once the workflow completes, the `state` changes to `COMPLETED`. The workflow runs the following steps:

1. [Step 2](#step-2-register-and-deploy-the-model) to register and deploy the model.
1. [Step 3(a)](#step-3a-create-an-ingest-pipeline) to create an ingest pipeline.
1. [Step 3(b)](#step-3b-create-a-vector-index) to create a vector index.

You can now continue with [Step 3(c)](#step-3c-ingest-documents-into-the-index) to ingest documents into the index and [Step 4](#step-4-search-the-data) to search your data.

## Clean up

After you're done, delete the components you've created in this tutorial from the cluster:

```json
DELETE /my-nlp-index
```
{% include copy-curl.html %}

```json
DELETE /_search/pipeline/nlp-search-pipeline
```
{% include copy-curl.html %}

```json
DELETE /_ingest/pipeline/nlp-ingest-pipeline
```
{% include copy-curl.html %}

```json
POST /_plugins/_ml/models/aVeif4oB5Vm0Tdw8zYO2/_undeploy
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_ml/models/aVeif4oB5Vm0Tdw8zYO2
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_ml/model_groups/Z1eQf4oB5Vm0Tdw8EIP2
```
{% include copy-curl.html %}

## Further reading

- Read about the basics of OpenSearch semantic search in [Building a semantic search engine in OpenSearch](https://opensearch.org/blog/semantic-search-solutions/).
- Read about the combining keyword and semantic search, the normalization and combination technique options, and benchmarking tests in [The ABCs of semantic search in OpenSearch: Architectures, benchmarks, and combination strategies](https://opensearch.org/blog/semantic-science-benchmarks/).

## Next steps

- Explore [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/index/) in OpenSearch.