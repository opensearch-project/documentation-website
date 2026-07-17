---
layout: default
title: List connector MCP tools
parent: MCP client APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# List Connector MCP Tools API
**Introduced 3.8**
{: .label .label-purple }

Use this API to list all tools available on an external MCP server through a registered MCP connector. The response includes each tool's name, type, description, and input schema.

Flow and Conversational Flow agents require tools to be defined in advance when you register the agent. Use this API to discover available tools and their parameters before adding MCP tools to an agent configuration. For more information, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).

This API differs from the [List MCP Tools API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/), which lists tools registered on OpenSearch's own MCP server.
{: .note}

## Prerequisites

Before using this API, complete the following steps:

1. Enable MCP connectors by setting `plugins.ml_commons.mcp_connector_enabled` to `true`.
2. Configure trusted MCP server endpoints in `plugins.ml_commons.trusted_connector_endpoints_regex`.
3. Create an MCP connector with protocol `mcp_sse` or `mcp_streamable_http`.

For setup instructions, see [Connecting to an external MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/mcp-connector/).

## Endpoints

```json
GET /_plugins/_ml/connectors/{connector_id}/tools
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `connector_id` | String | Required | The ID of the MCP connector. Obtain this ID from the [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/) response. The connector must use the `mcp_sse` or `mcp_streamable_http` protocol. |

## Example request

The following example lists tools for an MCP connector with ID `1MlVyZwBBtWLSsWgaB6w`:

```json
GET /_plugins/_ml/connectors/1MlVyZwBBtWLSsWgaB6w/tools
```
{% include copy-curl.html %}

## Example response

OpenSearch connects to the external MCP server through the specified connector and returns the available tools:

```json
{
  "tools": [
    {
      "name": "search_documents",
      "type": "McpStreamableHttpTool",
      "description": "Search a document repository for relevant content.",
      "input_schema": "{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\",\"description\":\"The search query.\"},\"limit\":{\"type\":\"integer\",\"description\":\"The maximum number of results to return.\",\"minimum\":1,\"maximum\":100}},\"required\":[\"query\"]}"
    },
    {
      "name": "get_weather",
      "type": "McpStreamableHttpTool",
      "description": "Retrieve current weather conditions for a specified location.",
      "input_schema": "{\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"description\":\"The city or geographic location.\"},\"units\":{\"type\":\"string\",\"description\":\"The temperature unit system.\",\"enum\":[\"celsius\",\"fahrenheit\"]}},\"required\":[\"location\"]}"
    }
  ]
}
```

If the MCP server exposes no tools, OpenSearch returns an empty `tools` array:

```json
{
  "tools": []
}
```

## Response body fields

The following table lists the top-level response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `tools` | Array | A list of tools available on the external MCP server. Returns an empty array if the MCP server exposes no tools. |

Each object in the `tools` array contains the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required | The tool name as defined by the external MCP server. Use this value as the `name` field when configuring MCP tools in an agent. |
| `type` | String | Required | The OpenSearch tool type used to execute the MCP tool. Valid values are `McpStreamableHttpTool` for connectors with protocol `mcp_streamable_http` and `McpSseTool` for connectors with protocol `mcp_sse`. Use this value as the `type` field when configuring MCP tools in an agent. |
| `description` | String | Optional | A human-readable description of the tool's purpose, as provided by the external MCP server. Omitted from the response when the MCP server does not provide a description. |
| `input_schema` | String | Optional | A JSON Schema string describing the tool's input parameters. The schema follows the [JSON Schema](https://json-schema.org/) format and defines properties, types, descriptions, and required fields. Omitted from the response when the MCP server does not provide an input schema. |

## Error responses

The following table describes common error responses.

| HTTP status | Condition | Example error message |
| :--- | :--- | :--- |
| `400` | The connector exists but is not an MCP connector (for example, an HTTP or Amazon Bedrock connector). | `Connector with ID {connector_id} is not of type McpConnector or McpStreamableHttpConnector` |
| `404` | The connector ID does not exist. | `Failed to find connector` |
| `500` | MCP connectors are disabled, the external MCP server is unreachable, or another internal error occurs. | `The MCP connector is not enabled. To enable, please update the setting plugins.ml_commons.mcp_connector_enabled` |
