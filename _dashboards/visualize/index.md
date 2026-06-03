---
layout: default
title: Building data visualizations
nav_order: 40
has_children: true
has_toc: false
---

# Building data visualizations

OpenSearch Dashboards provides two tools for creating data visualizations: the **Visualize** application and the **Visualization editor**. Both produce charts that you can save and add to dashboards.

## Choosing a visualization tool

The following table compares the two visualization tools. *Italicized* chart types are unique to that tool.

| | Visualize application | Visualization editor |
| :--- | :--- | :--- |
| **Access** | **Visualize** in the left navigation menu | **Explore** > **Visualization editor** |
| **Data selection** | Point-and-click aggregation builder | Piped Processing Language (PPL) queries |
| **Chart types** | - Area<br>- Bar<br>- *Coordinate map*<br>- *Data table*<br>- Gauge<br>- Heatmap<br>- Line<br>- *Metric*<br>- Pie<br>- *Region map*<br>- *Tag cloud*<br>- *Timeline*<br>- *TSVB*<br>- *Vega*<br>- *VisBuilder* | - Area<br>- Bar<br>- *Bar gauge*<br>- Gauge<br>- Heatmap<br>- Line<br>- Pie<br>- *Scatter*<br>- *State timeline* |
| **Prerequisites** | None (available by default) | Requires `workspace.enabled: true` and `explore.enabled: true` in `opensearch_dashboards.yml` |
| **Best for** | Aggregation-based analysis without writing queries | Query-driven exploration where you need precise control over data shaping |
| **Documentation** | [Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/) | [Visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/) |

## Visualize application

The Visualize application uses a point-and-click interface to build visualizations from aggregations. Select a chart type, choose an index pattern, configure metrics and buckets, and render the result.

For more information, see [Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).

## Visualization editor

The visualization editor lets you write PPL queries and map query results directly to chart fields. The editor automatically suggests a chart type based on the shape of your query results and maps fields to axes.

For more information, see [Visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).

