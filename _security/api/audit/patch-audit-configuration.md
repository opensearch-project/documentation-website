---
layout: default
title: Patch Audit Configuration API
parent: Audit Log APIs
grand_parent: Security APIs
nav_order: 30
---

# Patch Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

Updates the specified fields in the audit configuration.

<!-- spec_insert_start
api: security.patch_audit_configuration
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/audit
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.patch_audit_configuration
component: example_code
rest: PATCH /_plugins/_security/api/audit
-->
{% capture step1_rest %}
PATCH /_plugins/_security/api/audit
{% endcapture %}

{% capture step1_python %}


response = client.security.patch_audit_configuration(
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.patch_audit_configuration
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
