---
layout: default
title: Remove MCP tools 
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Remove MCP Tools API
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to delete one or more Model Context Protocol (MCP)-based tools by name.

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

OpenSearch responds with the node ID and the status of tool deletion for each node:

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