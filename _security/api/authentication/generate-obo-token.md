---
layout: default
title: Generate On-Behalf-Of Token API
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 70
---

# Generate On-Behalf-Of Token API
**Introduced 2.12**
{: .label .label-purple }

Generates a `On-Behalf-Of` token for the current user.

<!-- spec_insert_start
api: security.generate_obo_token
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/generateonbehalfoftoken
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_obo_token
component: request_body_parameters
-->
## Request body fields

The request body is __required__. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `description` | **Required** | String | The description supplied by the user to describe the token. |
| `duration` | _Optional_ | String | A duration in seconds. |
| `service` | _Optional_ | String | The name of the service when generating a token for that service. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.generate_obo_token
component: example_code
rest: POST /_plugins/_security/api/generateonbehalfoftoken
-->
{% capture step1_rest %}
POST /_plugins/_security/api/generateonbehalfoftoken
{% endcapture %}

{% capture step1_python %}


response = client.security.generate_obo_token(
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_obo_token
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `authenticationToken` | String | The generated OBO token. | N/A |
| `durationSeconds` | String | The duration of the token. | `300s` |
| `user` | String | The name of the entity requesting token. | N/A |

<!-- spec_insert_end -->
