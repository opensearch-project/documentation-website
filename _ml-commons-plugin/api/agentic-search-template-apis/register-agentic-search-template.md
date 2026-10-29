---
layout: default
title: Register agentic search template
parent: Agentic search template APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Register Agentic Search Template API
**Introduced 3.10**
{: .label .label-purple }

Use this API to register a stored search template for agentic search. Before registering, store the template using the [Create or Update Stored Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/).

During registration, OpenSearch reads the stored template and the index mapping, derives a parameter schema (unless you provide one), and checks that the template renders valid JSON both with all parameters filled and with only the required parameters filled. A template that fails this check is rejected.

## Endpoints

```json
POST /_plugins/_ml/agentic_search_templates
```

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`template_id` | String | Required | The ID of a search template stored using `PUT _scripts/<template_id>`. Also used as the agentic search template ID.
`index` | String | Required | The index to which the template is bound. The [`SearchTemplateFillTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/search-template-fill-tool/) uses the template only for searches on this index or on an alias or index pattern that resolves to indexes within it. For how the OpenSearch Agent Server uses the binding, see [Filling templates in the agent server]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/#step-4-create-a-connector-to-the-agent-server).
`description` | String | Optional | A description of what the template searches. Used to choose among several templates. If you omit both `description` and `param_schema`, OpenSearch attempts to derive a description from the template.
`param_schema` | Object | Optional | The parameter schema. If omitted, OpenSearch derives it from the template and the index mapping. If provided, it is stored as sent, and every parameter must appear in the template. See [The `param_schema` object](#the-param_schema-object).

### The param_schema object

The `param_schema` object maps each template parameter to an object with the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`type` | String | Required | The parameter type. Derived schemas use `string`, `number`, `boolean`, or `array`. An `array` parameter is passed as a raw JSON string and must be rendered using triple braces (`{% raw %}{{{param}}}{% endraw %}`).
`required` | Boolean | Optional | Whether the LLM must provide the parameter. Default is `false`.
`enum` | Array | Optional | The allowed values. Each value must match `type`: a number for `number`, a Boolean for `boolean`, and a string otherwise. For a parameter named `field` or `sort_by`, or one whose name ends in `_field`, derived schemas take the allowed values from the index mapping's field names. When the parameter sets the sort field, only sortable fields are listed; for example, a `text` field is omitted but its `keyword` subfield is included. A parameter that renders in a value position gets no `enum`.
`description` | String | Optional | Describes the parameter to the LLM.
`source` | String | Optional | Set to `mapping` in derived schemas when `enum` contains field names from the index mapping. Informational only.

## Example request: Derive the parameter schema

```json
POST /_plugins/_ml/agentic_search_templates
{
  "template_id": "product_search",
  "index": "products",
  "description": "Product search by title with an optional category filter and an optional descending sort"
}
```
{% include copy-curl.html %}

## Example request: Provide the parameter schema

```json
POST /_plugins/_ml/agentic_search_templates
{
  "template_id": "similar_search",
  "index": "products",
  "description": "Fuzzy search for products similar to a name",
  "param_schema": {
    "query_text": {
      "type": "string",
      "required": true,
      "description": "The product name to match. May contain misspellings."
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "template_id": "similar_search",
  "status": "created"
}
```

If an agentic search template with the same ID is already registered, the API returns a `409` error. If no stored script exists with the specified ID, the API returns a `400` error.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/agentic_search_templates/register`. Because OpenSearch reads the stored script and the index as the calling user, you also need `cluster:admin/script/get` and `indices:admin/get` on the bound index.

## Related documentation

- [Filling search templates in agentic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/)
- [Search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/index/)
