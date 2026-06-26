---
layout: default
title: Event analytics
nav_order: 20
redirect_from:
  - /observing-your-data/event-analytics/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/event-analytics/
---

# Event analytics

Event analytics in Observability is where you can use [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) (PPL) queries to build and view different visualizations of your data.

## Get started with event analytics

To get started, choose **Observability** in OpenSearch Dashboards, and then choose **Event analytics**. If you want to start exploring without adding any of your own data, choose **Add sample Events Data**, and Dashboards adds some sample visualizations you can interact with.

## Build a query

To generate custom visualizations, you must first specify a PPL query. OpenSearch Dashboards then automatically creates a visualization based on the results of your query.

For example, the following PPL query returns a count of how many host addresses are currently in your data.

```
source = opensearch_dashboards_sample_data_logs | fields host | stats count()
```

By default, Dashboards shows results from the last 15 minutes of your data. To see data from a different timeframe, use the date and time selector.

For more information about building PPL queries, see [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index).

## Save a visualization

After Dashboards generates a visualization, you must save it if you want to return to it at a later time or if you want to add it to an [operational panel]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels).

To save a visualization, expand the save dropdown menu next to **Refresh**, enter a name for your visualization, then choose **Save**. You can reopen any saved visualizations on the event analytics page.

## View logs

The following are methods you can use to view logs.

### Trace log correlation

If you regularly track events across applications, you can correlate logs and traces. To view the correlation, you have to index the traces according to Open Telemetry standards (similar to trace analytics). Once you add a `TraceId` field to your logs, you can view the correlated trace information in the event explorer log details. This method lets you correlate logs and traces that correspond to the same execution context.

![Trace Log Correlation]({{site.url}}{{site.baseurl}}/images/trace_log_correlation.gif)

### View surrounding events

If you want to know more about a log event you're looking at, you can select **View surrounding events** to get a bigger picture of what was happening around the time of interest.

![Surrounding Events]({{site.url}}{{site.baseurl}}/images/surrounding_events.gif)

### Live tail

If you prefer watching events happen live, you can configure an interval so event analytics automatically refreshes the content. Live tail lets you stream logs live to OpenSearch observability event analytics based on the provided PPL query, as well as provide rich functionality such as filters. Doing so improves your debugging experience and lets you monitor your logs in real-time without having to manually refresh.

You can also choose intervals and switch between them to dictate how often live tail should stream live logs. This feature is similar to the CLI's `tail -f` command in that it only retrieves the most recent live logs by possibly eliminating a large portion of live logs. Live tail also provides you with the total count of live logs received by OpenSearch during the live stream, which you can use to better understand the incoming traffic.

![Live Tail]({{site.url}}{{site.baseurl}}/images/live_tail.gif)
