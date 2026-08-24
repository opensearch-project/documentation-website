---
layout: default
title: Creating aggregation-based visualizations
parent: Creating visualizations in the Visualize application
grand_parent: Building data visualizations
nav_order: 10
---

# Creating aggregation-based visualizations

[Aggregations]({{site.url}}{{site.baseurl}}/aggregations/) are the analytics engine behind most visualizations in OpenSearch Dashboards. They calculate statistics (metrics) and group data into categories (buckets) so that results can be displayed as charts, tables, and maps. When you configure a visualization in the **Visualize** application, OpenSearch Dashboards translates your selections into aggregation queries automatically.

The following visualization types use aggregations: **Area**, **Horizontal Bar**, **Vertical Bar**, **Coordinate Map**, **Data Table**, **Gauge**, **Goal**, **Heat Map**, **Line**, **Metric**, **Pie**, **Region Map**, and **Tag Cloud**.

For a complete list of available metrics and buckets, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/#data-tab).

In this tutorial, you'll create a Vertical Bar visualization using the sample flight data and learn how to use metric aggregations, bucket aggregations, split series, percentiles, pipeline aggregations, and top hits.

## Prerequisites

The examples on this page use the **Sample flight data** dataset. If you haven't added sample data yet, see [Prepare your data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Example 1: Flight count over time

This example uses the default **Count** metric with a **Date Histogram** bucket to show the number of flights per time interval.

To create a flight count visualization, follow these steps:

1. In the left navigation menu, select **OpenSearch Dashboards** > **Visualize**.
1. Select **Create visualization**.
1. Select **Vertical Bar**, then select **opensearch_dashboards_sample_data_flights** as the source.
1. Set the time filter to **Last 7 days**.
1. In the **Buckets** panel, select **Add** > **X-axis**.
1. From the **Aggregation** dropdown list, select **Date Histogram**.
1. Verify that the **Field** is set to **timestamp**.
1. Select **Update**.

The chart displays the number of flights per 3-hour interval. The Y-axis shows **Count**---the number of documents (flights) in each time bucket. Because **Count** is the default metric, no field selection is required.

![Flight count over time using Count metric and Date Histogram bucket]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-count-date-histogram.png)

## Example 2: Average ticket price over time

This example replaces Count with the **Average** metric to show how ticket prices change over time.

To change the metric to **Average**, follow these steps:

1. In the **Metrics** panel, select the **Y-axis** section.
1. From the **Aggregation** dropdown list, select **Average**.
1. From the **Field** dropdown list, select **AvgTicketPrice**.
1. Select **Update**.

The Y-axis now shows dollar values instead of document counts. Each bar represents the average ticket price across all flights in that time interval.

![Average ticket price over time]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-avg-ticket-price.png)

## Example 3: Flight count by carrier

This example adds a **Split series** bucket to break down the **Count** metric by airline carrier.

To split the series by carrier, follow these steps:

1. In the **Metrics** panel, change the **Aggregation** back to **Count**.
1. In the **Buckets** panel, select **Add** > **Split series**.
1. From the **Aggregation** dropdown list, select **Terms**.
1. From the **Field** dropdown list, select **Carrier**.
1. Select **Update**.

The chart now displays stacked bars, with each color representing a different airline. The legend identifies each carrier. This configuration creates a nested aggregation: the **Date Histogram** groups flights into time buckets, and the **Terms** aggregation subdivides each bucket by carrier.

![Flight count split by carrier]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-split-series-carrier.png)

## Example 4: Ticket price percentiles over time

This example uses the **Percentiles** metric to show the distribution of ticket prices across time intervals. Unlike **Average** (which returns a single value), **Percentiles** returns multiple values---one for each percentile you configure.

To create a **Percentiles** visualization, follow these steps:

1. In the **Metrics** panel, select the **Y-axis** section.
1. From the **Aggregation** dropdown list, select **Percentiles**.
1. From the **Field** dropdown list, select **AvgTicketPrice**.
1. In the **Percents** section, remove the default values and enter `25`, `50`, and `75` (the interquartile range). Use the delete icon next to each value to remove it, and select **Add percent** to add new ones.
1. In the **Buckets** panel, verify that the **X-axis** is set to **Date Histogram** on the **timestamp** field.
1. Select **Update**.

The chart displays three stacked series---one for each percentile. The 50th percentile (median) shows the middle value, while the gap between the 25th and 75th percentiles shows the spread of ticket prices in each time bucket.

![Ticket price percentiles over time]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-percentiles.png)

## Example 5: Cumulative flight count

This example uses the **Cumulative Sum** pipeline aggregation to show a running total of flights. Pipeline aggregations operate on the output of another metric rather than directly on document fields.

To add a cumulative sum to your visualization, follow these steps:

1. In the **Metrics** panel, verify that the first Y-axis is set to **Count**.
1. Select **Add** to create a second metric.
1. From the **Aggregation** dropdown list, scroll down to **Parent Pipeline Aggregations** and select **Cumulative Sum**.
1. In the **Metric** dropdown list, select **Custom metric**.
1. In the nested **Aggregation** dropdown list that appears, select **Count**.
1. In the **Buckets** panel, verify that the **X-axis** is set to **Date Histogram** on the **timestamp** field.
1. Select **Update**.

The chart displays the per-interval **Count** as bars along the bottom and the **Cumulative Sum** as a rising line. The line shows the total number of flights accumulated over time.

![Cumulative flight count]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-cumulative-sum.png)

## Example 6: Most recent ticket price over time

This example uses the **Top Hit** metric to display the most recent ticket price in each time bucket. **Top Hit** has the most configuration options of any metric: it lets you control which document values are returned, how many, and in what order.

To create a **Top Hit** visualization, follow these steps:

1. In the **Metrics** panel, select the **Y-axis** section.
1. From the **Aggregation** dropdown list, select **Top Hit**.
1. From the **Field** dropdown list, select **AvgTicketPrice**.
1. From the **Aggregate with** dropdown list, select **Max** (this determines how multiple values within the same bucket are combined).
1. Set **Size** to `1` (return one value per bucket).
1. From the **Sort on** dropdown list, select **timestamp**.
1. From the **Order** dropdown list, select **Descending** (most recent first).
1. In the **Buckets** panel, verify that the **X-axis** is set to **Date Histogram** on the **timestamp** field.
1. Select **Update**.

The chart displays the most recent (highest-timestamp) ticket price in each 3-hour interval. Unlike **Average**, which smooths all values together, **Top Hit** shows a single document's actual value, which is useful for tracking the latest state per time window.

![Most recent ticket price over time using Top Hit]({{site.url}}{{site.baseurl}}/images/dashboards/aggregation-viz-top-hit.png)

## Next steps

- To learn about all available metric and bucket aggregations, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/#data-tab).
- To understand how aggregations work in the API, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
