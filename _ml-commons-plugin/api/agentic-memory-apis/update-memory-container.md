---
layout: default
title: Update memory container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 15
---

# Update memory container
**Introduced 3.3**
{: .label .label-purple }

Use this API to update an existing memory container's properties such as name and description.

## Path and HTTP methods

```json
PUT /_plugins/_ml/memory_containers/<memory_container_id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container to update. Required. |

## Request fields

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Optional | The updated name of the memory container. |
| `description` | String | Optional | The updated description of the memory container. |

## Example request

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU
{
  "name": "opensearch-agents-memory"
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

| Field | Data type | Description |
| :--- | :--- | :--- |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory container. |
| `_version` | Integer | The version number of the updated memory container. |
| `_shards` | Object | Information about the shards involved in the operation. |
