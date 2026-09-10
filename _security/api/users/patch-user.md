---
layout: default
title: Patch User API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch User API
**Introduced 1.0**
{: .label .label-purple }

Updates individual attributes of an internal user.

<!-- spec_insert_start
api: security.patch_user
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/internalusers/{username}
[
  {
    "op": "replace", "path": "/backend_roles", "value": ["klingons"]
  },
  {
    "op": "replace", "path": "/opendistro_security_roles", "value": ["ship_manager"]
  },
  {
    "op": "replace", "path": "/attributes", "value": { "newattribute": "newvalue" }
  }
]
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'kirk' updated."
}
```
