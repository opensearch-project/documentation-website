---
layout: default
title: Execute stream agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 25
---

# Execute Stream Agent API
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The Execute Stream Agent API provides the same functionality as the [Execute Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/) but returns responses in a streaming format, delivering data in chunks as it becomes available. This streaming approach is particularly beneficial for large language model interactions with lengthy responses, allowing you to see partial results immediately rather than waiting for the complete response.

This API currently supports conversational agents with the following remote model types:
- [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/completions)
- [Amazon Bedrock Converse Stream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

## Endpoint

```json
POST /_plugins/_ml/agents/<agent_id>/_execute/stream
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

If you're using the security demo certificates, update the setting from `plugins.security.ssl.transport.enforce_hostname_verification: false` to `transport.ssl.enforce_hostname_verification: false` in your `opensearch.yml` file.
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
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}${parameters._interactions:-}]${parameters.tool_configs:-} }"
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
                "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [${parameters._chat_history:-}{\"role\":\"user\",\"content\":[{\"text\":\"${parameters.prompt}\"}]}${parameters._interactions:-}]${parameters.tool_configs:-} }"
            }
        ]
    }
}
```
{% include copy-curl.html %}

#### Step 3: Register a conversational agent

When registering your agent, you must include the `_llm_interface` parameter that corresponds to your model type:
- OpenAI Chat Completion: `openai/v1/chat/completions`
- Amazon Bedrock Converse Stream: `bedrock/converse/claude`

To register your agent, send the following request:

```json
POST /_plugins/_ml/agents/_register
{
    "name": "Chat Agent with RAG",
    "type": "conversational",
    "description": "This is a test agent",
    "llm": {
        "model_id": "<model_id_from_step_2>",
        "parameters": {
            "max_iteration": 5,
            "system_prompt": "You are a helpful assistant. You are able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics.\nIf the question is complex, you will split it into several smaller questions, and solve them one by one. For example, the original question is:\nhow many orders in last three month? Which month has highest?\nYou will spit into several smaller questions:\n1.Calculate total orders of last three month.\n2.Calculate monthly total order of last three month and calculate which months order is highest. You MUST use the available tools everytime to answer the question",
            "prompt": "${parameters.question}"
        }
    },
    "memory": {
        "type": "conversation_index"
    },
    "parameters": {
        "_llm_interface": "openai/v1/chat/completions"
    },
    "tools": [
        {
            "type": "IndexMappingTool",
            "name": "DemoIndexMappingTool",
            "parameters": {
                "index": "${parameters.index}",
                "input": "${parameters.question}"
            }
        },
        {
            "type": "ListIndexTool",
            "name": "RetrieveIndexMetaTool",
            "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
        }
    ],
    "app_type": "my_app"
}
```
{% include copy-curl.html %}

## Example request

```json
POST /_plugins/_ml/agents/<agent_id>/_execute/stream
{
    "parameters": {
        "question": "How many indices are in my cluster?"
    }
}
```
{% include copy-curl.html %}

## Example response

```json
data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"[{\"index\":0.0,\"id\":\"call_HjpbrbdQFHK0omPYa6m2DCot\",\"type\":\"function\",\"function\":{\"name\":\"RetrieveIndexMetaTool\",\"arguments\":\"\"}}]","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"[{\"index\":0.0,\"function\":{\"arguments\":\"{}\"}}]","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"{\"choices\":[{\"message\":{\"tool_calls\":[{\"type\":\"function\",\"function\":{\"name\":\"RetrieveIndexMetaTool\",\"arguments\":\"{}\"},\"id\":\"call_HjpbrbdQFHK0omPYa6m2DCot\"}]},\"finish_reason\":\"tool_calls\"}]}","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)\n1,green,open,.plugins-ml-model-group,Msb1Y4W5QeiLs5yUQi-VRg,1,1,2,0,17.1kb,5.9kb\n2,green,open,.plugins-ml-memory-message,1IWd1HPeSWmM29qE6rcj_A,1,1,658,0,636.4kb,313.5kb\n3,green,open,.plugins-ml-memory-meta,OETb21fqQJa3Y2hGQbknCQ,1,1,267,7,188kb,93.9kb\n4,green,open,.plugins-ml-config,0mnOWX5gSX2s-yP27zPFNw,1,1,1,0,8.1kb,4kb\n5,green,open,.plugins-ml-model,evYOOKN4QPqtmUjxsDwJYA,1,1,5,5,421.5kb,210.7kb\n6,green,open,.plugins-ml-agent,I0SpBovjT3C6NABCBzGiiQ,1,1,6,0,205.5kb,111.3kb\n7,green,open,.plugins-ml-task,_Urzn9gdSuCRqUaYAFaD_Q,1,1,100,4,136.1kb,45.3kb\n8,green,open,top_queries-2025.09.26-00444,jb7Q1FiLSl-wTxjdSUKs_w,1,1,1736,126,1.8mb,988kb\n9,green,open,.plugins-ml-connector,YaJORo4jT0Ksp24L5cW1uA,1,1,2,0,97.8kb,48.9kb\n","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"There","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" are","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" ","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"9","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" indices","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" in","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" your","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":" cluster","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":".","is_last":false}}]}]}

data: {"inference_results":[{"output":[{"name":"memory_id","result":"LvU1iJkBCzHrriq5hXbN"},{"name":"parent_interaction_id","result":"L_U1iJkBCzHrriq5hXbs"},{"name":"response","dataAsMap":{"content":"","is_last":true}}]}]}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description                                                                                                 |
| :--- | :--- |:------------------------------------------------------------------------------------------------------------|
| `inference_results` | Array | Contains the streaming response data returned by the agent.                                                       |
| `inference_results.output` | Array | Contains output objects for each inference result.                                                      |
| `inference_results.output.name` | String | The name of the output field. Can be `memory_id`, `parent_interaction_id`, or `response`.                   |
| `inference_results.output.result` | String | The values of the `memory_id` and `parent_interaction_id` fields.                                        |
| `inference_results.output.dataAsMap` | Object | Contains the response content and metadata (present only for a `response` output).                               |
| `inference_results.output.dataAsMap.content` | String | The agent's response content, which can include tool calls, tool results, or final text output.  |
| `inference_results.output.dataAsMap.is_last` | Boolean | Indicates whether this is the final chunk in the stream: `true` for the last chunk, `false` if there are more chunks. |