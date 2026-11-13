---
layout: default
title: Delete memory container
parent: Agentic memory APIs
grand_parent: ML APIs
nav_order: 30
---

# Delete Memory Container API
**Introduced 3.3**
{: .label .label-purple }

Use this API to delete a memory container by its ID.

## Endpoints

```json
DELETE /_plugins/_ml/memory_containers/{memory_container_id}
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

You can also provide `delete_all_memories` and `delete_memories` in the request body. If a parameter is specified in both places, the query parameter takes precedence.

## Example request: Basic deletion (preserves memory indexes)

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN
```
{% include copy-curl.html %}

## Example request: Delete a container and all memory indexes

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN?delete_all_memories=true
```
{% include copy-curl.html %}

## Example request: Delete a container and specific memory types

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN?delete_memories=sessions,working
```
{% include copy-curl.html %}

## Example response

```json
{
    "_index": ".plugins-ml-am-memory-container",
    "_id": "SdjmmpgBOh0h20Y9kWuN",
    "_version": 2,
    "result": "deleted",
    "forced_refresh": true,
    "_shards": {
        "total": 1,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 6,
    "_primary_term": 1
}
```

## Error responses

If you attempt to delete a memory container that doesn't exist, OpenSearch returns a 404 Not Found error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "status_exception",
        "reason": "Memory container not found"
      }
    ],
    "type": "status_exception",
    "reason": "Memory container not found"
  },
  "status": 404
}
```

Memory indexes can be deleted only if no other memory container uses the same `index_prefix`. If another container shares the prefix, a request that specifies `delete_all_memories` or `delete_memories` fails with a 409 Conflict error and the container is not deleted. To delete the container, send the request without these parameters.
{: .note}

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_index` | String | The name of the index that stores memory containers. |
| `result` | String | The result of the delete operation. |
| `_id` | String | The ID of the deleted memory container. |
| `_version` | Integer | The version number after deletion. |
| `forced_refresh` | Boolean | Whether a refresh was forced after the operation. |
| `_shards` | Object | Information about the shards involved in the operation. |
| `_seq_no` | Long | The sequence number assigned to the delete operation. |
| `_primary_term` | Long | The primary term of the index. |