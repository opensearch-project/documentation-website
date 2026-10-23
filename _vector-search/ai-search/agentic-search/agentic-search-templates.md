---
layout: default
title: Filling search templates
parent: Agentic search
grand_parent: AI search
nav_order: 102
has_children: false
---

<!-- vale off -->
# Filling search templates in agentic search
**Introduced 3.9**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

By default, agentic search asks a large language model (LLM) to write the entire query in query domain-specific language (DSL). With agentic search templates, the LLM instead fills the parameters of a [search template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/) that you register in advance, and OpenSearch renders the stored Mustache template into the query. This differs from [adding search templates to the `QueryPlanningTool`]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/search-templates/), in which a template is only an example that the LLM may follow when writing the full query.

Filling a template has the following benefits:

- The LLM returns only parameter values, typically 5--30 output tokens instead of the roughly 300 tokens of a full query.
- The template defines the query structure, so the generated query always has the structure you designed.
- OpenSearch uses only the parameters that the template declares and checks each value against the type and allowed values recorded for that parameter.

When none of the templates can express a question, the LLM can decline to fill them. The request then falls back to an LLM-written query DSL so that the search still runs.

You can run template filling in either of the following ways:

- [In ML Commons](#filling-templates-in-ml-commons): Register a flow agent with the [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/). The LLM call and rendering run in the cluster.
- [In the OpenSearch Agent Server](#filling-templates-in-the-agent-server): Register a flow agent with a `ConnectorTool` that calls the `agentic_search` agent of the [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server). The agent server calls its own LLM and renders the template using the cluster's [Render Template API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/).

Both approaches use the same registered templates and the same search pipeline. The [agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/) were introduced in OpenSearch 3.9, and the `SearchTemplateFillTool` was introduced in OpenSearch 3.10. The agent server approach requires only the template APIs, so it works with OpenSearch 3.9.

## Prerequisites

Enable the agentic search template APIs and the `SearchTemplateFillTool` by updating the following cluster setting:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.agentic_search_template_enabled": true
  }
}
```
{% include copy-curl.html %}

Agentic search templates are not supported when multi-tenancy is enabled.
{: .note}

## Step 1: Create an index

Create an index and ingest sample product data:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "category": { "type": "keyword" },
      "price": { "type": "float" }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST /_bulk
{ "index": { "_index": "products", "_id": "1" } }
{ "title": "leather dress shoes", "category": "footwear", "price": 210.0 }
{ "index": { "_index": "products", "_id": "2" } }
{ "title": "trail running shoes", "category": "footwear", "price": 120.0 }
{ "index": { "_index": "products", "_id": "3" } }
{ "title": "canvas shoes", "category": "footwear", "price": 45.0 }
{ "index": { "_index": "products", "_id": "4" } }
{ "title": "wool hiking socks", "category": "apparel", "price": 18.0 }
```
{% include copy-curl.html %}

## Step 2: Store a search template

Store the query structure as a Mustache search template. Write each optional clause as a Mustache section (`{% raw %}{{#param}}...{{/param}}{% endraw %}`) so that the query stays valid when the LLM omits that parameter. The following template requires `query_text` and `size` and adds an optional `category` filter and an optional descending sort:

```json
PUT _scripts/product_search
{
  "script": {
    "lang": "mustache",
    "source": "{% raw %}{\"query\":{\"bool\":{\"must\":[{\"match\":{\"title\":\"{{query_text}}\"}}],\"filter\":[{{#category}}{\"term\":{\"category\":\"{{category}}\"}}{{/category}}]}},{{#sort_by}}\"sort\":[{\"{{sort_by}}\":\"desc\"}],{{/sort_by}}\"size\":{{size}}}{% endraw %}"
  }
}
```
{% include copy-curl.html %}

## Step 3: Register the template for agentic search

Register the stored template, bind it to the index it searches, and describe what it searches:

```json
POST _plugins/_ml/agentic_search_templates
{
  "template_id": "product_search",
  "index": "products",
  "description": "Product search by title with an optional category filter and an optional descending sort"
}
```
{% include copy-curl.html %}

