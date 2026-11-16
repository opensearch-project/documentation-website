---
layout: default
title: Application analytics
parent: Classic observability apps
nav_order: 40
---

# Application analytics

You can use application analytics to create custom observability applications to view the availability status of your systems, where you can combine log events with trace and metric data into a single view of overall system health. This lets you quickly pivot between logs, traces, and metrics to dig into the source of any issues.

Application analytics is a [classic observability app]({{site.url}}{{site.baseurl}}/observing-your-data/classic-observability-apps/). It is not available when multiple data sources are enabled. To monitor applications in an Observability workspace, see [Application performance monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/).

## Get started with application analytics

To get started, on the top menu, go to **Observability** > **Applications**.

### Create an application

1. Select **Create application**.
2. In **Application information**, enter a **Name** and, optionally, a **Description**.
3. In **Composition**, do at least one of the following:

    - In **Log source**, use [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) to specify the **Base Query**, for example, `source = opensearch_dashboards_sample_data_logs`.

      You can't change the base query after the application is created.
      {: .note }

    - Select **Services & entities** from the dropdown or the service map.
    - Select **Trace groups** from the dropdown or the table.

4. Select **Create**. To configure availability immediately, select **Create and Set Availability**.

### Create a visualization

1. Choose the **Log Events** tab.
1. Use [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) to build upon your base query. The query editor already applies the base query, so start with the next command, for example, `stats count() by span(timestamp, 1h)`, and then select **Run**.
1. Choose the **Visualizations** tab to see your visualizations.
1. Expand the **Save** dropdown menu, enter a name for your visualization, then choose **Save**.

To see your visualizations, choose the **Panel** tab.

### Configure availability

Availability is the status of your application determined by availability levels set on a [time series metric]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/#time-series-metric).

To set availability for an existing application, select the **Configuration** tab, and then select **Set Availability**. To create an availability level, you must configure the following:
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
