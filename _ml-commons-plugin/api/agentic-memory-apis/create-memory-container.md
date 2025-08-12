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
`memory_storage_config` | Object | Optional | The memory storage configuration. See [the `memory_storage_config`](#the-memory-storage-config-object) object for more details.

## The `memory_storage_config` object

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`dimension` | Integer | Optional | The dimension of the embedding model.
`embedding_model_id` | String | Optional | The embedding model ID.
`embedding_model_type` | String | Optional | The embedding model type. Supported types are `TEXT_EMBEDDING` and `SPARSE_ENCODING`.
`llm_model_id` | String | Optional | The LLM model ID.
`max_infer_size` | Integer | Optional | The maximum infer size, limit is 10.
`memory_index_name` | String | Optional | The memory index name.

## Example request

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "Raw memory container",
  "description": "Store static conversations with semantic search"
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