OpenSearch responds with the template ID:

```json
{
  "template_id": "product_search",
  "status": "created"
}
```

During registration, OpenSearch reads the stored template and the index mapping, derives a parameter schema, and checks that the template renders valid JSON both with all parameters filled and with only the required parameters filled. A template that fails this check is rejected. For more information about the parameter schema, see [Register Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/).

OpenSearch derives the allowed values of `sort_by` from the index mapping, so the LLM may sort by any field, including `title` and `category`. To review the derived schema, use the [Get Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/get-agentic-search-template/). To allow sorting only by price, narrow the `sort_by` enum using the [Update Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/update-agentic-search-template/):

```json
PUT _plugins/_ml/agentic_search_templates/product_search
{
  "param_schema": {
    "sort_by": {
      "enum": ["price"]
    }
  }
}
```
{% include copy-curl.html %}

## Filling templates in ML Commons

To fill templates in ML Commons, register a flow agent with the `SearchTemplateFillTool` and use it in a search pipeline.

### Step 4: Register a model

Register a remote model for the `SearchTemplateFillTool`. The tool forces the model to call a tool whose fields are the template parameters, so the connector's `request_body` must include `${parameters.tool_configs:-}`, `${parameters.system_prompt}`, and either `${parameters.user_prompt}` or `${parameters.prompt}`. The connectors in [Model configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agent-customization/#model-configuration) meet these requirements.

### Step 5: Register a flow agent

Register a flow agent with the `SearchTemplateFillTool`. Specify the model and its `_llm_interface` in the tool's `parameters`, and list the templates that the agent may fill in `template_ids` in the tool's `config`:

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

The `response_filter` parameter is used only when the tool falls back to writing the query DSL. For all parameters, see [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/).

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

The response contains the rendered query. The LLM filled `query_text`, `category`, `sort_by`, and `size`:

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

### Step 6: Create a search pipeline

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

### Step 7: Run an agentic search

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

The response contains the two most expensive footwear products, sorted by price:

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

### Using multiple templates

You can list several templates in `template_ids`. When more than one template is usable for the searched index, a single LLM call chooses a template and fills its parameters. The tool offers at most the first eight usable templates. The LLM chooses using each template's `description`, so provide a description when you register each template.

For example, register a second template for fuzzy matching on product names:

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

```json
POST _plugins/_ml/agentic_search_templates
{
  "template_id": "similar_search",
  "index": "products",
  "description": "Fuzzy search for products similar to a name"
}
```
{% include copy-curl.html %}

Then set `"template_ids": "[\"product_search\",\"similar_search\"]"` in the tool's `config`. For a question such as `shoes similar to 10 trail runners`, the LLM can choose `similar_search`, which runs a fuzzy match on the product title and always returns up to 10 results.

### ML Commons fallback behavior

The `SearchTemplateFillTool` writes the query DSL using the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/), with the same model and parameters, in the following cases:

- No template in `template_ids` is usable for the searched index.
- The LLM declines because no template can express the question, for example, when the question requires an aggregation.
- The LLM response contains no tool call, a value that doesn't match the parameter schema, or a template choice that isn't a candidate.
- The rendered template is not a single JSON object.

If reading the registered templates or the LLM call itself fails, for example, because of throttling or an unreachable connector, the tool returns the error instead of falling back. A template whose stored script the user can't read is skipped, which can leave no usable template. To disable the fallback so that the tool returns an error in the preceding cases, set `"fallback_enabled": "false"` in the tool's `config`.

## Filling templates in the agent server

The [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server) is a standalone service whose `agentic_search` agent converts a natural language question into query DSL. When a request to the agent names one or more registered templates, the agent fills a template instead of writing the query DSL.

