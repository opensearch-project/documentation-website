---
layout: default
title: Create or update role
parent: Role APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Role API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified role.

<!-- spec_insert_start
api: security.create_role
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

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

## Example request

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

```json
{
  "status": "CREATED",
  "message": "'test-role' created."
}
```
