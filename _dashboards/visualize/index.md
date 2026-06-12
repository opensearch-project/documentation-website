---
layout: default
title: Building data visualizations
nav_order: 30
has_children: false
has_toc: false
---

# Building data visualizations

By visualizing your data, you can translate complex, high-volume, or numerical data into a visual representation that is easier to process. OpenSearch Dashboards provides data visualization tools to improve and automate the visual communication process. 

OpenSearch Dashboards provides two approaches for creating data visualizations: building visualizations visually and building visualizations using queries. Both produce charts that you can save and add to dashboards.

## Terminology

This documentation uses the following terms:

>This documentation uses the following terms:
>- **Visualize** (bold): the OpenSearch Dashboards application for creating visualizations.
>- A _data visualization_ or _visualization_ is a single pane in the UI containing a graph, chart, or other visual representation of data. The term can also refer to the visual data representation itself.
>- A _dashboard_ is a collection of data visualizations. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
{: .note}

## Choosing a visualization approach

When you select **Create new** in a dashboard (or **Create new visualization** in the **Visualize** app), a dialog presents the available visualization types. The first option, **Add visualization**, opens the query-based visualization editor. All other options (such as **Area**, **Line**, or **Pie**) open the visual point-and-click tool.

The following table compares the two approaches. *Italicized* visualization types are unique to that approach.

| | Creating visualizations in the Visualize application | Creating visualizations using queries |
| :--- | :--- | :--- |
| **Entry point** | In the **Create new** dialog, select a chart type (Area, Line, Pie, and others) | In the **Create new** dialog, select **Add visualization** |
| **Configuration** | Configure metrics and buckets using point-and-click panels. Use DQL in the search bar to filter data. | Write Piped Processing Language (PPL) or Prometheus Query Language (PromQL) queries to define the data. The editor automatically suggests a chart type. |
| **Visualization types** | - Area<br>- Bar<br>- *Coordinate map*<br>- *Data table*<br>- Gauge<br>- Heatmap<br>- Line<br>- *Metric*<br>- Pie<br>- *Region map*<br>- *Tag cloud*<br>- *Timeline*<br>- *TSVB*<br>- *Vega*<br>- *VisBuilder* | - Area<br>- Bar<br>- *Bar gauge*<br>- Gauge<br>- Heatmap<br>- Line<br>- Pie<br>- *Scatter*<br>- *State timeline* |
| **Prerequisites** | None (available by default) | Requires `workspace.enabled: true` and `explore.enabled: true` in `opensearch_dashboards.yml` |
| **Best for** | Aggregation-based analysis without writing queries | Query-driven exploration where you need precise control over data shaping |
| **Application** | [**Visualize** application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/) | [Visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/) |

## Creating visualizations in the Visualize application

The **Visualize** application uses a point-and-click interface to build visualizations from aggregations. Select a chart type, choose an index pattern, configure metrics and buckets, and render the result, as shown in the following image. Use the [DQL]({{site.url}}{{site.baseurl}}/dashboards/dql/) search bar to filter the underlying data.

![Visualize application showing a line chart with point-and-click configuration panels]({{site.url}}{{site.baseurl}}/images/dashboards/visualize-app-example.png)

For more information, see [Creating visualizations in the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).

## Creating visualizations using queries

The visualization editor lets you write PPL or PromQL queries and map query results directly to chart fields. The editor automatically suggests a chart type based on the shape of your query results and maps fields to axes, as shown in the following image. This approach supports [dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/) for interactive filtering.

![Visualization editor showing a multi-line chart built from a PPL query with dashboard variables]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/visualization-editor-example.png)

For more information, see [Creating visualizations using queries]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).

## Related documentation

- [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/)
- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
