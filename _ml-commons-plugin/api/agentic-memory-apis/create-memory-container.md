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

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to create a memory container to hold agentic memories. The container can have two model types associated with it:

- A text embedding model for vectorizing the message so it can be searched. Use a text embedding model for dense vector embeddings or a sparse encoding model for sparse vector formats. If no embedding model is specified, messages are stored but cannot be used for vector-based searches.
- A large language model (LLM) for reasoning over the message to produce factual or processed content. If no LLM is specified, messages are stored directly, without applying inference.

Once a memory container is created, you'll provide its `memory_container_id` to other APIs.

## Prerequisites

If you want to use one of the model types to process memories, register the models in OpenSearch.

### Embedding model 

Register either a local or externally hosted embedding model. OpenSearch supports text embedding and sparse encoding models. 

For more information about using models locally, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). For a list of supported models, see[OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#supported-pretrained-models).


For more information about using externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). For example, to register an externally hosted Amazon Titan Embedding model, send the following request:

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

OpenSearch supports the Anthropic Claude model for LLM capabilities. To register a Claude model, send the following request:

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

For more information about using externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

## Endpoint

```json
POST /_plugins/_ml/memory_containers/_create
```

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`name` | String | Required | The name of the memory container.
`description` | String | Optional | The description of the memory container.
`memory_storage_config` | Object | Optional | The memory storage configuration. See [the `memory_storage_config` object](#the-memory_storage_config-object).

### The memory_storage_config object

The `memory_storage_config` object supports the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`dimension` | Integer | Optional | The dimension of the embedding model. Required if `embedding_model_type` is `TEXT_EMBEDDING`.
`embedding_model_id` | String | Optional | The embedding model ID.
`embedding_model_type` | String | Optional | The embedding model type. Supported types are `TEXT_EMBEDDING` and `SPARSE_ENCODING`.
`llm_model_id` | String | Optional | The large language model (LLM) ID.
`max_infer_size` | Integer | Optional | The maximum number of messages the LLM processes for inference in a single request.
`memory_index_name` | String | Optional | The name of the index in which to save messages, embeddings, and inferred facts.

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

The response contains the `memory_container_id` that you can use to retrieve or delete the container:

```json
{
    "memory_container_id": "SdjmmpgBOh0h20Y9kWuN",
    "status": "created"
}
```