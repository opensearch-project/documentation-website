---
layout: default
title: Delete role mapping
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Role Mapping API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified role mapping.

<!-- spec_insert_start
api: security.delete_role_mapping
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Example request

```json
DELETE _plugins/_security/api/rolesmapping/test-role
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'test-role' deleted."
}
```

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result. For more information, see [Using wait_for_completion for configuration changes]({{site.url}}{{site.baseurl}}/security/api/index/#using-wait_for_completion-for-configuration-changes).
