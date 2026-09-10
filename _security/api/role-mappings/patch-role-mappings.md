---
layout: default
title: Patch Role Mappings API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Role Mappings API
**Introduced 1.0**
{: .label .label-purple }

Creates or updates multiple role mappings in a single call.

<!-- spec_insert_start
api: security.patch_role_mappings
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/rolesmapping
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/rolesmapping
[
  {
    "op": "add", "path": "/human_resources", "value": { "users": ["user1"], "backend_roles": ["backendrole2"] }
  },
  {
    "op": "add", "path": "/finance", "value": { "users": ["user2"], "backend_roles": ["backendrole2"] }
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```

---
