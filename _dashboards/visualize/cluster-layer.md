---
layout: default
title: Maps cluster layer
nav_order: 50
grand_parent: Building data visualizations
parent: Using coordinate and region maps 
has_children: false
---

# Maps cluster layer
Introduced 2.11
{: .label .label-purple }

The cluster layer aggregates all points and shapes from an index using [geotile grid aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/geotile-grid/) or [geohex grid aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/geohex-grid/). Once your data points have been grouped into grids, you can calculate metrics for each gridded cell. By grouping data points into grids, you can improve the readability of maps with large datasets. 

You can use the maps cluster layer to: 

- Visualize the distribution of your data.
- Track the movement of goods.
- Identify areas with high concentrations of a particular feature, such as crime, air pollution, or traffic congestion.

Before getting started with using the maps cluster layer, make sure you have the following prerequisites in place:

- <What are the prerequistes?>
- <Do we need to reference the Maps Stats API?>
- Understand [Maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/) basics, including creating a new map.

To enable the cluster layer:

1. Select **Maps** > **Add layer**.
2. Choose **<insert-feature-name>** from the **Add layer** pop-up window.
3. 