---
layout: default
title: Monitors
nav_order: 10
parent: Alerting
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Alerting monitors

A monitor is a job that runs on a schedule, queries your data or cluster, and passes the results to its triggers. When a trigger condition is met, the monitor generates an alert and can perform actions, such as sending a notification. This page describes the monitor types, how to schedule monitors, and the variables available in trigger conditions and action messages.

To generate alerts from anomaly detection results, create a per query monitor using the **Anomaly detector** defining method. For more information, see [Per query and per bucket monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/).

## Monitor types

Alerting provides the following monitor types.

Monitor type | Description
:--- | :---
[Per query monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) | Runs a query and generates alerts based on the query results.
[Per bucket monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) | Runs a query that evaluates trigger criteria based on aggregated values in the dataset.
[PPL monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/ppl-monitors/) | Runs a Piped Processing Language (PPL) query and generates alerts based on the number of results or a custom condition.
[Per cluster metrics monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-cluster-metrics-monitors/) | Runs API requests on the cluster to monitor its health.
[Per document monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-document-monitors/) | Runs a query (or multiple queries combined by a tag) that returns individual documents that match the trigger condition.
[Composite monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/composite-monitors/) | Runs multiple monitors in a single workflow and generates a single alert based on multiple trigger conditions.

By default, you can create up to 1,000 monitors. To change this limit, update the `plugins.alerting.monitor.max_monitors` setting using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). For more information, see [Alerting settings]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).
{: .tip}

## Monitor schedules

A monitor runs either at a fixed interval, such as every hour or every day, or on a schedule that you define with a cron expression. Use a cron expression when the interval does not describe when you need the monitor to run, such as every weekday at 11:30 AM. For the syntax, see [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/cron-expressions/).

For a monitor that uses a cron expression, see [Create a query-level monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/#example-request-2).

## Monitor variables

The following table lists the variables available for customizing your monitors.

Variable | Data type | Description
:--- | :--- | :---
`ctx.monitor` | Object | Includes `ctx.monitor.name`, `ctx.monitor.type`, `ctx.monitor.enabled`, `ctx.monitor.enabled_time`, `ctx.monitor.schedule`, `ctx.monitor.inputs`, `triggers` and `ctx.monitor.last_update_time`.
`ctx.monitor.user` | Object | Includes information about the user who created the monitor. Includes `ctx.monitor.user.backend_roles` and `ctx.monitor.user.roles`, which are arrays that contain the backend roles and roles assigned to the user. See [alerting security]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/) for more information.
`ctx.monitor.enabled` | Boolean | Whether the monitor is enabled.
`ctx.monitor.enabled_time` | Milliseconds | Unix epoch time of when the monitor was last enabled.
`ctx.monitor.schedule` | Object | Contains a schedule of how often or when the monitor should run.
`ctx.monitor.schedule.period.interval` | Integer | The interval at which the monitor runs.
`ctx.monitor.schedule.period.unit` | String | The interval's unit of time.
`ctx.monitor.inputs` | Array | An array that contains the indexes and definition used to create the monitor.
`ctx.monitor.inputs.search.indices` | Array | An array that contains the indexes the monitor observes.
`ctx.monitor.inputs.search.query` | Object | The query that the monitor runs.

The following table lists other variables you can use with your monitors.

Variable | Data type | Description
:--- | :--- | :---
`ctx.results` | Array | An array with one element, for example,  `ctx.results[0]`. Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every 10 minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | Object | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active. Only available with query-level monitors.
`ctx.dedupedAlerts` | Object | Alerts that have already been triggered. OpenSearch keeps the existing alert to prevent the monitor from repeatedly creating the same alert. Only available with bucket-level monitors.
`ctx.newAlerts` | Object | Newly created alerts. Only available with bucket-level monitors.
`ctx.completedAlerts` | Object | Alerts that are no longer ongoing. Only available with bucket-level monitors.
`bucket_keys` | String | Comma-separated list of the monitor's bucket key values. Available only for `ctx.dedupedAlerts`, `ctx.newAlerts`, and `ctx.completedAlerts`. Accessed through `ctx.dedupedAlerts[0].bucket_keys`.
`parent_bucket_path` | String | The parent bucket path of the bucket that triggered the alert. Accessed through `ctx.dedupedAlerts[0].parent_bucket_path`.

