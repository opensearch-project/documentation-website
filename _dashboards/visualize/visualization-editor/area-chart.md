---
layout: default
title: Area chart
parent: Visualization types
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 10
---

# Area charts in the visualization editor

An area chart plots data points connected by lines with the region below filled in, making it ideal for visualizing volume and composition over time. You can stack multiple series to see how each category contributes to the total.

## Creating an area chart

The following examples build on each other, starting with a basic chart and adding complexity. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/#prerequisites).

### Basic area chart

Start with an aggregation query that counts events over time:

```sql
source = opensearch_dashboards_sample_data_logs | stats count() by SPAN(@timestamp, 1d)
```

{% include copy.html %}

After running this query, the visualization editor automatically maps the fields:

- The **X-Axis** displays the `SPAN(@timestamp, 1d)` field.
- The **Y-Axis** displays the `count()` field.

The result is a single filled area showing the event count per day, as shown in the following image.

![Basic area chart showing count over time]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-basic-result.png){: width="100%" }

### Stacked area chart

Add a third dimension to your query to split the data into multiple stacked series by category:

```sql
source = opensearch_dashboards_sample_data_logs | stats count() by SPAN(@timestamp, 1d), response
```

{% include copy.html %}

This query groups the count by both time and the `response` field (HTTP status codes). Select `response` as the **Color** field to render a separate stacked area for each status code value (for example, 200, 404, 503).

The result is a stacked area chart that displays each HTTP response code in a distinct color. The chart stacks the areas on top of each other, showing both individual category volumes and the total across all categories, as shown in the following image.

![Stacked area chart showing counts by HTTP response code]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/area-chart-stacked-result.png){: width="100%" }

## Configuring an area chart

You can configure the following settings in the configuration panel.

### Fields

In the **Fields** section, configure the fields displayed on each axis.

| Field      | Description                                                                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **X-Axis** | Select a date or numeric field for the horizontal axis that defines the buckets along which data is plotted (for example, `SPAN(@timestamp, 1d)`).                                                                          |
| **Y-Axis** | Select one or more numeric fields to plot as separate areas. When multiple fields are selected, each renders as its own area layer.                                                                                         |
| **Color**  | Select a categorical field to split the data into multiple stacked series, each rendered in a different color. For example, use a `response` status code field to display separate stacked areas for each HTTP status code. |

### Split

In the **Split by** dropdown list, select a field to split the chart into separate elements by value. For more information, see [Split]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#split).

### Area

The following settings control the area fill, line style, and value display.

| Setting                      | Description                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**                    | Controls how multiple series are displayed. **None** overlays the series without stacking. **Stack** adds series values together. **Percentage** stacks series as percentages of the total. |
| **Fill opacity**             | Sets the opacity of the filled area below the line.                                                                                                                                         |
| **Gradient mode**            | Controls the fill gradient. **None** uses a solid fill. **Opacity** fades the fill toward the baseline. **Hue** uses a lighter color toward the baseline.                                   |
| **Line Style**               | Controls whether the chart displays lines with points (**Default**), lines only (**Line only**), or points only (**Dots only**).                                                            |
| **Line Dash style**          | Sets the line pattern to **Solid**, **Dashed**, or **Dotted**.                                                                                                                              |
| **Interpolation**            | Determines how points are connected. **Straight** draws direct lines between points. **Smooth** applies a curve. **Stepped** creates a staircase pattern.                                   |
| **Line width**               | Sets the thickness of the line in pixels. Supports values in the 1–10 range.                                                                                                                |
| **Show values**              | Shows value labels on the chart.                                                                                                                                                            |
| **Show current time marker** | Shows a vertical marker for the current time. This setting is available only when the X-axis uses a date field.                                                                             |

### Thresholds

For information about configuring thresholds, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

### Standard options

For information about configuring units, unit suffixes, decimal precision, and minimum and maximum values, see [Standard options]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/standard-options/).

### Axes

The X-axis and Y-axis share the same configuration options. For more information, see [Axes]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#axes).

### Legend

For information about configuring the legend, see [Legend]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#legend).

### Tooltip

Toggle the **Show tooltip** selector to enable or disable tooltips.
