---
layout: default
title: Rename user
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 25
---

# Rename User API
**Introduced 3.11**
{: .label .label-purple }

Renames an internal user and updates the role mappings that reference the user by name.

The user's password hash, backend roles, security roles, and attributes are kept under the new name. In each role mapping whose `users` list contains the old name, the old name is replaced with the new one. Entries that use wildcard patterns, such as `ali*`, are not changed. All changes are validated before any are written, so a rejected request does not modify the user or any role mapping.

Only role mappings are updated. Other data that stores the username, such as resource sharing records or documents that plugins store, is not changed.
{: .note}

## Endpoints

```json
POST /_plugins/_security/api/internalusers/{username}/_rename
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `username` | String | The current name of the user to rename. Required. |

## Request body fields

The request body is required. It is a JSON object with the following field.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `new_username` | String | The new name for the user. Must differ from the current name, must not belong to an existing user, and follows the same rules as user names in the [Create or Update User API]({{site.url}}{{site.baseurl}}/security/api/users/create-user/). | Yes |

## Example request

The following request renames the user `alice` to `alice2`:

```json
POST _plugins/_security/api/internalusers/alice/_rename
{
  "new_username": "alice2"
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'alice' renamed to 'alice2'.",
  "previous_username": "alice",
  "username": "alice2",
  "updated_roles_mapping": ["readall"]
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. |
| `message` | String | A message describing the result. |
| `previous_username` | String | The name of the user before the rename. |
| `username` | String | The name of the user after the rename. |
| `updated_roles_mapping` | Array of strings | The names of the role mappings whose `users` list was updated. |

## Errors

| Status | Cause |
| :--- | :--- |
| `400` | The request body is missing or invalid, or `new_username` is not a valid user name or matches the current name. |
| `403` | The user, or a role mapping that references the user, is reserved and the caller does not have permission to change it. |
| `404` | The user does not exist, or the user or a role mapping that references it is hidden and the caller does not have permission to change it. |
| `409` | A user named `new_username` already exists, or the security configuration was changed by another request at the same time. Retry the request. |
| `500` | The rename was only partially applied. The response names the role mappings that still reference the old name and must be updated manually. |
