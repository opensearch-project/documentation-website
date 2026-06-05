---
layout: default
title: Thresholds
parent: Configuring visualizations
grand_parent: Creating visualizations using queries
nav_order: 10
---

# Thresholds

A threshold is a boundary value that, when reached or exceeded by a data point, triggers a visual change in color. Use thresholds to define meaningful ranges so that you can immediately understand whether values are within normal, warning, or critical zones.

## Supported chart types

Thresholds are available in the following chart types:

- [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/)
- [Bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/)
- [Bar gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/)
- [Gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/)
- [Heatmap chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/)
- [Line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/)
- [Scatter chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/)
- [State timeline chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/)

## Configuring thresholds

To add a threshold, open the **Thresholds** section in the configuration panel and select **+ Add threshold**. For each threshold, configure the following settings.

| Setting | Description |
| --- | --- |
| **Color** | Select a color to apply to values that fall within this threshold's range. Select a preset color or a custom color. |
| **Value** | Enter the numeric boundary at which this threshold begins. Values at or above this number (and below the next threshold) are displayed in this color. |

The base threshold is always present and represents the starting color for values that fall below all other thresholds. You can change its color but not its value.

Thresholds are automatically sorted by value. To delete a threshold, select the trash icon next to it.

## Specifying thresholds for different chart types

Thresholds behave differently depending on the chart type.

### Gauge, bar gauge, and metric charts

In these charts, thresholds color the arc, bar, or value directly. The **Min** and **Max** controls under **Standard options** define the scale range, and thresholds divide that scale into colored segments. To apply thresholds to a gauge chart, follow these steps:

1. Enter the following query and select **Update**:

   ```sql
   source = opensearch_dashboards_sample_data_flights | FIELDS AvgTicketPrice
   ```
   {% include copy.html %}

1. Select **Gauge** as the visualization type.
1. Enable **Use threshold colors** in the **Gauge** section.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set the base color to green and add a threshold at `500` with the color orange.

The arc is green below 500 and orange at or above 500, as shown in the following image.

![Gauge chart with threshold colors applied]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge-chart-thresholds.png){: width="100%" }

### Line and area charts

In line and area charts, thresholds are displayed as horizontal **reference lines** across the chart. The line itself does not change color. To add threshold lines to a line chart, follow these steps:

1. Enter the following query and select **Update**:

   ```sql
   source = opensearch_dashboards_sample_data_logs | stats count() by SPAN(@timestamp, 1h)
   ```
   {% include copy.html %}

1. Select **Line** as the visualization type.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set a threshold at `20` with a color.
1. Set **Threshold lines mode** to **Dashed lines**.

A dashed horizontal line appears at the threshold value, as shown in the following image.

![Line chart with dashed threshold line at 20]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-chart-threshold-lines.png){: width="100%" }

Use the **Threshold lines mode** setting to control the line appearance:

- **Off**: No threshold lines are shown.
- **Solid lines**: Draws solid horizontal lines at each threshold value.
- **Dashed lines**: Draws dashed horizontal lines at each threshold value.
- **Dotted lines**: Draws dotted horizontal lines at each threshold value.

### Bar, histogram, heatmap, scatter, and state timeline charts

In these charts, thresholds color individual data elements (bar fills, cell colors, or point colors) based on each data point's value. The **Threshold lines mode** setting is also available for bar and scatter charts to add reference lines. To apply thresholds to a scatter chart, follow these steps:

1. Enter the following query and select **Update**:

   ```sql
   source = opensearch_dashboards_sample_data_flights | fields AvgTicketPrice, DistanceMiles
   ```
   {% include copy.html %}

1. Select **Scatter** as the visualization type.
1. In the **Scatter** section, enable **Use threshold colors**.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set the base color to green and add a threshold at `6000` with the color orange.

The scatter chart now displays points in green for distances below 6000 and orange for distances at or above 6000, as shown in the following image.

![Scatter chart with threshold colors applied showing the configuration panel]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter-threshold-full-ui.png){: width="100%" }
