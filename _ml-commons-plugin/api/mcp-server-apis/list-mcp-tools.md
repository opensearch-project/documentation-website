---
layout: default
title: List MCP tools 
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/mcp-server-apis/list-mcp-tools/
---

# List MCP Tools API
**Introduced 3.1**

Use this API to list all Model Context Protocol (MCP)-based tools by name.

## Endpoints

```json
GET /_plugins/_ml/mcp/tools/_list
```

## Example request

```json
GET /_plugins/_ml/mcp/tools/_list
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the MCP tool list:

```json
{
    "tools": [
        {
            "type": "WebSearchTool",
            "name": "GoogleSearchTool",
            "description": "This tool can be used to perform search via google engine and parse the content of the searched results",
            "attributes": {
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "next_page": {
                            "description": "The search result's next page link. If this is provided, the WebSearchTool will fetch the next page results using this link and crawl the links on the page.",
                            "type": "string"
                        },
                        "engine": {
                            "description": "The search engine that will be used by the tool.",
                            "type": "string"
                        },
                        "query": {
                            "description": "The search query parameter that will be used by the engine to perform the search.",
                            "type": "string"
                        }
                    },
                    "required": [
                        "engine",
                        "query"
                    ]
                },
                "strict": false
            },
            "create_time": 1749864622040
        }
    ]
}
```