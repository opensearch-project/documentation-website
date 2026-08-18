---
layout: default
title: System indexes
parent: Configuration
nav_order: 4
redirect_from:
 - /security-plugin/configuration/system-indices/
---

# System indexes

System indexes store state that is managed by OpenSearch or an OpenSearch plugin, such as security configuration, asynchronous task results, and plugin metadata. A system index usually starts with a period (`.`), but a period-prefixed index is not necessarily a system index. OpenSearch identifies system indexes from descriptors registered by OpenSearch and its plugins.

Do not modify a system index directly. Use the API provided by the component that owns the index. Direct changes can corrupt component state or become incompatible after an upgrade.

## System index behavior

System indexes differ from regular indexes in the following ways:

- **Automatic creation**: OpenSearch permits a registered system index to be automatically created even when `action.auto_create_index` is `false` or its pattern would otherwise exclude the index. Registering a system index does not create it immediately. The owning component typically creates it when the component first stores data.
- **Dedicated thread pools**: Operations that target only system indexes use the `system_read` and `system_write` thread pools for supported read and write paths. This isolates internal component work from regular search and write traffic. A request that mixes system and regular indexes might use a regular thread pool.
- **Restricted access**: System indexes are intended to be accessed through their owning component's API. When the Security plugin is enabled, it adds the access controls described in [Security plugin protection](#security-plugin-protection).

## System index patterns in the standard distribution

The following table lists the descriptors registered at startup by the components in the standard OpenSearch distribution. The owning component usually creates an index only when its feature first stores data, so an index does not need to exist to be registered as a system index. The exact set can change between OpenSearch versions and can also depend on plugin settings.

| Component | Registered index patterns |
| :--- | :--- |
| OpenSearch task management | `.tasks*` |
| OpenSearch Dashboards | `.opensearch_dashboards`<br>`.opensearch_dashboards_*`<br>`.reporting-*`<br>`.apm-agent-configuration`<br>`.apm-custom-link` |
| Security plugin | `.opendistro_security` (configurable)<br>`.opensearch_security_api_tokens`<br>`.opendistro-anomaly-detectors-sharing`<br>`.opensearch-forecasters-sharing`<br>`.plugins-ml-model-group-sharing`<br>`.plugins-flow-framework-templates-sharing`<br>`.plugins-flow-framework-state-sharing`<br>`.opendistro-reports-definitions-sharing`<br>`.opendistro-reports-instances-sharing` |
| Alerting | `.opendistro-alerting-config`<br>`.opendistro-alerting-alert*`<br>`.opensearch-alerting-comments*` |
| Anomaly Detection and Forecasting | `.opendistro-anomaly-detectors`<br>`.opendistro-anomaly-detector-jobs`<br>`.opendistro-anomaly-results*`<br>`.opendistro-anomaly-checkpoints`<br>`.opendistro-anomaly-detection-state`<br>`.opensearch-forecasters`<br>`.opensearch-forecast-checkpoints`<br>`.opensearch-forecast-state` |
| Asynchronous Search | `.opendistro-asynchronous-search-response` |
| Cross-cluster replication | `.replication-metadata-store` |
| Flow Framework | `.plugins-flow-framework-config`<br>`.plugins-flow-framework-templates`<br>`.plugins-flow-framework-state` |
| Geospatial | `.geospatial-ip2geo-data*`<br>`.scheduler-geospatial-ip2geo-datasource` |
| Index Management | `.opendistro-ism-config`<br>`.opendistro-ism-managed-index-history*`<br>`.opensearch-control-center` |
| Job Scheduler | `.opendistro-job-scheduler-lock`<br>`.job-scheduler-history` |
| k-NN | `.opensearch-knn-models` |
| Learning to Rank | `.ltrstore*` |
| ML Commons | `.plugins-ml-model`<br>`.plugins-ml-model-group`<br>`.plugins-ml-task`<br>`.plugins-ml-agent`<br>`.plugins-ml-connector`<br>`.plugins-ml-config`<br>`.plugins-ml-controller`<br>`.plugins-ml-jobs`<br>`.plugins-ml-am*`<br>`.plugins-ml-memory-meta`<br>`.plugins-ml-memory-message`<br>`.plugins-ml-mcp-tools`<br>`.plugins-ml-mcp-session-management`<br>`.plugins-ml-context-management-templates`<br>`.plugins-ml-stop-words` |
| Notifications | `.opensearch-notifications-config` |
| Observability | `.opensearch-observability`<br>`.opensearch-notebooks` |
| Reporting | `.opendistro-reports-definitions`<br>`.opendistro-reports-instances` |
| Search Relevance | `.plugins-search-relevance-experiment`<br>`.plugins-search-relevance-judgment-cache` |
| Security Analytics | `.opensearch-sap-correlation-alerts`<br>`.opensearch-sap-threat-intel` |
| SQL | `.ql-datasources`<br>`.query_execution_request*` |

