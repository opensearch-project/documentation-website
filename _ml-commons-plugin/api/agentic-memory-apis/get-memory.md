---
layout: default
title: Get memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 51
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/agentic-memory-apis/get-memory/
---

# Get Memory API
**Introduced 3.3**
{: .label .label-purple }

Use this API to retrieve a specific memory by its type and ID. This unified API supports the four [memory types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#memory-types): `sessions`, `working`, `long-term`, and `history`.

## Endpoints

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container from which to retrieve the memory. |
| `type` | String | Required | The memory type. Valid values are `sessions`, `working`, `long-term`, and `history`. |
| `id` | String | Required | The ID of the memory to retrieve. |

## Example request: Get a working memory

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```
{% include copy-curl.html %}

## Example response: Working memory

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

## Example request: Get a long-term memory

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
```
{% include copy-curl.html %}

## Example response: Long-term memory 

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

## Example request: Get a session

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/CcxjTpkBvwXRq366A1aE
```
{% include copy-curl.html %}

## Example response: Session

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

## Example request: Get a history memory

```json
GET /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/eMxnTpkBvwXRq366hmAU
```
{% include copy-curl.html %}

## Example response: History 

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

The response fields vary depending on the memory type.

### Working memory response fields

The following table lists all working memory response body fields.

| Field                 | Data type | Description                                             |
|:----------------------| :--- |:--------------------------------------------------------|
| `memory_container_id` | String | The ID of the memory container.                         |
| `payload_type`        | String | The type of payload. Valid values are `conversation` and `data`.          |
| `messages`            | Array | Array of conversation messages (applicable only to the `conversation` memory type). | 
| `namespace`           | Object | The namespace context for this memory.                  |
| `metadata`            | Object | Additional metadata associated with the memory.         |
| `tags`                | Object | Associated tags for categorization.                     |
| `infer`               | Boolean | Whether inference was enabled for this memory.          |
| `created_time`        | Long | The timestamp of when the memory was created.                  |
| `last_updated_time`   | Long | The timestamp of when the memory was last updated.             |

### Long-term memory response fields

The following table lists all long-term memory response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The extracted long-term memory fact. |
| `strategy_type` | String | The type of memory strategy used (for example, `SEMANTIC`, `SUMMARY`, or `USER_PREFERENCE`). |
| `namespace` | Object | The namespace context for this memory. |
| `namespace_size` | Integer | The number of namespaces. |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | The timestamp when the memory was created. |
| `last_updated_time` | Long | The timestamp when the memory was last updated. |
| `memory_embedding` | Array | The vector embedding of the memory content (truncated in display). |
| `owner_id` | String | The ID of the memory owner. |
| `strategy_id` | String | The unique identifier for the strategy instance. |

### Session response fields

The following table lists all session response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_container_id` | String | The ID of the memory container. |
| `namespace` | Object | The namespace context for this session. |
| `created_time` | String | The timestamp of when the session was created. |
| `last_updated_time` | String | The timestamp of when the session was last updated. |

### History response fields

The following table lists all history response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `owner_id` | String | The ID of the memory owner. |
| `memory_container_id` | String | The ID of the memory container. |
| `memory_id` | String | The ID of the affected memory. |
| `action` | String | The type of operation: `ADD`, `UPDATE`, or `DELETE`. |
| `after` | Object | The memory content after the operation. |
| `before` | Object | The memory content before the operation (for `UPDATE` operations). |
| `namespace` | Object | The namespace context for this memory. |
| `namespace_size` | Integer | The number of namespaces. |
| `tags` | Object | Associated tags for categorization. |
| `created_time` | Long | The timestamp of when the operation occurred. |
