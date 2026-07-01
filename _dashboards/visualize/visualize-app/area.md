---
layout: default
title: Area charts
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 30
redirect_from:
  - /dashboards/visualize/area/
---

# Area charts

An area chart is a line chart with the area below the line shaded with a color. You can stack multiple buckets to show relative proportions of a running absolute value of the variable, or superimpose buckets or different variables to compare within x-axis buckets or time values.

## When to use area charts

Use area charts to show both trend patterns and proportional relationships simultaneously. They reveal contribution patterns, showing which components drive overall totals and when those patterns change.

## Creating an area chart

The examples on this page use the **Sample flight data** dataset and build on each other. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create an area chart that shows flight count over time, follow these steps:

1. In the **New Visualization** dialog, select **Area**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).
2. Under **Metrics**, expand **Y-axis Count** and set **Aggregation** to **Count**.

   For the `Count` metric there is no Field selection because `Count` denotes the number of documents, not a field value.

3. Under **Buckets**, select **Add** > **X-axis**.
4. Set **Aggregation** to **Date Histogram** and **Field** to **timestamp**.

   The timestamp field is the only date-time field available in the sample flight data.
   {: .note}

5. Select **Update**.

   The chart generates a jagged time-series plot of the document count for an automatically determined bucket size (for example, one day).

6. Drag-select the portion of the chart containing the data. Leave a margin on either side of the data so as not to cut any data off.

   The data expands to fill the entire width of the graph. Since there's more room, the auto-calculated bucket size decreases to 12 hours.

7. Under **Buckets**, select **Add** > **Split series**.
8. Set **Sub aggregation** to **Terms** and **Field** to **Cancelled**.
9. Select **Update**.

   The chart shows the counts of cancelled and uncancelled flights superimposed on the timeline, as shown in the following image.

   ![Area chart with flight cancellation status overlaid]({{site.url}}{{site.baseurl}}/images/dashboards/example-area-normal-count.png)

   Note the following:
   - The count of cancelled (`Cancelled = true`) and uncancelled flights are superimposed on the graph. The cancelled flight count seems to average about 10% of the uncancelled flights.
   - The flight count is cyclic over time, with a one-day dip every week.

### Stacked area chart

By default, split series are overlaid (Normal mode). To stack the areas on top of each other so they show the total volume:

1. Select the **Metrics & axes** tab.
2. Under **Metrics**, expand the **Count** series.
3. Change **Mode** from **Normal** to **Stacked**.
4. Select **Update**.

The areas are now stacked, showing both individual category volumes and the combined total, as shown in the following image.

![Stacked area chart showing flight cancellation status]({{site.url}}{{site.baseurl}}/images/dashboards/example-area-stacked-count.png)

### Multiple metrics

Add a second Y-axis metric to compare different measurements on the same chart:

1. Under **Metrics**, select **Add**.
2. Set **Aggregation** to **Average** and **Field** to **AvgTicketPrice**.
3. Select **Update**.

The chart now overlays the average ticket price on top of the count. To give the second metric its own scale, go to the **Metrics & axes** tab, expand the new metric, and assign it to a new value axis.

## Configuring an area chart

The area chart editor has three configuration tabs.

### Data tab

The **Data** tab defines what data is displayed.

#### Metrics

Metrics define the Y-axis values. Each metric computes an aggregation over the documents in each bucket.

| Setting | Description |
| :--- | :--- |
| **Aggregation** | The aggregation function. Supported values: **Count**, **Average**, **Sum**, **Min**, **Max**, **Unique Count**, **Median**, **Percentiles**, **Percentile Ranks**, **Top Hit**, **Standard Deviation**. |
| **Field** | The numeric field to aggregate (not required for **Count**). |

Select **Add** to plot multiple metrics on the same chart.

#### Buckets

Buckets define how data is grouped.

| Bucket type | Description |
| :--- | :--- |
| **X-axis** | Groups data along the horizontal axis. Typically uses a **Date Histogram** for time-based data or a **Histogram** for numeric ranges. |
| **Split series** | Splits the data into multiple stacked (or overlaid) areas by the values of a field. Uses **Terms**, **Filters**, or other bucket aggregations. |
| **Split chart** | Creates separate chart panels for each bucket value (small multiples). Can split in rows or columns. |

### Metrics & axes tab

The **Metrics & axes** tab controls how each metric is rendered and how the axes are configured.

#### Series settings

Each metric series has the following options.

| Setting | Description |
| :--- | :--- |
| **Value axis** | The Y-axis this series is plotted against. Select **New axis** to create a secondary Y-axis. |
| **Chart type** | Overrides the chart type for this series. Supported values: **Line**, **Area**, **Bar**. |
| **Mode** | Controls stacking behavior. **Stacked** layers areas on top of each other. **Normal** overlaps areas. |
| **Line mode** | Controls line interpolation. **Straight** draws direct segments. **Smoothed** applies a curve. **Stepped** creates a staircase pattern. |

#### Y-axes

Each Y-axis has the following options.

| Setting | Description |
| :--- | :--- |
| **Position** | Where the axis appears. Supported values: **Left**, **Right**. |
| **Mode** | Controls the Y-axis scale mode. **Normal** displays raw values. **Percentage** normalizes stacked areas to 100%. **Wiggle** and **Silhouette** are stream graph layout variants. |
| **Scale type** | Determines the scale. Supported values: **Linear**, **Log**, **Square root**. |
| **Show** | Shows or hides the axis line and labels. |
| **Labels** | Controls label rotation. Supported values: **Horizontal**, **Vertical**, **Angled**. |

#### X-axis

| Setting | Description |
| :--- | :--- |
| **Position** | Where the axis appears. Supported values: **Top**, **Bottom**. |
| **Show** | Shows or hides the axis line and labels. |
| **Filter labels** | When enabled, overlapping labels are automatically hidden. |
| **Align** | Controls label rotation. Supported values: **Horizontal**, **Vertical**, **Angled**. |
| **Truncate** | Sets the maximum pixel width for labels before truncation. |

### Panel settings tab

The **Panel settings** tab controls the overall chart appearance.

#### Settings

| Setting | Description |
| :--- | :--- |
| **Legend position** | Where the legend appears. Supported values: **Top**, **Left**, **Right**, **Bottom**. |
| **Show tooltip** | When enabled, displays values on hover. |
| **Order buckets by sum** | When enabled, orders split series by their total value rather than alphabetically. |

#### Grid

| Setting | Description |
| :--- | :--- |
| **Show X-axis lines** | When enabled, displays vertical grid lines at each X-axis tick. |
| **Y-axis lines** | Select a Y-axis to display horizontal grid lines, or **Don't show** to hide them. |

#### Threshold line

| Setting | Description |
| :--- | :--- |
| **Show threshold line** | When enabled, draws a horizontal reference line at a specified value. |
| **Threshold value** | The Y-axis value at which the line is drawn. |
| **Line width** | The thickness of the threshold line in pixels. |
| **Line style** | The line style. Supported values: **Full** (solid), **Dashed**, **Dot-dashed**. |
| **Line color** | The color of the threshold line. |

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
