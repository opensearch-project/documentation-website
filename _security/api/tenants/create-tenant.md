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
