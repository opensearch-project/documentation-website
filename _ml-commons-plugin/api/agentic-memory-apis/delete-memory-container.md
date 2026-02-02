---
layout: default
title: Delete memory container
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Delete Memory Container API
**Introduced 3.3**
{: .label .label-purple }

Use this API to delete a memory container by its ID.

## Endpoints

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container to delete. |

## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `delete_all_memories` | Boolean | Optional | Controls whether to delete all memory indexes when deleting the container. Default is `false`. When `false`, memory indexes (sessions, working, long-term, history) are preserved. |
| `delete_memories` | Array | Optional | Array of memory types to delete when deleting the container. Default is empty array. Accepts values: `sessions`, `working`, `long-term`, `history`. Example: `delete_memories=sessions,working`. |

## Example request: Basic deletion (preserves memory indexes)

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN
```

## Example request: Delete a container and all memory indexes

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN?delete_all_memories=true
```

## Example request: Delete a container and specific memory types

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN?delete_memories=sessions,working
```
{% include copy-curl.html %}

## Example response

```json
{
    "_index": ".plugins-ml-memory-container",
    "_id": "SdjmmpgBOh0h20Y9kWuN",
    "_version": 3,
    "result": "deleted",
    "forced_refresh": true,
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "_seq_no": 6,
    "_primary_term": 1
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `result` | String | The result of the delete operation. |
| `_id` | String | The ID of the deleted memory container. |
| `_version` | Integer | The version number after deletion. |
| `_shards` | Object | Information about the shards involved in the operation. |
| `_seq_no` | Long | The sequence number assigned to the delete operation. |
| `_primary_term` | Long | The primary term of the index. |