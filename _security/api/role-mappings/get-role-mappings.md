---
layout: default
title: Get role mappings
parent: Role mapping APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Role Mappings API
**Introduced 1.0**
{: .label .label-purple }

Retrieves role mappings. Specify a role name to retrieve the mapping for one role, or omit the role name to retrieve all role mappings.

<!-- spec_insert_start
api: security.get_role_mappings
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/rolesmapping
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_role_mapping
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/rolesmapping/{role}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | String | No | The name of the role whose mapping you want to retrieve. If omitted, all role mappings are returned. |

## Example request

The following request retrieves all role mappings:

```json
GET _plugins/_security/api/rolesmapping
```
{% include copy-curl.html security=true %}

The following request retrieves the mapping for the `role_starfleet` role:

```json
GET _plugins/_security/api/rolesmapping/role_starfleet
```
{% include copy-curl.html security=true %}

## Example response

The response is abbreviated here:

```json
{
  "manage_snapshots": {
    "and_backend_roles": [],
    "backend_roles": [
      "snapshotrestore"
    ],
    "hidden": false,
    "hosts": [],
    "reserved": false,
    "users": []
  },
  "logstash": {
    "and_backend_roles": [],
    "backend_roles": [
      "logstash"
    ],
    "hidden": false,
    "hosts": [],
    "reserved": false,
    "users": []
  },
  "kibana_user": {
    "and_backend_roles": [],
    "backend_roles": [
      "kibanauser"
    ],
    "description": "Maps kibanauser to kibana_user",
    "hidden": false,
    "hosts": [],
    "reserved": false,
    "users": []
  },
  ...
}
```

The response to a request for one role mapping contains only that mapping:

```json
{
  "role_starfleet": {
    "and_backend_roles": [],
    "backend_roles": [
      "starfleet",
      "captains",
      "defectors",
      "cn=ldaprole,ou=groups,dc=example,dc=com"
    ],
    "hidden": false,
    "hosts": [
      "*.starfleetintranet.com"
    ],
    "reserved": false,
    "users": [
      "worf"
    ]
  }
}
```
