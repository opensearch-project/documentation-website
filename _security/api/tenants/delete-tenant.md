---
layout: default
title: Delete Tenant API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 60
---

# Delete Tenant API
**Introduced 1.0**
{: .label .label-purple }

Deletes the specified tenant.

<!-- spec_insert_start
api: security.delete_tenant
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Example request

```json
DELETE _plugins/_security/api/tenants/{tenant}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"OK",
  "message":"tenant human_resources deleted."
}
```
