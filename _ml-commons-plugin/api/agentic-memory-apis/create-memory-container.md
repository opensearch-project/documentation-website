---
layout: default
title: Create Memory Container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Memory Container API
**Introduced 3.2**
{: .label .label-purple }

Use this API to create a memory container.

Once a memory container is created, you'll provide its `memory_container_id` to other APIs.

## Endpoint

```json
POST /_plugins/_ml/memory_containers/_create
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`name` | String | Required | The name of the memory container.
`description` | String | Optional | The description of the memory container.
`memory_storage_config` | Object | Optional | The memory storage configuration. See [the `memory_storage_config` object](#the-memory-storage-config-object) for more details.

## The `memory_storage_config` object

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`dimension` | Integer | Optional | The dimension of the embedding model. Required when embedding model type is specified as `TEXT_EMBEDDING`.
`embedding_model_id` | String | Optional | The embedding model ID.
`embedding_model_type` | String | Optional | The embedding model type. Supported types are `TEXT_EMBEDDING` and `SPARSE_ENCODING`.
`llm_model_id` | String | Optional | The LLM model ID.
`max_infer_size` | Integer | Optional | The maximum infer size, limit is 10.
`memory_index_name` | String | Optional | The memory index name.

## Prerequisites

Before creating a memory container, you may need to register models:

### LLM Model (Optional)
For LLM capabilities, register a Claude model (currently the only supported LLM model):

```json
POST /_plugins/_ml/models/_register
{
    "name": "Bedrock infer model",
    "function_name": "remote",
    "description": "test model",
    "connector": {
        "name": "Amazon Bedrock Connector: embedding",
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
            "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
            "request_body": """{ "system": "${parameters.system_prompt}", "anthropic_version": "${parameters.anthropic_version}", "max_tokens": ${parameters.max_tokens}, "temperature": ${parameters.temperature}, "messages": ${parameters.messages} }"""
            }
        ]
    }
}
```
{% include copy-curl.html %}

### Embedding Model (Optional)
Register either a remote or local embedding model. For local models, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

**Remote embedding model:**
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

## Example request

```json
POST /_plugins/_ml/memory_containers/_create
{
    "name": "Sparse memory container",
    "description": "Store sparse conversations with semantic search",
    "memory_storage_config": {
        "llm_model_id": "bbphdJgB9L0Qb_M6ipnn",
        "embedding_model_type": "SPARSE_ENCODING",
        "embedding_model_id": "RodoX5gBfObQ5OgTHf1X"
    }
}
```
{% include copy-curl.html %}

## Example response

```json
{
    "memory_container_id": "SdjmmpgBOh0h20Y9kWuN",
    "status": "created"
}
```