---
layout: default
title: List API keys
grand_parent: Security APIs
parent: API Key APIs
nav_order: 20
---

# List API Keys API
**Introduced 3.7**
{: .label .label-purple }

Returns all API keys, including active, expired, and revoked keys.

## Endpoints

```json
GET /_plugins/_security/api/apitokens
```

## Example request

```json
GET /_plugins/_security/api/apitokens
```

## Example response

```json
[
  {
    "id": "DjxGIp4BkXkgMZpmeGvx",
    "name": "my-pipeline-key",
    "iat": 1778691504087,
    "expires_at": 1781283504087,
    "cluster_permissions": ["cluster_monitor", "indices:data/write/bulk"],
    "index_permissions": [
      {
        "index_pattern": ["logs-*"],
        "allowed_actions": ["indices_all"]
      }
    ],
    "created_by": "admin"
  },
  {
    "id": "EkxHJp4BkXkgMZpmfGvy",
    "name": "revoked-key",
    "iat": 1778600000000,
    "expires_at": 1781192000000,
    "cluster_permissions": ["cluster_monitor"],
    "index_permissions": [],
    "revoked_at": 1778650000000,
    "created_by": "admin"
  }
]
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier for the key. |
| `name` | String | The key name. |
| `iat` | Long | The issued-at timestamp, in epoch milliseconds. |
| `expires_at` | Long | The expiration timestamp, in epoch milliseconds. |
| `cluster_permissions` | Array of strings | The cluster-level permissions granted to the key. |
| `index_permissions` | Array of objects | The index-level permissions granted to the key. |
| `revoked_at` | Long | The revocation timestamp, in epoch milliseconds. Present only if the key has been revoked. |
| `created_by` | String | The user who created the key. |
