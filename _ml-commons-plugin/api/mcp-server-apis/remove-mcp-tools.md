---
layout: default
title: Remove MCP tools 
parent: MCP Server APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Remove MCP tools
**Introduced 3.0**
{: .label .label-purple }

Use this API to delete one or more MCP-based tools by name.

## Endpoints

```json
POST /_plugins/_ml/mcp/tools/_remove
```

## Example request

```json
POST /_plugins/_ml/mcp/tools/_remove
[
 "WebSearchTool", "ListIndexTool"
]
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the tool ID and removal status for each tool:

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