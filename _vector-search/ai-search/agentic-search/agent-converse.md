---
layout: default
title: Using conversational agents
parent: Agentic search
grand_parent: AI search
nav_order: 70
has_children: false
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/agent-converse/
---

# Using conversational agents for agentic search

Conversational agents provide advanced agentic search capabilities with detailed reasoning traces and conversation memory. Unlike flow agents, which run tools sequentially and only return the generated query domain-specific language (DSL) query, conversational agents provide additional context through the `agentic_context` response processor, including a step-by-step reasoning summary and a memory ID for continuing conversations across multiple queries.

This guide demonstrates how to configure conversational agents with multiple tools and use their advanced features for complex search scenarios. 

## Step 1: Create a product index

Create a sample index with product data that includes various attributes like name, price, color, and category:

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

Add sample product documents to the index:

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

## Step 3: Create a model

Review the [model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration) and choose a model to use.

Here we register a GPT model that will be used by both the conversational agent and the `QueryPlanningTool`:

```json
POST /_plugins/_ml/models/_register
{
    "name": "My OpenAI model: gpt-5",
    "function_name": "remote",
    "description": "test model",
    "connector": {
        "name": "My openai connector: gpt-5",
        "description": "The connector to openai chat model",
        "version": 1,
        "protocol": "http",
        "parameters": {
            "model": "gpt-5"
        },
        "credential": {
            "openAI_key": "your-openai-api-key"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "https://api.openai.com/v1/chat/completions",
                "headers": {
                    "Authorization": "Bearer ${credential.openAI_key}"
                },
                "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.user_prompt}\"}${parameters._interactions:-}], \"reasoning_effort\":\"low\"${parameters.tool_configs:-}}"
            }
        ]
    }
}
```

## Step 4: Register an agent

Register a conversational agent with multiple tools---`ListIndexTool` to discover available indexes, `IndexMappingTool` to understand index structure, `WebSearchTool` for external data access, and the required `QueryPlanningTool` to generate OpenSearch DSL.

See [Configuring agentic search agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/) for basic configurations. The agent must include a `QueryPlanningTool`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "E-commerce Search Agent",
  "type": "conversational",
  "description": "Intelligent e-commerce search with product discovery",
  "llm": {
    "model_id": "your-model-id",
    "parameters": {
      "max_iteration": 20
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "openai/v1/chat/completions"
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
      "type": "WebSearchTool",
      "parameters": {
        "engine": "duckduckgo"
      }
    },
    {
      "type": "QueryPlanningTool"
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

## Step 5: Configure a search pipeline

Create a search pipeline with both request and response processors. The [`agentic_query_translator` request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/) translates natural language queries into OpenSearch DSL, while the [`agentic_context` response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-context-processor/) adds agent execution context information for monitoring and conversation continuity:

```json
PUT _search/pipeline/agentic-pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-ecommerce-agent-id"
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

## Step 6: Run an agentic search

To run a search, send a natural language search query. The agent analyzes the request, discovers appropriate indexes, and generates an optimized DSL query:

```json
GET /_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Find me white shoes under 150 dollars"
    }
  }
}
```
{% include copy-curl.html %}

The response includes matching products and detailed agent information in the `ext` object, showing the agent's reasoning process and the generated DSL query:

```json
{
  "took": 12146,
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
    "max_score": null,
    "hits": [
      {
        "_index": "products-index",
        "_id": "3",
        "_score": 0.0,
        "_source": {
          "product_name": "Converse Chuck Taylor",
          "description": "Classic canvas sneakers",
          "price": 65.0,
          "currency": "USD",
          "rating": 4.2,
          "review_count": 2100,
          "in_stock": true,
          "color": "white",
          "size": "8",
          "category": "shoes",
          "brand": "Converse",
          "tags": [
            "casual",
            "classic",
            "canvas"
          ]
        },
        "sort": [
          65.0,
          0.0
        ]
      },
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
        },
        "sort": [
          150.0,
          0.0
        ]
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: ListIndexTool — input: \"[]\"; context gained: \"Found indices; 'products-index' appears most relevant for product queries\"\nSecond I used: query_planner_tool — qpt.question: \"Find white shoes under 150 dollars.\"; index_name_provided: \"products-index\"\nThird I used: query_planner_tool — qpt.question: \"Find white shoes priced under 150 dollars.\"; index_name_provided: \"products-index\"\nValidation: qpt output is valid JSON and aligns with the request for white shoes under 150 dollars in the products-index.",
    "memory_id": "XRzFl5kB-5P992SCeeqO",
    "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"color\":\"white\"}},{\"range\":{\"price\":{\"lte\":150.0}}}]}},\"sort\":[{\"price\":{\"order\":\"asc\"}},{\"_score\":{\"order\":\"desc\"}}]}"
  }
}
```

## Step 7: Run an agentic search with a memory ID

Send a follow-up query using the `memory_id` from the previous response:

```json
GET /_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Actually, show black ones instead",
      "memory_id": "<memory_id from previous response>"
    }
  }
}
```
{% include copy-curl.html %}

The agent remembers the context and applies it to the new request. It successfully interprets "black ones instead" and maintains the $150 budget from the previous context:

```json
{
  "took": 8942,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "products-index",
        "_id": "4",
        "_score": 0.0,
        "_source": {
          "product_name": "Puma RS-X",
          "description": "Retro-inspired running shoes with modern comfort",
          "price": 120.0,
          "currency": "USD",
          "rating": 4.3,
          "review_count": 750,
          "in_stock": true,
          "color": "black",
          "size": "9",
          "category": "shoes",
          "brand": "Puma",
          "tags": [
            "retro",
            "running",
            "comfortable"
          ]
        },
        "sort": [
          120.0,
          0.0
        ]
      }
    ]
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: query_planner_tool — qpt.question: \"Find black shoes priced under 150 dollars.\"; index_name_provided: \"products-index\"\nValidation: qpt output is valid JSON and aligns with the request for black shoes under 150 dollars in the products-index.",
    "memory_id": "XRzFl5kB-5P992SCeeqO",
    "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"color\":\"black\"}},{\"range\":{\"price\":{\"lte\":150.0}}}]}},\"sort\":[{\"price\":{\"order\":\"asc\"}},{\"_score\":{\"order\":\"desc\"}}]}"
  }
}
```

## Using hints to guide the LLM

You can guide the large language model (LLM) to generate the DSL query you prefer by providing hints in the `query_text`. The agent considers these hints when planning the search.

The following query provides specific hints about sorting and aggregations to guide the agent's DSL generation:

```json
GET /_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Find expensive running shoes, sort by rating descending, and use aggregations to show average price by brand"
    }
  }
}
```
{% include copy-curl.html %}

In contrast, the following query uses simple language without specific DSL hints:

```json
GET /_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me running shoes"
    }
  }
}
```
{% include copy-curl.html %}

The first query will likely generate more complex DSL with sorting and aggregations, while the second will be simpler. Use specific terms like "sort by", "aggregate", "filter by", "group by", etc. to guide the agent's query generation.

## Next steps

- [Agentic query translator processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/) -- Learn more about the request processor that translates natural language queries into OpenSearch DSL.
- [Agentic context processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-context-processor/) -- Learn more about the response processor that adds agent execution context information for monitoring and conversation continuity.
- [Configuring agentic search agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/) -- Configure agent behaviors with different models, tools, and prompts.