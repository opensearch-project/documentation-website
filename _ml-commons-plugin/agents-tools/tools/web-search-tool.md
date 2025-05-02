---
layout: default
title: Web Search tool
has_children: false
has_toc: false
nav_order: 35
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# List Index tool
**Introduced 3.0**
{: .label .label-purple }
<!-- vale on -->

The `WebSearchTool` retrieves search result content with user's question, it supports google,bing,duckduckgo as search engine or a customer API to perform search on.

## Example: Use duckduckgo as engine to run WebSearchTool
### Step 1: Register a flow agent that will run the WebSearchTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_WebSearch_tool",
  "type": "flow",
  "description": "this is a test agent for the WebSearchTool",
  "tools": [
    {
      "type": "WebSearchTool",
      "name": "DuckduckgoWebSearchTool",
      "parameters": {
        "engine": "duckduckgo",
        "input": "${parameters.question}"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

### Step 2: Run the agent

Before you run the agent, make sure that you have credentials for google search or bing search or customer API, duckduckgo doesn't require any credentials.

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How to create a index pattern in OpenSearch?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """
            {
                "next_page": "https://html.duckduckgo.com/html?q=how+to+create+index+pattern+in+OpenSearch&ia=web&dc=11",
                "items": [
                  {
                    "url": "http://someurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  },
                  {
                    "url": "https://anotherurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  }
                  ...
                ]
            }
          """
        }
      ]
    }
  ]
}
```

## Example: Use google as engine to run WebSearchTool
### Step 1: Register a flow agent that will run the WebSearchTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_WebSearch_tool",
  "type": "flow",
  "description": "this is a test agent for the WebSearchTool",
  "tools": [
    {
      "type": "WebSearchTool",
      "name": "GoogleWebSearchTool",
      "parameters": {
        "engine": "google",
        "engine_id": "${your_google_engine_id}",
        "api_key": "${your_google_api_key}",
        "input": "${parameters.question}"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

### Step 2: Run the agent

Before you run the agent, make sure that you have credentials for google search or bing search or customer API, duckduckgo doesn't require any credentials.

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How to create a index pattern in OpenSearch?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """
            {
                "next_page": "https://customsearch.googleapis.com/customsearch/v1?q=how+to+create+index+pattern+in+OpenSearch&start=10",
                "items": [
                  {
                    "url": "http://someurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  },
                  {
                    "url": "https://anotherurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  }
                  ...
                ]
            }
          """
        }
      ]
    }
  ]
}
```

## Example: Use custom API as engine to run WebSearchTool
### Step 1: Register a flow agent that will run the WebSearchTool

To use custom endpoint to perform search on, you need to configure the `Authorization` for authorzation and `endpoint` to connect to and `custom_res_url_jsonpath` to parse the response, your API should return a json format response and the links should able to be retrieved with jsonpath approach. Other parameters like `query_key`, `offset_key` and `limit_key` are not mandatory but if your API has different value to the default values, you should specify them.

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_WebSearch_tool",
  "type": "flow",
  "description": "this is a test agent for the WebSearchTool",
  "tools": [
    {
      "type": "WebSearchTool",
      "name": "CustomWebSearchTool",
      "parameters": {
        "engine": "custom",
        "endpoint": "${your_custom_endpoint}",
        "custom_res_url_jsonpath": "$.data[*].link",
        "Authorization": "Bearer xxxx",
        "query_key": "q",
        "offset_key": "offset",
        "limit_key": "limit"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

### Step 2: Run the agent

Before you run the agent, make sure that you have credentials for google search or bing search or customer API, duckduckgo doesn't require any credentials.

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How to create a index pattern in OpenSearch?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """
            {
                "next_page": "{your_custom_endpoint}?q=how+to+create+index+pattern+in+OpenSearch&offset=10&limit=10",
                "items": [
                  {
                    "url": "http://someurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  },
                  {
                    "url": "https://anotherurl",
                    "title": "the page result title",
                    "content": "the page content..."
                  }
                  ...
                ]
            }
          """
        }
      ]
    }
  ]
}
```



## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`engine` | String | Required | The engine will be used to perform search on, valid values are: google|bing|duckduckgo|custom.
`engine_id` | String | Optional | The engine id of google, mandatory for google.
`api_key` | String | Optional | api key for search API to authorization, mandatory for google and bing.
`endpoint` | String | Optional | endpoint of custom search API, mandatory for custom search API.
`Authorization` | String | Optional | Authorization header value for custom API search, mandatory for custom API, mandatory for custom search API.
`query_key` | String | Optional | query key for custom search API, e.g. if the query_key is `my_query_key`, then the full search endpoint will be: `${endpoint}?my_query_key=${question}`, default value is `q`.
`offset_key` | String | Optional | offset key for pagination for custom search API, e.g. if the offset_key is `start`, then the next_page of the custom API will be: `${endpoint}?my_query_key=${question}&start=10`, default value is `offset`.
`limit_key` | String | Optional | the result limit key for custom search API, e.g. if the limit_key is 10 (which mean one page has 10 items), then the next_page of the custom API will be: `${endpoint}?my_query_key=${question}&start=10&limit=10`, default value is `limit`.
`custom_res_url_jsonpath` | String | Optional | the result url parsing json path, e.g. if you result is a list of items that contains url, then a valid jsonpath could be: `$[*].link`, mandatory for custom search API.


## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 