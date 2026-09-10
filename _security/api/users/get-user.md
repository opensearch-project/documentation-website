---
layout: default
title: Get User API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 10
---

# Get User API
**Introduced 1.0**
{: .label .label-purple }

## Example request

```json
GET _plugins/_security/api/internalusers/{username}
```
{% include copy-curl.html %}

<!-- spec_insert_start
api: security.get_user
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/internalusers/{username}
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
