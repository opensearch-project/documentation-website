---
layout: default
title: Scatter plot
parent: Creating visualizations using queries
nav_order: 55
---

# Scatter plot

A scatter chart visualizes relationships between two numerical variables. Each point on the chart represents an observation from the dataset, with its position determined by the values of the two variables. You can split data by a categorical field to compare how different groups distribute across the same dimensions.

## Creating a scatter chart

The following examples build on each other, starting with a basic two-variable scatter and adding dimensions. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/#prerequisites).

### Basic scatter chart

Start with a query that returns two numeric fields:

```sql
source = opensearch_dashboards_sample_data_flights | fields AvgTicketPrice, DistanceMiles
```
{% include copy.html %}

After running this query, select **Scatter** as the chart type. The fields are mapped as follows:

- The **X-Axis** displays the `AvgTicketPrice` field.
- The **Y-Axis** displays the `DistanceMiles` field.

The result is a scatter plot showing the relationship between ticket price and flight distance. Each point represents a single flight, as shown in the following image.

![Basic scatter chart showing average flight price compared to distance]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-num-fields.png){: width="100%" }

### Using thresholds

To apply thresholds, enable **Use threshold colors** in the **Scatter** section. Then open the **Thresholds** section and add a threshold of `6000` to highlight long-distance flights, as shown in the following image.

![Scatter chart with threshold at 6000 highlighting long-distance flights]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-with-threshold.png){: width="100%" }

For more information, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

### Adding a color dimension

Add a categorical field to split the data points into color-coded groups:

```sql
source = opensearch_dashboards_sample_data_flights | fields AvgTicketPrice, DistanceMiles, DestWeather
```
{% include copy.html %}

This query returns two numeric fields: `AvgTicketPrice` and `DistanceMiles`. Select `DestWeather` as the **Color** field.

The result is a scatter plot with points split into color-coded groups---each weather condition is rendered in a distinct color, as shown in the following image.

![Scatter chart with color-coded weather categories]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-one-cate-fields.png){: width="100%" }

### Adding a size dimension

Add a third numeric field to control point size, creating a bubble chart:

```sql
source = opensearch_dashboards_sample_data_flights | fields AvgTicketPrice, DistanceMiles, DestWeather, FlightDelayMin
```
{% include copy.html %}

This query returns three numeric fields: `AvgTicketPrice`, `DistanceMiles`, and `FlightDelayMin`. Select `DestWeather` as the **Color** field and map `FlightDelayMin` to the **Size** field.

Points now vary in size---larger bubbles represent longer delays. Each color still represents a weather condition, making it possible to identify whether certain weather types correlate with both higher prices and longer delays, as shown in the following image.

![Scatter chart with size representing flight delay minutes]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-one-cate-fields-one-size.png){: width="100%" }

## Configuring a scatter chart

You can configure the following settings in the configuration panel.

### Fields

In the **Fields** section, configure the fields displayed on each axis.

| Configuration | Fields | Description |
| --- | --- | --- |
| **Two numerical** | X-Axis (numeric), Y-Axis (numeric) | Select two numeric fields to display data points showing the relationship between two numerical variables. |
| **Two numerical + one categorical** | X-Axis (numeric), Y-Axis (numeric), Color (categorical) | Select two numeric fields and a categorical Color field to display data points split into color-coded groups. |
| **Three numerical + one categorical** | X-Axis (numeric), Y-Axis (numeric), Size (numeric), Color (categorical) | Select three numeric fields and a categorical Color field to display data points with colors indicating categories and the third numeric field controlling the size of the points. |

### Split

In the **Split by** dropdown list, select a field to split the chart into separate elements by value. For more information, see [Split]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#split).

### Scatter

Use the following settings to customize the appearance and behavior of the scatter chart.

| Setting | Description |
| --- | --- |
| **Point size** | Controls the default size of data points when no Size field is mapped. |
| **Shape** | Controls the shape of each data point. Supported values: **Circle**, **Square**, **Diamond**, **Cross**. |
| **Filled** | When enabled, data points are filled with color. When disabled, only the outline is rendered. |
| **Angle** | Controls the display angle of each data point in degrees. Supports values in the 0–360 range. |

### Thresholds

For information about configuring thresholds, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

### Axes

The X-axis and Y-axis share the same configuration options. For more information, see [Axes]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#axes).

### Legend

The legend summarizes the visual color encodings used in the chart.

| Setting | Description |
| --- | --- |
| **Show legend** | Shows or hides the legend. |
| **Position** | Controls where the legend appears relative to the chart. Supported values: **Left**, **Right**, **Top**, **Bottom**. |

### Tooltip

Toggle the **Show tooltip** selector to enable or disable tooltips.
