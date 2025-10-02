---
layout: default
title: Delete long-term memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 33
---

# Delete long-term memory
**Introduced 3.2**
{: .label .label-purple }

Use this API to delete a specific long-term memory from a memory container.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>/memories/long-term/<memory_id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `memory_id` | String | The ID of the long-term memory to delete. Required. |

## Example request

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "deleted",
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
| `result` | String | The result of the delete operation. |
| `_id` | String | The ID of the deleted memory. |
| `_version` | Integer | The version number after deletion. |
| `_shards` | Object | Information about the shards involved in the operation. |
