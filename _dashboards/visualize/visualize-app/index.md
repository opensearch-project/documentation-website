---
layout: default
title: Building visualizations visually
parent: Building data visualizations
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualize-app/
  - /dashboards/visualize/viz-index/
---

# Building visualizations visually

The **Visualize** application uses a point-and-click interface to create data visualizations from aggregations. To open the **Visualize** application, select **Visualize** from the left navigation menu.

## Visualization types

The **Visualize** application supports the following visualization types.

### Area charts

Area charts depict changes over time, and they are commonly used to show trends. For more information, see [Area charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/area/).

![Example area chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/area-chart-1.png){: width="600" }

### Bar charts

Bar charts (vertical or horizontal) compare categorical data and depict changes of a variable over a period of time.

Vertical bar chart             |  Horizontal bar chart
:-------------------------:|:-------------------------:
![Example vertical bar chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/bar-chart-1.png){: width="300" }  |  ![Example horizontal bar chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/bar-horizontal-1.png){: width="300" }

### Controls

Controls is a panel added to a dashboard to filter data. You can create two types of controls: **Options list** (a dropdown that filters by a terms aggregation, such as `machine.os.keyword`) and **Range slider** (filters within specified value ranges, such as `hour_of_day`).

![Example visualization using controls to filter data in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/controls-1.png){: width="600" }

### Data tables

Data tables show your raw data in tabular form.

![Example data table in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/data-table-1.png){: width="600" }

### Gauge charts

Gauge charts display how much there is of a measured value, optionally in relation to a benchmark or goal.

![Example gauge chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/gauge-1.png){: width="400" }

### Heat maps

A heat map displays the distribution of numerical data over time using colors to differentiate where values fall in a range.

![Example heat map in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/heat-map-1.png){: width="600" }

### Line charts

Line charts compare changes in measured values over a period of time, such as gross sales by month.

![Example line graph in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/line-1.png){: width="600" }

### Maps

You can create two types of maps in Dashboards: Coordinate maps and Region maps. Coordinate maps show the difference between data values for each location by size. Region maps show the difference between data values for each location by varying shades of color. For more information, see [Maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/).

#### Coordinate maps

Coordinate maps show location-based data on a map. Use coordinate maps to visualize GPS data (latitude and longitude coordinates) on a map. For information about OpenSearch-supported coordinate field types, see [Geographic field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-shape/) and [Cartesian field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/xy/).

![Example coordinate map in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/coordinate-1.png){: width="600" }

#### Region maps

Region maps show patterns and trends across geographic locations. A region map is one of the basemaps in Dashboards. For more information, see [Coordinate and region maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/).

![Example region map in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/map-1.png){: width="600" }

### Markdown

Markdown displays information and instructions alongside your data visualizations.

![Example Markdown visualization in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/markdown.png){: width="600" }

### Metric values

Metric values compare values in different measures, such as actual sales compared to sales goals.

![Example metric chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/metric-chart-1.png){: width="400" }

### Pie charts

Pie charts compare values for items in a dimension, such as a percentage of a total amount.

![Example pie chart in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/pie-1.png){: width="600" }

### Tag cloud

Tag clouds display how often a word is used in relation to other words in a dataset.

![Example tag cloud in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/word-cloud-1.png){: width="600" }

### TSVB

The Time-Series Visual Builder (TSVB) creates detailed time-series visualizations. It supports Area, Line, Metric, Gauge, Markdown, and Data Table visualization types. For more information, see [TSVB]({{site.url}}{{site.baseurl}}/dashboards/visualize/tsvb/).

![Example TSVB in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/TSVB-1.png){: width="600" }

### Timeline

Timeline uses a text-based expression syntax to create time-series visualizations. For more information, see [Timeline]({{site.url}}{{site.baseurl}}/dashboards/visualize/timeline/).

![Example Timeline in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/timeline-1.png){: width="600" }

### VisBuilder

VisBuilder is a drag-and-drop tool that provides an immediate view of your data without the need to preselect the data source or visualization type. It supports Area, Bar, Line, Metric, and Data Table types. For more information, see [VisBuilder]({{site.url}}{{site.baseurl}}/dashboards/visualize/visbuilder/).

![Example VisBuilder in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/vis-builder-2.png){: width="600" }

### Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are declarative visualization grammars for creating custom visualizations using any chart type. For more information, see [Vega]({{site.url}}{{site.baseurl}}/dashboards/visualize/vega/).

![Example Vega visualization in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/vega-1.png){: width="600" }
