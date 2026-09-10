---
layout: default
title: Create User API
parent: Internal User APIs
grand_parent: Security APIs
nav_order: 30
---

# Create User API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified user. You must specify either `password` (plain text) or `hash` (the hashed user password). If you specify `password`, the Security plugin automatically hashes the password before storing it.

Note that any role you supply in the `opendistro_security_roles` array must already exist for the Security plugin to map the user to that role. To see predefined roles, refer to [the list of predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles). For instructions on how to create a role, refer to [creating a role](#create-role).

<!-- spec_insert_start
api: security.create_user
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/internalusers/{username}
{
  "password": "kirkpass",
  "opendistro_security_roles": ["maintenance_staff", "database_manager"],
  "backend_roles": ["role 1", "role 2"],
  "attributes": {
    "attribute1": "value1",
    "attribute2": "value2"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status":"CREATED",
  "message":"User kirk created"
}
```
