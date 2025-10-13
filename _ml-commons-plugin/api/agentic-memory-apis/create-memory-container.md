---
layout: default
title: Create memory container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Memory Container API
**Introduced 3.2**
{: .label .label-purple }

Use this API to create a memory container to hold agentic memories. The container can have two model types associated with it:

- A text embedding model for vectorizing the message so it can be searched. Use a text embedding model for dense vector embeddings or a sparse encoding model for sparse vector formats. If no embedding model is specified, messages are stored but cannot be used for vector-based searches.
- A large language model (LLM) for reasoning over the message to produce factual or processed content. If no LLM is specified, messages are stored directly, without applying inference. Long term memory requires both an LLM model and embedding model to be configured.

**Note**: LLM connectors must support `system_prompt` and `user_prompt` parameters for agentic memory processing. The default `llm_result_path` is configured for Bedrock Converse API format (`"$.output.message.content[0].text"`).

**Note**: LLM connectors must support `system_prompt` and `user_prompt` parameters for agentic memory processing. The default `llm_result_path` is configured for Bedrock Converse API format (`"$.output.message.content[0].text"`).

Once a memory container is created, you'll provide its `memory_container_id` to other APIs.

## Prerequisites

If you want to use one of the model types to process memories, register the models in OpenSearch.

### Embedding model 

Register either a local or externally hosted embedding model. OpenSearch supports text embedding and sparse encoding models. 

For more information about using models locally, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). For a list of supported models, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#supported-pretrained-models).


For more information about using externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). For example, to register an externally hosted Amazon Titan Embeddings model, send the following request:

```json
POST /_plugins/_ml/models/_register
{
    "name": "Bedrock embedding model",
    "function_name": "remote",
    "description": "test model",
    "connector": {
        "name": "Amazon Bedrock Connector: embedding",
        "description": "The connector to bedrock Titan embedding model",
        "version": 1,
        "protocol": "aws_sigv4",
        "parameters": {
              "region": "us-east-1",
              "service_name": "bedrock",
              "model": "amazon.titan-embed-text-v2:0",
              "dimensions": 1024,
             "normalize": true,
             "embeddingTypes": [
              "float"
            ]
        },
        "credential": {
             "access_key": "...",
             "secret_key": "...",
             "session_token": "..."
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
                "headers": {
                    "content-type": "application/json",
                    "x-amz-content-sha256": "required"
                },
                "request_body": """{ "inputText": "${parameters.inputText}", "dimensions": ${parameters.dimensions}, "normalize": ${parameters.normalize}, "embeddingTypes": ${parameters.embeddingTypes} }""",
                "pre_process_function": "connector.pre_process.bedrock.embedding",
                "post_process_function": "connector.post_process.bedrock.embedding"
            }
        ]
    }
}
```
{% include copy-curl.html %}

### LLM 


To register an Anthropic Claude model, send the following request:

```json
POST /_plugins/_ml/models/_register
{
    "name": "Bedrock infer model",
    "function_name": "remote",
    "description": "test model",
    "connector": {
        "name": "Amazon Bedrock Connector: Chat",
        "description": "The connector to bedrock Claude 3.7 sonnet model",
        "version": 1,
        "protocol": "aws_sigv4",
        "parameters": {
            "region": "us-east-1",
            "service_name": "bedrock",
            "max_tokens": 8000,
            "temperature": 1,
            "anthropic_version": "bedrock-2023-05-31",
            "model": "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
        },
        "credential": {
            "access_key": "...",
            "secret_key": "...",
            "session_token": "..."
            },
        "actions": [
            {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
            "request_body": "{  \"anthropic_version\": \"${parameters.anthropic_version}\", \"max_tokens\": ${parameters.max_tokens}, \"temperature\": ${parameters.temperature}, \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [ { \"role\": \"user\", \"content\": [ {\"text\": \"${parameters.user_prompt}\" }] }]}"
            }
        ]
    }
}
```
{% include copy-curl.html %}

The `system_prompt` parameter is required for Claude models.
{: .note}

For more information about using externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

## Endpoint

