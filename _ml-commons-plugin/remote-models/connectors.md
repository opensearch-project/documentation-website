---
layout: default
title: Connectors
has_children: true
has_toc: false
nav_order: 61
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from: 
  - /ml-commons-plugin/extensibility/connectors/
---

# Connectors for third-party ML platforms
**Introduced 2.9**
{: .label .label-purple }

A connector defines how OpenSearch calls a model hosted on an external platform, such as Amazon Bedrock, Amazon SageMaker, OpenAI, Cohere, or Google Cloud Vertex AI. The connector contains the model endpoint URL, the credentials, and a template for the request body that OpenSearch sends to the model.

## Connector blueprints

To create a connector, start from a _connector blueprint_, a connector definition for a specific model that you can copy and complete with your own values. You can use one of the following blueprints:

- An OpenSearch-provided blueprint. To find the blueprint for your model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- Your own blueprint, if OpenSearch doesn't provide one for your model. For more information, see [Creating a custom blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

The connector `protocol` field determines how OpenSearch authenticates to the model platform. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).

## Creating a connector

You can create a connector in one of the following ways.

| Connector type | How to create it | Models that can use it | Access required to use it |
| :--- | :--- | :--- | :--- |
| [Standalone connector](#creating-a-standalone-connector) | Send a Create Connector API request. | Any number of models that call the same model endpoint using the same configuration. | Access to the connector and to the model. |
| [Connector for a specific model](#creating-a-connector-for-a-specific-model) | Provide the connector definition in the `connector` object of a Register Model API request. | Only the model registered in the same request. | Access to the model. |

The access requirements apply when connector access control and model access control are enabled. For more information, see [Configuring connector access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#configuring-connector-access-control).

If you need to connect to a different external model (for example, switching from `gpt-4o-mini` to `gpt-4o`), we recommend creating a separate standalone connector. Alternatively, if the connector request body template uses a placeholder for the model name, you can override the model name in each Predict request. For more information, see [Providing input as parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/#providing-input-as-parameters).
{: .note}

If using Python, you can create connectors using the [`opensearch-py-ml`](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

### Creating a standalone connector

To create a standalone connector, send a request to the `connectors/_create` endpoint and provide all of the parameters described in [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields):

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
        "openAI_key": "<openai_key>"
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

### Creating a connector for a specific model

To create a connector for a specific model, provide all of the parameters described in [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields) within the `connector` object of a request to the `models/_register` endpoint:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-gpt-4o-mini",
    "function_name": "remote",
    "description": "OpenAI gpt-4o-mini model with a connector",
    "connector": {
        "name": "OpenAI Chat Connector",
        "description": "The connector to public OpenAI model service for gpt-4o-mini",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "endpoint": "api.openai.com",
            "model": "gpt-4o-mini"
        },
        "credential": {
            "openAI_key": "<openai_key>"
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
}
```
{% include copy-curl.html %}

## Updating connector credentials

In some cases, you may need to update the credentials used to connect to an externally hosted model, such as an expiring API key. To do this without undeploying the model, provide the new credentials in an update request.

### Connector for a specific model

To update credentials for a connector linked to a specific model, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/models/{model_id}
{
  "connector": {
    "credential": {
      "openAI_key": "<new_openai_key>"
    }
  }
}
```
{% include copy-curl.html %}

### Standalone connector

To update credentials for a standalone connector, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/connectors/{connector_id}
{
  "credential": {
    "openAI_key": "<new_openai_key>"
  }
}
```
{% include copy-curl.html %}

## Next steps

- To learn how a connector builds the request that it sends to the model and processes the model response, see [Connector input and output]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-input-output/).
- To find the blueprint and protocol for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To pass per-request values in connector headers, see [Dynamic header substitution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/dynamic-header-substitution/).
- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
