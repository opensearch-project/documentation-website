---
layout: default
title: Clustered geospatial data
nav_order: 50
grand_parent: Building data visualizations
parent: Using coordinate and region maps 
has_children: false
---

# Clustered geospatial data
Introduced 2.11
{: .label .label-purple }

Clusters group geospatial data into grids using [geotile grid aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/geotile-grid/) or [geohex grid aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/geohex-grid/). Once your data points have been grouped into grids, you can calculate metrics for each gridded cell. By grouping data points into grids, you can improve the readability of maps with large datasets, such as crime stats, population density, and traffic congestion, and identify patterns and trends more easily.

Before you can visualize geospatial data using the clusters map layer, make sure you have:

- <What are the prerequistes?>
- <Do we need to reference the Maps Stats API?>
- Understand the basics of using the [Maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/) data visualization in OpenSearch Dashboards.

To enable a clusters layer:

1. Select **Maps** > **Add layer**.
2. Choose **Clusters** or **Hear map** from the pop-up window.

To enable a blended layer that dynamically shoes clusters or documents:

1. Select **Add layer** and select **Documents**.
2. Configure the layer properties. 
3. Under **Scaling**, select **Show clusters when results exceed 10000**.

The following image shows a map with a clusters layer.

<insert-image>