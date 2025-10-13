---
layout: default
title: Create session
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Create session
**Introduced 3.3**
{: .label .label-purple }

Use this API to create a new session in a memory container. Sessions represent distinct interaction contexts between users and agents.

## Path and HTTP methods

```json
POST /_plugins/_ml/memory_containers/<memory_container_id>/memories/sessions
```

## Path parameters

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container where the session will be created. |

## Request fields

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | String | Optional | Custom session ID. If provided, this ID will be used for the session. If not provided, a random ID will be generated. |
| `summary` | String | Optional | A summary or description of the session. |
| `metadata` | Object | Optional | Additional metadata for the session as key-value pairs. |
| `namespace` | Object | Optional | Namespace information for organizing the session. |

## Example requests

### Create session with custom ID

```json
POST /_plugins/_ml/memory_containers/{{mem_container_id}}/memories/sessions
{
  "session_id": "abc123",
  "metadata": {
    "key1": "value1"
  }
}
```

### Create session with auto-generated ID

```json
POST /_plugins/_ml/memory_containers/{{mem_container_id}}/memories/sessions
{
  "summary": "This is a test session",
  "metadata": {
    "key1": "value1"
  },
  "namespace": {
    "user_id": "bob"
  }
}
```
{% include copy-curl.html %}

## Example responses

### Response for custom session ID

```json
{
  "session_id": "abc123",
  "status": "created"
}
```

### Response for auto-generated session ID

```json
{
  "session_id": "jTYm35kBt8CyICnjxJl9",
  "status": "created"
}
```

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `session_id` | String | The ID of the created session (either provided or auto-generated). |
| `status` | String | The status of the creation operation. |
