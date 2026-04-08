---
layout: default
title: Predict stream
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 65
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/train-predict/predict-stream/
---

# Predict Stream API
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The Predict Stream API provides the same functionality as the [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) but returns responses in a streaming format, delivering data in chunks as it becomes available. This streaming approach is particularly beneficial for large language model interactions with lengthy responses, allowing you to see partial results immediately rather than waiting for the complete response.

This API currently supports the following remote model types:
- [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/completions)
- [Amazon Bedrock Converse Stream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

## Endpoint

```json
POST /_plugins/_ml/models/<model_id>/_predict/stream
```

## Prerequisites

Before using this API, ensure that you have fulfilled the following prerequisites.

### Set up your cluster

Follow these steps to set up your cluster.

#### Step 1: Install the required plugins

The Execute Stream Agent API depends on the following plugins, which are included in the OpenSearch distribution but must be explicitly installed as follows:

```bash
bin/opensearch-plugin install transport-reactor-netty4
bin/opensearch-plugin install arrow-flight-rpc
```

For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

#### Step 2: Configure OpenSearch settings

Add these settings to your `opensearch.yml` file or Docker Compose configuration:

```yaml
opensearch.experimental.feature.transport.stream.enabled: true

# Choose one based on your security settings
http.type: reactor-netty4        # security disabled
http.type: reactor-netty4-secure # security enabled

# Multi-node cluster settings (if applicable)
# Use network.host IP for opensearch.yml or node name for Docker
arrow.flight.publish_host: <ip>
arrow.flight.bind_host: <ip>

# Security-enabled cluster settings (if applicable)
transport.stream.type.default: FLIGHT-SECURE
flight.ssl.enable: true
transport.ssl.enforce_hostname_verification: false
```
{% include copy.html %}

If you're using the security demo certificates, change `plugins.security.ssl.transport.enforce_hostname_verification: false` to `transport.ssl.enforce_hostname_verification: false` in your `opensearch.yml` file.
{: .note}

For more information about enabling experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

#### Step 3: Configure JVM options

Add these settings to your `jvm.options` file:

```yaml
-Dio.netty.allocator.numDirectArenas=1
-Dio.netty.noUnsafe=false
-Dio.netty.tryUnsafe=true
-Dio.netty.tryReflectionSetAccessible=true
--add-opens=java.base/java.nio=org.apache.arrow.memory.core,ALL-UNNAMED
```
{% include copy.html %}

### Configure the necessary APIs

Configure the API using the following steps.

#### Step 1: Enable the streaming feature flag

To enable the streaming feature flag, update the cluster settings as follows:

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.ml_commons.stream_enabled": true
  }
}
```
{% include copy-curl.html %}

#### Step 2: Register a compatible externally hosted model

To register an OpenAI Chat Completion model, send the following request:

```json
POST /_plugins/_ml/models/_register
{
    "name": "OpenAI gpt 3.5 turbo",
    "function_name": "remote",
    "description": "OpenAI model",
    "connector": {
        "name": "OpenAI Chat Connector",
        "description": "The connector to OpenAI model service for GPT 3.5",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "endpoint": "api.openai.com",
            "model": "gpt-3.5-turbo"
        },
        "credential": {
            "openAI_key": "<your_api_key>"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }",
                "response_filter": "$.choices[0].delta.content"
            }
        ]
    }
}
```
{% include copy-curl.html %}

To register an Amazon Bedrock Converse Stream model, send the following request:

```json
POST /_plugins/_ml/models/_register
{
    "name": "Amazon Bedrock Converse Stream model",
    "function_name": "remote",
    "description": "Amazon Bedrock Claude model",
    "connector": {
        "name": "Amazon Bedrock Converse",
        "description": "The connector to Amazon Bedrock Converse",
        "version": 1,
        "protocol": "aws_sigv4",
        "credential": {
            "access_key": "<your_aws_access_key>",
            "secret_key": "<your_aws_secret_key>",
            "session_token": "<your_aws_session_token>"
        },
        "parameters": {
            "region": "<your_aws_region>",
            "service_name": "bedrock",
            "response_filter": "$.output.message.content[0].text",
            "model": "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
                "request_body": "{\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"${parameters.inputs}\"}]}]}"
            }
        ]
    }
}
```
{% include copy-curl.html %}

## Example request

To use the Predict Stream API, you must include the `_llm_interface` parameter that corresponds to your model type:
- OpenAI Chat Completion: `openai/v1/chat/completions`
- Amazon Bedrock Converse Stream: `bedrock/converse/claude`

For OpenAI Chat Completion, send the following request:

```json
POST /_plugins/_ml/models/<model_id>/_predict/stream
{
  "parameters": {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Can you summarize Prince Hamlet of William Shakespeare in around 1000 words?"
      }
    ],
    "_llm_interface": "openai/v1/chat/completions"
  }
}
```
{% include copy-curl.html %}

For Amazon Bedrock Converse Stream, send the following request:

```json
POST /_plugins/_ml/models/<model_id>/_predict/stream
{
  "parameters": {
    "inputs": "Can you summarize Prince Hamlet of William Shakespeare in around 1000 words?",
    "_llm_interface": "bedrock/converse/claude"
  }
}
```
{% include copy-curl.html %}

## Example response

The streaming format uses Server-Sent Events (SSE), with each chunk containing a portion of the model's response, and an `is_last` flag to indicate completion.

```json
data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"Sure","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"!","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"Ham","is_last":false}}]}]}

...

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":" psyche","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":".","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"","is_last":true}}]}]}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description                                                                                                 |
| :--- | :--- |:------------------------------------------------------------------------------------------------------------|
| `inference_results` | Array | Contains the streaming response data returned by the model.                                                        |
| `inference_results.output` | Array | Contains output objects for each inference result.                                                      |
| `inference_results.output.name` | String | The name of the output field (typically, `response`).                                                         |
| `inference_results.output.dataAsMap` | Object | Contains the response content and metadata.                                                             |
| `inference_results.output.dataAsMap.content` | String | The text content chunk from the model's response.                                                           |
| `inference_results.output.dataAsMap.is_last` | Boolean | Indicates whether this is the final chunk in the stream: `true` for the last chunk, `false` if there are more chunks. |