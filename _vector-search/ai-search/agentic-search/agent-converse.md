---
layout: default
title: Converse and Monitor Agentic Search
parent: Agentic search
grand_parent: AI search
nav_order: 70
has_children: false
---

# Converse and Monitor Agentic Search

Enable monitoring and conversation continuation using the `agentic_context` response processor. This processor provides full visibility into the agent's decision-making process through `agent_steps_summary` and generated OpenSearch DSL queries, while also providing `memory_id` which can be used to continue the conversation.

## Prerequisites

- An agent is registered and configured as descrived in [Agent customization]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#complete-agent-configuration)
- The agent includes the QueryPlanningTool

## Setup: Create Search Pipeline

Add the `agentic_query_translator` request processor and `agentic_context` response processor

```json
PUT _search/pipeline/agentic-pipeline
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
                "agent_steps_summary": true,
                "dsl_query": true
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Sample response structure

Response would look like this:

```json
{
    "hits": /* Search hits*/,
    "ext": {
        "agent_steps_summary": "<step-by-step reasoning and tool usage>",
        "memory_id": "<memory-id-storing-conversation>",
        "dsl_query": "<generated-opensearch-dsl-query>"
    }
}
```

### Response values

The search response includes an `ext` block with the following fields:

| Field | Purpose |
|-------|---------|
| `agent_steps_summary` | Step-by-step reasoning and tool usage |
| `memory_id` | Conversation context identifier - copy this for follow-up requests |
| `dsl_query` | Generated OpenSearch DSL query |

The `dsl_query` and the `agent_steps_summary` can be used for monitoring and debugging Agentic Search.

### Use memory_id to continue conversation

Add `memory_id` to your subsequent search request to maintain conversation context:

```json
GET /_search?search_pipeline=agentic-pipeline
{
    "query": {
        "agentic": {
            "query_text": "Actually, show black ones instead",
            "memory_id": "Memory ID from 1st Search Request"
        }
    }
}
```
{% include copy-curl.html %}


## End-to-end example

### Prerequisites: Register Models

1. **[Register a model for the Agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-4-create-a-model-for-conversational-agent)** - This model will be used by the conversational agent for reasoning and tool orchestration
2. **[Register a model for Query Planning Tool]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-3-create-a-model-for-query-planning-tool)** - This model will be used specifically by the QueryPlanningTool to generate OpenSearch DSL queries

### 1. Create product index

```json
PUT /products-index
{
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

### 2. Insert sample data

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

### 3. Register agent

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
            "type": "QueryPlanningTool",
            "parameters": {
                "model_id": "<query planner Model Id>"
            }
        }
    ],
    "app_type": "os_chat"
}
```
{% include copy-curl.html %}

### 4. Configure Search pipeline

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

### 5. Execute Agentic Search

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

**Response:**
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
        "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: query_planner_tool — qpt.question: \"Find white shoes priced under 150 dollars.\"; index_name_provided: \"products-index\"\nValidation: qpt output is valid JSON and aligns with the request for white shoes under 150 dollars in the products-index.",
        "memory_id": "XRzFl5kB-5P992SCeeqO",
        "dsl_query": "{\"size\":10.0,\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"color\":\"white\"}},{\"range\":{\"price\":{\"lte\":150.0}}}]}},\"sort\":[{\"price\":{\"order\":\"asc\"}},{\"_score\":{\"order\":\"desc\"}}]}"
    }
}
```
{% include copy-curl.html %}

### 6. Execute Agentic Search With Memory Id:
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

**Response:**
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
{% include copy-curl.html %}

As we can see, the agent understood the conversation context and reused the budget limit of $150 from the previous query. It correctly interpreted "black ones instead" as black shoes under $150, demonstrating how `memory_id` enables seamless conversation continuation.

## Pro tip: Guide the LLM with hints

You can nudge the LLM to generate the DSL query you prefer by providing hints in the `query_text`. The agent will consider these hints when planning the search:

**Example with hints:**
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

**Without hints:**
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

The first query will likely generate a more complex DSL with sorting and aggregations, while the second will be simpler. Use specific terms like "sort by", "aggregate", "filter by", "group by", etc. to guide the agent's query generation.