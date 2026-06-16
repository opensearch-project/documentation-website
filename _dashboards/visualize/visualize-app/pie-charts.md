---
layout: default
title: Pie charts
parent: Creating visualizations in the Visualize application
nav_order: 130
redirect_from:
  - /dashboards/visualize/pie-charts/
---

# Pie charts

A pie chart displays what percent of each condition makes up the entire count of a data field. The visualization can show a single value or multiple bucketed values.

## When to use pie charts

Use pie charts to compare the relative share of each condition making up a metric. You can select pie segments to filter other visualizations on the same dashboard.

## Creating a pie chart

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a pie chart, follow these steps:

1. In the **New Visualization** dialog, select **Pie**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).

   The visualization displays an annular (ring) style pie chart showing only one value. The tooltip reveals the value, a count of the documents in the index pattern. For the `opensearch_dashboards_sample_data_flights` data, this is `13059` if the date range contains all the documents.
   {: .note}

   If your visualization displays a different value, make sure that your [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) window is large enough to encompass all the sample flight data.
   {: .note}

2. Under **Metrics**, expand **Slice size count**.
3. Set **Aggregation** to **Unique Count** and **Field** to **FlightNum**.

   For a pie chart, bucketed values of the metric must add to 100%. Only those aggregations with this property are displayed.

4. Select **Update**.

   The pie chart displays `12,932`, presented as a single-value annular pie chart.

5. To visualize the composition of the field by different conditions, bucket the data:

   1. Under **Buckets**, select **Add** > **Split slices**.
   2. Set **Aggregation** to **Terms**, **Field** to **OriginCountry**, and **Size** to `5`.
   3. Select **Group other values in separate bucket** so that the total number of unique flights is accurately represented.
   4. Select **Update**.

   The visualization shows that Italy and the U.S. originate the most flights. The top five countries account for almost half of unique flight numbers.

6. (Optional) Display the visualization as a traditional rather than annular pie chart:

   1. Select the **Options** tab.
   2. In the Pie settings panel, deselect **Donut**.
   3. Select **Update**.

   The visualization shows a wedge pie chart of the top five countries with all others grouped, as shown in the following image.

   ![Pie chart showing unique flights by origin country]({{site.url}}{{site.baseurl}}/images/dashboards/example-pie-unique-flights.png)

## Configuring a pie chart

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

### Options tab

| Setting | Description |
| :--- | :--- |
| **Donut** | When enabled, renders the chart as a ring (donut) rather than a filled circle. |
| **Show labels** | Displays category labels on each slice. |
| **Show top level only** | When nested buckets exist, shows only the outermost ring. |

## Next steps

- To choose a different visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
