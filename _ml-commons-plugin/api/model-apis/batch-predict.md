---
layout: default
title:  Batch inference
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Batch inference

ML Commons can predict large datasets in an offline asynchronous mode with your remote model deployed in external model servers. To use the Batch_Predict API, the `model_id` for a remote model is required. This new API is released as an experimental feature in the OpenSearch version 2.16, and only SageMaker, Cohere, and OpenAI are verified as the external servers that support this features.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).


For information about connectors and remote models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). For more details of the connector blurprints for batch predict, see [GitHub docs](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/batch_inference_openAI_connector_blueprint.md)

## Required connector setup for batch predict
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
    }
  ]
}

# response
{
  "connector_id": "XU5UiokBpXT9icfOM0vt"
}
```
To use this connector and run batch_predict API, you need to register a remote model that uses this connector.
```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "OpenAI model for realtime embedding and offline batch inference",
    "function_name": "remote",
    "description": "OpenAI text embedding model",
    "connector_id": "XU5UiokBpXT9icfOM0vt"
}

# response
{
  "task_id": "rMormY8B8aiZvtEZIO_j",
  "status": "CREATED",
  "model_id": "lyjxwZABNrAVdFa9zrcZ"
}
```


## Path and HTTP methods

```json
POST /_plugins/_ml/models/<model_id>/_batch_predict
```

#### Example request

```json
POST /_plugins/_ml/models/lyjxwZABNrAVdFa9zrcZ/_batch_predict
{
  "parameters": {
    "model": "text-embedding-ada-002"
  }
}
```
{% include copy-curl.html %}
The parameters in the batch_predict request will override those defined in the connector.

#### Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "batch_<your file id>",
            "object": "batch",
            "endpoint": "/v1/embeddings",
            "errors": null,
            "input_file_id": "file-<your input file id>",
            "completion_window": "24h",
            "status": "validating",
            "output_file_id": null,
            "error_file_id": null,
            "created_at": 1722037257,
            "in_progress_at": null,
            "expires_at": 1722123657,
            "finalizing_at": null,
            "completed_at": null,
            "failed_at": null,
            "expired_at": null,
            "cancelling_at": null,
            "cancelled_at": null,
            "request_counts": {
              "total": 0,
              "completed": 0,
              "failed": 0
            },
            "metadata": null
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```
