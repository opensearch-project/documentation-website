---
layout: default
title: Auto-generated embeddings quickstart
parent: Getting started
nav_order: 20
---

# Getting started with auto-generated embeddings

With this approach, embeddings are generated dynamically within OpenSearch. This method provides a simplified workflow by offering automatic text-to-vector conversion.

## Prerequisites

For this simple setup, you'll use an OpenSearch-provided machine learning (ML) model and a cluster with no dedicated ML nodes. To ensure that this basic local setup works, send the following request to update ML-related cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.model_access_control_enabled": "true",
    "plugins.ml_commons.native_memory_threshold": "99"
  }
}
```
{% include copy-curl.html %}

## Step 1: Choose a language model for embedding generation

Auto-generating embeddings requires configuring a language model that will convert text to embeddings both at ingestion time and query time. 

When selecting a model, you have the following options:

- Use a pretrained model provided by OpenSearch. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

- Upload your own model to OpenSearch. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

- Connect to a foundation model hosted on an external platform. For more information, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

In this example, you'll use the [DistilBERT](https://huggingface.co/docs/transformers/model_doc/distilbert) model from Hugging Face, which is one of the [pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers) available in OpenSearch. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

Take note of the dimensionality of the model because you'll need it when you set up a vector index.
{: .important}

## Step 2: Register and deploy the model 

To register and deploy the model, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.1",
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

You can check the status of the task by using the Tasks API:

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```
{% include copy-curl.html %}

Once the task is complete, the task state will change to `COMPLETED` and the Tasks API response will contain a model ID for the registered model:

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

## Step 3: Ingest text data 

Use the following steps to ingest text data into OpenSearch and automatically generate vector embeddings from text.

### Step 3(a): Create an ingest pipeline for neural search

First, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains one processor: a task that transforms document fields before documents are ingested into an index. You'll set up a `text_embedding` processor that creates vector embeddings from text. You'll need the `model_id` of the model you set up in the previous section and a `field_map`, which specifies the name of the field from which to take the text (`text`) and the name of the field in which to record embeddings (`passage_embedding`):

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

### Step 3(b): Create a vector index

Now you'll create a vector by setting `index.knn` to `true`. In the index, the field named `text` will contains an image description, and a [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) field named `passage_embedding` will contains the vector embedding of the text. Additionally, set the default ingest pipeline to the `nlp-ingest-pipeline` you created in the previous step:


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
      "text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Setting up a k-NN index allows you to later perform a vector search on the `passage_embedding` field.

### Step 3(c): Ingest documents into the index

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

## Step 4: Search the data

Now you'll search the index using semantic search. To automatically generate vector embeddings from query text, use a `neural` query and provide the model ID of the model you set up earlier so that vector embeddings for the query text are generated with the model used at ingestion time:

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

The response all five documents, and the document order reflects semantic meaning:

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
