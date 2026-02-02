---
layout: default
title: AG-UI agents
has_children: false
has_toc: false
nav_order: 50
parent: Agents
grand_parent: Agents and tools
---

# AG-UI agents
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

An AG-UI agent follows the [AG-UI protocol](https://docs.ag-ui.com/introduction) for integrating AI agents with frontend applications. This agent type enables seamless communication between OpenSearch and user interfaces by accepting frontend context and tools, allowing the agent to interact directly with UI components and application state.

## Prerequisites

Before using AG-UI agents, you must enable the feature by updating your cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.ag_ui_enabled": true
  }
}
```
{% include copy-curl.html %}

## Key features

- **Thread-based conversations**: Maintains conversation history through thread and run identifiers
- **Rich streaming output**: Returns server-sent events (SSE) with granular event types for UI rendering
- **Tool integration**: Supports dynamic tool definitions passed with each request
- **Context awareness**: Accepts application context, state, and forwarded properties
- **Real-time feedback**: Provides detailed event types including run status, message content, and tool calls

## Input format

AG-UI agents accept requests with the following structure. For more information about the input format, see [RunAgentInput](https://docs.ag-ui.com/sdk/js/core/types#runagentinput) in the AG-UI documentation.

```json
POST /_plugins/_ml/agents/{{agent_id}}/_execute/stream
{
    "threadId": "thread-xxxxx",
    "runId": "run-xxxxx",
    "messages": [
        {
            "id": "msg-xxxxx",
            "role": "user",
            "content": "hello"
        }
    ],
    "tools": [
        {
            "name": "frontend_tool_example",
            "description": "This is a frontend tool",
            "parameters": {
                ...
            }
        }
    ],
    "context": [
        {
            "description": "Page context example",
            "value": "{\"appId\":\"example\",\"timeRange\":{\"from\":\"now-15m\",\"to\":\"now\"},\"query\":{\"query\":\"example\",\"language\":\"PPL\"}}"
        }
    ],
    "state": {},
    "forwardedProps": {}
}
```
{% include copy-curl.html %}

### Request fields

The following table lists the request fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `threadId` | String | Required | ID of the conversation thread. |
| `runId` | String | Required | ID of the current run. |
| `state` | Object | Required | Current state of the agent. |
| `messages` | Array | Required | Array of messages in the conversation. |
| `tools` | Array | Required | Array of tools available to the agent. |
| `context` | Array | Required | Array of context objects provided to the agent. |
| `forwardedProps` | Object | Required | Additional properties forwarded to the agent. |

## Output format

AG-UI agents return server-sent events (SSE) with the following event types:

- **RUN_STARTED**: Indicates the beginning of a run
- **TEXT_MESSAGE_START**: Marks the start of an assistant message
- **TEXT_MESSAGE_CONTENT**: Contains incremental text content (streaming)
- **TEXT_MESSAGE_END**: Marks the end of an assistant message
- **TOOL_CALL_START**: Indicates the beginning of a tool call
- **TOOL_CALL_ARGS**: Contains incremental tool call arguments
- **TOOL_CALL_END**: Marks the end of a tool call
- **RUN_FINISHED**: Indicates the completion of a run

Example response:

```
data: {"type":"RUN_STARTED","timestamp":1234567890,"threadId":"thread-xxxxx","runId":"run-xxxxx"}

data: {"type":"TEXT_MESSAGE_START","timestamp":1234567890,"messageId":"msg-xxxxx","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","timestamp":1234567890,"messageId":"msg-xxxxx","delta":"Response text here"}

data: {"type":"TEXT_MESSAGE_END","timestamp":1234567890,"messageId":"msg-xxxxx"}

data: {"type":"TOOL_CALL_START","timestamp":1234567890,"toolCallId":"tool-xxxxx","toolCallName":"frontend_tool_example"}

data: {"type":"TOOL_CALL_ARGS","timestamp":1234567890,"toolCallId":"tool-xxxxx","delta":"{\"param\":\"value\"}"}

data: {"type":"TOOL_CALL_END","timestamp":1234567890,"toolCallId":"tool-xxxxx"}

data: {"type":"RUN_FINISHED","timestamp":1234567890,"threadId":"thread-xxxxx","runId":"run-xxxxx"}
```

## Registration example

```json
POST /_plugins/_ml/agents/_register
{
  "name": "AG-UI Agent",
  "type": "AG_UI",
  "description": "An AI agent designed for UI interactions with streaming support",
  "llm": {
    "model_id": "<MODEL_ID>",
    "parameters": {
      "max_iteration": 5,
      "response_filter": "$.completion"
    }
  },
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For execution details, see [Execute Stream Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
