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

An AG-UI (Agent-User Interaction) agent follows the [AG-UI protocol](https://docs.ag-ui.com/introduction) for integrating AI agents with frontend applications. This implementation brings real-time AI agent capabilities directly into user interfaces with standardized streaming interactions and sophisticated tool execution. For more information about the AG-UI support implementation, see the [AG-UI Support RFC](https://github.com/opensearch-project/ml-commons/issues/4409).

Similar to a [conversational agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/), an AG-UI agent is configured with an LLM and optionally tools. When processing user input, the agent uses the LLM to reason about the request, considering both the conversation history and available frontend context. The agent then determines which tools (frontend or backend) to use and executes them to provide an appropriate response.

## Prerequisites

Before using AG-UI agents, you must enable the feature by updating your cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.ag_ui_enabled": true, // required
    "plugins.ml_commons.stream_enabled": true, // required
    "plugins.ml_commons.mcp_connector_enabled": true, // optional, enable to connect MCP servers
    "plugins.ml_commons.unified_agent_api_enabled": true, // optional but recommended, enable to use unified agent API interface
  }
}
```
{% include copy-curl.html %}

## Creating an AG-UI agent

The following examples use the unified agent interface, which is the recommended approach for creating AG-UI agents. This interface streamlines agent creation into a single API call and supports multi-modal inputs. For more information, see the [Simplify agent creation](https://github.com/opensearch-project/ml-commons/issues/4552).

While the previous interface can also be used to create AG-UI agents, we recommend using the unified interface for additional capabilities such as multi-modal inputs.

Bedrock Converse example:
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
        "mcp_connector_id": "<MCP CONNECTOR ID>" // optional
    }]
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "memory": {
    "type": "conversation_index"  // optional
  }
}
```
{% include copy-curl.html %}

OpenAI Chat Completion example:
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
        "mcp_connector_id": "<MCP CONNECTOR ID>"  // optional
    }]
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "memory": {
    "type": "conversation_index"  // optional
  }
}
```
{% include copy-curl.html %}

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

### Request fields

The following table lists the request fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `threadId` | String | Required | ID of the conversation thread, generated in frontend. |
| `runId` | String | Required | ID of the current run, generated in frontend. |
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

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For execution details, see [Execute Stream Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
