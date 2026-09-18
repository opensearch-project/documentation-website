---
layout: default
title: Get multi-tenancy configuration
parent: Multi-tenancy configuration APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Multi-Tenancy Configuration API
**Introduced 2.7**
{: .label .label-purple }

Retrieves the multi-tenancy configuration.

<!-- spec_insert_start
api: security.get_tenancy_config
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/tenancy/config
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/tenancy/config
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "default_tenant": "",
  "private_tenant_enabled": true,
  "multitenancy_enabled": true,
  "sign_in_options": [],
  "preferred_tenants": []
}
```
