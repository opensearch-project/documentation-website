---
layout: default
title: Visualization reference
parent: Building data visualizations
nav_order: 100
has_children: false
has_toc: false
---

<!-- markdownlint-disable MD033 -->

# OpenSearch Visualizations

A _data visualization_ or _visualization_ is a single panel in the OpenSearch UI containing a graph, chart, or other visual representation of data. OpenSearch Dashboards provides visualization tools that help you build visualizations to explore data patterns, monitor system performance, and create dashboards that drive informed decision-making.

_Visualize_ is the OpenSearch Dashboards application for creating vizualizations. When displayed in bold, **Visualize** refers to the UI application, as dislayed in [Navigating the Visualize UI]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/#navigating-the-visualize-ui).

>This documentation uses the following additional terms:
>- An _index pattern_ is a view into one or more indexes in OpenSearch. See the following topic, [Understanding index patterns in OpenSearch](#understanding-index-patterns-in-opensearch). When discussing visualizations, the terms _data set_ or _data source_ refer to the data exposed by a single index pattern.
>- A _field_ is a typed metric contained in a data set, the equivalent of a table column in a relational database. The terms _field_, _data field_, _variable_, and _metric_ are used interchangeably.
>- A _bucket_ is a grouping of field values based on the aggregation of a data field. The aggregtion can be of any type of data. For example:
>    - Categorical buckets based on text values
>    - User-defined range values based on a numerical variable
>    - Automatically sized histograms based on a numerical variable
>    - Time segments based on a timestamp variable
{: .note}


## Understanding index patterns in OpenSearch

Before exploring visualization types, you first must understand OpenSearch _index patterns_.

An **index pattern** is a configuration object that defines which OpenSearch indexes, data streams, and index aliases contain the data you want to analyze and visualize.

Index patterns serve several functions, as follows:

- **Define data sources**: Define which indexes to query when you create visualizations.
- **Map field types**: Specify data types for the fields in your data, such as text, numbers, dates, or geo-coordinates.
- **Configure time fields**: For time-series data, specify which field contains timestamp information.
- **Apply field formatting**: Optionally, include formatting rules for how data appears in visualizations.

For example, an index pattern can consolidate separate log files. If you keep monthly log data stored in indexes named `logs-2024-01` and `logs-2024-02`, you can create an index pattern `logs-*` that matches all these indexes and enables you to visualize data across all months.

To learn how to create index patterns, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

## Understanding the visualization framework

The Visualize application presents a collection of visualization tools in a selection dialog as shown in [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/#creating-a-new-visualization). It's useful to organize these tools into types based on their primary purpose and the type of data they represent, as follows:

- **[Text data](#text-data-visualizations)**: Present data in text format rather than graphically.
- **[One-dimensional](#one-dimensional-data-visualizations)**: Present one bucketed variable.
- **[Multi-dimensional](#multi-dimensional-data-visualizations)**: Compare values of a variable across categories or values of other variables. 
- **[Geographic (maps)](#geographic-data-visualizations)**: Display values on a map at any scale.
- **[Utility (non-data)](#utility-visualizations)**: Support dashboard functionality.
- **[Specialized tools](#specialized-analytical-tools)**: Use alternative UI tools to create non-standard visualizations. 


## Text data visualizations

Text data visualizations emphasize presentation of precise values and typically provide less information density than graphical representations. Use these visualizations to examine raw data, verify information accuracy, and provide detailed context for other dashboard elements.

### Data tables

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data-table-1.png" width="40%"  alt="Data table"/>

Data tables present raw data in row-column format.

#### When to use data tables

Data tables don't provide visual abstraction, but do reveal data completeness, field relationships, and data quality issues.

Use data tables to examine individual documents, verify data quality, or investigate details behind aggregate visualizations. You can sort, filter, and examine correlations between fields that might not be apparent in more abstract visualizations.

#### Data tables on dashboards

In dashboards, data tables show granular details that other visualizations summarize. Use them as drill-down targets, allowing users to move from high-level visual summaries to specific record-level details, to emphasize one or a small number of key values, and to provide access to unprocessed information.

### Metric visualizations

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/metric-chart-1.png" width="40%"  alt="Metric chart"/>

Metric visualizations distill a single field into one (overall) or a few (bucketed) numerical values.

#### When to use metric visualizations

Use metric visualizations to communicate key business or operational metrics at a glance, especially real-time or frequently updated values that require constant monitoring, such as system health, business performance, or operational status.

#### Metric visualizations on dashboards

Place metric visualizations in prominent dashboard positions to display key or summary values.

### Tag clouds

<img src="{{site.url}}{{site.baseurl}}/images/word-cloud-1.png" width="40%"  alt="Tag cloud"/>

Tag clouds (also called word clouds) visualize text frequency or other attributes of categorical variables by transforming numerical data into visual weight.

#### When to use tag clouds

Tag clouds reveal themes, popular categories, or dominant terms within large text datasets. They provide a quick, intuitive view of terms' prevalence.

Use tag clouds to reveal content clustering, cyclic trends in terminology, or shifts in user behavior patterns. They're valuable in content analysis, customer feedback analysis, and market research example applications.

#### Tag clouds on dashboards

In dashboards, tag clouds provide context for other metrics. For example, a customer support dashboard might use tag clouds to show the most common issue categories, providing immediate context for ticket volume metrics and resolution time charts.


## One-dimensional data visualizations

One-dimensional visualizations display single variables or metrics, showing distributions, proportions, or comparisons within a single data dimension. Use these visualizations to answer questions about quantities, proportions, or performance levels without the complexity of multiple variables.

### Pie charts

<img src="{{site.url}}{{site.baseurl}}/images/pie-1.png" width="40%"  alt="Pie chart"/>

Pie charts display parts-to-whole relationships, showing the contribution of individual categories to a total.

#### When to use pie charts

Use pie charts to show relative proportions within categorical data. Use them where understanding relative component sizes is more important than precise numerical values. For example, use a pie chart to show market share, budget allocation, and demographic distributions.

#### Pie charts on dashboards

In dashboards, pie charts provide quick proportion assessments and serve as navigation aids. Users can select pie segments to filter other visualizations, creating interactive exploration workflows that move from proportions to precise values.

### Gauge visualizations

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/gauge-1.png" width="40%"  alt="Gauge chart"/>

Gauge charts mimic familiar analog instruments to present single metrics against acceptable ranges, targets, or thresholds.

#### When to use gauge visualizations

Use gauges to display status, showing whether a metric is within normal, warning, or critical ranges in monitoring scenarios where position relative to a threshold is more important than the precise value.

#### Gauges on dashboards

Gauges serve as status indicators in operational dashboards. They provide at-a-glance health checks for key systems or processes in executive dashboards.


## Multi-dimensional data visualizations

Multi-dimensional visualizations display multiple variables of any type. Use these visualizations to reveal patterns, relationships, and correlations that wouldn't be apparent when examining individual data dimensions separately.


### Bar charts (vertical and horizontal)

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/bar-chart-1.png" width="40%"  alt="Aggregation-based area chart"/> <img src="{{site.url}}{{site.baseurl}}/images/dashboards/bar-horizontal-1.png" width="40%"  alt="Aggregation-based area chart"/>

Bar charts compare values across categories, ranges, or time ranges by representing values as proportional bar lengths.

#### When to use bar charts

Use bar charts to reveal variation over an independent variable, comparative performance over categories, and trends over time. Use vertical bars for time series data and horizontal bars when category names are long or when comparing many categories. Bar charts can show performance gaps, trends, outliers, seasonal patterns, and comparative advantages across categories.

#### Bar charts on dashboards

Bar charts are a primary analytical tool in dashboards, often supporting drill-down interactions where users can select bars to filter other visualizations. They are often the central analytical component around which other visualizations provide context.


### Line charts

<img src="{{site.url}}{{site.baseurl}}/images/line-1.png" width="40%"  alt="Line graph"/>

Line charts track changes in continuous variables, showing trends, patterns, and relationships over time series and ordered independent variables.

#### When to use line charts

Use line charts to reveal trends, cyclical behaviors, rate-of-change information, and inflection points across time or any continuous numerical quantity. Use them to show correlation between multiple metrics when you display them as multiple lines.

#### Line charts on dashboards

Line charts are the core of time-based dashboards, with other visualizations providing categorical or geographical breakdowns of the trends. They are a mainstay when displaying trends across time or any other independent variable.


### Area charts

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/area-chart-1.png" width="40%"  alt="Aggregation-based area chart"/>

Area charts combine the trend-revealing capabilities of line charts with visual emphasis on volume or accumulation, making them particularly effective for showing how individual components contribute to totals over time. Chart areas can be stacked to show relative contribution or superimposed to compare absolute values.

#### When to use area charts

Use area charts to show both trend patterns and proportional relationships simultaneously. They reveal contribution patterns, showing which components drive overall totals and when those patterns change. 

Use stacked area charts where you need to understand both total volumes and individual component contributions, and to see how composition changes over time, for example in financial and operational dashboards where understanding both totals and composition is key.


#### Area charts on dashboards

Area charts can serve as primary trend indicators while supporting drill-down into component details.


### Heat maps

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/heat-map-1.png" width="40%"  alt="Heat map"/>

Heat maps visualize data density, correlation matrices, or performance patterns across two categorical or bucketed numerical dimensions using color intensity to represent values.

#### When to use heat maps

Use heat maps to reveal clusters, correlation strengths, and anomalies within multi-dimensional datasets. They make patterns visible that would be difficult to see in tabular format or in multiple two-dimensional plots.

#### Heat maps on dashboards

Heat maps enable pattern recognition in dashboards, often serving as exploration starting points where users find interesting patterns before investigating details.


## Geographic data visualizations

Geographic visualizations transform location-based data into spatial representations, showing patterns and relationships in geographic space.

### Coordinate maps

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/coordinate-1.png" width="40%"  alt="Coordinate map"/>

Coordinate maps display location-specific data using geographic coordinates (latitude and longitude), creating maps with markers or overlays.

#### When to use coordinate maps

Use coordinate maps with point-based geographic data to reveal distribution patterns and spatial correlations over locations. Use them to show customer locations, service coverage areas, incident distributions, or events with geographic locations.

#### Coordinate maps on dashboards

Coordinate maps provide spatial context in dashboards, enabling users to select geographic regions to filter other visualizations. Use them in operational dashboards for field service, delivery, security, and so on.

### Region maps

<img src="{{site.url}}{{site.baseurl}}/images/map-1.png" width="40%"  alt="Region map"/>

Region maps show data aggregated by geographic regions (for example, countries, states, or counties) using color intensity or pattern variations to represent values across predefined geographic boundaries.

#### When to use region maps

Use region maps to compare data values across regions, for example how metrics vary across administrative or natural geographic boundaries.

#### Region maps on dashboards

Region maps enable analysis over common and user-defined regions in dashboards, often supporting drill-down to more fine-grained geographic areas or point locations.


## Utility visualizations

Utility visualizations don't display data directly but instead provide infrastructure and support capabilities that enhance the functionality of other visualizations and improve overall dashboard usability.

### Markdown visualizations

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/markdown.png" width="40%"  alt="Markdown visualization"/>

Markdown visualizations provide formatted text within dashboards, displaying instruction and exposition rather than data.

#### When to use Markdown visualizations

Use Markdown visualizations to provide context, instructions, definitions, and explanatory information.

#### Markdown on dashboards

Markdown visualizations provide titles, instructions, and explanations in dashboards.

### Controls

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/controls-1.png" width="40%"  alt="Aggregation-based area chart"/>

Controls enable you to dynamically modify the data displayed in dashboard visualizations by providing the ability to interactively filter data and adjust parameters.

Many visualization types are interactive in dashboards. For example, selecting a column in a bar chart filters the data to that value. Controls are explicit implementations of this functionality.
{: .tip}

#### When to use controls

Use controls to enable users to explore different data subsets, time ranges, or parameter values without requiring dashboard modification or explicit data filtering. Controls can isolate conditions, compare different time periods, or focus on data subsets to show how relationships change under different conditions.

#### Controls on dashboards

Controls enable interactive dashboards, making data exploration more flexible.


## Specialized analytical tools

OpenSearch Dashboards includes several specialized tools that provide capabilities for specific analytical scenarios or advanced use cases.

### TSVB

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/TSVB-1.png" width="40%"  alt="TSVB timeline"/>

 Time-series visual builder (TSVB) provides advanced time-series visualization with analytical functions, support for multiple data sources, and customizations designed for complex temporal analysis.

#### When to use TSVB

TSVB reveals complex time-based relationships, trends, and analytical insights. Use TSVB for time-series analysis that goes beyond basic chart capabilities, including advanced mathematical functions, multiple metric comparisons, and sophisticated temporal analysis.

#### TSVB on dashboards

TSVB is an advanced analytical engine for users who need more sophisticated time-series analysis than standard visualizations provide.

### VisBuilder

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vis-builder-2.png" width="40%"  alt="VisBuilder interface"/>

VisBuilder provides drag-and-drop visualization creation. Building visualizations in VisBuilder requires no knowledge of query languages or visualization configuration.

#### When to use VisBuilder

VisBuilder enables rapid exploration of data relationships through intuitive drag-and-drop interfaces, reducing the time required to test hypotheses and explore data patterns. Use VisBuilder to reduce the barrier to entry for data exploration and analysis.

#### VisBuilder on dashboards

VisBuilder integrates user-built visualizations into dashboards for users with limited technical expertise.


### Vega visualizations

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vega-1.png" width="40%"  alt="Vega interface"/>

Vega provides unlimited customization for users who need visualization types or analytical capabilities not available in standard OpenSearch visualization types.

#### When to use Vega

Vega visualizations can reveal any data relationship or pattern that can be expressed programmatically. Use Vega when you need visualizations that support advanced statistical analysis, custom interactive behaviors, and specialized analytical techniques.

#### Vega on dashboards

Vega extends visualization with advanced and specialized analytical capabilities.

### PPL visualizations

Pipeline (PPL) visualizations provide real-time data processing and visualization using Piped Processing Language (PPL) for streaming data analysis and monitoring.

#### When to use PPL

PPL reveals real-time data relationships and patterns. Use PPL with Observability and for real-time data analysis.

#### PPL on dashboards

PPL visualizations provide the basis for Observability visualizations. See [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/) and [Using Discover for observability]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/index/).


### Timeline visualizations

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/timeline-1.png" width="40%"  alt="Timeline"/>

Timeline visualizations focus on time-based analysis, providing time-series analysis beyond basic line charts.

#### When to use timeline visualizations

Timeline visualizations reveal event clustering and time-based correlation that you might miss with standard chart types. Use timeline visualizations for exclusively time-based data analysis, particularly for revealing temporal patterns and event sequences.


#### Timelines on dashboards

Timeline visualizations serve as temporal analytic engines in dashboards.


## Next steps

- Build some visualizations. See [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/) for tutorials.

- Once you have some visualizations of your data, assemble them into a dashboard. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
