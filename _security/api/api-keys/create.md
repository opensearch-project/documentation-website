---
layout: default
title: Create API key
parent: API key APIs
grand_parent: Security APIs
nav_order: 10
redirect_from:
  - /api-reference/security/api-keys/create/
---

# Create API Key API
**Introduced 3.7**
{: .label .label-purple }

Creates a new API key with the specified permissions and duration.

## Endpoints

```json
POST /_plugins/_security/api/apitokens
```

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `name` | String | A unique name for the key. Must match the pattern `[a-zA-Z0-9_-]+`. | Yes |
| `cluster_permissions` | Array of strings | The cluster-level permissions or action groups granted to the key. Default is an empty array. | No |
| `index_permissions` | Array of objects | The index-level permissions granted to the key. Default is an empty array. | No |
| `duration_seconds` | Long | The length of time for which the key is valid, in seconds. The maximum is set by `max_duration_seconds`, which defaults to 7,776,000 (90 days). If omitted, the key is valid for `max_duration_seconds`. | No |

The `index_permissions` objects contain the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `index_pattern` | Array of strings | The indexes to which the permissions apply. Supports wildcard patterns, such as `logs-*`. | Yes |
| `allowed_actions` | Array of strings | The actions or action groups permitted on the matching indexes. | Yes |

## Example request

```json
POST _plugins/_security/api/apitokens
{
  "name": "test-token",
  "duration_seconds": 86400,
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
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "id": "_ofOi6ABkhwU_cGa4M3v",
  "token": "os_7EoHbn6PVeBwnqFGFDT0g-NBSI46Nq5PutcHHsmCFHg"
}
```

The `token` value is returned only once and cannot be retrieved again. Store it securely.
{: .warning}

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier for the key (used for revocation). |
| `token` | String | The plain-text token to use in the `Authorization: ApiKey <token>` header. |
