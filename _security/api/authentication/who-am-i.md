---
layout: default
title: Who Am I API
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 20
---

# Who Am I API
**Introduced 2.0**
{: .label .label-purple }

Gets the identity information for the user currently logged in.

<!-- spec_insert_start
api: security.who_am_i
component: endpoints
-->
## Endpoints
```json
GET  /_plugins/_security/whoami
POST /_plugins/_security/whoami
```
<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.who_am_i
component: example_code
rest: GET /_plugins/_security/whoami
-->
{% capture step1_rest %}
GET /_plugins/_security/whoami
{% endcapture %}

{% capture step1_python %}

response = client.security.who_am_i()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
