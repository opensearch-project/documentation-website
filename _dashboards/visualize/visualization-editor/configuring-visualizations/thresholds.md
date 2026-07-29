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

## Supported chart types

Thresholds are available in the following chart types:

- [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/)
- [Bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/)
- [Bar gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/)
- [Gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/)
- [Heatmap chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/)
- [Histogram chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/histogram-chart/)
- [Line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/)
- [Metric chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/metric-chart/)
- [Scatter chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/)
- [State timeline chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/)
- [Table chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/table-chart/)

## How thresholds work

Thresholds define value ranges. The base threshold applies to values below the first threshold. Each additional threshold starts at its configured value and applies until the next threshold begins.

For example, if the base color is green, a threshold at `50` is yellow, and a threshold at `80` is red, then values below 50 are green, values from 50 to less than 80 are yellow, and values at or above 80 are red.

OpenSearch Dashboards automatically sorts thresholds by value. The base threshold is always present. You can change the base color, but you cannot delete the base threshold or set a value for it.

## Configuring thresholds

To add a threshold, open the **Thresholds** section in the configuration panel and select **+ Add threshold**. For each threshold, configure the following settings.

| Setting   | Description                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color** | Select a color to apply to values that fall within this threshold's range. Select a preset color or a custom color.                                   |
| **Value** | Enter the numeric boundary at which this threshold begins. Values at or above this number (and below the next threshold) are displayed in this color. |

The base threshold is always present and represents the starting color for values that fall below all other thresholds. You can change its color but not its value.

Thresholds are automatically sorted by value. To delete a threshold, select the trash icon next to it.

## Threshold behavior by chart type

Thresholds behave differently depending on the chart type. Some visualizations use thresholds to color chart marks, some use thresholds as reference lines, and some require an additional chart-specific setting such as **Use threshold colors** or **Cell style**.

| Chart type        | Threshold behavior                                                                                                                             | Additional setting                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Gauge             | Colors the gauge arc by threshold range. When **Use threshold colors** is enabled, the displayed value also uses the matching threshold color. | Enable **Use threshold colors**.                                                                       |
| Bar gauge         | Colors the bar gauge by threshold range. The visual result also depends on the selected display style, such as gradient, stack, or basic.      | Configure thresholds in the **Thresholds** section.                                                    |
| Metric            | Colors the metric value or background according to the metric value and selected color mode.                                                   | Set **Color mode**, then enable **Use threshold colors**.                                              |
| Line and area     | Displays threshold values as horizontal reference lines. The line or area mark itself does not change color.                                   | Set **Threshold lines mode** to **Solid lines**, **Dashed lines**, or **Dotted lines**.                |
| Bar and histogram | Colors bars by value range when threshold colors are enabled. Can also show threshold reference lines.                                         | Enable **Use threshold colors** to color bars. Set **Threshold lines mode** to show reference lines.   |
| Heatmap           | Colors cells by value range instead of using the selected color schema.                                                                        | Enable **Use threshold colors**.                                                                       |
| Scatter           | Colors points by value range when threshold colors are enabled. Can also show threshold reference lines.                                       | Enable **Use threshold colors** to color points. Set **Threshold lines mode** to show reference lines. |
| State timeline    | Colors state regions by value range instead of using value mapping colors.                                                                     | Enable **Use threshold color**.                                                                        |
| Table             | Colors numeric table cells by value range.                                                                                                     | In **Cell style**, select a numeric field and choose **Colored Text** or **Colored Background**.       |

State timeline charts also include separate settings for disconnecting values and connecting null values by a time threshold. Those settings control gaps in the timeline and are separate from the color thresholds described on this page.
{: .note}

## Threshold examples

### Gauge chart

In gauge charts, thresholds color the arc directly. The **Min** and **Max** controls under **Standard options** define the scale range, and thresholds divide that scale into colored segments. To apply thresholds to a gauge chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```ppl
   | stats avg(bytes) by span(`@timestamp`, 5m)
   ```
   {% include copy.html %}

1. Select **Gauge** as the visualization type.
1. Enable **Use threshold colors** in the **Gauge** section.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set the base color to green and add thresholds at `6000`, `8000`, and `10000`.

The arc uses the threshold color for each range, and the displayed value uses the matching threshold color.

![Gauge chart with threshold colors applied]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge-chart-threshold-result.png){: width="100%" }

### Bar gauge chart

In bar gauge charts, thresholds define the colored ranges of each bar. The result depends on the selected display style:

- **Gradient** shows a smooth transition across threshold colors.
- **Stack** divides the bar into distinct threshold segments.
- **Basic** colors the bar using the threshold range that contains the value.

To apply thresholds to a bar gauge chart, open the **Thresholds** section, define the threshold values and colors, and then select the display style in the **Bar gauge** section.

For example, select the `opensearch_dashboards_sample_data_logs` dataset, enter the following query, and select **Update**:

```ppl
| stats avg(bytes) by span(`@timestamp`, 5m), extension
```
{% include copy.html %}

Select **Bar Gauge** as the visualization type. In the **Fields** section, set **X-Axis** to `extension` and **Y-Axis** to `AVG(bytes)`. In the **Thresholds** section, set thresholds at `3000`, `5000`, and `8000`.

![Bar gauge chart with threshold ranges applied]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-threshold-result.png){: width="100%" }

### Metric chart

In metric charts, thresholds color the displayed value or background according to the selected **Color mode**. To apply thresholds to a metric chart, choose a **Color mode**, enable **Use threshold colors**, and then configure threshold values in the **Thresholds** section.

