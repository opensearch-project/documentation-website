---
layout: default
title: Monitors
nav_order: 1
parent: Alerting
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Monitors

Proactively monitor your data in OpenSearch with features available in Alerting and Anomaly Detection. For example, you can pair Anomaly Detection with Alerting to ensure that you're notified as soon as an anomaly is detected. You can do this by setting up a detector to automatically detect outliers in your streaming data and monitors to alert you through notifications when data exceeds certain thresholds. 

## Monitor types

The Alerting plugin provides the following monitor types:

1. **per query**: Runs a query and generates alert notifications based on the matching criteria. See [Per query monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) for information about creating and using this monitor type.
1. **per bucket**: Runs a query that evaluates trigger criteria based on aggregated values in the dataset. See [Per bucket monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) for information about creating and using this monitor type.
1. **per cluster metrics**: Runs API requests on the cluster to monitor its health. See [Per cluster metrics monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-cluster-metrics-monitors/) for information about creating and using this monitor type.
1. **per document**: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition. See [Per document monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-document-monitors/) for information about creating and using this monitor type.
1. **composite monitor**: Runs multiple monitors in a single workflow and generates a single alert based on multiple trigger conditions. See [Composite monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/composite-monitors/) for information about creating and using this monitor type.

The maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by updating the `plugins.alerting.monitor.max_monitors` setting using the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).
{: .tip}

## Monitor variables

The following table lists the variables available for customizing your monitors.

Variable | Data type | Description
:--- | :--- | :---
`ctx.monitor` | Object | Includes `ctx.monitor.name`, `ctx.monitor.type`, `ctx.monitor.enabled`, `ctx.monitor.enabled_time`, `ctx.monitor.schedule`, `ctx.monitor.inputs`, `triggers` and `ctx.monitor.last_update_time`.
`ctx.monitor.user` | Object | Includes information about the user who created the monitor. Includes `ctx.monitor.user.backend_roles` and `ctx.monitor.user.roles`, which are arrays that contain the backend roles and roles assigned to the user. See [alerting security]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/) for more information.
`ctx.monitor.enabled` | Boolean | Whether the monitor is enabled.
`ctx.monitor.enabled_time` | Milliseconds | Unix epoch time of when the monitor was last enabled.
`ctx.monitor.schedule` | Object | Contains a schedule of how often or when the monitor should run.
`ctx.monitor.schedule.period.interval` | Integer | The interval at which the monitor runs.
`ctx.monitor.schedule.period.unit` | String | The interval's unit of time.
`ctx.monitor.inputs` | Array | An array that contains the indexes and definition used to create the monitor.
`ctx.monitor.inputs.search.indices` | Array | An array that contains the indexes the monitor observes.
`ctx.monitor.inputs.search.query` | N/A | The definition used to define the monitor.

The following table lists other variables you can use with your monitors.

Variable | Data type | Description
:--- | :--- : :---
`ctx.results` | Array | An array with one element, for example,  `ctx.results[0]`. Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every 10 minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | Object | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active. Only available with query-level monitors.
`ctx.dedupedAlerts` | Object | Alerts that have already been triggered. OpenSearch keeps the existing alert to prevent the plugin from creating endless amounts of the same alerts. Only available with bucket-level monitors.
`ctx.newAlerts` | Object | Newly created alerts. Only available with bucket-level monitors.
`ctx.completedAlerts` | Object | Alerts that are no longer ongoing. Only available with bucket-level monitors.
`bucket_keys` | String | Comma-separated list of the monitor's bucket key values. Available only for `ctx.dedupedAlerts`, `ctx.newAlerts`, and `ctx.completedAlerts`. Accessed through `ctx.dedupedAlerts[0].bucket_keys`.
`parent_bucket_path` | String | The parent bucket path of the bucket that triggered the alert. Accessed through `ctx.dedupedAlerts[0].parent_bucket_path`.

