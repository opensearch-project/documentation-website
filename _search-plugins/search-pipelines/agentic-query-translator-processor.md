---
layout: default
title: Agentic query translator
nav_order: 60
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Agentic query translator processor
Introduced 3.2
{: .label .label-purple }

The `agentic_query_translator` search request processor enables natural language search by translating user queries into OpenSearch DSL queries using machine learning agents. This processor works with [agentic search queries]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search) to provide conversational search capabilities.

## Prerequisites

- A configured ML agent (conversational or flow type) must be available
- The processor only works with `agentic` query type as the top-level query

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`agent_id` | String | The ID of the ML agent that will translate natural language queries into DSL queries. Required.


## Example

The following example request creates a search pipeline with an `agentic_query_translator` processor:

```json
PUT /_search/pipeline/agentic_search_pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-agent-id-here"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Usage with agentic search query

To use the processor, send a search request with an `agentic` query:

```json
POST /your-index/_search?search_pipeline=agentic_search_pipeline
{
    "query": {
        "agentic": {
            "query_text": "Show me shoes in white color"
        }
    }
}
```

returns

```json
{
    "took": 6031,
    "timed_out": false,
    "_shards": {
        "total": 8,
        "successful": 8,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 8,
            "relation": "eq"
        },
        "max_score": 0.0,
        "hits": [
            {
                "_index": "products-index",
                "_id": "43",
                "_score": 0.0,
                "_source": {
                    "product_name": "Nike Air Max white",
                    "description": "Red cushioned sneakers",
                    "price": 140.0,
                    "currency": "USD",
                    "in_stock": true,
                    "color": "white",
                    "size": "10",
                    "product_id": "P6001",
                    "category": "shoes",
                    "brand": "Nike"
                }
            },
            {
                "_index": "products-index",
                "_id": "45",
                "_score": 0.0,
                "_source": {
                    "product_name": "Adidas Superstar white",
                    "description": "Classic black sneakers",
                    "price": 100.0,
                    "currency": "USD",
                    "in_stock": true,
                    "color": "white",
                    "size": "8",
                    "product_id": "P6003",
                    "category": "shoes",
                    "brand": "Adidas"
                }
            }
        ]
    }
}
```

## How it works

1. The processor calls the specified ML agent with the natural language query
2. The agent translates the query into proper OpenSearch DSL
3. The original query is replaced with the generated DSL query