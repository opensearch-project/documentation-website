---
layout: default
title: Dashboards info
parent: Security APIs
nav_order: 160
redirect_from:
  - /security/api/dashboards-info/get-dashboards-info/
  - /security/api/dashboards-info/post-dashboards-info/
---

# Dashboards Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the current values for dynamic security settings for OpenSearch Dashboards.

## Endpoints

```json
GET  /_plugins/_security/dashboardsinfo
POST /_plugins/_security/dashboardsinfo
```

Both methods take no request body and return the same response.

## Example request

```json
GET _plugins/_security/dashboardsinfo
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "user_name": "admin",
  "not_fail_on_forbidden_enabled": false,
  "opensearch_dashboards_mt_enabled": true,
  "opensearch_dashboards_index": ".kibana",
  "opensearch_dashboards_server_user": "kibanaserver",
  "multitenancy_enabled": true,
  "preferred_tenants": [],
  "private_tenant_enabled": true,
  "default_tenant": "Global",
  "sign_in_options": [],
  "password_validation_error_message": "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
  "password_validation_regex": "(?=.*[A-Z])(?=.*[^a-zA-Z\\d])(?=.*[0-9])(?=.*[a-z]).{8,}",
  "resource_sharing_enabled": false,
  "api_tokens_enabled": false,
  "max_duration_seconds": 7776000
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `user_name` | String | The name of the current user. |
| `not_fail_on_forbidden_enabled` | Boolean | Whether OpenSearch omits the results that a user cannot access from a search response rather than returning an error. |
| `multitenancy_enabled` | Boolean | Whether multi-tenancy is enabled. |
| `opensearch_dashboards_mt_enabled` | Boolean | Whether multi-tenancy is enabled for OpenSearch Dashboards. |
| `opensearch_dashboards_index` | String | The name of the index in which OpenSearch Dashboards stores its saved objects. |
| `opensearch_dashboards_server_user` | String | The name of the user that OpenSearch Dashboards uses to connect to OpenSearch. |
| `default_tenant` | String | The tenant that OpenSearch Dashboards opens by default. |
| `private_tenant_enabled` | Boolean | Whether users can use their private tenants. |
| `preferred_tenants` | Array of Strings | The tenants to list ahead of the others in the tenant selector, in order of preference. |
| `sign_in_options` | Array of Strings | The sign-in methods that OpenSearch Dashboards offers. |
| `password_validation_regex` | String | The regular expression that a new password must match. |
| `password_validation_error_message` | String | The message that OpenSearch Dashboards displays when a password does not match `password_validation_regex`. |
| `resource_sharing_enabled` | Boolean | Whether the resource sharing feature is enabled. |
| `api_tokens_enabled` | Boolean | Whether the API key APIs are enabled. |
| `max_duration_seconds` | Integer | The longest lifetime, in seconds, that an API key can be given. |
