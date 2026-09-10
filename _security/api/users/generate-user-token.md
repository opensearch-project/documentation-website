---
layout: default
title: Generate User Token API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 70
---

# Generate User Token API
**Introduced 2.7**
{: .label .label-purple }

Generates an authorization token for the specified user.

<!-- spec_insert_start
api: security.generate_user_token
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/internalusers/{username}/authtoken
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_user_token
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `username` | **Required** | String | The name of the user for whom to issue an authorization token. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.generate_user_token
component: example_code
rest: POST /_plugins/_security/api/internalusers/{username}/authtoken
-->
{% capture step1_rest %}
POST /_plugins/_security/api/internalusers/{username}/authtoken
{% endcapture %}

{% capture step1_python %}


response = client.security.generate_user_token(
  username = "{username}"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.generate_user_token
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
