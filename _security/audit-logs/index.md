---
layout: default
title: Audit logs
nav_order: 125
has_children: true
has_toc: false
redirect_from:
  - /security-plugin/audit-logs/index/
  - /security/audit-logs/
---

# Audit logs

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

Audit logs let you track access to your OpenSearch cluster and are useful for compliance purposes or in the aftermath of a security breach. You can configure the categories to be logged, the detail level of the logged messages, and where to store the logs.

OpenSearch supports two audit logging modes. The following table describes each mode and how it is configured.

Mode | Requirements | Configuration
:--- | :--- | :---
Standard (default) | The Security plugin with fine-grained access control (FGAC) enabled. | The `audit.yml` file in the security index and the REST API.
Standalone | No FGAC. Runs in SSL-only mode (`plugins.security.ssl_only: true`) or with security disabled (`plugins.security.disabled: true`). | `opensearch.yml` and dynamic cluster settings.

For more information about standalone mode, see [Standalone audit logging]({{site.url}}{{site.baseurl}}/security/audit-logs/standalone/).

## Enabling audit logging (standard mode)

Audit logging is disabled by default. To enable audit logging:

1. Add the following line to `opensearch.yml` on each node:

   ```yml
   plugins.security.audit.type: internal_opensearch
   ```
   {% include copy.html %}

   This setting stores audit logs on the current cluster. For other storage options, see [Audit Log Storage Types]({{site.url}}{{site.baseurl}}/security/audit-logs/storage-types/).

2. Restart each node.

Audit logging requires two settings: a storage type (`plugins.security.audit.type`) in `opensearch.yml` and `config.enabled: true` in `audit.yml`. The `audit.yml` file provided by the Security plugin sets `config.enabled` to `true` by default, so audit logging can appear to be enabled in a new cluster. Until you specify a storage type, the Security plugin cannot create a storage endpoint for the audit log, so it does not record any events and logs a warning at startup that no default storage is available.
{: .note}