For example, select the `opensearch_dashboards_sample_data_logs` dataset, enter the following query, and select **Update**:

```ppl
| stats avg(bytes) by span(`@timestamp`, 5m), extension
```
{% include copy.html %}

Select **Metric** as the visualization type. In the **Metric** section, set **Color mode** to **Background gradient** and enable **Use threshold colors**. In the **Thresholds** section, set thresholds at `4000`, `6000`, and `8000`.

![Metric chart with threshold colors applied to the background]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/metric-chart-threshold-result.png){: width="100%" }

### Line and area charts

In line and area charts, thresholds are displayed as horizontal **reference lines** across the chart. The line or area mark itself does not change color. To add threshold lines to a line or area chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```ppl
   | stats avg(bytes) by span(`@timestamp`, 5m)
   ```
   {% include copy.html %}

1. Select **Line** as the visualization type.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set thresholds at `5000` and `8000`.
1. Set **Threshold lines mode** to **Dashed lines**.

A dashed horizontal line appears at each threshold value.

![Line chart with threshold reference lines]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/line-area-threshold-lines.png){: width="100%" }

Use the **Threshold lines mode** setting to control the line appearance:

- **Off**: No threshold lines are shown.
- **Solid lines**: Draws solid horizontal lines at each threshold value.
- **Dashed lines**: Draws dashed horizontal lines at each threshold value.
- **Dotted lines**: Draws dotted horizontal lines at each threshold value.

### Bar and histogram charts

In bar and histogram charts, thresholds can color bars based on each bar's value. These chart types can also display threshold reference lines.

To apply threshold colors to a bar chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_logs` dataset.
1. Enter the following query and select **Update**:

   ```ppl
   | stats avg(bytes) by extension
   ```
   {% include copy.html %}

1. Select **Bar** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `extension` and **Y-Axis** to `AVG(bytes)`.
1. In the **Bar** section, enable **Use threshold colors**.
1. In the **Thresholds** section, set thresholds at `2000`, `4000`, and `6000`.
1. Set **Threshold lines mode** to **Off**.

![Bar chart with threshold colors applied]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-histogram-threshold-result.png){: width="100%" }

### Heatmap chart

In heatmap charts, thresholds color cells by value range instead of using the selected color schema. To apply thresholds to a heatmap chart, enable **Use threshold colors**, then configure threshold values and colors in the **Thresholds** section.

For example, select the `opensearch_dashboards_sample_data_logs` dataset, enter the following query, and select **Update**:

```ppl
| stats avg(bytes) by extension, `machine.os`
```
{% include copy.html %}

Select **Heatmap** as the visualization type. In the **Fields** section, set **X-Axis** to `extension`, **Y-Axis** to `machine.os`, and **Value** to `AVG(bytes)`. In the **Heatmap** section, enable **Use threshold colors**. In the **Thresholds** section, set thresholds at `4000`, `6000`, and `8000`.

![Heatmap chart with threshold colors applied to cells]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-threshold-colors.png){: width="100%" }

### Scatter chart

In scatter charts, thresholds can color points based on each point's value. Scatter charts can also display threshold reference lines. To apply thresholds to a scatter chart, follow these steps:

1. Select the `opensearch_dashboards_sample_data_flights` dataset.
1. Select **Update**.
1. Select **Scatter** as the visualization type.
1. In the **Fields** section, set **X-Axis** to `DistanceMiles` and **Y-Axis** to `AvgTicketPrice`.
1. Open the **Thresholds** section and select **+ Add threshold**.
1. Set thresholds at `400`, `600`, and `800`.

The scatter chart now displays points using threshold colors based on ticket price.

![Scatter chart with threshold colors applied to points]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter-threshold-result.png){: width="100%" }

### State timeline chart

In state timeline charts, thresholds color state regions by numeric value range. This is useful when the color should represent ranges, such as successful, warning, and error response codes, instead of each individual value. When **Use threshold color** is enabled, the threshold ranges determine the region colors instead of value mapping colors.

For example, select the `opensearch_dashboards_sample_data_logs` dataset, enter the following query, and select **Update**:

```ppl
| FIELDS @timestamp, response
```
{% include copy.html %}

Select **State timeline** as the visualization type. In the **Fields** section, set **X-Axis** to `@timestamp` and **Color** to `response`. The `response` field is numeric, so it can be divided into threshold ranges. In the **Thresholds** section, keep the base color green and set thresholds at `400` and `500`. In the **State Timeline** section, enable **Use threshold color**. To show only the threshold-colored regions, leave **Show display text** turned off.

The timeline regions are colored by response code range: values from `0` to less than `400`, values from `400` to less than `500`, and values at or above `500`.

![State timeline chart with threshold colors applied to response code ranges]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-threshold-colors.png){: width="100%" }

### Table chart

In table charts, thresholds color numeric cells. To apply thresholds to a table chart, open the **Table** section, use **Cell style** to select a numeric field, choose **Colored Text** or **Colored Background**, and then configure threshold values and colors in the **Threshold** section.

For example, select the `opensearch_dashboards_sample_data_flights` dataset, enter the following query, and select **Update**:

```ppl
| FIELDS AvgTicketPrice, Carrier, Dest, Origin
```
{% include copy.html %}

Select **Table** as the visualization type. In the **Table** section, set **Cell style** to `AvgTicketPrice` and **Colored Background**. In the **Threshold** section, set thresholds at `400`, `600`, and `1000`.

![Table chart with threshold colors applied to numeric cells]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/table-threshold-cells.png){: width="100%" }
