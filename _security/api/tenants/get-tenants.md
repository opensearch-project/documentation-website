---
layout: default
title: Get Tenants API
parent: Tenant APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Tenants API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all tenants.

<!-- spec_insert_start
api: security.get_tenants
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/tenants
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/tenants/
```
{% include copy-curl.html %}

## Example response

```json
{
  "global_tenant": {
    "reserved": true,
    "hidden": false,
    "description": "Global tenant",
    "static": true
  },
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```
