---
layout: default
title: Patch action groups
parent: Action group APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Action Groups API
**Introduced 1.0**
{: .label .label-purple }

Updates action groups without replacing them. Specify an action group name to update individual attributes of one action group, or omit the name to create, update, or delete multiple action groups in a single call.

<!-- spec_insert_start
api: security.patch_action_groups
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/actiongroups
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_action_group
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action_group` | String | No | The name of the action group to update. If omitted, the request can modify multiple action groups. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify an action group name, the path is relative to that action group, such as `/allowed_actions`. When you omit the name, the path names the action group, such as `/CREATE_INDEX`. | Yes |
| `value` | Object | The new value. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request replaces the allowed actions of the `custom_action_group` action group:

```json
PATCH _plugins/_security/api/actiongroups/custom_action_group
[
  {
    "op": "replace", "path": "/allowed_actions", "value": ["indices:admin/create", "indices:admin/mapping/put"]
  }
]
```
{% include copy-curl.html security=true %}

The following request adds the `CREATE_INDEX` action group and removes the `CRUD` action group:

```json
PATCH _plugins/_security/api/actiongroups
[
  {
    "op": "add", "path": "/CREATE_INDEX", "value": { "allowed_actions": ["indices:admin/create", "indices:admin/mapping/put"] }
  },
  {
    "op": "remove", "path": "/CRUD"
  }
]
```
{% include copy-curl.html security=true %}

## Example response

A request that updates one action group names it in the response:

```json
{
  "status": "OK",
  "message": "'custom_action_group' updated."
}
```

A bulk request does not name the action groups it changed:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
