---
layout: default
title: Permissions Info API
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 40
---

# Permissions Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the evaluated REST API permissions for the currently logged in user.

<!-- spec_insert_start
api: security.get_permissions_info
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/permissionsinfo
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.get_permissions_info
component: example_code
rest: GET /_plugins/_security/api/permissionsinfo
-->
{% capture step1_rest %}
GET /_plugins/_security/api/permissionsinfo
{% endcapture %}

{% capture step1_python %}

response = client.security.get_permissions_info()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_permissions_info
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `disabled_endpoints` | Object | An object with disabled APIs as keys and an array of HTTP methods as values. |
| `has_api_access` | Boolean |  |
| `user` | String |  |
| `user_name` | String |  |

<details markdown="block" name="security.get_permissions_info::response_body">
  <summary>
    Response body fields: <code>disabled_endpoints</code>
  </summary>
  {: .text-delta}

An object with disabled APIs as keys and an array of HTTP methods as values.

`disabled_endpoints` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Array of Strings |  |

</details>
<!-- spec_insert_end -->
