---
layout: default
title: Get tenants
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Tenants API
**Introduced 1.0**
{: .label .label-purple }

Retrieves tenants. Specify a tenant name to retrieve one tenant, or omit the tenant name to retrieve all tenants.

<!-- spec_insert_start
api: security.get_tenants
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/tenants
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_tenant
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenant` | String | No | The name of the tenant to retrieve. If omitted, all tenants are returned. |

## Example request

The following request retrieves all tenants:

```json
GET _plugins/_security/api/tenants
```
{% include copy-curl.html security=true %}

The following request retrieves the `human_resources` tenant:

```json
GET _plugins/_security/api/tenants/human_resources
```
{% include copy-curl.html security=true %}

## Example response

The response to a request for all tenants contains the default tenants along with any that you created:

```json
{
  "global_tenant": {
    "description": "Global tenant",
    "hidden": false,
    "reserved": true,
    "static": true
  },
  "admin_tenant": {
    "description": "Demo tenant for admin user",
    "hidden": false,
    "reserved": false,
    "static": false
  },
  "test-tenant": {
    "description": "A tenant for the test team.",
    "hidden": false,
    "reserved": false,
    "static": false
  },
  "human_resources": {
    "description": "A tenant for the human resources team.",
    "hidden": false,
    "reserved": false,
    "static": false
  }
}
```

When you retrieve one tenant, the response contains only that tenant:

```json
{
  "human_resources": {
    "description": "A tenant for the human resources team.",
    "hidden": false,
    "reserved": false,
    "static": false
  }
}
```
