---
layout: default
title: Management
parent: Alerting
nav_order: 5
redirect_from:
  - /monitoring-plugins/alerting/settings/
---

# Management


## Alerting indexes

The alerting feature creates several indexes and one alias. The Security plugin demo script configures them as [system indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/) for an extra layer of protection. Don't delete these indexes or modify their contents without using the alerting APIs.

Index | Purpose
:--- | :---
`.opendistro-alerting-alerts` | Stores ongoing alerts.
`.opendistro-alerting-alert-history-<date>` | Stores a history of completed alerts.
`.opendistro-alerting-config` | Stores monitors, triggers, and destinations. [Take a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore) of this index to back up your alerting configuration.
`.opendistro-alerting-alert-history-write` (alias) | Provides a consistent URI for the `.opendistro-alerting-alert-history-<date>` index.

All alerting indexes are hidden by default. For a summary, make the following request:

```
GET _cat/indices?expand_wildcards=open,hidden
```


## Alerting settings

We don't recommend changing these settings; the defaults should work well for most use cases.

All settings are available using the OpenSearch `_cluster/settings` API. None require a restart, and all can be marked `persistent` or `transient`. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

Setting | Default | Description
:--- | :--- | :---
`plugins.scheduled_jobs.enabled` | true | Whether the alerting plugin is enabled or not. If disabled, all monitors immediately stop running.
`plugins.alerting.index_timeout` | 60s | The timeout for creating monitors and destinations using the REST APIs.
`plugins.alerting.request_timeout` | 10s | The timeout for miscellaneous requests from the plugin.
`plugins.alerting.action_throttle_max_value` | 24h | The maximum amount of time you can set for action throttling. By default, this value displays as 1440 minutes in OpenSearch Dashboards.
`plugins.alerting.input_timeout` | 30s | How long the monitor can take to issue the search request.
`plugins.alerting.bulk_timeout` | 120s | How long the monitor can write alerts to the alert index.
`plugins.alerting.alert_backoff_count` | 3 | The number of retries for writing alerts before the operation fails.
`plugins.alerting.alert_backoff_millis` | 50ms | The amount of time to wait between retries---increases exponentially after each failed retry.
`plugins.alerting.alert_history_rollover_period` | 12h | How frequently to check whether the `.opendistro-alerting-alert-history-write` alias should roll over to a new history index and whether the Alerting plugin should delete any history indexes.
`plugins.alerting.move_alerts_backoff_millis` | 250 | The amount of time to wait between retries---increases exponentially after each failed retry.
`plugins.alerting.move_alerts_backoff_count` | 3 | The number of retries for moving alerts to a deleted state after their monitor or trigger has been deleted.
`plugins.alerting.monitor.max_monitors` | 1000 | The maximum number of monitors users can create.
`plugins.alerting.alert_history_max_age` | 30d | The oldest document to store in the `.opendistro-alert-history-<date>` index before creating a new index. If the number of alerts in this time period does not exceed `alert_history_max_docs`, alerting creates one history index per period (e.g. one index every 30 days).
`plugins.alerting.alert_history_max_docs` | 1000 | The maximum number of alerts to store in the `.opendistro-alert-history-<date>` index before creating a new index.
`plugins.alerting.alert_history_enabled` | true | Whether to create `.opendistro-alerting-alert-history-<date>` indexes.
`plugins.alerting.alert_history_retention_period` | 60d | The amount of time to keep history indexes before automatically deleting them.
`plugins.alerting.destination.allow_list` | ["chime", "slack", "custom_webhook", "email", "test_action"] | The list of allowed destinations. If you don't want to allow users to a certain type of destination, you can remove it from this list, but we recommend leaving this setting as-is.
`plugins.alerting.filter_by_backend_roles` | "false" | Restricts access to monitors by backend role. See [Alerting security]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/).
`plugins.scheduled_jobs.sweeper.period` | 5m | The alerting feature uses its "job sweeper" component to periodically check for new or updated jobs. This setting is the rate at which the sweeper checks to see if any jobs (monitors) have changed and need to be rescheduled.
`plugins.scheduled_jobs.sweeper.page_size` | 100 | The page size for the sweeper. You shouldn't need to change this value.
`plugins.scheduled_jobs.sweeper.backoff_millis` | 50ms | The amount of time the sweeper waits between retries---increases exponentially after each failed retry.
`plugins.scheduled_jobs.sweeper.retry_count` | 3 | The total number of times the sweeper should retry before throwing an error.
`plugins.scheduled_jobs.request_timeout` | 10s | The timeout for the request that sweeps shards for jobs.
