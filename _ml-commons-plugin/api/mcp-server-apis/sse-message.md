---
layout: default
title: SSE Message 
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# SSE Message 
**Introduced 3.0**
{: .label .label-purple }

This is the standard message interaction endpoint of MCP protocol, you can use this API to send messages to MCP server in OpenSearch. Usually you don't need to explicitly interact with this API if you're using standard MCP client. You can checkout the example client here: https://github.com/zane-neo/opensearch-mcpserver-test-example

## Endpoints

```json
POST /_plugins/_ml/mcp/sse/message
```

#### Example request

```json
POST /_plugins/_ml/mcp/sse/message
{
    "jsonrpc": "2.0",
    "id": "110",
    "method": "tools/call",
    "params": {
        "name": "ListIndexTool1",
        "arguments": {
            "input": {
                "index": ["test"]
            }
        }
    }
}
```
{% include copy-curl.html %}

#### Example response
OpenSearch responses a SSE data stream to client:
```
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