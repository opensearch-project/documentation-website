---
layout: default
title: Filling templates in OpenSearch
parent: Filling search templates
grand_parent: Agentic search
great_grand_parent: AI search
nav_order: 10
---

<!-- vale off -->
# Filling templates in OpenSearch
**Introduced 3.10**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

To fill templates in OpenSearch, register a flow agent with the `SearchTemplateFillTool` and use it in a search pipeline.

## Prerequisites

Before you start, enable agentic search templates, then store and register a search template as described in [Filling search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/index/).

## Step 1: Register a model

Register a remote model for the `SearchTemplateFillTool`. The tool forces the model to return the template parameters in a tool call, so the connector's `request_body` must include `${parameters.tool_configs:-}`, `${parameters.system_prompt}`, and either `${parameters.user_prompt}` or `${parameters.prompt}`. The connectors in [Model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration) meet these requirements.

## Step 2: Register a flow agent

Register a flow agent with the `SearchTemplateFillTool`. Specify the model and its `_llm_interface` in the tool's `parameters`, and list the templates that the agent can fill in `template_ids` in the tool's `config`:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "template-fill-agent",
  "type": "flow",
  "tools": [
    {
      "type": "SearchTemplateFillTool",
      "parameters": {
        "model_id": "<model_id>",
        "_llm_interface": "bedrock/converse/claude",
        "response_filter": "$.output.message.content[0].text"
      },
      "config": {
        "template_ids": "[\"product_search\"]"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The `response_filter` parameter is used only when the tool falls back to writing the full query. For all parameters, see [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/).

To test the agent, execute it directly:

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "parameters": {
    "question": "the 2 most expensive footwear shoes",
    "index_name": "products"
  }
}
```
{% include copy-curl.html %}

The response contains the rendered query. LLM output can vary between runs. In this example, the LLM filled `query_text`, `sort_by`, and `size`. It omitted the optional `category` parameter and included `footwear` in `query_text`, so the query has no category filter:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"query\":{\"bool\":{\"must\":[{\"match\":{\"title\":\"footwear shoes\"}}],\"filter\":[]}},\"sort\":[{\"price\":\"desc\"}],\"size\":2}"
        }
      ]
    }
  ]
}
```

## Step 3: Create a search pipeline

Create a search pipeline with an [`agentic_query_translator`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/) request processor that calls the flow agent:

```json
PUT _search/pipeline/template_fill_pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "<agent_id>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 4: Run an agentic search

Search the index using an [`agentic` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/agentic/):

```json
POST /products/_search?search_pipeline=template_fill_pipeline
{
  "query": {
    "agentic": {
      "query_text": "the 2 most expensive footwear shoes"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two most expensive matching products, sorted by price:

```json
{
  "timed_out": false,
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": null,
        "_source": {
          "title": "leather dress shoes",
          "category": "footwear",
          "price": 210.0
        },
        "sort": [210.0]
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": null,
        "_source": {
          "title": "trail running shoes",
          "category": "footwear",
          "price": 120.0
        },
        "sort": [120.0]
      }
    ]
  }
}
```

## Using multiple templates

You can list several templates in `template_ids`. When more than one template is usable for the searched index, a single LLM call chooses a template and fills its parameters. The tool offers at most the first eight usable templates. The LLM chooses a template based on its `description`, so provide a description when you register each template.

For example, store a second template for fuzzy matching on product names:

```json
PUT _scripts/similar_search
{
  "script": {
    "lang": "mustache",
    "source": "{% raw %}{\"query\":{\"match\":{\"title\":{\"query\":\"{{query_text}}\",\"fuzziness\":\"AUTO\"}}},\"size\":10}{% endraw %}"
  }
}
```
{% include copy-curl.html %}

Register the template for agentic search:

```json
POST _plugins/_ml/agentic_search_templates
{
  "template_id": "similar_search",
  "index": "products",
  "description": "Fuzzy search for products similar to a name"
}
```
{% include copy-curl.html %}

Then set `"template_ids": "[\"product_search\",\"similar_search\"]"` in the tool's `config`. For a question such as `products similar to trail runers`, the LLM can choose `similar_search`, which runs a fuzzy match on the product title. Its size is fixed at 10.

## Falling back to an LLM-written query

The `SearchTemplateFillTool` writes the full query using the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/), with the same model and parameters, in the following cases:

- No template in `template_ids` is usable for the searched index.
- The LLM declines because no template can express the question, for example, when the question requires an aggregation.
- The LLM response contains no tool call, a value that doesn't match the parameter schema, or a template choice that isn't a candidate.
- The template doesn't render to a single JSON object.

If reading the registered templates or the LLM call itself fails, for example, because of throttling or an unreachable connector, the tool returns the error instead of falling back. If the user can't read a template's stored script, the tool skips that template, which can leave no usable template. To disable the fallback so that the tool returns an error in the preceding cases, set `"fallback_enabled": "false"` in the tool's `config`.

## Related documentation

- [Filling search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/index/)
- [Search Template Fill tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/)
- [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/)
