---
layout: default
title: Thresholds
parent: Configuring visualizations
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 10
---

# Thresholds

A threshold is a boundary value that, when reached or exceeded by a data point, triggers a visual change in color. Use thresholds to define meaningful ranges so that you can immediately understand whether values are within normal, warning, or critical zones.

Each threshold defines a value range. The base threshold applies to all values lower than the first threshold, and each additional threshold starts at its configured value and applies until the next threshold begins. For example, if the base color is green, a threshold at `50` is yellow, and a threshold at `80` is red, then values lower than 50 are green, values from 50 to less than 80 are yellow, and values of 80 or greater are red.

## Supported chart types

Thresholds are available in the following chart types:

- [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/)
- [Bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/)
- [Bar gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/)
- [Gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/)
- [Heatmap]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/)
- [Histogram]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/histogram-chart/)
- [Line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/)
- [Metric chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/metric-chart/)
- [Scatter plot]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/)
- [State timeline]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/)
- [Table]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/table-chart/)

## Configuring thresholds

To add a threshold, open the **Thresholds** section in the configuration panel and select **+ Add threshold**. For each threshold, configure the following settings.

| Setting | Description |
| :--- | :--- |
| **Color** | Select a color to apply to values that fall within this threshold's range. Select a preset color or a custom color. |
| **Value** | Enter the numeric boundary at which this threshold begins. Values equal to or greater than this number (and lower than the next threshold) are displayed in this color. |

OpenSearch Dashboards automatically sorts thresholds by value. The base threshold is always present and represents the starting color for all values lower than the other thresholds. You can change the base color, but you cannot delete the base threshold or set a value for it. To delete any other threshold, select the trash icon next to it.

## Threshold effects by chart type

Thresholds are applied differently depending on the chart type. Some visualizations use thresholds to color chart marks, some use thresholds as reference lines, and some require an additional chart-specific setting, such as **Use threshold colors** or **Cell style**. The following table describes how thresholds are applied in each chart type.

| Chart type | Threshold effect | Additional setting |
| :--- | :--- | :--- |
| Gauge | Colors the gauge arc by threshold range. When **Use threshold colors** is turned on, the displayed value also uses the matching threshold color. | Turn on **Use threshold colors**. |
| Bar gauge | Colors the bar gauge by threshold range. The visual result also depends on the selected display style, such as gradient, stack, or basic. | None. |
| Metric | Colors the metric value or background according to the metric value and the selected color mode. | Set **Color mode** and then turn on **Use threshold colors**. |
| Line and area | Displays threshold values as horizontal reference lines. The line or area mark itself does not change color. | Set **Threshold lines mode** to **Solid lines**, **Dashed lines**, or **Dotted lines**. |
| Bar and histogram | Colors bars by value range when threshold colors are turned on. You can also display threshold reference lines. | Turn on **Use threshold colors** to color bars. Set **Threshold lines mode** to display reference lines. |
| Heatmap | Colors cells by value range, overriding the selected color schema. | Turn on **Use threshold colors**. |
| Scatter | Colors points by value range when threshold colors are turned on. You can also display threshold reference lines. | Turn on **Use threshold colors** to color points. Set **Threshold lines mode** to display reference lines. |
| State timeline | Colors state regions by value range, overriding the value mapping colors. | Turn on **Use threshold color**. |
| Table | Colors numeric table cells by value range. | In **Cell style**, select a numeric field and then select **Colored Text** or **Colored Background**. |

State timeline charts also include settings for disconnecting values and connecting null values by a time threshold. Those settings control gaps in the timeline and do not affect the color thresholds described on this page.
{: .note}

## Threshold examples

The following examples show how to apply thresholds to each supported chart type using the OpenSearch Dashboards sample data.

### Gauge chart

In gauge charts, thresholds color the arc directly. The **Min** and **Max** controls under **Standard options** define the scale range, and thresholds divide that scale into colored segments. To apply thresholds to a gauge chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by span(`@timestamp`, 5m)
   ```
   {% include copy.html %}

1. Select **Gauge** as the visualization type.
1. In the **Gauge** section, turn on **Use threshold colors**.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set the base color to green and add thresholds at `6000`, `8000`, and `10000`.

The arc uses the threshold color for each range, and the displayed value uses the matching threshold color, as shown in the following image.

![Gauge chart with a threshold-colored arc and a value displayed in the matching threshold color]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge-chart-threshold-result.png){: width="100%" }

### Bar gauge chart

In bar gauge charts, thresholds define the colored ranges of each bar. The result depends on the selected display style:

- **Gradient** shows a smooth transition across threshold colors.
- **Stack** divides the bar into distinct threshold segments.
- **Basic** colors the bar using the threshold range that contains the value.

To apply thresholds to a bar gauge chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by span(`@timestamp`, 5m), extension
   ```
   {% include copy.html %}

1. Select **Bar Gauge** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `extension` and **Y-Axis** to `AVG(bytes)`.
1. In the **Thresholds** section, set thresholds at `3000`, `5000`, and `8000`.
1. In the **Bar Gauge** section, select a **Display style**.

Each bar is colored by the threshold range that contains its value, as shown in the following image.

