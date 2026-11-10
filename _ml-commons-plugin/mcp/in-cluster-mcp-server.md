---
layout: default
title: In-cluster MCP server
parent: MCP servers and clients
nav_order: 10
---

# Using the in-cluster MCP server
**Introduced 3.3**
{: .label .label-purple }

The in-cluster Model Context Protocol (MCP) server lets external MCP clients, such as AI assistants and agent frameworks, discover and call tools in your OpenSearch cluster. The server runs inside OpenSearch, so no additional installation is required. The server is exposed at the `/_plugins/_ml/mcp` endpoint and uses the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports). Clients can call only the tools that you register.

The server is stateless: all communication happens over individual HTTP `POST` requests, and the server does not open Server-Sent Events (SSE) streams. If a client sends a `GET` request, typically to open an SSE stream, the server returns a `405 Method Not Allowed` response, and the client continues using `POST` requests.

To compare the in-cluster MCP server with the standalone MCP server, see [Choosing an MCP server]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/#choosing-an-mcp-server).

## Step 1: Enable the MCP server

The MCP server is disabled by default. To enable it, update the `plugins.ml_commons.mcp_server_enabled` setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.mcp_server_enabled": "true"
  }
}
```
{% include copy-curl.html %}

## Step 2: Register tools

Register the tools that you want MCP clients to call. Each tool definition contains the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | The tool type, such as `ListIndexTool`. For a list of tool types, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). |
| `name` | String | Optional | The name that clients use to call the tool. Default is the `type` value. To register multiple tools of the same type, give each tool a different name. |
| `description` | String | Optional | A description of the tool. The large language model (LLM) in the client uses the description to decide when to call the tool. |
| `parameters` | Object | Optional | The tool parameters. Some tool types require parameters. For the parameters of each tool type, see the corresponding [tool documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). |
| `attributes` | Object | Optional | The tool attributes. Use the `input_schema` attribute to provide a JSON schema that defines the arguments that the tool accepts. The client sends this schema to the LLM so that the LLM can provide correctly formatted arguments. |

The following request registers a [List Index tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/list-index-tool/) and a [Search Index tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-index-tool/):

```json
POST /_plugins/_ml/mcp/tools/_register
{
  "tools": [
    {
      "name": "ListIndexTool",
      "type": "ListIndexTool",
      "description": "This tool returns information about indices in the OpenSearch cluster along with the index `health`, `status`, `index`, `uuid`, `pri`, `rep`, `docs.count`, `docs.deleted`, `store.size`, `pri.store. size `, `pri.store.size`, `pri.store`. Optional arguments: 1. `indices`, a comma-delimited list of one or more indices to get information from (default is an empty list meaning all indices). Use only valid index names. 2. `local`, whether to return information from the local node only instead of the cluster manager node (Default is false)",
      "attributes": {
        "input_schema": {
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
    },
    {
      "name": "SearchIndexTool",
      "type": "SearchIndexTool",
      "description": "Searches an index. Provide the index name and a query written in OpenSearch query domain-specific language (DSL).",
      "attributes": {
        "input_schema": {
          "type": "object",
          "properties": {
            "index": {
              "type": "string",
              "description": "The name of the index to search."
            },
            "query": {
              "type": "object",
              "description": "The search request body, for example, {\"query\": {\"match\": {\"field\": \"value\"}}}."
            }
          },
          "required": ["index", "query"],
          "additionalProperties": false
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

For each node, the response contains the node ID and the registration status:

```json
{
  "6It0uQ1AR06IDC4nMstPQw": {
    "created": true
  }
}
```

## Step 3: Connect an MCP client

To connect an MCP client, configure the client to use the Streamable HTTP transport and provide the MCP server URL:

```
http://<host>:<port>/_plugins/_ml/mcp
```

The following Python example uses the [FastMCP](https://gofastmcp.com/) client to list the registered tools and then call both tools on the `opensearch_dashboards_sample_data_ecommerce` sample index:

```python
import asyncio
from fastmcp import Client

async def main():
    async with Client("http://localhost:9200/_plugins/_ml/mcp") as client:
        for tool in await client.list_tools():
            print(tool.name)

        result = await client.call_tool(
            "ListIndexTool",
            {"indices": ["opensearch_dashboards_sample_data_ecommerce"]},
        )
        print(result.content[0].text)

        result = await client.call_tool(
            "SearchIndexTool",
            {
                "index": "opensearch_dashboards_sample_data_ecommerce",
                "query": {
                    "size": 1,
                    "_source": ["customer_full_name", "products.product_name", "taxful_total_price"],
                    "query": {"match": {"products.product_name": "jacket"}},
                },
            },
        )
        print(result.content[0].text)

asyncio.run(main())
```
{% include copy.html %}

The script prints the tool names, the index information, and the search result:

```
ListIndexTool
SearchIndexTool
row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)
1,green,open,opensearch_dashboards_sample_data_ecommerce,ryn25tMCTDex530BrUVmfw,1,0,4675,0,4mb,4mb

{"_index":"opensearch_dashboards_sample_data_ecommerce","_source":{"customer_full_name":"Sultan Al Mccarthy","products":[{"product_name":"Summer jacket - navy"},{"product_name":"Light jacket - khaki"}],"taxful_total_price":86.98},"_id":"eWBchqABedeO5z2s7srO","_score":1.6412048}
```

### Authenticating to a cluster that uses the Security plugin

If your cluster uses the Security plugin, the client must authenticate with each request. Pass the credentials in the request headers. For example, to use basic authentication with FastMCP, configure the transport with an `Authorization` header. If your cluster uses a certificate signed by your own certificate authority (CA), provide the path to the CA certificate in the `verify` parameter:

```python
import asyncio, base64
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport

credentials = base64.b64encode(b"<username>:<password>").decode()
transport = StreamableHttpTransport(
    "https://localhost:9200/_plugins/_ml/mcp",
    headers={"Authorization": f"Basic {credentials}"},
    verify="<path-to-root-ca.pem>",
)

async def main():
    async with Client(transport) as client:
        print([tool.name for tool in await client.list_tools()])

asyncio.run(main())
```
{% include copy.html %}

The user must have the permissions described in [Permissions](#permissions).

## Sending MCP requests manually

MCP clients communicate with the server using [JSON-RPC](https://www.jsonrpc.org/specification) messages. To debug a client or test the server without one, send the same messages to the MCP endpoint yourself. The following steps show the sequence of requests that a typical MCP client sends.

### Step 1: Initialize a connection

Send an `initialize` request containing your client information and capabilities. The `protocolVersion` must match a supported MCP specification version:

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

The server responds with its capabilities and server information. The `tools.listChanged` capability indicates that the server supports dynamic tool discovery:

```json
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

### Step 2: Send an initialization complete notification

Send a notification to indicate that initialization is complete:

```json
POST /_plugins/_ml/mcp
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized",
  "params": {}
}
```
{% include copy-curl.html %}

The server returns a `202 Accepted` status with an empty response body.

### Step 3: List the available tools

Use the `tools/list` method to discover the available tools:

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

The server returns the registered tools, including the name, description, and input schema (`inputSchema`) of each tool:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
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
              "description": "OpenSearch index name list, separated by comma. for example: [\"index1\", \"index2\"], use empty array [] to list all indices in the cluster",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "additionalProperties": false
        }
      },
      {
        "name": "SearchIndexTool",
        "description": "Searches an index. Provide the index name and a query written in OpenSearch query domain-specific language (DSL).",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {
              "description": "The search request body, for example, {\"query\": {\"match\": {\"field\": \"value\"}}}.",
              "type": "object"
            },
            "index": {
              "description": "The name of the index to search.",
              "type": "string"
            }
          },
          "required": [
            "index",
            "query"
          ],
          "additionalProperties": false
        }
      }
    ]
  }
}
```
</details>

### Step 4: Call a tool

Use the `tools/call` method to call a tool. Provide the tool name and arguments that match the tool's input schema:

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

The server runs the tool and returns the result in the `content` array. The `isError` field indicates whether the tool ran successfully:

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

## Managing registered tools

To view the registered tools, send the following request:

```json
GET /_plugins/_ml/mcp/tools/_list
```
{% include copy-curl.html %}

To update a tool, provide the tool name and the fields to change. Fields that you omit keep their current values. For example, the following request updates only the description of the `SearchIndexTool` tool:

```json
POST /_plugins/_ml/mcp/tools/_update
{
  "tools": [
    {
      "name": "SearchIndexTool",
      "description": "Searches an index of ecommerce orders. Provide the index name and a query written in OpenSearch query DSL."
    }
  ]
}
```
{% include copy-curl.html %}

To remove tools, provide an array of tool names:

```json
POST /_plugins/_ml/mcp/tools/_remove
["ListIndexTool", "SearchIndexTool"]
```
{% include copy-curl.html %}

For more information, see [MCP server APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/).

## Permissions

If your cluster uses the Security plugin, the following permissions control access to the MCP server.

| Permission | Allows |
| :--- | :--- |
| `cluster:admin/opensearch/ml/mcp/server` | Connecting to the MCP server, listing tools using the `tools/list` method, and calling tools |
| `cluster:admin/opensearch/ml/mcp_tools/list` | Listing registered tools |
| `cluster:admin/opensearch/ml/mcp_tools/register` | Registering tools |
| `cluster:admin/opensearch/ml/mcp_tools/update` | Updating tools |
| `cluster:admin/opensearch/ml/mcp_tools/remove` | Removing tools |

The `ml_full_access` predefined role includes all of these permissions. The `ml_read_access` role does not include any of them.

Tools run using the permissions of the user that the client authenticates as. To call a tool that accesses index data, the user also needs the corresponding index permissions. For example, to call the `SearchIndexTool` tool registered in [Step 2](#step-2-register-tools), the user needs the `read` permission on the index that the tool searches. The `ml_full_access` role does not grant permissions on your indexes.

For more information, see [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).

## Next steps

- [MCP server APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/mcp-server-apis/).

