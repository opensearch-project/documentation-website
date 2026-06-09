---
layout: default
title: Create an API key
grand_parent: Security APIs
parent: API Key APIs
nav_order: 10
---

# Create an API Key API
**Introduced 3.7**
{: .label .label-purple }

Creates a new API key with the specified permissions and duration.

## Endpoints

```json
POST /_plugins/_security/api/apitokens
```

## Request body fields

The request body is required. The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | A unique name for the key. Must match `[a-zA-Z0-9_-]+`. Required. |
| `cluster_permissions` | Array of strings | Cluster-level permissions or action groups. Optional. Default is `[]`. |
| `index_permissions` | Array of objects | Index-level permissions. Optional. Default is `[]`. |
| `index_permissions.index_pattern` | Array of strings | The index patterns to which this permission applies (for example, `["logs-*"]`). Required. |
| `index_permissions.allowed_actions` | Array of strings | Actions or action groups allowed for the matching indexes. Required. |
| `duration_seconds` | Long | The amount of time the token is valid, in seconds. The maximum for this value is configured in `max_duration_seconds` (default is 7,776,000 = 90 days). If omitted, defaults to the `max_duration_seconds`. Optional. |

## Example request

```json
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

The `token` value is returned only once and cannot be retrieved again. Store it securely.
{: .warning }

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier for the key (used for revocation). |
| `token` | String | The plain-text token to use in the `Authorization: ApiKey <token>` header. |
