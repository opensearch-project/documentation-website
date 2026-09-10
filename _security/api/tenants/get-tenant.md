---
layout: default
title: Get Tenant API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Tenant API
**Introduced 1.0**
{: .label .label-purple }

Retrieves one tenant.

<!-- spec_insert_start
api: security.get_tenant
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/tenants/{tenant}
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/tenants/{tenant}
```
{% include copy-curl.html %}

## Example response

```json
{
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```
