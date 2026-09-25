---
layout: default
title: Standalone audit logging
parent: Audit logs
nav_order: 133
---

# Standalone audit logging

---

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

Standalone audit logging enables audit logging for OpenSearch clusters that do not use fine-grained access control (FGAC). This includes clusters running in SSL-only mode (`plugins.security.ssl_only: true`) or with security disabled (`plugins.security.disabled: true`).

In this context, *standalone* refers to audit logging that operates independently of fine-grained access control. It runs inside the Security plugin and uses the same audit infrastructure (sinks, routing, and the asynchronous thread pool) as standard mode, but it does not depend on authentication or authorization to produce events.

Clusters that do not require authentication or authorization may still need audit trails for compliance frameworks such as SOC 2, HIPAA, PCI DSS, and GDPR. Standalone audit logging records the source, action, and time for each request in these clusters.

## Requirements

To enable standalone audit logging, add both of the following settings to `opensearch.yml` on each node:

```yml
plugins.security.audit.enable_standalone: true
plugins.security.audit.type: log4j
```
{% include copy.html %}

Both settings are required:

- `plugins.security.audit.enable_standalone: true` activates the standalone audit subsystem.
- `plugins.security.audit.type: <sink>` specifies the audit sink, which is the destination for audit events.

After adding these settings, restart each node to activate standalone audit logging.

The following categories never produce events in standalone mode because no authentication or authorization decisions occur: `FAILED_LOGIN`, `AUTHENTICATED`, `GRANTED_PRIVILEGES`, `MISSING_PRIVILEGES`, `OPENDISTRO_SECURITY_INDEX_ATTEMPT`, `API_TOKEN_WRITE`, `RESOURCE_ACCESS_GRANTED`, `RESOURCE_ACCESS_DENIED`, and `RESOURCE_SHARING_CHANGED`. A warning is logged at startup for any of these categories that is not already disabled by another setting. Because `AUTHENTICATED` and `GRANTED_PRIVILEGES` are disabled by default, the default startup warning does not mention them.
{: .warning }

## Supported audit sinks

Standalone audit logging supports the same sinks as standard mode. The following table describes the available sink types.

Sink type | Description
:--- | :---
`internal_opensearch` | Writes audit events to an index on the current OpenSearch cluster.
`log4j` | Writes events to a Log4j logger. You can use any Log4j appender (file, SNMP, JDBC, Kafka).
`webhook` | Sends events as JSON to an arbitrary HTTP endpoint.
`external_opensearch` | Writes to an audit index on a remote OpenSearch cluster.
`debug` | Prints events to `stdout`. Intended for development and troubleshooting only.

For sink-specific configuration options, see [Audit log storage types]({{site.url}}{{site.baseurl}}/security/audit-logs/storage-types/).

## Tracked events

Standalone audit logging adds two request-tracking categories for clusters without authentication. The following table describes these categories.

Category | Origin | Description
:--- | :--- | :---
`REQUEST_AUDIT` | REST | Captures REST-originated requests, including source IP, target indexes, request body, and HTTP headers. This is the primary event for standalone mode.
`TRANSPORT_AUDIT` | Transport | Captures transport-originated requests between nodes, including shard-level operations (`bulk[s][p]`, `search[phase/query]`), replica writes, and forwarded requests.

`REQUEST_AUDIT` originates from REST (`audit_request_origin: REST`), but the event itself is recorded with `audit_request_layer: TRANSPORT`. As a result, it can be suppressed by any of `disabled_categories`, `disabled_transport_categories`, or `disabled_rest_categories`---adding `REQUEST_AUDIT` to any one of these settings suppresses the event.
{: .note}

These categories do not imply any authentication or authorization semantics. They record that a request was received and processed.

