---
layout: default
title: Connecting to other ML platforms
has_children: false
nav_order: 60
---

# Connecting to other ML platforms

Machine Learning (ML) Connectors enables the ability to integrate OpenSearch's ML capabilities with third-party ML tools and platforms. Through connectors, OpenSearch can invoke these third-party endpoints to enrich query results and data pipelines.

## Supported connectors

As of OpenSearch 2.9, connectors have been tested for the following ML tools, though its possible to make connectors for tools not listed:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker/) allows you to host and manage manage the life cycle of text embedding models on Amazon SageMaker, powering semantic search queries on OpenSearch. When connected, Amazon SageMaker hosts your models and OpenSearch is used to query inferances. This benefits Amazon SageMaker users who value it's functionality such as model monitoring, serverless hosting, and workflow automation for continuous training and deployment.
- [Amazon Comprehend](https://aws.amazon.com/comprehend/) allows you to extract metadata automatically from OpenSearch ingest pipeline, enriching data indexed in OpneSearch and improving your search capabilities. 
- [ChatGPT](https://openai.com/blog/chatgpt) enables you to run OpenSearch queries while invoking the ChatGPT API, helping you build on OpenSearch faster and improves the speed in which OpenSearch search functionality can retrieve data.
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) is an alternative to ChatGPT inside a fully managed-service.
- [NVIDIA Triton](https://developer.nvidia.com/triton-inference-server) allows you to host text embedding models on NVIDIA's high performance model serving technology. Power semantic search queries and vector generation ingest pipelines using [GPU-acceleration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/gpu-acceleration).

## Prerequisites

If you are an admin deploying wanting to use an ML connector, make sure that target model of the connector has already been deployed on your chosen platform. Furthermore, make sure that you have access to send and receive data to the third-party API for your connector. 

When access control is enabled on your third-party platform, you can enter your security settings using the `authorization` or `credential` settings inside the connector API.


## Setting up connector access control

To enable access control on the connector API, use the following cluster setting. When enabled, the `authorization` or `credential` options will be required in order to use the connector API.

```
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": false
    }
}
```

If successful, OpenSearch returns the following response:

```
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

## Creating a connector

The connector create API, `/_plugins/_ml/connectors/_create`, creates connections to third-party ML tools. Using the `endpoint` parameter, you can connect to any supported ML tool using their specific API endpoint. For example, to connect to a ChatGPT completetion model, you can connect using the `api.openai.com` as shown in the following example:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "OpenAI Connector",
    "description": "The connector to public OpenAI model service for GPT 3.5",
    "version": 1,
    "protocol": "http",
    "parameters": {
        "endpoint": "api.openai.com",
        "auth": "API_Key",
        "content_type": "application/json",
        "max_tokens": 7,
        "temperature": 0,
        "model": "text-davinci-003"
    },
    "credential": {
        "openAI_key": "<encrypted-key>"
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
    ],
    "access_mode": "public"
}
```

If successful, the connector API responds with a `connector_id` and `status` for the connection.

```
{
 "connector_id": "M2pBmYgB5cK1H70wk3hd",
 "status": "CREATED"
}
```

## Configuration options

The following configuration options are **required** in order to build a connector:

| Field | Data type | Description |
| :---  | :--- | :--- |
| `name` | String | The name of the connector. |
| `description` | String | The description for the connector. |
| `version` | Integer | The version for the connector. |
| `protocol` | String | The protocol for the connection. For AWS services such as SageMaker and Bedrock, use `aws_sigv4`. For all other services, use `http`. |
| `parameter` | JSON array | The default connector parameters, including `endpoint` and `model`. 

The following configuration are **optional**:

| Field | Data type | Description |
| :---  | :--- | :--- |
| `credential` | 
| `action` |

