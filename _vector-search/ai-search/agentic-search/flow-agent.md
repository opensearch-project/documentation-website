---
layout: default
title: Using flow agents
parent: Agentic search
grand_parent: AI search
nav_order: 20
has_children: false
---

# Using flow agents for agentic search

Flow agents provide a streamlined alternative to conversational agents. While conversational agents use multiple tools for flexible, context-aware search, flow agents focus solely on query planning. This reduces LLM calls, improves response times, and lowers costs.

Flow agents are sufficient for most use cases. Use flow agents when low latency and cost efficiency are priorities, queries are simple, and conversation memory isn’t required. Use conversational agents for complex searches, multi-tool workflows, persistent context, or the highest query quality.

Flow agents differ from conversational agents in the following ways:

- Flow agents use only one tool---the Query Planning tool
- You must explicitly specify the target index name in the search request
- Flow agents don't provide agent step summaries or reasoning traces (only the generated DSL query is available when using the `agentic_context` response processor)
- Flow agents don't have conversational memory and cannot maintain context across multiple interactions

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

## Step 3: Create a model for the agent and Query Planning tool

Register a single model that will be used by both the conversational agent and the `QueryPlanningTool`. This model analyzes natural language questions, coordinates tool usage, and generates the OpenSearch DSL. For available model options, see [Model configurations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration):

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
        "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.user_prompt}\"}${parameters._interactions:-}], \"reasoning_effort\":\"low\"${parameters.tool_configs:-}}"
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Step 4: Register a flow agent

Next, register a flow agent. You must include a `response_filter` in the `QueryPlanningTool` parameters so the agent extracts the generated DSL correctly from your model provider's response.

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Flow Agent for Agentic Search",
  "type": "flow",
  "description": "Flow agent for agentic search",
  "tools": [
    {
      "type": "QueryPlanningTool",
      "parameters": {
        "model_id": "your_model_id_from_step_3",
        "response_filter": "<response-filter-based-on-model-type>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following response filters based on your model provider:

- **OpenAI**: `"response_filter": "$.choices[0].message.content"`
- **Anthropic Claude (Amazon Bedrock Converse API)**: `"response_filter": "$.output.message.content[0].text"`

## Step 5: Create an agentic pipeline with the flow agent

Create a search pipeline that uses your flow agent to translate natural language queries into DSL. You can optionally include a response processor to view the generated DSL query:

```json
PUT _search/pipeline/agentic-pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your_flow_agentId_from_step_4"
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

## Step 6: Run an agentic search

To run an agentic search, use the `agentic` query clause. Flow agents require the index name, so you must include it in your search request. Flow agents don't support conversation memory, so you cannot include the `memory_id` parameter:

```json
GET products-index/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Find me white shoes under 150 dollars"
    }
  }
}
```
{% include copy-curl.html %}

The flow agent processes the natural language query and returns matching products along with the generated DSL query in the response:

```json
{
  "took": 3965,
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
        "_id": "3",
        "_score": null,
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
          4.2,
          2100
        ]
      }
    ]
  },
  "ext": {
    "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"color\":\"white\"}},{\"range\":{\"price\":{\"lt\":150.0}}}]}},\"sort\":[{\"rating\":{\"order\":\"desc\"}},{\"review_count\":{\"order\":\"desc\"}}]}"
  }
}
```

