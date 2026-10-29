---
layout: default
title: Create or update action group
parent: Action group APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Action Group API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces action groups. Specify an action group name to create or replace one action group, or omit the name to create or replace multiple action groups in a single call.

<!-- spec_insert_start
api: security.create_action_group
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->
```json
PUT /_plugins/_security/api/actiongroups
```

The form without an action group name was introduced in OpenSearch 3.10.
{: .note}

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `action_group` | String | The name of the action group to create or replace. Omit it to create or replace multiple action groups in one request. |

## Request body fields

The request body is required.

When you specify an action group name, the body is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `allowed_actions` | Array of strings | The actions that the action group permits. Specify individual actions, such as `indices:data/write/index`, or the names of other action groups. | Yes |
| `type` | String | The scope of the action group. Valid values are `cluster`, `index`, and `kibana`. If omitted, the action group can be used at any level. | No |
| `description` | String | A description of the action group. | No |
| `hidden` | Boolean | Whether the action group is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the action group is read-only and cannot be modified. Default is `false`. | No |

When you omit the action group name, the body is a non-empty JSON object in which each key is an action group name and each value is a definition with the fields above. Each supplied definition replaces the existing action group in full; action groups that are not included in the request are unchanged. The API validates every entry before writing any changes: if a name or definition is invalid, or a change is not permitted, none of the action groups in the request are written. Each action group is subject to the same permissions and restrictions as a single-action-group request, including restrictions on modifying reserved or hidden action groups, on naming an action group after an existing role, on listing an action group in its own `allowed_actions`, and on action groups that contain REST API admin permissions. For API access requirements, see [Security REST API permissions]({{site.url}}{{site.baseurl}}/security/access-control/api/).

An action group may list other action groups in `allowed_actions`, including ones defined in the same request, in any order. References are resolved when permissions are evaluated, not when the request is validated.

The number of action groups in one request is limited by the `plugins.security.restapi.bulk_max_entries` cluster setting. Default is `1000`. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).

## Example request

The following request creates or replaces one action group:

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

The following request creates or replaces two action groups in one call, the second of which references the first:

```json
PUT _plugins/_security/api/actiongroups
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

## Example response

When you specify an action group name, a successful request returns HTTP status `201` for a new action group or `200` for a replaced one:

```json
{
  "status": "CREATED",
  "message": "'custom_action_group' created."
}
```

When you omit the action group name, a successful request returns HTTP status `200`, including when all supplied action groups are new:

```json
{
  "status": "OK",
  "message": "Resources updated."
}
```

If the request contains more action groups than `plugins.security.restapi.bulk_max_entries` allows, it fails with HTTP status `400`:

```json
{
  "status": "BAD_REQUEST",
  "message": "Request contains 1200 resources; the maximum is 1000."
}
```
