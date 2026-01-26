---
layout: default
title: Delete context management template
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Delete Context Management Template API
**Introduced 3.3**
{: .label .label-purple }

Use this API to delete a context management template. Once deleted, the template can no longer be used by agents.

Deleting a template does not affect agents that are currently using it. However, new agent registrations or executions will not be able to reference the deleted template.
{: .note}

## Endpoints

```json
DELETE /_plugins/_ml/context_management/<context_management_name>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`context_management_name` | String | Required | The name of the context management template to delete.

## Example request

```json
DELETE /_plugins/_ml/context_management/advanced-context-management
```
{% include copy-curl.html %}

## Example response

```json
{
  "template_id": "advanced-context-management",
  "status": "deleted"
}
```