After this initial setup, you can use OpenSearch Dashboards to manage your audit log categories and other settings. In OpenSearch Dashboards, select **Security** and then **Audit logs**. Alternatively, you can specify settings for audit logging in the `audit.yml` and `opensearch.yml` files (which file depends on the setting---see [Audit log settings](#audit-log-settings)). You can also use the [Audit log APIs]({{site.url}}{{site.baseurl}}/security/api/audit/) to manage and update settings.


## Tracked events

Audit logging records events in two ways: HTTP requests (REST) and the transport layer. The following table provides descriptions of tracked events and whether or not they are logged on the REST or transport layer.

Event | Logged on REST | Logged on transport | Description
:--- | :--- | :--- | :---
`FAILED_LOGIN` | Yes | Yes | The credentials of a request could not be validated, most likely because the user does not exist or the password is incorrect.
`AUTHENTICATED` | Yes | Yes | A user successfully authenticated.
`MISSING_PRIVILEGES` | No | Yes | The user does not have the required permissions to make the request.
`GRANTED_PRIVILEGES` | No | Yes | A user made a successful request to OpenSearch.
`SSL_EXCEPTION` | Yes | Yes | An attempt was made to access OpenSearch without a valid SSL/TLS certificate.
`opensearch_SECURITY_INDEX_ATTEMPT` | No | Yes | An attempt was made to modify the Security plugin internal user and privileges index without the required permissions or TLS admin certificate.
`BAD_HEADERS` | Yes | Yes | An attempt was made to spoof a request to OpenSearch with the Security plugin internal headers.
`CLUSTER_SETTINGS_CHANGED` | No | Yes | A persistent or transient cluster setting was changed. Disabled by default.
`INDEX_SETTINGS_CHANGED` | No | Yes | An index setting was changed. Disabled by default.
`REQUEST_AUDIT` | Yes | Yes | A REST request was received and processed. Generated in [standalone audit logging]({{site.url}}{{site.baseurl}}/security/audit-logs/standalone/) mode only. For more information about suppressing this event, see [Suppressing `REQUEST_AUDIT` events](#request-audit-suppression).
`TRANSPORT_AUDIT` | No | Yes | A transport-layer request was received on a node. Generated in [standalone audit logging]({{site.url}}{{site.baseurl}}/security/audit-logs/standalone/) mode only.
`RESOURCE_ACCESS_GRANTED` | No | Yes | Access to a shared resource was granted. Disabled by default.
`RESOURCE_ACCESS_DENIED` | No | Yes | Access to a shared resource was denied. Disabled by default.
`RESOURCE_SHARING_CHANGED` | No | Yes | A resource sharing configuration was changed. Disabled by default.

<p id="request-audit-suppression"></p>

`REQUEST_AUDIT` originates from a REST request (`audit_request_origin: REST`), but the event itself is recorded with `audit_request_layer: TRANSPORT`. As a result, it can be suppressed by any of `disabled_categories`, `disabled_transport_categories`, or `disabled_rest_categories`---adding `REQUEST_AUDIT` to any one of these settings suppresses the event.
{: .note}

## Audit log settings

The following default log settings work well for most use cases. However, you can change settings to save storage space or adapt the information to your exact needs. 


### Settings in audit.yml

The following settings are stored in the `audit.yml` file.


#### Exclude categories

To exclude categories, list them in the following setting:

```yml
config:
  audit:
    disabled_rest_categories: <disabled categories>
    disabled_transport_categories: <disabled categories>
```
{% include copy.html %}

For example:

```yml
config:
  audit:
    disabled_rest_categories:
      - AUTHENTICATED
      - GRANTED_PRIVILEGES
    disabled_transport_categories: [ GRANTED_PRIVILEGES ]
```
{% include copy.html %}

Alternatively, you can use the unified `disabled_categories` setting to disable categories on both layers simultaneously:

```yml
config:
  audit:
    disabled_categories:
      - AUTHENTICATED
      - GRANTED_PRIVILEGES
```
{% include copy.html %}

When `disabled_categories` is configured alongside `disabled_rest_categories` or `disabled_transport_categories`, a category is disabled on a given layer if it appears in either the unified setting or the layer-specific setting.

A deprecation warning is logged when `disabled_categories` is configured alongside layer-specific settings, encouraging migration to `disabled_categories` only.

For example, the following configuration disables `AUTHENTICATED` on both layers (using `disabled_categories`) and disables `SSL_EXCEPTION` on the REST layer only:

```yml
config:
  audit:
    disabled_categories:
      - AUTHENTICATED
    disabled_rest_categories:
      - SSL_EXCEPTION
```
{% include copy.html %}

By default, the `CLUSTER_SETTINGS_CHANGED` and `INDEX_SETTINGS_CHANGED` categories are disabled on the transport layer. To enable them, remove them from `disabled_transport_categories`:

```yml
config:
  audit:
    disabled_transport_categories:
      - AUTHENTICATED
      - GRANTED_PRIVILEGES
```
{% include copy.html %}

If you want to log events in all categories, use `NONE`:

```yml
config:
  audit:
    disabled_rest_categories: NONE
    disabled_transport_categories: NONE
```
{% include copy.html %}


#### Disable REST or the transport layer

By default, the Security plugin logs events on both REST and the transport layer. You can disable either type:

```yml
config:
  audit:
    enable_rest: false
    enable_transport: false
```
{% include copy.html %}

#### Disable request body logging

By default, the Security plugin includes the body of the request (if available) for both REST and the transport layer. If you do not want or need the request body, you can disable it:

```yml
config:
  audit:
    log_request_body: false
```
{% include copy.html %}

#### Log index names

By default, the Security plugin logs all indexes affected by a request. Because index names can be aliases and contain wildcards/date patterns, the Security plugin logs the index name that the user submitted *and* the actual index name to which it resolves.

For example, if you use an alias or a wildcard, the audit event might look like:

```json
audit_trace_indices: [
  "human*"
],
audit_trace_resolved_indices: [
  "humanresources"
]
```
{% include copy.html %}

You can disable this feature by setting:

```yml
config:
  audit:
    resolve_indices: false
```
{% include copy.html %}

This feature is only disabled if `config.audit.log_request_body` is also set to `false`.
{: .note }


#### Configure bulk request handling

Bulk requests can contain many indexing operations. By default, the Security plugin only logs the single bulk request, not each individual operation.

The Security plugin can be configured to log each indexing operation as a separate event:

```yml
config:
  audit:
    resolve_bulk_requests: true
```
{% include copy.html %}

This change can create an extremely large number of events in the audit logs, so we don't recommend enabling this setting if you frequently use the `_bulk` API.


#### Exclude requests

To exclude certain requests from being logged, configure actions for transport requests, HTTP request paths (REST), or both:

```yml
config:
  audit:
    ignore_requests: ["indices:data/read/*", "SearchRequest"]
```
{% include copy.html %}

#### Exclude users

By default, the Security plugin logs events from all users but excludes the internal OpenSearch Dashboards server user `kibanaserver`. You can exclude other users:

```yml
config:
  audit:
    ignore_users:
      - kibanaserver
      - admin
```
{% include copy.html %}

If requests from all users should be logged, use `NONE`:

```yml
config:
  audit:
    ignore_users: NONE
```
{% include copy.html %}


#### Exclude headers

You can exclude sensitive headers from being included in the logs---for example, the `Authorization:` header:

```yml
config:
  audit:
    exclude_sensitive_headers: true
```
{% include copy.html %}


### Settings in opensearch.yml

The following settings are stored in the `opensearch.yml` file. How they are applied at runtime depends on the audit logging mode:

- In standalone mode (SSL-only or security-disabled), most audit filter and compliance settings can be changed at runtime using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) without a node restart. These settings include `log_request_body`, `resolve_indices`, `disabled_categories`, `enable_rest`, `enable_transport`, `ignore_users`, and `ignore_requests`.

- In standard mode with FGAC, the audit configuration is stored in `audit.yml`, and the corresponding `plugins.security.audit.config.*` and `plugins.security.audit.compliance.*` cluster settings do not update it. A `PUT _cluster/settings` request can succeed without changing the audit configuration. The `body_logging_exclusions` setting is the exception: in FGAC mode, you can update it using the Cluster Settings API.

Some audit settings are static and require a node restart: `action_groups.<NAME>`, `log4j.enable_mdc_routing`, `config.index`, the thread pool settings, and the sink connection settings.

Updating a dynamic audit setting requires a role listed in `plugins.security.restapi.roles_enabled` when FGAC is enabled. This restriction is not enforced in SSL-only or security-disabled mode. The `body_logging_exclusions` setting can be updated without the elevated role.

The following table describes the audit settings that a caller can read using `GET _cluster/settings` in each mode.

Mode | Audit settings visible in settings responses
:--- | :---
Standalone, SSL-only | Any caller can read the non-secret dynamic audit configuration (`plugins.security.audit.config.*` and `plugins.security.audit.compliance.*`). Credential-bearing sink settings remain hidden.
Standalone, security disabled | No `plugins.security.audit.*` settings are filtered, so sink credentials and PEM content may be visible.
FGAC | The entire `plugins.security.audit.*` subtree is filtered for all callers. This filtering is not role based.

The `plugins.security.audit.enabled` runtime toggle applies only to standalone audit logging. See [Standalone audit logging]({{site.url}}{{site.baseurl}}/security/audit-logs/standalone/) for instructions.
{: .note}

#### Exclude categories

You can configure disabled categories in `opensearch.yml` using the `plugins.security.audit.config` prefix. This is useful for non-FGAC modes (SSL-only or security-disabled), in which the `audit.yml` security index is not available:

```yml
plugins.security.audit.config.disabled_categories:
  - AUTHENTICATED
  - GRANTED_PRIVILEGES
```
{% include copy.html %}

The layer-specific settings `disabled_rest_categories` and `disabled_transport_categories` are deprecated. Use the unified `disabled_categories` setting instead.
{: .warning}

The layer-specific settings are also available:

```yml
plugins.security.audit.config.disabled_rest_categories:
  - AUTHENTICATED
  - GRANTED_PRIVILEGES
plugins.security.audit.config.disabled_transport_categories:
  - AUTHENTICATED
  - GRANTED_PRIVILEGES
```
{% include copy.html %}

When both `disabled_categories` and the layer-specific settings are configured, a category is disabled on a given layer if it appears in either setting. A deprecation warning is also logged, recommending that you use `disabled_categories` only.

The `disabled_categories` settings suppress only REST and transport categories. They do not affect `COMPLIANCE_*` categories, which are governed solely by the compliance settings (`compliance.enabled`, the watched indexes and fields, and the compliance ignore-users settings).
{: .note}

#### Body logging exclusions

Use `body_logging_exclusions` to suppress request bodies for specific actions or REST paths while continuing to log bodies for all other requests. The `log_request_body` setting applies to every request, so it cannot exclude high-volume operations such as bulk ingestion selectively.

All expanded action-group patterns and raw exclusion patterns form a single combined wildcard matcher. For each audit layer, this matcher is tested against the corresponding identifier described in the following table. When a match is found, the request body field is omitted from the audit event. All other fields, such as the user, IP address, indexes, and timestamp, are preserved.

Identifier | Description | Matched for
:--- | :--- | :---
Transport action | The internal action name (for example, `indices:data/write/bulk[s][p]`). | Transport-layer audit events.
REST path | The HTTP request path (for example, `/_bulk`). REST paths always start with `/`. | REST-layer audit events.

Both identifiers support wildcard patterns using `*` (for example, `indices:data/write/bulk*` matches `indices:data/write/bulk[s][p]`).

##### Configuring action groups

Action groups are named collections of action patterns, REST paths, or both, defined statically in `opensearch.yml`. You choose the group name, so use any name that is meaningful for your operations:

```yml
plugins.security.audit.config.action_groups.BULK: "indices:data/write/bulk*,/_bulk"
plugins.security.audit.config.action_groups.SEARCH: "indices:data/read/search*,/_search"
plugins.security.audit.config.action_groups.INDEX_ADMIN: "indices:admin/*"
```
{% include copy.html %}

Each action group maps a name to a comma-separated list of literal or wildcard patterns, such as `indices:data/write/bulk*`, `/_bulk`, or `indices:data/write/*`. All patterns use the same matcher; characters such as `:`, `/`, and `*` do not assign a pattern to a particular audit layer.

Action groups are static settings and require a node restart to change. The group names themselves are case-sensitive.

##### Configuring body logging exclusions

The `body_logging_exclusions` setting references action group names or raw patterns. To set the initial exclusions, configure the setting in `opensearch.yml`:

```yml
plugins.security.audit.config.body_logging_exclusions:
  - BULK
```
{% include copy.html %}

The setting is dynamic, so you can also update the exclusions at runtime without restarting the cluster:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.audit.config.body_logging_exclusions": ["BULK", "SEARCH"]
  }
}
```
{% include copy.html %}

Each entry in the list is processed as follows:

1. If the entry matches a defined action group name, that group's patterns are expanded.
2. If it does not match any group name, the entry is treated as a raw pattern (literal or wildcard).

For entries that do not match a defined group name, a warning is logged if the entry contains no `:`, does not start with `/`, and contains no `*`, since it is unlikely to match an action or REST path. Note that this check looks for a leading `/` only, not a `/` anywhere in the entry: an entry such as `_bulk/items` contains a `/` but does not start with one, so the warning is still logged for it. This check only determines whether to log a warning; the entry is still included in the combined matcher.

##### Bulk requests

When `resolve_bulk_requests: true` is configured (logging individual bulk sub-items), the exclusion check uses the parent bulk action string. As a result, excluding the `BULK` group suppresses bodies for every sub-item (index, update, and delete) within that bulk request. You cannot keep index-item bodies while dropping delete-item bodies within the same bulk request.

##### Interaction with `log_request_body`

Body logging exclusions only apply when `log_request_body` is `true`. If `log_request_body` is `false`, no bodies are logged regardless of the exclusion configuration.

##### Example configuration

The following configuration defines three action groups and excludes the request bodies of bulk requests:

```yml
# opensearch.yml

