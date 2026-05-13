---
layout: default
title: Create API Token
grand_parent: Security APIs
parent: API Token APIs
nav_order: 10
---

# Create API Token
**Introduced 3.7**
{: .label .label-purple }

Creates a new API token with the specified permissions and duration.

## Endpoints

```json
POST /_plugins/_security/api/apitokens
```

## Request body fields

The request body is **required**. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | A unique name for the token. Must match `[a-zA-Z0-9_-]+`. |
| `cluster_permissions` | Optional | Array of strings | Cluster-level permissions or action groups. Default is `[]`. |
| `index_permissions` | Optional | Array of objects | Index-level permissions. Default is `[]`. |
| `index_permissions.index_pattern` | **Required** | Array of strings | Index patterns this permission applies to (e.g., `["logs-*"]`). |
| `index_permissions.allowed_actions` | **Required** | Array of strings | Actions or action groups allowed on the matching indices. |
| `duration_seconds` | Optional | Long | Token validity duration in seconds. Maximum is configured by `max_duration_seconds` (default 7,776,000 = 90 days). If omitted, defaults to the maximum. |

## Example request

```bash
POST /_plugins/_security/api/apitokens
{
  "name": "my-pipeline-key",
  "cluster_permissions": ["cluster_monitor", "indices:data/write/bulk"],
  "index_permissions": [
    {
      "index_pattern": ["logs-*"],
      "allowed_actions": ["indices_all"]
    }
  ],
  "duration_seconds": 2592000
}
```

## Example response

```json
{
  "id": "DjxGIp4BkXkgMZpmeGvx",
  "token": "os_VNsOYN6kDoIgyrD_sBX2jmEIdfcnK5h9zq4u8ddjn8U"
}
```

{: .warning }
The `token` value is returned only once. Store it securely — it cannot be retrieved again.

## Response body fields

| Property | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier for the token (used for revocation). |
| `token` | String | The plaintext token to use in the `Authorization: ApiKey <token>` header. |
