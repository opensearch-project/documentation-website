---
layout: default
title: Batch ingestion
has_children: false
nav_order: 71 
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from:
  - /ml-commons-plugin/extensibility/batch-ingestion/
---

# Using externally hosted ML model for batch ingestion

**Introduced 2.15**
{: .label .label-purple }

To ingest multiple documents which involve generating embeddings through external machine learning services, you can use OpenSearch's batch ingestion feature to achieve improved ingestion performance.

The `_bulk` API accepts a `batch_size` parameter to indicate that documents in the bulk request should be grouped into batches with a size equal to the value of `batch_size`. Processors that support batch ingestion and connect to external machine learning services will consolidate documents from the same batch and send them in one request to the external service for inferencing.

The `text_embedding` and `sparse_encoding` processors are two processors that support batch ingestion. When using these processors, setting the `batch_size` parameter in `_bulk` request allows them to take advantage of batched requests to the downstream machine learning services to improve ingestion throughput.

## Step 1: Register a model group

To register a model, you have the following options:

* You can use `model_group_id` to register a model version to an existing model group.
* If you do not use `model_group_id`, ML Commons creates a model with a new model group.

To register a model group, send the following request:

```
POST /_plugins/_ml/model_groups/_register
{
  "name": "remote_model_group",
  "description": "A model group for external models"
}
```
{% include copy-curl.html %}

The response contains the model group ID that you'll use to register a model to this model group:

```
{
 "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
 "status": "CREATED"
}
```

To learn more about model groups, see [Model access control](https://github.com/opensearch-project/documentation-website/blob/7c4fe91ec9a16bb75e33726c2c86441edd56e08a/_ml-commons-plugin/remote-models/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/ml-commons-plugin/model-access-control).

## Step 2: Create a connector

You can create a standalone connector that can be reused for multiple models. Alternatively, you can specify a connector when creating a model so that it can be used only for that model. For more information and example connectors, see [Connectors](https://github.com/opensearch-project/documentation-website/blob/7c4fe91ec9a16bb75e33726c2c86441edd56e08a/_ml-commons-plugin/remote-models/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/ml-commons-plugin/remote-models/connectors).
The Connectors Create API, `/_plugins/_ml/connectors/_create`, creates connectors that facilitate registering and deploying external models in OpenSearch. Using the `endpoint` parameter, you can connect ML Commons to any supported ML tool by using its specific API endpoint. For example, you can connect to a ChatGPT model by using the `api.openai.com` endpoint:

```
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-3.5-turbo",
        "input_docs_processed_step_size": 100
    },
    "credential": {
        "openAI_key": "..."
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://${parameters.endpoint}/v1/chat/completions",
            "headers": {
                "Authorization": "Bearer ${credential.openAI_key}"
            },
            "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
        }
    ]
}
```
{% include copy-curl.html %}

`parameters.input_docs_processed_step_size` is used to set the maximum batched documents sent to remote server. It can be set to the maximum batch size remote server can support or number less than that which can give you the optimal inferencing performance.
The response contains the connector ID for the newly created connector:

```
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

## Step 3: Register an externally hosted model

To register an externally hosted model to the model group created in step 1, provide the model group ID from step 1 and the connector ID from step 2 in the following request. You must specify the `function_name` as `remote`:

```
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
    "function_name": "remote",
    "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```
{% include copy-curl.html %}

OpenSearch returns the task ID of the register operation:

```
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API](https://github.com/opensearch-project/documentation-website/blob/7c4fe91ec9a16bb75e33726c2c86441edd56e08a/_ml-commons-plugin/remote-models/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/ml-commons-plugin/api/tasks-apis/get-task):

```
GET /_plugins/_ml/tasks/cVeMb4kBJ1eYAeTMFFgj
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```
{
  "model_id": "cleMb4kBJ1eYAeTMFFg4",
  "task_type": "REGISTER_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "XPcXLV7RQoi5m8NI_jEOVQ"
  ],
  "create_time": 1689793598499,
  "last_update_time": 1689793598530,
  "is_async": false
}
```

Take note of the returned `model_id` because you’ll need it to deploy the model.

## Step 4: Deploy the model

Starting with OpenSearch version 2.13, externally hosted models are deployed automatically by default when you send a Predict API request for the first time. To disable automatic deployment for an externally hosted model, set `plugins.ml_commons.model_auto_deploy.enable` to `false`:

```
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.model_auto_deploy.enable" : "false"
  }
}
```
{% include copy-curl.html %}

To undeploy the model, use the [Undeploy API](https://github.com/opensearch-project/documentation-website/blob/7c4fe91ec9a16bb75e33726c2c86441edd56e08a/_ml-commons-plugin/remote-models/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/ml-commons-plugin/api/model-apis/undeploy-model).

```
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_deploy
```
{% include copy-curl.html %}

The response contains the task ID that you can use to check the status of the deploy operation:

```
{
  "task_id": "vVePb4kBJ1eYAeTM7ljG",
  "status": "CREATED"
}
```

As in the previous step, check the status of the operation by calling the Tasks API:

```
GET /_plugins/_ml/tasks/vVePb4kBJ1eYAeTM7ljG
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```
{
  "model_id": "cleMb4kBJ1eYAeTMFFg4",
  "task_type": "DEPLOY_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "n-72khvBTBi3bnIIR8FTTw"
  ],
  "create_time": 1689793851077,
  "last_update_time": 1689793851101,
  "is_async": true
}
```

## Step 5:  Create an ingest pipeline

The following example request creates an ingest pipeline with `text_embedding` processor where the text from passage_text will be converted into text embeddings and the embeddings will be stored in passage_embedding:

```
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "cleMb4kBJ1eYAeTMFFg4",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 6: Bulk indexing

We call `_bulk` API to ingest multiple documents with `batch_size` parameter and `pipeline` parameter explicitly. If `pipeline` parameter is not set, the default pipeline attached to the index will be used.

```
POST _bulk?batch_size=5&pipeline=nlp-ingest-pipeline
{ "create": { "_index": "testindex1", "_id": "2" } }
{ "passage_text": "hello world" }
{ "create": { "_index": "testindex1", "_id": "3" } }
{ "passage_text": "big apple" }
{ "create": { "_index": "testindex1", "_id": "4" } }
{ "passage_text": "golden gate bridge" }
{ "create": { "_index": "testindex1", "_id": "5" } }
{ "passage_text": "fine tune" }
{ "create": { "_index": "testindex1", "_id": "6" } }
{ "passage_text": "random test" }
{ "create": { "_index": "testindex1", "_id": "7" } }
{ "passage_text": "sun and moon" }
{ "create": { "_index": "testindex1", "_id": "8" } }
{ "passage_text": "windy" }
{ "create": { "_index": "testindex1", "_id": "9" } }
{ "passage_text": "new york" }
{ "create": { "_index": "testindex1", "_id": "10" } }
{ "passage_text": "fantastic" }

```
{% include copy-curl.html %}

