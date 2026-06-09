---
layout: default
title: Visualize application
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualize-app/
  - /dashboards/visualize/viz-index/
---

# Visualize application

The **Visualize** application uses a point-and-click interface to create data visualizations from aggregations. You select a visualization type, configure metrics and buckets, and adjust display settings to build charts, tables, maps, and other visual representations of your data.

## Prerequisites

Before creating a visualization, ensure the following setup is complete.

### Install sample data (optional)

The examples in this documentation use the OpenSearch Dashboards sample datasets. To install sample data, follow these steps:

1. On the OpenSearch Dashboards home page, select **Add sample data**.
2. Select **Add data** for the datasets you want to use (for example, **Sample flight data** or **Sample web logs**).

For more information, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data).

### Create an index pattern

The **Visualize** application requires an index pattern. To create an index pattern, follow these steps:

1. Go to **Index patterns** (under **Management**).
2. Select **Create index pattern**.
3. Enter the index name (for example, `opensearch_dashboards_sample_data_flights`).
4. Select **Next step**.
5. Select a time field (for example, `timestamp`).
6. Select **Create index pattern**.

For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

## Creating a new visualization

How you access the **Visualize** application depends on whether workspaces are enabled.

**With workspaces enabled** (default in OpenSearch 2.18 and later):

1. From the OpenSearch Dashboards home page, select a workspace (for example, an **Analytics** workspace).
2. In the left navigation menu, expand **Visualize and report** and select **Visualizations**.
3. Select **Create new visualization**.

**Without workspaces** (classic navigation):

1. From the left navigation menu, select **Visualize**.
2. Select **Create visualization**.

Both paths open a dialog where you select a visualization type and a data source (index pattern or saved search).

## Visualization types

The **Visualize** application supports the following visualization types.

| Visualization type | Description |
| :--- | :--- |
| [Area chart]({{site.url}}{{site.baseurl}}/dashboards/visualize/area/) | Displays data as a filled region between a line and the axis. Use for showing volume over time or comparing stacked categories. |
| Vertical bar chart | Compares categorical data as vertical bars. Use for ranking or comparing values across categories. |
| Horizontal bar chart | Compares categorical data as horizontal bars. Use when category labels are long or numerous. |
| Controls | Adds interactive filter panels (dropdown lists or range sliders) to a dashboard. |
| Coordinate map | Plots geographic data points on a map using latitude and longitude coordinates. For more information, see [Coordinate and region maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/). |
| Data table | Displays raw or aggregated data in tabular form. |
| Gauge | Displays a single value on a gauge dial relative to a goal. |
| Goal | Displays a single value on a progress bar relative to a target. |
| Heat map | Uses color intensity to represent values across two categorical dimensions. |
| Line chart | Plots data points connected by lines. Use for visualizing trends and changes over time. |
| Maps | Provides an interactive map with multiple layer types. For more information, see [Using maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/). |
| Markdown | Renders Markdown text alongside data visualizations for context and instructions. |
| Metric | Displays a single numeric value prominently. Use for KPIs and summary statistics. |
| Pie chart | Displays proportional data as slices of a circle. Use for part-to-whole comparisons. |
| PPL | Creates visualizations by entering PPL queries directly. |
| Region map | Colors geographic regions (countries, states) by aggregated value. For more information, see [Coordinate and region maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/). |
| Tag cloud | Displays words sized by frequency or another metric. |
| Timeline | Uses a text-based expression syntax to create time-series visualizations. |
| [TSVB]({{site.url}}{{site.baseurl}}/dashboards/visualize/tsvb/) | Creates detailed time-series visualizations with support for Area, Line, Metric, Gauge, Markdown, and Data Table types. |
| [Vega]({{site.url}}{{site.baseurl}}/dashboards/visualize/vega/) | Uses the Vega and Vega-Lite declarative grammars for custom visualizations. |
| [VisBuilder]({{site.url}}{{site.baseurl}}/dashboards/visualize/visbuilder/) | A drag-and-drop tool for creating visualizations without selecting a chart type in advance. |
