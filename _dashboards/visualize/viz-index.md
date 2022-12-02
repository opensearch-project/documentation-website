---
layout: default
title: Visualize
nav_order: 4
has_children: true
---

# Visualize

Data visualization is representing your data in a visual context. By visualizing your data, you translate complex, high-volume, or numerical data into a visual representation that is easier to process.

OpenSearch Dashboards gives you data visualization tools to improve and automate the visual communication process. Using visual elements like charts, graphs, or maps to represent data, gives you the tools to advance business intelligence and support data-driven decision-making and strategic planning.

# Visualization types in OpenSearch Dashboards

Dashboards has several visualization types to support your data analysis needs. The following sections give you an overview of the visualization types in Dashboards and their common use cases.

## Area charts:  Basic and stacked

 <img src="{{site.url}}{{site.baseurl}}/images/area-chart-1.png" alt="Example area chart in OpenSearch Dashboards" width="60%" height="30%">

Area charts depict changes over time, and they are commonly used to show trends. Area charts more efficiently identify patterns in log data,such as sales data for a time range and trends over that time. Learn how to create and use [Area charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/area-charts) in Dashboards.

## Bar charts

<img src="{{site.url}}{{site.baseurl}}/images/bar-chart-1.png" alt="Example vertical bar chart in OpenSearch Dashboards" width="60%" height="30%">

<img src="{{site.url}}{{site.baseurl}}/images/bar-horizontal-1.png" alt="Example horizontal bar chart in OpenSearch Dashboards" width="60%" height="30%">

Bar charts, vertical or horizontal, compare categorical data and demonstrate changes of a variable over a period of time. Learn how to create and use [Bar charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/bar-charts) in Dashboards.

## Data tables

<img src="{{site.url}}{{site.baseurl}}/images/data-table-1.png" alt="Example data table in OpenSearch Dashboards" width="75%" height="35%">

Data tables, or tables, show your raw data in tabular form. Learn how to create and use [Data tables]({{site.url}}{{site.baseurl}}/dashboards/visualize/tables) in Dashboards.

## Gantt chart

<img src="{{site.url}}{{site.baseurl}}/images/gantt-chart.png" alt="Example Gantt chart in OpenSearch Dashboards" width="75%" height="35%">

Gantt charts show the start, end, and duration of unique events in a sequence. Gantt charts are useful in trace analytics, telemetry, and anomaly detection use cases, where you want to understand interactions and dependencies between various events in a schedule. Learn how to create and use [Gantt charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gantt/) in Dashboards.

## Gauge charts

<img src="{{site.url}}{{site.baseurl}}/images/gauge-chart-1.png" alt="Example gauge chart in OpenSearch Dashboards" width="60%" height="30%">

A gauge chart displays how much there is of the thing you are measuring. In a gauge chart, this measurement can exist alone or in relation to another measurement, such as comparing actual sales to the sales goal. Learn how to create and use [Gauge charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gauge) in Dashboards.

## Heat maps

<img src="{{site.url}}{{site.baseurl}}/images/heatmap-1.png" alt="Example heat map in OpenSearch Dashboards" width="60%" height="30%">

A heat map is a view of a histogram (a graphical representation of the distribution of numerical data) over time. Instead of using bar height as a representation of frequency, as with a histogram, heat maps use cells, coloring a cell proportional to the number of values. Learn how to create and use [Heat maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/heat-maps) in Dashboards.
## Line graphs

<img src="{{site.url}}{{site.baseurl}}/images/line-graph-1.png" alt="Example line graph in OpenSearch Dashboards" width="60%" height="30%">

Line charts compare changes in measure values over period of time, such as gross sales by month or gross sales and net sales by month. Learn how to create and use [Line charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/line-charts) in Dashboards.

## Metric charts

<img src="{{site.url}}{{site.baseurl}}/images/metric-chart-1.png" alt="Example metric chart in OpenSearch Dashboards" width="60%" height="30%">

Metric charts show a numerical value, such as a key performance indicator (KPI), to visualize a comparison between a key value and its target value. Metric charts display a value comparison, the two values being compared, and a progress bar. Learn how to create and use [Metric charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/metric-charts) in Dashboards.

## Maps
### Coordinate maps

<img src="{{site.url}}{{site.baseurl}}/images/map-1.png" alt="Example map in OpenSearch Dashboards" width="60%" height="30%">

Coordinate maps show location-based data on a map. Use coordinate maps to visualize GPS data (latitude and longitude coordinates) on a map.Learn how to create and use [Coordinate maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/coordinate-maps) in Dashboards.

For information about OpenSearch-supported coordinate field types, see [Geographic field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) and [Cartesian field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy/). 

### Region maps

Region maps show patterns and trends across geographic locations. A region map is one of the basemaps in Dashboards. Learn how to create and use [Region maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/) in Dashboards. 

## Pie charts

<img src="{{site.url}}{{site.baseurl}}/images/pie-chart-1.png" alt="Example pie chart in OpenSearch Dashboards" width="60%" height="30%">

Pie charts compare values for items in a dimension, such as  a percentage of a total amount. Learn how to create and use [Pie charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/pie-charts/) in Dashboards.

## TSVB

<img src="{{site.url}}{{site.baseurl}}/images/TSVB-1.png" alt="Example TSVB in OpenSearch Dashboards" width="60%" height="30%">

Time-series visual builder provides a detailed time series visualization. For example, you can use TSVB to show data over time, such as flights by status over time or flight delays by delay type over time. Learn how to create and use [TSVB]({{site.url}}{{site.baseurl}}/dashboards/visualize/TSVB/) in Dashboards. 

## Tag cloud

<img src="{{site.url}}{{site.baseurl}}/images/word-cloud-1.png" alt="Example Tag cloud in OpenSearch Dashboards" width="60%" height="30%">

Tag (or word) clouds are a way to display how often a word is used in relation to other words in a dataset. The best use for this type of visual is to show word or phrase frequency. Learn how to create and use [Tag clouds]({{site.url}}{{site.baseurl}}/dashboards/visualize/tag-clouds/) in Dashboards.

## Timeline

<img src="{{site.url}}{{site.baseurl}}/images/timeline-1.png" alt="Example Timeline in OpenSearch Dashboards" width="60%" height="30%">

Timelines  show the occurrence of events in chronological order, allowing  you to see when things occur and how they change over time. Learn how to create and use [Timelines]({{site.url}}{{site.baseurl}}/dashboards/visualize/timeline/) in Dashboards.

## VisBuilder

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Example Timeline in OpenSearch Dashboards" width="60%" height="30%">

VisBuilder is used to create data visualizations with a drag-and-drop gesture. It gives you an immediate view of your data without the need to preselect the visualization output. Learn how to create and use [VisBuilder]({{site.url}}{{site.baseurl}}/dashboards/visbuilder/) in Dashboards.