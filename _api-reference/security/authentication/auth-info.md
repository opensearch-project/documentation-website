---
layout: default
title: Authentication Information API
grand_parent: Security APIs
parent: Authentication APIs
nav_order: 10
---

# Authentication Information API
**Introduced 1.0**
{: .label .label-purple }

The Authentication Information API returns information about the currently authenticated user. This includes the user's name, roles, backend roles, custom attributes, and tenant memberships. This API is useful for debugging authentication issues, verifying user permissions, and building applications that need to understand the current user's access levels.

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

The following table lists the available query parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `auth_type` | String | The type of the current authentication request. |
| `verbose` | Boolean | Whether to return a verbose response. |

<!-- spec_insert_end -->

## Example request

The following example request retrieves authentication information for the currently authenticated user:

```bash
GET /_plugins/_security/authinfo
```
{% include copy-curl.html %}

To get verbose information:

```bash
GET /_plugins/_security/authinfo?verbose=true
```
{% include copy-curl.html %}

## Example response

```json
{
  "user": "User [name=admin, backend_roles=[admin], requestedTenant=null]",
  "user_name": "admin",
  "backend_roles": [
    "admin"
  ],
  "roles": [
    "all_access",
    "security_rest_api_access"
  ],
  "tenants": {
    "admin": true,
    "global_tenant": true
  },
  "principal": null,
  "peer_certificates": "0",
  "sso_logout_url": null,
  "remote_address": "127.0.0.1:54013"
}
```

For a verbose response, additional fields are included:

```json
{
  "user": "User [name=admin, backend_roles=[admin], requestedTenant=null]",
  "user_name": "admin",
  "backend_roles": [
    "admin"
  ],
  "custom_attribute_names": [],
  "roles": [
    "all_access",
    "security_rest_api_access"
  ],
  "tenants": {
    "admin": true,
    "global_tenant": true
  },
  "principal": null,
  "peer_certificates": "0",
  "sso_logout_url": null,
  "remote_address": "127.0.0.1:54013",
  "size_of_user": "115",
  "size_of_backendroles": "28",
  "size_of_custom_attributes": "2",
  "user_requested_tenant": null
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
| `principal` |  String | The user's authentication principal, if available. |
| `peer_certificates` | String | The number of peer certificates related to the user's authentication. |
| `sso_logout_url` | String | The logout URL for single sign-on (SSO) authentication, if applicable. |
| `remote_address` | String | The IP address and port of the client making the request. |

When requesting a verbose response, the following additional fields are included.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `custom_attribute_names` | Array of strings | The names of any custom attributes associated with the user. |
| `size_of_user` | String | The size of the user object in memory, in bytes. |
| `size_of_backendroles` | String | The size of the user's backend roles, in bytes. |
| `size_of_custom_attributes` | String | The size of the user's custom attributes, in bytes. |
| `user_requested_tenant` |  String | The name of the tenant the user has requested to switch to, if any. |