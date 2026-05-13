---
layout: default
title: Revoke API Token
grand_parent: Security APIs
parent: API Token APIs
nav_order: 30
---

# Revoke API Token
**Introduced 3.7**
{: .label .label-purple }

Revokes an API token, making it immediately unusable for authentication. This is a soft delete — the token remains visible in list responses with a `revoked_at` timestamp.

## Endpoints

```json
DELETE /_plugins/_security/api/apitokens/{id}
```

## Path parameters

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the token to revoke. |

## Example request

```bash
DELETE /_plugins/_security/api/apitokens/DjxGIp4BkXkgMZpmeGvx
```

## Example response

```json
{
  "message": "Token revoked successfully"
}
```

## Notes

- Revocation is synchronous — the token is broadcast as invalid to all nodes before the response is returned.
- Revoked tokens cannot be reactivated.
- The token name cannot be reused after revocation.
