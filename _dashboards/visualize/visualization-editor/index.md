---
layout: default
title: Visualization editor
parent: Building data visualizations
nav_order: 75
has_children: true
has_toc: false
---

# Visualization editor

The visualization editor is a query-driven visualization tool available at **Explore** > **Visualization editor** (`/app/visualization-editor`). Unlike the traditional Visualize application that uses aggregation-based configurations, the visualization editor lets you write PPL (Piped Processing Language) queries and map query results directly to chart fields.

## Key features

- **Query-driven**: Write PPL queries to shape your data, then map result fields to chart axes.
- **Auto field mapping**: When your query results match a chart type's expected structure, fields are mapped automatically.
- **Multiple chart types**: Supports line charts, bar charts, and other visualization types.
- **Progressive configuration**: Start with a simple query and refine the visualization by adding dimensions, multiple metrics, or dual axes.

## Workflow

1. Write a PPL query in the query bar.
2. The system automatically suggests a chart type based on the shape of your query results (for example, one date field and one numeric field suggests a line chart). You can override the suggestion if needed.
3. Query result fields are automatically mapped to chart axes. You can adjust the mapping in the **Fields** panel.
4. Customize the chart appearance using chart-specific settings.

## Chart types

| Chart type | Best for |
| --- | --- |
| [Line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/) | Trends over time, comparing multiple series, correlating metrics |
| [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/) | Volume over time, comparing category contributions, stacked totals |
| [Pie chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/pie-chart/) | Proportions, part-to-whole relationships, categorical breakdowns |
| [Bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/) | Comparing categories, ranking items, grouped comparisons, thresholds |
| [Gauge]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/) | Single KPI against targets, threshold monitoring |
| [Bar gauge]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/) | Progress toward a goal, comparing multiple KPIs side by side |
| [Heatmap]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/) | Density patterns, two-dimensional distributions, time-based intensity |
| [Scatter]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/) | Correlations between variables, outlier detection, group comparisons |
| [State timeline]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/) | Service status over time, alert progression, state transitions |

## Next steps

- [Build a line chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/line-chart/) using the visualization editor.
- [Build an area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/area-chart/) using the visualization editor.
- [Build a pie chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/pie-chart/) using the visualization editor.
- [Build a bar chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-chart/) using the visualization editor.
- [Build a gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/gauge-chart/) using the visualization editor.
- [Build a bar gauge chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/bar-gauge-chart/) using the visualization editor.
- [Build a heatmap chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/heatmap-chart/) using the visualization editor.
- [Build a scatter chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/scatter-chart/) using the visualization editor.
- [Build a state timeline chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/state-timeline-chart/) using the visualization editor.
