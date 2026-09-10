---
layout: default
title: Get Action Groups API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Action Groups API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all action groups.

<!-- spec_insert_start
api: security.get_action_groups
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/actiongroups
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/actiongroups/
```
{% include copy-curl.html %}

## Example response

```json
{
  "read": {
    "reserved": true,
    "hidden": false,
    "allowed_actions": [
      "indices:data/read*",
      "indices:admin/mappings/fields/get*",
      "indices:admin/resolve/index"
    ],
    "type": "index",
    "description": "Allow all read operations",
    "static": true
  },
  "cluster_all": {
    "reserved": true,
    "hidden": false,
    "allowed_actions": [
      "cluster:*"
    ],
    "type": "cluster",
    "description": "Allow everything on cluster level",
    "static": true
  },
  ...
}
```
