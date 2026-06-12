---
layout: default
title: Visualization terminology
parent: Creating visualizations in the Visualize application
nav_order: 220
has_children: false
has_toc: false
---

# Visualization terminology

A _data visualization_ or _visualization_ is a single panel in the OpenSearch UI containing a graph, chart, or other visual representation of data. OpenSearch Dashboards provides visualization tools that help you build visualizations to explore data patterns, monitor system performance, and create dashboards that drive informed decision-making.

_Visualize_ is the OpenSearch Dashboards application for creating visualizations. When displayed in bold, **Visualize** refers to the UI application, as displayed in [Navigating the Visualize UI]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#navigating-the-visualize-ui).

>This documentation uses the following additional terms:
>- An _index pattern_ is a view into one or more indexes in OpenSearch. See the following topic, [Understanding index patterns in OpenSearch](#understanding-index-patterns-in-opensearch). When discussing visualizations, the terms _data set_ or _data source_ refer to the data exposed by a single index pattern.
>- A _field_ is a typed metric contained in a data set, the equivalent of a table column in a relational database. The terms _field_, _data field_, _variable_, and _metric_ are used interchangeably.
>- A _bucket_ is a grouping of field values based on the aggregation of a data field. The aggregation can be of any type of data. For example:
>    - Categorical buckets based on text values
>    - User-defined range values based on a numerical variable
>    - Automatically sized histograms based on a numerical variable
>    - Time segments based on a timestamp variable
{: .note}

## Next steps

- To build visualizations, see [Creating visualizations in the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).
- To assemble visualizations into a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
