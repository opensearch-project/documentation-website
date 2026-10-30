---
layout: default
title: Who am I protected
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 30
---

# Who Am I Protected API
**Introduced 2.11**
{: .label .label-purple }

Returns the identity information for the current user. Unlike the Who Am I API, this endpoint is subject to REST layer authorization, so the user's role must grant access to it.

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

```json
GET _plugins/_security/whoamiprotected
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
