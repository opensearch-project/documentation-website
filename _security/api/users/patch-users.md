---
layout: default
title: Patch Users API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Users API
**Introduced 1.0**
{: .label .label-purple }

Creates, updates, or deletes multiple internal users in a single call.

<!-- spec_insert_start
api: security.patch_users
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/internalusers
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/internalusers
[
  {
    "op": "add", "path": "/spock", "value": { "password": "testpassword1", "backend_roles": ["testrole1"] }
  },
  {
    "op": "add", "path": "/worf", "value": { "password": "testpassword2", "backend_roles": ["testrole2"] }
  },
  {
    "op": "remove", "path": "/riker"
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
