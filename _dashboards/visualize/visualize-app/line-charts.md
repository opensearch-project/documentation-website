---
layout: default
title: Line charts
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 100
redirect_from:
  - /dashboards/visualize/line-charts/
---

# Line charts

A line chart shows one or more series of numerical data points on the Y-axis plotted against a numerical field on the X-axis. The points can be connected by a line. The X-axis value can be a timeline or any other continuous or discrete number series.

## When to use line charts

Use line charts to reveal trends, cyclical behaviors, rate-of-change information, and inflection points across time or any continuous numerical quantity. Use multiple lines to show correlation between metrics.

## Creating a line chart

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a line chart, follow these steps:

1. In the **New Visualization** dialog, select **Line**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).
2. Under **Metrics**, expand **Y-axis Count**.
3. Set **Aggregation** to **Average** and **Field** to **AvgTicketPrice**.
4. (Optional) Enter a **Custom label**, for example `Average Ticket Price`.
5. Select **Update**.

   The chart displays a single bar with height of a little over `$600`, the average ticket price for every document in the flight database.

   If your visualization displays a different value, make sure that your time filter window is large enough to encompass all the sample flight data.
   {: .note}

6. Under **Buckets**, select **Add** > **X-axis**.
7. Set **Aggregation** to **Histogram** and **Field** to **DistanceKilometers**.
8. Select **Update**.

   The chart shows average ticket price as a function of bucketed flight distance.

### Adding a split series

1. Under **Buckets**, select **Add** > **Split series**.
2. Set **Sub aggregation** to **Terms**, **Field** to **dayOfWeek**, **Order by** to **Alphabetical**, and **Size** to `7`.
3. Select **Update**.

   The average ticket price is displayed per weekday value in seven different lines, as shown in the following image. The average ticket price for weekday value keys 5 and 6 are significantly higher across most flight distances.

   ![Line chart showing average ticket price compared to distance by day of week]({{site.url}}{{site.baseurl}}/images/dashboards/example-line-cost-vs-distance.png)

## Configuring a line chart

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

### Metrics & axes tab

| Setting | Description |
| :--- | :--- |
| **Chart type** | Override per series. Supports **Line**, **Area**, **Bar**. |
| **Mode** | **Normal** overlaps lines. **Stacked** is available when combining with area/bar types. |
| **Line mode** | **Straight**, **Smoothed**, or **Stepped**. |
| **Y-axis scale** | **Linear**, **Log**, or **Square root**. |

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