```json
POST /_plugins/_ml/memory_containers/_create
```

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- |:------------------| :---
`name` | String | Required          | The name of the memory container.
`description` | String | Optional          | The description of the memory container.
`configuration` | Object | Optional          | The memory container configuration. See [the `configuration` object](#the-configuration-object).

### The configuration object

The `configuration` object supports the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`embedding_model_type` | String | Optional | The embedding model type. Supported types are `TEXT_EMBEDDING` and `SPARSE_ENCODING`.
`embedding_model_id` | String | Optional | The embedding model ID.
`embedding_dimension` | Integer | Optional | The dimension of the embedding model. Required if `embedding_model_type` is `TEXT_EMBEDDING`.
`llm_id` | String | Optional | The LLM model ID for processing and inference.
`index_prefix` | String | Optional | Custom prefix for the memory indices. If not specified, a default prefix is used: if `use_system_index` is `true`, use `default` as index prefix; if `use_system_index` is `false`, use 8 bit random UUID as index prefix.
`use_system_index` | Boolean | Optional | Whether to use system indices. Default is `true`.
`disable_history`  | Boolean | Optional | if disabled no history will be persisted. Default is `false`, so history will be persisted by default.
`disable_session`  | Boolean | Optional | if disabled no session will be persisted. Default is `true`, so session will not be persisted by default.
`max_infer_size`   | int     | Optional | `max_infer_size` Controls the topK number of similar existing memories retrieved during memory consolidation to make ADD/UPDATE/DELETE decisions.
`index_settings`   | Map<String, Map<String, Object> | Optional | Customer can also provide the index settings. See [the `index settings` array](#the-index-settings).
`strategies` | Array | Optional | Array of memory processing strategies. See [the `strategies` array](#the-strategies-array).
`parameters` | Object | Optional | Global parameters for the memory container. See [the `parameters` object](#the-parameters-object).

### The index settings

Example of index settings

    "index_settings": {
      "session_index" : {
        "index": {
          "number_of_shards": "2",
          "number_of_replicas": "2"
        }
      },
      "short_term_memory_index" : {
        "index": {
          "number_of_shards": "2",
          "number_of_replicas": "2"
        }
      },
      "long_term_memory_index" : {
        "index": {
          "number_of_shards": "2",
          "number_of_replicas": "2"
        }
      },
      "long_term_memory_history_index" : {
        "index": {
          "number_of_shards": "2",
          "number_of_replicas": "2"
        }
      }
    }

### The strategies array

Each strategy in the `strategies` array supports the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`type` | String | Required | The strategy type: `SEMANTIC`, `USER_PREFERENCE`, or `SUMMARY`.
`namespace` | Array | Required | Array of namespace dimensions for organizing memories (e.g., `["user_id"]`, `["agent_id", "session_id"]`).
`configuration` | Map<String, Object> | Optional | Strategy-specific configuration. See [the strategy `configuration` object](#the-strategy-configuration-object).
`enabled`       | boolean             | Optional | To enable the Strategy in the memory container. Default is True.

### The strategy configuration object

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`llm_result_path` | String | Optional | JSONPath to extract LLM results. Default is `"$.output.message.content[0].text"` for Bedrock Converse API format.
`system_prompt` | String | Optional | Custom system prompt to override the default strategy prompt.
`llm_id` | String | Optional | LLM model ID for this specific strategy, overrides the global LLM setting.

### The parameters object

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`llm_result_path` | String | Optional | Global JSONPath for extracting LLM results from responses. Default is `"$.output.message.content[0].text"` for Bedrock Converse API format.

## Example requests

### Basic memory container

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "agentic memory test",
  "description": "Store conversations with semantic search and summarization",
  "configuration": {
    "embedding_model_type": "TEXT_EMBEDDING",
    "embedding_model_id": "{{embedding_model_id}}",
    "embedding_dimension": 1024,
    "llm_id": "{{llm_id}}",
    "strategies": [
      {
        "type": "SEMANTIC",
        "namespace": ["user_id"]
      }
    ]
  }
}
```

### Advanced memory container with multiple strategies

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "agentic memory test",
  "description": "Store conversations with semantic search and summarization",
  "configuration": {
    "embedding_model_type": "TEXT_EMBEDDING",
    "embedding_model_id": "{{embedding_model_id}}",
    "embedding_dimension": 1024,
    "llm_id": "{{llm_id}}",
    "index_prefix": "my_custom_prefix",
    "use_system_index": false,
    "strategies": [
      {
        "type": "SEMANTIC",
        "namespace": ["agent_id"],
        "configuration": {
          "llm_result_path": "$.output.message.content[0].text",
          "system_prompt": "Extract semantic information from user conversations",
          "llm_id": "{{custom_llm_id}}"
        }
      },
      {
        "type": "USER_PREFERENCE",
        "namespace": ["agent_id"],
        "configuration": {
          "llm_result_path": "$.output.message.content[0].text"
        }
      },
      {
        "type": "SUMMARY",
        "namespace": ["agent_id"],
        "configuration": {
          "llm_result_path": "$.output.message.content[0].text"
        }
      }
    ],
    "parameters": {
      "llm_result_path": "$.output.message.content[0].text"
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains the `memory_container_id` that you can use to retrieve or delete the container:

```json
{
    "memory_container_id": "SdjmmpgBOh0h20Y9kWuN",
    "status": "created"
}
```