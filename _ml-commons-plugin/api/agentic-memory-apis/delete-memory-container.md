---
layout: default
title: Delete Memory Container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Delete Memory Container API
**Introduced 3.2**
{: .label .label-purple }

Use this API to delete a memory container by its ID.

## Endpoint

```json
DELETE /_plugins/_ml/memory_containers/{memory_container_id}
```

## Example request

```json
DELETE /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN
```
{% include copy-curl.html %}

## Example response

```json
{
    "_index": ".plugins-ml-memory-container",
    "_id": "SdjmmpgBOh0h20Y9kWuN",
    "_version": 3,
    "result": "deleted",
    "forced_refresh": true,
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "_seq_no": 6,
    "_primary_term": 1
}
```