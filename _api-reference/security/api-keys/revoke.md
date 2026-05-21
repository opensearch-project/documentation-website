---
layout: default
title: Revoke API Key
grand_parent: Security APIs
parent: API Key APIs
nav_order: 30
---

# Revoke API Key
**Introduced 3.7**
{: .label .label-purple }

Revokes an API key, making it immediately unusable for authentication. This is a soft delete — the key remains visible in list responses with a `revoked_at` timestamp.

## Endpoints

```json
DELETE /_plugins/_security/api/apitokens/{id}
```

## Path parameters

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the key to revoke. |

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

- Revocation is synchronous — the key is broadcast as invalid to all nodes before the response is returned.
- Revoked keys cannot be reactivated.
- The key name cannot be reused after revocation.
