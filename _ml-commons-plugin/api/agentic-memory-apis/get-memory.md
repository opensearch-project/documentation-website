---
layout: default
title: Get Agentic Memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Get Agentic Memory API
**Introduced 3.2**
{: .label .label-purple }

Use this API to retrieve a memory by its ID.

## Endpoint

```json
GET /_plugins/_ml/memory_containers/{memory_container_id}/memories/{memory_id}
```

## Example request

```json
GET /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories/T9jtmpgBOh0h20Y91WtZ
```
{% include copy-curl.html %}

## Example response

```json
{
    "session_id": "sess_a99c5a19-cee3-44ce-b64d-6fbdc411c537",
    "memory": "Machine learning is a subset of artificial intelligence",
    "memory_type": "RAW_MESSAGE",
    "user_id": "admin",
    "role": "assistant",
    "created_time": 1754945934681,
    "last_updated_time": 1754945934681
}
```

## Response body fields

For response field descriptions, see [Add Agentic Memory API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory#request-body-fields).