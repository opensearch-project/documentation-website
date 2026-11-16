---
layout: default
title: Update memory container
parent: Agentic memory APIs
grand_parent: ML APIs
nav_order: 15
---

# Update Memory Container API
**Introduced 3.3**
{: .label .label-purple }

Use this API to update an existing memory container's properties, such as name, description, configuration, and access permissions.

## Endpoints

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}
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
| `backend_roles` | Array | Optional | A list of backend roles for access control. Overwrites the existing list. |
| `configuration` | Object | Optional | The configuration object containing strategies and embedding settings. See [The configuration object](#the-configuration-object). |

### The configuration object

The `configuration` object supports the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `llm_id` | String | Optional | The large language model (LLM) ID to use to extract facts. |
| `max_infer_size` | Integer | Optional | The maximum number of similar existing memories retrieved during memory consolidation. Maximum is `10`. To update this value, include `llm_id` in the same request. |
| `strategies` | Array | Optional | An array of strategy objects for memory processing. Each strategy supports the `id`, `type`, `namespace`, `enabled`, and `configuration` fields. For field descriptions, see [The strategies array]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/#the-strategies-array). |
| `embedding_model_id` | String | Optional | The embedding model ID. Can only be updated if no long-term memory index exists. |
| `embedding_model_type` | String | Optional | The embedding model type. Can only be updated if no long-term memory index exists. |
| `embedding_dimension` | Integer | Optional | The embedding dimension. Can only be updated if no long-term memory index exists. |
| `retention_policy` | Object | Optional | The retention limits for each memory type. Changes are merged into the existing policy. Set to `null` to remove the policy. For more information, see [Agentic memory retention]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory-retention/). |

## Update behavior

Note the following update behavior.

### Strategy updates

- To update a specific strategy, specify the strategy `id`. Only the fields that you provide are updated. You cannot change the `type` of an existing strategy.
- To create a new strategy, specify a strategy without an `id`.
- To disable a strategy without removing it, set its `enabled` field to `false`.

### Backend roles updates

- Adding new `backend_roles` grants new users read or write access with those roles.
- The new `backend_roles` field overwrites the existing field, so include the original roles if you want to keep them.

### Namespace updates

- The `namespace` field in the `strategies` object is updated by overwriting. Include the original namespace if you want to keep it.

### Embedding model restrictions

- The `embedding_model_id`, `embedding_model_type`, and `embedding_dimension` fields can only be updated if no long-term memory index has been created for this memory container. Once a long-term memory index with the specified `index_prefix` is created, these embedding fields cannot be updated.

## Example request

The following request updates the namespace of an existing strategy and adds a `USER_PREFERENCE` strategy. To find the IDs of existing strategies, use the [Get Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-container/):

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU
{
  "name": "opensearch-agents-memory",
  "description": "Updated memory container for OpenSearch agents",
  "backend_roles": ["admin", "ml_user"],
  "configuration": {
    "strategies": [
      {
        "id": "semantic_53d1751c",
        "namespace": ["user_id", "session_id"]
      },
      {
        "type": "USER_PREFERENCE",
        "namespace": ["user_id"]
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index": ".plugins-ml-am-memory-container",
  "_id": "HudqiJkB1SltqOcZusVU",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 5,
  "_primary_term": 1
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_index` | String | The name of the index that stores memory containers. |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory container. |
| `_version` | Integer | The version number of the updated memory container. |
| `_shards` | Object | Information about the shards involved in the operation. |
| `_seq_no` | Long | The sequence number assigned to the update operation. |
| `_primary_term` | Long | The primary term of the index. |
