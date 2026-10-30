---
layout: default
title: Change password
parent: Account APIs
grand_parent: Security APIs
nav_order: 10
redirect_from:
  - /api-reference/security/authentication/change-password/
---

# Change Password API
**Introduced 1.0**
{: .label .label-purple }

Changes the password for the current user.

<!-- spec_insert_start
api: security.change_password
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/account
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `current_password` | String | The user's current password. | Yes |
| `password` | String | The new password. It must satisfy the password policy set by `plugins.security.restapi.password_validation_regex` and must not be too similar to the user name. | Yes |

## Example request

```json
PUT /_plugins/_security/api/account
{
  "current_password": "OldPassword_4471!",
  "password": "NewPassword_8823!"
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'pw-demo' updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `message` | String | A message naming the user whose password was changed. |
