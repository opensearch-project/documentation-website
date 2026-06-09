---
layout: default
title: Area charts
parent: Visualize application
grand_parent: Building data visualizations
nav_order: 5
redirect_from:
  - /dashboards/visualize/area/
---

# Area charts

An area chart displays data as a filled region between a line and the axis. Area charts are ideal for visualizing volume over time and for comparing how multiple categories contribute to a total when stacked.

## Creating an area chart

The following examples use the **Sample flight data** dataset and build on each other. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).

### Basic area chart

To create an area chart that shows flight count over time, follow these steps:

1. In the **New Visualization** dialog, select **Area**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).
2. Set the time filter to **Last 7 days** and select **Update**.
3. Under **Buckets**, select **Add** > **X-axis**.
4. Set **Aggregation** to **Date Histogram** and **Field** to **timestamp**.
5. Select **Update**.

The result is a single filled area showing the total flight count per time interval.

### Stacked area chart

Add a sub-bucket to split the data into stacked series by category:

1. Under **Buckets**, select **Add** > **Split series**.
2. Set **Sub aggregation** to **Terms** and **Field** to **OriginWeather**.
3. Set **Size** to `5` for the top five weather conditions.
4. Select **Update**.

The chart now shows a stacked area for each weather condition, making it easy to see how each contributes to the total flight volume.

### Multiple metrics

Add a second Y-axis metric to compare different measurements:

1. Under **Metrics**, select **Add**.
2. Set **Aggregation** to **Average** and **Field** to **AvgTicketPrice**.
3. Select **Update**.

The chart now overlays the average ticket price on top of the count, plotted on the same axis. To give the second metric its own scale, assign it to a separate Y-axis in the **Metrics & axes** tab.

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
