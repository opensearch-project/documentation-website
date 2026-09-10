---
layout: default
title: Patch Tenants API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 50
---

# Patch Tenants API
**Introduced 1.0**
{: .label .label-purple }

Add, delete, or modify multiple tenants in a single call.

<!-- spec_insert_start
api: security.patch_tenants
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/tenants
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/tenants/
[
  {
    "op": "replace",
    "path": "/human_resources/description",
    "value": "An updated description"
  },
  {
    "op": "add",
    "path": "/another_tenant",
    "value": {
      "description": "Another description."
    }
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
