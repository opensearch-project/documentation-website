---
layout: default
title: Standalone audit logging
parent: Audit logs
nav_order: 130
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

Many organizations need audit trails for compliance (SOC2, HIPAA, PCI-DSS, GDPR) even when they don't require authentication or authorization. Standalone audit logging answers the question "who did what, when?" without requiring the full security infrastructure.

{: .note }
Standalone audit logging uses the same audit infrastructure (sinks, routing, async thread pool) as standard FGAC audit logging. The difference is that it does not depend on authentication or authorization to produce events.

## Requirements

To enable standalone audit logging, add both of the following settings to `opensearch.yml` on each node:

```yml
plugins.security.audit.enable_standalone: true
plugins.security.audit.type: log4j
```
{% include copy.html %}

Both settings are required:
- `plugins.security.audit.enable_standalone: true` activates the standalone audit subsystem.
- `plugins.security.audit.type: <sink>` specifies the audit sink (where events are stored).

After adding these settings, restart each node to activate standalone audit logging.

{: .warning }
Authentication-only audit categories (`FAILED_LOGIN`, `AUTHENTICATED`, `GRANTED_PRIVILEGES`, `MISSING_PRIVILEGES`) will never produce events in standalone mode because no authentication or authorization decisions occur. A warning is logged at startup listing these inactive categories.

## Supported audit sinks

Standalone audit logging supports the same sinks as standard mode:

Sink type | Description
:--- | :---
`internal_opensearch` | Writes audit events to an index on the current OpenSearch cluster.
`log4j` | Writes events to a Log4j logger. You can use any Log4j appender (file, SNMP, JDBC, Kafka, etc.).
`webhook` | Sends events as JSON to an arbitrary HTTP endpoint.
`external_opensearch` | Writes to an audit index on a remote OpenSearch cluster.

For sink-specific configuration options, see [Audit log storage types]({{site.url}}{{site.baseurl}}/security/audit-logs/storage-types/).

## Tracked events

Standalone audit logging introduces two event categories designed for environments without authentication:

Category | Layer | Description
:--- | :--- | :---
`REQUEST_AUDIT` | REST | Captures all REST-layer requests including source IP, target indices, request body, HTTP headers, and request method. This is the primary event for standalone mode.
`TRANSPORT_AUDIT` | Transport | Captures transport-layer requests between nodes, including shard-level operations (`bulk[s][p]`, `search[phase/query]`), replica writes, and forwarded requests.

These categories do not imply any authentication or authorization semantics---they simply record that a request was received and processed.

### Event fields

Each `REQUEST_AUDIT` event includes:

- `@timestamp` --- When the event occurred
- `audit_cluster_name`, `audit_node_name`, `audit_node_id` --- Cluster and node identity
- `audit_rest_request_method`, `audit_rest_request_path` --- HTTP method and path
- `audit_request_body` --- Request body (configurable)
- `audit_request_remote_address` --- Client source IP
- `audit_trace_indices` --- Target indices (raw patterns)
- `audit_trace_resolved_indices` --- Resolved concrete indices (when `resolve_indices: true`)
- `audit_transport_request_type` --- Transport request class (e.g., `IndexRequest`, `SearchRequest`)
- `audit_request_layer` --- `REST` or `TRANSPORT`
- `audit_rest_request_headers` --- HTTP headers (sensitive headers excluded)

### Identity in standalone mode

Identity information varies by security mode:

- **SSL-only with mTLS**: The client certificate's subject DN is logged as `audit_request_effective_user` (e.g., `CN=my-app,OU=engineering,O=myorg`).
- **SSL-only without mTLS**: Only the source IP address is captured.
- **Security disabled**: Only the source IP address is captured.

## Configuration

All standalone audit settings are configured in `opensearch.yml` for initial values and can be dynamically updated at runtime using the cluster settings API. No security index is required.

### Dynamic configuration

