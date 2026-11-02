---
layout: default
title: Restoring alerting from a snapshot
parent: Alerting
nav_order: 55
---

# Restoring alerting from a snapshot
**Introduced 3.10**
{: .label .label-purple }

Alerting stores its monitors and workflows in the `.opendistro-alerting-config` system index and its alerts, findings, and comments in separate system indexes. When you restore these indexes from a snapshot using the [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/), for example, onto another cluster, monitors continue to run on that cluster. This works only if you prepare the cluster first and restore the Alerting indexes in one request, as described in [Restore steps](#restore-steps).

This page uses _original cluster_ for the cluster that took the snapshot and _new cluster_ for the cluster that you restore to.

## Indexes to restore

The following table lists the Alerting indexes and whether to restore them.

| Index | Contents | Restore |
| :--- | :--- | :--- |
| `.opendistro-alerting-config` | Monitors and workflows | Yes |
| `.opendistro-alerting-config-sharing` | The users, roles, and backend roles that each monitor and workflow is shared with | Yes, if the original cluster used [resource sharing]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/alerting-access-control/). See [Restoring monitor sharing](#restoring-monitor-sharing). |
| `.opendistro-alerting-alerts` | Active alerts | Yes, to keep active alerts |
| `.opendistro-alerting-alert-history-*` | Completed alerts | Yes, to keep alert history |
| `.opensearch-alerting-finding-history-*` | Findings | Yes, to keep findings |
| `.opensearch-alerting-comments-history-*` | Alert comments, if comments are enabled | Yes, to keep comments |
| `.opensearch-alerting-queries*` | The queries that document-level monitors run | No. Alerting rebuilds it from the monitors. |
| `.opensearch-alerting-config-lock` | Temporary locks held while monitors run | No |

Monitor actions send messages through notification channels, which the Notifications plugin stores in its `.opensearch-notifications-config` system index. If your monitors have actions, also restore that index so that the channels exist on the new cluster.

## Prepare the new cluster

Restoring Alerting indexes brings back your monitors but not the settings and roles that control who can access them. Complete the following steps on the new cluster before you restore. The original cluster might be unavailable when you need to restore, and restoring a snapshot doesn't bring back its settings or its Security plugin configuration. Record its settings and back up its security configuration as part of your recovery plan.

### Match the settings

Set the following settings on the new cluster to the values used on the original cluster.

| Setting | What it controls |
| :--- | :--- |
| `plugins.alerting.filter_by_backend_roles` | Whether users see only the monitors created by users who share a backend role. For more information, see [Limit access by backend role]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/#advanced-limit-access-by-backend-role). |
| `plugins.alerting.filter_by_backend_roles_access_strategy` | How backend roles are compared when `plugins.alerting.filter_by_backend_roles` is `true`. |
| `plugins.security.resource_sharing.enabled` | Whether [resource sharing]({{site.url}}{{site.baseurl}}/security/access-control/resources/) is enabled. |
| `plugins.security.resource_sharing.protected_types` | The resource types that use resource sharing. For Alerting, these are `monitor` and `alerting-workflow`. |
| `plugins.alerting.alert_history_retention_period`<br>`plugins.alerting.finding_history_retention_period`<br>`plugins.alerting.comments_history_retention_period` | How long history indexes are kept. Restored history indexes older than this period are deleted. |

To view these values on the original cluster, including values set in `opensearch.yml`, send the following request:

```json
GET /_cluster/settings?include_defaults=true&filter_path=*.plugins.alerting.filter_by_backend_roles*,*.plugins.alerting.*_retention_period,*.plugins.security.resource_sharing
```
{% include copy-curl.html %}

A mismatch doesn't produce an error. Instead, users have different access on the new cluster. For example, if `plugins.alerting.filter_by_backend_roles` is `true` on the original cluster but `false` on the new cluster, every user with Alerting permissions can see every monitor and its alerts.

### Match the roles and role mappings

Monitors store the roles and backend roles of the user who created them and run with the permissions that those roles have on the new cluster. Copy the roles and role mappings from the original cluster to the new cluster, with the same permissions, for example, by uploading `roles.yml` and `roles_mapping.yml` from a [backup of your security configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) using `securityadmin.sh`, or by using the [REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/). If a role grants more permissions on the new cluster, a monitor can read data that its creator couldn't read on the original cluster.

Sharing records also name users, roles, and backend roles, so they grant access only when the same names exist on the new cluster. Backend roles that come from an authentication backend, such as LDAP or SAML, require the new cluster to use the same backend.

## Restore steps

Restore onto a new cluster that has no monitors of its own, and follow these steps:

1. Restoring Alerting system indexes requires permission to restore system indexes. A user mapped to a role in `plugins.security.restapi.roles_enabled` can restore only the indexes listed in the `plugins.security.system_indices.restore.indices` setting. By default, the list includes every Alerting index that [Indexes to restore](#indexes-to-restore) says to restore. For more information, see [Take and restore snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/).
1. History index names include a date and a number, such as `.opendistro-alerting-alert-history-2026.10.27-1`. To restore all of them, use a pattern such as `.opendistro-alerting-alert-history-*`. A user mapped to a role in `plugins.security.restapi.roles_enabled` can use a pattern only if it is no broader than an entry of the `plugins.security.system_indices.restore.indices` setting. Otherwise, name each index. To find the names of the history indexes in the snapshot, use the [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/):

   ```json
   GET /_snapshot/my-repository/snapshot-1
   ```
   {% include copy-curl.html %}

1. Restore the Alerting indexes, together with the data indexes that your monitors query, in one request. Name each Alerting system index or match it with a pattern, as described in the previous step:

   ```json
   POST /_snapshot/my-repository/snapshot-1/_restore
   {
     "indices": "my-logs,.opendistro-alerting-config,.opendistro-alerting-alerts,.opendistro-alerting-alert-history-*,.opensearch-alerting-finding-history-*",
     "include_global_state": false
   }
   ```
   {% include copy-curl.html %}

Monitors start running as soon as `.opendistro-alerting-config` is restored. If you restore the other Alerting indexes in a later request, the restore can fail or alerts can be lost, so restore them all in one request.

A monitor can't check a data index that doesn't exist on the new cluster. Restore the data indexes from the same snapshot as `.opendistro-alerting-config` so that document-level monitors continue from where they were, as described in [How document-level monitors continue](#how-document-level-monitors-continue).

## Restoring monitor sharing

If the original cluster used resource sharing, restore `.opendistro-alerting-config-sharing` in the same request as `.opendistro-alerting-config`. Its records refer to monitors and workflows by ID, and a restore keeps the IDs.

If you restore `.opendistro-alerting-config` without its sharing index, users other than a super admin lose access to the restored monitors, including the users who created them. To fix this, restore `.opendistro-alerting-config-sharing` from the same snapshot. Don't use the [Migrate API]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/#migrate-legacy-sharing-metadata) for this, because it shares each monitor with its creator's backend roles instead of restoring the original sharing.

## How document-level monitors continue

A document-level monitor saves the last document it checked in each shard of its data index, and continues from there after a restore. Documents written to a data index before the monitor's first run on the new cluster might not be checked. This affects only that first run. After it, the monitor checks every new document. To avoid missing any, wait until each document-level monitor has run once on the new cluster before writing new documents to its data indexes.
