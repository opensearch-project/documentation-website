---
layout: default
title: Delete memory container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Delete Memory Container API
**Introduced 3.2**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

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