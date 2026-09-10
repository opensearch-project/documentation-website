---
layout: default
title: Get Audit Configuration API
parent: Audit Log APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the audit configuration.

<!-- spec_insert_start
api: security.get_audit_configuration
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/audit
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.get_audit_configuration
component: example_code
rest: GET /_plugins/_security/api/audit
-->
{% capture step1_rest %}
GET /_plugins/_security/api/audit
{% endcapture %}

{% capture step1_python %}

response = client.security.get_audit_configuration()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
