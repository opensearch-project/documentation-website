---
layout: default
title: Post Dashboards Info API
parent: Dashboards Info APIs
grand_parent: Security APIs
nav_order: 20
---

# Post Dashboards Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the current values for dynamic security settings for OpenSearch Dashboards.

<!-- spec_insert_start
api: security.post_dashboards_info
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/dashboardsinfo
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.post_dashboards_info
component: example_code
rest: POST /_plugins/_security/dashboardsinfo
-->
{% capture step1_rest %}
POST /_plugins/_security/dashboardsinfo
{% endcapture %}

{% capture step1_python %}

response = client.security.post_dashboards_info()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.post_dashboards_info
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `default_tenant` | String | The default tenant setting for the dashboard. |
| `multitenancy_enabled` | Boolean | Indicates whether multi-tenancy is enabled. |
| `not_fail_on_forbidden_enabled` | Boolean | Indicates whether `DNFOF` is enabled. |
| `opensearch_dashboards_index` | String | The name of the dashboard's index. |
| `opensearch_dashboards_mt_enabled` | Boolean | Indicates whether multi-tenancy is enabled. |
| `opensearch_dashboards_server_user` | String | The name of the user used to connect dashboard's to the server. |
| `password_validation_error_message` | String | The error message when a password validation fails. |
| `password_validation_regex` | String | The regular expression used perform password validation. |
| `private_tenant_enabled` | Boolean | Indicates whether a private tenant is enabled for all users. |
| `sign_in_options` | Array of Strings | A list of available sign-in options. |
| `user_name` | String | User's name |

<!-- spec_insert_end -->
