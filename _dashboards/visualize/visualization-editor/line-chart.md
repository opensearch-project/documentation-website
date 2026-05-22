---
layout: default
title: Line chart
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 10
---

# Line chart

A line chart plots data points connected by lines, making it ideal for visualizing trends and changes over time. Use a line chart when you want to:

- **Track trends over time**: Observe how a metric (such as request count or latency) evolves over hours, days, or weeks.
- **Compare multiple series**: Display several metrics or categories on the same time axis to spot correlations or divergences.
- **Detect anomalies**: Identify spikes, drops, or irregular patterns in time-series data.
- **Correlate metrics with different scales**: Use a secondary Y-axis to overlay metrics that have different units or magnitudes (for example, request count vs. response size in bytes).

## Field selection

The line chart uses the following field mappings:

| Field | Description |
| --- | --- |
| **X-Axis** | The horizontal axis, typically a time span (for example, `SPAN(@timestamp, 1h)`). This defines the buckets along which data is plotted. |
| **Y-Axis** | The primary vertical axis. You can select one or more numeric fields to plot as separate lines. When multiple Y-Axis fields are selected, each field renders as its own line on the same scale. |
| **Y-Axis (2nd)** | A secondary vertical axis displayed on the right side of the chart. Use this when you want to overlay a metric that has a different scale or unit than the primary Y-Axis fields. For example, plot `avg(bytes)` on the left axis and `max(bytes)` on the right axis when their ranges differ significantly. |
| **Color** | A categorical field used to split the data into multiple series, each rendered in a different color. For example, use a `response` status code field to display separate lines for each HTTP status code. |

## Line chart settings

The following settings let you customize the appearance of the line chart.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-settings.png" alt="Line chart settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Style** | Default, Line only, Dots only | Controls whether the chart displays lines with dots (Default), lines without dots (Line only), or dots without connecting lines (Dots only). |
| **Interpolation** | Straight, Smooth, Stepped | Determines how points are connected. Straight draws direct lines between points. Smooth applies a curve. Stepped creates a staircase pattern, useful for data that changes at discrete intervals. |
| **Line width** | 1–10 | Sets the thickness of the lines in pixels. |
| **Show current time marker** | On/Off | When enabled, displays a vertical marker on the chart indicating the current time. |

### Axes

The X-axis and Y-axis share the same configuration options. Each axis can be independently customized.

| Setting | Options | Description |
| --- | --- | --- |
| **Show axis** | On/Off | Toggle whether the axis is displayed. |
| **Title** | Free text | A custom label for the axis. |
| **Position** | X-axis: Top, Bottom / Y-axis: Left, Right | Controls the placement of the axis relative to the chart. |
| **Show grid lines** | On/Off | When enabled, displays grid lines extending from the axis into the chart area. |
| **Show labels** | On/Off | When enabled, displays category labels along the axis. |
| **Label alignment** | Horizontal, Vertical, Angled | Controls the rotation of axis labels. Horizontal (0°), Vertical (90°), or Angled (45°). |
| **Truncate after** | Number | Sets the maximum character length for axis labels before they are truncated. |

## Tutorial: Building line charts

This tutorial walks you through progressively more complex line chart configurations using sample data. Each step builds on the previous one, introducing new capabilities.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with time-series data (this tutorial uses a sample web log index with fields such as `@timestamp`, `bytes`, and `response`).

### Step 1: Basic line chart with auto field mapping

Start with a simple aggregation query that counts events over time.

**Query:**

```sql
source = <index> | stats count() by SPAN(`@timestamp`, 1h)
```

After running this query, the visualization editor automatically suggests a **Line** chart because the query returns one date field and one numeric field — a structure best suited for a line chart. The fields are also mapped automatically:

- `SPAN(@timestamp, 1h)` is mapped to the **X-Axis**.
- `count()` is mapped to the **Y-Axis**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-basic-fields.png" alt="Basic line chart field mapping showing auto-selected X-Axis and Y-Axis" width="400">

No manual chart type selection or field mapping is required. The result is a single line showing the event count per hour.

### Step 2: Multi-series line chart with a Color field

Add a third dimension to your query to split the data into multiple series by category.

**Query:**

```sql
source = <index> | stats count() by SPAN(`@timestamp`, 1h), response
```

This query groups the count by both time and the `response` field (HTTP status codes). Select `response` as the **Color** field to render a separate line for each status code value (for example, 200, 404, 503).

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-color-fields.png" alt="Color field selection with response field" width="400">

The result is a multi-series line chart where each HTTP response code is displayed in a distinct color, making it easy to compare their frequencies over time.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-multi-series.png" alt="Multi-series line chart showing counts by HTTP response code" width="100%">

### Step 3: Multiple Y-Axis fields

When your query computes multiple metrics, you can plot them all on the same chart.

**Query:**

```sql
source = <index> | stats avg(bytes), max(bytes) by SPAN(`@timestamp`, 1h)
```

This query returns two numeric fields: `avg(bytes)` and `max(bytes)`. Select both in the **Y-Axis** field list to plot them as separate lines on the same scale.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-multiple-y-fields.png" alt="Multiple Y-Axis fields selected" width="400">

The result shows both the average and maximum byte values over time, making it easy to compare their behavior and spot when they diverge.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-multiple-y-result.png" alt="Line chart with two Y-Axis metrics plotted together" width="100%">

### Step 4: Using a secondary Y-Axis (dual axis)

When two metrics have significantly different scales, plotting them on the same axis can make one appear flat. Use the **Y-Axis (2nd)** field to give the second metric its own scale on the right side of the chart.

Using the same query as Step 3:

```sql
source = <index> | stats avg(bytes), max(bytes) by SPAN(`@timestamp`, 1h)
```

This time, assign `avg(bytes)` to the **Y-Axis** and `max(bytes)` to the **Y-Axis (2nd)**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-dual-axis-fields.png" alt="Y-Axis and Y-Axis 2nd field selection for dual axis" width="400">

The result is a dual-axis chart. The left axis scales to `avg(bytes)` and the right axis scales to `max(bytes)`. This renders `max(bytes)` as a bar series on the secondary axis, providing a clear visual separation between the two metrics while preserving their individual scales.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-dual-axis-result.png" alt="Dual-axis chart with avg(bytes) as line and max(bytes) as bars" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
