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

Use this API to search for memory containers using OpenSearch query domain-specific language (DSL).

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
        "_index": ".plugins-ml-am-memory-container",
        "_id": "HudqiJkB1SltqOcZusVU",
        "_version": 1,
        "_seq_no": 0,
        "_primary_term": 1,
        "_score": 1.0,
        "_source": {
          "created_time": 1757956737699,
          "last_updated_time": 1757956737699,
          "configuration": {
            "embedding_model_id": "uXZAtJkBvHNmcp1JAROh",
            "strategies": [
              {
                "namespace": ["user_id"],
                "id": "semantic_53d1751c",
                "type": "SEMANTIC",
                "enabled": true
              }
            ],
            "max_infer_size": 5,
            "embedding_dimension": 1024,
            "index_prefix": "default",
            "use_system_index": true,
            "llm_id": "aFouy5kBrfmzAZ6R6wo-",
            "disable_history": false,
            "embedding_model_type": "TEXT_EMBEDDING",
            "disable_session": false
          },
          "name": "agentic memory test",
          "description": "Store conversations with semantic search and summarization"
        }
      },
      ...
    ]
  }
}
```

## Response fields

The response uses the standard OpenSearch search response format. The following table lists the fields in the `_source` object of each element of the `hits` array.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the memory container. |
| `description` | String | The description of the memory container. |
| `configuration` | Object | The memory container configuration, including models and strategies. |
| `created_time` | Long | The timestamp of when the container was created. |
| `last_updated_time` | Long | The timestamp of when the container was last updated. |
| `backend_roles` | Array | The backend roles that have access to the container. Present only if backend roles are configured. |
