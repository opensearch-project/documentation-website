---
layout: default
title: MCP Streamable HTTP Server
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# MCP Streamable HTTP Server API
**Introduced 3.3**
{: .label .label-purple }

The in-cluster Model Context Protocol (MCP) server is exposed through the `/_plugins/_ml/mcp` endpoint and implements the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports). MCP clients use this endpoint to discover and call the tools registered in your cluster.

The server is stateless: all communication happens over individual HTTP `POST` requests, and the server does not open Server-Sent Events (SSE) streams. If a client sends a `GET` request, the server returns a `405 Method Not Allowed` response.

To use this endpoint, enable the `plugins.ml_commons.mcp_server_enabled` setting. For setup instructions and example requests, see [Using the in-cluster MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/in-cluster-mcp-server/).

## Endpoints

```json
POST /_plugins/_ml/mcp
```

## Request body fields

The request body is a [JSON-RPC 2.0](https://www.jsonrpc.org/specification) message. The following table lists the request body fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `jsonrpc` | String | Required | The JSON-RPC version. Must be `2.0`. |
| `id` | Integer or string | Optional | The request ID, which the server returns in the response. Omit the ID for notifications. |
| `method` | String | Required | The MCP method. Clients use `initialize` and `notifications/initialized` to establish a connection, `tools/list` to discover tools, and `tools/call` to call a tool. The server also responds to `ping` and returns empty lists for `prompts/list` and `resources/list` because it provides only tools. |
| `params` | Object | Optional | The method parameters. For example, a `tools/call` request provides the tool `name` and `arguments`. |

## Example request

The following request calls the `ListIndexTool` tool:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "ListIndexTool",
    "arguments": {
      "indices": ["opensearch_dashboards_sample_data_ecommerce"]
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The server returns the tool output in the `content` array:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)\n1,green,open,opensearch_dashboards_sample_data_ecommerce,ryn25tMCTDex530BrUVmfw,1,0,4675,0,4mb,4mb\n"
      }
    ],
    "isError": false,
    "_meta": {}
  }
}
```

For the full sequence of requests that an MCP client sends, see [Sending MCP requests manually]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/in-cluster-mcp-server/#sending-mcp-requests-manually).

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/mcp/server`. Tools run using the permissions of the calling user, so calling a tool that accesses index data also requires the corresponding index permissions. For more information, see [Permissions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/in-cluster-mcp-server/#permissions).
