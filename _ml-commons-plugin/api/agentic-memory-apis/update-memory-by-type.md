---
layout: default
title: Update memory by type and ID
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 52
---

# Update memory by type and ID
**Introduced 3.2**
{: .label .label-purple }

Use this API to update a specific memory by its type and ID. This unified API supports updating session, working, and long-term memory data. History memory does not support updates.

## Path and HTTP methods

```json
PUT /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `type` | String | The type of memory: "sessions", "working", or "long-term". Required. Note: History memory cannot be updated. |
| `id` | String | The ID of the memory to update. Required. |

## Request fields

The request fields vary depending on the memory type being updated:

### For session memory

| Field | Data type | Description |
| :--- | :--- | :--- |
| `additional_info` | Object | Additional metadata to associate with the session. Optional. |

### For working memory

| Field | Data type | Description |
| :--- | :--- | :--- |
| `messages` | Array | Updated conversation messages (for conversation type). Optional. |
| `structured_data` | Object | Updated structured data content (for data type). Optional. |
| `tags` | Object | Updated tags for categorization. Optional. |
| `additional_info` | Object | Additional metadata. Optional. |

### For long-term memory

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The updated memory content. Optional. |
| `tags` | Object | Updated tags for categorization. Optional. |
| `additional_info` | Object | Additional metadata. Optional. |

## Example requests

### Update session

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/N2CDipkB2Mtr6INFFcX8
{
  "additional_info": {
    "key1": "value1",
    "last_activity": "2025-09-15T17:30:00Z"
  }
}
```

### Update working memory

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
{
  "tags": {
    "topic": "updated_topic",
    "priority": "high"
  }
}
```

### Update long-term memory

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
{
  "memory": "User's name is Bob Smith",
  "tags": {
    "topic": "personal info",
    "updated": "true"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "updated",
  "_id": "N2CDipkB2Mtr6INFFcX8",
  "_version": 2,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory. |
| `_version` | Integer | The version number of the updated memory. |
| `_shards` | Object | Information about the shards involved in the operation. |
