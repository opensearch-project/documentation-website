---
layout: default
title: Get agentic memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 60
---

# Get Agentic Memory API
**Introduced 3.2**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to retrieve an agentic memory by its ID.

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

The following table lists all response body fields.

| Field               | Data type | Description                                                                              |
| :------------------ | :-------- | :--------------------------------------------------------------------------------------- |
| `session_id`        | String    | The unique identifier for the session associated with this memory.                       |
| `memory`            | String    | If the memory was created with `infer: false`, contains the stored text from the message. If the memory was created with `infer: true`, contains the extracted fact from the message.                                       |
| `memory_type`       | String    | The type of memory. `RAW_MESSAGE` indicates the unprocessed message text. `FACT` indicates a fact inferred by the large language model. |
| `user_id`           | String    | The ID of the user associated with this memory.                                          |
| `role`              | String    | The role of the message author, such as `assistant`.                       |
| `created_time`      | Integer   | The Unix timestamp, in milliseconds, when the memory entry was created.                  |
| `last_updated_time` | Integer   | The Unix timestamp, in milliseconds, when the memory entry was last updated.             |