In addition to these request-tracking categories, standalone audit logging emits the standard document-level compliance categories when [compliance tracking](#compliance-tracking) is enabled. The following table describes these categories.

Category | Description
:--- | :---
`COMPLIANCE_DOC_WRITE` | A document was written to a watched index. For more information, see [Document write tracking](#document-write-tracking).
`COMPLIANCE_DOC_READ` | A watched field was read from a watched index. For more information, see [Document read tracking](#document-read-tracking).

Compliance events are governed only by the compliance settings (`compliance.enabled` and the watched indexes and fields). They are not affected by `disabled_categories`, which applies to every REST- and transport-layer category, such as `REQUEST_AUDIT` and `TRANSPORT_AUDIT`.

### Event fields

Each `REQUEST_AUDIT` event includes:

- `@timestamp` --- When the event occurred
- `audit_cluster_name`, `audit_node_name`, `audit_node_id` --- Cluster and node identity
- `audit_request_privilege` --- The transport action being audited (for example, `indices:data/write/index`)
- `audit_request_body` --- Request body (configurable)
- `audit_request_remote_address` --- Client source IP
- `audit_trace_indices` --- Target indexes (raw patterns)
- `audit_trace_resolved_indices` --- Resolved concrete indexes (when `resolve_indices: true`)
- `audit_transport_request_type` --- Transport request class (for example, `IndexRequest` or `SearchRequest`)
- `audit_request_layer` --- `TRANSPORT` for `REQUEST_AUDIT` events
- `audit_rest_request_headers` --- HTTP headers (sensitive headers excluded)

### Identity in standalone mode

The identity information captured in audit events depends on the security mode. The following table describes the identity captured in each mode.

Security mode | Identity captured
:--- | :---
SSL-only with mTLS | The client certificate's subject distinguished name (DN), logged as `audit_request_effective_user` (for example, `CN=my-app,OU=engineering,O=myorg`).
SSL-only without mTLS | The source IP address only.
Security disabled | The source IP address only.

## Configuration

Configure initial standalone audit settings in `opensearch.yml`. Dynamic settings can be updated at runtime using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). Static settings, including `enable_standalone`, `action_groups.<NAME>`, and sink connection settings, require a node restart. No security index is required.

Standalone mode does not use the [Audit log APIs]({{site.url}}{{site.baseurl}}/security/api/audit/) or `audit.yml`. Both of those manage the security index and require fine-grained access control. In standalone mode, use the Cluster Settings API instead.

### Dynamic configuration

Most filter and compliance settings can be changed at runtime without restarting the cluster. To change a setting, send a `PUT _cluster/settings` request:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.audit.config.log_request_body": false
  }
}
```
{% include copy.html %}

Dynamic settings override the values in `opensearch.yml` and persist across cluster restarts.

A `PUT _cluster/settings` request that changes a setting that is not dynamically updatable succeeds and stores the new value, but the value is never applied, and no error indicates that the update had no effect.
{: .warning}

### Dynamic settings reference

The following settings are registered as dynamic cluster settings. Types are shown as placeholders:

```yml
# Global toggle
plugins.security.audit.enabled: <bool>

# Filter settings
plugins.security.audit.config.log_request_body: <bool>
plugins.security.audit.config.resolve_indices: <bool>
plugins.security.audit.config.resolve_bulk_requests: <bool>
plugins.security.audit.config.exclude_sensitive_headers: <bool>
plugins.security.audit.config.enable_rest: <bool>
plugins.security.audit.config.enable_transport: <bool>
plugins.security.audit.config.disabled_categories: <list[string]>
plugins.security.audit.config.disabled_rest_categories: <list[string]>
plugins.security.audit.config.disabled_transport_categories: <list[string]>
plugins.security.audit.config.ignore_users: <list[string]>
plugins.security.audit.config.ignore_requests: <list[string]>
plugins.security.audit.config.ignore_headers: <list[string]>
plugins.security.audit.config.body_logging_exclusions: <list[string]>

