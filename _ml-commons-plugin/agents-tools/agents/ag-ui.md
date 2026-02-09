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

An Agent-User Interaction (AG-UI) agent follows the [AG-UI protocol](https://docs.ag-ui.com/introduction) for integrating AI agents with frontend applications. This implementation brings real-time AI agent capabilities directly into user interfaces with standardized streaming interactions and sophisticated tool execution.

Similar to a [conversational agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/), an AG-UI agent is configured with an LLM and optional tools. When processing user input, the agent uses the LLM to reason about the request, considering both the conversation history and available frontend context. The agent then determines the tools to use and executes them to provide an appropriate response.

AG-UI agents can use two types of tools:
- **Backend tools**: Registered with the agent (like `ListIndexTool` or `SearchIndexTool`) that query OpenSearch data and perform server-side operations.
- **Frontend tools**: Provided in each request that allow the agent to interact with the UI, such as refreshing dashboards, applying filters, or navigating between pages.

## Prerequisites

Before using AG-UI agents, you must enable the feature by updating your cluster settings. The `ag_ui_enabled` and `stream_enabled` settings are required, while `mcp_connector_enabled` (to connect MCP servers) and `unified_agent_api_enabled` are optional but recommended:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.ag_ui_enabled": true,
    "plugins.ml_commons.stream_enabled": true,
    "plugins.ml_commons.mcp_connector_enabled": true,
    "plugins.ml_commons.unified_agent_api_enabled": true
  }
}
```
{% include copy-curl.html %}

## Creating an AG-UI agent

The following examples use the unified registration method---the recommended approach for creating AG-UI agents. This method streamlines agent creation into a single API call and supports multimodal inputs. While the regular registration method can also be used to create AG-UI agents, we recommend using the unified method for its enhanced capabilities.

### Endpoint

To create an AG-UI agent, send a register request to the following endpoint:

```json
POST /_plugins/_ml/agents/_register
```


AG-UI agents use the same registration fields as other OpenSearch agents. For complete field definitions and configuration options, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).

### Example request: Amazon Bedrock Claude

This example creates an AG-UI agent using an Anthropic Claude model hosted on Amazon Bedrock. The `model_provider` field is set to `bedrock/converse` for Amazon Bedrock Claude models that support streaming. The `max_iteration` field limits the number of reasoning iterations to prevent infinite loops. The `mcp_connectors` array extends agent capabilities. The `memory.type` is set to `conversation_index` to store conversation history in OpenSearch for follow-up questions with conversation memory and index listing capabilities:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "AG-UI Agent",
  "type": "AG_UI",
  "description": "An AI agent designed for UI interactions with streaming support",
  "model": {
    "model_id": "<MODEL ID>",
    "model_provider": "bedrock/converse",
        "credential": {
          "access_key": "<AWS ACCESS KEY>",
          "secret_key": "<AWS SECRET KEY>",
          "session_token": "<AWS SESSION TOKEN>"
        },
        "model_parameters": {
          "system_prompt": "You are a helpful assistant and an expert in OpenSearch."
        }
  },
  "parameters": {
    "max_iteration": 5,
    "mcp_connectors": [{
        "mcp_connector_id": "<MCP CONNECTOR ID>"
    }]
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example request: OpenAI Chat Completion

This example creates an AG-UI agent using OpenAI's GPT models with higher iteration limits for complex reasoning tasks. The `model_provider` is set to `openai/v1/chat/completions` for OpenAI Chat Completion models:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "AG-UI Agent",
  "type": "AG_UI",
  "description": "An AI agent designed for UI interactions with streaming support",
  "model": {
    "model_id": "<MODEL ID>",
    "model_provider": "openai/v1/chat/completions",
    "credential": {
      "openai_api_key": "<OPENAI API KEY>"
    },
    "model_parameters": {
      "system_prompt": "You are a helpful assistant and an expert in OpenSearch."
    }
  },
  "parameters": {
    "max_iteration": 50,
    "mcp_connectors": [{
        "mcp_connector_id": "<MCP CONNECTOR ID>"
    }]
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example response

OpenSearch responds with an agent ID that you'll use to execute the agent:

```json
{
  "agent_id": "bpV_Zo0BRhAwb9PZqGja"
}
```

## Execute stream agent

Use the Execute Stream Agent API to interact with your AG-UI agent after it has been registered.

### Endpoint

```json
POST /_plugins/_ml/agents/{{agent_id}}/_execute/stream
```

### Input format

The AG-UI execution API supports three input modes:

1. **Plain text**: Simple string input for basic text interactions.
2. **Content blocks**: Text, images, video, and documents with base64 encoding or URL sources.
3. **Messages format**: Role-based conversation history with multimodal content blocks for complex interactions.

For more information about the input format, see [RunAgentInput](https://docs.ag-ui.com/sdk/js/core/types#runagentinput) in the AG-UI documentation.

### Request fields

The following table lists the request fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `threadId` | String | Required | Unique identifier for the conversation thread, generated by the frontend. Used to maintain conversation continuity across multiple requests and enable conversation memory. |
| `runId` | String | Required | Unique identifier for this specific execution within the thread, generated by the frontend. Each new request should have a new `runId`. |
| `state` | Object | Required | Current internal state of the agent session. Can store workflow state, user preferences, or session-specific data that persists across tool calls within the same run. |
| `messages` | Array | Required | Array of conversation messages including both user input and previous assistant responses. Each message has an `id`, `role` (user/assistant), and `content`. |
| `tools` | Array | Required | Array of frontend-specific tools the agent can call to interact with the UI. Each tool includes `name`, `description`, and `parameters` schema defining how the agent can invoke UI actions. |
| `context` | Array | Required | Array of context objects providing current application state to the agent. Includes information like active dashboard, applied filters, time ranges, or any relevant UI context that helps the agent understand the user's current situation. |
| `forwardedProps` | Object | Required | Additional properties forwarded from the frontend application, such as user authentication details, permissions, application configuration, or other metadata needed for agent operations. |

### Example request

The following example shows how to execute an AG-UI agent using the AG-UI protocol format with frontend tools, conversation context, and application state:

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

### Example response

AG-UI agents return Server-Sent Events (SSE) that allow frontends to provide real-time feedback as the agent processes the request:

```json
data: {"type":"RUN_STARTED","timestamp":1234567890,"threadId":"thread-xxxxx","runId":"run-xxxxx"}

