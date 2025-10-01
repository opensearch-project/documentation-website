---
layout: default
title: Delete memory history
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 42
---

# Delete memory history
**Introduced 3.2**
{: .label .label-purple }

Use this API to delete specific memory history events from a memory container.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>/memories/history/<history_id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `history_id` | String | The ID of the history event to delete. Required. |

## Example request

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/eMxnTpkBvwXRq366hmAU
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "deleted",
  "_id": "eMxnTpkBvwXRq366hmAU",
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
| `_id` | String | The ID of the deleted history event. |
| `_version` | Integer | The version number after deletion. |
| `_shards` | Object | Information about the shards involved in the operation. |
