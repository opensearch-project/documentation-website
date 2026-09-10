---
layout: default
title: Validate API
parent: Cluster Utility APIs
grand_parent: Security APIs
nav_order: 20
---

# Validate API
**Introduced 1.0**
{: .label .label-purple }

Checks whether the v6 security configuration is valid and ready to be migrated to v7.

<!-- spec_insert_start
api: security.validate
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/validate
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.validate
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `accept_invalid` | Boolean | Whether an invalid v6 configuration should be allowed. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.validate
component: example_code
rest: GET /_plugins/_security/api/validate
-->
{% capture step1_rest %}
GET /_plugins/_security/api/validate
{% endcapture %}

{% capture step1_python %}

response = client.security.validate()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.validate
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
