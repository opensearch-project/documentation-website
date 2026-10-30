---
layout: default
title: Tenant info
parent: Multi-tenancy configuration APIs
grand_parent: Security APIs
nav_order: 30
---

# Tenant Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the index names that back the current tenants.

This API is reserved for a superadmin or the `kibanaserver` user. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.tenant_info
component: endpoints
-->
## Endpoints
```json
GET  /_plugins/_security/tenantinfo
POST /_plugins/_security/tenantinfo
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/tenantinfo
```
{% include copy-curl.html security=true %}

## Example response

The response maps each tenant index to the tenant it belongs to. It is empty until a tenant index is created:

```json
{}
```
