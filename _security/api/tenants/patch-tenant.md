---
layout: default
title: Patch Tenant API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch Tenant API
**Introduced 1.0**
{: .label .label-purple }

Add, delete, or modify a single tenant.

<!-- spec_insert_start
api: security.patch_tenant
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/tenants/{tenant}
[
  {
    "op": "replace", "path": "/description", "value": "An updated description"
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
