---
layout: default
title: Agentic search
parent: AI search
nav_order: 30
has_children: true
redirect_from:
  - /vector-search/ai-search/agentic-search/
---

# Agentic search
**Introduced 3.2**
{: .label .label-purple }

Agentic search lets users ask questions in natural language and have OpenSearch plan and execute the retrieval automatically. A preconfigured **agent** reads the question, plans the search, and returns relevant results.

## How to use

Before running a request, complete the setup steps in the [Quick start guide]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/quick-start-guide/). The `agentic` query clause enables agentic search and lets you query in natural language. The following is an example request body.

Request body:

```json
GET iris-index/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "List all the flowers present",
      "query_fields": ["species", "petal_length_in_cm"],
      "memory_id": "XRzFl5kB-5P992SCeeqO"
    }
  }
}
```
{% include copy-curl.html %}

Parameters:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query.agentic.query_text` | string | Yes | The natural language question for the agent to answer. |
| `query.agentic.query_fields` | array of strings | No | Optional list of fields that helps the agent choose the right fields when generating the DSL. If omitted, the agent infers fields automatically based on index mappings and content. |
| `query.agentic.memory_id` | string | No | For conversational agents, provide a memory ID from a previous response to continue the conversation with prior context. |

## Quick start

You can configure agentic search using OpenSearch Dashboards or using the Agentic Search APIs.

### Using OpenSearch Dashboards

You can configure agents and execute agentic search using AI search flows in OpenSearch Dashboards. For more information, see [Building Agentic Search Flows]({{site.url}}{{site.baseurl}}/vector-search/ai-search/building-agentic-search-flows/).

### Using APIs

For API-based setup and examples, see the [Quick start guide]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/quick-start-guide/).

## Pages in this section

- [Quick start guide]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/quick-start-guide/)
- [Customizing agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/)
- [Inspecting agentic search and continuing conversations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-converse/)
- [Flow agents]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/flow-agent/)
- [Neural search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/neural-search/)
- [Search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/search-templates/)
