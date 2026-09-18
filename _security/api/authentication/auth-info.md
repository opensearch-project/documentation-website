---
layout: default
title: Authentication information
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 10
redirect_from:
  - /api-reference/security/authentication/auth-info/
---

# Authentication Information API
**Introduced 1.0**
{: .label .label-purple }

Returns information about the currently authenticated user, including the user's name, roles, backend roles, custom attributes, and tenant memberships. Use it to debug authentication problems or to confirm the permissions that a user holds.

<!-- spec_insert_start
api: security.authinfo
component: endpoints
-->
## Endpoints
```json
GET  /_plugins/_security/authinfo
POST /_plugins/_security/authinfo
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.authinfo
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `auth_type` | String | The type of the current authentication request. |
| `verbose` | Boolean | Whether to return a verbose response. |

<!-- spec_insert_end -->

## Example request

The following example request retrieves authentication information for the currently authenticated user:

```json
GET /_plugins/_security/authinfo
```
{% include copy-curl.html security=true %}

The following example request retrieves verbose authentication information:

```json
GET /_plugins/_security/authinfo?verbose=true
```
{% include copy-curl.html security=true %}

## Example response

The default response describes the user, their roles, and their tenants:

```json
{
  "user": "User [name=admin, backend_roles=[admin], requestedTenant=null]",
  "user_name": "admin",
  "user_requested_tenant": null,
  "remote_address": "192.168.65.1:21728",
  "backend_roles": [
    "admin"
  ],
  "custom_attribute_names": [],
  "roles": [
    "all_access"
  ],
  "tenants": {
    "global_tenant": true,
    "admin_tenant": true,
    "admin": true
  },
  "principal": null,
  "peer_certificates": "0",
  "sso_logout_url": null
}
```

A verbose response adds the size fields:

```json
{
  "user": "User [name=admin, backend_roles=[admin], requestedTenant=null]",
  "user_name": "admin",
  "user_requested_tenant": null,
  "remote_address": "192.168.65.1:48870",
  "backend_roles": [
    "admin"
  ],
  "custom_attribute_names": [],
  "roles": [
    "all_access"
  ],
  "tenants": {
    "global_tenant": true,
    "admin_tenant": true,
    "admin": true
  },
  "principal": null,
  "peer_certificates": "0",
  "sso_logout_url": null,
  "size_of_user": "928 bytes",
  "size_of_custom_attributes": "112 bytes",
  "size_of_backendroles": "84 bytes"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `user` | String | A string representation of the user object, including the username and backend roles. |
| `user_name` | String | The username of the authenticated user. |
| `backend_roles` | Array of strings | The backend roles associated with the user, typically obtained from an external authentication system. |
| `roles` | Array of strings | The OpenSearch Security roles assigned to the user, determining their permissions. |
| `tenants` | Object | The tenants the user has access to, with `true` indicating read-write access and `false` indicating read-only access. |
| `principal` | String | The user's authentication principal, if available. |
| `peer_certificates` | String | The number of peer certificates related to the user's authentication. |
| `sso_logout_url` | String | The logout URL for single sign-on (SSO) authentication, if applicable. |
| `remote_address` | String | The IP address and port of the client making the request. |
| `custom_attribute_names` | Array of strings | The names of any custom attributes associated with the user. |
| `user_requested_tenant` | String | The name of the tenant the user has requested to switch to, if any. |

When requesting a verbose response, the following additional fields are included.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `size_of_user` | String | The size of the user object in memory. |
| `size_of_backendroles` | String | The size of the user's backend roles. |
| `size_of_custom_attributes` | String | The size of the user's custom attributes. |
