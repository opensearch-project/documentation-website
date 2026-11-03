---
layout: default
title: Delete tenant
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 40
---

# Delete Tenant API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified tenant.

<!-- spec_insert_start
api: security.delete_tenant
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Example request

```json
DELETE _plugins/_security/api/tenants/test-tenant
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'test-tenant' deleted."
}
```

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result.
