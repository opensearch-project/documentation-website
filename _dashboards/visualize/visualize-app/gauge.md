---
layout: default
title: Gauge visualizations
parent: Visualization types
grand_parent: Creating visualizations in the Visualize application
great_grand_parent: Building data visualizations
nav_order: 70
redirect_from:
  - /dashboards/visualize/gauge/
---

# Gauge visualizations

A gauge visualization displays a data field in a simulated analog instrument like a speedometer. The gauge value can be instantly compared with marked ranges or thresholds. The visualization can show a single value or multiple bucketed values.

## When to use gauge visualizations

Use gauge visualizations to monitor a key indicator against an acceptable range in a dashboard.

## Creating a gauge visualization

The examples on this page use the **Sample flight data** dataset. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/#prerequisites).
{: .note}

To create a gauge visualization, follow these steps:

1. In the **New Visualization** dialog, select **Gauge**, then select your index pattern (for example, **opensearch_dashboards_sample_data_flights**).

   The visualization displays a gauge showing a count of the documents in the index pattern. For the `opensearch_dashboards_sample_data_flights` data, this is `13059` if the date range contains all the documents.
   {: .note}

2. Under **Metrics**, expand **Metric count**.
3. Set **Aggregation** to **Median** and **Field** to **FlightTimeMin**.
4. Select **Update**.

   The gauge displays `502.775`, presented as the full range of gauge.

   If your visualization displays a different value, make sure that your [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) window is large enough to encompass all the sample flight data.
   {: .note}

5. Now that you have some idea of the magnitude of the data, change the display range so that the displayed value falls within it.

   1. Select the **Options** tab.
   2. In the **Ranges** panel, edit the three default ranges as follows:

      | From | To |
      | :--- | :--- |
      | 0 | 250 |
      | 250 | 500 |
      | 500 | 750 |

   3. Select **Update**.

6. To compare two different conditions in one visualization, bucket the data.

   1. Under **Buckets**, select **Add** > **Split group**.
   2. Set **Aggregation** to **Terms** and **Field** to **FlightDelay**.
   3. Select **Update**.

   The visualization displays two gauges, with median flight times for delayed and non-delayed flights, as shown in the following image.

   ![Gauge showing median flight time split by delay status]({{site.url}}{{site.baseurl}}/images/dashboards/example-gauge-flight-time.png)

## Configuring a gauge visualization

For information about general visualization configuration, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

### Options tab

| Setting | Description |
| :--- | :--- |
| **Ranges** | Defines the color-coded segments of the gauge arc. Each range has a start and end value. |
| **Percentage mode** | When enabled, displays the value as a percentage of the maximum range value. |
| **Show scale** | When enabled, displays tick marks on the gauge. |
| **Color options** | Controls the colors assigned to each range segment. |

## Next steps

- To choose a different visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
