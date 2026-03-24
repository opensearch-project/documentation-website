---
layout: default
title: Web Search tool
has_children: false
has_toc: false
nav_order: 130
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Web Search tool
**Introduced 3.0**
{: .label .label-purple }
<!-- vale on -->

The `WebSearchTool` retrieves search results based on a user's question. It supports [Google](#using-google-as-a-search-engine), Bing, and [DuckDuckGo](#using-duckduckgo-as-a-search-engine) as search engines or can use a [custom API](#using-a-custom-api-as-a-search-engine) to perform searches.

## Using DuckDuckGo as a search engine

To use DuckDuckGo as a search engine with the `WebSearchTool`, follow these steps.

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

Then, run the agent by sending the following request (DuckDuckGo doesn't require any credentials):

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How to create a index pattern in OpenSearch?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the web search results:

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

## Using Google as a search engine

To use Google as a search engine with the `WebSearchTool`, follow these steps.

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

Before you run the agent, ensure that you have obtained the credentials needed to access Google search programmatically.

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

OpenSearch returns the web search results:

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

## Using a custom API as a search engine

To use a custom API as a search engine with the `WebSearchTool`, follow these steps.

### Step 1: Register a flow agent that will run the WebSearchTool

To use a custom endpoint for search, you need to configure the following parameters:

- `Authorization`: For authentication
- `endpoint`: For the API connection
- `custom_res_url_jsonpath`: For parsing the JSON response and extracting links

Your API must return responses in JSON format. The links returned by the API must be retrievable using [JSONPath](https://en.wikipedia.org/wiki/JSONPath) expressions. Other parameters like `query_key`, `offset_key`, and `limit_key` are optional but should be specified if your API uses different values than the defaults.

To create a flow agent, send the following register agent request:

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

Before you run the agent, ensure that you have obtained the credentials needed to access your custom search API programmatically.

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

OpenSearch returns the web search results:

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



| Parameter | Type | Required/Optional | Description |
|:---|:---|:---|:---|
| `engine` | String | Required | The search engine to use. Valid values are `google`, `bing`, `duckduckgo`, or `custom`. |
| `engine_id` | String | Optional | The Custom Search Engine ID for Google. Required when `engine` is set to `google`. |
| `api_key` | String | Optional | The API key for authentication. Required when `engine` is set to `google` or `bing`. |
| `endpoint` | String | Optional | The URL endpoint for the custom search API. Required when `engine` is set to `custom`. |
| `Authorization` | String | Optional | The authorization header value for the custom API. Required when `engine` is set to `custom`. |
| `query_key` | String | Optional | The parameter name for the search query in the custom API URL (for example, `${endpoint}?my_query_key=${question}`). Default is `q`. |
| `offset_key` | String | Optional | The parameter name for the pagination offset in the custom API URL (for example, `${endpoint}?q=${question}&start=10`). Default is `offset`. |
| `limit_key` | String | Optional | The parameter name for the result limit in the custom API URL (for example, `${endpoint}?q=${question}&start=10&limit=10`). Default is `limit`. |
| `custom_res_url_jsonpath` | String | Optional | The JSONPath expression used to extract URLs from the custom API response (for example, `$[*].link`). Required when `engine` is set to `custom`. |

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.