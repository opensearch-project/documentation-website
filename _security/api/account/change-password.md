---
layout: default
title: Change Password API
parent: Account APIs
grand_parent: Security APIs
nav_order: 20
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

| Field              | Data type  | Description                    | Required  |
|:-------------------|:-----------|:-------------------------------|:----------|
| `current_password`   | String     | The current password.          | Yes       |
| `password`           | String     | The new password to set.       | Yes       |

### Example request

```json
PUT _plugins/_security/api/account
{
    "current_password": "old-password",
    "password": "new-password"
}
```
{% include copy-curl.html %}


### Example response

```json
{
  "status": "OK",
  "message": "'test-user' updated."
}
```

## Response body fields

| Field    | Data type  | Description                   |
|:---------|:-----------|:------------------------------|
| `status`   | String     | The status of the operation.  |
| `message`  | String     | A descriptive message.        |


---
