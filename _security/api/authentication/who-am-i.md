---
layout: default
title: Who am I
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 20
---

# Who Am I API
**Introduced 2.0**
{: .label .label-purple }

Returns the identity information for the current user.

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

```json
GET _plugins/_security/whoami
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "dn": null,
  "is_admin": false,
  "is_node_certificate_request": false
}
```