Before you start, complete the [Prerequisites](#prerequisites) and [Steps 1--3](#step-1-create-an-index), and run the agent server with access to your cluster and an LLM. For setup instructions, see the [OpenSearch Agent Server repository](https://github.com/opensearch-project/opensearch-agent-server).

### Step 4: Create a connector to the agent server

Create a connector that calls the agent server's `/invoke` endpoint. The request body names the `agentic_search` agent and passes the index name and the template ID in `context`. Setting `response_format` to `inference_results` and `post_process_function` to `connector.post_process.mlcommons.passthrough` returns the generated query in the format the flow agent requires:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Agentic search template fill connector",
  "description": "Calls the agent server /invoke endpoint in template mode",
  "version": "1",
  "protocol": "http",
  "parameters": {
    "endpoint": "<agent_server_host>:<port>",
    "template_id": "product_search"
  },
  "credential": {
    "token": "<token>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "http://${parameters.endpoint}/invoke",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${credential.token}"
      },
      "request_body": "{ \"query\": \"${parameters.question}\", \"agent\": \"agentic_search\", \"context\": { \"index_name\": \"${parameters.index_name}\", \"template_id\": \"${parameters.template_id}\" }, \"response_format\": \"inference_results\" }",
      "post_process_function": "connector.post_process.mlcommons.passthrough"
    }
  ]
}
```
{% include copy-curl.html %}

The agent server makes all of its calls to the cluster using the bearer token from the `Authorization` header, so they run as the token's user. When the Security plugin is enabled, that user needs the following permissions:

- Read access to the `.plugins-ml-agentic-search-templates` system index, which stores the parameter schemas. Because this is a system index, the user's role must also grant `system:admin/system_index` on it, and `plugins.security.system_indices.permission.enabled` must be `true`. For more information, see [System index permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions).
- Permission to render search templates (`indices:data/read/search/template/render`).
- Permission to read the mapping of the searched index, which the agent uses when it falls back to writing the query DSL.

If the agent can't read a template's parameter schema or render it, it falls back to writing the query DSL without returning an error, so check these permissions if the agent never fills a template.

To let the agent choose among several templates, replace `template_id` in the `context` object of `request_body` with a `template_ids` array, for example, `\"template_ids\": [\"product_search\", \"similar_search\"]`. When the request names two or more templates, the agent skips templates whose bound index name isn't exactly `index_name` (aliases and index patterns don't match) and uses at most eight candidates. When the request names a single template, the agent doesn't check the template's bound index.

If the agent server or the cluster is on a private IP address, set `plugins.ml_commons.connector.private_ip_enabled` to `true`. If the endpoint doesn't match `plugins.ml_commons.trusted_connector_endpoints_regex`, add it to that setting. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).
{: .note}

### Step 5: Register a flow agent with a ConnectorTool

Register a flow agent with a [`ConnectorTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/connector-tool/) that uses the connector:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "agent-server-template-fill-agent",
  "type": "flow",
  "tools": [
    {
      "type": "ConnectorTool",
      "name": "remote_dsl_generator",
      "description": "Generates OpenSearch DSL from a natural language question.",
      "parameters": {
        "connector_id": "<connector_id>",
        "connector_action": "predict"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 6: Create a search pipeline and run an agentic search

Create a search pipeline that uses the agent and run an agentic search as described in [Steps 6 and 7](#step-6-create-a-search-pipeline) of the ML Commons approach.

### Agent server fallback behavior

The agent writes the query DSL using its own LLM whenever filling a template fails for any reason, including when the template isn't registered or can't be read, the LLM call fails, the LLM declines to fill the template, the filled values fail validation, or the template doesn't render a valid query. Unlike the `SearchTemplateFillTool`, which returns an error when reading templates or calling the LLM fails, the agent server doesn't return these errors, and it has no setting equivalent to `fallback_enabled`. If query generation fails entirely, the agent returns `{"size":10,"query":{"match_all":{}}}`.

The agent server caches each template's parameter schema for 60 seconds, so a schema update can take up to 60 seconds to take effect.

## Managing agentic search templates

To register, retrieve, list, update, or delete agentic search templates, see [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/).

## Related documentation

- [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/)
- [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/)
- [Adding search templates]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/search-templates/)
- [Using flow agents for agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/flow-agent/)
- [Search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/)
