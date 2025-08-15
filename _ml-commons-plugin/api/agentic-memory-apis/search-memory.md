---
layout: default
title: Search agentic memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 70
---

# Search Agentic Memory APIs
**Introduced 3.2**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use these APIs to to search for an agentic memory in a memory container. These APIs use a query to search for matching memories.

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