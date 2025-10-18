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

The MCP server is exposed via the `/_plugins/_ml/mcp` endpoint and implements the Streamable HTTP transport defined by the Model Context Protocol (MCP). It allows agents or clients to connect to OpenSearch and discover or invoke available tools.

This server does not open a persistent SSE connection with the client; all communication happens over stateless HTTP calls.
If a client sends a `GET` request (typically, to establish an SSE connection), the server returns a `405 Method Not Allowed` response, allowing the client to continue using `POST` communication.


To learn more about the transport, see the [official MCP documentation](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports).
{: .note }

## Prerequisites

Before you can connect to the MCP server endpoint, you need to enable the MCP server functionality in your cluster:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.mcp_server_enabled": "true"
  }
}
```
{% include copy-curl.html %}

Optionally, you can register tools so clients can discover and call them. See [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/).

## Connecting to the MCP server

You can connect to the MCP server using any client that supports the Streamable HTTP transport. 

### Connecting using an MCP client

The following example uses `fastmcp` to initialize a connection, list tools, and call a tool:

```python
import asyncio, logging
from fastmcp import Client


async def main():
    async with Client("http://localhost:9200/_plugins/_ml/mcp") as client:
        for t in await client.list_tools():
            print(t.name)
        r = await client.call_tool("ListIndexTool", {})
        print("result: ", r)

asyncio.run(main())
```
{% include copy.html %}

### Invoking the MCP server manually (for debugging)

While not required for normal usage, you can manually invoke the MCP server using JSON-RPC calls over HTTP. The following example presents typical MCP client behavior.

#### Step 1: Register tools

Before connecting to the MCP server, you can register custom tools using the register API. Here's how to register a list index tool:

```json
POST /_plugins/_ml/mcp/register
{
    "tools": [
        {
            "name": "ListIndexTool",
            "type": "ListIndexTool",
            "description": "This tool returns information about indices in the OpenSearch cluster along with the index `health`, `status`, `index`, `uuid`, `pri`, `rep`, `docs.count`, `docs.deleted`, `store.size`, `pri.store. size `, `pri.store.size`, `pri.store`. Optional arguments: 1. `indices`, a comma-delimited list of one or more indices to get information from (default is an empty list meaning all indices). Use only valid index names. 2. `local`, whether to return information from the local node only instead of the cluster manager node (Default is false)",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "indices": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"], use empty array [] to list all indices in the cluster"
                    }
                },
                "additionalProperties": false
            }
        }
    ]
}
```
{% include copy-curl.html %}

The server responds with confirmation that the tool was registered:

```json
200 OK
{
  "message": "Tool 'ListIndexTool' registered successfully"
}
```

#### Step 2: Initialize a connection

Send an `initialize` method with your client information and capabilities. Note that the `protocolVersion` must match the MCP specification version:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {}
    },
    "clientInfo": {
      "name": "test-client",
      "version": "1.0.0"
    }
  }
}
```
{% include copy-curl.html %}

The server responds with its capabilities and server information. The `tools.listChanged` indicates that the server supports dynamic tool discovery:

```json
200 OK
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "logging": {},
      "prompts": {
        "listChanged": false
      },
      "resources": {
        "subscribe": false,
        "listChanged": false
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "OpenSearch-MCP-Stateless-Server",
      "version": "0.1.0"
    },
    "instructions": "OpenSearch MCP Stateless Server - provides access to ML tools without sessions"
  }
}
```

#### Step 3: Send an initialization complete notification

Send a notification to indicate that initialization is complete. This notification does not expect a response payload:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized",
  "params": {}
}
```
{% include copy-curl.html %}

The server acknowledges the notification with a `202 Accepted` status:

```json
202 Accepted
```

#### Step 4: List available tools

Use the `tools/list` method to discover available tools:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```
{% include copy-curl.html %}

For a dedicated API, see [List MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/).

The server returns an array of available tools with their names, descriptions, and input schemas. Notice how each tool includes a detailed `inputSchema` that describes the expected parameters:

```json
200 OK
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "ListIndexTool",
        "description": "This tool returns information about indices in the OpenSearch cluster along with the index `health`, `status`, `index`, `uuid`, `pri`, `rep`, `docs.count`, `docs.deleted`, `store.size`, `pri.store. size `, `pri.store.size`, `pri.store`. Optional arguments: 1. `indices`, a comma-delimited list of one or more indices to get information from (default is an empty list meaning all indices). Use only valid index names. 2. `local`, whether to return information from the local node only instead of the cluster manager node (Default is false)",
        "inputSchema": {
          "type": "object",
          "properties": {
            "indices": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"], use empty array [] to list all indices in the cluster"
            }
          },
          "additionalProperties": false
        }
      }
    ]
  }
}
```

#### Step 5: Call a tool

Use the `tools/call` method to invoke a specific tool. Provide the tool name and arguments that match the tool's input schema:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "ListIndexTool",
    "arguments": {
      "indices": []
    }
  }
}
```
{% include copy-curl.html %}

The server executes the tool and returns the result in the `content` array. The `isError` field indicates whether the tool execution was successful:

```json
200 OK
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)\n1,green,open,.plugins-ml-config,nKyzDAupTGCwuybs9S_iBA,1,0,1,0,3.9kb,3.9kb\n2,green,open,.plugins-ml-mcp-tools,k1QwQKmXSeqRexmB2JDJiw,1,0,1,0,5kb,5kb\n"
      }
    ],
    "isError": false
  }
}
```