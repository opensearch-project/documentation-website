---
layout: default
title: Neural sparse search
nav_order: 50
has_children: false
redirect_from:
  - /search-plugins/neural-sparse-search/
  - /search-plugins/sparse-search/
canonical_url: https://docs.opensearch.org/latest/search-plugins/neural-sparse-search/
---

# Neural sparse search
Introduced 2.11
{: .label .label-purple }

[Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) relies on dense retrieval that is based on text embedding models. However, dense methods use k-NN search, which consumes a large amount of memory and CPU resources. An alternative to semantic search, neural sparse search is implemented using an inverted index and is thus as efficient as BM25. Neural sparse search is facilitated by sparse embedding models. When you perform a neural sparse search, it creates a sparse vector (a list of `token: weight` key-value pairs representing an entry and its weight) and ingests data into a rank features index.

When selecting a model, choose one of the following options:

- Use a sparse encoding model at both ingestion time and search time (high performance, relatively high latency).
- Use a sparse encoding model at ingestion time and a tokenizer at search time for relatively low performance and low latency. The tokenism doesn't conduct model inference, so you can deploy and invoke a tokenizer using the ML Commons Model API for a more consistent experience.

**PREREQUISITE**<br>
Before using neural sparse search, make sure to set up a [pretrained sparse embedding model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sparse-encoding-models) or your own sparse embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
{: .note}

## Using neural sparse search

To use neural sparse search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search the index using neural search](#step-4-search-the-index-using-neural-sparse-search).

## Step 1: Create an ingest pipeline

To generate vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`sparse_encoding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/sparse-encoding/), which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields in which to store the embeddings.

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline-sparse
{
  "description": "An sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "aP2Q8ooBpBj3wT4HVS8a",
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


## Step 2: Create an index for ingestion

In order to use the text embedding processor defined in your pipeline, create a rank features index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as [`rank_features`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/#rank-features). Similarly, the `passage_text` field should be mapped as `text`.

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

## Step 3: Ingest documents into the index

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

## Step 4: Search the index using neural sparse search

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

You can also use the `neural_sparse` query with sparse vector embeddings:
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

## Setting a default model on an index or field

A [`neural_sparse`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/) query requires a model ID for generating sparse embeddings. To eliminate passing the model ID with each neural_sparse query request, you can set a default model on index-level or field-level. 

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

## Next steps

- To learn more about splitting long text into passages for neural search, see [Text chunking]({{site.url}}{{site.baseurl}}/search-plugins/text-chunking/).