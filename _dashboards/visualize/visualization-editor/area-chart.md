---
layout: default
title: Area chart
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 20
---

# Area chart

An area chart plots data points connected by lines with the region below filled in, making it ideal for visualizing volume and composition over time. Use an area chart when you want to:

- **Show volume over time**: Emphasize the magnitude of a metric (such as request count or throughput) rather than just the trend line.
- **Compare contributions of categories**: Stack multiple series to see how each category contributes to the total over time.
- **Highlight differences between series**: The filled regions make it easier to perceive the gap between overlapping series compared to line charts.
- **Visualize cumulative totals**: Stacked areas naturally convey part-to-whole relationships across time intervals.

## Field selection

The area chart uses the following field mappings:

| Field | Description |
| --- | --- |
| **X-Axis** | The horizontal axis, typically a time span (for example, `SPAN(@timestamp, 1d)`). This defines the buckets along which data is plotted. |
| **Y-Axis** | The vertical axis. You can select one or more numeric fields to plot as separate areas. When multiple Y-Axis fields are selected, each field renders as its own area layer. |
| **Color** | A categorical field used to split the data into multiple stacked series, each rendered in a different color. For example, use a `response` status code field to display separate stacked areas for each HTTP status code. |

## Tutorial: Building area charts

This tutorial walks you through building area charts using sample data. Each step introduces a new capability.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with time-series data (this tutorial uses a sample web log index with fields such as `@timestamp` and `response`).

### Step 1: Basic area chart with auto field mapping

Start with a simple aggregation query that counts events over time.

**Query:**

```sql
source = <index> | stats count() by SPAN(`@timestamp`, 1d)
```

After running this query, the visualization editor automatically maps the fields:

- `SPAN(@timestamp, 1d)` is mapped to the **X-Axis**.
- `count()` is mapped to the **Y-Axis**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-basic-fields.png" alt="Basic area chart field mapping showing auto-selected X-Axis and Y-Axis" width="400">

The result is a single filled area showing the event count per day.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-basic-result.png" alt="Basic area chart showing count over time" width="100%">

### Step 2: Stacked area chart with a Color field

Add a third dimension to your query to split the data into multiple stacked series by category.

**Query:**

```sql
source = <index> | stats count() by SPAN(`@timestamp`, 1d), response
```

This query groups the count by both time and the `response` field (HTTP status codes). Select `response` as the **Color** field to render a separate stacked area for each status code value (for example, 200, 404, 503).

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-color-fields.png" alt="Color field selection with response field" width="400">

The result is a stacked area chart where each HTTP response code is displayed in a distinct color. The areas are stacked on top of each other, making it easy to see both individual category volumes and the total across all categories.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-stacked-result.png" alt="Stacked area chart showing counts by HTTP response code" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
