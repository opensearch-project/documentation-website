---
layout: default
title: Who Am I Protected API
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 30
---

# Who Am I Protected API
**Introduced 2.11**
{: .label .label-purple }

Gets the identity information for the user currently logged in. To use this operation, you must have access to this endpoint when authorization at REST layer is enabled.

<!-- spec_insert_start
api: security.who_am_i_protected
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/whoamiprotected
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.who_am_i_protected
component: example_code
rest: GET /_plugins/_security/whoamiprotected
-->
{% capture step1_rest %}
GET /_plugins/_security/whoamiprotected
{% endcapture %}

{% capture step1_python %}

response = client.security.who_am_i_protected()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
