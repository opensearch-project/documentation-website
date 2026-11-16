---
layout: default
title: Filling search templates
parent: Agentic search
grand_parent: AI search
nav_order: 102
has_children: true
has_toc: false
redirect_from:
  - /vector-search/ai-search/agentic-search/agentic-search-templates/
---

<!-- vale off -->
# Filling search templates
**Introduced 3.10**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

By default, agentic search asks a large language model (LLM) to write the entire query in query domain-specific language (DSL). With agentic search templates, the LLM fills the parameters of a [search template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/) that you register in advance, and OpenSearch renders the stored Mustache template into the query.

## Filling templates compared to using them as examples

The following table compares filling search templates with [using search templates as examples]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/search-templates/).

| | Using search templates as examples | Filling search templates |
| :--- | :--- | :--- |
| Configuration | List the stored templates and their descriptions in the `search_templates` parameter of the `QueryPlanningTool`. | Register each stored template as an agentic search template. OpenSearch derives a parameter schema from the template. |
| LLM input | The templates, as examples in the prompt | The parameter schema and the question |
| LLM output | The full query DSL | Only the parameter values |
| Query construction | The LLM writes the query and can follow, change, or ignore a template. | OpenSearch renders the stored template using the parameter values. |
| Query structure | Not guaranteed | Always the template structure |
| Value validation | None | OpenSearch checks each value against the type and allowed values in the parameter schema. |
| Output size | A full query, about 300 tokens | A few values, about 5--30 tokens |
| When no template fits | The LLM writes the query without a template. | The LLM declines to fill a template, and the request falls back to an LLM-written query. |

## Choosing an approach to filling templates

You can fill templates in either of the following ways:

- [In OpenSearch]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/opensearch/): Register a flow agent with the [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/). The LLM call and rendering run in the cluster.
- [In the OpenSearch Agent Server]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/agent-server/): Register a flow agent with a `ConnectorTool` that calls the `agentic_search` agent of the [OpenSearch Agent Server](https://github.com/opensearch-project/opensearch-agent-server). The agent server calls its own LLM and renders the template using the cluster's [Render Template API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/).

Both approaches use the same registered templates and the same search pipeline. Complete the following steps for either approach, and then continue on the page for the approach that you choose.

Agentic search templates are not supported when multi-tenancy is enabled.
{: .note}

## Prerequisites

To enable the agentic search template APIs and the `SearchTemplateFillTool`, update the following cluster setting:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.agentic_search_template_enabled": true
  }
}
```
{% include copy-curl.html %}

## Step 1: Create an index

Create an index for product data:

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

Ingest sample products into the index:

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

Register the stored template as an agentic search template. Specify the index that it searches, and describe what it searches:

```json
POST _plugins/_ml/agentic_search_templates
{
  "template_id": "product_search",
  "index": "products",
  "description": "Product search by title with an optional category filter and an optional descending sort"
}
```
{% include copy-curl.html %}

The response contains the template ID and the registration status:

```json
{
  "template_id": "product_search",
  "status": "created"
}
```

During registration, OpenSearch reads the stored template and the index mapping, derives a parameter schema, and verifies that the template renders valid JSON both with all parameters filled and with only the required parameters filled. OpenSearch rejects a template that fails this validation. For more information about the parameter schema, see [Register Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/).

OpenSearch derives the allowed values of `sort_by` from the index mapping fields that can be sorted on, so the LLM can sort by `category` or `price`. The `title` field is a `text` field, which can't be used for sorting, so it isn't listed. To review the derived schema, use the [Get Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/get-agentic-search-template/). To allow sorting only by price, narrow the `sort_by` enum using the [Update Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/update-agentic-search-template/):

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

## Step 4: Fill the registered template

To fill the registered template, choose one of the following options:

- [Filling templates in OpenSearch]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/opensearch/)
- [Filling templates in the agent server]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/agent-server/)

## Managing agentic search templates

To register, retrieve, list, update, or delete agentic search templates, see [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/).

## Related documentation

- [Search Template Fill tool]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/)
- [Agentic search template APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/index/)
- [Using search templates as examples]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/search-templates/)
- [Using flow agents for agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/flow-agent/)
- [Search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/)
