---
layout: default
title: Using external MCP servers
parent: Agentic search
grand_parent: AI search
nav_order: 110
has_children: false
---

# Using external MCP servers

External Model Context Protocol (MCP) servers extend agentic search capabilities by providing access to external tools and data sources. By connecting to MCP servers, your agents can use external APIs, databases, and services to enhance search results with real-time information and specialized functionality.

This guide demonstrates how to create an external MCP server, connect it to an agentic search agent, and use external tools to answer complex queries that require external data.

## Prerequisites

Before using external MCP servers with agentic search, ensure that you have:

- Access to create and deploy MCP servers.
- Understanding of the [MCP connector configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/mcp-connector/).

## Step 1: Create a sample products index

First, create a products index to demonstrate external MCP tool integration:

```json
PUT /products-index
{
  "settings": {
    "number_of_shards": "4",
    "number_of_replicas": "2"
  },
  "mappings": {
    "properties": {
      "product_name": { "type": "text" },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "currency": { "type": "keyword" },
      "rating": { "type": "float" },
      "review_count": { "type": "integer" },
      "in_stock": { "type": "boolean" },
      "color": { "type": "keyword" },
      "size": { "type": "keyword" },
      "category": { "type": "keyword" },
      "brand": { "type": "keyword" },
      "tags": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Ingest sample data

Add sample product documents to demonstrate external MCP tool usage:

```json
POST _bulk
{ "index": { "_index": "products-index", "_id": "1" } }
{ "product_name": "Nike Air Max 270", "description": "Comfortable running shoes with Air Max technology", "price": 150.0, "currency": "USD", "rating": 4.5, "review_count": 1200, "in_stock": true, "color": "white", "size": "10", "category": "shoes", "brand": "Nike", "tags": ["running", "athletic", "comfortable"] }
{ "index": { "_index": "products-index", "_id": "2" } }
{ "product_name": "Adidas Ultraboost 22", "description": "Premium running shoes with Boost midsole", "price": 180.0, "currency": "USD", "rating": 4.7, "review_count": 850, "in_stock": true, "color": "black", "size": "9", "category": "shoes", "brand": "Adidas", "tags": ["running", "premium", "boost"] }
{ "index": { "_index": "products-index", "_id": "3" } }
{ "product_name": "Converse Chuck Taylor", "description": "Classic canvas sneakers", "price": 65.0, "currency": "USD", "rating": 4.2, "review_count": 2100, "in_stock": true, "color": "white", "size": "8", "category": "shoes", "brand": "Converse", "tags": ["casual", "classic", "canvas"] }
{ "index": { "_index": "products-index", "_id": "4" } }
{ "product_name": "Puma RS-X", "description": "Retro-inspired running shoes with modern comfort", "price": 120.0, "currency": "USD", "rating": 4.3, "review_count": 750, "in_stock": true, "color": "black", "size": "9", "category": "shoes", "brand": "Puma", "tags": ["retro", "running", "comfortable"] }
```
{% include copy-curl.html %}

## Step 3: Create an external MCP server

Create a sample MCP server. This MCP server provides a `brand_collection_tool` that categorizes brands into different tiers (`favorites`, `budget`, and `luxury`) based on user preferences. The agent can use this tool to understand which brands belong to specific categories when processing natural language queries:

```python
from fastmcp import FastMCP

mcp = FastMCP("brands_server")

@mcp.tool
def brand_collection_tool(category: str) -> list[str]:
    """This is the collection of brands for a given category. There are 3 categories: 1. favorites, 2. budget, 3. luxury. If the category is not one of these, return all the brands."""
    favorites = ["Nike", "Adidas", "Reebok"]
    budget = ["Puma", "New Balance", "Under Armour"]
    luxury = ["Phoenix Motors", "Crystal Palace", "Royal Oak"]
    if category == "favorites":
        return favorites
    elif category == "budget":
        return budget
    elif category == "luxury":
        return luxury
    else:
        return favorites + budget + luxury

if __name__ == "__main__":
    # Streamable HTTP transport; no session/state persisted between requests
    mcp.run(transport="streamable-http")
```
{% include copy.html %}

## Step 4: Create an MCP connector

Register an MCP connector to connect your agentic search agent to the external MCP server. The MCP connector uses the `mcp_streamable_http` protocol to communicate with your external MCP server. Replace `<Your MCP Server URL>` with the actual URL where your MCP server is running, and `<Your API Key>` with the appropriate authentication key:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Brands MCP Connector",
  "description": "The connector to external brands MCP server",
  "version": 1,
  "protocol": "mcp_streamable_http",
  "parameters": {
    "endpoint": "/mcp"
  },
  "credential": {
    "access_key": "<Your API Key>"
  },
  "url": "<Your MCP Server URL>",
  "headers": {
    "Authorization": "Bearer ${credential.access_key}",
    "Content-Type": "application/json"
  }
}
```
{% include copy-curl.html %}

## Step 5: Create a model for the agent

Register a model that will be used by both the conversational agent and the `QueryPlanningTool`:

