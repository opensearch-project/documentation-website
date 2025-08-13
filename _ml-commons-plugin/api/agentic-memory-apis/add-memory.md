---
layout: default
title: Add Agentic Memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Add Agentic Memory API
**Introduced 3.2**
{: .label .label-purple }

Use this API to add a memory into a memory container.

Once a memory is created, you'll provide its `memory_id` to other APIs.

## Endpoint

```json
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`messages` | List | Required | The list of messages.
`session_id` | String | Optional | The session ID.
`agent_id` | String | Optional | The agent ID.
`infer` | Boolean | Optional | Whether to infer context from messages.
`tags` | Object | Optional | Custom metadata for the memory.

## Example request

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories
{
    "messages": [
        {"role": "assistant", "content": "Machine learning is a subset of artificial intelligence"}
    ]
}
```
{% include copy-curl.html %}

## Example response

```json
{
    "results": [
        {
            "id": "T9jtmpgBOh0h20Y91WtZ",
            "text": "Machine learning is a subset of artificial intelligence",
            "event": "ADD"
        }
    ],
    "session_id": "sess_a99c5a19-cee3-44ce-b64d-6fbdc411c537"
}
```