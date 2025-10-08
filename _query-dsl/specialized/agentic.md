---
layout: default
title: Agentic
parent: Specialized queries
nav_order: 2
---

# Agentic query
**Introduced 3.2**
{: .label .label-purple }

Use the `agentic` query to ask questions in natural language and have OpenSearch automatically plan and execute the retrieval. The `agentic` query works in conjunction with a preconfigured agent that reads the question, plans the search, and returns relevant results. For more information about agentic search, see [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/).

## Prerequisite

Before using an `agentic` query, you must fulfill the following prerequisites:

1. Configure an agent with the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/). The QueryPlanningTool is required for generating DSL queries from natural language questions. Optionally, you can configure the agent with additional tools for enhanced functionality.
1. Create a search pipeline with an [`agentic_query_translator` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/).

For detailed setup instructions, see [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/).

## Request body fields

The `agentic` query accepts the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`query_text` | String | Required | The natural language question for the agent to answer.
`query_fields` | Array | Optional | A list of fields that the agent should consider when generating the search query. If omitted, the agent infers the applicable fields based on the index mappings and content.
`memory_id` | String | Optional | Applicable for `conversational` agents only. Provides a memory ID from a previous response to continue the conversation with prior context. See [Using conversational agents for agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/). |

## Example

The following example uses an `agentic` query that asks a natural language question about flowers in an `iris` dataset. In this example, `query_text` contains the natural language question, `query_fields` specifies the fields to use when generating the query, and the `search-pipeline` query parameter specifies the search pipeline containing the agentic query translator processor:

```json
GET /iris-index/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "List all the flowers present",
      "query_fields": ["species", "petal_length_in_cm"]
    }
  }
}
```
{% include copy-curl.html %}

When executed, the agentic search request performs the following steps:

1. Sends the natural language question, along with the index mapping and a default prompt, to a large language model (LLM).
2. The LLM generates a query domain-specific language (DSL) query based on the input.
3. The generated DSL query is executed as a search request in OpenSearch.
4. Returns the search results based on the generated query.

For a complete example, see [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/).

## Next steps

- Learn how to configure agentic search in [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/).
- Learn about agent types in [Agent types]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#agent-types).
- Learn about the [QueryPlanningTool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/).
- View the reference documentation for the [`agentic_query_translator` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/).