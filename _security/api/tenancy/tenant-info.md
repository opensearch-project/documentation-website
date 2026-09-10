---
layout: default
title: Tenant Info API
parent: Tenancy Configuration APIs
grand_parent: Security APIs
nav_order: 30
---

# Tenant Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the names of current tenants. Requires super admin or `kibanaserver` permissions.

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

<!-- spec_insert_start
api: security.tenant_info
component: example_code
rest: GET /_plugins/_security/tenantinfo
-->
{% capture step1_rest %}
GET /_plugins/_security/tenantinfo
{% endcapture %}

{% capture step1_python %}

response = client.security.tenant_info()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
