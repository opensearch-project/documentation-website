---
layout: default
title: Get action groups
parent: Action group APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Action Groups API
**Introduced 1.0**
{: .label .label-purple }

Retrieves action groups. Specify an action group name to retrieve one action group, or omit the name to retrieve all action groups.

<!-- spec_insert_start
api: security.get_action_groups
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/actiongroups
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_action_group
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `action_group` | String | No | The name of the action group to retrieve. If omitted, all action groups are returned. |

## Example request

The following request retrieves all action groups:

```json
GET _plugins/_security/api/actiongroups
```
{% include copy-curl.html security=true %}

The following request retrieves the `custom_action_group` action group:

```json
GET _plugins/_security/api/actiongroups/custom_action_group
```
{% include copy-curl.html security=true %}

## Example response

The response is abbreviated here:

```json
{
  "custom_action_group": {
    "allowed_actions": [
      "indices:data/write/index*",
      "indices:data/write/update*",
      "indices:admin/mapping/put",
      "indices:data/write/bulk*",
      "read",
      "write"
    ],
    "hidden": false,
    "reserved": false,
    "static": false
  },
  "data_access": {
    "allowed_actions": [
      "indices:data/*",
      "crud"
    ],
    "description": "Allow all read/write operations on data",
    "hidden": false,
    "reserved": true,
    "static": true,
    "type": "index"
  },
  "delete": {
    "allowed_actions": [
      "indices:data/write/delete*"
    ],
    "description": "Allow deleting documents",
    "hidden": false,
    "reserved": true,
    "static": true,
    "type": "index"
  },
  "cluster_manage_pipelines": {
    "allowed_actions": [
      "cluster:admin/ingest/pipeline/*"
    ],
    "description": "Manage pipelines",
    "hidden": false,
    "reserved": true,
    "static": true,
    "type": "cluster"
  },
  ...
}
```

When you retrieve one action group, the response contains only that action group:

```json
{
  "custom_action_group": {
    "allowed_actions": [
      "indices:data/write/index*",
      "indices:data/write/update*",
      "indices:admin/mapping/put",
      "indices:data/write/bulk*",
      "read",
      "write"
    ],
    "hidden": false,
    "reserved": false,
    "static": false
  }
}
```
