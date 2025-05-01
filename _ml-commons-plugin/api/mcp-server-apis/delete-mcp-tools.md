---
layout: default
title: Delete MCP Tools 
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Delete MCP Tools
**Introduced 3.0**
{: .label .label-purple }

You can use this API to delete one or more MCP tools with tool name.

## Endpoints

```json
POST /_plugins/_ml/mcp/tools/_remove
[
 "WebSearchTool", "ListIndexTool"
]
```

#### Example request

```json
POST /_plugins/_ml/mcp/tools/_remove
[
 "WebSearchTool", "ListIndexTool"
]
```
{% include copy-curl.html %}

#### Example response
OpenSearch responds with an delete result in each instance:
```json
{
    "_ZNV5BrNTVm6ilcM7Jn1pw": {
        "removed": true
    },
    "NZ9aiUCrSp2b5KBqdJGJKw": {
        "removed": true
    }
}
```