![Bar gauge chart with each bar colored by its threshold range]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-threshold-result.png){: width="100%" }

### Metric chart

In metric charts, thresholds color the displayed value or its background according to the selected **Color mode**. To apply thresholds to a metric chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by span(`@timestamp`, 5m), extension
   ```
   {% include copy.html %}

1. Select **Metric** as the visualization type.
1. In the **Metric** section, set **Color mode** to **Background gradient** and turn on **Use threshold colors**.
1. In the **Thresholds** section, set thresholds at `4000`, `6000`, and `8000`.

The background of each metric uses the color of the threshold range that contains the metric value, as shown in the following image.

![Metric chart with threshold colors applied to the background of each metric]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/metric-chart-threshold-result.png){: width="100%" }

### Line and area charts

In line and area charts, thresholds are displayed as horizontal reference lines across the chart. The line or area mark itself does not change color. To add threshold lines to a line or area chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by span(`@timestamp`, 5m)
   ```
   {% include copy.html %}

1. Select **Line** as the visualization type.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set thresholds at `5000` and `8000`.
1. Set **Threshold lines mode** to **Dashed lines**.

A dashed horizontal line appears at each threshold value, as shown in the following image.

![Line chart with dashed horizontal reference lines at each threshold value]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-area-threshold-lines.png){: width="100%" }

Use the **Threshold lines mode** setting to control the line appearance:

- **Off**: Displays no threshold lines.
- **Solid lines**: Draws solid horizontal lines at each threshold value.
- **Dashed lines**: Draws dashed horizontal lines at each threshold value.
- **Dotted lines**: Draws dotted horizontal lines at each threshold value.

### Bar and histogram charts

In bar and histogram charts, thresholds can color bars based on each bar's value. These chart types can also display threshold reference lines. To apply threshold colors to a bar chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by extension
   ```
   {% include copy.html %}

1. Select **Bar** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `extension` and **Y-Axis** to `AVG(bytes)`.
1. In the **Bar** section, turn on **Use threshold colors**.
1. In the **Thresholds** section, set thresholds at `2000`, `4000`, and `6000`.
1. Set **Threshold lines mode** to **Off**.

Each bar is colored by the threshold range that contains its value, as shown in the following image.

![Bar chart with each bar colored by its threshold range]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-histogram-threshold-result.png){: width="100%" }

### Heatmap

In heatmaps, thresholds color cells by value range, overriding the selected color schema. To apply thresholds to a heatmap, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | stats avg(bytes) by extension, `machine.os`
   ```
   {% include copy.html %}

1. Select **Heatmap** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `extension`, **Y-Axis** to `machine.os`, and **Value** to `AVG(bytes)`.
1. In the **Heatmap** section, turn on **Use threshold colors**.
1. In the **Thresholds** section, set thresholds at `4000`, `6000`, and `8000`.

Each cell is colored by the threshold range that contains its value, as shown in the following image.

![Heatmap with each cell colored by its threshold range]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-threshold-colors.png){: width="100%" }

### Scatter plot

In scatter plots, thresholds can color points based on each point's value. Scatter plots can also display threshold reference lines. To apply thresholds to a scatter plot, follow these steps:

1. Select the `opensearch_dashboards_sample_data_flights` dataset and select **Update**.
1. Select **Scatter** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `DistanceMiles` and **Y-Axis** to `AvgTicketPrice`.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set thresholds at `400`, `600`, and `800`.

Each point is colored by the threshold range that contains its ticket price, as shown in the following image.

![Scatter plot with each point colored by the threshold range of its ticket price]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter-threshold-result.png){: width="100%" }

### State timeline

In state timelines, thresholds color state regions by numeric value range. Use thresholds when the color represents a range, such as successful, warning, and error response codes, rather than an individual value. To apply thresholds to a state timeline, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | FIELDS @timestamp, response
   ```
   {% include copy.html %}

1. Select **State Timeline** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `@timestamp` and **Color** to `response`. Because the `response` field is numeric, OpenSearch Dashboards can divide it into threshold ranges.
1. In the **Thresholds** section, keep the base color green and set thresholds at `400` and `500`.
1. In the **State Timeline** section, turn on **Use threshold color**. To display only the threshold-colored regions, keep **Show display text** turned off.

The timeline regions are colored by response code range: values from `0` to less than `400`, values from `400` to less than `500`, and values of `500` or greater, as shown in the following image.

![State timeline with regions colored by response code range]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-threshold-colors.png){: width="100%" }

### Table

In tables, thresholds color numeric cells. To apply thresholds to a table, follow these steps:

1. Select the `opensearch_dashboards_sample_data_flights` dataset.
1. Enter the following query and select **Update**:

   ```sql
   | FIELDS AvgTicketPrice, Carrier, Dest, Origin
   ```
   {% include copy.html %}

1. Select **Table** as the visualization type.
1. In the **Table** section, set **Cell style** to `AvgTicketPrice` and select **Colored Background**.
1. In the **Threshold** section, set thresholds at `400`, `600`, and `1000`.

Each `AvgTicketPrice` cell background is colored by the threshold range that contains its value, as shown in the following image.

![Table with numeric cell backgrounds colored by threshold range]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/table-threshold-cells.png){: width="100%" }
