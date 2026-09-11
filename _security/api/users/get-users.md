---
layout: default
title: Get users
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Users API
**Introduced 1.0**
{: .label .label-purple }

Retrieves internal users. Specify a user name to retrieve one user, or omit the user name to retrieve all internal users.

<!-- spec_insert_start
api: security.get_users
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/internalusers
```
<!-- spec_insert_end -->
<!-- spec_insert_start
api: security.get_user
component: endpoints
omit_header: true
-->
```json
GET /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | No | The name of the user to retrieve. If omitted, all internal users are returned. |

## Example request

The following request retrieves all internal users:

```json
GET _plugins/_security/api/internalusers
```
{% include copy-curl.html security=true %}

The following request retrieves the `kirk` user:

```json
GET _plugins/_security/api/internalusers/kirk
```
{% include copy-curl.html security=true %}

## Example response

The response lists every internal user. It is abbreviated here:

```json
{
  "logstash": {
    "attributes": {},
    "backend_roles": [
      "logstash"
    ],
    "description": "Demo logstash user, using external role mapping",
    "hash": "",
    "hidden": false,
    "opendistro_security_roles": [],
    "reserved": false,
    "static": false
  },
  "snapshotrestore": {
    "attributes": {},
    "backend_roles": [
      "snapshotrestore"
    ],
    "description": "Demo snapshotrestore user, using external role mapping",
    "hash": "",
    "hidden": false,
    "opendistro_security_roles": [],
    "reserved": false,
    "static": false
  },
  "admin": {
    "attributes": {},
    "backend_roles": [
      "admin"
    ],
    "description": "Demo admin user",
    "hash": "",
    "hidden": false,
    "opendistro_security_roles": [],
    "reserved": true,
    "static": false
  },
  ...
}
```

The response to a request for one user contains only that user:

```json
{
  "kirk": {
    "attributes": {
      "attribute1": "value1",
      "attribute2": "value2"
    },
    "backend_roles": [
      "captain",
      "starfleet"
    ],
    "hash": "",
    "hidden": false,
    "opendistro_security_roles": [
      "maintenance_staff",
      "database_manager"
    ],
    "reserved": false,
    "static": false
  }
}
```
