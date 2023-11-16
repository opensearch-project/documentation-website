---
layout: default
title: Connecting to remote models 
has_children: true
has_toc: false
nav_order: 60
---

# Connecting to remote models
**Introduced 2.9**
{: .label .label-purple }

Machine learning (ML) extensibility enables ML developers to create integrations with other ML services, such as Amazon SageMaker or OpenAI. These integrations provide system administrators and data scientists the ability to run ML workloads outside of their OpenSearch cluster. 

To get started with ML extensibility, choose from the following options:

- If you're an ML developer wanting to integrate with your specific ML services, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints/).
- If you're a system administrator or data scientist wanting to create a connection to an ML service, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).

## Prerequisites

If you're an admin deploying an ML connector, make sure that the target model of the connector has already been deployed on your chosen platform. Furthermore, make sure that you have permissions to send and receive data to the third-party API for your connector. 

When access control is enabled on your third-party platform, you can enter your security settings using the `authorization` or `credential` settings inside the connector API.

### Adding trusted endpoints

To configure connectors in OpenSearch, add the trusted endpoints to your cluster settings by using the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, which supports Java regex expressions:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.trusted_connector_endpoints_regex": [
          "^https://runtime\\.sagemaker\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://api\\.openai\\.com/.*$",
          "^https://api\\.cohere\\.ai/.*$",
          "^https://bedrock-runtime\\..*[a-z0-9-]\\.amazonaws\\.com/.*$"
        ]
    }
}
```
{% include copy-curl.html %}



### Setting up connector access control

If you plan on using a remote connector, make sure to use an OpenSearch cluster with the Security plugin enabled. Using the Security plugin gives you access to connector access control, which is required when using a remote connector.
{: .warning}

If you require granular access control for your connectors, use the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": true
    }
}
```
{% include copy-curl.html %}

When access control is enabled, you can install the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/). This makes the `backend_roles`, `add_all_backend_roles`, or `access_model` options required in order to use the connector API. If successful, OpenSearch returns the following response:

```json
{
  "acknowledged": true,
  "persistent": {
    "plugins": {
      "ml_commons": {
        "connector_access_control_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

### Node settings

Remote models based on external connectors consume fewer resources. Therefore, you can deploy any model from a standalone connector using data nodes. To make sure that your standalone connection uses data nodes, set `plugins.ml_commons.only_run_on_ml_node` to `false`:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": false
    }
}

```
{% include copy-curl.html %}

## Step 1: Register a model group

To register a model, you have the following options:

- You can use `model_group_id` to register a model version to an existing model group.
- If you do not use `model_group_id`, ML Commons creates a model with a new model group.

To register a model group, send the following request:

```json
POST /_plugins/_ml/model_groups/_register
{
  "name": "remote_model_group",
  "description": "A model group for remote models"
}
```
{% include copy-curl.html %}

The response contains the model group ID that you'll use to register a model to this model group:

```json
{
 "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
 "status": "CREATED"
}
```

To learn more about model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Step 2: Create a connector

You can create a standalone connector or an internal connector as part of a specific model. For more information about connectors and connector examples, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).

The Connectors Create API, `/_plugins/_ml/connectors/_create`, creates connectors that facilitate registering and deploying external models in OpenSearch. Using the `endpoint` parameter, you can connect ML Commons to any supported ML tool by using its specific API endpoint. For example, you can connect to a ChatGPT model by using the `api.openai.com` endpoint:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-3.5-turbo"
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

The response contains the connector ID for the newly created connector:

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

## Step 3: Register a remote model

To register a remote model to the model group created in step 1, provide the model group ID from step 1 and the connector ID from step 2 in the following request:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-3.5-turbo",
    "function_name": "remote",
    "model_group_id": "1jriBYsBq7EKuKzZX131",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```
{% include copy-curl.html %}

OpenSearch returns the task ID of the register operation:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/#get-a-task-by-id):

```bash
GET /_plugins/_ml/tasks/cVeMb4kBJ1eYAeTMFFgj
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```json
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

## Step 4: Deploy the remote model

To deploy the registered model, provide its model ID from step 3 in the following request:

```bash
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_deploy
```
{% include copy-curl.html %}

The response contains the task ID that you can use to check the status of the deploy operation:

```json
{
  "task_id": "vVePb4kBJ1eYAeTM7ljG",
  "status": "CREATED"
}
```

As in the previous step, check the status of the operation by calling the Tasks API:

```bash
GET /_plugins/_ml/tasks/vVePb4kBJ1eYAeTM7ljG
```
{% include copy-curl.html %}

When the operation is complete, the state changes to `COMPLETED`:

```json
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

## Step 5 (Optional): Test the remote model

Use the [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) to test the model:

```json
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }
}
```
{% include copy-curl.html %}

To learn more about chat functionality within OpenAI, see the [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat).

The response contains the inference results provided by the OpenAI model:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "chatcmpl-7e6s5DYEutmM677UZokF9eH40dIY7",
            "object": "chat.completion",
            "created": 1689793889,
            "model": "gpt-3.5-turbo-0613",
            "choices": [
              {
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": "Hello! How can I assist you today?"
                },
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 19,
              "completion_tokens": 9,
              "total_tokens": 28
            }
          }
        }
      ]
    }
  ]
}
```

## Step 6: Use the model for search

To learn how to set up a vector index and use text embedding models for search, see [Neural text search]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/).

To learn how to set up a vector index and use sparse encoding models for search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

To learn how to set up a vector index and use multimodal embedding models for search, see [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

## Next steps

- For more information about connectors, including connector examples, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).
- For more information about connector parameters, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints/).
- For more information about interacting with ML models in OpenSearch, see [Managing ML models in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-dashboard/)