# Compliance settings
plugins.security.audit.compliance.enabled: <bool>
plugins.security.audit.compliance.write_metadata_only: <bool>
plugins.security.audit.compliance.write_log_diffs: <bool>
plugins.security.audit.compliance.write_watched_indices: <list[string]>
plugins.security.audit.compliance.write_ignore_users: <list[string]>
plugins.security.audit.compliance.read_metadata_only: <bool>
plugins.security.audit.compliance.read_watched_fields: <list[string]>
plugins.security.audit.compliance.read_ignore_users: <list[string]>
plugins.security.audit.compliance.external_config: <bool>
plugins.security.audit.compliance.internal_config: <bool>
```
{% include copy.html %}

Note the following about the locations in which these settings can be specified:

- The `plugins.security.audit.enabled` setting is runtime-only. Setting it in `opensearch.yml` has no effect. In standalone mode, change it using `PUT _cluster/settings`.
- The compliance settings use different key names in `opensearch.yml` than in `PUT _cluster/settings`. Only `plugins.security.audit.compliance.enabled` uses the same name in both. For the remaining compliance settings, only the legacy `opendistro_security.compliance.history.*` keys are valid in `opensearch.yml`. The following table maps each compliance cluster setting to its corresponding key in `opensearch.yml`.

Cluster setting | Key in `opensearch.yml`
:--- | :---
`plugins.security.audit.compliance.enabled` | `plugins.security.audit.compliance.enabled`
`plugins.security.audit.compliance.write_metadata_only` | `opendistro_security.compliance.history.write.metadata_only`
`plugins.security.audit.compliance.read_metadata_only` | `opendistro_security.compliance.history.read.metadata_only`
`plugins.security.audit.compliance.write_log_diffs` | `opendistro_security.compliance.history.write.log_diffs`
`plugins.security.audit.compliance.write_watched_indices` | `opendistro_security.compliance.history.write.watched_indices`
`plugins.security.audit.compliance.read_watched_fields` | `opendistro_security.compliance.history.read.watched_fields`
`plugins.security.audit.compliance.write_ignore_users` | `opendistro_security.compliance.history.write.ignore_users`
`plugins.security.audit.compliance.read_ignore_users` | `opendistro_security.compliance.history.read.ignore_users`
`plugins.security.audit.compliance.external_config` | `opendistro_security.compliance.history.external_config_enabled`
`plugins.security.audit.compliance.internal_config` | `opendistro_security.compliance.history.internal_config_enabled`

Static settings (`enable_standalone`, `action_groups.<NAME>`, `log4j.enable_mdc_routing`, sink connection settings, and the thread pool settings) require a node restart and cannot be changed using the Cluster Settings API.

### Available filter settings

The following table describes the settings that control what is logged. Settings that are dynamically updatable can be changed at runtime using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). Set the remaining settings in `opensearch.yml`.

Setting | Default | Dynamically updatable | Description
:--- | :--- | :--- | :---
`plugins.security.audit.config.enable_rest` | `true` | Yes | Enable REST-layer audit events.
`plugins.security.audit.config.enable_transport` | `true` | Yes | Enable transport-layer audit events.
`plugins.security.audit.config.log_request_body` | `true` | Yes | Include the request body in audit events.
`plugins.security.audit.config.resolve_indices` | `true` | Yes | Resolve wildcard index patterns to concrete indexes.
`plugins.security.audit.config.resolve_bulk_requests` | `false` | Yes | Log individual sub-operations in bulk requests.
`plugins.security.audit.config.exclude_sensitive_headers` | `true` | Yes | Exclude sensitive headers (for example, `Authorization`) from audit events.
`plugins.security.audit.config.disabled_categories` | `[]` | Yes | Request-tracking categories to disable (for example, `["REQUEST_AUDIT"]`). Does not affect `COMPLIANCE_*` categories.
`plugins.security.audit.config.disabled_rest_categories` | `["AUTHENTICATED", "GRANTED_PRIVILEGES", "RESOURCE_ACCESS_GRANTED", "RESOURCE_ACCESS_DENIED", "RESOURCE_SHARING_CHANGED"]` | Yes | REST-layer categories to disable. Deprecated. Use `disabled_categories` instead.
`plugins.security.audit.config.disabled_transport_categories` | `["AUTHENTICATED", "GRANTED_PRIVILEGES", "RESOURCE_ACCESS_GRANTED", "RESOURCE_ACCESS_DENIED", "RESOURCE_SHARING_CHANGED", "CLUSTER_SETTINGS_CHANGED", "INDEX_SETTINGS_CHANGED"]` | Yes | Transport-layer categories to disable. Deprecated. Use `disabled_categories` instead.
`plugins.security.audit.config.ignore_users` | `["kibanaserver"]` | Yes | Users whose requests are not logged.
`plugins.security.audit.config.ignore_requests` | `[]` | Yes | Action patterns or REST paths to exclude (for example, `["cluster:monitor/*"]`).
`plugins.security.audit.config.ignore_headers` | `[]` | No | HTTP headers to exclude from audit events.

Setting `disabled_rest_categories` or `disabled_transport_categories` replaces the entire default list rather than adding to it. If you set either to a custom list, include the categories shown in the preceding table that you still want disabled. Any category you omit is reenabled without warning.
{: .warning }

### Enabling and disabling audit logging at runtime

You can enable or disable audit logging without restarting the cluster:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.audit.enabled": false
  }
}
```
{% include copy.html %}

Set the value to `true` to reenable audit logging.

## Compliance tracking

Document-level compliance tracking works in standalone mode for both reads and writes.

