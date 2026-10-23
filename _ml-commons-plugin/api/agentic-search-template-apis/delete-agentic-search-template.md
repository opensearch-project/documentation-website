---
layout: default
title: Delete agentic search template
parent: Agentic search template APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Delete Agentic Search Template API
**Introduced 3.9**
{: .label .label-purple }

Use this API to delete a registered agentic search template. Deleting an agentic search template doesn't delete the stored script.

## Endpoints

```json
DELETE /_plugins/_ml/agentic_search_templates/{template_id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`template_id` | String | Required | The ID of the agentic search template to delete.

## Example request

```json
DELETE /_plugins/_ml/agentic_search_templates/similar_search
```
{% include copy-curl.html %}

## Example response

```json
{
  "template_id": "similar_search",
  "status": "deleted"
}
```

If the template isn't registered, the API returns a `404` error.
