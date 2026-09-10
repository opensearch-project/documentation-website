---
layout: default
title: Revoke an API Key
parent: API Key APIs
grand_parent: Security APIs
nav_order: 30
redirect_from:
  - /api-reference/security/api-keys/revoke/
---

# Revoke an API Key

Revokes an API key, making it immediately unusable for authentication. This is a soft delete: the key remains visible in list responses with a `revoked_at` timestamp.

Note the following behavior when revoking API keys:

- Revocation is synchronous: the key is broadcast as invalid to all nodes before the response is returned.
- Revoked keys cannot be reactivated.
- The key name cannot be reused after revocation.

## Endpoints

```json
DELETE /_plugins/_security/api/apitokens/{id}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier of the key to revoke. Required. |

## Example request

```json
DELETE /_plugins/_security/api/apitokens/DjxGIp4BkXkgMZpmeGvx
```

## Example response

```json
{
  "message": "Token revoked successfully"
}
```
