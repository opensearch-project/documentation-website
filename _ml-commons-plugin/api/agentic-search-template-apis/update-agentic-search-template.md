---
layout: default
title: Update agentic search template
parent: Agentic search template APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Update Agentic Search Template API
**Introduced 3.10**
{: .label .label-purple }

Use this API to update the description or parameter schema of a registered agentic search template. To change the query itself, update the stored script.

## Endpoints

```json
PUT /_plugins/_ml/agentic_search_templates/{template_id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`template_id` | String | Required | The ID of the agentic search template to update.

## Request body fields

The following table lists the available request body fields. Other fields, including `index`, are ignored.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`description` | String | Optional | A description of what the template searches.
`param_schema` | Object | Optional | Changes to the parameter schema. For each parameter that you specify, the fields that you provide replace the stored fields, and the other fields are unchanged. You can't add parameters that aren't in the stored schema. OpenSearch validates the merged schema against the template before saving it. See [The `param_schema` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-search-template-apis/register-agentic-search-template/#the-param_schema-object).

## Example request

The following request limits the `sort_by` parameter derived for the `product_search` template to the `price` field and leaves the parameter's other fields unchanged:

```json
PUT /_plugins/_ml/agentic_search_templates/product_search
{
  "param_schema": {
    "sort_by": {
      "enum": ["price"]
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index": ".plugins-ml-agentic-search-templates",
  "_id": "product_search",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```

If the template isn't registered, the API returns a `404` error. If the merged schema is invalid or the template doesn't render valid JSON with it, the API returns a `400` error.

The OpenSearch Agent Server caches each template's parameter schema for 60 seconds, so an update can take up to 60 seconds to reach the agent server.
{: .note}

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/agentic_search_templates/update`.
