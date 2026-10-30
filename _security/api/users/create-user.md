---
layout: default
title: Create or update user
parent: Internal user APIs
grand_parent: Security APIs
nav_order: 10
---

# Create or Update User API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified user. You must specify either `password` (plain text) or `hash` (the hashed user password). If you specify `password`, the Security plugin automatically hashes the password before storing it.

Note that any role you supply in the `opendistro_security_roles` array must already exist for the Security plugin to map the user to that role. To see predefined roles, refer to [the list of predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles). For instructions on how to create a role, see [Create or Update Role API]({{site.url}}{{site.baseurl}}/security/api/roles/create-role/).

<!-- spec_insert_start
api: security.create_user
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/internalusers/{username}
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `password` | String | The user's password in plain text. The Security plugin hashes the password before storing it. Required unless you specify `hash`. | No |
| `hash` | String | The hash of the user's password. Use this field to supply a password that you hashed yourself. Required unless you specify `password`. | No |
| `backend_roles` | Array of strings | The backend roles assigned to the user. Role mappings use backend roles to determine the user's security roles. | No |
| `opendistro_security_roles` | Array of strings | The security roles mapped directly to the user. Each role must already exist. | No |
| `attributes` | Object | Custom name-value pairs associated with the user. Use them in document-level security queries and role mappings. | No |
| `description` | String | A description of the user. | No |
| `hidden` | Boolean | Whether the user is hidden from the API and OpenSearch Dashboards. Default is `false`. | No |
| `reserved` | Boolean | Whether the user is read-only and cannot be modified. Default is `false`. | No |

## Example request

```json
PUT _plugins/_security/api/internalusers/kirk
{
  "password": "Str0ngPassw0rd_9182!",
  "opendistro_security_roles": [
    "maintenance_staff",
    "database_manager"
  ],
  "backend_roles": [
    "captain",
    "starfleet"
  ],
  "attributes": {
    "attribute1": "value1",
    "attribute2": "value2"
  }
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "CREATED",
  "message": "'kirk' created."
}
```
