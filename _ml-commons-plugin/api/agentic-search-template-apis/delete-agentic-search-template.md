---
layout: default
title: Delete agentic search template
parent: Agentic search template APIs
grand_parent: ML APIs
nav_order: 50
---

# Delete Agentic Search Template API
**Introduced 3.10**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/opensearch-agent-server/issues/150).
{: .warning}

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

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/agentic_search_templates/delete`.
