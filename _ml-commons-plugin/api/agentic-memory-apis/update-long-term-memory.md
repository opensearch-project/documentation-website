---
layout: default
title: Update long-term memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 32
---

# Update long-term memory
**Introduced 3.2**
{: .label .label-purple }

Use this API to update an existing long-term memory within a memory container.

## Path and HTTP methods

```json
PUT /_plugins/_ml/memory_containers/<memory_container_id>/memories/long-term/<memory_id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `memory_id` | String | The ID of the long-term memory to update. Required. |

## Request fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The updated memory content. Optional. |
| `tags` | Object | Updated tags for categorization. Optional. |
| `additional_info` | Object | Additional metadata to associate with the memory. Optional. |

## Example request

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
{
  "memory": "User's name is Bob Smith",
  "tags": {
    "topic": "personal info",
    "updated": "true"
  },
  "additional_info": {
    "source": "user_correction"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "updated",
  "_id": "DcxjTpkBvwXRq366C1Zz",
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
