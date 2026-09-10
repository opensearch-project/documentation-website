---
layout: default
title: Get Users API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Users API
**Introduced 1.0**
{: .label .label-purple }

## Example request

```json
GET _plugins/_security/api/internalusers/
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.get_users
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/internalusers
```
<!-- spec_insert_end -->

## Example response

```json
{
  "kirk": {
    "hash": "",
    "roles": [ "captains", "starfleet" ],
    "attributes": {
       "attribute1": "value1",
       "attribute2": "value2",
    }
  }
}
```
