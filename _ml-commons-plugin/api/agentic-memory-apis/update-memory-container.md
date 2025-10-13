---
layout: default
title: Update memory container
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 15
---

# Update Memory Container API
**Introduced 3.3**
{: .label .label-purple }

Use this API to update an existing memory container's properties such as name, description, configuration, and access permissions.

## Endpoints

```json
PUT /_plugins/_ml/memory_containers/<memory_container_id>
```

## Path parameters

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container to update. |

## Request fields

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Optional | The updated name of the memory container. |
| `description` | String | Optional | The updated description of the memory container. |
| `configuration` | Object | Optional | Configuration object containing strategies and embedding settings. See [The configuration object](#the-configuration-object). |

### The configuration object

The `configuration` objects supports the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `llm_id` | String | Optional | The large language model ID to use to extract facts. |
| `strategies` | Array | Optional | Array of strategy objects for memory processing. |
| `embedding_model_id` | String | Optional | The embedding model ID. Can only be updated if no long-term memory index exists. |
| `embedding_model_type` | String | Optional | The embedding model type. Can only be updated if no long-term memory index exists. |
| `embedding_dimension` | Integer | Optional | The embedding dimension. Can only be updated if no long-term memory index exists. |

## Update behavior

Note the following update behavior.

### Strategy updates

-  To update a specific strategy, specify the strategy `id`.
- To create a new strategy, specify a strategy without an `id`.

### Backend roles updates

- Adding new `backend_roles` grants new users read or write access with those roles.
- The new `backend_roles` field overwrites the existing field, so include original roles if you want to keep them.

### Namespace updates

- The `namespace` field in the `strategies` object is updated by overwriting. Include the original namespace if you want to keep it.

### Embedding model restrictions

- The `embedding_model_id`, `embedding_model_type`, and `embedding_dimension` fields can only be updated if no long-term memory index has been created for this memory container. Once a long-term memory index with the specified `index_prefix` is created, these embedding fields cannot be updated.

## Example request

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU
{
  "name": "opensearch-agents-memory",
  "description": "Updated memory container for OpenSearch agents",
  "backend_roles": ["admin", "ml_user"],
  "configuration": {
    "strategies": [
      {
        "id": "existing_strategy_id",
        "type": "summarization",
        "namespace": "updated_namespace"
      },
      {
        "type": "keyword_extraction"
      }
    ],
    "embedding_model_id": "new_embedding_model",
    "embedding_model_type": "dense",
    "embedding_dimension": 768
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "updated",
  "_id": "HudqiJkB1SltqOcZusVU",
  "_version": 2,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory container. |
| `_version` | Integer | The version number of the updated memory container. |
| `_shards` | Object | Information about the shards involved in the operation. |