### Document write tracking

To track writes to specific indexes, configure the watched indexes:

```yml
plugins.security.audit.compliance.enabled: true
opendistro_security.compliance.history.write.watched_indices:
  - "sensitive-data-*"
  - "financial-records"
```
{% include copy.html %}

Write events are logged with the `COMPLIANCE_DOC_WRITE` category and include the document ID, index name, and shard ID. When `write_log_diffs: true`, the event includes a diff between the previous and current document content.

### Document read tracking

To track reads of specific fields in specific indexes, configure `read_watched_fields`. As a cluster setting, this is a list of strings---each entry is a comma-separated string whose first token is an index pattern and whose remaining tokens are field patterns. If no field patterns are given for an index, all fields (`*`) are watched:

```yml
plugins.security.audit.compliance.enabled: true
opendistro_security.compliance.history.read.watched_fields:
  - "sensitive-data-*,ssn,credit_card"
  - "hr-records,salary,performance_rating"
```
{% include copy.html %}

Read events are logged with the `COMPLIANCE_DOC_READ` category and include the field values that were accessed.

### Compliance settings

The following table describes the compliance settings. Settings that are dynamically updatable can be changed at runtime using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). Set the remaining settings in `opensearch.yml`.

Setting | Default | Dynamically updatable | Description
:--- | :--- | :--- | :---
`plugins.security.audit.compliance.enabled` | `true` | Yes | Enable compliance tracking. Compliance events are only produced for the indexes and fields configured in the watched settings.
`plugins.security.audit.compliance.write_metadata_only` | `false` | Yes | Log only metadata for write events (no document content).
`plugins.security.audit.compliance.read_metadata_only` | `false` | Yes | Log only metadata for read events (no field values).
`plugins.security.audit.compliance.write_log_diffs` | `false` | Yes | Include diffs between old and new document content.
`plugins.security.audit.compliance.write_watched_indices` | `[]` | Yes | Index patterns to watch for write compliance events.
`plugins.security.audit.compliance.read_watched_fields` | `[]` | Yes | Index-and-fields patterns to watch for read compliance events. Each entry is a comma-separated string: `<index-pattern>,<field-pattern>,...`.
`plugins.security.audit.compliance.write_ignore_users` | `["kibanaserver"]` | No | Users whose document writes are not tracked for compliance.
`plugins.security.audit.compliance.read_ignore_users` | `["kibanaserver"]` | No | Users whose document reads are not tracked for compliance.
`plugins.security.audit.compliance.external_config` | `false` | No | Log the external configuration (`opensearch.yml` and environment) once at startup.
`plugins.security.audit.compliance.internal_config` | `false` | No | Log changes to the internal security configuration.

## Example configurations

The following examples configure standalone audit logging in SSL-only and security-disabled modes.

### SSL-only mode with Log4j sink

This configuration enables audit logging in an SSL-only cluster, writing events to a Log4j logger:

```yml
plugins.security.ssl_only: true

# TLS configuration
plugins.security.ssl.transport.pemcert_filepath: node-cert.pem
plugins.security.ssl.transport.pemkey_filepath: node-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: node-cert.pem
plugins.security.ssl.http.pemkey_filepath: node-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: root-ca.pem

# Standalone audit logging
plugins.security.audit.enable_standalone: true
plugins.security.audit.type: log4j

# Audit filter settings
plugins.security.audit.config.log_request_body: true
plugins.security.audit.config.resolve_indices: true
plugins.security.audit.config.exclude_sensitive_headers: true
plugins.security.audit.config.ignore_requests:
  - "cluster:monitor/*"
  - "indices:monitor/*"
```
{% include copy.html %}

### Security-disabled mode with internal index sink

This configuration enables audit logging in a cluster with security disabled, storing events in an internal OpenSearch index:

```yml
plugins.security.disabled: true

# Standalone audit logging
plugins.security.audit.enable_standalone: true
plugins.security.audit.type: internal_opensearch

# Audit filter settings
plugins.security.audit.config.log_request_body: true
plugins.security.audit.config.resolve_indices: true
plugins.security.audit.config.resolve_bulk_requests: true

# Compliance tracking
plugins.security.audit.compliance.enabled: true
opendistro_security.compliance.history.write.watched_indices:
  - "financial-*"
  - "pii-*"
```
{% include copy.html %}

With this configuration, audit events are written to a daily rolling index named `security-auditlog-YYYY.MM.dd` by default.
