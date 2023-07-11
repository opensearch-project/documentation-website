---
layout: default
title: Create monitors
nav_order: 5
parent: Monitors
grand_parent: Alerting
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Create monitors

The Alerting plugin provides four monitor types:

1. **per query**: Runs a query and generates alert notifications based on the matching criteria.
1. **per bucket**: Runs a query that evaluates trigger criteria based on aggregated values in the dataset.
1. **per cluster metrics**: Runs API requests on the cluster to monitor its health.
1. **per document**: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition.

To create a monitor:

1. In the **OpenSearch Plugins** main menu, choose **Alerting**.
1. Choose **Create monitor**.
1. Enter the **Monitor details**, including monitor type, method, and schedule.  
1. Select a data source from the dropdown list.
1. Define the metrics in the Query section.
1. Add [triggers](insert-link).
1. Select **Create**.

The maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by calling the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/) `plugins.alerting.monitor.max_monitors`.
{: .note} 

#### Monitor variables

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

## Create per document monitors
Introduced 2.0
{: .label .label-purple }



## Create cluster metrics monitors



## Next steps

- [Create triggers](<insert-link>)
- Learn about [Notifications]({{site.url}}{{site.baseurl}}observing-your-data/notifications/index/)
