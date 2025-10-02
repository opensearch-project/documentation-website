---
layout: default
title: Search long-term memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 31
---

# Search long-term memory
**Introduced 3.2**
{: .label .label-purple }

Use this API to search for long-term memories within a memory container. Long-term memories are extracted facts from conversation messages that are stored for semantic retrieval.

## Path and HTTP methods

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>/memories/long-term/_search
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
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "namespace.user_id": "bob"
          }
        }
      ]
    }
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
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "test1-long-term-memory",
        "_id": "DcxjTpkBvwXRq366C1Zz",
        "_score": null,
        "_source": {
          "created_time": 1757956737699,
          "memory": "User's name is Bob",
          "last_updated_time": 1757956737699,
          "namespace_size": 1,
          "namespace": {
            "user_id": "bob"
          },
          "memory_type": "SEMANTIC",
          "tags": {
            "topic": "personal info"
          }
        },
        "sort": [1757956737699]
      },
      {
        "_index": "test1-long-term-memory",
        "_id": "DsxjTpkBvwXRq366C1Zz",
        "_score": null,
        "_source": {
          "created_time": 1757956737699,
          "memory": "Bob really likes swimming",
          "last_updated_time": 1757956737699,
          "namespace_size": 1,
          "namespace": {
            "user_id": "bob"
          },
          "memory_type": "SEMANTIC",
          "tags": {
            "topic": "personal info"
          }
        },
        "sort": [1757956737699]
      }
    ]
  }
}
```

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The extracted long-term memory fact. |
| `namespace` | Object | The namespace context for this memory. |
| `memory_type` | String | The type of memory strategy used (e.g., "SEMANTIC"). |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | Timestamp when the memory was created. |
| `last_updated_time` | Long | Timestamp when the memory was last updated. |
| `namespace_size` | Integer | The size of the namespace. |
