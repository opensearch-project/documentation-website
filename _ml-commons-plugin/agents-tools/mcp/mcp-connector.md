---
layout: default
title: Connecting to an external MCP server
parent: Using MCP tools
grand_parent: Agents and tools
nav_order: 10
---

# Connecting to an external MCP server 
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

OpenSearch supports agentic workflows using [agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/). While OpenSearch provides built-in tools for running complex queries, [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) enables integration with external tools and data sources. MCP is an open protocol standard that provides a standardized way for AI models to connect to external data sources and tools, acting as a "universal adapter" for remote MCP server tools.

Currently, OpenSearch only supports MCP servers that use the Server-Sent Events (SSE) protocol. Standard Input/Output (`stdio`) protocol is not supported.
{: .note}

The following example demonstrates using MCP tools in agentic workflows.

## Prerequisites

Before using MCP tools, you must complete the following prerequisites.

### Enable MCP and configure trusted connector endpoints

- Enable the MCP protocol by configuring the `plugins.ml_commons.mcp_feature_enabled` setting.
- Configure trusted connector endpoints in the `plugins.ml_commons.trusted_connector_endpoints_regex` setting. For security purposes, this setting uses regex patterns to define which MCP server URLs are allowed.

To configure both settings, send the following request:

```json
POST /_cluster/settings/
{
  "persistent": {
    "plugins.ml_commons.trusted_connector_endpoints_regex": [
      "<mcp server url>"
    ],
    "plugins.ml_commons.mcp_feature_enabled": "true"
  }
}
```
{% include copy-curl.html %}

### Set up an MCP server

Ensure you have a running MCP server that is accessible from your OpenSearch cluster.

## Step 1: Create an MCP connector

An MCP connector stores connection details and credentials for your MCP server. To create an MCP connector, send the following request:

```json
POST /_plugins/_ml/connectors/_create
{
  "name":        "My MCP Connector",
  "description": "Connects to the external MCP server for weather tools",
  "version":     1,
  "protocol":    "mcp_sse",
  "url":         "https://my-mcp-server.domain.com",
  "credential": {
    "mcp_server_key": "THE_MCP_SERVER_API_KEY"
  },
  "parameters":{
    "sse_endpoint": "/sse" 
  },
  "headers": {
    "Authorization": "Bearer ${credential.mcp_server_key}"
  }
}
```
{% include copy-curl.html %}

