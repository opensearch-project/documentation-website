---
layout: default
title: Reload HTTP Certificates API
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 50
---

# Reload HTTP Certificates API
**Introduced 2.8**
{: .label .label-purple }

Reloads the HTTP communication certificates.

<!-- spec_insert_start
api: security.reload_http_certificates
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/ssl/http/reloadcerts
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.reload_http_certificates
component: example_code
rest: PUT /_plugins/_security/api/ssl/http/reloadcerts
-->
{% capture step1_rest %}
PUT /_plugins/_security/api/ssl/http/reloadcerts
{% endcapture %}

{% capture step1_python %}

response = client.security.reload_http_certificates()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.reload_http_certificates
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
