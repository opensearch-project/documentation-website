---
layout: default
title: Restoring monitors and alerts from a snapshot
parent: Alerting
nav_order: 55
---

# Restoring monitors and alerts from a snapshot
**Introduced 3.10**
{: .label .label-purple }

OpenSearch stores alerting monitors and workflows in the `.opendistro-alerting-config` system index and alerts, findings, and comments in separate system indexes. When you restore these indexes from a snapshot using the [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/), for example, to another cluster, monitors continue to run in that cluster if you prepare the cluster first and restore the indexes as described in [Restoring the alerting indexes](#restoring-the-alerting-indexes).

This page uses _original cluster_ for the cluster that took the snapshot and _new cluster_ for the cluster that you restore to.

## Indexes to restore

The following table lists the alerting indexes and whether to restore them.

| Index | Contents | Whether to restore |
| :--- | :--- | :--- |
| `.opendistro-alerting-config` | Monitors and workflows | Yes. |
| `.opendistro-alerting-config-sharing` | The users, roles, and backend roles that each monitor and workflow is shared with | Yes, if the original cluster used [resource sharing]({{site.url}}{{site.baseurl}}/security/access-control/resources/). See [Restoring monitor sharing](#restoring-monitor-sharing). |
| `.opendistro-alerting-alerts` | Active alerts | Yes, to retain active alerts. |
| `.opendistro-alerting-alert-history-*` | Completed alerts | Yes, to retain alert history. |
| `.opensearch-alerting-finding-history-*` | Findings | Yes, to retain findings. |
| `.opensearch-alerting-comments-history-*` | Alert comments, if comments are enabled | Yes, to retain comments. |
| `.opensearch-alerting-queries*` | The queries that document-level monitors run | No. OpenSearch rebuilds it from the monitors. |
| `.opensearch-alerting-config-lock` | Temporary locks held while monitors run | No. |

Monitor actions send messages through notification channels, which OpenSearch stores in the `.opensearch-notifications-config` system index. If your monitors have actions, also restore that index so that the channels exist in the new cluster.

## Preparing the new cluster

Restoring alerting indexes restores your monitors but not the settings and roles that control who can access them. Complete the following steps in the new cluster before you restore the indexes.

The original cluster might be unavailable when you need to restore its monitors and alerts. Record its settings and back up its security configuration as part of your recovery plan.
{: .tip }

### Copying settings from the original cluster

The following table lists the settings that control access to monitors and the retention of alert history. Configure these settings in the new cluster using the values from the original cluster.

| Setting | What it controls |
| :--- | :--- |
| `plugins.alerting.filter_by_backend_roles` | Whether users can view only the monitors created by users who share a backend role. For more information, see [Limit access by backend role]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/#advanced-limit-access-by-backend-role). |
| `plugins.alerting.filter_by_backend_roles_access_strategy` | How backend roles are compared when `plugins.alerting.filter_by_backend_roles` is `true`. |
| `plugins.security.resource_sharing.enabled` | Whether [resource sharing]({{site.url}}{{site.baseurl}}/security/access-control/resources/) is enabled. |
| `plugins.security.resource_sharing.protected_types` | The resource types that use resource sharing. For alerting, these are `monitor` and `alerting-workflow`. |
| `plugins.alerting.alert_history_retention_period`<br>`plugins.alerting.finding_history_retention_period`<br>`plugins.alerting.comments_history_retention_period` | The amount of time for which history indexes are retained. |

Restored history indexes that are older than the retention period are deleted.

To view these values in the original cluster, including values set in `opensearch.yml`, send the following request:

```json
GET /_cluster/settings?include_defaults=true&filter_path=*.plugins.alerting.filter_by_backend_roles*,*.plugins.alerting.*_retention_period,*.plugins.security.resource_sharing
```
{% include copy-curl.html %}

If a setting in the new cluster doesn't match its value in the original cluster, users' access to monitors and alerts in the new cluster differs from their access in the original cluster and no error is reported. For example, if `plugins.alerting.filter_by_backend_roles` is `true` in the original cluster but `false` in the new cluster, every user with alerting permissions can view every monitor and its alerts.

### Copying roles and role mappings from the original cluster

Monitors store the roles and backend roles of the user who created them and run with the permissions that those roles have in the new cluster. Copy the roles and role mappings, with the same permissions, from the original cluster to the new cluster. To do this, upload `roles.yml` and `roles_mapping.yml` from a backup of your security configuration using `securityadmin.sh`, or use the [Security APIs]({{site.url}}{{site.baseurl}}/security/api/). For more information about backing up your security configuration, see [A word of caution]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/#a-word-of-caution). If a role grants more permissions in the new cluster, a monitor can read data that its creator couldn't read in the original cluster.

If the original cluster used resource sharing, a restored monitor is shared with a user, role, or backend role only if a user, role, or backend role with the same name exists in the new cluster. Backend roles provided by an authentication backend, such as LDAP or SAML, require the new cluster to use the same backend.

## Restoring the alerting indexes

Restore the alerting indexes to a cluster in which no monitors have been created. If the new cluster contains monitors, it already contains a `.opendistro-alerting-config` index. OpenSearch can't restore an index when an open index with the same name exists, so the restore operation fails. To restore monitors and alerts, follow these steps:

1. Ensure that you have permission to restore system indexes. By default, a REST admin (a user mapped to a role in `plugins.security.restapi.roles_enabled`) can restore every alerting index that you need to restore, as listed in [Indexes to restore](#indexes-to-restore). To restore notification channels, a REST admin must add `.opensearch-notifications-config` to the `plugins.security.system_indices.restore.indices` setting. For more information, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings).
1. Find the names of the history indexes in the snapshot. History index names include a date and a number, such as `.opendistro-alerting-alert-history-2026.10.27-1`. To restore all of them, use a pattern such as `.opendistro-alerting-alert-history-*`. A REST admin can use a pattern only if it is no broader than an entry in the `plugins.security.system_indices.restore.indices` setting. Otherwise, name each index. To list the indexes in the snapshot, use the [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/):

   ```json
   GET /_snapshot/my-repository/snapshot-1
   ```
   {% include copy-curl.html %}

1. Use one request to restore the alerting indexes and the data indexes that your monitors query. Name each alerting system index or match it using a pattern, as described in the previous step:

   ```json
   POST /_snapshot/my-repository/snapshot-1/_restore
   {
     "indices": "my-logs,.opendistro-alerting-config,.opendistro-alerting-alerts,.opendistro-alerting-alert-history-*,.opensearch-alerting-finding-history-*",
     "include_global_state": false
   }
   ```
   {% include copy-curl.html %}

   Add any of the following indexes that apply to your cluster to the same request:

   - `.opendistro-alerting-config-sharing`, if the original cluster used resource sharing
   - `.opensearch-alerting-comments-history-*`, to retain alert comments
   - `.opensearch-notifications-config`, if your monitors have actions

   Monitors start running as soon as `.opendistro-alerting-config` is restored. If you restore the other alerting indexes in a later request, the restore might fail or alerts might be lost. A monitor can't query a data index that doesn't exist in the new cluster. Restore the data indexes from the same snapshot as `.opendistro-alerting-config` so that each document-level monitor resumes from the last document that it evaluated in the original cluster, as described in [Document-level monitors](#document-level-monitors).

1. Verify that the monitors were restored by using the [Search Monitors API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/#search-monitors):

   ```json
   GET /_plugins/_alerting/monitors/_search
   {
     "query": {
       "match_all": {}
     }
   }
   ```
   {% include copy-curl.html %}

   The response lists the restored monitors.

## Restoring monitor sharing

If you restore `.opendistro-alerting-config` without `.opendistro-alerting-config-sharing`, users other than a super admin lose access to the restored monitors, including the users who created them. To restore their access, restore `.opendistro-alerting-config-sharing` from the same snapshot. Its records refer to monitors and workflows by ID, and a restore retains the IDs. Don't use the [Migrate API]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/#migrate-legacy-sharing-metadata) for this, because it shares each monitor with its creator's backend roles and doesn't restore the original sharing.

## Document-level monitors

A document-level monitor records the last document that it evaluated in each shard of its data index and resumes from that document after a restore. On its first run in the new cluster, the monitor might not evaluate documents that were written to its data indexes before that run. After the first run, the monitor evaluates every new document. To ensure that every document is evaluated, wait until each document-level monitor has run once in the new cluster before writing new documents to its data indexes.