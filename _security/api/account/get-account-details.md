---
layout: default
title: Get account details
parent: Account APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Account Details API
**Introduced 1.0**
{: .label .label-purple }

Returns account details for the current user. For example, if you sign the request as the `admin` user, the response includes details for that user.

<!-- spec_insert_start
api: security.get_account_details
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/account
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/account
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "user_name": "admin",
  "is_reserved": true,
  "is_hidden": false,
  "is_internal_user": true,
  "user_requested_tenant": null,
  "backend_roles": [
    "admin"
  ],
  "custom_attribute_names": [],
  "tenants": {
    "global_tenant": true,
    "admin_tenant": true,
    "admin": true
  },
  "roles": [
    "all_access"
  ]
}
```