An index used by a plugin is not necessarily a system index. For example, Forecasting result indexes are regular indexes even though the plugin's configuration, checkpoint, and state indexes are system indexes.

## Security plugin protection

The Security plugin always protects its configuration index, `.opendistro_security` by default. When system index protection is enabled, the plugin also protects indexes registered with OpenSearch and any legacy patterns configured in `plugins.security.system_indices.indices`.

The demo security configuration enables system index protection:

```yml
plugins.security.system_indices.enabled: true
```

### Write protection

Regular index permissions, including broad permissions for `*`, do not grant write access to a protected system index. Writes are permitted only in one of the following contexts:

- The plugin that registered the system index performs the operation using its plugin identity.
- A super admin authenticates using an [admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).
- The system index permissions feature is enabled and a role explicitly grants `system:admin/system_index` for the index pattern. This option does not grant access to the Security configuration index.

Use the owning plugin's API whenever possible, including when you authenticate as a super admin. For example, use the Security REST API or `securityadmin.sh` to change Security plugin configuration instead of indexing documents directly into `.opendistro_security`.

### Read protection and scrubbed results

Read protection does not produce the same response for every API. For a user without system index access, the Security plugin can replace the underlying index reader with an empty reader. As a result:

- A search can return `200 OK` with zero hits even though matching documents exist.
- A get request can behave as though the document does not exist.
- An operation that cannot be safely filtered can return `403 Forbidden`.

Therefore, do not interpret a successful response or an empty result as proof that the caller has access to a system index. When `plugins.security.system_indices.permission.enabled` is enabled, an explicit request from a user without the required system index permission is generally rejected instead of returning scrubbed search results.

The `.tasks*` family is an exception. The Security plugin permits reads so that authorized users can use the task APIs and read stored task results. OpenSearch still protects writes to the index.

To read the Security configuration index directly, authenticate with an admin certificate:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem \
  -X GET 'https://localhost:9200/.opendistro_security/_search'
```

### Audit logging

When Security audit logging is enabled, rejected attempts to access the Security configuration index or another protected system index are recorded in the `OPENDISTRO_SECURITY_INDEX_ATTEMPT` audit category. This check is separate from ordinary index permissions and document-level or field-level security, so granting broad index permissions does not bypass the protection or its audit event. For information about audit configuration and excluded categories, see [Audit logs]({{site.url}}{{site.baseurl}}/security/audit-logs/index/).

## Configure additional system indexes

The `plugins.security.system_indices.indices` setting can protect additional index patterns, but it is deprecated. Existing deployments can continue to use it while migrating plugin-owned indexes to system index descriptors. Because it is a static node setting, every node must use the same value and must be restarted after a change.

```yml
plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices:
  - ".example-plugin-*"
```

For information about granting users explicit access, see [System index permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions).

## System indexes for plugin developers

A plugin that owns internal indexes should register them with OpenSearch instead of requiring an administrator to add patterns to `plugins.security.system_indices.indices`:

1. Implement `SystemIndexPlugin` and return a `SystemIndexDescriptor` for each index pattern. Patterns must start with `.` and must not overlap descriptors registered by another plugin.
2. Expose plugin-specific actions and REST APIs for accessing the data instead of requiring callers to use the standard index APIs.
3. Implement `IdentityAwarePlugin` and retain the assigned `PluginSubject`.
4. Run internal client operations as that subject. A `FilterClient` wrapper can apply the plugin subject consistently and restore the caller's thread context before invoking an asynchronous listener.

Calling `ThreadContext.stashContext()` by itself is not sufficient when the Security plugin is installed: Stashing removes the caller's context, but it does not establish the plugin identity that authorizes access to the plugin's registered system indexes.

For an implementation example, see the Security plugin's [sample `PluginClient`](https://github.com/opensearch-project/security/blob/main/sample-resource-plugin/src/main/java/org/opensearch/sample/utils/PluginClient.java) and [`SampleResourcePlugin`](https://github.com/opensearch-project/security/blob/main/sample-resource-plugin/src/main/java/org/opensearch/sample/SampleResourcePlugin.java).
