---
layout: default
title: Visualize
nav_order: 4
has_children: true
---

# Visualize

By visualizing your data, you translate complex, high-volume, or numerical data into a visual representation that is easier to process.

OpenSearch Dashboards gives you data visualization tools to improve and automate the visual communication process. Using visual elements like charts, graphs, or maps to represent data gives you the tools to advance business intelligence and support data-driven decision-making and strategic planning.

# Visualization types in OpenSearch Dashboards

Dashboards has several visualization types to support your data analysis needs. The following sections give you an overview of the visualization types in Dashboards and their common use cases.

## Area charts:  Basic and stacked

Area charts depict changes over time, and they are commonly used to show trends. Area charts more efficiently identify patterns in log data, such as sales data for a time range and trends over that time. Reference [Graphs and charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/graphs-and-charts) to learn more about how to create and use them in Dashboards.

 <img src="{{site.url}}{{site.baseurl}}/images/area-chart-1.png" alt="Example area chart in OpenSearch Dashboards" height="90%">

## Bar charts

Bar charts, vertical or horizontal, compare categorical data and demonstrate changes of a variable over a period of time. Reference [Graphs and charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/graphs-and-charts) to learn more about how to create and use them in Dashboards.

<table style="table-layout: fixed ; width: 100%;">
<tbody>
<tr style="text-align: center; vertical-align:center;">
<td><img src="{{site.url}}{{site.baseurl}}/images/bar-chart-1.png" alt="Example vertical bar chart in OpenSearch Dashboards" height="100"></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/bar-horizontal-1.png" alt="Example horizontal bar chart in OpenSearch Dashboards" height="100"></td>
</tr>
<tr style="text-align: center; vertical-align:top; font-weight: bold; color: rgb(0,59,92)">
<td>Vertical bar chart</td>
<td>Horizontal bar chart</td>
</tr>
</tbody>
</table>

## Data tables

Data tables, or tables, show your raw data in tabular form. 
Reference [Data tables]({{site.url}}{{site.baseurl}}/dashboards/visualize/tables) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/data-table-1.png" alt="Example data table in OpenSearch Dashboards" height="100">

## Gantt chart

Gantt charts show the start, end, and duration of unique events in a sequence. Gantt charts are useful in trace analytics, telemetry, and anomaly detection use cases where you want to understand interactions and dependencies between various events in a schedule. Reference [Gantt charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gantt/) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/gantt-chart.png" alt="Example Gantt chart in OpenSearch Dashboards" height="100">

## Gauge charts

A gauge chart displays how much there is of the thing you are measuring. In a gauge chart, this measurement can exist alone or in relation to another measurement, such as comparing actual sales to the sales goal. Reference [Gauge charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gauge) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/gauge-1.png" alt="Example gauge chart in OpenSearch Dashboards" width="90%">

## Heat maps

A heat map is a view of a histogram (a graphical representation of the distribution of numerical data) over time. Instead of using bar height as a representation of frequency, as with a histogram, heat maps use cells, or coloring a cell proportional to the number of values. Reference [Heat maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/heat-maps) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/heat-map-1.png" alt="Example heat map in OpenSearch Dashboards" height="65">

## Line graphs

Line charts compare changes in measure values over period of time, such as gross sales by month or gross sales and net sales by month. Reference [Graphs and charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/graphs-and-charts) to learn more about how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/line-1.png" alt="Example line graph in OpenSearch Dashboards" height="100">

## Metric charts

Metric charts show a numerical value, such as a key performance indicator (KPI), to visualize a comparison between a key value and its target value. Metric charts display a value comparison, the two values being compared, and a progress bar. Reference [Metric charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/metric-charts) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/metric-chart-1.png" alt="Example metric chart in OpenSearch Dashboards" height="100">

## Maps
### Coordinate maps

Coordinate maps show location-based data on a map. Use coordinate maps to visualize GPS data (latitude and longitude coordinates) on a map. For information about OpenSearch-supported coordinate field types, see [Geographic field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) and [Cartesian field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy/).

### Region maps

Region maps show patterns and trends across geographic locations. A region map is one of the basemaps in Dashboards. For information about creating custom vector maps in Dashboards, see [Region maps visualizations](https://opensearch.org/docs/latest/dashboards/geojson-regionmaps/).

Reference [Maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/) to learn how to create and use them in Dashboards. 

<img src="{{site.url}}{{site.baseurl}}/images/map-1.png" alt="Example coordinate map in OpenSearch Dashboards" height="100">

## Pie charts

Pie charts compare values for items in a dimension, such as  a percentage of a total amount. Reference [Pie charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/pie-charts/) to learn how to create and use them in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/pie-1.png" alt="Example pie chart in OpenSearch Dashboards" height="100">

## TSVB

Time-series visual builder provides a detailed time series visualization. For example, you can use TSVB to show data over time, such as flights by status over time or flight delays by delay type over time. Reference [TSVB]({{site.url}}{{site.baseurl}}/dashboards/visualize/TSVB/) to learn how to create and use this set of visualization types in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/TSVB-1.png" alt="Example TSVB in OpenSearch Dashboards" height=100>

## Tag cloud

Tag (or word) clouds are a way to display how often a word is used in relation to other words in a dataset. The best use for this type of visual is to show word or phrase frequency. Learn how to create and use [Tag clouds]({{site.url}}{{site.baseurl}}/dashboards/visualize/tag-clouds/) in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/word-cloud-1.png" alt="Example Tag cloud in OpenSearch Dashboards" height="100">

## Timeline

Timelines  show the occurrence of events in chronological order, allowing  you to see when events occur and how they change over time. Reference [Timelines]({{site.url}}{{site.baseurl}}/dashboards/visualize/timeline/) to learn how to create and use timelines in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/timeline-1.png" alt="Example Timeline in OpenSearch Dashboards" height="100">

## VisBuilder

VisBuilder is used to create data visualizations with a drag-and-drop gesture. It gives you an immediate view of your data without the need to preselect the visualization output. Reference [VisBuilder]({{site.url}}{{site.baseurl}}/dashboards/visbuilder/) to learn how to create and use drag-and-drop visualizations in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Example Timeline in OpenSearch Dashboards" height="100">

## Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization grammars for creating, sharing, and saving interactive data visualizations. Vega visualizations in OpenSearch gives you flexibility to visualize multidimensional data using a layered approach to build and manipulate visualizations in a structured manner.

Reference [Vega and Vega-Lite]({{site.url}}{{site.baseurl}}/dashboards/visualize/vega) to learn how to create and use these visualization grammars in Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/vega-1.png" alt="Example Vega visualization with JSON specification in OpenSearch Dashboards" height="100">

