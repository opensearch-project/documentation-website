---
layout: default
title: Patch tenants
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Tenants API
**Introduced 1.0**
{: .label .label-purple }

Updates tenants without replacing them. Specify a tenant name to update individual attributes of one tenant, or omit the tenant name to add, delete, or modify multiple tenants in a single call.

<!-- spec_insert_start
api: security.patch_tenants
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/tenants
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_tenant
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenant` | String | No | The name of the tenant to update. If omitted, the request can modify multiple tenants. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify a tenant name, the path is relative to that tenant, such as `/description`. When you omit the tenant name, the path begins with the tenant name, such as `/human_resources/description`. | Yes |
| `value` | Object | The new value. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request updates the description of the `human_resources` tenant:

```json
PATCH _plugins/_security/api/tenants/human_resources
[
  {
    "op": "replace", "path": "/description", "value": "An updated description"
  }
]
```
{% include copy-curl.html security=true %}

The following request updates the description of the `human_resources` tenant and adds the `another_tenant` tenant:

```json
PATCH _plugins/_security/api/tenants
[
  {
    "op": "replace",
    "path": "/human_resources/description",
    "value": "An updated description"
  },
  {
    "op": "add",
    "path": "/another_tenant",
    "value": {
      "description": "Another description."
    }
  }
]
```
{% include copy-curl.html security=true %}

## Example response

A request that updates one tenant names it in the response:

```json
{
  "status": "OK",
  "message": "'human_resources' updated."
}
```

A bulk request does not name the tenants it changed:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
