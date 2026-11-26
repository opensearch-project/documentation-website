---
layout: default
title: Revoke API key
parent: API key APIs
grand_parent: Security APIs
nav_order: 30
redirect_from:
  - /api-reference/security/api-keys/revoke/
---

# Revoke API Key API
**Introduced 3.7**
{: .label .label-purple }

Revokes an API key, making it immediately unusable for authentication. This is a soft delete: the key remains visible in list responses with a `revoked_at` timestamp.

Note the following when revoking API keys:

- Revocation is synchronous: the key is broadcast as invalid to all nodes before the response is returned.
- Revoked keys cannot be reactivated.
- The key name cannot be reused after revocation.

## Endpoints

```json
DELETE /_plugins/_security/api/apitokens/{id}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | The unique identifier of the key to revoke. |

## Example request

```json
DELETE _plugins/_security/api/apitokens/_ofOi6ABkhwU_cGa4M3v
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "message": "Token _ofOi6ABkhwU_cGa4M3v revoked successfully."
}
```

## Response body fields

The response body is a JSON object with the following field.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | A message confirming that the key was revoked. |
