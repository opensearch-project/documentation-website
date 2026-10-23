---
layout: default
title: List agentic search templates
parent: Agentic search template APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# List Agentic Search Templates API
**Introduced 3.9**
{: .label .label-purple }

Use this API to list registered agentic search templates.

## Endpoints

```json
GET /_plugins/_ml/agentic_search_templates
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`from` | Integer | Optional | The starting index for pagination. Must be non-negative. Default is `0`.
`size` | Integer | Optional | The maximum number of templates to return. Valid values are 1--1000. Default is `10`.

## Example request

```json
GET /_plugins/_ml/agentic_search_templates?from=0&size=10
```
{% include copy-curl.html %}

## Example response

The following response lists a single registered template:

```json
{
  "total": 1,
  "templates": [
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
  ]
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`total` | Long | The total number of registered templates.
`templates` | Array | The templates on the requested page. Each template contains the fields described in [Get Agentic Search Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/get-agentic-search-template/#response-body-fields).

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/agentic_search_templates/list`.
