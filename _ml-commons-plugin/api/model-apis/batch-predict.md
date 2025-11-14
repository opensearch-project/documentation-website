---
layout: default
title:  Batch predict
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 70
---

# Batch Predict API

ML Commons can perform inference on large datasets in an offline asynchronous mode using a model deployed on external model servers. To use the Batch Predict API, you must provide the `model_id` for an externally hosted model. Amazon SageMaker, Cohere, and OpenAI are currently the only verified external servers that support this API.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

For information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). 

For instructions on how set up batch inference and connector blueprints, see the following:

- [Amazon SageMaker batch predict connector blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/batch_inference_sagemaker_connector_blueprint.md)

- [OpenAI batch predict connector blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/batch_inference_openAI_connector_blueprint.md)

## Endpoints

```json
POST /_plugins/_ml/models/<model_id>/_batch_predict
```

## Prerequisites

Before using the Batch Predict API, you need to create a connector to the externally hosted model. For each action, specify the `action_type` parameter that describes the action:

- `batch_predict`: Runs the batch predict operation.
- `batch_predict_status`: Checks the batch predict operation status.
- `cancel_batch_predict`: Cancels the batch predict operation.

For example, to create a connector to an OpenAI `text-embedding-ada-002` model, send the following request. The `cancel_batch_predict` action is optional and supports canceling the batch job running on OpenAI:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI Embedding model",
  "description": "OpenAI embedding model for testing offline batch",
  "version": "1",
  "protocol": "http",
  "parameters": {
    "model": "text-embedding-ada-002",
    "input_file_id": "<your input file id in OpenAI>",
    "endpoint": "/v1/embeddings"
  },
  "credential": {
    "openAI_key": "<your openAI key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/embeddings",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"input\": ${parameters.input}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.openai.embedding",
      "post_process_function": "connector.post_process.openai.embedding"
    },
    {
      "action_type": "batch_predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/batches",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"input_file_id\": \"${parameters.input_file_id}\", \"endpoint\": \"${parameters.endpoint}\", \"completion_window\": \"24h\" }"
    },
    {
      "action_type": "batch_predict_status",
      "method": "GET",
      "url": "https://api.openai.com/v1/batches/${parameters.id}",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      }
    },
    {
      "action_type": "cancel_batch_predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/batches/${parameters.id}/cancel",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains a connector ID that you'll use in the next steps:

```json
{
  "connector_id": "XU5UiokBpXT9icfOM0vt"
}
```

Next, register an externally hosted model and provide the connector ID of the created connector:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "OpenAI model for realtime embedding and offline batch inference",
    "function_name": "remote",
    "description": "OpenAI text embedding model",
    "connector_id": "XU5UiokBpXT9icfOM0vt"
}
```
{% include copy-curl.html %}

The response contains the task ID for the register operation:

```json
{
  "task_id": "rMormY8B8aiZvtEZIO_j",
  "status": "CREATED",
  "model_id": "lyjxwZABNrAVdFa9zrcZ"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once the registration is complete, the task `state` changes to `COMPLETED`.

## Example request

Once you have completed the prerequisite steps, you can call the Batch Predict API. The parameters in the batch predict request override those defined in the connector:

```json
POST /_plugins/_ml/models/lyjxwZABNrAVdFa9zrcZ/_batch_predict
{
  "parameters": {
    "model": "text-embedding-3-large"
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains the task ID for the batch predict operation:

```json
{
  "task_id": "KYZSv5EBqL2d0mFvs80C",
  "status": "CREATED"
}
```

To check the status of the batch predict job, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). You can find the job details in the `remote_job` field in the task. Once the prediction is complete, the task `state` changes to `COMPLETED`.

## Example request

```json
GET /_plugins/_ml/tasks/KYZSv5EBqL2d0mFvs80C
```
{% include copy-curl.html %}

## Example response

The response contains the batch predict operation details in the `remote_job` field:

```json
{
  "model_id": "JYZRv5EBqL2d0mFvKs1E",
  "task_type": "BATCH_PREDICTION",
  "function_name": "REMOTE",
  "state": "RUNNING",
  "input_type": "REMOTE",
  "worker_node": [
    "Ee5OCIq0RAy05hqQsNI1rg"
  ],
  "create_time": 1725491751455,
  "last_update_time": 1725491751455,
  "is_async": false,
  "remote_job": {
    "cancelled_at": null,
    "metadata": null,
    "request_counts": {
      "total": 3,
      "completed": 3,
      "failed": 0
    },
    "input_file_id": "file-XXXXXXXXXXXX",
    "output_file_id": "file-XXXXXXXXXXXXX",
    "error_file_id": null,
    "created_at": 1725491753,
    "in_progress_at": 1725491753,
    "expired_at": null,
    "finalizing_at": 1725491757,
    "completed_at": null,
    "endpoint": "/v1/embeddings",
    "expires_at": 1725578153,
    "cancelling_at": null,
    "completion_window": "24h",
    "id": "batch_XXXXXXXXXXXXXXX",
    "failed_at": null,
    "errors": null,
    "object": "batch",
    "status": "in_progress"
  }
}
```

For the definition of each field in the result, see [OpenAI Batch API](https://platform.openai.com/docs/guides/batch). Once the batch inference is complete, you can download the output by calling the [OpenAI Files API](https://platform.openai.com/docs/api-reference/files) and providing the file name specified in the `id` field of the response.

### Canceling a batch predict job

You can also cancel the batch predict operation running on the remote platform using the task ID returned by the batch predict request. To add this capability, set the `action_type` to `cancel_batch_predict` in the connector configuration when creating the connector.  

## Example request

```json
POST /_plugins/_ml/tasks/KYZSv5EBqL2d0mFvs80C/_cancel_batch
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK"
}
```
