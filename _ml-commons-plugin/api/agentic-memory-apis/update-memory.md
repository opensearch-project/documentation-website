---
layout: default
title: Update Memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Update Memory API
**Introduced 3.2**
{: .label .label-purple }

Use this API to update a memory.

Once a memory container is created, you'll provide its `memory_id` to other APIs.

## Endpoint

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}/memories/{memory_id}
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`text` | String | Required | The list of messages.

## Example request

```json
PUT /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories/T9jtmpgBOh0h20Y91WtZ
{
    "text": "Updated content with new information about machine learning"
}
```
{% include copy-curl.html %}

## Example response

```json
{
    "_index": "ml-static-memory-sdjmmpgboh0h20y9kwun-admin",
    "_id": "S9jnmpgBOh0h20Y9qWu7",
    "_version": 2,
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "_seq_no": 2,
    "_primary_term": 1
}
```