---
layout: default
title: Search Template Fill tool
has_children: false
has_toc: false
nav_order: 105
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Search Template Fill tool
**Introduced 3.10**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

The `SearchTemplateFillTool` generates an OpenSearch query domain-specific language (DSL) query from a natural language question by filling the parameters of a registered agentic search template. The large language model (LLM) returns only the parameter values, and OpenSearch renders them into the stored Mustache template. When no template can express the question, the tool falls back to the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/), which writes the query DSL.

For a complete example, including how to store and register templates, see [Filling search templates in agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/).

## Prerequisites

Before using the tool, complete the following steps:

1. Set `plugins.ml_commons.agentic_search_template_enabled` to `true`. If this setting is `false`, agents that use the tool can't be registered or updated, and existing agents return an error when the tool runs. The tool isn't available when multi-tenancy is enabled.
1. Store one or more search templates and register each one using the Register Agentic Search Template API. For more information, see [Register Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/).
1. Register a remote model whose connector `request_body` includes `${parameters.tool_configs:-}`, `${parameters.system_prompt}`, and either `${parameters.user_prompt}` or `${parameters.prompt}`.

## Step 1: Register a flow agent

The following example registers a `flow` agent that runs the `SearchTemplateFillTool`:

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
        "template_ids": "[\"product_search\",\"similar_search\"]"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 2: Execute the agent

Execute the agent by sending the following request:

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

OpenSearch returns the rendered query:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"query\":{\"bool\":{\"must\":[{\"match\":{\"title\":\"shoes\"}}],\"filter\":[{\"term\":{\"category\":\"footwear\"}}]}},\"sort\":[{\"price\":\"desc\"}],\"size\":2}"
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists the parameters that you can set in the tool's `parameters` when registering an agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`model_id` | String | Required | The model ID of the LLM that fills the template. The fallback `QueryPlanningTool` uses the same model.
`_llm_interface` | String | Required | The function calling interface of the model. Valid values are `bedrock/converse/claude`, `openai/v1/chat/completions`, and `gemini/v1beta/generatecontent`.
`response_filter` | String | Optional | A JSONPath expression that extracts the generated query from the LLM response. Used only by the fallback `QueryPlanningTool`. See [Response filter configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/#response-filter-configuration).

All other parameters are passed to the fallback `QueryPlanningTool`. For example, `fallback_query` and `query_planner_system_prompt` customize the fallback. For more information, see [Query Planning tool register parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/#register-parameters).

The following table lists the fields that you can set in the tool's `config`. Execute requests can't override these fields, so registering an agent with either field in `parameters` returns an error.

Field | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`template_ids` | String | Required | The agentic search templates that the agent may fill, as a JSON array of template IDs, for example, `"[\"product_search\"]"`, or as a single template ID. Templates are offered in the listed order. Only templates that are bound to the searched index, have a non-empty parameter schema, and have a stored script that the user can read are used, and at most eight templates are offered.
`fallback_enabled` | String | Optional | Whether the tool falls back to the `QueryPlanningTool` when it can't fill a template. Valid values are `true` and `false`. If `false`, the tool returns an error instead. Default is `true`.

## Execute parameters

The following table lists the parameters that you can provide when executing the agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question.
`index_name` | String | Required | The name of the index to search. Templates bound to other indexes are skipped.

## Fallback behavior

The tool falls back to the `QueryPlanningTool` in the following cases:

- No template in `template_ids` is usable for the index, for example, because no template is bound to the index or every template's parameter schema is empty.
- The LLM sets `cannot_express` to indicate that no template can express the question or chooses no template.
- The LLM response contains no tool call, a value that doesn't match the parameter schema, or a template that isn't a candidate.
- The rendered template isn't a single JSON object.

If reading the registered templates or the LLM call fails, the tool returns the error without falling back.

## Permissions

When the Security plugin is enabled, the tool reads and renders each stored script as the user running the search, so that user needs the `cluster:admin/script/get` permission. Templates whose stored script the user can't read aren't offered to the LLM.

## Related documentation

- [Filling search templates in agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/)
- [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/)
- [Query Planning tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/)
- [Agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/)
