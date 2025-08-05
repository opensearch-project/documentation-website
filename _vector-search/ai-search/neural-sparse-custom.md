---
layout: default
title: Using custom configurations for neural sparse search
parent: Neural sparse search
grand_parent: AI search
nav_order: 20
has_children: false
redirect_from:
  - /search-plugins/neural-sparse-with-pipelines/
---

# Using custom configurations for neural sparse search

Neural sparse search using automatically generated vector embeddings operates in two modes: doc-only and bi-encoder. For more information, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).

At query time, you can use custom models in the following ways: 

- **Bi-encoder mode**: Use your deployed sparse encoding model to generate embeddings from query text. This must be the same model you used at ingestion time.

- **Doc-only mode with a custom tokenizer**: Use your deployed tokenizer model to tokenize query text. The token weights are obtained from a precomputed lookup table.

The following is a complete example of using a custom model for neural sparse search.

## Step 1: Configure a sparse encoding model/tokenizer

You must configure a sparse encoding model for ingestion when using both the bi-encoder mode and the doc-only mode with a custom tokenizer. Bi-encoder mode uses the same model for search; doc-only mode uses a separate tokenizer for search.

### Step 1(a): Choose the search mode

Choose the search mode and the appropriate model/tokenizer combination:

- **Bi-encoder**: Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill` model during both ingestion and search. 

- **Doc-only with a custom tokenizer**: Use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` model during ingestion and the `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` tokenizer during search.

The following tables provide a search relevance comparison for all available combinations of the two search modes so that you can choose the best combination for your use case.

#### English language models

| Mode      | Ingestion model                                               | Search model                                                  | Avg. search relevance on BEIR | Model parameters |
|-----------|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|------------------|
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.49                         | 133M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-distill` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.504                         | 67M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-mini` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.497                         | 23M             |
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1`    | 0.517                         | 67M             |
| Bi-encoder| `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1`     | `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1`     | 0.524                        | 133M             |
| Bi-encoder| `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill`     | `amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill`     | 0.528                        | 67M             |

#### Multilingual models

| Mode      | Ingestion model                                               | Search model                                                  | Avg. search relevance on MIRACL | Model parameters |
|-----------|---------------------------------------------------------------|---------------------------------------------------------------|------------------------------|------------------|
| Doc-only  | `amazon/neural-sparse/opensearch-neural-sparse-encoding-multilingual-v1` | `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-multilingual-v1`    | 0.629                         | 168M             |

### Step 1(b): Register the model/tokenizer

For both modes, register the sparse encoding model. For the doc-only mode with a custom tokenizer, register a custom tokenizer in addition to the sparse encoding model.

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

#### Doc-only mode with a custom tokenizer

When using the doc-only mode with a custom tokenizer, you need to register the `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill` model, which you'll use at ingestion time, and the `amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1` tokenizer, which you'll use at search time.

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

Like in bi-encoder mode, use the Tasks API to check the status of the registration task. After the Tasks API returns, the task state changes to `COMPLETED`. Note the `model_id` of the model and the tokenizer you've created; you'll need them for the following steps.

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

Once the `<token, weight>` pairs are excluded from the source, they cannot be recovered. Before applying this optimization, make sure you don't need the `<token, weight>` pairs for your application.
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

The following example request uses a `neural_sparse` query to search for relevant documents using a raw text query. Provide the model ID for bi-encoder mode or the tokenizer ID for doc-only mode with a custom tokenizer:

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

## Configuring a default model for search

When using custom models, you can configure a default model ID at the index level to simplify your queries. This eliminates the need to specify the `model_id` in every query.

First, create a search pipeline with a [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) processor:

```json
PUT /_search/pipeline/neural_search_pipeline
{
  "request_processors": [
    {
      "neural_query_enricher" : {
        "default_model_id": "<bi-encoder model/tokenizer ID>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then set this pipeline as the default for your index:

```json
PUT /my-nlp-index/_settings 
{
  "index.search.default_pipeline" : "neural_search_pipeline"
}
```
{% include copy-curl.html %}

After configuring the default model, you can omit the `model_id` when running queries.

For more information about setting a default model on an index, or to learn how to set a default model on a specific field, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/#setting-a-default-model-on-an-index-or-field).

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 
