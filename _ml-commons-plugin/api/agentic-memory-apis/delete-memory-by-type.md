---
layout: default
title: Delete memory by type and ID
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 53
---

# Delete memory by type and ID
**Introduced 3.3**
{: .label .label-purple }

Use this API to delete a specific memory by its type and ID. This unified API supports deleting all memory types: session, working, long-term, and history memory data.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

| Field                 | Data type | Required/Optional | Description |
|:----------------------| :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container. |
| `type`                | String | Required | The type of memory: "sessions", "working", "long-term", or "history". |
| `id`                  | String | Required | The ID of the memory to delete. |

## Example requests

### Delete working memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```

### Delete long-term memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
```

### Delete session

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/CcxjTpkBvwXRq366A1aE
```

### Delete memory history

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/eMxnTpkBvwXRq366hmAU
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

## Delete memory by query

You can also delete multiple memories using a query to match specific criteria.

### Path and HTTP methods

```json
POST /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/_delete_by_query
```

### Path parameters

| Field                 | Data type | Required/Optional | Description |
|:----------------------| :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container. |
| `type`                | String | Required | The type of memory: "sessions", "working", "long-term", or "history". |

### Request body

The request body should contain a query to match the memories you want to delete.

### Example request

```json
POST /_plugins/_ml/memory_containers/{{container_id_user1}}/memories/working/_delete_by_query
{
    "query": {
        "match": {
            "owner_id": "admin"
        }
    }
}
```
{% include copy-curl.html %}

### Example response

```json
{
    "took": 159,
    "timed_out": false,
    "total": 6,
    "updated": 0,
    "created": 0,
    "deleted": 6,
    "batches": 1,
    "version_conflicts": 0,
    "noops": 0,
    "retries": {
        "bulk": 0,
        "search": 0
    },
    "throttled_millis": 0,
    "requests_per_second": -1.0,
    "throttled_until_millis": 0,
    "failures": []
}
```

### Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `took` | Integer | The time in milliseconds it took to execute the request. |
| `timed_out` | Boolean | Whether the request timed out. |
| `total` | Integer | The total number of documents processed. |
| `deleted` | Integer | The number of documents deleted. |
| `batches` | Integer | The number of batches processed. |
| `version_conflicts` | Integer | The number of version conflicts encountered. |
| `noops` | Integer | The number of no-operation updates. |
| `retries` | Object | Information about bulk and search retries. |
| `throttled_millis` | Integer | The time in milliseconds the request was throttled. |
| `requests_per_second` | Float | The number of requests processed per second. |
| `throttled_until_millis` | Integer | The time in milliseconds until throttling is lifted. |
| `failures` | Array | Any failures that occurred during the operation. |
