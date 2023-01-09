---
layout: default
title: Application analytics
nav_order: 10
redirect_from:
  - /observing-your-data/app-analytics/
---

# Application analytics

You can use application analytics to create custom observability applications to view the availability status of your systems, where you can combine log events with trace and metric data into a single view of overall system health. This lets you quickly pivot between logs, traces, and metrics to dig into the source of any issues.

## Get started with application analytics

To get started, select the Menu button on the upper left corner of the OpenSearch Dashboards interface. Next, select **Observability**, and then choose **Application analytics**.

### Create an application

1. Choose **Create application**.
2. Enter a name for your application and optionally add a description.
3. Do at least one of the following:

- Use [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) to specify the base query.

You can't change the base query after the application is created.
{: .note }

- Select services & entities from the dropdown or the service map.
- Select trace groups from the dropdown or the table.

4\. Choose **Create**.

### Create a visualization

1. Choose the **Log Events** tab.
1. Use [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) to build upon your base query.
1. Choose the **Visualizations** tab to see your visualizations.
1. Expand the **Save** dropdown menu, enter a name for your visualization, then choose **Save**.

To see your visualizations, choose the **Panel** tab.

### Configure availability

Availability is the status of your application determined by availability levels set on a [time series metric]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/#time-series-metric).

To create an availability level, you must configure the following:
- color: The color of the availability badge on the home page.
- name: The text in the availability badge on the home page.
- expression: Comparison operator to determine the availability.
- value: Value to use when calculating availability.

![Configuring availability]({{site.url}}{{site.baseurl}}/images/app_availability_level.gif)

By default, application analytics shows results from the last 24 hours of your data. To see data from a different time frame, use the date and time selector.

#### Time series metric

A time series metric is any visualization that has a query that spans over a timestamp and is a line chart. You can then use PPL to define arbitrary conditions on your logs to create a visualization over time.

##### Example
```
source = <index_name> | ... | ... | stats ... by span(<timestamp_field>, 1h)
```

Choose **Line** in visualization configurations to create a time series metric.

![Changing visualization to line chart]({{site.url}}{{site.baseurl}}/images/visualization-line-type.gif)
