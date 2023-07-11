---
layout: default
title: Getting started with alerting
nav_order: 5
grand_parent: Alerting
parent: Monitors
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Getting started with alerting

To create an alert, you configure a _monitor_, which is a job that runs on a defined schedule and queries OpenSearch indexes. You also configure one or more _triggers_, which define the conditions that generate events. Finally, you configure _actions_, which is what happens after an alert is triggered.

## Create a monitor

1. Choose **Alerting** and then **Create monitor**.
1. Specify a name for the monitor.
1. Choose either **Per query monitor**, **Per bucket monitor**, **Per cluster metrics monitor**, or **Per document monitor**.

OpenSearch supports the following monitor types:

- **Per query monitor** runs a specified query and then checks whether the query's results trigger any alerts. Per query monitors can only trigger one alert at a time. 
- **Per bucket monitor** creates buckets based on selected fields and then categorizes the results into those buckets. The Alerting plugin runs each bucket's unique results against a script you define later, so you have finer control over which results should trigger alerts. Each bucket can trigger an alert.

The maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by calling the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/) `plugins.alerting.monitor.max_monitors`.

1. Define the query and triggers. You can use any of the following monitor methods: visual editor, extraction query editor, or anomaly detector.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index/)) and how you evaluate the results of that query (Painless scripting).

     Following is an example of averaging the `cpu_usage` field:

     ```json
     {
       "size": 0,
       "query": {
         "match_all": {}
       },
       "aggs": {
         "avg_cpu": {
           "avg": {
             "field": "cpu_usage"
           }
         }
       }
     }
     ```

     Following is an example of filtering query results using `{% raw %}{{period_start}}{% endraw %}` and `{% raw %}{{period_end}}{% endraw %}`:

     ```json
     {
       "size": 0,
       "query": {
         "bool": {
           "filter": [{
             "range": {
               "timestamp": {
                 "from": "{% raw %}{{period_end}}{% endraw %}||-1h",
                 "to": "{% raw %}{{period_end}}{% endraw %}",
                 "include_lower": true,
                 "include_upper": true,
                 "format": "epoch_millis",
                 "boost": 1
               }
             }
           }],
           "adjust_pure_negative": true,
           "boost": 1
         }
       },
       "aggregations": {}
     }
     ```

"Start" and "end" refer to the interval at which the monitor runs.

### Monitor variables

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

### Visual editor

To define a monitor visually, choose **Visual editor**. Then choose a source index, a time frame, an aggregation (for example, `count()` or `average()`), a data filter if you want to monitor a subset of your source index, and a group-by field if you want to include an aggregation field in your query. At least one group-by field is required if you're defining a bucket-level monitor. Visual definition works well for most monitors.

If you use the Security plugin, you can only choose indexes that you have permission to access. See [Alerting security]({{site.url}}{{site.baseurl}}/security/) for more information.

### Extraction query editor

To use a query, choose **Extraction query editor**, add your query (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index/)), and test it using the **Run** button.

The monitor makes this query to OpenSearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.
    
### Anomaly detector
    
Anomaly detection is available only if you are defining a per query monitor.
{: .note}

To use an anomaly detector, choose **Anomaly detector** and select **Detector**. The anomaly detection option is for pairing with the [Anomaly Detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/) plugin. Choose an appropriate schedule for the monitor based on the detector interval. Otherwise, the alerting monitor can miss reading the results.

For example, assume you set the monitor interval and the detector interval as 5 minutes and you start the detector at 12:00. If an anomaly is detected at 12:05, it might be available at 12:06 because of the delay between writing the anomaly and it being available for queries. The monitor reads the anomaly results between 12:00 and 12:05, so it does not get the anomaly results available at 12:06.

To avoid this issue, make sure the alerting monitor is at least twice the detector interval. When you create a monitor using OpenSearch Dashboards, the anomaly detector plugin generates a default monitor schedule that's twice the detector interval. Whenever you update a detector’s interval, make sure to also update the associated monitor interval, as the Anomaly Detection plugin does not do this automatically.

1. Choose how frequently to run the monitor. You can run it either by time intervals (minutes, hours, days) or on a schedule. If you run it on a daily, weekly, or monthly schedule or according to a [custom cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/), the you also define the time zone.
1. Add a trigger to your monitor.

## Next step

- [Creating triggers](<insert-link>)
- [Creating actions](<insert-link>)