---
layout: default
title: Permissions info
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 40
---

# Permissions Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the evaluated REST API permissions for the current user.

<!-- spec_insert_start
api: security.get_permissions_info
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/permissionsinfo
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/permissionsinfo
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "user": "User [name=admin, backend_roles=[admin], requestedTenant=null]",
  "user_name": "admin",
  "has_api_access": true,
  "disabled_endpoints": {}
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `user` | String | A string representation of the current user, including the user name, backend roles, and requested tenant. |
| `user_name` | String | The name of the current user. |
| `has_api_access` | Boolean | Whether the current user can call the Security APIs. |
| `disabled_endpoints` | Object | The Security API endpoints that are disabled for the current user. Each key is an endpoint name and each value is the list of HTTP methods disabled for it. The object is empty when no endpoints are disabled. |
