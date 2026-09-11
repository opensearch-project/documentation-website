---
layout: default
title: Patch roles
parent: Role APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Roles API
**Introduced 1.0**
{: .label .label-purple }

Updates roles without replacing them. Specify a role name to update individual attributes of one role, or omit the role name to create, update, or delete multiple roles in a single call.

<!-- spec_insert_start
api: security.patch_roles
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/roles
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_role
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | String | No | The name of the role to update. If omitted, the request can modify multiple roles. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify a role name, the path is relative to that role, such as `/index_permissions/0/fls`. When you omit the role name, the path begins with the role name, such as `/reporting-role/cluster_permissions`. | Yes |
| `value` | Object | The new value. Required for the `add`, `replace`, and `test` operations. | No |

Use `-` as an array index to append a new permission to the end of an array of permissions.
{: .note}

## Example request

The following request replaces the field-level security settings of the `test-role` role and removes its document-level security settings:

```json
PATCH _plugins/_security/api/roles/test-role
[
  {
    "op": "replace", "path": "/index_permissions/0/fls", "value": ["myfield1", "myfield2"]
  },
  {
    "op": "remove", "path": "/index_permissions/0/dls"
  }
]
```
{% include copy-curl.html security=true %}

The following request adds the `reporting-role` role and removes the `test-role-2` role:

```json
PATCH _plugins/_security/api/roles
[
  {
    "op": "add",
    "path": "/reporting-role",
    "value": {
      "cluster_permissions": [
        "cluster_composite_ops"
      ]
    }
  },
  {
    "op": "remove",
    "path": "/test-role-2"
  }
]
```
{% include copy-curl.html security=true %}

## Example response

A request that updates one role names it in the response:

```json
{
  "status": "OK",
  "message": "'test-role' updated."
}
```

A bulk request does not name the roles it changed:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
