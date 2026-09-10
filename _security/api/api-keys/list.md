---
layout: default
title: List API keys
parent: API key APIs
grand_parent: Security APIs
nav_order: 20
redirect_from:
  - /api-reference/security/api-keys/list/
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
GET _plugins/_security/api/apitokens
```
{% include copy-curl.html security=true %}

## Example response

```json
[
  {
    "id": "_ofOi6ABkhwU_cGa4M3v",
    "name": "test-token",
    "iat": 1789051986089,
    "expires_at": 1789138386088,
    "cluster_permissions": [
      "cluster_monitor"
    ],
    "index_permissions": [
      {
        "index_pattern": [
          "logs*"
        ],
        "allowed_actions": [
          "read"
        ]
      }
    ],
    "created_by": "admin"
  }
]
```

## Response body fields

The response body is an array of JSON objects. Each object contains the following fields.

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
