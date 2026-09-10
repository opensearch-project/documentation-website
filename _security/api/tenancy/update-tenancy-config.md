---
layout: default
title: Update Tenancy Configuration API
parent: Tenancy Configuration APIs
grand_parent: Security APIs
nav_order: 20
---

# Update Tenancy Configuration API
**Introduced 2.7**
{: .label .label-purple }

Creates or replaces the multi-tenancy configuration. Requires super admin or REST API permissions.

<!-- spec_insert_start
api: security.create_update_tenancy_config
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/tenancy/config
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.create_update_tenancy_config
component: request_body_parameters
-->
## Request body fields

The request body is __required__. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `default_tenant` | String |  |
| `multitenancy_enabled` | Boolean |  |
| `private_tenant_enabled` | Boolean |  |
| `sign_in_options` | Array of Strings |  |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.create_update_tenancy_config
component: example_code
rest: PUT /_plugins/_security/api/tenancy/config
-->
{% capture step1_rest %}
PUT /_plugins/_security/api/tenancy/config
{% endcapture %}

{% capture step1_python %}


response = client.security.create_update_tenancy_config(
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