# Define action groups (static, requires restart)
plugins.security.audit.config.action_groups.BULK: "indices:data/write/bulk*,/_bulk"
plugins.security.audit.config.action_groups.SEARCH: "indices:data/read/search*,/_search"
plugins.security.audit.config.action_groups.MONITORING: "cluster:monitor/*,indices:monitor/*"

# Initial exclusions (can be updated at runtime using _cluster/settings)
plugins.security.audit.config.body_logging_exclusions:
  - BULK
```
{% include copy.html %}

The following table describes whether the request body is logged for each request type when you use this configuration.

Request type | Request body logged
:--- | :---
Bulk write | No, because the `BULK` group is excluded.
Search | Yes.
Index creation | Yes.
Monitoring | Yes, unless you add `MONITORING` to the exclusions.

To add search exclusions at runtime, send the following request:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.audit.config.body_logging_exclusions": ["BULK", "SEARCH"]
  }
}
```
{% include copy.html %}

To clear all exclusions (resume logging all bodies):

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.audit.config.body_logging_exclusions": []
  }
}
```
{% include copy.html %}

#### Log4j MDC routing

When using the `log4j` audit sink, enable Mapped Diagnostic Context (MDC) routing so that Log4j routes audit events to different appenders based on event properties:

```yml
plugins.security.audit.config.log4j.enable_mdc_routing: true
```
{% include copy.html %}

When enabled, the following MDC keys are set on each audit event:

- `audit_category` --- The audit event category (for example, `REQUEST_AUDIT` or `GRANTED_PRIVILEGES`)
- `audit_action` --- The action name
- `audit_user` --- The effective user
- `audit_request_type` --- The request type

Use Log4j routing appenders in `log4j2.properties` to split audit logs by category, user, or any other MDC key.

This is a static setting and requires a node restart.
{: .note}


#### Configure the audit log index name

By default, the Security plugin stores audit events in a daily rolling index named `security-auditlog-YYYY.MM.dd`:

```yml
plugins.security.audit.config.index: myauditlogindex
```
{% include copy.html %}

Use a date pattern in the index name to configure daily, weekly, or monthly rolling indexes:

```yml
plugins.security.audit.config.index: "'auditlog-'YYYY.MM.dd"
```
{% include copy.html %}

For a reference on the date pattern format, see the [Joda DateTimeFormat documentation](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).


#### (Advanced) Tune the thread pool

The Search plugin logs events asynchronously, which minimizes the performance impact on your cluster. The plugin uses a fixed thread pool to log events:

```yml
plugins.security.audit.config.threadpool.size: <integer>
```
{% include copy.html %}

The default setting is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. To set the maximum queue length per thread:

```yml
plugins.security.audit.config.threadpool.max_queue_len: 100000
```
{% include copy.html %}

## Disabling audit logs

To disable audit logs after they've been enabled, remove the `plugins.security.audit.type: internal_opensearch` setting from `opensearch.yml`, or switch off the **Enable audit logging** check box in OpenSearch Dashboards. The `plugins.security.audit.enabled` runtime toggle, set using the Cluster Settings API, applies only to standalone audit logging; see [Standalone audit logging]({{site.url}}{{site.baseurl}}/security/audit-logs/standalone/) for instructions.

## Audit user account manipulation

To enable audit logging on changes to a security index, such as changes to roles mappings and role creation or deletion, use the following settings in the `compliance:` portion of the audit log configuration, as shown in the following example:

```yaml
_meta:
  type: "audit"
  config_version: 2

config:
  # enable/disable audit logging
  enabled: true

  ...


  compliance:
    # enable/disable compliance
    enabled: true

    # Log updates to internal security changes
    internal_config: true

    # Log only metadata of the document for write events
    write_metadata_only: false

    # Log only diffs for document updates
    write_log_diffs: true

    # List of indices to watch for write events. Wildcard patterns are supported
    # write_watched_indices: ["twitter", "logs-*"]
    write_watched_indices: [".opendistro_security"]
```
{% include copy.html %}
