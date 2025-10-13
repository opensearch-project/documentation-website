---
layout: default
title: Add agentic memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Add Agentic Memory API
**Introduced 3.3**
{: .label .label-purple }


Use this API to add an agentic memory to a [memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container). You can specify different [payload types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/#payload-types) and control [inference mode]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/#inference-mode) for how OpenSearch processes the memory.

Once an agentic memory is created, provide its `memory_id` to other APIs.

## Endpoints

```json
POST /_plugins/_ml/memory_containers/<memory_container_id>/memories
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container to add the memory to. |

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`messages` | Array | Conditional | A list of messages for a `conversational` payload. Each message requires a `content` field and may include a `role` (commonly, `user` or `assistant`) when `infer` is set to `true`. Required when `payload_type` is `conversational`.
`structured_data` | Object | Conditional | Structured data content for data memory. Required when `payload_type` is `data`.
`binary_data` | String | Optional | Binary data content encoded as a Base64 string for binary payloads.
`payload_type` | String | Required | The type of payload. Valid values are `conversational` or `data`. See [Payload types](#payload-types).
`namespace` | Object | Optional | The namespace context for organizing memories (for example, `user_id`, `session_id`, or `agent_id`). If `session_id` is not specified in the `namespace` field, a new session with a new session ID is created.
`metadata` | Object | Optional | Additional metadata for the memory (for example, `status`, `branch`, or custom fields).
`tags` | Object | Optional | Tags for categorizing and organizing memories.
`infer` | Boolean | Optional | Whether to use an LLM to extract key information from messages. Default is `false`. When `true`, the LLM extracts key information from the original text and stores it as a memory. See [Inference mode](#inference-mode).

## Example request: Conversational payload

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories
{
  "messages": [
    {
      "role": "user",
      "content": "I'm Bob, I really like swimming."
    },
    {
      "role": "assistant",
      "content": "Cool, nice. Hope you enjoy your life."
    }
  ],
  "namespace": {
    "user_id": "bob"
  },
  "metadata": {
    "status": "checkpoint",
    "branch": {
      "branch_name": "high",
      "root_event_id": "228nadfs879mtgk"
    }
  },
  "tags": {
    "topic": "personal info"
  },
  "infer": true,
  "payload_type": "conversational"
}
```
{% include copy-curl.html %}

## Example response: Conversation memory

```json
{
  "session_id": "XSEuiJkBeh2gPPwzjYVh",
  "working_memory_id": "XyEuiJkBeh2gPPwzjYWM"
}
```

## Example request: Data payload

To store agent state in working memory, send the following request:

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories
{
  "structured_data": {
    "time_range": {
      "start": "2025-09-11",
      "end": "2025-09-15"
    }
  },
  "namespace": {
    "agent_id": "testAgent1"
  },
  "metadata": {
    "status": "checkpoint",
    "anyobject": "abc"
  },
  "tags": {
    "topic": "agent_state"
  },
  "infer": false,
  "payload_type": "data"
}
```
{% include copy-curl.html %}

## Example response: Data memory

```json
{
  "working_memory_id": "Z8xeTpkBvwXRq366l0iA"
}
```

### Trace data memory

To store agent trace data in working memory, send the following request:

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories
{
  "structured_data": {
    "tool_invocations": [
      {
        "tool_name": "ListIndexTool",
        "tool_input": {
          "filter": "*,-.plugins*"
        },
        "tool_output": "green  open security-auditlog-2025.09.17..."
      }
    ]
  },
  "namespace": {
    "user_id": "bob",
    "agent_id": "testAgent1",
    "session_id": "123"
  },
  "metadata": {
    "status": "checkpoint",
    "branch": {
      "branch_name": "high",
      "root_event_id": "228nadfs879mtgk"
    },
    "anyobject": "abc"
  },
  "tags": {
    "topic": "personal info",
    "parent_memory_id": "o4-WWJkBFT7urc7Ed9hM",
    "data_type": "trace"
  },
  "infer": false,
  "payload_type": "conversational"
}
```
{% include copy-curl.html %}

## Example response: Trace memory

```json
{
  "working_memory_id": "Z8xeTpkBvwXRq366l0iA"
}
```

## Response body fields

The following table lists all response body fields.

| Field           | Data type | Description                                                                                       |
| :-------------- | :-------- | :------------------------------------------------------------------------------------------------ |
| `session_id`    | String    | The session ID associated with the memory (returned for `conversation` memory when a session is created or used). |
| `working_memory_id` | String | The unique identifier for the created working memory entry. |
