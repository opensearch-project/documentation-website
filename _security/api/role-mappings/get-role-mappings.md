---
layout: default
title: Get Role Mappings API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Role Mappings API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all role mappings.

<!-- spec_insert_start
api: security.get_role_mappings
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/rolesmapping
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/rolesmapping
```
{% include copy-curl.html %}

## Example response

```json
{
  "role_starfleet" : {
    "backend_roles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
    "hosts" : [ "*.starfleetintranet.com" ],
    "users" : [ "worf" ]
  }
}
```
