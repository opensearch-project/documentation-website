---
layout: default
title: Configuring visualizations
parent: Creating visualizations using queries
grand_parent: Building data visualizations
nav_order: 90
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualization-editor/configuring-visualizations/
---

# Configuring visualizations in the visualization editor

The visualization editor provides shared configuration options that apply across multiple visualization types. Each visualization type page documents its specific options. The following configurations are common to most visualizations.

## Fields

The **Fields** panel maps query result columns to chart axes. Select which fields to use for the X-axis, Y-axis, and optional dimensions like color or size. Available field mappings depend on the chart type.

## Split

Use the **Split** option when your data has more dimensions than a single chart can display. For example, if your query returns three dimensions but a line chart can only show two (X-axis and Y-axis), use Split to create multiple charts by splitting the data along the third dimension. Each resulting chart shows the same axes but filtered to a different value of the split field.

To create a split visualization, follow these steps:

1. In the dashboard, select **Create new** > **Add visualization**.
1. Select `opensearch_dashboards_sample_data_logs` as the dataset.
1. In the query editor, enter the following query and select **Update**:

   ```sql
   | stats count() by span(`@timestamp`, 1h), extension, `machine.os`
   ```
   {% include copy.html %}

1. In the time filter, select **Last 15 days**.
1. Set **Visualization type** to **Line**.
1. In **Fields**, configure the following settings:
   - **X-Axis**: Select `span(@timestamp,1h)`.
   - **Y-Axis**: Select `count()`.
1. In **Split**, configure the following settings:
   - **Split by**: Select `machine.os`.
   - Toggle **Show labels** to on.

The visualization displays a separate line chart for each `machine.os` value (for example, `win xp`, `osx`, `win 7`, `win 8`, `ios`), each showing the event count over time, as shown in the following image.

![Split visualization showing separate line charts for each machine.os value]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/split-example.png)

## Axes

The X-axis and Y-axis share the same configuration options. Each axis can be independently customized.

| Setting | Description |
| --- | --- |
| **Show axis** | Shows or hides the axis. |
| **Title** | A custom label for the axis. |
| **Position** | Controls the placement of the axis relative to the chart. Supported values: X-axis: **Top**, **Bottom**. Y-axis: **Left**, **Right**. |
| **Show grid lines** | When enabled, shows grid lines extending from the axis into the chart area. |
| **Show labels** | When enabled, shows category labels along the axis. |
| **Alignment** | Controls the rotation of axis labels: **Horizontal** (0°), **Vertical** (90°), or **Angled** (45°). |
| **Truncate after** | Sets the maximum character length for axis labels before truncation. |

Axes are available in area, bar, heatmap, histogram, line, scatter, and state timeline charts.

## Tooltip

The **Tooltip** panel controls what information appears when you hover over a data point. Options include showing all series values or only the hovered series.

Tooltips are available in area, bar, bar gauge, heatmap, histogram, line, pie, scatter, and state timeline charts.

## Legend

The **Legend** panel controls the display and position of the chart legend. Options include showing or hiding the legend and selecting its position (top, bottom, left, or right).

Legends are available in heatmap, pie, scatter, and state timeline charts.

## Standard options

Standard options control the display formatting for single-value visualizations.

| Setting | Description |
| --- | --- |
| **Unit** | The unit of measurement displayed alongside the value. |
| **Decimals** | The number of decimal places to display. |

Standard options are available in bar gauge, gauge, and metric charts.

## Value options

Value options control how values are calculated and displayed for single-value visualizations.

| Setting | Description |
| --- | --- |
| **Calculation** | The function used to reduce a series to a single value (for example, Last, Mean, Max, Min). For details, see [Value calculations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/value-calculations/). |
| **Show** | Controls whether to display the calculated value, the value name, or both. |

Value options are available in bar gauge, gauge, and metric charts.

## Thresholds

Thresholds define color-coded boundaries that indicate when values cross important limits. For details, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

## Value calculations

Value calculations determine how a series of values is reduced to a single number for display (for example, Last, Mean, Sum, Min, Max). For details, see [Value calculations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/value-calculations/).