```json
POST /_plugins/_ml/models/_register
{
  "name": "My OpenAI model: gpt-5",
  "function_name": "remote",
  "description": "Model for agentic search with external MCP tools",
  "connector": {
    "name": "My openai connector: gpt-5",
    "description": "The connector to openai chat model",
    "version": 1,
    "protocol": "http",
    "parameters": {
      "model": "gpt-5"
    },
    "credential": {
      "openAI_key": "<OPEN AI KEY>"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "headers": {
          "Authorization": "Bearer ${credential.openAI_key}"
        },
        "request_body": """{ "model": "${parameters.model}", "messages": [{"role":"developer","content":"${parameters.system_prompt}"},${parameters._chat_history:-}{"role":"user","content":"${parameters.user_prompt}"}${parameters._interactions:-}], "reasoning_effort":"low"${parameters.tool_configs:-}}"""
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Step 6: Create an agent with MCP connectors

Register a conversational agent that includes MCP connectors to access external tools:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "E-commerce Agent with External Tools",
  "type": "conversational",
  "description": "Agentic search agent with external MCP tools for brand categorization",
  "llm": {
    "model_id": "<Model ID from Step 5>",
    "parameters": {
      "max_iteration": 15
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "openai/v1/chat/completions",
    "mcp_connectors": [
      {
        "mcp_connector_id": "<MCP Connector ID from Step 4>"
      }
    ]
  },
  "tools": [
    {
      "type": "ListIndexTool",
      "name": "ListIndexTool"
    },
    {
      "type": "IndexMappingTool",
      "name": "IndexMappingTool"
    },
    {
      "type": "QueryPlanningTool"
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

The agent configuration includes:
- **MCP connectors**: Links to external MCP servers that provide additional tools.
- **Standard tools**: `ListIndexTool`, `IndexMappingTool`, and `QueryPlanningTool` for core agentic search functionality.
- **External tools**: Automatically available through the MCP connector (for example, `brand_collection_tool`).

## Step 7: Create an agentic search pipeline

Create a search pipeline that uses your agent with external MCP tools:

```json
PUT _search/pipeline/mcp-agentic-pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "<Agent ID from Step 6>"
      }
    }
  ],
  "response_processors": [
    {
      "agentic_context": {
        "agent_steps_summary": true,
        "dsl_query": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 8: Run an agentic search with external tools

Send a natural language query that requires external MCP tool usage:

```json
POST products-index/_search?search_pipeline=mcp-agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Find red shoes under 200 USD from my favorite brands"
    }
  }
}
```
{% include copy-curl.html %}

The agent processes this query by:

1. **Using external MCP tools**: Calling `brand_collection_tool` with the `favorites` category to get the list of favorite brands.
2. **Discovering indexes**: Using the `ListIndexTool` to find relevant indexes.
3. **Analyzing schema**: Using the `IndexMappingTool` to understand the index structure.
4. **Planning the query**: Using the `QueryPlanningTool` to generate the final DSL query.

The response includes matching products and detailed agent execution information. The `agent_steps_summary` shows how the agent orchestrated multiple tools, including the external MCP tool (`brand_collection_tool`), to understand the user's request and generate an appropriate search query:

```json
{
  "took": 29942,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.0,
    "hits": [
      {
        "_index": "products-index",
        "_id": "1",
        "_score": 0.0,
        "_source": {
          "product_name": "Nike Air Max 270",
          "description": "Comfortable running shoes with Air Max technology",
          "price": 150.0,
          "currency": "USD",
          "rating": 4.5,
          "review_count": 1200,
          "in_stock": true,
          "color": "white",
          "size": "10",
          "category": "shoes",
          "brand": "Nike",
          "tags": [
            "running",
            "athletic",
            "comfortable"
          ]
        }
      },
      {
        "_index": "products-index",
        "_id": "2",
        "_score": 0.0,
        "_source": {
          "product_name": "Adidas Ultraboost 22",
          "description": "Premium running shoes with Boost midsole",
          "price": 180.0,
          "currency": "USD",
          "rating": 4.7,
          "review_count": 850,
          "in_stock": true,
          "color": "black",
          "size": "9",
          "category": "shoes",
          "brand": "Adidas",
          "tags": [
            "running",
            "premium",
            "boost"
          ]
        }
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool, brand_collection_tool]\nFirst I used: brand_collection_tool — input: \"favorites\"; context gained: \"User favourite brands are [\"Nike\",\"Adidas\",\"Reebok\"]\"\nSecond I used: ListIndexTool — input: \"[]\"; context gained: \"Found indices; products-index appears relevant\"\nThird I used: IndexMappingTool — input: \"products-index\"; context gained: \"Index contains product-related fields\"\nFourth I used: query_planner_tool — qpt.question: \"Find shoes priced under 200 USD from brands Nike, Adidas, and Reebok.\"; index_name_provided: \"products-index\"\nValidation: qpt output is valid and matches the user's request.",
    "memory_id": "XRzFl5kB-5P992SCeeqO",
    "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"currency\":\"USD\"}},{\"range\":{\"price\":{\"lte\":200.0}}},{\"terms\":{\"brand\":[\"Nike\",\"Adidas\",\"Reebok\"]}}]}}}"
  }
}
```

## Next steps

- [MCP connector configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/mcp/mcp-connector/) -- Learn more about configuring MCP connectors for external tool integration
- [Configuring agentic search agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/) -- Configure agent behaviors with different models and tools
- [Using conversational agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/) -- Learn more about conversational agents and their advanced features
