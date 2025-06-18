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

Neural sparse search works as follows:

- At ingestion time, neural sparse search uses a sparse encoding model to generate sparse vector embeddings from text fields. 

- At query time, neural sparse search operates in one of two search modes: 

    - **Doc-only mode (default)**: A sparse encoding model generates sparse vector embeddings from documents at ingestion time. At query time, neural sparse search tokenizes query text and obtains the token weights from a lookup table. This approach provides faster retrieval at the cost of a slight decrease in search relevance. The query-time tokenization can be performed by the following components:
      - **A DL model analyzer (default)**: A [DL model analyzer]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/dl-model-analyzers/) uses a built-in ML model. This approach provides faster retrieval at the cost of a slight decrease in search relevance.
      - **A custom tokenizer**: You can deploy a custom tokenizer using the [Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/) to tokenize query text. This approach provides more flexibility while maintaining consistent tokenization across your neural sparse search implementation. 

    - **Bi-encoder mode**: A sparse encoding model generates sparse vector embeddings from both documents and query text. This approach provides better search relevance at the cost of an increase in latency. 

We recommend using the default doc-only mode with a DL analyzer because it provides the best balance of performance and relevance for most use cases. 
{: tip} 

The default doc-only mode with an analyzer works as follows:

1. At ingestion time:
   - Your registered sparse encoding model generates sparse vector embeddings.
   - These embeddings are stored as token-weight pairs in your index.

2. At search time:
   - The query text is analyzed using a built-in DL model analyzer (which uses a corresponding built-in ML model tokenizer).
   - The token weights are obtained from a precomputed lookup table that's built into OpenSearch.
   - The tokenization matches what the sparse encoding model expects because they both use the same tokenization scheme.

Thus, you must choose and apply an ML model at ingestion time, but you only need to specify an analyzer (not a model) at search time.

## Sparse encoding model/analyzer compatibility

The following table lists all available models for use in doc-only mode. Each model is paired with its compatible analyzer that should be used at search time. Choose based on your language needs (English or multilingual) and performance requirements.

| Model                                                                    | Analyzer        | BEIR relevance | MIRACL relevance | Model parameters |
| ------------------------------------------------------------------------ | --------------- | -------------- | ---------------- | ---------------- |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1`          | `bert-uncased`  | 0.490          | N/A              | 133M             |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-distill`  | `bert-uncased`  | 0.504          | N/A              | 67M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v2-mini`     | `bert-uncased`  | 0.497          | N/A              | 23M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill`  | `bert-uncased`  | 0.517          | N/A              | 67M              |
| `amazon/neural-sparse/opensearch-neural-sparse-encoding-multilingual-v1` | `mbert-uncased` | 0.500          | 0.629            | 168M             |

## Example: Using the default doc-only mode with an analyzer

This example uses the recommended **doc-only** mode with a **DL model analyzer**. In this mode, OpenSearch applies a sparse encoding model at ingestion time and a compatible DL model analyzer at search time. For examples of other modes, see [Using custom configurations for neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-custom/). 

For this example, you'll use neural sparse search with OpenSearch's built-in machine learning (ML) model hosting and ingest pipelines. Because the transformation of text to embeddings is performed within OpenSearch, you'll use text when ingesting and searching documents. 

### Prerequisites

Before you start, complete the [prerequisites]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/#prerequisites). 

### Step 1: Configure a sparse encoding model for ingestion

To use doc-only mode, first [choose a sparse encoding model](#sparse-encoding-modelanalyzer-compatibility) to be used at ingestion time. Then, register and deploy the model. For example, to register and deploy the `opensearch-neural-sparse-encoding-doc-v3-distill` model, use the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v3-distill",
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
  "model_id": "<model ID>",
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

### Step 2: Create an ingest pipeline

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

### Step 3: Create an index for ingestion

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

### Step 4: Ingest documents into the index

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


### Step 5: Search the data

To perform a neural sparse search on your index, use the `neural_sparse` query clause in [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries. 

The following example request uses a `neural_sparse` query to search for relevant documents using a raw text query. Specify the `analyzer` compatible with the model you chose (see [Sparse encoding model/analyzer compatibility](#sparse-encoding-modelanalyzer-compatibility)):

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
{% include copy-curl.html %}

If you don't specify an analyzer, the default `bert-uncased` analyzer is used. Thus, this query is equivalent to the preceding one:

```json
GET my-nlp-index/_search
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
        "analyzer": "bert-uncased"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Bi-encoder mode

In bi-encoder mode, register and deploy a bi-encoder model to use at both ingestion and query time:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-v2-distill",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

After deployment, use the same `model_id` for search:

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
{% include copy-curl.html %}

For a complete example, see [Using custom models for search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-custom/).

## Doc-only mode with a custom tokenizer

You can use doc-only mode with a custom tokenizer. To deploy a tokenizer, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-tokenizer-v1",
  "version": "1.0.1",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

After deployment, use the `model_id` of the tokenizer in your query:

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
{% include copy-curl.html %}

For a complete example, see [Using custom models for search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-custom/).

### Creating a search pipeline for the default model_id

You can create a search pipeline that augments neural sparse search functionality by setting the default model ID on an index for easier use. 

To configure the pipeline, add a [`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) processor. The following request creates a pipeline with the processor:

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

- To learn how to use custom neural sparse search configurations, see [Using custom configurations for neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-custom/). 
- To learn more about improving retrieval time for neural sparse search, see [Accelerating neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/#accelerating-neural-sparse-search).
- To learn how to build AI search applications, explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/). 