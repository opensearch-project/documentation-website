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


Use this API to add an agentic memory to a [memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container). You can create memories in two types:

- **Conversation memory** -- Stores conversational messages between users and assistants. Can be processed (when `infer` is `true`) to extract facts or stored as raw messages.

- **Data memory** -- Stores structured, non-conversational data such as agent state, checkpoints, or reference information.

Memory processing modes (controlled by the `infer` parameter):

- Fact memory -- A processed representation of the message. The large language model (LLM) associated with the memory container extracts and stores key factual information or knowledge from the original text.

- Raw message memory -- The unprocessed message content.

Once an agentic memory is created, you'll provide its `memory_id` to other APIs.

## Endpoint

```json
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories
```

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`messages` | List | Conditional | A list of messages for conversation memory. Each message requires `content` and may include a `role` (commonly, `user` or `assistant`) when `infer` is set to `true`. Required for `memory_type` of `conversation`.
`structured_data` | Object | Conditional | Structured data content for data memory. Required for `memory_type` of `data`.
`memory_type` | String | Required | The type of memory: `conversation` or `data`.
`namespace` | Object | Optional | Namespace context for organizing memories (e.g., `user_id`, `session_id`, `agent_id`).
`metadata` | Object | Optional | Additional metadata for the memory (e.g., `status`, `branch`, custom fields).
`session_id` | String | Optional | The session ID associated with the memory. Deprecated in favor of using `namespace.session_id`.
`agent_id` | String | Optional | The agent ID associated with the memory. Deprecated in favor of using `namespace.agent_id`.
`infer` | Boolean | Optional | Controls whether the LLM infers context from messages. Default is `true` for conversation memory, `false` for data memory. When `true`, the LLM extracts factual information from the original text and stores it as the memory. When `false`, the memory contains the unprocessed message and you must explicitly specify the `role` in each message. 
`tags` | Object | Optional | Custom metadata for the agentic memory.

## Example requests

### Conversation memory

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
  "memory_type": "conversation"
}
```

### Data memory

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
  "memory_type": "data"
}
```

### Trace data memory

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
  "memory_type": "conversation"
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
