---
layout: default
title: Standard options
parent: Configuring visualizations
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 30
---

# Standard options

Standard options control how numeric values are formatted in a visualization. Use them to set units, custom suffixes, decimal precision, and, for charts with a scale, minimum and maximum values.

## Supported chart types

The following table lists the standard options supported by each visualization type.

| Visualization type                                                                                             | Min and Max | Units | Unit suffix | Decimals |
| :------------------------------------------------------------------------------------------------------------- | :---------- | :---- | :---------- | :------- |
| [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/)               | Yes         | Yes   | Yes         | Yes      |
| [Bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/)                 | Yes         | Yes   | Yes         | Yes      |
| [Bar gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/)     | Yes         | Yes   | Yes         | Yes      |
| [Gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/)             | Yes         | Yes   | Yes         | Yes      |
| [Heatmap]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/)               | No          | Yes   | Yes         | Yes      |
| [Histogram]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/histogram-chart/)           | Yes         | Yes   | Yes         | Yes      |
| [Line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/)               | Yes         | Yes   | Yes         | Yes      |
| [Metric chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/metric-chart/)           | No          | Yes   | Yes         | Yes      |
| [Pie chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/pie-chart/)                 | No          | Yes   | Yes         | Yes      |
| [Scatter plot]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/)          | Yes         | Yes   | Yes         | Yes      |
| [State timeline]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/) | No          | No    | No          | No       |
| [Table]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/table-chart/)                   | No          | No    | No          | No       |

## Options

The following table describes the available standard options.

| Setting         | Description                                                                                                                                                            |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Min**         | The lower bound of the value scale. For Cartesian charts, this sets the value-axis minimum. For gauge and bar gauge charts, this sets the scale minimum.               |
| **Max**         | The upper bound of the value scale. For Cartesian charts, this sets the value-axis maximum. For gauge and bar gauge charts, this sets the scale maximum.               |
| **Unit**        | The unit displayed with the value. Some units, such as currency symbols, appear before the value. Other units appear after the value or scale the value automatically. |
| **Unit suffix** | Custom text appended after the unit or value, for example `/sec`. Use this to show custom units or rates.                                                              |
| **Decimals**    | The number of decimal places to display. Leave this setting empty to use automatic precision.                                                                          |

## Units

The **Unit** menu groups common formats such as numbers, percentages, currencies, data units, time units, mass units, and length units.

For unit groups that support scaling, the selected unit acts as the input unit, and the visualization converts the value to the most readable unit in the same group. For example, if the unit is set to bytes (`B`), a value of `1000` is displayed as `1 KB`.

Some units only change the displayed label or symbol. For example, a currency unit can display a symbol before the value, while a percentage unit appends `%`.

The following metric chart is based on an origin value of 7,911 with the unit set to bytes (`B`).

![Metric chart with an origin value of 7,911 and unit selection bytes]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/metric-chart-unit-byte.png)

## Unit suffix

Use **Unit suffix** to append custom text after the formatted value. This is useful for rates or custom units.

For example, set **Units** to **bytes (`B`)** and set **Unit suffix** to `/sec` to display byte rates in Metric chart. With **Decimals** set to automatic precision, an origin value of `14,074` total bytes is displayed as `14.07 KB/sec`.

![Metric chart with an origin value of 14,074 and bytes selected as the unit and `/sec` as unit suffix]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/metric-chart-unit-byte-suffix.png)

## Decimals

Use **Decimals** to control numeric precision. For example, enter `2` to display two decimal places. Leave the setting empty to let the visualization choose the precision automatically.

The following bar chart has **Units** set to **bits (`b`)** and **Decimals** set to `1`. For Cartesian charts, unit formatting also applies to axis labels.

![Bar chart with units set to bits and decimals set to 1]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-unit-bit-decimal-1.png)

## Min and Max

Use **Min** and **Max** to define the displayed value range.

For Cartesian charts, such as area, bar, histogram, line, and scatter charts, **Min** and **Max** set the value-axis range.

The following bar chart has **Min** set to `100` and **Max** set to `300`. The bar baseline starts at `100`, so values below this range are clipped, and the value axis extends to `300`.

![Bar chart with Min set to 100 and Max set to 300]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-min-100-max-300.png)

For gauge and bar gauge charts, **Min** and **Max** define the scale boundaries. Thresholds and filled ranges are calculated within this range. When left empty, the visualization calculates the range automatically.

For example, within the following threshold configuration,

![Threshold configuration ranges from 1200 to 2200]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/standard-options-threshold-config.png){: width="40%" }

The following gauge chart has a value of `2000`, **Min** set to `1200`, and **Max** set to `2200`. The gauge scale uses this range to position the threshold segments.

![Gauge chart with value 2000, Min set to 1200, and Max set to 2200]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge-min-1200-max-2200.png)
