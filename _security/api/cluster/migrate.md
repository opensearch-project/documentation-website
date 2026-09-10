---
layout: default
title: Migrate API
parent: Cluster Utility APIs
grand_parent: Security APIs
nav_order: 30
---

# Migrate API
**Introduced 1.0**
{: .label .label-purple }

Migrates the security configuration from v6 to v7.

<!-- spec_insert_start
api: security.migrate
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/migrate
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.migrate
component: example_code
rest: POST /_plugins/_security/api/migrate
-->
{% capture step1_rest %}
POST /_plugins/_security/api/migrate
{% endcapture %}

{% capture step1_python %}

response = client.security.migrate()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.migrate
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
