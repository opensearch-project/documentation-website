---
layout: default
title: Using agentic memory
parent: Agentic search
grand_parent: AI search
nav_order: 80
has_children: false
---

# Using agentic memory for agentic search

[Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/) provides a structured approach to managing conversation context in agentic search through dedicated memory containers. Unlike the default `conversation_index` memory type used by conversational agents, agentic memory uses separately created and configured memory containers that give you greater control over how conversation history is stored and managed. This is useful for scenarios where you want to manage memory lifecycle independently from the agent, configure memory behavior, or share memory containers across different workflows.

The following example demonstrates how to create a memory container, configure an agent with agentic memory, and use memory continuity across multiple search queries.

## Step 1: Create a product index

Create a sample index with product data that includes various product attributes such as a `product_name`, `price`, `color`, and `category`:

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

The following example registers a GPT model that will be used by both the `conversational` agent and the `QueryPlanningTool`:

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
{% include copy-curl.html %}

## Step 4: Create a memory container

Create a memory container to store conversation context for the agent:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "agent-memory-container",
  "configuration": {
    "disable_history": true
  }
}
```
{% include copy-curl.html %}

The memory container is created independently and can be configured using various options. For more information, see [The configuration object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/#the-configuration-object).

The response contains the memory container ID:

```json
{
  "memory_container_id": "your-memory-container-id"
}
```

## Step 5: Register an agent with an agentic memory

Register a conversational agent that uses `agentic_memory` as the memory type. Specify the memory container created in the previous step in the `memory_container_id` field. The agent includes the required `QueryPlanningTool` for generating query domain-specific language (DSL):

```json
POST /_plugins/_ml/agents/_register
{
  "name": "GPT 5 Agent for Agentic Search",
  "type": "conversational",
  "description": "Use this for Agentic Search",
  "llm": {
    "model_id": "your-model-id",
    "parameters": {
      "max_iteration": 15
    }
  },
  "memory": {
    "type": "agentic_memory",
    "memory_container_id": "your-memory-container-id"
  },
  "parameters": {
    "_llm_interface": "openai/v1/chat/completions"
  },
  "tools": [
    {
      "type": "QueryPlanningTool"
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

For more configuration options, see [Configuring agentic search agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/).

## Step 6: Configure a search pipeline

Create a search pipeline containing both request and response processors. The [`agentic_query_translator` request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/) translates natural language queries into query DSL. The [`agentic_context` response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-context-processor/) adds agent execution context information for monitoring and conversation continuity:

```json
PUT _search/pipeline/agentic_search_pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-agent-id"
      }
    }
  ],
  "response_processors": [
    {
      "agentic_context": {
        "dsl_query": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 7: Run an agentic search

To run an agentic search, send a natural language search query:

```json
GET /_search?search_pipeline=agentic_search_pipeline
{
  "query": {
    "agentic": {
      "query_text": "Find me white shoes under 150 dollars"
    }
  }
}
```
{% include copy-curl.html %}

The agent analyzes the request, discovers appropriate indexes, and generates an optimized DSL query. The response includes matching products in the `hits` array. The `ext` object contains the `memory_id` (for continuing the conversation) and the generated `dsl_query`:

```json
{
  "took": 32240,
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
        }
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
        }
      }
    ]
  },
  "ext": {
    "memory_id": "BrLLHJ0BMk3oS6TPFO_2",
    "dsl_query": "{\"size\":10,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category.keyword\":\"shoes\"}},{\"term\":{\"color.keyword\":\"white\"}},{\"range\":{\"price\":{\"lte\":150}}}]}}}"
  }
}
```

## Step 8: Run a follow-up agentic search

Send a follow-up query using the `memory_id` from the previous response:

```json
GET /_search?search_pipeline=agentic_search_pipeline
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

Using the agentic memory container, the agent recalls the previous conversation and applies it to the new request. The agent successfully interprets "black ones instead" while maintaining the price constraint of 150 dollars or less. In the response, the `memory_id` remains the same, and the generated DSL query changes only the color filter from white to black while preserving all other constraints:

```json
{
  "took": 19311,
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
    "memory_id": "BrLLHJ0BMk3oS6TPFO_2",
    "dsl_query": "{\"size\":10,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category.keyword\":\"shoes\"}},{\"term\":{\"color.keyword\":\"black\"}},{\"range\":{\"price\":{\"lte\":150}}}]}}}"
  }
}
```

## Next steps

- [Using conversational agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/) -- Learn about conversational agents with reasoning traces and conversation index memory.
- [Agentic query translator processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/) -- Learn more about the request processor that translates natural language queries into query DSL.
- [Agentic context processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-context-processor/) -- Learn more about the response processor that adds agent execution context information for monitoring and conversation continuity.
- [Configuring agentic search agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/) -- Configure agent behaviors with different models, tools, and prompts.