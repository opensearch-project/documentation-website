---
layout: default
title: Create Tenant API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 30
---

# Create Tenant API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified tenant.

<!-- spec_insert_start
api: security.create_tenant
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/tenants/{tenant}
{
  "description": "A tenant for the human resources team."
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"CREATED",
  "message":"tenant human_resources created"
}
```
