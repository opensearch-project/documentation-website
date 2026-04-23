---
layout: default
title: Building data visualizations
nav_order: 30
has_children: true
has_toc: false
---

# Building data visualizations

You can use the **Visualize** application in **OpenSearch Dashboards** to present data graphically.

>This documentation uses the following terms:
>- Visualize: the OpenSearch Dashboards application for creating vizualizations.
>- **Visualize** (bold): The Visualize UI, as dislayed in [Navigating the Visualize UI](#navigating-the-visualize-ui).
>- A _data visualization_ or _visualization_ is a single pane in the UI containing a graph, chart, or other visual representation of data. The term can also refer to the visual data representation itself.
>- A _dashboard_ is a collection of data visualizations. See [Creating dashboards]({{site.url}}{{site.baseurl}}/_dashboards/dashboard/).
{: .note}

A visualization shows one or more data fields or aggregations, summarizing their distribution, organization, or some other property that's easier to grasp visually than in the raw data. Multiple visualizations can be arranged into a dashboard.

This page describes how to use **Visualize** to create, modify, and save data visualizations.

## Navigating the Visualize UI

The following components make up the **Visualize** UI.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/viz-app-panel-callouts.png" alt="Visualize application" width="100%">

- The _search_ bar (A) enables selection of data using a query language search. See [Using the search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/).
- The _time filter_ (B) provides a graphical interface for selecting data values and ranges. See [Using the time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
- The _filter_ tool (C) contains frequently used commands and shortcuts. See [Using the filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).
- The **Visualize** _application panel_ shows the following elements:
  - (D) The visualization.
  - The _visualization tools_ panel (E) contains all the controls to select and configure the visualization. Its contents depend on the type of the visualization. See [Visualization tool]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-tool-ref/).


## Prerequisites

Before using the **Visualize** tool, ensure that you:

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards).

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

   The demonstrations on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset. 
   {: .tip}

- Understand OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).

- Some tasks, such as opening a new visualization and saving a visualization, are common to the process of building any visualization. Instructions for these tasks are linked from the tutorial where they are needed.

- Know how to use the **[Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/)** application to explore data, including the filter tools common to the **Dashboard**, **Discover**, and **Visualize** applications:
  - [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/)
  - [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/)
  - [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/)
  - [field-select tool]({{site.url}}{{site.baseurl}}/dashboards/discover/field-select/)


## Building visualizations

The procedure for building a visualization follows the same pattern in most cases, as follows:

1. In the Visualize application, [create a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

1. Build the visualization by iteratively executing the following steps:

   1. Select the data fields to display.

   1. Select aggregations to bucket and sort data.

   1. Render the visualization.

   1. Adjust display parameters such as grids, colors, legends, and so on.

1. [Save the visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz).

To begin immediately with creating specific visualization types, choose a visualization type from the summary table in [Visualization types](#visualization-types) to go to a tutorial or procedure.

Many of the visualization UI elements and tools are identical among the visualization types, so familiarity with one type will help you create others. To take a methodical tutorial approach, starting with basic visualization elements and building on previous learning, we recommend doing the following tutorials in order:

1. [Markdown visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/utility-visualizations/#building-a-markdown-visualization)

1. [Metric visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/#building-a-metric-visualization)

1. [Table visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/#building-a-data-table)

1. [Bar chart visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-a-bar-chart)


## Visualization types

OpenSearch Dashboards provides a wide variety of data visualizations for all data types. The following table shows the visualization build tools organized by data type.

Data types | Visualization types
-- | --
[**Text data**]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/): Display data as text in various formats. | <!-- Data tables -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-datatable-icon.png" width="90" height="90" alt="Data table icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/#building-a-data-table) <!-- Metrics -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-metric-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/#building-a-metric-visualization) <!-- Tag clouds -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-tagcloud-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/text-visualizations/#building-a-tag-cloud) 
[**One-dimensional data**]({{site.url}}{{site.baseurl}}/dashboards/visualize/one-dimensional-data/): Display numerical data in isolation or compared across categories. | <!-- Gauges -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-gauge-icon.png" width="90" height="90" alt="Gauge icon"> <img src="{{site.url}}{{site.baseurl}}/images/icons/vis-goal-icon.png" width="90" height="90" alt="Goal icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/one-dimensional-data/#building-a-gauge-visualization) <!-- Pie charts -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-pie-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/one-dimensional-data/#building-a-pie-chart)
[**Multi-dimensional data**]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data): Plot data over time, across categories, or against another numerical field. | <!-- Bar charts -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-vertbar-icon.png" width="90" height="90" alt="Vertical bar chart icon"> <img src="{{site.url}}{{site.baseurl}}/images/icons/vis-horizbar-icon.png" width="90" height="90" alt="Horizontal bar chart icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-a-bar-chart) <!-- Area charts -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-area-icon.png" width="90" height="90" alt="Area chart icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-an-area-chart)  <!-- Heatmaps -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-heatmap-icon.png" width="90" height="90" alt="Heat map icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-a-heat-map) <!-- Line graphs -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-line-icon.png" width="90" height="90" alt="Line graph icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-a-line-graph)   <!-- Timelines -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-timeline-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/multi-dimensional-data/#building-a-timeline)
[**Maps and data**]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/): Plot data based on geographic region or by geographic coordinate. | <!-- maps -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-maps-icon.png" width="90" height="90" alt="Maps icon"> <img src="{{site.url}}{{site.baseurl}}/images/icons/vis-coordmap-icon.png" width="90" height="90" alt=" icon"> <img src="{{site.url}}{{site.baseurl}}/images/icons/vis-regionmap-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#using-maps)
[**Utility**]({{site.url}}{{site.baseurl}}/dashboards/visualize/utility-visualizations/): Visualizations that don't display data, but support other visualizations. | <!-- Controls -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-controls-icon.png" width="90" height="90" alt="Controls icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/utility-visualizations#building-a-control-visualization) <!-- Markdown -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-markdown-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/utility-visualizations/#building-a-markdown-visualization)
[**Other tools**]({{site.url}}{{site.baseurl}}/dashboards/visualize/other-tools/): Self-contained tools, each designed to build a particular class of visualizations. | <!-- PPL -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-ppl-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/other-tools/#building-a-pipeline-visualization)  <!-- TSVB -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-tsvb-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/other-tools/#building-a-time-series-visualization) <!-- Vega -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-vega-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/other-tools/#building-a-visualization-from-queries) <!-- VisBuilder -->[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-visbuilder-icon.png" width="90" height="90" alt=" icon">]({{site.url}}{{site.baseurl}}/dashboards/visualize/other-tools/#building-a-visualization-using-drag-and-drop)


## Next steps

- Read more about different types of visualizations, their uses, and their technical details. See the [Visualizations reference]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-ref/).

- Once you have some visualizations of your data, assemble them into a dashboard. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
