---
layout: default
title: Register MCP Tools 
parent: MCP Server APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Register MCP tool
**Introduced 3.0**
{: .label .label-purple }

Use this API to register one or more MCP tools. 

For more information about supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Endpoints

```json
POST /_plugins/_ml/mcp/tools/_register
```
{% include copy-curl.html %}

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :--- 
`tools` | Array | Required | A list of tools. 


The `tools` array contains a list of tools. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in MCP server, specify different names for the tools. |
`type` | String | Required | The tool type. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). 
`parameters` | Object | Optional | The parameters for this tool. The parameters are highly dependent on the tool type. You can find information about specific tool types in [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`attributes` | Object | Optional | The attributes for this tool. The most critical property in this field is the tool's schema with key `input_schema`, tool's schema will be sent to llm so llm can figure out the correct format parameters to execute the tool.

#### Example request: WebSearchTool

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
                            "description": "search engine will be used by tool"
                        },
                        "query": {
                            "type": "string",
                            "description": "search query parameter, will be used perform search by engine"
                        },
                        "next_page": {
                            "type": "string",
                            "description": "search result's next page link, if this is passed, the WebSearchTool will fetch the next_page result with the link and crawl the links on the page"
                        }
                    },
                    "required": [
                        "engine", "query"
                    ]
                },
                "strict": false
            }
        }
    ]
}
```
{% include copy-curl.html %}

#### Example request: PPLTool

```json
POST /_plugins/_ml/agents/_register
{
    "type": "PPLTool",
    "name": "TransferQuestionToPPLAndExecuteTool",
    "description": "Use this tool to transfer natural language to generate PPL and execute PPL to query inside. Use this tool after you know the index name, otherwise, call IndexRoutingTool first. The input parameters are: {index:IndexName, question:UserQuestion}",
    "parameters": {
        "model_id": "${your_model_id}",
        "model_type": "FINETUNE"
    },
    "attributes":{
        "input_schema":{
            "type":"object",
            "properties":{
                "question": {
                    "type": "string",
                    "description": "The user natual language question that needs to be transferred to PPL"
                },
                "index": {
                    "type": "string",
                    "description": "The index that the PPL will be generated based on"
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with an created result in each instance:
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
