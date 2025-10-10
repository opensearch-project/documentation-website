---
layout: default
title: Add agentic memory
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Add Agentic Memory API
**Introduced 3.2**
{: .label .label-purple }


Use this API to add an agentic memory to a [memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container). You can provide memory payload in two types:

- **conversational** -- Stores conversational messages between users and assistants.

- **data** -- Stores extra messages, structured, non-conversational data such as agent state, checkpoints, or reference information.

- **infer=true** -- Use large language model (LLM) to extract key information or knowledge from the messages.

- **infer=false**  -- Only store raw messages and data in working memory.

Once an agentic memory is created, you'll provide its `memory_id` to other APIs.

## Endpoint

```json
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories
```

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`messages` | List | Conditional | A list of messages for conversational payload. Each message requires `content` and may include a `role` (commonly, `user` or `assistant`) when `infer` is set to `true`. Required for `payload_type` of `conversational`.
`structured_data` | Map<String, Object> | Conditional | Structured data content for data memory. Required for `memory_type` of `data`.
`binary_data` | String | Optional | Binary data content encoded as base64 string for binary payloads.
`payload_type` | String | Required | The type of payload: `conversational` or `data`.
`namespace` | List<String> | Optional | Namespace context for organizing memories (e.g., `user_id`, `session_id`, `agent_id`). If `session_id` not exists in `namespace` will create a new session and use the new session's id.
`metadata` | Map<String, String> | Optional | Additional metadata for the memory (e.g., `status`, `branch`, custom fields).
`tags` | List<String> | Optional | Tags for categorizing and organizing memories.
`infer` | Boolean | Optional | Controls whether use LLM to extract key information from messages. Default is `false`. When `true`, the LLM extracts key information from the original text and stores it as the memory.

## Example requests

### Conversational payload

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

### Data payload

Store agent state in working memory:

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

### Trace data memory

Store agent trace data in working memory:

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

## Example responses

### Conversation memory response

```json
{
  "session_id": "XSEuiJkBeh2gPPwzjYVh",
  "working_memory_id": "XyEuiJkBeh2gPPwzjYWM"
}
```

### Data memory response

```json
{
  "working_memory_id": "Z8xeTpkBvwXRq366l0iA"
}
```

## Response body fields

The following table lists all response body fields.

| Field           | Data type | Description                                                                                       |
| :-------------- | :-------- | :------------------------------------------------------------------------------------------------ |
| `session_id`    | String    | The session ID associated with the memory (returned for conversation memory when a session is created or used). |
| `working_memory_id` | String | The unique identifier for the created working memory entry. |
