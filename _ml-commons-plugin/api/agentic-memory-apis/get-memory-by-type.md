---
layout: default
title: Get memory by type and ID
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 51
---

# Get memory by type and ID
**Introduced 3.2**
{: .label .label-purple }

Use this API to retrieve a specific memory by its type and ID. This unified API supports four types of memory data: session, working, long-term, and history.

## Path and HTTP methods

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. Required. |
| `type` | String | The type of memory: "session", "working", "long-term", or "history". Required. |
| `id` | String | The ID of the memory to retrieve. Required. |

## Example request

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```
{% include copy-curl.html %}

## Example response

```json
{
  "memory_container_id": "HudqiJkB1SltqOcZusVU",
  "memory_type": "conversation",
  "messages": [
    {
      "role": "user",
      "content_text": "I'm Bob, I really like swimming."
    },
    {
      "role": "assistant",
      "content_text": "Cool, nice. Hope you enjoy your life."
    }
  ],
  "namespace": {
    "user_id": "bob",
    "session_id": "S-dqiJkB1SltqOcZ1cYO"
  },
  "infer": true,
  "tags": {
    "topic": "personal info"
  },
  "created_time": 1758930326804,
  "last_updated_time": 1758930326804
}
```

## Response fields

The response fields vary depending on the memory type:

### Working memory response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. |
| `memory_type` | String | The type of memory: "conversation" or "data". |
| `messages` | Array | Array of conversation messages (for conversation type). |
| `structured_data` | Object | Structured data content (for data type). |
| `namespace` | Object | The namespace context for this memory. |
| `tags` | Object | Associated tags for categorization. |
| `infer` | Boolean | Whether inference was enabled for this memory. |
| `created_time` | Long | Timestamp when the memory was created. |
| `last_updated_time` | Long | Timestamp when the memory was last updated. |

### Long-term memory response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The extracted long-term memory fact. |
| `namespace` | Object | The namespace context for this memory. |
| `memory_type` | String | The type of memory strategy used. |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | Timestamp when the memory was created. |
| `last_updated_time` | Long | Timestamp when the memory was last updated. |
