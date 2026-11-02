---
layout: default
title: Create or update action groups
parent: Action group APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Action Groups API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces one action group or multiple action groups. Each supplied action group definition replaces the existing definition in full. For information about specifying multiple action groups, see [Creating or updating multiple action groups](#creating-or-updating-multiple-action-groups). To update individual attributes of an action group, use the [Patch Action Groups API]({{site.url}}{{site.baseurl}}/security/api/action-groups/patch-action-groups/).

## Endpoints

```json
PUT /_plugins/_security/api/actiongroups
PUT /_plugins/_security/api/actiongroups/{action_group}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `action_group` | String | The name of the action group to create or replace. Optional. |

## Request body fields

The request body is required. When you specify an action group name, the body is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `allowed_actions` | Array of strings | The actions that the action group permits. Specify individual actions, such as `indices:data/write/index`, or the names of other action groups. | Yes |
| `type` | String | The scope of the action group. Valid values are `cluster`, `index`, and `kibana`. If omitted, the action group can be used at any level. | No |
| `description` | String | A description of the action group. | No |
| `hidden` | Boolean | Whether the action group is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the action group is read-only and cannot be modified. Default is `false`. | No |

## Example request: Create one action group

```json
PUT _plugins/_security/api/actiongroups/custom_action_group
{
  "allowed_actions": [
    "indices:data/write/index*",
    "indices:data/write/update*",
    "indices:admin/mapping/put",
    "indices:data/write/bulk*",
    "read",
    "write"
  ]
}
```
{% include copy-curl.html security=true %}

## Example response

A successful request returns HTTP status `201` for a new action group or `200` for a replaced one:

```json
{
  "status": "CREATED",
  "message": "'custom_action_group' created."
}
```

## Creating or updating multiple action groups
**Introduced 3.10**
{: .label .label-purple }

To create or replace multiple action groups in one request, omit the action group name from the path. The request body is a non-empty JSON object in which each key is an action group name and each value is an action group definition containing the fields in [Request body fields](#request-body-fields). Action groups that are not included in the request are unchanged.

If an action group name or definition is invalid, or a change is not permitted, none of the action groups in the request are written. Each action group in the request is subject to the same permissions and restrictions as a single-action-group request. These include restrictions on modifying reserved or hidden action groups, naming an action group after an existing role, listing an action group in its own `allowed_actions`, and creating action groups that contain REST API admin permissions. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

An action group can list other action groups in `allowed_actions`, including action groups defined in the same request, in any order. References are resolved when permissions are evaluated, so a referenced action group does not need to exist when the request is validated.

The number of action groups in one request is limited by the `plugins.security.restapi.bulk_max_entries` cluster setting. Default is `1000`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#rest-management-api-settings).

### Example request: Create multiple action groups

The following request creates or replaces two action groups. The second action group references the first one:

```json
PUT /_plugins/_security/api/actiongroups
{
  "movies_read": {
    "allowed_actions": [
      "indices:data/read/search*",
      "indices:data/read/get*"
    ],
    "type": "index"
  },
  "movies_write": {
    "allowed_actions": [
      "movies_read",
      "indices:data/write/index*",
      "indices:data/write/update*"
    ],
    "type": "index"
  }
}
```
{% include copy-curl.html security=true %}

### Example response

A successful request returns HTTP status `200`, including when all supplied action groups are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```
