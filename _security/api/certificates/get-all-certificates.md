---
layout: default
title: Get All Certificates API
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 20
---

# Get All Certificates API
**Introduced 2.15**
{: .label .label-purple }

Retrieves the cluster security certificates.

<!-- spec_insert_start
api: security.get_all_certificates
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/certificates
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_all_certificates
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cert_type` | String | The type of certificates (`HTTP`, `TRANSPORT`, or `ALL`) to retrieve from all nodes. |
| `timeout` | String | The maximum duration, in seconds, to spend retrieving certificates from all nodes before a timeout. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.get_all_certificates
component: example_code
rest: GET /_plugins/_security/api/certificates
-->
{% capture step1_rest %}
GET /_plugins/_security/api/certificates
{% endcapture %}

{% capture step1_python %}

response = client.security.get_all_certificates()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