All filter and compliance settings can be changed at runtime without restarting the cluster:

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

### Available filter settings

The following settings control what is logged. Configure them in `opensearch.yml` or update dynamically via `PUT _cluster/settings`:

Setting | Default | Description
:--- | :--- | :---
`plugins.security.audit.config.enable_rest` | `true` | Enable REST-layer audit events.
`plugins.security.audit.config.enable_transport` | `true` | Enable transport-layer audit events.
`plugins.security.audit.config.log_request_body` | `true` | Include the request body in audit events.
`plugins.security.audit.config.resolve_indices` | `true` | Resolve wildcard index patterns to concrete indices.
`plugins.security.audit.config.resolve_bulk_requests` | `false` | Log individual sub-operations in bulk requests.
`plugins.security.audit.config.exclude_sensitive_headers` | `true` | Exclude sensitive headers (e.g., `Authorization`) from audit events.
`plugins.security.audit.config.disabled_categories` | `[]` | List of audit categories to disable (e.g., `["REQUEST_AUDIT"]`).
`plugins.security.audit.config.ignore_users` | `["kibanaserver"]` | Users whose requests are not logged.
`plugins.security.audit.config.ignore_requests` | `[]` | Action patterns to exclude (e.g., `["cluster:monitor/*"]`).

### Toggling audit on/off at runtime

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

Set the value to `true` to re-enable audit logging.

## Compliance tracking

Document-level compliance tracking works in standalone mode for both reads and writes.

### Document write tracking

To track writes to specific indices, configure the watched indices:

```yml
plugins.security.audit.compliance.enabled: true
plugins.security.audit.compliance.write_watched_indices:
  - "sensitive-data-*"
  - "financial-records"
```
{% include copy.html %}

Write events are logged with the `COMPLIANCE_DOC_WRITE` category and include the document ID, index name, and shard ID. When `write_log_diffs: true`, the event includes a diff between the previous and current document content.

### Document read tracking

To track reads of specific fields in specific indices:

```yml
plugins.security.audit.compliance.enabled: true
plugins.security.audit.compliance.read_watched_fields:
  - "sensitive-data-*": ["ssn", "credit_card"]
  - "hr-records": ["salary", "performance_rating"]
```
{% include copy.html %}

Read events are logged with the `COMPLIANCE_DOC_READ` category and include the field values that were accessed.

### Compliance settings

Setting | Default | Description
:--- | :--- | :---
`plugins.security.audit.compliance.enabled` | `false` | Enable compliance tracking.
`plugins.security.audit.compliance.write_metadata_only` | `false` | Log only metadata for write events (no document content).
`plugins.security.audit.compliance.read_metadata_only` | `false` | Log only metadata for read events (no field values).
`plugins.security.audit.compliance.write_log_diffs` | `false` | Include diffs between old and new document content.
`plugins.security.audit.compliance.write_watched_indices` | `[]` | Index patterns to watch for write compliance events.
`plugins.security.audit.compliance.read_watched_fields` | `{}` | Index-to-fields mapping for read compliance events.

All compliance settings are dynamic and can be updated via `PUT _cluster/settings`.

## Example configurations

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
plugins.security.audit.compliance.write_watched_indices:
  - "financial-*"
  - "pii-*"
```
{% include copy.html %}

With this configuration, audit events are written to a daily rolling index named `security-auditlog-YYYY.MM.dd` by default.

## OpenSearch Dashboards

The **Security > Audit logs** page in OpenSearch Dashboards can be used to view and modify audit settings when standalone audit logging is active. The UI reads and writes dynamic cluster settings, so changes made through the Dashboards interface take effect immediately across all nodes without a restart.

To access audit log configuration in Dashboards:

1. Open OpenSearch Dashboards.
2. Select **Security** from the navigation menu.
3. Select **Audit logs**.

From this page you can enable or disable audit logging, configure which categories are tracked, set ignore patterns, and manage compliance settings.
