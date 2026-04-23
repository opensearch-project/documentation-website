---
layout: default
title: Change Password API
grand_parent: Security APIs
parent: Authentication APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/api-reference/security/authentication/change-password/
---

# Change Password API
**Introduced 1.0**
{: .label .label-purple }

The Change Password API allows users to update their own passwords. Users must provide their current password for verification before the password change is allowed.

<!-- spec_insert_start
api: security.change_password
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/account
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: security.change_password
component: request_body_parameters
-->
## Request body fields

The request body is __required__. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `current_password` | **Required** | String | The current password. |
| `password` | **Required** | String | The new password to set. |

<!-- spec_insert_end -->

## Example request

```json
PUT /_plugins/_security/api/account
{
  "current_password": "old-secure-password",
  "password": "new-secure-password"
}
```
{% include copy-curl.html %}

## Example response

A successful response indicates that the password has been changed:

```json
{
  "status": "OK",
  "message": "Password changed"
}
```

If the current password is incorrect, the API returns an error:

```json
{
  "status": "UNAUTHORIZED",
  "message": "Invalid credentials"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns "OK". |
| `message` | String | A message describing the result of the operation. |

## Password best practices

Proper password management is essential for securing your OpenSearch cluster. When using this API to change a password, keep the following guidelines in mind:

- You can only use this API to change the password of the currently authenticated user.
- Make sure the new password meets any configured password policies.
- Existing authentication tokens remain valid until they expire, even after the password changes.
- Use strong passwords that include a mix of uppercase and lowercase letters, numbers, and special characters.

To enhance security, use a password manager to generate and store complex passwords. Incorporate regular password rotation into your organization's security policy to help protect against unauthorized access.
