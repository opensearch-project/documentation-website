---
layout: default
title: Patch Action Group API
parent: Action Group APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch Action Group API
**Introduced 1.0**
{: .label .label-purple }

Updates individual attributes of an action group.

<!-- spec_insert_start
api: security.patch_action_group
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/actiongroups/{action_group}
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/actiongroups/{action-group}
[
  {
    "op": "replace", "path": "/allowed_actions", "value": ["indices:admin/create", "indices:admin/mapping/put"]
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
