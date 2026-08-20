---
layout: default
title: Management
parent: Alerting
nav_order: 5
redirect_from:
  - /monitoring-plugins/alerting/settings/
---

# Alerting management

The following sections describe alerting indexes and settings.

## Alerting indexes

The alerting feature creates several indexes and one alias. The Security plugin demo script configures them as [system indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/) for an extra layer of protection. Don't delete these indexes or modify their contents without using the alerting APIs.

Index | Purpose
:--- | :---
`.opendistro-alerting-alerts` | Stores ongoing alerts.
`.opendistro-alerting-alert-history-<date>` | Stores a history of completed alerts.
`.opendistro-alerting-config` | Stores monitors, triggers, and destinations. [Take a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/) of this index to back up your alerting configuration.
`.opendistro-alerting-alert-history-write` (alias) | Provides a consistent URI for the `.opendistro-alerting-alert-history-<date>` index.

All alerting indexes are hidden by default. For a summary, make the following request:

```json
GET _cat/indices?expand_wildcards=open,hidden
```
{% include copy-curl.html %}

## Alerting settings

We don't recommend changing these settings; the defaults should work well for most use cases.

All settings are available using the OpenSearch `_cluster/settings` API. None require a restart, and all can be marked `persistent` or `transient`. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

OpenSearch supports the following alerting settings:

- `plugins.scheduled_jobs.enabled` (Dynamic, Boolean): Whether the Alerting plugin is enabled or not. If disabled, all monitors immediately stop running. Default is `true`.

- `plugins.alerting.index_timeout` (Dynamic, time unit): The timeout for creating monitors and destinations using the REST APIs. Default is `60s`.

- `plugins.alerting.request_timeout` (Dynamic, time unit): The timeout for miscellaneous requests from the plugin. Default is `10s`.

- `plugins.alerting.action_throttle_max_value` (Dynamic, time unit): The maximum amount of time you can set for action throttling. By default, this value displays as 1440 minutes in OpenSearch Dashboards. Default is `24h`.

- `plugins.alerting.input_timeout` (Dynamic, time unit): How long the monitor can take to issue the search request. Default is `30s`.

- `plugins.alerting.bulk_timeout` (Dynamic, time unit): How long the monitor can write alerts to the alert index. Default is `120s`.

- `plugins.alerting.alert_backoff_count` (Dynamic, integer): The number of retries for writing alerts before the operation fails. Default is `2`.

- `plugins.alerting.alert_backoff_millis` (Dynamic, time unit): The amount of time to wait between retries---increases exponentially after each failed retry. Default is `50ms`.

- `plugins.alerting.alert_history_rollover_period` (Dynamic, time unit): How frequently to check whether the `.opendistro-alerting-alert-history-write` alias should roll over to a new history index and whether the Alerting plugin should delete any history indexes. Default is `12h`.

- `plugins.alerting.move_alerts_backoff_millis` (Dynamic, time unit): The amount of time to wait between retries---increases exponentially after each failed retry. Default is `250ms`.

- `plugins.alerting.move_alerts_backoff_count` (Dynamic, integer): The number of retries for moving alerts to a deleted state after their monitor or trigger has been deleted. Default is `3`.

- `plugins.alerting.monitor.max_monitors` (Dynamic, integer): The maximum number of monitors users can create. Default is `1000`.

- `plugins.alerting.alert_history_max_age` (Dynamic, time unit): The oldest document to store in the `.opendistro-alert-history-<date>` index before creating a new index. If the number of alerts in this time period does not exceed `alert_history_max_docs`, alerting creates one history index per period (for example, one index every 30 days). Default is `30d`.

- `plugins.alerting.alert_history_max_docs` (Dynamic, long): The maximum number of alerts to store in the `.opendistro-alert-history-<date>` index before creating a new index. Default is `1000`.

- `plugins.alerting.alert_history_enabled` (Dynamic, Boolean): Whether to create `.opendistro-alerting-alert-history-<date>` indexes. Default is `true`.

- `plugins.alerting.alert_history_retention_period` (Dynamic, time unit): The amount of time to store history indexes before automatically deleting them. Default is `60d`.

- `plugins.alerting.destination.allow_list` (Dynamic, list): The list of allowed destinations. If you don't want to allow users to a certain type of destination, you can remove it from this list, but we recommend leaving this setting as-is. Default is `["chime", "slack", "custom_webhook", "email", "test_action"]`.

- `plugins.alerting.filter_by_backend_roles` (Dynamic, Boolean): Restricts access to monitors by backend role. See [Alerting security]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/). Default is `false`.

- `plugins.alerting.filter_by_backend_roles_access_strategy` (Dynamic, string): Controls how user backend roles are compared with the backend roles associated with a monitor to determine whether a user can access the monitor. Valid values are `all`, `exact`, and `intersect`. See [Alerting security documentation on filtering by backend role]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/#advanced-limit-access-by-backend-role). Default is `intersect`.

- `plugins.alerting.cross_cluster_monitoring_enabled` (Dynamic, Boolean): Toggles whether cluster metrics monitors support running against remote clusters. Default is `true`.

- `plugins.scheduled_jobs.sweeper.period` (Dynamic, time unit): The alerting feature uses its "job sweeper" component to periodically check for new or updated jobs. This setting is the rate at which the sweeper checks to see if any jobs (monitors) have changed and need to be rescheduled. Default is `5m`.

- `plugins.scheduled_jobs.sweeper.page_size` (Dynamic, integer): The page size for the sweeper. You shouldn't need to change this value. Default is `100`.

- `plugins.scheduled_jobs.sweeper.backoff_millis` (Dynamic, time unit): The amount of time the sweeper waits between retries---increases exponentially after each failed retry. Default is `50ms`.

- `plugins.scheduled_jobs.retry_count` (Dynamic, integer): The total number of times the sweeper should retry before throwing an error. Default is `3`.

- `plugins.scheduled_jobs.request_timeout` (Dynamic, time unit): The timeout for the request that sweeps shards for jobs. Default is `10s`.

- `plugins.alerting.comments_enabled` (Dynamic, Boolean): Enables or disables comments for the Alerting plugin. Default is `true`.

- `plugins.alerting.comments_history_max_docs` (Dynamic, long): The maximum number of comments to store in the `.opensearch-alerting-comments-history-<date>` index before creating a new index. Default is `1000`.

- `plugins.alerting.comments_history_max_age` (Dynamic, time unit): The oldest document to store in an `.opensearch-alerting-comments-history-<date>` index before creating a new one. If the number of comments in the specified time period does not exceed `comments_history_max_docs`, then 1 index is created per period (for example, 1 every 30 days). Default is `30d`.

- `plugins.alerting.comments_history_rollover_period` (Dynamic, time unit): How often to determine whether the `.opensearch-alerting-comments-history-write` alias should roll over to a new index and delete old comment history indexes. Default is `12h`.

- `plugins.alerting.comments_history_retention_period` (Dynamic, time unit): The amount of time to keep comment history indexes before automatic deletion. Default is `60d`.

- `plugins.alerting.max_comment_character_length` (Dynamic, long): The maximum character length of a comment. Default is `2000`.

- `plugins.alerting.max_comments_per_alert` (Dynamic, long): The maximum number of comments that can be posted on an alert. Default is `500`.

- `plugins.alerting.max_comments_per_notification` (Dynamic, integer): The maximum number of comments per alert to include in the `ctx` Mustache template variable for alert notifications. Default is `3`.

### PPL monitor settings

For information about PPL monitor settings, see [PPL monitor settings]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/ppl-monitors/).