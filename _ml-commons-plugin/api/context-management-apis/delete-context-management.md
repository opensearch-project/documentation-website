---
layout: default
title: Delete context management
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 40
---

# Delete Context Management API
**Introduced 3.5**
{: .label .label-purple }

Use this API to delete a context management configuration. Once deleted, the context management can no longer be used by agents.

Deleting a context management configuration does not affect the agents currently using it. However, new agent registrations or executions will not be able to reference the deleted context management.
{: .note}

## Endpoints

```json
DELETE /_plugins/_ml/context_management/{context_management_name}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`context_management_name` | String | Required | The name of the context management to delete.

## Example request

```json
DELETE /_plugins/_ml/context_management/advanced-context-management
```
{% include copy-curl.html %}

## Example response

```json
{
  "context_management_name": "advanced-context-management",
  "status": "deleted"
}
```

## Error responses

If you attempt to delete a context management configuration that doesn't exist, the API returns a 404 error indicating the resource was not found:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "status_exception",
        "reason": "Context management template not found: sliding_window_max_40000_tokens_managers123"
      }
    ],
    "type": "status_exception",
    "reason": "Context management template not found: sliding_window_max_40000_tokens_managers123"
  },
  "status": 404
}
```

## Related documentation

For more information, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).