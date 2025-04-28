---
layout: default
title: Connect to External MCP Server (Experimental)
has_children: false
has_toc: false
nav_order: 1
parent: Model Context Protocol (MCP)
grand_parent: Machine learning
---

# Connect to External MCP Server (Experimental)
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

## Overview

OpenSearch ML Commons supports Agentic Workflows through the Agents framework. While OpenSearch provides built-in tools for solving complex queries, the Model Context Protocol (MCP) enables integration with external tools and data sources. MCP is an open protocol standard that provides a standardized way for AI models to connect to external data sources and tools, acting as a "universal adapter" for remote MCP server tools.

Currently, OpenSearch only supports MCP servers that use Server-Sent Events (SSE) protocol. STDIO protocol is not supported.
{: .note}

## Prerequisites

Before using MCP tools, you must complete the following configuration steps:

1. Enable the MCP feature flag
2. Configure trusted connector endpoints

### Configuration Steps

Execute the following API call to configure both settings:

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

### Settings Explained

* `plugins.ml_commons.mcp_feature_enabled`: Enables the MCP feature in OpenSearch
* `plugins.ml_commons.trusted_connector_endpoints_regex`: Defines the allowed MCP server URLs using regex patterns for security

### MCP Server
A running MCP server (Any MCP-compliant implementation) accessible from your OpenSearch cluster.

## Using MCP Tools

### Step 1: Create an MCP Connector

An MCP Connector stores connection details and credentials for your MCP server. Use the ML Commons connectors API:

```json
POST /_plugins/_ml/connectors/_create
Content-Type: application/json

{
  "name":        "My MCP Connector",
  "description": "Connects to the external MCP server for weather tools",
  "version":     1,
  "protocol":    "mcp_sse",
  "url":         "https://my-mcp-server.domain.com",
  "credential": {
    "mcp_server_key": "SECRET_TOKEN"
  },
  "headers": {
    "Authorization": "Bearer ${credential.mcp_server_key}"
  }
}
```
- **protocol:** Use mcp_sse for Server-Sent Events (only SSE is supported).

- **url:** Base URL of the MCP server (include port if non-standard).

- **headers:** Support arbitrary headers; you may interpolate ${credential.*} values.


**Response:**
```
{
  "connector_id": "NZ2W2ZUBZ_3SyqdOvh2n",
}
```

### Step 2: Register a Model

Use the ML Commons models API to register any remote LLM model (not limited to below example). 

Example:

```json
POST /_plugins/_ml/models/_register
Content-Type: application/json

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

**Response:**

```
{
    "task_id": "K_iQfpYBjoQOEoSHN3wU",
    "status": "CREATED",
    "model_id": "LPiQfpYBjoQOEoSHN3zH"
}
```

### Step 3: Registering an Agent with MCP Connectors

Currently MCP tools can only be added to the `conversational` and `plan_and_execute agents`. To enable external MCP tools, include one or more MCP connectors in your agent's `parameters.mcp_connectors` array. Each entry must specify: 
- **mcp_connector_id**: The connector ID created in Step 1.
- **tool_filters**(optional): An array of Java-style regular expressions to whitelist specific tools by their IDs.

-- If omitted or set to an empty array, all tools exposed by the connector will be available.

-- Use ^/$ anchors or literal strings to precisely match tool names.

-- Example: ^get_forecast matches any tool starting with get_forecast; search_indices matches only search_indices.

```json
POST /_plugins/_ml/agents/_register
Content-Type: application/json

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
        "mcp_connector_id": "<MCP_CONNECTOR_ID_FROM_STEP_1`>",
        "tool_filters": [
          "^get_forecast",    // only tools starting with "get_forecast"
          "search_indices"    // exact match for "search_indices"
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

**Response:**
```
{
    "agent_id": "LfiXfpYBjoQOEoSH93w7"
}
```

### Step 4: Execute Agent

Invoke the registered agent with a query. The agent will load tools from both OpenSearch and the filtered MCP server.

```json
POST /_plugins/_ml/agents/<Agent ID>/_execute
{
  "parameters": {
    "question": "Any weather alerts in Washington",
    "verbose": true
  }
}
```

**Response:**
```
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

## References

* [MCP Protocol Documentation](https://modelcontextprotocol.io/introduction)
* [MCP Java SDK](https://github.com/modelcontextprotocol/java-sdk) 