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

Creates or replaces the specified action group.

<!-- spec_insert_start
api: security.create_action_group
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `allowed_actions` | Array of strings | The actions that the action group permits. Specify individual actions, such as `indices:data/write/index`, or the names of other action groups. | Yes |
| `type` | String | The scope of the action group. Valid values are `cluster`, `index`, and `kibana`. If omitted, the action group can be used at any level. | No |
| `description` | String | A description of the action group. | No |
| `hidden` | Boolean | Whether the action group is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the action group is read-only and cannot be modified. Default is `false`. | No |

## Example request

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

```json
{
  "status": "CREATED",
  "message": "'custom_action_group' created."
}
```
