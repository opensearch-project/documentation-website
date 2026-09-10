---
layout: default
title: Create Action Group API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 30
---

# Create Action Group API
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

## Example request

```json
PUT _plugins/_security/api/actiongroups/{action-group}
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
{% include copy-curl.html %}

## Example response

```json
{
  "status": "CREATED",
  "message": "'my-action-group' created."
}
```