The following table describes the connector parameters. For more information about standard connector parameters, see [Configuration parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#configuration-parameters).

| Parameter | Data type | Required | Description |
|:----------|:---------|:------------|
| `protocol` | String | Yes | Specify `mcp_sse` to use the SSE protocol (the only supported protocol type for MCP).  |
| `url` | String | Yes | The complete base URL of the MCP server, including protocol, hostname, and port, if not using the default port (for example, `https://my-mcp-server.com:8443`). |
| `credential` | Object | Yes | Contains sensitive authentication information such as API keys or tokens. Values stored in this object can be securely referenced in the `headers` section using the `${credential.*}` syntax. |
| `parameters` | Object | No | Contains configuration parameters for the MCP connector. |
| `parameters.sse_endpoint` | String | No | The SSE endpoint path for the MCP server. Default is `/sse`. |
| `headers` | Object | No | The HTTP headers to include with requests to the MCP server. For authentication headers, use the `${credential.*}` syntax to reference values from the `credential` object (for example, `"Authorization": "Bearer ${credential.mcp_server_key}"`).  |

The response contains the connector ID:

```json
{
  "connector_id": "NZ2W2ZUBZ_3SyqdOvh2n",
}
```

## Step 2: Register a model

Register any externally hosted large language model (LLM) using a connector. For a list of supported models, see [Supported connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

For example, to register an OpenAI chat model, send the following request:

```json
POST /_plugins/_ml/models/_register
{
  "name": "My OpenAI model: gpt-4",
  "function_name": "remote",
  "description": "Test model registration (this example uses OpenAI, but you can register any model)",
  "connector": {
    "name": "My OpenAI Connector: gpt-4",
    "description": "Connector for the OpenAI chat model",
    "version": 1,
    "protocol": "http",
    "parameters": {
      "model": "gpt-4o"
    },
    "credential": {
      "openAI_key": "<YOUR_API_KEY>"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "headers": {
          "Authorization": "Bearer ${credential.openAI_key}"
        },
        "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_instruction}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.prompt}\"}${parameters._interactions:-}], \"tools\": [${parameters._tools:-}],\"parallel_tool_calls\":${parameters.parallel_tool_calls},\"tool_choice\": \"${parameters.tool_choice}\" }"
      }
    ]
  }
}
```
{% include copy-curl.html %}

The response contains the model ID:

```json
{
  "task_id": "K_iQfpYBjoQOEoSHN3wU",
  "status": "CREATED",
  "model_id": "LPiQfpYBjoQOEoSHN3zH"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once the registration is complete, the task `state` changes to `COMPLETED`.

## Step 3: Register an agent for accessing MCP tools

Currently, MCP tools can only be used with [_conversational_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/) or [_plan-execute-reflect_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/) agent types. 

To enable external MCP tools, include one or more MCP connectors in your agent's configuration.

Each connector must specify the following parameters in the `parameters.mcp_connectors` array.

| Parameter | Data type | Required | Description | 
|:--- |:--- |:--- |:--- |
| `mcp_connector_id` | String | Yes | The connector ID of the MCP connector. | 
| `tool_filters` | Array | No | An array of Java-style regular expressions that specify which tools from the MCP server to make available to the agent. A tool will be included if it matches at least one of the regular expressions in the array. If omitted or set to an empty array, all tools exposed by the connector will be available. Use the `^` or `$` anchors or literal strings to precisely match tool names. For example, `^get_forecast` matches any tool starting with "get_forecast", while `search_indices` matches only "search_indices".|

In this example, you'll register a conversational agent using the connector ID created in Step 1. The MCP server has two tools available (`get_alerts` and `get_forecasts`), but only the `get_alerts` tool will be included in the agent's configuration because it matches the specified regex pattern `^get_alerts$`:

```json
POST /_plugins/_ml/agents/_register
{
  "name":        "Weather & Search Bot",
  "type":        "conversational",
  "description": "Uses MCP to fetch forecasts and OpenSearch indices",
  "llm": {
    "model_id": "<MODEL_ID_FROM_STEP_2>",
    "parameters": {
      "max_iteration": 5,
      "system_instruction": "You are a helpful assistant.",
      "prompt": "${parameters.question}"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "openai/v1/chat/completions",
    "mcp_connectors": [
      {
        "mcp_connector_id": "<MCP_CONNECTOR_ID_FROM_STEP_1>",
        "tool_filters": [
          "^get_alerts$"
        ]
      }
    ]
  },
  "tools": [
    { "type": "ListIndexTool" },
    { "type": "SearchIndexTool" }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

The response contains the agent ID:

```json
{
  "agent_id": "LfiXfpYBjoQOEoSH93w7"
}
```

## Step 4: Run the agent

Invoke the registered agent by calling the Execute Agent API and providing a user question:

```json
POST /_plugins/_ml/agents/<Agent_ID>/_execute
{
  "parameters": {
    "question": "Any weather alerts in Washington",
    "verbose": true
  }
}
```
{% include copy-curl.html %}

The agent uses both the OpenSearch tools specified in the `tools` array and the selected tools from the MCP server (based on your tool filters) to return the answer:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "memory_id",
                    "result": "MfiZfpYBjoQOEoSH13wj"
                },
                {
                    "name": "parent_interaction_id",
                    "result": "MviZfpYBjoQOEoSH13xC"
                },
                {
                    "name": "response",
                    "result": "{\"id\":\"chatcmpl-BRRcdxVjkrKG7HjkVWZVwueJSEjgd\",\"object\":\"chat.completion\",\"created\":1.745880735E9,\"model\":\"gpt-4o-2024-08-06\",\"choices\":[{\"index\":0.0,\"message\":{\"role\":\"assistant\",\"tool_calls\":[{\"id\":\"call_yWg0wk4mfE2v8ARebupfbJ87\",\"type\":\"function\",\"function\":{\"name\":\"get_alerts\",\"arguments\":\"{\\\"state\\\":\\\"WA\\\"}\"}}],\"annotations\":[]},\"finish_reason\":\"tool_calls\"}],\"usage\":{\"prompt_tokens\":201.0,\"completion_tokens\":16.0,\"total_tokens\":217.0,\"prompt_tokens_details\":{\"cached_tokens\":0.0,\"audio_tokens\":0.0},\"completion_tokens_details\":{\"reasoning_tokens\":0.0,\"audio_tokens\":0.0,\"accepted_prediction_tokens\":0.0,\"rejected_prediction_tokens\":0.0}},\"service_tier\":\"default\",\"system_fingerprint\":\"fp_f5bdcc3276\"}"
                },
                {
                    "name": "response",
                    "result": "[{\"text\":\"\\nEvent: Wind Advisory\\nArea: Kittitas Valley\\nSeverity: Moderate\\nDescription: * WHAT...Northwest winds 25 to 35 mph with gusts up to 45 mph\\nexpected.\\n\\n* WHERE...Kittitas Valley.\\n\\n* WHEN...From 2 PM to 8 PM PDT Tuesday.\\n\\n* IMPACTS...Gusty winds will blow around unsecured objects. Tree\\nlimbs could be blown down and a few power outages may result.\\nInstructions: Winds this strong can make driving difficult, especially for high\\nprofile vehicles. Use extra caution.\\n\"}]"
                },
                {
                    "name": "response",
                    "result": "There is a Wind Advisory for the Kittitas Valley in Washington. Here are the details:\n\n- **Event:** Wind Advisory\n- **Area:** Kittitas Valley\n- **Severity:** Moderate\n- **Description:** Northwest winds 25 to 35 mph with gusts up to 45 mph expected.\n- **When:** From 2 PM to 8 PM PDT Tuesday.\n- **Impacts:** Gusty winds may blow around unsecured objects, potentially causing tree limbs to fall, and resulting in a few power outages.\n\n**Instructions:** These strong winds can make driving difficult, especially for high-profile vehicles. Use extra caution if you are traveling in the area."
                }
            ]
        }
    ]
}
```

## Additional resources

* For more information about the MCP protocol, see [MCP protocol documentation](https://modelcontextprotocol.io/introduction).
* For information about using MCP in Java, see [MCP Java SDK](https://github.com/modelcontextprotocol/java-sdk).