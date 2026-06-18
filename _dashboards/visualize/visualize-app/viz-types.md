---
layout: default
title: Choosing a visualization type
parent: Creating visualizations in the Visualize application
grand_parent: Building data visualizations
nav_order: 5
has_toc: false
redirect_from:
  - /dashboards/visualize/viz-types/
---

# Choosing a visualization type

The **Visualize** application supports the following visualization types, grouped by category. Each description includes guidance describing when the visualization type is most effective. For more information, see the individual visualization type pages.

## Text visualizations

Text visualizations display data using words and numbers rather than graphical elements. These provide detail and help key data stand out on a dashboard.

| Visualization type | Description |
| :--- | :--- |
| [**Metric visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/metric/) <br><br> ![Metric]({{site.url}}{{site.baseurl}}/images/dashboards/metric-chart-1.png){: width="400" } | Displays a single numeric value prominently. Use for KPIs and summary statistics. |
| [**Tag clouds**]({{site.url}}{{site.baseurl}}/dashboards/visualize/tag-cloud/) <br><br> ![Tag cloud]({{site.url}}{{site.baseurl}}/images/dashboards/word-cloud-1.png){: width="400" } | Displays words sized by frequency or another metric. |
| [**Data tables**]({{site.url}}{{site.baseurl}}/dashboards/visualize/data-table/) <br><br> ![Data table]({{site.url}}{{site.baseurl}}/images/data-table-1.png){: width="400" } | Displays raw or aggregated data in tabular form. |

## One-dimensional visualizations

One-dimensional visualizations display a single bucketed data field, comparing values across categories or showing proportions.

| Visualization type | Description |
| :--- | :--- |
| [**Gauge visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/gauge/) <br><br> ![Gauge]({{site.url}}{{site.baseurl}}/images/dashboards/gauge-1.png){: width="400" } | Displays a single value on a dial relative to defined ranges or thresholds. |
| [**Goal visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/goal/) <br><br> ![Goal]({{site.url}}{{site.baseurl}}/images/dashboards/example-goal-total-km.png){: width="400" } | Displays a single value on a progress bar relative to a target. |
| [**Pie charts**]({{site.url}}{{site.baseurl}}/dashboards/visualize/pie-charts/) <br><br> ![Pie chart]({{site.url}}{{site.baseurl}}/images/dashboards/pie-1.png){: width="400" } | Displays proportional data as slices of a circle. Use for part-to-whole comparisons. |

## Multidimensional visualizations

Multidimensional visualizations display one or more data fields as a function of another data field. The aggregations that bucket the data are numerical rather than categorical.

| Visualization type | Description |
| :--- | :--- |
| [**Bar charts**]({{site.url}}{{site.baseurl}}/dashboards/visualize/bar-charts/) <br><br> ![Vertical bar chart]({{site.url}}{{site.baseurl}}/images/dashboards/bar-chart-1.png){: width="400" } | Compare categorical data as vertical or horizontal bars. Use for ranking or comparing values across categories. |
| [**Area charts**]({{site.url}}{{site.baseurl}}/dashboards/visualize/area/) <br><br> ![Area chart]({{site.url}}{{site.baseurl}}/images/dashboards/area-chart-1.png){: width="400" } | Displays data as a filled region between a line and the axis. Use for showing volume over time or comparing stacked categories. |
| [**Heat maps**]({{site.url}}{{site.baseurl}}/dashboards/visualize/heat-map/) <br><br> ![Heat map]({{site.url}}{{site.baseurl}}/images/dashboards/heat-map-1.png){: width="400" } | Uses color intensity to represent values across two categorical dimensions. |
| [**Line charts**]({{site.url}}{{site.baseurl}}/dashboards/visualize/line-charts/) <br><br> ![Line chart]({{site.url}}{{site.baseurl}}/images/dashboards/line-1.png){: width="400" } | Plots data points connected by lines. Use for visualizing trends and changes over time. |

## Map visualizations

Map visualizations plot data based on geographic region or coordinate.

| Visualization type | Description |
| :--- | :--- |
| [**Coordinate maps**]({{site.url}}{{site.baseurl}}/dashboards/visualize/coordinate-maps/) <br><br> ![Coordinate map]({{site.url}}{{site.baseurl}}/images/dashboards/coordinate-map-example.png){: width="400" } | Plots geographic data points on a map using latitude and longitude coordinates. |
| [**Region maps**]({{site.url}}{{site.baseurl}}/dashboards/visualize/region-maps/) <br><br> ![Region map]({{site.url}}{{site.baseurl}}/images/dashboards/map-1.png){: width="400" } | Colors geographic regions by aggregated value. Supports custom GeoJSON vector maps. |
| [**Maps application**]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/) <br><br> ![Maps]({{site.url}}{{site.baseurl}}/images/dashboards/coordinate-1.png){: width="400" } | A standalone mapping tool with multiple layer types, tooltips, filters, and labels. |

## Utility visualizations

Utility visualizations don't display data directly but support other visualizations in the context of a dashboard.

| Visualization type | Description |
| :--- | :--- |
| [**Markdown visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/markdown/) <br><br> ![Markdown]({{site.url}}{{site.baseurl}}/images/dashboards/markdown.png){: width="400" } | Renders Markdown text alongside data visualizations for context and instructions. |
| [**Controls**]({{site.url}}{{site.baseurl}}/dashboards/visualize/controls/) <br><br> ![Controls]({{site.url}}{{site.baseurl}}/images/dashboards/controls-1.png){: width="400" } | Adds interactive filter panels (dropdown lists or range sliders) to a dashboard. |

## Other tools

The following visualization tools use specialized interfaces rather than the standard aggregation-based editor.

| Visualization type | Description |
| :--- | :--- |
| [**PPL visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/ppl/) <br><br> ![PPL]({{site.url}}{{site.baseurl}}/images/dashboards/ppl-example.png){: width="400" } | Creates visualizations by entering PPL queries directly. |
| [**TSVB visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/tsvb/) <br><br> ![TSVB]({{site.url}}{{site.baseurl}}/images/dashboards/TSVB-1.png){: width="400" } | Creates detailed time-series visualizations with support for Area, Line, Metric, Gauge, Markdown, and Data Table types. |
| [**Vega visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/vega/) <br><br> ![Vega]({{site.url}}{{site.baseurl}}/images/dashboards/vega-1.png){: width="400" } | Uses the Vega and Vega-Lite declarative grammars for custom visualizations. |
| [**VisBuilder**]({{site.url}}{{site.baseurl}}/dashboards/visualize/visbuilder/) <br><br> ![VisBuilder]({{site.url}}{{site.baseurl}}/images/dashboards/vis-builder-2.png){: width="400" } | A drag-and-drop tool for creating visualizations without selecting a chart type in advance. |
| [**Timeline visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/timeline/) <br><br> ![Timeline]({{site.url}}{{site.baseurl}}/images/dashboards/timeline-1.png){: width="400" } | Uses a text-based expression syntax to create time-series visualizations. |
