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

At query time, neural sparse search operates in one of two modes:

- **Doc-only mode (recommended)**: A sparse encoding model generates sparse vector embeddings from documents. In this mode, neural sparse search tokenizes query text using an [DL model analyzer]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/dl-model-analyzers/) and obtains the token weights from a lookup table. This approach provides faster retrieval at the cost of a slight decrease in search relevance. Besides using analyzer, users can also deploy and invoke tokenizer models using the [Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/) for a uniform neural sparse search experience.

- **Bi-encoder mode**: A sparse encoding model generates sparse vector embeddings from both documents and query text. This approach provides better search relevance at the cost of an increase in latency. 

Doc-only mode is recommended because it's optimal for most workloads. See [Choose the ingestion model](#step-1a-choose-the-ingestion-model) to select a model for ingestion.

## Tutorial

This tutorial focuses on the recommended **Doc-only with analyzer** approach. Core workflow is outlined below:

1. [**Configure a sparse encoding model**](#step-1-configure-a-sparse-encoding-model)

   1. [Choose the ingestion model](#step-1a-choose-the-ingestion-model)
   2. [Register the ingestion model](#step-1b-register-the-ingestion-model)
   3. [Deploy the ingestion model](#step-1c-deploy-the-ingestion-model)
2. [**Ingest data**](#step-2-ingest-data)

   1. [Create an ingest pipeline](#step-2a-create-an-ingest-pipeline)
   2. [Create an index for ingestion](#step-2b-create-an-index-for-ingestion)
   3. [Ingest documents](#step-2c-ingest-documents)
3. [**Search the data**](#step-3-search-the-data)

## Step 1: Configure a sparse encoding model

Choose the best Doc-only sparse encoding model for your workload. The following table lists all available Doc-only models with their corresponding analyzer, average relevance on BEIR (English) or MIRACL (multilingual), and model size:

**Doc-only models:**

| Model                                                                    | Analyzer        | BEIR relevance | MIRACL relevance | Model parameters |
| ------------------------------------------------------------------------ | --------------- | -------------- | ---------------- | ---------------- |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1`          | `bert-uncased`  | 0.490          | N/A              | 133M             |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-distill`  | `bert-uncased`  | 0.504          | N/A              | 67M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-mini`     | `bert-uncased`  | 0.497          | N/A              | 23M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill`  | `bert-uncased`  | 0.517          | N/A              | 67M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-multilingual-v1` | `mbert-uncased` | 0.500          | 0.629            | 168M             |

### Step 1(a): Choose the ingestion model

Select one of the Doc-only models above and note its `model_id`. No additional models or tokenizers are needed; you'll use the analyzer at query time.

### Step 1(b): Register the ingestion model

Before ingestion, register the sparse encoding model you chose. For example, to register the `opensearch-neural-sparse-encoding-doc-v3-distill` model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT"
}
```

After submitting, note the returned `task_id` and poll its status with:

```json
GET /_plugins/_ml/tasks/<task_id>
```

When the task state is `COMPLETED`, note the `model_id` from the response; you'll use it for pipeline configuration.

### Step 1(c): Deploy the ingestion model

Once you have the `model_id` of your registered ingestion model, deploy it to create an instance in OpenSearch:

```json
POST /_plugins/_ml/models/<model_id>/_deploy
```

Note the returned `task_id`, then poll with:

```json
GET /_plugins/_ml/tasks/<task_id>
```

When the task state is `COMPLETED`, your model is ready for ingestion pipelines.

## Step 2: Ingest data

In all modes, define an ingest pipeline that applies a sparse encoding model on document text.

### Step 2(a): Create an ingest pipeline

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline-sparse
{
  "description": "A sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "<sparse encoding model ID>",
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

To split long text into passages, use the `text_chunking` ingest processor before the `sparse_encoding` processor. For more information, see Text chunking.

### Step 2(b): Create an index for ingestion

```json
PUT /my-nlp-index
{
  "settings": {
    "default_pipeline": "nlp-ingest-pipeline-sparse"
  },
  "mappings": {
    "properties": {
      "id": { "type": "text" },
      "passage_text": { "type": "text" },
      "passage_embedding": { "type": "rank_features" }
    }
  }
}
```

To save space, exclude embeddings from `_source`:

```json
PUT /my-nlp-index
{
  "settings": { "default_pipeline": "nlp-ingest-pipeline-sparse" },
  "mappings": {
    "_source": { "excludes": ["passage_embedding"] },
    "properties": {
      "id": { "type": "text" },
      "passage_text": { "type": "text" },
      "passage_embedding": { "type": "rank_features" }
    }
  }
}
```

### Step 2(c): Ingest documents

```json
PUT /my-nlp-index/_doc/1
{
  "id": "s1",
  "passage_text": "Hello world"
}
```

```json
PUT /my-nlp-index/_doc/2
{
  "id": "s2",
  "passage_text": "Hi planet"
}
```

## Step 3: Search the data

Use the `neural_sparse` clause with either `analyzer` or `model_id`:

* **Analyzer (default)**:

  ```json
  GET my-nlp-index/_search
  {
    "query": {
      "neural_sparse": {
        "passage_embedding": {
          "query_text": "Hi world",
          "analyzer": "bert-uncased"
        }
      }
    }
  }
  ```

* **Model-based**:

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

Exclude embeddings from response with `_source.excludes` as needed.

## Advanced query modes

### Query with tokenizer model

If you need even higher relevance via model-based tokenization at query time, register and deploy a tokenizer model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1",
  "version": "1.0.1",
  "model_format": "TORCH_SCRIPT"
}
```

After registration and deployment, use `model_id` in your query body instead of `analyzer`:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "<tokenizer model_id>"
      }
    }
  }
}
```

### Bi-encoder mode

For ultimate relevance, register and deploy a bi-encoder model that serves for both ingestion and query:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT"
}
```

After deployment, query using the same `model_id`:

```json
GET my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "Hi world",
        "model_id": "<bi-encoder model_id>"
      }
    }
  }
}
```

## Troubleshooting

For connector throttling or rate-limit errors, adjust `client_config.max_connection` and retry settings. See [remote connector docs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters).

## Next steps

* Explore [vector-search tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) for advanced pipelines and performance tuning.
