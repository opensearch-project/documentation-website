---
layout: default
title: Create or update tenant
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Tenant API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified tenant.

<!-- spec_insert_start
api: security.create_tenant
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Request body fields

The request body is required. It is a JSON object with the following field.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `description` | String | A description of the tenant. | No |

## Example request

```json
PUT _plugins/_security/api/tenants/test-tenant
{
  "description": "A tenant for the test team."
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "CREATED",
  "message": "'test-tenant' created."
}
```

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result. For more information, see [Using wait_for_completion for configuration changes]({{site.url}}{{site.baseurl}}/security/api/index/#using-wait_for_completion-for-configuration-changes).
