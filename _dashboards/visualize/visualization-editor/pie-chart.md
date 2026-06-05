---
layout: default
title: Pie chart
parent: Creating visualizations using queries
nav_order: 50
---

# Pie chart

A pie chart displays data as proportional slices of a circle, making it ideal for visualizing part-to-whole relationships.

## Creating a pie chart

The following examples build on each other, starting with a basic chart and adding customization. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/#prerequisites).

### Basic pie chart

Start with an aggregation query that counts events by category:

```sql
source = opensearch_dashboards_sample_data_flights | stats count() by Carrier
```
{% include copy.html %}

After running this query, the visualization editor maps the fields automatically:

- The **Size** displays the `count()` field.
- The **Color** displays the `Carrier` field.

The default rendering is a **Donut** chart. Each airline carrier appears as a colored slice proportional to its event count, as shown in the following image.

![Donut chart showing count by carrier]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-donut-result.png){: width="100%" }

### Customizing the pie chart

Open the **Pie** settings panel and configure the following options:

1. Change **Show as** from **Donut** to **Pie** to render a full circle without a center hole.
2. Enable **Show values** to display the count on each slice.
3. Enable **Show labels** to display the carrier name alongside each slice.
4. Set **Truncate after** to `300` for longer label text, as shown in the following image.

![Pie chart settings with Pie mode, show values, and show labels enabled]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-settings-custom.png){: width="400" }

The result is a full pie chart with both category labels and numeric values displayed on each slice, as shown in the following image.

![Pie chart with labels and values shown]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/pie-chart-labels-result.png){: width="100%" }

## Configuring a pie chart

You can configure the following settings in the configuration panel.

### Fields

In the **Fields** section, configure the data fields.

| Field | Description |
| --- | --- |
| **Size** | Select a numeric field that determines the size of each slice. For example, `count()` makes each slice proportional to the number of events in that category. |
| **Color** | Select a categorical field that splits the data into individual slices, each rendered in a different color. For example, use a `Carrier` field to display a slice for each airline. |

### Split

In the **Split by** dropdown list, select a field to split the chart into separate elements by value. For more information, see [Split]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#split).


### Pie

The following table describes the pie chart settings.

| Setting | Description |
| --- | --- |
| **Show as** | Controls whether the chart renders as a full pie or a **Donut** (ring) shape. **Donut** is the default. |
| **Show values** | When enabled, shows the numeric value for each slice on the chart. |
| **Show labels** | When enabled, shows the category label for each slice on the chart. |
| **Truncate after** | Sets the maximum width in pixels for labels before truncation. Only visible when **Show labels** is enabled. |

### Legend

The legend summarizes the visual color encodings used in the chart.

| Setting | Description |
| --- | --- |
| **Show legend** | Shows or hides the legend. |
| **Position** | Controls where the legend appears relative to the chart. Supported values: **Left**, **Right**, **Top**, **Bottom**. |

### Tooltip

Toggle the **Show tooltip** selector to enable or disable tooltips.