data: {"type":"TEXT_MESSAGE_START","timestamp":1234567890,"messageId":"msg-xxxxx","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","timestamp":1234567890,"messageId":"msg-xxxxx","delta":"Response text here"}

data: {"type":"TEXT_MESSAGE_END","timestamp":1234567890,"messageId":"msg-xxxxx"}

data: {"type":"TOOL_CALL_START","timestamp":1234567890,"toolCallId":"tool-xxxxx","toolCallName":"frontend_tool_example"}

data: {"type":"TOOL_CALL_ARGS","timestamp":1234567890,"toolCallId":"tool-xxxxx","delta":"{\"param\":\"value\"}"}

data: {"type":"TOOL_CALL_END","timestamp":1234567890,"toolCallId":"tool-xxxxx"}

data: {"type":"RUN_FINISHED","timestamp":1234567890,"threadId":"thread-xxxxx","runId":"run-xxxxx"}
```

### Response fields

Each Server-Sent Event contains the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | The event type (see list above). |
| `timestamp` | Long | Unix timestamp in milliseconds when the event was generated. |
| `threadId` | String | The conversation thread ID from the request. |
| `runId` | String | The run ID from the request. |
| `messageId` | String | Unique identifier for the message (present in message events). |
| `role` | String | The role of the message sender, typically "assistant" (present in message start events). |
| `delta` | String | Incremental content for streaming text or tool arguments (present in content/args events). |
| `toolCallId` | String | Unique identifier for the tool call (present in tool call events). |
| `toolCallName` | String | Name of the tool being called (present in tool call start events). |

### Output format

AG-UI agents return Server-Sent Events (SSE) with the following event types in the `type` field.

| Event Type | Description |
| :--- | :--- |
| `RUN_STARTED` | Indicates the beginning of a run |
| `TEXT_MESSAGE_START` | Marks the start of an assistant message |
| `TEXT_MESSAGE_CONTENT` | Contains incremental text content (streaming) |
| `TEXT_MESSAGE_END` | Marks the end of an assistant message |
| `TOOL_CALL_START` | Indicates the beginning of a tool call |
| `TOOL_CALL_ARGS` | Contains incremental tool call arguments |
| `TOOL_CALL_END` | Marks the end of a tool call |
| `RUN_FINISHED` | Indicates the completion of a run |

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For execution details, see [Execute Stream Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
