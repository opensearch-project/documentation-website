---
layout: default
title: Event analytics
nav_order: 10
---

# Event analytics

Event analytics in observability is where you can use [Piped Processing Language]({{site.url}}{{site.baseurl}}/observability-plugin/ppl/index) (PPL) queries to build and view different visualizations of your data.

## Get started with event analytics

To get started, choose **Observability** in OpenSearch Dashboards, and then choose **Event analytics**. If you want to start exploring without adding any of your own data, choose **Add sample Events Data**, and Dashboards adds some sample visualizations you can interact with.

## Build a query

To generate custom visualizations, you must first specify a PPL query. OpenSearch Dashboards then automatically creates a visualization based on the results of your query.

For example, the following PPL query returns a count of how many host addresses are currently in your data.

```
source = opensearch_dashboards_sample_data_logs | fields host | stats count()
```

By default, Dashboards shows results from the last 15 minutes of your data. To see data from a different timeframe, use the date and time selector.

For more information about building PPL queries, see [Piped Processing Language]({{site.url}}{{site.baseurl}}/observability-plugin/ppl/index).

## Save a visualization

After Dashboards generates a visualization, you must save it if you want to return to it at a later time or if you want to add it to an [operational panel]({{site.url}}{{site.baseurl}}/observability-plugin/operational-panels).

To save a visualization, expand the save dropdown menu next to **Refresh**, enter a name for your visualization, then choose **Save**. You can reopen any saved visualizations on the event analytics page.

## View logs

Users have several ways to view their logs.

### Trace log correlation

Users who regularly track events across applications have the capability to correlate logs and traces. To view the correlation, users have to index the traces as per the Open Telemetry standards (similar to Trace analytics). Once users add a **TraceId** field to their logs, they can view the trace information that corresponds to the same execution context as the log.

![Trace Log Correlation]({{site.url}}{{site.baseurl}}/images/trace_log_correlation.gif)

### Surrounding events

Users who want to know more about a log event that they are looking at can select **View surrounding events** to get a bigger picture of what was happening around the time of interest. 

![Surrounding Events]({{site.url}}{{site.baseurl}}/images/surrounding_events.gif)

### Live Tail

Users watching a live event take place can now configure the interval in which content is refreshed saving the hassle of manually refreshing. This provides users with a faster debugging experience, and allows them to monitor their logs in real-time. Users also have the convenience of choosing the interval at which live tail should update. As this feature mimics the "tail -f" command in command line, it only retrieves the most recent live logs by possibly eliminating a heavy load of live logs.

![Live Tail]({{site.url}}{{site.baseurl}}/images/live_tail.gif)