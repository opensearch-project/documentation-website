---
layout: default
title: Patch users
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Users API
**Introduced 1.0**
{: .label .label-purple }

Updates internal users without replacing them. Specify a user name to update individual attributes of one user, or omit the user name to create, update, or delete multiple users in a single call.

<!-- spec_insert_start
api: security.patch_users
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/internalusers
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.patch_user
component: endpoints
omit_header: true
-->
```json
PATCH /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | No | The name of the user to update. If omitted, the request can modify multiple users. |

## Request body fields

The request body is required. It is an array of JSON objects. Each object contains the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `op` | String | The operation to perform. Valid values are `add`, `remove`, `replace`, `move`, `copy`, and `test`. | Yes |
| `path` | String | The path to modify. When you specify a user name, the path is relative to that user, such as `/backend_roles`. When you omit the user name, the path names the user, such as `/spock`. | Yes |
| `value` | Object | The new value. Required for the `add`, `replace`, and `test` operations. | No |

## Example request

The following request updates the backend roles of the `kirk` user:

```json
PATCH _plugins/_security/api/internalusers/kirk
[
  {
    "op": "replace",
    "path": "/backend_roles",
    "value": [
      "commander"
    ]
  }
]
```
{% include copy-curl.html security=true %}

The following request adds the `spock` and `worf` users and removes the `riker` user:

```json
PATCH _plugins/_security/api/internalusers
[
  {
    "op": "add",
    "path": "/spock",
    "value": {
      "password": "Str0ngPassw0rd_7741!",
      "backend_roles": [
        "science"
      ]
    }
  },
  {
    "op": "add",
    "path": "/worf",
    "value": {
      "password": "Str0ngPassw0rd_3390!",
      "backend_roles": [
        "security"
      ]
    }
  },
  {
    "op": "remove",
    "path": "/riker"
  }
]
```
{% include copy-curl.html security=true %}

## Example response

When you update one user, the response contains the user name:

```json
{
  "status": "OK",
  "message": "'kirk' updated."
}
```

When you update multiple users, the response appears as follows:

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```
