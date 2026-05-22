---
layout: default
title: Pie chart
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 30
---

# Pie chart

A pie chart displays data as proportional slices of a circle, making it ideal for visualizing part-to-whole relationships. Use a pie chart when you want to:

- **Show proportions**: Display how individual categories contribute to a total (for example, traffic share by carrier).
- **Compare relative sizes**: Quickly identify which categories dominate and which are minor.
- **Summarize categorical breakdowns**: Present a simple, at-a-glance overview of category distribution.

## Field selection

The pie chart uses the following field mappings:

| Field | Description |
| --- | --- |
| **Size** | A numeric field that determines the size of each slice. For example, `count()` makes each slice proportional to the number of events in that category. |
| **Color** | A categorical field that splits the data into individual slices, each rendered in a different color. For example, use a `Carrier` field to display a slice for each airline. |

## Pie chart settings

The following settings let you customize the appearance of the pie chart.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-settings.png" alt="Pie chart settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Show as** | Pie, Donut | Controls whether the chart renders as a full pie or a donut (ring) shape. Donut is the default. |
| **Show values** | On/Off | When enabled, displays the numeric value for each slice on the chart. |
| **Show labels** | On/Off | When enabled, displays the category label for each slice on the chart. |
| **Truncate after** | Number (pixels) | Sets the maximum width in pixels for labels before they are truncated. Only visible when **Show labels** is enabled. |

## Tutorial: Building a pie chart

This tutorial walks you through building a pie chart and customizing its appearance.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with categorical data (this tutorial uses a sample flights index with a `Carrier` field).

### Step 1: Basic pie chart

Start with a simple aggregation query that counts events by category.

**Query:**

```sql
source = <index> | stats count() by Carrier
```

After running this query, the visualization editor maps the fields automatically:

- `count()` is mapped to **Size**.
- `Carrier` is mapped to **Color**.

The default rendering is a donut chart. Each airline carrier is represented by a colored slice proportional to its event count.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-donut-result.png" alt="Donut chart showing count by carrier" width="100%">

### Step 2: Customizing the pie chart

Open the **Pie** settings panel and adjust the configuration:

1. Change **Show as** from Donut to **Pie** to render a full circle without a center hole.
2. Enable **Show values** to display the count on each slice.
3. Enable **Show labels** to display the carrier name alongside each slice.
4. Set **Truncate after** to `300` to allow longer label text.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-settings-custom.png" alt="Pie chart settings with Pie mode, show values, and show labels enabled" width="400">

The result is a full pie chart with both category labels and numeric values displayed on each slice.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-labels-result.png" alt="Pie chart with labels and values shown" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
