---
layout: default
title: Patch Role Mapping API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch Role Mapping API
**Introduced 1.0**
{: .label .label-purple }

Updates individual attributes of a role mapping.

<!-- spec_insert_start
api: security.patch_role_mapping
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/rolesmapping/{role}
[
  {
    "op": "replace", "path": "/users", "value": ["myuser"]
  },
  {
    "op": "replace", "path": "/backend_roles", "value": ["mybackendrole"]
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'my-role' updated."
}
```
