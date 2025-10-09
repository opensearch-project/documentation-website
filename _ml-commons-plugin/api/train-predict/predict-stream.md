---
layout: default
title: Predict Stream
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 65
---

# Predict Stream API
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The Predict Stream API provides the same functionality as the [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/), with the key difference being that it returns responses in a streaming format, delivering data in chunks as it becomes available. This streaming approach is particularly beneficial for large language model interactions with lengthy responses, allowing you to see partial results immediately rather than waiting for the complete response.

This API currently supports the following remote model types:
- [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/completions)
- [Amazon Bedrock Converse Stream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

## Endpoint

```json
POST /_plugins/_ml/models/<model_id>/_predict/stream
```

## Prerequisites

### Cluster setup 

#### Step 1: Verify required plugins (Optional)

The Predict Stream API depends on the following plugins, which should be included in the default OpenSearch distribution:
- `transport-reactor-netty4`
- `arrow-flight-rpc`

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
```

#### Step 3: Configure JVM options

Add these settings to your `jvm.options` file:

```yaml
-Dio.netty.allocator.numDirectArenas=1
-Dio.netty.noUnsafe=false
-Dio.netty.tryUnsafe=true
-Dio.netty.tryReflectionSetAccessible=true
--add-opens=java.base/java.nio=org.apache.arrow.memory.core,ALL-UNNAMED
```

### API configuration

#### Step 1: Enable the streaming feature flag

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.ml_commons.stream_enabled": true
  }
}
```
{% include copy-curl.html %}

#### Step 2: Register a compatible remote model

**OpenAI Chat Completion**

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

**Amazon Bedrock Converse Stream**

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

**OpenAI Chat Completion**
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

**Amazon Bedrock Converse Stream**
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

The streaming format uses Server-Sent Events (SSE) with each chunk containing a portion of the model's response and an `is_last` flag to indicate completion.

```json
data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"Sure","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"!","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"Ham","is_last":false}}]}]}

...

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":" psyche","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":".","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"response","dataAsMap":{"content":"","is_last":true}}]}]}
```