---
layout: default
title: Update Audit Configuration API
parent: Audit Log APIs
grand_parent: Security APIs
nav_order: 20
---

# Update Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

This API allows you to enable or disable audit logging, define the configuration for audit logging and compliance, and make updates to settings.

For details on using audit logging to track access to OpenSearch clusters, as well as information on further configurations, see [Audit logs]({{site.url}}{{site.baseurl}}/security/audit-logs/index/).

You can do an initial configuration of audit logging in the `audit.yml` file, found in the `opensearch-project/security/config` directory. Thereafter, you can use the REST API or Dashboards for further changes to the configuration.
{: note.}

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

Field | Data type | Description
:--- | :--- | :---
`enabled` | Boolean | Enables or disables audit logging. Default is `true`.
`audit` | Object | Contains fields for audit logging configuration.
`audit.ignore_users` | Array | Users to be excluded from auditing. Wildcard patterns are supported<br>Example: `ignore_users: ["test-user", employee-*"]`
`audit.ignore_requests` | Array | Requests to be excluded from auditing. Wildcard patterns are supported.<br>Example: `ignore_requests: ["indices:data/read/*", "SearchRequest"]`
`audit.disabled_rest_categories` | Array | Categories to exclude from REST API auditing. Default categories are `AUTHENTICATED`, `GRANTED_PRIVILEGES`.
`audit.disabled_transport_categories` | Array | Categories to exclude from Transport API auditing. Default categories are `AUTHENTICATED`, `GRANTED_PRIVILEGES`.
`audit.log_request_body` | Boolean | Includes the body of the request (if available) for both REST and the transport layer. Default is  `true`.
`audit.resolve_indices` | Boolean | Logs all indexes affected by a request. Resolves aliases and wildcards/date patterns. Default is `true`.
`audit.resolve_bulk_requests` | Boolean | Logs individual operations in a bulk request. Default is `false`.
`audit.exclude_sensitive_headers` | Boolean | Excludes sensitive headers from being included in the logs. Default is `true`.
`audit.enable_transport` | Boolean | Enables/disables Transport API auditing. Default is `true`.
`audit.enable_rest` | Boolean | Enables/disables REST API auditing. Default is `true`.
`compliance` | Object | Contains fields for compliance configuration. 
`compliance.enabled` | Boolean | Enables or disables compliance. Default is `true`.
`compliance.write_log_diffs` | Boolean | Logs only diffs for document updates. Default is `false`.
`compliance.read_watched_fields` | Object | Map of indexes and fields to monitor for read events. Wildcard patterns are supported for both index names and fields.
`compliance.read_ignore_users` | Array | List of users to ignore for read events. Wildcard patterns are supported.<br>Example: `read_ignore_users: ["test-user", "employee-*"]`
`compliance.write_watched_indices` | Array | List of indexes to watch for write events. Wildcard patterns are supported.<br>Example: `write_watched_indices: ["twitter", "logs-*"]`
`compliance.write_ignore_users` | Array | List of users to ignore for write events. Wildcard patterns are supported.<br>Example: `write_ignore_users: ["test-user", "employee-*"]`
`compliance.read_metadata_only` | Boolean | Logs only metadata of the document for read events. Default is `true`.
`compliance.write_metadata_only` | Boolean | Log only metadata of the document for write events. Default is `true`.
`compliance.external_config` | Boolean | Logs external configuration files for the node. Default is `false`.
`compliance.internal_config` | Boolean | Logs updates to internal security changes. Default is `true`.

Changes to the `_readonly` property result in a 409 error, as indicated in the following response.
{: .note}

```json
{
  "status" : "error",
  "reason" : "Invalid configuration",
  "invalid_keys" : {
    "keys" : "_readonly,config"
  }
}
```

## Example request

**GET**

A GET call retrieves the audit configuration.

```json
GET /_plugins/_security/api/audit
```
{% include copy-curl.html %}

**PUT**

A PUT call updates the audit configuration.

```json
PUT /_plugins/_security/api/audit/config
{
  "enabled": true,
  "audit": {
    "ignore_users": [],
    "ignore_requests": [],
    "disabled_rest_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES"
    ],
    "disabled_transport_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES"
    ],
    "log_request_body": false,
    "resolve_indices": false,
    "resolve_bulk_requests": false,
    "exclude_sensitive_headers": true,
    "enable_transport": false,
    "enable_rest": true
  },
  "compliance": {
    "enabled": true,
    "write_log_diffs": false,
    "read_watched_fields": {},
    "read_ignore_users": [],
    "write_watched_indices": [],
    "write_ignore_users": [],
    "read_metadata_only": true,
    "write_metadata_only": true,
    "external_config": false,
    "internal_config": true
  }
}
```
{% include copy-curl.html %}

**PATCH**

A `PATCH` call is used to update specified fields in the audit configuration. The `PATCH` method requires an operation, a path, and a value to complete a valid request. For details on using the `PATCH` method, see the following [Patching resources](https://en.wikipedia.org/wiki/PATCH_%28HTTP%29#Patching_resources) description at Wikipedia.

Using the `PATCH` method also requires a user to have a security configuration that includes admin certificates for encryption. To find out more about these certificates, see [Configuring admin certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).

```bash
curl -X PATCH -k -i --cert <admin_cert file name> --key <admin_cert_key file name> <domain>/_plugins/_security/api/audit -H 'Content-Type: application/json' -d'[{"op":"add","path":"/config/enabled","value":"true"}]'
```
{% include copy.html %}

OpenSearch Dashboards Dev Tools do not currently support the `PATCH` method. You can use [cURL](https://curl.se/), [Postman](https://www.postman.com/), or another alternative process to update the configuration using this method. To follow the GitHub issue for support of the `PATCH` method in Dashboards, see [issue #2343](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2343).
{: .note}

## Example response

The GET call produces a response that appears similar to the following:

```json
{
  "_readonly" : [
    "/audit/exclude_sensitive_headers",
    "/compliance/internal_config",
    "/compliance/external_config"
  ],
  "config" : {
    "compliance" : {
      "enabled" : true,
      "write_log_diffs" : false,
      "read_watched_fields" : { },
      "read_ignore_users" : [ ],
      "write_watched_indices" : [ ],
      "write_ignore_users" : [ ],
      "read_metadata_only" : true,
      "write_metadata_only" : true,
      "external_config" : false,
      "internal_config" : true
    },
    "enabled" : true,
    "audit" : {
      "ignore_users" : [ ],
      "ignore_requests" : [ ],
      "disabled_rest_categories" : [
        "AUTHENTICATED",
        "GRANTED_PRIVILEGES"
      ],
      "disabled_transport_categories" : [
        "AUTHENTICATED",
        "GRANTED_PRIVILEGES"
      ],
      "log_request_body" : true,
      "resolve_indices" : true,
      "resolve_bulk_requests" : true,
      "exclude_sensitive_headers" : true,
      "enable_transport" : true,
      "enable_rest" : true
    }
  }
}
```
The PUT request produces a response that appears similar to the following:

```json
{
  "status" : "OK",
  "message" : "'config' updated."
}
```

The PATCH request produces a response similar to the following:

```bash
HTTP/1.1 200 OK
content-type: application/json; charset=UTF-8
content-length: 45
```

---
