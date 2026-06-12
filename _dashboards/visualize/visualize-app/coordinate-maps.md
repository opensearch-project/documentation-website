---
layout: default
title: Coordinate maps
parent: Creating visualizations in the Visualize application
nav_order: 55
redirect_from:
  - /dashboards/visualize/coordinate-maps/
---

# Coordinate maps

A coordinate map plots geographic data points on a map using latitude and longitude coordinates. Each marker represents a document with a geo_point field, and marker size indicates the aggregated value at that location.

## When to use coordinate maps

Use coordinate maps to reveal distribution patterns and spatial correlations over locations, such as customer locations, service coverage areas, incident distributions, or events with geographic coordinates. You can select geographic regions to filter other visualizations on the same dashboard. For multi-layer geographic visualizations, use the [Maps application]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/).

## Creating a coordinate map

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a coordinate map, follow these steps:

1. In the **New Visualization** dialog, select **Coordinate Map**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).
2. Set the time filter to **Last 7 days**.
3. Under **Buckets**, select **Add** > **Geo coordinates**.
4. Set **Aggregation** to **Geohash** and **Field** to **OriginLocation**.
5. Select **Update**.

The map displays markers at flight origin locations, with marker size proportional to the document count at each location, as shown in the following image.

![Coordinate map showing flight origins]({{site.url}}{{site.baseurl}}/images/dashboards/coordinate-map-example.png)

### Customizing the map display

1. Select the **Options** tab.
2. Under **Map type**, select a marker style: **Scaled Circle Markers**, **Shaded Circle Markers**, **Shaded Geohash Grid**, or **Heatmap**.
3. Adjust **Precision** to control the geohash bucket size (higher precision = smaller, more numerous buckets).
4. Select **Update**.

## Configuring a coordinate map

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

### Options tab

| Setting | Description |
| :--- | :--- |
| **Map type** | The marker style. Supported values: **Scaled Circle Markers** (sized by value), **Shaded Circle Markers** (colored by value), **Shaded Geohash Grid** (rectangular cells colored by value), **Heatmap** (continuous color gradient). |
| **Precision** | Controls the geohash grid resolution. Higher values produce smaller, more numerous buckets. |
| **Show tooltips** | When enabled, displays aggregation values on hover. |
| **WMS compliant map server** | When enabled, uses a WMS server for the basemap. For more information, see [Configuring a Web Map Service]({{site.url}}{{site.baseurl}}/dashboards/visualize/maptiles/). |

## Related documentation

- [Configuring maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-maps/)

## Next steps

- To choose a different visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
