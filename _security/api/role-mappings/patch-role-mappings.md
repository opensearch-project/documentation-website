---
layout: default
title: Patch role mappings
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Role Mappings API
**Introduced 1.0**
{: .label .label-purple }

Updates role mappings without replacing them. Specify a role name to update individual attributes of one role mapping, or omit the role name to create, update, or delete multiple role mappings in a single call.

<!-- spec_insert_start
api: security.patch_role_mappings
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/rolesmapping
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_role_mapping
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | String | No | The name of the role whose mapping you want to update. If omitted, the request can modify multiple role mappings. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify a role name, the path is relative to that role's mapping, such as `/users`. When you omit the role name, the path names the role, such as `/readall`. | Yes |
| `value` | Object | The new value. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request replaces the users and backend roles mapped to the `my-role` role:

```json
PATCH _plugins/_security/api/rolesmapping/my-role
[
  {
    "op": "replace", "path": "/users", "value": ["myuser"]
  },
  {
    "op": "replace", "path": "/backend_roles", "value": ["mybackendrole"]
  }
]
```
{% include copy-curl.html security=true %}

The following request adds a mapping for the `readall` role and removes the mapping for the `test-role-2` role:

```json
PATCH _plugins/_security/api/rolesmapping
[
  {
    "op": "add",
    "path": "/readall",
    "value": {
      "backend_roles": [
        "reporting"
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

A request that updates one role mapping names the role in the response:

```json
{
  "status": "OK",
  "message": "'my-role' updated."
}
```

A bulk request does not name the role mappings it changed:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
