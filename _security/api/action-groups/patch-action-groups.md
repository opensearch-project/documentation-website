---
layout: default
title: Patch Action Groups API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Action Groups API
**Introduced 1.0**
{: .label .label-purple }

Creates, updates, or deletes multiple action groups in a single call.

<!-- spec_insert_start
api: security.patch_action_groups
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/actiongroups
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/actiongroups
[
  {
    "op": "add", "path": "/CREATE_INDEX", "value": { "allowed_actions": ["indices:admin/create", "indices:admin/mapping/put"] }
  },
  {
    "op": "remove", "path": "/CRUD"
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


---
