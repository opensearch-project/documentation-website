---
layout: default
title: MCP Streamable HTTP Server
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# MCP Streamable HTTP Server
**Introduced 3.3**
{: .label .label-purple }

The MCP server is exposed via the `/_plugins/_ml/mcp` endpoint and implements the Streamable HTTP transport defined by the Model Context Protocol (MCP). It allows agents/clients to connect to OpenSearch and discover and call available tools.

This server does not open a persistent SSE connection with the client; all communication happens over stateless HTTP calls.
If a client sends a GET request (typically to establish an SSE connection), the server returns a 405 Method Not Allowed response, allowing the client to continue with POST-based communication.


To learn more about the transport, see the [official MCP documentation](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports)
{: .note }

## Prerequisites
- Enable the MCP server setting.
- Optionally register tools so you can see and call them via the MCP server.

### Enable the MCP server
```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.mcp_server_enabled": "true"
  }
}
```
{% include copy-curl.html %}

### (Optional) Register tools
Register tools so clients can discover and call them. See [Register MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/register-mcp-tools/).

## Usage
You can connect to the MCP server using any client that supports the Streamable HTTP transport. Below are two approaches:

### Using an MCP client
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

### Manual invocation (for debugging)
While not required for normal usage, you can manually invoke the MCP server using JSON-RPC calls over HTTP. The sequence below mirrors typical MCP client behavior.

#### 1. Initialize connection
Example request:

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

Example response:

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

#### 2. Send initialization complete notification
Example request:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized",
  "params": {}
}
```
{% include copy-curl.html %}

Example response:

```json
202 Accepted
```

#### 3. List available tools
Use this to discover tools. See also [List MCP tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/).

Example request:

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

Example response:

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

#### 4. Call a tool
Example request:

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

Example response:

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