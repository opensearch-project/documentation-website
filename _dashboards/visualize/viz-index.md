---
layout: default
title: Visualizations
nav_order: 4
has_children: true
---

# Visualizations

Data visualization is the process of using visual elements like charts, graphs, or maps to represent data. It translates complex, high-volume, or numerical data into a visual representation that is easier to process.

OpenSearch Dashboards gives you data visualization tools to improve and automate the visual communication process. Using visual elements like charts, graphs, or maps to represent data, gives you the tools to advance business intelligence and support data-driven decision-making and strategic planning.

# Visualization types in OpenSearch Dashboards

Dashboards offers several visualization types to support different use cases for you to translate complex, high-volume, or numerical data into a visual representation that is easier to process.

## Area charts:  Basic and stacked

 <img src="{{site.url}}{{site.baseurl}}/images/area-chart-1.png" alt="Example area chart in OpenSearch Dashboards" width="60%" height="30%">

Area charts depict changes over time, and they are commonly used to show trends. For example, you can use area charts to more efficiently identify patterns in your log data,such as sales data for a time range and trends over that time.

Learn how to create and use [Area charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/area-charts) in Dashboards.

## Bar charts

<img src="{{site.url}}{{site.baseurl}}/images/bar-chart-1.png" alt="Example vertical bar chart in OpenSearch Dashboards" width="60%" height="30%">

<img src="{{site.url}}{{site.baseurl}}/images/bar-horizontal-1.png" alt="Example horizontal bar chart in OpenSearch Dashboards" width="60%" height="30%">

Bar charts, vertical or horizontal, compare two or more data factors and demonstrate changes of one variable over a period of time. For example, you may use a bar graph to represent packaging sales by color in the last month.

Learn how to create and use [Bar charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/bar-charts) in Dashboards.

## Coordinate maps

<img src="{{site.url}}{{site.baseurl}}/images/map-1.png" alt="Example map in OpenSearch Dashboards" width="60%" height="30%">

Coordinate maps show the difference between data values for a geographic location, such as a country, state or province, or city. For example, you may use a coordinate map for asset tracking and location-based marketing.

Learn how to create and use [Coordinate maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/) in Dashboards.

## Data tables

<img src="{{site.url}}{{site.baseurl}}/images/data-table-1.png" alt="Example data table in OpenSearch Dashboards" width="75%" height="35%">

Data tables, or tables, show your data in tabular form. Using data tables when you want to see individual values in raw form or examine specific values. For example, you may use data tables for financial analysis.

Learn how to create and use [Data tables]({{site.url}}{{site.baseurl}}/dashboards/visualize/tables) in Dashboards.

## Gantt chart

<img src="{{site.url}}{{site.baseurl}}/images/gantt-chart.png" alt="Example Gantt chart in OpenSearch Dashboards" width="75%" height="35%">

Gantt charts show the start, end, and duration of unique events in a sequence. Gantt charts are useful in trace analytics, telemetry, and anomaly detection use cases, where you want to understand interactions and dependencies between various events in a schedule. For example, consider an index of log data. The fields in a typical set of log data, especially audit logs, contain a specific operation or event with a start time and duration.

Learn how to create and use [Gantt charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gantt/) in Dashboards.

## Gauge charts

<img src="{{site.url}}{{site.baseurl}}/images/gauge-chart-1.png" alt="Example gauge chart in OpenSearch Dashboards" width="60%" height="30%">

A gauge chart is similar to a nondigital gauge, for example a gas gauge in an automobile. It displays how much there is of the thing you are measuring. In a gauge chart, this measurement can exist alone or in relation to another measurement. Each color section in a gauge chart represents one value. For example, you may use a gauge to compare actual sales to the sales goal.

Learn how to create and use [Gauge charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/gauge) in Dashboards.

## Heat maps

<img src="{{site.url}}{{site.baseurl}}/images/heatmap-1.png" alt="Example heat map in OpenSearch Dashboards" width="60%" height="30%">

Heat maps to show a measure for the intersection of two dimensions, with color-coding to easily differentiate where values fall in the range. Each rectangle on a heat map represents the value for the specified measure for the intersection of the selected dimensions. Rectangle color represents where the value falls in the range for the measure, with darker colors indicating higher values and lighter colors indicating lower ones. 

Use  a heat map if you want to identify trends and outliers, because the use of color makes these easier to spot. For example, you may want to use a heat map to show products most used by customers, measured by a simple count.

## Line graphs

<img src="{{site.url}}{{site.baseurl}}/images/line-graph-1.png" alt="Example line graph in OpenSearch Dashboards" width="60%" height="30%">

Line charts compare changes in measure values over period of time.For example, you may use line charts to show one measure over a period of time, for example, gross sales by month; multiple measures over a period of time, for example, gross sales and net sales by month; or one measure for a dimension over a period of time, for example, number of flight delays per day by airline. 