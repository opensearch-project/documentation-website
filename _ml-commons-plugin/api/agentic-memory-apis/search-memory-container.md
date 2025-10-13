---
layout: default
title: Search memory containers
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 25
---

# Search Memory Containers API
**Introduced 3.3**
{: .label .label-purple }

Use this API to search for memory containers using OpenSearch query DSL.

## Endpoints

```json
GET /_plugins/_ml/memory_containers/_search
POST /_plugins/_ml/memory_containers/_search
```

## Request fields

The request body supports standard OpenSearch query DSL. For more information, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

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

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the memory container. |
| `description` | String | The description of the memory container. |
| `configuration` | Object | The memory container configuration, including models and strategies. |
| `created_time` | Long | The timestamp when the container was created. |
| `last_updated_time` | Long | The timestamp when the container was last updated. |
