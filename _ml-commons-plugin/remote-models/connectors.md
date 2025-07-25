---
layout: default
title: Connectors
has_children: false
has_toc: false
nav_order: 61
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
redirect_from: 
  - /ml-commons-plugin/extensibility/connectors/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/connectors/
---

# Creating connectors for third-party ML platforms
**Introduced 2.9**
{: .label .label-purple }

Connectors facilitate access to models hosted on third-party machine learning (ML) platforms. 

OpenSearch provides connectors for several platforms, for example:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage the lifecycle of text embedding models, powering semantic search queries in OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferences. This benefits Amazon SageMaker users who value its functionality, such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [OpenAI ChatGPT](https://platform.openai.com/docs/introduction) enables you to invoke an OpenAI chat model from inside an OpenSearch cluster.
- [Cohere](https://cohere.com/) allows you to use data from OpenSearch to power the Cohere large language models.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) supports models like [Bedrock Titan Embeddings](https://aws.amazon.com/bedrock/titan/), which can drive semantic search and retrieval-augmented generation in OpenSearch.

## Connector blueprints

A _connector blueprint_ defines the set of parameters (the request body) you need to provide when sending an API request to create a specific connector. Connector blueprints may differ based on the platform and the model that you are accessing.

OpenSearch provides connector blueprints for several ML platforms and models. For a full list of connector blueprints provided by OpenSearch, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/). 

As an ML developer, you can also create connector blueprints for other platforms and models. Data scientists and administrators can then use the blueprint to create connectors. They are only required to enter their `credential` settings, such as `openAI_key`, for the service to which they are connecting. For information about creating connector blueprints, including descriptions of all parameters, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).


## Creating a connector

You can provision connectors in two ways:

1. [Create a standalone connector](#creating-a-standalone-connector): A standalone connector can be reused and shared by multiple models but requires access to both the model and connector in OpenSearch and the third-party platform, such as OpenAI or Amazon SageMaker, that the connector is accessing. Standalone connectors are saved in a connector index.

2. [Create a connector for a specific externally hosted model](#creating-a-connector-for-a-specific-model): Alternatively, you can create a connector that can only be used with the model for which it was created. To access such a connector, you only need access to the model itself because the connection is established inside the model. These connectors are saved in the model index.

## Creating a standalone connector

Standalone connectors can be used by multiple models. To create a standalone connector, send a request to the `connectors/_create` endpoint and provide all of the parameters described in [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/):

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
            "openAI_key": "..."
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

## Connector examples

The following sections contain examples of connectors for popular ML platforms. For a full list of supported connectors, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

### OpenAI chat connector

You can use the following example request to create a standalone OpenAI chat connector:

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

### Amazon SageMaker connector

You can use the following example request to create a standalone Amazon SageMaker connector:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "sagemaker: embedding",
    "description": "Test connector for Sagemaker embedding model",
    "version": 1,
    "protocol": "aws_sigv4",
    "credential": {
        "access_key": "...",
        "secret_key": "...",
        "session_token": "..."
    },
    "parameters": {
        "region": "us-west-2",
        "service_name": "sagemaker"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://runtime.sagemaker.${parameters.region}.amazonaws.com/endpoints/lmi-model-2023-06-24-01-35-32-275/invocations",
            "request_body": "[\"${parameters.inputs}\"]"
        }
    ]
}
```
{% include copy-curl.html %}

The `credential` parameter contains the following options reserved for `aws_sigv4` authentication:

- `access_key`: Required. Provides the access key for the AWS instance.
- `secret_key`: Required. Provides the secret key for the AWS instance.
- `session_token`: Optional. Provides a temporary set of credentials for the AWS instance.

The `parameters` section requires the following options when using `aws_sigv4` authentication:

- `region`: The AWS Region in which the AWS instance is located.
- `service_name`: The name of the AWS service for the connector.

### Cohere connector

You can use the following example request to create a standalone Cohere connector using the Embed V3 model. For more information, see [Cohere connector blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/cohere_connector_embedding_blueprint.md). 

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Cohere Embed Model",
  "description": "The connector to Cohere's public embed API",
  "version": "1",
  "protocol": "http",
  "credential": {
    "cohere_key": "<ENTER_COHERE_API_KEY_HERE>"
  },
  "parameters": {
    "model": "embed-english-v3.0",
    "input_type":"search_document",
    "truncate": "END"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.cohere.ai/v1/embed",
      "headers": {
        "Authorization": "Bearer ${credential.cohere_key}",
        "Request-Source": "unspecified:opensearch"
      },
      "request_body": "{ \"texts\": ${parameters.texts}, \"truncate\": \"${parameters.truncate}\", \"model\": \"${parameters.model}\", \"input_type\": \"${parameters.input_type}\" }",
      "pre_process_function": "connector.pre_process.cohere.embedding",
      "post_process_function": "connector.post_process.cohere.embedding"
    }
  ]
}
```
{% include copy-curl.html %}

### Amazon Bedrock connector

You can use the following example request to create a standalone Amazon Bedrock connector:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector: embedding",
  "description": "The connector to the Bedrock Titan embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "<YOUR AWS REGION>",
    "service_name": "bedrock"
  },
  "credential": {
    "access_key": "<YOUR AWS ACCESS KEY>",
    "secret_key": "<YOUR AWS SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.titan-embed-text-v1/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\" }",
      "pre_process_function": "\n    StringBuilder builder = new StringBuilder();\n    builder.append(\"\\\"\");\n    String first = params.text_docs[0];\n    builder.append(first);\n    builder.append(\"\\\"\");\n    def parameters = \"{\" +\"\\\"inputText\\\":\" + builder + \"}\";\n    return  \"{\" +\"\\\"parameters\\\":\" + parameters + \"}\";",
      "post_process_function": "\n      def name = \"sentence_embedding\";\n      def dataType = \"FLOAT32\";\n      if (params.embedding == null || params.embedding.length == 0) {\n        return params.message;\n      }\n      def shape = [params.embedding.length];\n      def json = \"{\" +\n                 \"\\\"name\\\":\\\"\" + name + \"\\\",\" +\n                 \"\\\"data_type\\\":\\\"\" + dataType + \"\\\",\" +\n                 \"\\\"shape\\\":\" + shape + \",\" +\n                 \"\\\"data\\\":\" + params.embedding +\n                 \"}\";\n      return json;\n    "
    }
  ]
}
```
{% include copy-curl.html %}

## Updating connector credentials

In some cases, you may need to update credentials, such as `access_key`, used to connect to externally hosted models. To do this without undeploying the model, provide the new credentials in an update request.

### Connector for a specific model

To update credentials for a connector linked to a specific model, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/models/<model_id>
{
  "connectors": {
    "credential": {
      "openAI_key": "YOUR NEW OPENAI KEY"
    }
  }
}
```
{% include copy-curl.html %}

### Standalone connector

To update credentials for a standalone connector, provide the new credentials in the following request:

```json
PUT /_plugins/_ml/connectors/<connector_id>
{
  "credential": {
    "openAI_key": "YOUR NEW OPENAI KEY"
  }
}
```
{% include copy-curl.html %}

## Next steps

- For a full list of connector blueprints provided by OpenSearch, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To learn more about connecting to external models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
- To learn more about model access control and model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
