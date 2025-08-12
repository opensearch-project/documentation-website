---
layout: default
title: Search Memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Search Memory API
**Introduced 3.2**
{: .label .label-purple }

Use this API to to search for a memory in a container. This API uses a query to search for matching memories.

## Endpoints

```json
GET /_plugins/_ml/memory_containers/{memory_container_id}/memories/_search
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories/_search
```

## Example request

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories/_search
{
    "query": "machine learning concepts"
}
```
{% include copy-curl.html %}

## Example response

```json
{
    "timed_out": false,
    "hits": {
        "total": 1,
        "max_score": 0.69813377,
        "hits": [
            {
                "memory_id": "T9jtmpgBOh0h20Y91WtZ",
                "memory": "Machine learning is a subset of artificial intelligence",
                "_score": 0.69813377,
                "session_id": "sess_a99c5a19-cee3-44ce-b64d-6fbdc411c537",
                "user_id": "admin",
                "memory_type": "RAW_MESSAGE",
                "role": "assistant",
                "created_time": 1754945934681,
                "last_updated_time": 1754945934681
            }
        ]
    }
}
```