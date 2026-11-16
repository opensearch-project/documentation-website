---
layout: default
title: Connecting to externally hosted models 
parent: Integrating ML models
has_children: true
has_toc: false
nav_order: 60
redirect_from: 
  - /ml-commons-plugin/extensibility/index/
  - /ml-commons-plugin/remote-models/
---

# Connecting to externally hosted models
**Introduced 2.9**
{: .label .label-purple }

OpenSearch can use machine learning (ML) models hosted outside your cluster, such as embedding models and large language models (LLMs) on Amazon Bedrock, Amazon SageMaker, OpenAI, or Cohere. OpenSearch calls the model API each time it needs a result, for example, to generate embeddings for documents during ingestion, to generate an embedding for a semantic search query, to rerank search results, or to generate answers in conversational search and agents.

To call a model, OpenSearch uses a _connector_, which stores the model endpoint URL, the credentials, and a template for the request body. After you create a connector, you can register the model and use it in search requests, ingest pipelines, and agents. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). 

## Prerequisites

Before you create a connector, ensure that the model is deployed on its platform and that you have credentials that allow you to call the model API.

If your model platform requires authentication, provide the credentials in the connector `credential` object. Depending on the platform, OpenSearch either signs requests using these credentials or sends them in a request header that refers to them, for example, `"Authorization": "Bearer ${credential.openAI_key}"`. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).

### Adding trusted endpoints

To configure connectors in OpenSearch, add the trusted endpoints to your cluster settings by using the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, which supports Java regex expressions. The following request sets the default list of trusted endpoints. To trust another endpoint, add its pattern to this list:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.trusted_connector_endpoints_regex": [
          "^https://runtime\\.sagemaker\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://api\\.sagemaker\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://api\\.openai\\.com/.*$",
          "^https://api\\.cohere\\.ai/.*$",
          "^https://api\\.deepseek\\.com/.*$",
          "^https://generativelanguage\\.googleapis\\.com/.*$",
          "^https://([a-z0-9][a-z0-9-]*-)?aiplatform\\.googleapis\\.com/.*$",
          "^https://bedrock-runtime\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://bedrock-agent-runtime\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://bedrock\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://textract\\..*[a-z0-9-]\\.amazonaws\\.com$",
          "^https://comprehend\\..*[a-z0-9-]\\.amazonaws\\.com$",
          "^https://rekognition(-fips)?\\..*[a-z0-9-]\\.amazonaws\\.com$"
        ]
    }
}
```
{% include copy-curl.html %}

This setting replaces the entire list of trusted endpoints, so include every pattern your cluster needs.
{: .note}

If your model runs on a private network, for example, a model served by Ollama on the same host or on an internal server, also set `plugins.ml_commons.connector.private_ip_enabled` to `true`. If you change this setting after deploying a model, redeploy the model to apply the change. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

### Configuring connector access control

To control which users can access a connector, enable the Security plugin and connector access control. Without the Security plugin, OpenSearch doesn't restrict connector access: any client that can send requests to the cluster can use all connectors.

To enable connector access control, update the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": true
    }
}
```
{% include copy-curl.html %}

If successful, OpenSearch returns the following response:

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

When both the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/) and connector access control are enabled, you can control access to a connector by providing the `backend_roles`, `add_all_backend_roles`, or `access_mode` options when you create it. If you don't provide any of these options, the connector is private. If either the Security plugin or connector access control is disabled, the Create Connector API rejects requests that contain these options.

## Step 1: Create a connector

OpenSearch provides connector blueprints that you can use to connect to different models and platforms. To find a connector to your model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/). 

To create a connector, send a [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/) request containing the connector definition from the blueprint for your model. The following request creates a connector to the OpenAI `gpt-4o-mini` chat model. The `endpoint` and `model` values in the connector `parameters` object fill the placeholders in the `url` and `request_body` templates:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Chat Connector",
    "description": "The connector to public OpenAI model service for gpt-4o-mini",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "model": "gpt-4o-mini"
    },
    "credential": {
        "openAI_key": "<openai_api_key>"
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

The preceding request creates a standalone connector, which several models can use. To create a connector that only one model can use, provide the connector definition when you register the model. For more information, see [Creating a connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-connector).

## Step 2: Register an externally hosted model

To register an externally hosted model, provide the connector ID from Step 1 in the following request. You must specify the `function_name` as `remote`:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-4o-mini",
    "function_name": "remote",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```
{% include copy-curl.html %}

OpenSearch returns the task ID of the register operation and the model ID of the registered model:

```json
{
  "task_id": "cVeMb4kBJ1eYAeTMFFgj",
  "status": "CREATED",
  "model_id": "cleMb4kBJ1eYAeTMFFg4"
}
```

OpenSearch creates a model group for the model. Model groups control which users can access a model. When the Security plugin and model access control are enabled, the new model group is private by default. For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

To check the status of the operation, provide the task ID to the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```json
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

Note the returned `model_id`; you'll need it to use the model.

OpenSearch deploys the model automatically when you send the first Predict API request for it. If automatic deployment is turned off using the `plugins.ml_commons.model_auto_deploy.enable` setting, deploy the model using the [Deploy API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/) before you send requests to it. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Step 3 (Optional): Test the model

To test the model, send a [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) request. In the `parameters` object, provide values for the placeholders in the connector request body template. For this connector, provide only `messages`, because the connector `parameters` object provides a default value for `model`. For more information, see [Providing input as parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#providing-input-as-parameters):

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

The `dataAsMap` object in the response contains the OpenAI response:

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
            "model": "gpt-4o-mini",
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
      ],
      "status_code": 200
    }
  ]
}
```

## Step 4: Use the model

In this example, you connected to an OpenAI chat model, which you can use to generate answers from search results. For information about using chat models, see [Conversational search with RAG]({{site.url}}{{site.baseurl}}/vector-search/ai-search/conversational-search/).

To learn how to use other types of models, such as embedding and rerank models, see [AI search methods]({{site.url}}{{site.baseurl}}/vector-search/ai-search/#ai-search-methods). 

To generate embeddings for large volumes of documents using an embedding model, see [Using externally hosted ML models for batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/).

## Step 5 (Optional): Undeploy the model 

You can undeploy the model automatically by defining a time to live (TTL) in the model settings or by using the Undeploy API to undeploy the model manually. For more information, see [Undeploy API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/).

## Next steps

- For more information about connectors, including example connectors, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
- To learn how a connector builds the request that it sends to the model and processes the model response, see [Connector input and output]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/).
- For more information about connector fields, see [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields).
- To create a connector and register and deploy a model in a single request, use a workflow template. For more information, see [Model deployment templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-templates/#model-deployment-templates).
- For more information about managing ML models in OpenSearch, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).
- For more information about interacting with ML models in OpenSearch, see [Managing ML models in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-dashboard/).
- To configure model guardrails, see [Guardrails]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/guardrails/).
