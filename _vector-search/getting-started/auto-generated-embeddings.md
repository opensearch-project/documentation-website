---
layout: default
title: Generating embeddings automatically
parent: Getting started
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/vector-search/getting-started/auto-generated-embeddings/
---

# Generating embeddings automatically

You can generate embeddings dynamically during ingestion within OpenSearch. This method provides a simplified workflow by converting data to vectors automatically.

OpenSearch can automatically generate embeddings from your text data using two approaches:

- [**Manual setup**](#manual-setup) (Recommended for custom configurations): Configure each component individually for full control over the implementation.
- [**Automated workflow**](#using-automated-workflows) (Recommended for quick setup): Use defaults and workflows for quick implementation with minimal configuration.

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

### Choose an ML model

Generating embeddings automatically requires configuring a language model that will convert text to embeddings both at ingestion time and query time. 

When selecting a model, you have the following options:

- Use a pretrained model provided by OpenSearch. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

- Upload your own model to OpenSearch. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

- Connect to a foundation model hosted on an external platform. For more information, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

In this example, you'll use the [DistilBERT](https://huggingface.co/docs/transformers/model_doc/distilbert) model from Hugging Face, which is one of the [pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers) available in OpenSearch. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

Take note of the dimensionality of the model because you'll need it when you set up a vector index.
{: .important}

## Manual setup

For more control over the configuration, you can set up each component manually using the following steps.

### Step 1: Register and deploy the model 

To register and deploy the model, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/msmarco-distilbert-base-tas-b",
  "version": "1.0.3",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch returns a task ID for this task:

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

### Step 2: Create an ingest pipeline

First, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains one processor: a task that transforms document fields before documents are ingested into an index. You'll set up a `text_embedding` processor that creates vector embeddings from text. You'll need the `model_id` of the model you set up in the previous section and a `field_map`, which specifies the name of the field from which to take the text (`passage`) and the name of the field in which to record embeddings (`passage_embedding`):

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "An NLP ingest pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "field_map": {
          "passage": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Create a vector index

Now you'll create a vector index by setting `index.knn` to `true`. In the index, the field named `passage` contains an image description, and a [`knn_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/) field named `passage_embedding` contains the vector embedding of the text. The vector field `dimension` must match the dimensionality of the model you configured in Step 2. Additionally, set the default ingest pipeline to the `nlp-ingest-pipeline` you created in the previous step:


```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline"
  },
  "mappings": {
    "properties": {
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 768,
        "space_type": "l2"
      },
      "passage": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Setting up a vector index allows you to later perform a vector search on the `passage_embedding` field.

### Step 4: Ingest documents into the index

In this step, you'll ingest several sample documents into the index. The sample data is taken from the [Flickr image dataset](https://www.kaggle.com/datasets/hsankesara/flickr-image-dataset). Each document contains a `passage` field corresponding to the image description and an `id` field corresponding to the image ID:

```json
PUT /my-nlp-index/_doc/1
{
  "passage": "A man who is riding a wild horse in the rodeo is very near to falling off ."
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/2
{
  "passage": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse ."
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/3
{
  "passage": "People line the stands which advertise Freemont 's orthopedics , a cowboy rides a light brown bucking bronco ."
}
```
{% include copy-curl.html %}

### Step 5: Search the data

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
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents:

```json
{
  "took": 127,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.015851952,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.015851952,
        "_source": {
          "passage": "A man who is riding a wild horse in the rodeo is very near to falling off ."
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.015177963,
        "_source": {
          "passage": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse ."
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "3",
        "_score": 0.011347729,
        "_source": {
          "passage": "People line the stands which advertise Freemont 's orthopedics , a cowboy rides a light brown bucking bronco ."
        }
      }
    ]
  }
}
```

## Using automated workflows

You can quickly set up automatic embedding generation using [_automated workflows_]({{site.url}}{{site.baseurl}}/automating-configurations/). This approach automatically creates and provisions all necessary resources. For more information, see [Workflow templates]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/).

You can use automated workflows to create and deploy externally hosted models and create resources for various AI search types. In this example, you'll create the same search you've already created following manual steps.

### Step 1: Register and deploy the model

To register and deploy a model, select the built-in workflow template for the model provider. For more information, see [Supported workflow templates]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/#supported-workflow-templates). Alternatively, to configure a custom model, use [Step 1 of the manual setup](#step-1-register-and-deploy-the-model). Note the model ID; you'll use it in the next step.

### Step 2: Configure a workflow

Create and provision a semantic search workflow. You must provide the model ID for the model deployed in the previous step. Review your selected workflow template [defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/semantic-search-defaults.json) to determine whether you need to update any of the parameters. For example, if the model dimensionality is different from the default (`1024`), specify the dimensionality of your model in the `output_dimension` parameter. Change the workflow template default text field from `passage_text` to `passage` in order to match the manual example:

```json
POST /_plugins/_flow_framework/workflow?use_case=semantic_search&provision=true
{
    "create_ingest_pipeline.model_id" : "aVeif4oB5Vm0Tdw8zYO2",
    "text_embedding.field_map.output.dimension": "768",
    "text_embedding.field_map.input": "passage"
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

Once the workflow completes, the `state` changes to `COMPLETED`. The workflow has created an ingest pipeline and an index called `my-nlp-index`:

```json
{
  "workflow_id": "U_nMXJUBq_4FYQzMOS4B",
  "state": "COMPLETED",
  "resources_created": [
    {
      "workflow_step_id": "create_ingest_pipeline",
      "workflow_step_name": "create_ingest_pipeline",
      "resource_id": "nlp-ingest-pipeline",
      "resource_type": "pipeline_id"
    },
    {
      "workflow_step_name": "create_index",
      "workflow_step_id": "create_index",
      "resource_id": "my-nlp-index",
      "resource_type": "index_name"
    }
  ]
}
```

You can now continue with [steps 4 and 5](#step-4-ingest-documents-into-the-index) to ingest documents into the index and search the index.

## Next steps

- See [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/vector-search/tutorials/neural-search-tutorial/) to learn about configuring semantic and hybrid search.
- See [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/) to learn about the supported types of AI search.