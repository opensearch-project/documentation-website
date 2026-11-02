---
layout: default
title: Create or update roles
parent: Role APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Roles API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces one role or multiple roles. Each supplied role definition replaces the existing definition in full. For information about specifying multiple roles, see [Creating or updating multiple roles](#creating-or-updating-multiple-roles). To update individual attributes of a role, use the [Patch Roles API]({{site.url}}{{site.baseurl}}/security/api/roles/patch-roles/).

## Endpoints

```json
PUT /_plugins/_security/api/roles
PUT /_plugins/_security/api/roles/{role}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `role` | String | The name of the role to create or replace. Optional. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

## Request body fields

The request body is required. When you specify a role name, the body is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `cluster_permissions` | Array of strings | The cluster-level actions that the role permits. Specify individual actions, such as `indices:admin/create`, or action groups, such as `cluster_composite_ops`. | No |
| `index_permissions` | Array of objects | The index-level permissions that the role grants. Each object contains `index_patterns`, `allowed_actions`, and, optionally, `dls`, `fls`, and `masked_fields`. | No |
| `tenant_permissions` | Array of objects | The tenant-level permissions that the role grants. Each object contains `tenant_patterns` and `allowed_actions`. | No |
| `description` | String | A description of the role. | No |
| `hidden` | Boolean | Whether the role is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the role is read-only and cannot be modified. Default is `false`. | No |

The `index_permissions` objects contain the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `index_patterns` | Array of strings | The indexes to which the permissions apply. Supports wildcard patterns, such as `movies*`. | Yes |
| `allowed_actions` | Array of strings | The index-level actions that the role permits. Specify individual actions, such as `indices:data/read/search`, or action groups, such as `read`. | Yes |
| `dls` | String | A query, as a string, that limits the documents the role can read. For more information, see [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/). | No |
| `fls` | Array of strings | The document fields that the role can read. Prefix a field with `~` to exclude it instead. For more information, see [Field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/). | No |
| `masked_fields` | Array of strings | The document fields to anonymize. For more information, see [Field masking]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/). | No |

The `tenant_permissions` objects contain the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `tenant_patterns` | Array of strings | The tenants to which the permissions apply. Supports wildcard patterns. | Yes |
| `allowed_actions` | Array of strings | The tenant-level actions that the role permits. Valid values are `kibana_all_read` and `kibana_all_write`. | Yes |

> When a document-level or field-level security rule targets a [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/) field, the standard analyzer splits the field value at Unicode special characters, so a value that contains one is indexed as multiple tokens.
>
> For example, the values `"user.id": "User-1"` and `"user.id": "User-2"` both contain a hyphen, so the analyzer cannot distinguish between the two users and treats them as the same value. This can filter documents unintentionally and grant access to documents that the rule was meant to hide.
>
> To avoid this, use a custom analyzer or map the field as [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/), which performs an exact-match search. For a list of the characters to avoid in `text` fields, see [Word boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).
{: .warning}

## Example request: Create one role

```json
PUT _plugins/_security/api/roles/test-role
{
  "cluster_permissions": [
    "cluster_composite_ops",
    "indices_monitor"
  ],
  "index_permissions": [
    {
      "index_patterns": [
        "movies*"
      ],
      "dls": "",
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "read"
      ]
    }
  ],
  "tenant_permissions": [
    {
      "tenant_patterns": [
        "human_resources"
      ],
      "allowed_actions": [
        "kibana_all_read"
      ]
    }
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

A successful request returns HTTP status `201` for a new role or `200` for a replaced one:

```json
{
  "status": "CREATED",
  "message": "'test-role' created."
}
```

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result.

## Creating or updating multiple roles
**Introduced 3.10**
{: .label .label-purple }

To create or replace multiple roles in one request, omit the role name from the path. The request body is a non-empty JSON object in which each key is a role name and each value is a role definition containing the fields in [Request body fields](#request-body-fields). Roles that are not included in the request are unchanged.

If a role name or definition is invalid, or a change is not permitted, none of the roles in the request are written. Each role in the request is subject to the same permissions and restrictions as a single-role request, including restrictions on modifying reserved or hidden roles. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

The number of roles in one request is limited by the `plugins.security.restapi.bulk_max_entries` cluster setting. Default is `1000`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#rest-management-api-settings).

### Example request: Create multiple roles

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

### Example response

A successful request returns HTTP status `200`, including when all supplied roles are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```
