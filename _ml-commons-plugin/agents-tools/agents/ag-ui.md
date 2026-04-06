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

Similar to a [conversational agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/), an AG-UI agent is configured with a large language model (LLM) and optional tools. When processing user input, the agent uses the LLM to reason about the request, considering both the conversation history and available frontend context. The agent then determines the tools to use and executes them to provide an appropriate response.

AG-UI agents can use two types of tools:
- **Backend tools**: Registered with the agent (like `ListIndexTool` or `SearchIndexTool`) and query OpenSearch data and perform server-side operations.
- **Frontend tools**: Provided in each request and allow the agent to interact with the UI, such as refreshing dashboards, applying filters, or navigating between pages.

## Prerequisites

Before using AG-UI agents, you must enable the feature by updating your cluster settings. The `ag_ui_enabled` and `stream_enabled` settings are required, while `mcp_connector_enabled` (to connect to Model Context Protocol [MCP] servers) and `unified_agent_api_enabled` are optional but recommended:

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

AG-UI agents use the unified registration method to streamline agent creation into a single API call. To register an AG-UI agent, set the `type` field to `AG_UI` and configure your model using the Unified Agent API.

For complete registration instructions, field definitions, and examples for all supported model providers (Amazon Bedrock, Google Gemini, OpenAI), see [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#unified-agent-registration).

### Example request: Amazon Bedrock Converse

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

## Execute stream agent

AG-UI agents use a specialized execution protocol designed for frontend applications. Unlike regular agent execution (the [Execute Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/)) that uses the `input` field, AG-UI agents use the AG-UI protocol format with frontend context, tools, and streaming responses.

### AG-UI protocol format

AG-UI execution follows the [AG-UI protocol](https://docs.ag-ui.com/introduction) specification, providing structured communication between frontend applications and AI agents. The protocol includes conversation threading, frontend tool integration, and real-time streaming responses.

For more information about the input format specification, see [RunAgentInput](https://docs.ag-ui.com/sdk/js/core/types#runagentinput) in the AG-UI documentation.

### Request fields

The following table lists the request fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `threadId` | String | Required | Unique identifier for the conversation thread, generated by the frontend. Used to maintain conversation continuity across multiple requests and enable conversation memory. |
| `runId` | String | Required | Unique identifier for this specific execution within the thread, generated by the frontend. Each new request should have a new `runId`. |
| `state` | Object | Required | Current internal state of the agent session. Can store workflow state, user preferences, or session-specific data that persists across tool calls within the same run. |
| `messages` | Array | Required | Array of conversation messages including both user input and previous assistant responses. Each message has an `id`, `role` (user/assistant), and `content`. |
| `tools` | Array | Required | Array of frontend-specific tools the agent can call to interact with the UI. Each tool includes a `name`, `description`, and `parameters` schema defining how the agent can invoke UI actions. |
| `context` | Array | Required | Array of context objects providing current application state to the agent. Includes information like active dashboard, applied filters, time ranges, or any relevant UI context that helps the agent understand the user's current situation. |
| `forwardedProps` | Object | Required | Additional properties forwarded from the frontend application, such as user authentication details, permissions, application configuration, or other metadata needed for agent operations. |

#### Example request

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

AG-UI agents return Server-Sent Events (SSEs) that allow frontends to provide real-time feedback as the agent processes the request:

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

Each SSE contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | The event type. |
| `timestamp` | Long | The Unix timestamp, in milliseconds, when the event was generated. |
| `threadId` | String | The conversation thread ID from the request. |
| `runId` | String | The run ID from the request. |
| `messageId` | String | The unique identifier for the message (present in message events). |
| `role` | String | The role of the message sender, typically "assistant" (present in message start events). |
| `delta` | String | Incremental content for streaming text or tool arguments (present in content/args events). |
| `toolCallId` | String | The unique identifier for the tool call (present in tool call events). |
| `toolCallName` | String | The name of the tool being called (present in tool call start events). |

### Event types

AG-UI agents return SSEs with the following event types in the `type` field.

| Event type | Description |
| :--- | :--- |
| `RUN_STARTED` | Indicates the beginning of a run |
| `TEXT_MESSAGE_START` | Marks the start of an assistant message |
| `TEXT_MESSAGE_CONTENT` | Contains incremental text content (streaming) |
| `TEXT_MESSAGE_END` | Marks the end of an assistant message |
| `TOOL_CALL_START` | Indicates the beginning of a tool call |
| `TOOL_CALL_ARGS` | Contains incremental tool call arguments |
| `TOOL_CALL_END` | Marks the end of a tool call |
| `RUN_FINISHED` | Indicates the completion of a run |

## Tracking token usage
**Introduced 3.6**
{: .label .label-purple }

AG-UI agents support token usage tracking, which provides detailed metrics about token consumption for each LLM call during agent execution. Token usage is delivered as part of the streaming event sequence.

For AG-UI agents, token usage tracking is enabled during agent registration by setting `"include_token_usage": true` in the `parameters` field. This applies to both the unified registration method (new interface) and the regular registration method (old interface). Once the agent is registered, this setting cannot be changed during agent execution, it must be set at registration time.

### Enabling token usage tracking during registration (unified method)

To enable token usage tracking for an AG-UI agent using the unified registration method, include the `include_token_usage` parameter in the `parameters` field during registration:

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
    "include_token_usage": true
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

### Enabling token usage tracking during registration (regular method)

Alternatively, you can enable token usage tracking using the regular registration method by including `include_token_usage` in the agent's `parameters`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "AG-UI Agent",
  "type": "AG_UI",
  "llm": {
    "model_id": "<MODEL_ID>",
    "parameters": {
      "max_iteration": 5
    }
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "parameters": {
    "include_token_usage": true
  },
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Token usage in streaming responses

When token usage tracking is enabled, the streaming response includes a `Custom` event with token usage metrics after the `RUN_FINISHED` event. The metrics include per-turn and per-model token consumption:

```json
data: {"type":"RUN_STARTED","timestamp":1775501029508,"threadId":"thread-agui-new-agmem-postman","runId":"run-postman-agui-new-am"}

data: {"type":"TOOL_CALL_START","timestamp":1775501031547,"toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w","toolCallName":"ListIndexTool"}

data: {"type":"TOOL_CALL_ARGS","timestamp":1775501031549,"toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w","delta":""}

data: {"type":"TOOL_CALL_ARGS","timestamp":1775501031814,"toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w","delta":"{\"indi"}

data: {"type":"TOOL_CALL_ARGS","timestamp":1775501031814,"toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w","delta":"ces\": []}"}

data: {"type":"TOOL_CALL_END","timestamp":1775501031893,"toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w"}

data: {"type":"TOOL_CALL_RESULT","timestamp":1775501031911,"messageId":"msg_66642762007875","toolCallId":"tooluse_Z8ov0YNqeAW8B2h1qNH49w","content":"..."}

data: {"type":"TEXT_MESSAGE_START","timestamp":1775501033817,"messageId":"msg_66644668213500","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","timestamp":1775501033818,"messageId":"msg_66644668213500","delta":"Here are all the indices..."}

data: {"type":"TEXT_MESSAGE_END","timestamp":1775501041102,"messageId":"msg_66644668213500"}

data: {"type":"Custom","timestamp":1775501041115,"name":"token_usage","value":{"per_turn_usage":[{"model_name":"Auto-generated model for us.anthropic.claude-sonnet-4-5-20250929-v1:0","model_url":"https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-5-20250929-v1:0/converse","total_tokens":4806.0,"output_tokens":54.0,"turn":1.0,"model_id":"9RIbZJ0B1Feno22Ak-7G","input_tokens":4752.0},{"model_name":"Auto-generated model for us.anthropic.claude-sonnet-4-5-20250929-v1:0","model_url":"https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-5-20250929-v1:0/converse","total_tokens":6262.0,"output_tokens":898.0,"turn":2.0,"model_id":"9RIbZJ0B1Feno22Ak-7G","input_tokens":5364.0}],"per_model_usage":[{"model_name":"Auto-generated model for us.anthropic.claude-sonnet-4-5-20250929-v1:0","model_url":"https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-5-20250929-v1:0/converse","call_count":2.0,"total_tokens":11068.0,"output_tokens":952.0,"model_id":"9RIbZJ0B1Feno22Ak-7G","input_tokens":10116.0}]}}

data: {"type":"RUN_FINISHED","timestamp":1775501041116,"threadId":"thread-agui-new-agmem-postman","runId":"run-postman-agui-new-am"}
```

The `token_usage` event contains:
- **`per_turn_usage`**: Token metrics for each individual turn during the agent execution, including `turn` number, `model_id`, `model_name`, `model_url`, `input_tokens`, `output_tokens`, and `total_tokens`.
- **`per_model_usage`**: Aggregated token metrics grouped by model, including `model_id`, `model_name`, `model_url`, `call_count`, `input_tokens`, `output_tokens`, and `total_tokens`.

For detailed information about token usage fields and how tokens are calculated by different model providers, see [Tracking token usage]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/#tracking-token-usage) in the Execute Agent API documentation.

## Next steps

- For AG-UI agent registration, see [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).
- For unified agent execution, see [Unified agent execution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/#unified-agent-execution).
- Learn about the [AG-UI protocol specification](https://docs.ag-ui.com/introduction).
- Explore available backend [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) for your agents.
- Review [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/) for additional functionality.
