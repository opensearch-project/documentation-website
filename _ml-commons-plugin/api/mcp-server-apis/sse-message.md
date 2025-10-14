---
layout: default
title: MCP SSE message 
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/mcp-server-apis/sse-message/
---

# MCP SSE Message API
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

This endpoint handles standard message interactions for the Model Context Protocol (MCP). It enables communication with the MCP server in OpenSearch through Server-Sent Events (SSE).

Most users won't need to interact with this API directly when using a standard MCP client. 

{% comment %} 
For an example client implementation, see the [OpenSearch MCP client reference implementation](https://github.com/zane-neo/opensearch-mcpserver-test-example).
{% endcomment %}

## Endpoints

```json
POST /_plugins/_ml/mcp/sse/message
```

## Request body fields

The following table lists the available request fields.

| Field | Data type | Required/Optional | Description |
|:------|:----------|:------------------|:------------|
| `jsonrpc` | String |  | The JSON-RPC version. |
| `id` | String |  | A unique ID for the request. |
| `method` | String |  | The operation to perform, such as `tools/call`. |
| `params` | Object | Required | The top-level container for request parameters. |
| `params.name` | String | Required | The name of the tool to call. |
| `params.arguments` | Object | Required | The arguments to pass to the tool. |
| `params.arguments.input` | Object | Required | The input parameters for the tool. The parameters are dependent on the tool type. For information about specific tool types, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). |

## Example request

The SSE Message API provides direct, low-level access to tools using the [JSON-RPC](https://www.jsonrpc.org/) (remote procedure call) protocol structure. This differs from the agent framework approach, where tools are configured using `parameters` during agent registration. When using this API directly, you'll structure your request with `params` and `arguments` fields according to the JSON-RPC specification, bypassing the agent framework entirely:

```json
POST /_plugins/_ml/mcp/sse/message
{
  "jsonrpc": "2.0",
  "id": "110",
  "method": "tools/call",
  "params": {
      "name": "ListIndexTool1",
      "arguments": {
          "indices": ["test"]
      }
  }
}
```
{% include copy-curl.html %}

## Example response

OpenSearch sends an SSE data stream to the client:

```json
event: message
data: {
  "jsonrpc": "2.0",
  "id": "100",
  "result": {
    "tools": [
      {
        "name": "ListIndexTool",
        "description": "This is my first list index tool",
        "inputSchema": {
          "type": "object",
          "properties": {
            "indices": {
              "type": "array",
              "items": { "type": "string" },
              "description": "A comma-separated list of OpenSearch index names. For example: [\"index1\", \"index2\"]. Use [] (an empty array) to list all indices in the cluster."
            }
          },
          "additionalProperties": false
        }
      }
    ]
  }
}
```
