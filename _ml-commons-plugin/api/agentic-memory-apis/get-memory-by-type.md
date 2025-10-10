---
layout: default
title: Get memory by type and ID
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 51
---

# Get memory by type and ID
**Introduced 3.3**
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
| `type` | String | The type of memory: "sessions", "working", "long-term", or "history". Required. |
| `id` | String | The ID of the memory to retrieve. Required. |

## Example requests

### Get working memory

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```

### Get long-term memory

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
```

### Get session

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/CcxjTpkBvwXRq366A1aE
```

### Get memory history

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/eMxnTpkBvwXRq366hmAU
```
{% include copy-curl.html %}

## Example responses

### Working memory response

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
  "metadata": {
    "status": "checkpoint",
    "branch": "{\"root_event_id\":\"228nadfs879mtgk\",\"branch_name\":\"high\"}"
  },
  "infer": true,
  "tags": {
    "topic": "personal info"
  },
  "created_time": 1758930326804,
  "last_updated_time": 1758930326804
}
```

### Long-term memory response

```json
{
  "memory": "Kubernetes RBAC permission issues detected with CloudWatch agents experiencing persistent permission denials",
  "strategy_type": "SUMMARY",
  "tags": {
    "agent_type": "chat_agent",
    "conversation": "true"
  },
  "namespace": {
    "agent_id": "chat-agent"
  },
  "namespace_size": 1,
  "created_time": 1760052801773,
  "last_updated_time": 1760052801773,
  "memory_embedding": [0.018510794, 0.056366503, "..."],
  "owner_id": "admin",
  "strategy_id": "summary_96f04d97"
}
```

### Session response

```json
{
  "memory_container_id": "HudqiJkB1SltqOcZusVU",
  "namespace": {
    "user_id": "bob"
  },
  "created_time": "2025-09-15T17:18:55.881276939Z",
  "last_updated_time": "2025-09-15T17:18:55.881276939Z"
}
```

### History response

```json
{
  "owner_id": "admin",
  "memory_container_id": "nrJBy5kByIxXWyhQjmqv",
  "memory_id": "4bJMy5kByIxXWyhQvGr9",
  "action": "ADD",
  "after": {
    "memory": "A comprehensive security investigation was performed across multiple data sources including 55 OpenSearch indices, 50 CloudTrail events, 22 VPC Flow logs, 38 WAF events, 74 CloudWatch log groups, active CloudWatch alarms, and OpenSearch cluster security configuration."
  },
  "namespace": {
    "agent_id": "chat-agent"
  },
  "namespace_size": 1,
  "tags": {
    "agent_type": "chat_agent",
    "conversation": "true"
  },
  "created_time": 1760052428089
}
```

## Response fields

The response fields vary depending on the memory type:

### Working memory response fields

| Field                 | Data type | Description                                             |
|:----------------------| :--- |:--------------------------------------------------------|
| `memory_container_id` | String | The ID of the memory container.                         |
| `payload_type`        | String | The type of payload: "conversation" or "data".          |
| `messages`            | Array | Array of conversation messages (for conversation type). | 
| `namespace`           | Object | The namespace context for this memory.                  |
| `metadata`            | Object | Additional metadata associated with the memory.         |
| `tags`                | Object | Associated tags for categorization.                     |
| `infer`               | Boolean | Whether inference was enabled for this memory.          |
| `created_time`        | Long | Timestamp when the memory was created.                  |
| `last_updated_time`   | Long | Timestamp when the memory was last updated.             |

### Long-term memory response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The extracted long-term memory fact. |
| `strategy_type` | String | The type of memory strategy used (e.g., "SEMANTIC", "SUMMARY", "USER_PREFERENCE"). |
| `namespace` | Object | The namespace context for this memory. |
| `namespace_size` | Integer | The size of the namespace. |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | Timestamp when the memory was created. |
| `last_updated_time` | Long | Timestamp when the memory was last updated. |
| `memory_embedding` | Array | Vector embedding of the memory content (truncated in display). |
| `owner_id` | String | The owner of the memory. |
| `strategy_id` | String | The unique identifier for the strategy instance. |

### Session response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. |
| `namespace` | Object | The namespace context for this session. |
| `created_time` | String | ISO timestamp when the session was created. |
| `last_updated_time` | String | ISO timestamp when the session was last updated. |

### History response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `owner_id` | String | The owner of the memory. |
| `memory_container_id` | String | The ID of the memory container. |
| `memory_id` | String | The ID of the affected memory. |
| `action` | String | The type of operation: "ADD", "UPDATE", or "DELETE". |
| `after` | Object | The memory content after the operation. |
| `before` | Object | The memory content before the operation (for UPDATE operations). |
| `namespace` | Object | The namespace context for this memory. |
| `namespace_size` | Integer | The size of the namespace. |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | Timestamp when the operation occurred. |
