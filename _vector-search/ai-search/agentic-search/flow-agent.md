---
layout: default
title: Flow agent
parent: Agentic search
grand_parent: AI search
nav_order: 110
has_children: false
---

# Flow agent

The Conversational agent provides great flexibility and supports many use cases. However, you might not need all that functionality for every scenario. You can directly invoke the Query Planner Tool using a flow agent, which reduces the number of LLM calls made, thereby reducing both cost and latency.

While flow agents are super fast, the flexibility and query quality might not be as high as conversational agents, but they're good enough for most use cases. If latency is important, we highly recommend using the flow agent instead of the Conversational Agent.

## Key differences from Conversational Agent

- **No additional tools**: Flow agents only use the Query Planner Tool
- **Must provide index name**: Unlike conversational agents, you must specify the index name
- **No agent step summary**: Simplified execution without detailed step summaries
- **No memory ID**: Cannot continue conversations across multiple interactions

## Prerequisites

Before using a flow agent, you need to:

1. **Create an index for ingestion**
   
   See [Create product index]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/#1-create-product-index) in the end-to-end example.

2. **Ingest documents into the index**
   
   See [Insert sample data]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/#2-insert-sample-data) in the end-to-end example.

3. **Register a model for Query Planner Tool (QPT)**
   
   See [Step 3: Create a model for Query Planning tool]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-3-create-a-model-for-query-planning-tool) for detailed instructions.

4. **Register a flow agent**
     ```json
     POST /_plugins/_ml/agents/_register
     {
         "name": "Flow Agent for Agentic Search",
         "type": "flow",
         "description": "Fast flow agent for agentic search",
         "tools": [
             {
                 "type": "QueryPlanningTool",
                 "parameters": {
                     "model_id": "your_model_id_from_step3"
                 }
             }
         ]
     }
     ```
     {% include copy-curl.html %}

5. **Create Agentic pipeline with the flow agent**
   
   We can use the response processor to see the generated DSL query:
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

## Usage

Once set up, you can perform agentic search using the agentic query clause. Since flow agents require you to specify the index name, you must include it in your search request:

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

**Key differences for flow agents:**
- **Must specify index name**: Unlike conversational agents, you must include the index name in the URL path
- **No memory_id**: Flow agents don't support conversation memory, so you cannot use `memory_id` parameter
- **Simplified response**: No `agent_steps_summary` or detailed reasoning in the response

**Example response:**
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

**Use Flow Agent when:**
- Latency is critical
- Cost optimization is important
- Simple queries are sufficient
- No conversation memory needed

**Use Conversational Agent when:**
- Multiple tools are needed
- Conversation context is important
- Maximum query quality is desired 