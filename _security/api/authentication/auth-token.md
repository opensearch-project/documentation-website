---
layout: default
title: Auth Token API
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 60
---

# Auth Token API
**Introduced 1.0**
{: .label .label-purple }

Returns the authorization token for the current user.

<!-- spec_insert_start
api: security.authtoken
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/authtoken
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.authtoken
component: example_code
rest: POST /_plugins/_security/api/authtoken
-->
{% capture step1_rest %}
POST /_plugins/_security/api/authtoken
{% endcapture %}

{% capture step1_python %}

response = client.security.authtoken()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.authtoken
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
