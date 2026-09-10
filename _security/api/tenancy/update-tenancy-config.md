---
layout: default
title: Create or update multi-tenancy configuration
parent: Multi-tenancy configuration APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update Multi-Tenancy Configuration API
**Introduced 2.7**
{: .label .label-purple }

Creates or replaces the multi-tenancy configuration.

<!-- spec_insert_start
api: security.create_update_tenancy_config
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/tenancy/config
```
<!-- spec_insert_end -->

## Request body fields

The request body is required and must contain at least one of the following fields. OpenSearch preserves the current value of any field that you omit and rejects any field that is not listed.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `multitenancy_enabled` | Boolean | Whether multi-tenancy is enabled. |
| `private_tenant_enabled` | Boolean | Whether users can use their private tenants. |
| `default_tenant` | String | The tenant that OpenSearch Dashboards opens by default. Must name one of the available tenants and cannot be an empty string. |
| `sign_in_options` | Array of Strings | The sign-in methods that OpenSearch Dashboards offers. Valid values are `BASIC`, `SAML`, `OPENID`, and `ANONYMOUS`. Each value must correspond to an authentication provider configured on the cluster. |
| `preferred_tenants` | Array of Strings | The tenants to list ahead of the others in the OpenSearch Dashboards tenant selector, in order of preference. |

## Example request

```json
PUT _plugins/_security/api/tenancy/config
{
  "multitenancy_enabled": true,
  "private_tenant_enabled": true,
  "default_tenant": "Global"
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "default_tenant": "Global",
  "private_tenant_enabled": true,
  "multitenancy_enabled": true,
  "sign_in_options": [],
  "preferred_tenants": []
}
```
