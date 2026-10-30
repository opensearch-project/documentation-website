---
layout: default
title: Create or update roles
parent: Role APIs
grand_parent: Security APIs
nav_order: 15
---

# Create or Update Roles API
**Introduced 3.10**
{: .label .label-purple }

Creates or replaces multiple roles in one request. Roles that are not included in the request are unchanged.

Each supplied role definition replaces the existing definition in full. To update individual attributes of a role, use the [Patch Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-roles/).

## Endpoints

```json
PUT /_plugins/_security/api/roles
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Request body fields

The request body is required. It is a non-empty JSON object in which each key is a role name and each value is a role definition. Each definition accepts the same [request body fields as the Create or Update Role API]({{site.url}}{{site.baseurl}}/security/api/roles/create-role/#request-body-fields).

The API validates every entry before writing any changes. If a role name or definition is invalid, or a change is not permitted, none of the roles in the request are written. Each role in the request is subject to the same permissions and restrictions as a single-role request, including restrictions on modifying reserved or hidden roles. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

## Example request

The following request creates or replaces two roles:

```json
PUT /_plugins/_security/api/roles
{
  "movies_reader": {
    "cluster_permissions": [],
    "index_permissions": [
      {
        "index_patterns": ["movies*"],
        "allowed_actions": ["read"]
      }
    ],
    "tenant_permissions": []
  },
  "cluster_observer": {
    "cluster_permissions": ["cluster_monitor"],
    "index_permissions": [],
    "tenant_permissions": []
  }
}
```
{% include copy-curl.html security=true %}

## Example response

A successful synchronous request returns HTTP status `200`, including when all supplied roles are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```

If you set `wait_for_completion` to `false`, a successful submission also returns HTTP status `200`, but the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result.
