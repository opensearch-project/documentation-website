---
layout: default
title: Update audit configuration
parent: Audit log APIs
grand_parent: Security APIs
nav_order: 10
---

# Update Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

Turns audit logging on or off and replaces the audit logging and compliance configuration.

For more information about using audit logging to track access to a cluster, see [Audit logs]({{site.url}}{{site.baseurl}}/security/audit-logs/index/).

Configure audit logging initially in the `audit.yml` file in the `config/opensearch-security` directory. After that, use this API or OpenSearch Dashboards to change the configuration.
{: .note}

<!-- spec_insert_start
api: security.update_audit_configuration
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/audit/config
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean | Whether audit logging is on. Default is `true`. |
| `audit` | Object | The audit logging configuration. |
| `audit.enable_rest` | Boolean | Whether to audit requests to the REST layer. Default is `true`. |
| `audit.enable_transport` | Boolean | Whether to audit requests to the transport layer. Default is `true`. |
| `audit.disabled_rest_categories` | Array of strings | The categories to exclude from REST layer auditing. Default is `["AUTHENTICATED", "GRANTED_PRIVILEGES"]`. |
| `audit.disabled_transport_categories` | Array of strings | The categories to exclude from transport layer auditing. Default is `["AUTHENTICATED", "GRANTED_PRIVILEGES"]`. |
| `audit.ignore_users` | Array of strings | The users to exclude from auditing. Supports wildcard patterns, such as `["test-user", "employee-*"]`. |
| `audit.ignore_requests` | Array of strings | The requests to exclude from auditing. Supports wildcard patterns, such as `["indices:data/read/*", "SearchRequest"]`. |
| `audit.log_request_body` | Boolean | Whether to include the request body, when available, for both the REST and transport layers. Default is `true`. |
| `audit.resolve_indices` | Boolean | Whether to log all indexes that a request affects, resolving aliases, wildcards, and date patterns. Default is `true`. |
| `audit.resolve_bulk_requests` | Boolean | Whether to log the individual operations in a bulk request. Default is `false`. |
| `audit.exclude_sensitive_headers` | Boolean | Whether to omit sensitive headers from the logs. Default is `true`. |
| `compliance` | Object | The compliance logging configuration. |
| `compliance.enabled` | Boolean | Whether compliance logging is on. Default is `true`. |
| `compliance.write_log_diffs` | Boolean | Whether to log only the differences for document updates. Default is `false`. |
| `compliance.read_watched_fields` | Object | The indexes and fields to monitor for read events. Supports wildcard patterns for both index names and field names. |
| `compliance.read_ignore_users` | Array of strings | The users to ignore for read events. Supports wildcard patterns, such as `["test-user", "employee-*"]`. |
| `compliance.read_metadata_only` | Boolean | Whether to log only document metadata for read events. Default is `true`. |
| `compliance.write_watched_indices` | Array of strings | The indexes to watch for write events. Supports wildcard patterns, such as `["logs-*"]`. |
| `compliance.write_ignore_users` | Array of strings | The users to ignore for write events. Supports wildcard patterns, such as `["test-user", "employee-*"]`. |
| `compliance.write_metadata_only` | Boolean | Whether to log only document metadata for write events. Default is `true`. |
| `compliance.external_config` | Boolean | Whether to log the node's external configuration files. Default is `false`. |
| `compliance.internal_config` | Boolean | Whether to log updates to the internal security configuration. Default is `true`. |

The `_readonly` property cannot be modified. A request that changes it returns a `409` error:

```json
{
  "status": "error",
  "reason": "Invalid configuration",
  "invalid_keys": {
    "keys": "_readonly,config"
  }
}
```

## Example request

```json
PUT _plugins/_security/api/audit/config
{
  "audit": {
    "disabled_categories": [],
    "disabled_rest_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES"
    ],
    "disabled_transport_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES",
      "CLUSTER_SETTINGS_CHANGED",
      "INDEX_SETTINGS_CHANGED"
    ],
    "enable_rest": true,
    "enable_transport": true,
    "exclude_sensitive_headers": true,
    "ignore_headers": [],
    "ignore_requests": [],
    "ignore_url_params": [],
    "ignore_users": [
      "kibanaserver"
    ],
    "log_request_body": true,
    "resolve_bulk_requests": false,
    "resolve_indices": true
  },
  "compliance": {
    "enabled": true,
    "external_config": false,
    "internal_config": true,
    "read_ignore_users": [
      "kibanaserver"
    ],
    "read_metadata_only": true,
    "read_watched_fields": {},
    "write_ignore_users": [
      "kibanaserver"
    ],
    "write_log_diffs": false,
    "write_metadata_only": true,
    "write_watched_indices": []
  },
  "enabled": true
}
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "'config' updated."
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `message` | String | A message describing the result of the operation. |
