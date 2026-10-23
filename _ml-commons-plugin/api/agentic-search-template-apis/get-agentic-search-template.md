---
layout: default
title: Get agentic search template
parent: Agentic search template APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get Agentic Search Template API
**Introduced 3.9**
{: .label .label-purple }

Use this API to retrieve a registered agentic search template, including its parameter schema.

## Endpoints

```json
GET /_plugins/_ml/agentic_search_templates/{template_id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`template_id` | String | Required | The ID of the agentic search template to retrieve.

## Example request

```json
GET /_plugins/_ml/agentic_search_templates/similar_search
```
{% include copy-curl.html %}

## Example response

The following response is for the template registered with a provided parameter schema in the [Register Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/#example-request-provide-the-parameter-schema) example:

```json
{
  "template_id": "similar_search",
  "index_binding": "products",
  "description": "Fuzzy search for products similar to a name",
  "param_schema": {
    "query_text": {
      "type": "string",
      "required": true,
      "description": "The product name to match. May contain misspellings."
    }
  },
  "created_time": 1792716795385,
  "last_updated_time": 1792716795385
}
```

If the template isn't registered, the API returns a `404` error.

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`template_id` | String | The agentic search template ID, which is also the stored script ID.
`index_binding` | String | The index to which the template is bound.
`description` | String | The template description, if one was provided or derived.
`param_schema` | Object | The parameter schema. See [The `param_schema` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/#the-param_schema-object).
`created_time` | Long | The time at which the template was registered, in epoch milliseconds.
`last_updated_time` | Long | The time at which the template was last updated, in epoch milliseconds.
`created_by` | String | The user who registered the template. Present only when the Security plugin is enabled.
