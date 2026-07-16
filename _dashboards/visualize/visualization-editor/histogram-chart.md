---
layout: default
title: Histogram
parent: Visualization types
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 35
---

# Histogram

A histogram chart displays the distribution of a numeric field by grouping values into bins (buckets) and showing the count of values in each bin as vertical bars.

## Creating a histogram chart

The following example demonstrates a basic histogram visualization. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/#prerequisites).

### Basic histogram

Start with a query that counts values grouped by a numeric field:

```sql
source = opensearch_dashboards_sample_data_flights | stats count() by AvgTicketPrice
```
{% include copy.html %}

After running this query, select **Histogram** as the chart type. The editor maps the field as follows:

- The **X-Axis** displays the `AvgTicketPrice` field.

The result is a histogram showing the distribution of ticket prices, as shown in the following image.

![Histogram chart showing distribution of average ticket prices]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/histogram-chart-basic-result.png){: width="100%" }

## Configuring a histogram chart

You can configure the following settings in the configuration panel.

### Fields

In the **Fields** section, configure the fields displayed on each axis.

| Field | Description |
| --- | --- |
| **X-Axis** | Select a numeric field to distribute into buckets along the horizontal axis. |
| **Y-Axis** | Select a numeric field for the vertical axis. If left blank, the chart displays the count of values in each bucket. |

### Split

In the **Split by** dropdown list, select a field to split the chart into separate elements by value. For more information, see [Split]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#split).

### Bucket

The following settings control how data is grouped into bins.

| Setting | Description |
| --- | --- |
| **Bucket Size** | Sets the width of each bin. Enter a numeric value or leave as **auto** to let the editor calculate an appropriate size. |
| **Bucket count** | Sets the maximum number of bins to display. |

### Thresholds

For information about configuring thresholds, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

### Axes

The X-axis and Y-axis share the same configuration options. For more information, see [Axes]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#axes).

### Histogram

Use the following settings to customize the appearance of the histogram.

| Setting | Description |
| --- | --- |
| **Use threshold colors** | When enabled, colors bars based on threshold ranges. |
| **Show border** | When enabled, adds a border around each bar. |

### Tooltip

Toggle the **Show tooltip** selector to enable or disable tooltips.
