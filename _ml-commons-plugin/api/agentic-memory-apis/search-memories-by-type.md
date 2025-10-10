---
layout: default
title: Search memories by type
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 54
---

# Search memories by type
**Introduced 3.3**
{: .label .label-purple }

Use this API to search for memories of a specific type within a memory container. This unified API supports searching session, working, long-term, and history memory data.

## Path and HTTP methods

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/_search
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `type` | String | The type of memory: "sessions", "working", "long-term", or "history". Required. |

## Request fields

The request body supports standard OpenSearch query DSL. 

## Example requests

### Search sessions

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/_search
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

### Search long-term memories

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

### Search memory history

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

### Search working memories with namespace filter

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "namespace.user_id": "bob"
          }
        }
      ],
      "must_not": [
        {
          "exists": {
            "field": "tags.parent_memory_id"
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

### Search trace data by session

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/_search
{
  "query": {
    "term": {
      "namespace.session_id": "123"
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
      "value": 1,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "test1-session",
        "_id": "CcxjTpkBvwXRq366A1aE",
        "_score": null,
        "_source": {
          "memory_container_id": "HudqiJkB1SltqOcZusVU",
          "namespace": {
            "user_id": "bob"
          },
          "created_time": "2025-09-15T17:18:55.881276939Z",
          "last_updated_time": "2025-09-15T17:18:55.881276939Z"
        },
        "sort": ["2025-09-15T17:18:55.881276939Z"]
      }
    ]
  }
}
```

## Response fields

The response fields vary depending on the memory type being searched. See the unified memory API documentation for specific field descriptions:

- [Get memory by type and ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/get-memory-by-type/)
