---
layout: default
title: Event analytics
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/observing-your-data/event-analytics/
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

To save a visualization, expand the save dropdown menu next to **Run**, enter a name for your visualization, then choose **Save**. You can reopen any saved visualizations on the event analytics page.
