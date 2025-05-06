---
layout: default
title: Register MCP tools 
parent: MCP server APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Register MCP tools
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to register one or more Model Context Protocol (MCP)-based tools. For more information about supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Endpoints

```json
POST /_plugins/_ml/mcp/tools/_register
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :--- 
`tools` | Array | Required | A list of tools. 


The `tools` array contains a list of tools. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in the MCP server, specify different names for the tools. |
`type` | String | Required | The tool type. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). 
`parameters` | Object | Optional | The parameters for the tool. The parameters are dependent on the tool type. For information about specific tool types, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`attributes` | Object | Optional | The configuration properties (attributes) for the tool. The most important attribute in this field is the tool's `input_schema`, which defines the expected parameter format for the tool. This schema is sent to the large language model (LLM) so it can properly format parameters when executing the tool.

## Example request: WebSearchTool

```json
POST /_plugins/_ml/mcp/tools/_register
{
  "tools": [
    {
      "type": "WebSearchTool",
      "name": "GoogleSearchTool",
      "attributes": {
        "input_schema": {
          "type": "object",
          "properties": {
            "engine": {
              "type": "string",
              "description": "The search engine that will be used by the tool."
            },
            "query": {
              "type": "string",
              "description": "The search query parameter that will be used by the engine to perform the search."
            },
            "next_page": {
              "type": "string",
              "description": "The search result's next page link. If this is provided, the WebSearchTool will fetch the next page results using this link and crawl the links on the page."
            }
          },
          "required": [
            "engine",
            "query"
          ]
        },
        "strict": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example request: PPLTool

```json
POST /_plugins/_ml/mcp/tools/_register
{
  "type": "PPLTool",
  "name": "TransferQuestionToPPLAndExecuteTool",
  "description": "Use this tool to convert natural language into PPL queries and execute them. Use this tool after you know the index name; otherwise, call IndexRoutingTool first. The input parameters are: {index: IndexName, question: UserQuestion}",
  "parameters": {
    "model_id": "${your_model_id}",
    "model_type": "FINETUNE"
  },
  "attributes": {
    "input_schema": {
      "type": "object",
      "properties": {
        "question": {
          "type": "string",
          "description": "The user's natural language question that needs to be converted to PPL."
        },
        "index": {
          "type": "string",
          "description": "The index on which the generated PPL query will be executed."
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the node ID and the status of the creation of all tools for each node:

```json
{
    "_ZNV5BrNTVm6ilcM7Jn1pw": {
        "created": true
    },
    "NZ9aiUCrSp2b5KBqdJGJKw": {
        "created": true
    }
}
```
