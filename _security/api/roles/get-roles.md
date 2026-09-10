---
layout: default
title: Get Roles API
parent: Role APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Roles API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all roles.

<!-- spec_insert_start
api: security.get_roles
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/roles
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/roles/
```
{% include copy-curl.html %}

## Example response

```json
{
  "manage_snapshots": {
    "reserved": true,
    "hidden": false,
    "description": "Provide the minimum permissions for managing snapshots",
    "cluster_permissions": [
      "manage_snapshots"
    ],
    "index_permissions": [{
      "index_patterns": [
        "*"
      ],
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "indices:data/write/index",
        "indices:admin/create"
      ]
    }],
    "tenant_permissions": [],
    "static": true
  },
  ...
}
```
