---
layout: default
title: Get Node Certificates API
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Node Certificates API
**Introduced 2.15**
{: .label .label-purple }

Retrieves the specified node's security certificates.

<!-- spec_insert_start
api: security.get_node_certificates
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/certificates/{node_id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_node_certificates
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `node_id` | **Required** | String | The node ID to retrieve certificates for. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_node_certificates
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cert_type` | String | The type of certificates (`HTTP`, `TRANSPORT`, or `ALL`) to retrieve from a node. |
| `timeout` | String | The maximum duration, in seconds, to spend retrieving certificates from all nodes before a timeout. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.get_node_certificates
component: example_code
rest: GET /_plugins/_security/api/certificates/{node_id}
-->
{% capture step1_rest %}
GET /_plugins/_security/api/certificates/{node_id}
{% endcapture %}

{% capture step1_python %}


response = client.security.get_node_certificates(
  node_id = "{node_id}"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
