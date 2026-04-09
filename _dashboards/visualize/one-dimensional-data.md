---
layout: default
title: Building one-dimensional visualizations
parent: Building data visualizations
nav_order: 30
has_children: false
has_toc: false
---

# Building one-dimensional visualizations

One-dimensional visualizations display one bucketed data field. One-dimensional visualizations include the following visualizations:

| **Gauge** and **Goal** | **Pie chart** |
| [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-gauge-icon.png" width="90" height="90" alt=" icon">](#building-a-gauge-visualization) [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-goal-icon.png" width="90" height="90" alt=" icon">](#building-a-gauge-visualization) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-pie-icon.png" width="90" height="90" alt=" icon">](#building-a-pie-chart) |
| Display a speedometer-like gauge. | Display a pie chart. |

Instructions for each follow.


## Building a gauge visualization

The  Gauge visualization displays a data field in a simulated analog instrument like a speedometer. The gauge value can be instantly compared with marked ranges or thresholds.

The visualization can show a single value or multiple bucketed values.

Use the gauge visualization to monitor a key indicator against an acceptable range in a dashboard.

To create a gauge visualization:

1. Open a new visualization of type gauge. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Gauge/Choose a source** dialog.

   The visualization pane displays a gauge displaying a count of the documents in the index pattern. For the `opensearch_dashboards_sample_data_flights` data, this is `13059` if the date range contains all the documents.
   {: .note}

1. Select the **Data** tab.

1. In the **Metrics** box in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Metric count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Median`.

1. In the **Field** box, select the field you want to display.

   For this tutorial, select `FlightTimeMin`.

1. Select **Update** in the lower right of the visualization tool to view the gauge in the display panel.

   The gauge displays a value `502.775`, presented as the full range of gauge.

   If your visualization displays a different value, make sure that your [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) window is large enough to encompass all the sample flight data.
   {: .note}

1. Now that you have some idea of the range of the data, change the ranges so that the displayed value.

   1. Select the **Options** tab.

   1. In the **Ranges** panel, edit the three default ranges as shown in the following table:

      ≥    0 | < 250
      ≥ 250 | < 500
      ≥ 500 | < 750

   1. Select **Update**.

1. To compare two different conditions in one visualization, bucket the data.

   1. In the **Buckets** pane, select **Add**.

   1. In the **Add bucket** drop-down, select **Split group**.

   1. In the **Aggregation** drop-down, select an aggregation type for the rows.

      For this example, select **Terms**.

   1. In the Field drop-down, select a field for the row buckets. For this example, select the boolean value **FlightDelay**.

   1. Select **Update**.

   The visualization displays two gauges, with median flight times for delayed and undelayed flights, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-gauge-flight-time.png" alt="Visualize application" width="60%">


1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).

## Building a goal visualization

The  Goal visualization displays a value in a speedometer-like gauge. The shows a the value as a proportion of a predefined goal. The visualization also displays the metric, either as an absolute value or as a percentage of the goal.

The visualization can show a single value or multiple bucketed values. If bucketed, the goal is the same for all buckets.

Use the goal visualization to monitor a key indicator against a goal value.

To create a goal visualization:

1. Open a new visualization of type goal. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Goal/Choose a source** dialog.

   The visualization pane displays a gauge showing the document count as a percentage of a default goal of `10,000`. For the `opensearch_dashboards_sample_data_flights` data, this is `130.59%` if the date range contains all the documents.
   {: .note}

1. Select the **Data** tab.

1. In the **Metrics** box in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Metric count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Sum`.

1. In the **Field** box, select the field you want to display.

   For this tutorial, select `DistanceKilometers`.

1. To see how close the dataset is to recording a total of a hundred million kilometers, set 100,000,000 as the goal.

   1. Select the **Options** tab.

   1. In the **Ranges** boxes, enter `1e8` as the top of the range.

      Numerical entries cannot take group separators. It's easier to use exponential notation for large numbers.
      {: .note}

   1. De-select **Percentage mode**.

   1. Select **Update**.

   The visualization displays `92,616,288.34`, the sum of all flight distances in kilometers. This value shows as about 93% of the gauge maximum, which is calibrated to the goal, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-goal-total-km.png" alt="Visualize application" width="60%">


   1. (Optional) Combine Gauge and Goal displays by adding a scale as described in [Building a guage visualization](#building-a-gauge-visualization).

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Building a pie chart

The  pie chart visualization displays what percent of each condition make up the entire count of a data field.

The visualization can show a single value or multiple bucketed values.

Use the pie chart visualization to compare the relative share of each condition making up a metric.

To create a pie chart visualization:

1. Open a new visualization of type Pie chart. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, choose `opensearch_dashboards_sample_data_flights` in the **New Pie/Choose a source** dialog.

   The visualization pane displays an annular (ring) style pie chart showing only one value. The tooltip reveals the value, a count of the documents in the index pattern. For the `opensearch_dashboards_sample_data_flights` data, this is `13059` if the date range contains all the documents.
   {: .note}

   If your visualization displays a different value, make sure that your [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) window is large enough to encompass all the sample flight data.
   {: .note}


1. In the **Metrics** box in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Slice size count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For a pie chart, bucketed values of the metric must add to 100%. Only those aggregations with this property are displayed.

   For this tutorial, select `Unique Count`.

1. In the **Field** box, select the field you want to display.

   For this tutorial, select `FlightNum`.

1. Select **Update** in the lower right of the visualization tool to view the pie chart in the display panel.

   The gauge displays a value `12,932`, presented again as a single-value annular pie chart.

1. To visualize the composition of the field by different conditions, bucket the data.

   1. In the **Buckets** pane, select **Add**.

   1. In the **Add bucket** drop-down, select **Split slices**.

   1. In the **Aggregation** drop-down, select an aggregation type for the rows.

      For this example, select **Terms**.

   1. In the Field drop-down, select a field for the row buckets. For this example, select the string value **OriginCountry**.

   1. In the size drop-down, leave the default value of `5` to see the top 5 countries with the most flights.

   1. Select **Group other values in separate bucket** so that the total number of unique flights is accurately represented.

   1. Select **Update**.

   The visualization shows that Italy and the U.S. originate the most flights. The top five countries account for almost half of unique flight numbers.

1. (Optional) Display the visualization as a traditional rather than annular pie chart.

   1. Select the **Options** tab.

   1. In the Pie settings panel, un-select **Donut**.

   1. Select **Update**.

   The visualization shows a wedge pie chart of the top five countries plus with all others grouped, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-pie-unique-flights.png" alt="Visualize application" width="60%">


1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).

