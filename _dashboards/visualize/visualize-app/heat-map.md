---
layout: default
title: Heat maps
parent: Creating visualizations in the Visualize application
grand_parent: Building data visualizations
nav_order: 90
redirect_from:
  - /dashboards/visualize/heat-map/
---

# Heat maps

A heat map displays values represented as a color or saturation gradient on a two-dimensional grid, effectively rendering a three-dimensional data display. The X and Y dimensions can be the same, as in a spatial heat map, or different---for example, months against years in a record of average temperature at a location (thus separating the cyclic and trend data for the site).

## When to use heat maps

Use heat maps to reveal clusters, correlation strengths, and anomalies within multidimensional datasets. They make patterns visible that would be difficult to see in tabular format or in multiple two-dimensional plots.

## Creating a heat map

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a heat map, follow these steps:

1. In the **New Visualization** dialog, select **Heat Map**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).
2. Under **Metrics**, expand **Value Count** and set **Aggregation** to **Count**.
3. Under **Buckets**, select **Add** > **X-axis**.
4. Set **Aggregation** to **Terms**, **Field** to **OriginWeather**, and **Size** to `8`.
5. Select **Update**.
6. Under **Buckets**, select **Add** > **Y-axis**.
7. Set **Sub aggregation** to **Terms**, **Field** to **DestWeather**, and **Size** to `8`.
8. Select **Update**.

### Customizing the display

1. Select the **Options** tab.
2. In **Heatmap settings**, set **Color schema** to **Greys** and **Number of colors** to `8`.
3. In **Labels**, enable **Show labels**.
4. Select **Update**.

   The heat map shows average flight delay mapped to origin and destination weather combinations, as shown in the following image.

   ![Heat map showing flight delay by weather conditions]({{site.url}}{{site.baseurl}}/images/dashboards/example-heatmap-flight-delay.png)

   Note the following:
   - The heat map data is organized into four quadrants, corresponding to the four combinations of "good" (Cloudy, Rain, Clear, Sunny) and "bad" (Hail, Heavy Fog, Damaging Wind, Thunder & Lightning) weather conditions at the destination and origin.
   - The longest delays occurred when the weather was good at both the origin and destination. The shortest delays occurred when the weather was bad at both locations.

### Filtering with split chart

You can filter the data using the [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/), but if the visualization is in a dashboard this filters the data for other visualizations as well. The following procedure limits the data only for this visualization.
{: .note}

To limit the heat map to specific conditions (for example, only cancelled flights):

1. Under **Buckets**, select **Add** > **Split chart** > **Rows**.
2. Set **Sub aggregation** to **Filters**.
3. In the **Filter 1** box, enter `Cancelled: true`.

   The filter terms are case-sensitive.
   {: .tip}

4. Select **Update**.

   The heat map now shows only cancelled flights. It shows that no cancellations occurred when the weather was good at both ends of the flight, as shown in the following image.

   ![Heat map showing cancelled flights by weather conditions]({{site.url}}{{site.baseurl}}/images/dashboards/example-heatmap-cancellation.png)

## Configuring a heat map

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

### Options tab

| Setting | Description |
| :--- | :--- |
| **Color schema** | The color palette for the heat map (for example, **Greens**, **Blues**, **Greys**, **Yellow to Orange**). |
| **Reverse schema** | Inverts the color mapping. |
| **Number of colors** | The number of discrete color bins. |
| **Show labels** | Displays values inside each cell. |
| **Percentage mode** | Normalizes values between 0 and 1. |

## Next steps

- To choose a different visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
