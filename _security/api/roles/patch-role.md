---
layout: default
title: Patch Role API
parent: Role APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch Role API
**Introduced 1.0**
{: .label .label-purple }

Updates individual attributes of a role.

<!-- spec_insert_start
api: security.patch_role
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/roles/{role}
[
  {
    "op": "replace", "path": "/index_permissions/0/fls", "value": ["myfield1", "myfield2"]
  },
  {
    "op": "remove", "path": "/index_permissions/0/dls"
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'<role>' updated."
}
```
