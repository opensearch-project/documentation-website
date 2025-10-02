---
layout: default
title: Delete memory by type and ID
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 53
---

# Delete memory by type and ID
**Introduced 3.2**
{: .label .label-purple }

Use this API to delete a specific memory by its type and ID. This unified API supports deleting session, working, long-term, and history memory data.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `type` | String | The type of memory: "session", "working", "long-term", or "history". Required. |
| `id` | String | The ID of the memory to delete. Required. |

## Example request

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "deleted",
  "_id": "XyEuiJkBeh2gPPwzjYWM",
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
| `result` | String | The result of the delete operation. |
| `_id` | String | The ID of the deleted memory. |
| `_version` | Integer | The version number after deletion. |
| `_shards` | Object | Information about the shards involved in the operation. |
