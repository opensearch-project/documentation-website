---
layout: default
title: Delete Memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Delete Memory API
**Introduced 3.2**
{: .label .label-purple }

Use this API to delete a memory by its ID.

## Endpoint

```json
DELETE /_plugins/_ml/memory_containers/{memory_container_id}/memories/{memory_id}
```

## Example request

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories/T9jtmpgBOh0h20Y91WtZ
```
{% include copy-curl.html %}

## Example response

```json
{
    "_index": "ml-static-memory-sdjmmpgboh0h20y9kwun-admin",
    "_id": "S9jnmpgBOh0h20Y9qWu7",
    "_version": 3,
    "result": "deleted",
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "_seq_no": 3,
    "_primary_term": 1
}
```