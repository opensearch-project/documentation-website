---
layout: default
title: Search memory containers
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 25
---

# Search memory containers
**Introduced 3.2**
{: .label .label-purple }

Use this API to search for memory containers using OpenSearch query DSL.

## Path and HTTP methods

```json
GET /_plugins/_ml/memory_containers/_search
POST /_plugins/_ml/memory_containers/_search
```

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
GET /_plugins/_ml/memory_containers/_search
{
  "query": {
    "match_all": {}
  }
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
    "max_score": 1.0,
    "hits": [
      {
        "_index": ".plugins-ml-memory-meta",
        "_id": "HudqiJkB1SltqOcZusVU",
        "_score": 1.0,
        "_source": {
          "name": "agentic memory test",
          "description": "Store conversations with semantic search and summarization",
          "configuration": {
            "embedding_model_type": "TEXT_EMBEDDING",
            "embedding_model_id": "uXZAtJkBvHNmcp1JAROh",
            "embedding_dimension": 1024,
            "llm_id": "aFouy5kBrfmzAZ6R6wo-",
            "strategies": [
              {
                "type": "SEMANTIC",
                "namespace": ["user_id"]
              }
            ]
          },
          "created_time": 1757956737699,
          "last_updated_time": 1757956737699
        }
      }
    ]
  }
}
```

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the memory container. |
| `description` | String | The description of the memory container. |
| `configuration` | Object | The memory container configuration including models and strategies. |
| `created_time` | Long | Timestamp when the container was created. |
| `last_updated_time` | Long | Timestamp when the container was last updated. |
