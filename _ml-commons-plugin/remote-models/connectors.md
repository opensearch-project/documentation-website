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

Connectors facilitate access to models hosted on third-party machine learning (ML) platforms. 

OpenSearch provides connectors for several platforms, for example:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the lifecycle of text embedding models, powering semantic search queries in OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value its functionality, such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [OpenAI ChatGPT](https://platform.openai.com/docs/introduction) enables you to invoke an OpenAI chat model from inside an OpenSearch cluster.
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power the Cohere large language models.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) supports models like [Bedrock Titan Embeddings](https://aws.amazon.com/bedrock/titan/), which can drive semantic search and retrieval-augmented generation in OpenSearch.
- [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai) enables you to invoke Vertex AI models, such as Gemini and text embedding models, from inside an OpenSearch cluster.

## Connector blueprints

Creating a connector requires two pieces of information: the request and response format for your model, and the authentication method for your platform:

- The request and response format is specified in a _connector blueprint_, which defines the set of fields (the request body) to provide when creating a connector for a specific platform and model. To find a pre-built blueprint for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/). For descriptions of all connector fields or to create a blueprint for a platform or model that OpenSearch does not provide, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

- The authentication method is specified in the connector's `protocol` field and is determined by the platform. For more information, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).

## Creating a connector

You can provision connectors in two ways:

1. [Create a standalone connector](#creating-a-standalone-connector): A standalone connector can be reused by multiple model registrations in OpenSearch that share the same external endpoint and configuration. Standalone connectors require access to both the connector and the model in OpenSearch as well as the third-party platform. Standalone connectors are saved in a connector index.

2. [Create a connector for a specific externally hosted model](#creating-a-connector-for-a-specific-model): Alternatively, you can create a connector that can only be used with the model for which it was created. To access such a connector, you only need access to the model itself because the connection is established inside the model. These connectors are saved in the model index.

If you need to connect to a different external model (for example, switching from `gpt-3.5-turbo` to `gpt-4`), we recommend creating a separate standalone connector. Alternatively, advanced users can override connector `parameters` at predict time if the connector blueprint uses placeholders. For more information, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
{: .note}

If using Python, you can create connectors using the [`opensearch-py-ml`](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

## Creating a standalone connector

To create a standalone connector, send a request to the `connectors/_create` endpoint and provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/):

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

## Creating a connector for a specific model

To create a connector for a specific model, provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) within the `connector` object of a request to the `models/_register` endpoint:

```json
POST /_plugins/_ml/models/_register
{
    "name": "openAI-GPT-3.5 model with a connector",
    "function_name": "remote",
    "model_group_id": "lEFGL4kB4ubqQRzegPo2",
    "description": "test model",
    "connector": {
        "name": "OpenAI Connector",
        "description": "The connector to public OpenAI model service for GPT 3.5",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "endpoint": "api.openai.com",
            "max_tokens": 7,
            "temperature": 0,
            "model": "text-davinci-003"
        },
        "credential": {
            "openAI_key": "<openai_key>"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"prompt\": \"${parameters.prompt}\", \"max_tokens\": ${parameters.max_tokens}, \"temperature\": ${parameters.temperature} }"
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
  "connectors": {
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

- To find the blueprint and protocol for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To pass per-request values in connector headers, see [Dynamic header substitution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/dynamic-header-substitution/).
- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
