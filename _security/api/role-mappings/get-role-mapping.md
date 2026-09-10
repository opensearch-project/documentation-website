---
layout: default
title: Get Role Mapping API
parent: Role Mapping APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Role Mapping API
**Introduced 1.0**
{: .label .label-purple }

Retrieves one role mapping.

<!-- spec_insert_start
api: security.get_role_mapping
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/rolesmapping/{role}
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
