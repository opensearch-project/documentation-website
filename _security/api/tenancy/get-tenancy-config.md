---
layout: default
title: Get Tenancy Configuration API
parent: Tenancy Configuration APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Tenancy Configuration API
**Introduced 2.7**
{: .label .label-purple }

Retrieves the multi-tenancy configuration. Requires super admin or REST API permissions.

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

<!-- spec_insert_start
api: security.get_tenancy_config
component: example_code
rest: GET /_plugins/_security/api/tenancy/config
-->
{% capture step1_rest %}
GET /_plugins/_security/api/tenancy/config
{% endcapture %}

{% capture step1_python %}

response = client.security.get_tenancy_config()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
