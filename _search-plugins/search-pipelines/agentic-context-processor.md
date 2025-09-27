---
layout: default
title: Agentic context
nav_order: 70
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Agentic context processor
Introduced 3.3
{: .label .label-purple }

The `agentic_context` search response processor adds agent execution context information to search response extensions. This processor works in conjunction with the [agentic query translator]({{site.url}}{{site.baseurl}}/search-plugins/agentic-query-translator/) to provide transparency into the agent's query translation process and maintain conversation continuity.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`agent_steps_summary` | Boolean | Whether to include the agent's execution steps summary in the response. Default is `false`. Optional.
`dsl_query` | Boolean | Whether to include the generated DSL query in the response. Default is `false`. Optional.

## Response fields

When enabled, the processor adds the following fields to the search response extensions:

Field | Description
:--- | :---
`agent_steps_summary` | A summary of the steps the agent took to translate the natural language query (included when `agent_steps_summary` is `true`)
`dsl_query` | The generated DSL query that was executed (included when `dsl_query` is `true`)

## Example

The following example request creates a search pipeline with an `agentic_context` response processor:

```json
PUT /_search/pipeline/agentic_pipeline
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

## Usage

When you perform a search with the configured pipeline, the response will include agent context information:

```json
POST /your-index/_search?search_pipeline=agentic_search_pipeline
{
    "query": {
        "agentic": {
            "query_text": "Show me shoes in white color",
            "memory_id": "your memory id"
        }
    }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "took": 15,
  "hits": {
    "_shards": {...},
    "hits": [...]
  },
   "ext": {
        "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\\nFirst I used: ListIndexTool — input: \"\"; context gained: \"Discovered products-index which seems relevant for products and pricing context\"\\nSecond I used: IndexMappingTool — input: \"products-index\"; context gained: \"Confirmed presence of category and price fields in products-index\"\\nThird I used: query_planner_tool — qpt.question: \"Show me shoes that cost exactly 100 dollars.\"; index_name_provided: \"products-index\"\\nValidation: qpt output is valid and accurately reflects the request for shoes priced at 100 dollars.",
        "memory_id": "WVhHiJkBnqovov2plcDH",
        "dsl_query": "{\"query\":{\"bool\":{\"filter\":[{\"term\":{\"category\":\"shoes\"}},{\"term\":{\"price\":100.0}}]}}}"
    }
}
```

## How it works

1. The processor retrieves agent context information from the pipeline processing context
2. Based on configuration, it selectively includes agent steps summary and DSL query
3. Memory ID is always included when available for conversation continuity
4. The context information is added to the search response extensions
5. Type validation ensures all context attributes are strings
