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

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to add an agentic memory to a [memory container]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container). You can create a memory in one of the following modes (controlled by the `infer` parameter):

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
`messages` | List | Required | A list of messages. Currently, OpenSearch supports one message per request.
`session_id` | String | Optional | The session ID associated with the memory.
`agent_id` | String | Optional | The agent ID associated with the memory.
`infer` | Boolean | Optional | Controls whether the LLM infers context from messages. When `true`, the LLM extracts factual information from the original text and stores it as the memory. When `false`, the memory contains the unprocessed message.
`tags` | Object | Optional | Custom metadata for the agentic memory.

## Example request

```json
POST /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN/memories
{
    "messages": [
        {"role": "assistant", "content": "Machine learning is a subset of artificial intelligence"}
    ],
    "session_id": "sess_789",
    "agent_id": "agent_123",
    "tags": {
        "topic": "personal info"
    }
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
    "session_id": "sess_789"
}
```

## Response body fields

The following table lists all response body fields.

| Field           | Data type | Description                                                                                       |
| :-------------- | :-------- | :------------------------------------------------------------------------------------------------ |
| `results`       | List      | A list of memory entries returned by the request.                                                 |
| `results.id`    | String    | The unique identifier for the memory entry.                                                       |
| `results.text`  | String    | If `infer` is `false`, contains the stored text from the message. If `infer` is `true`, contains the extracted fact from the message.             |
| `results.event` | String    | The type of event for the memory entry. For the Add Agentic Memory API, `ADD` indicates that the memory was added. |
| `session_id`    | String    | The session ID associated with the memory.                                    |
