---
layout: default
title: Search memory history
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 41
---

# Search memory history
**Introduced 3.2**
{: .label .label-purple }

Use this API to search for memory history events within a memory container. Memory history tracks all add, update, and delete operations performed on long-term memories.

## Path and HTTP methods

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>/memories/history/_search
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |

## Request fields

The request body supports standard OpenSearch query DSL. Common fields include:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `query` | Object | The search query using OpenSearch query DSL. Optional. |
| `sort` | Array | Sort criteria for the results. Optional. |
| `size` | Integer | Maximum number of results to return. Optional. |
| `from` | Integer | Starting index for pagination. Optional. |

## Example request

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "created_time": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "test1-long-term-memory-history",
        "_id": "eMxnTpkBvwXRq366hmAU",
        "_score": null,
        "_source": {
          "created_time": "2025-09-15T17:23:51.302920078Z",
          "memory_id": "DsxjTpkBvwXRq366C1Zz",
          "action": "DELETE",
          "after": {
            "memory": "Bob really likes swimming"
          }
        },
        "sort": ["2025-09-15T17:23:51.302920078Z"]
      },
      {
        "_index": "test1-long-term-memory-history",
        "_id": "ecxnTpkBvwXRq366hmAU",
        "_score": null,
        "_source": {
          "created_time": "2025-09-15T17:23:51.303097838Z",
          "memory_id": null,
          "action": "ADD",
          "after": {
            "memory": "User doesn't like swimming currently"
          }
        },
        "sort": ["2025-09-15T17:23:51.303097838Z"]
      }
    ]
  }
}
```

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `action` | String | The type of operation performed: "ADD", "UPDATE", or "DELETE". |
| `memory_id` | String | The ID of the affected memory (null for ADD operations). |
| `created_time` | String | ISO timestamp when the operation occurred. |
| `after` | Object | The memory content after the operation. |
| `before` | Object | The memory content before the operation (for UPDATE operations). |
