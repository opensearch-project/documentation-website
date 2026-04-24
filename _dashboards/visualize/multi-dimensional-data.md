---
layout: default
title: Building multi-dimensional visualizations
parent: Building data visualizations
nav_order: 40
has_children: false
has_toc: false
---

# Building multi-dimensional visualizations

Multi-dimensional visualizations display one or more data fields as a function of another data field. This overlaps with the display of bucketed one-dimensional data, but unlike with one-dimensional graphs, the aggregations that bucket the data are numerical rather than categorical. 

Multi-dimensional visualizations include the following visualizations:

| **Bar** | **Area** | **Heat map** | **Line** |
| [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-vertbar-icon.png" width="90" height="90" alt=" icon"><br/><img src="{{site.url}}{{site.baseurl}}/images/icons/vis-horizbar-icon.png" width="90" height="90" alt=" icon">](#building-a-bar-chart) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-area-icon.png" width="90" height="90" alt=" icon">](#building-an-area-chart) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-heatmap-icon.png" width="90" height="90" alt=" icon">](#building-a-heat-map) |[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-line-icon.png" width="90" height="90" alt=" icon">](#building-a-line-graph) |
| Display a bar graph or histogram. | Display an area graph. | Display a heatmap, a two-dimensional grid with a third dimension represented as color gradations. | Display an X-Y plot, showing a function or relation with points connected by straight or smoothed lines. |

Instructions for each follow.

## Building a bar chart

A vertical bar chart is a classic display that can be a histogram (a bucketed frequency distribution) or a comparison of categorical buckets. The bar heights are instantly comparable visually.

We present the bar chart as a typical example of a multi-dimensional display. Most of the tools used to create a bar chart are the same across any type of multi-dimensional visualization, including horizontal bar charts, line graphs, and area charts.

Use a vertical bar visualization to create a histogram or bar chart.

To create a vertical bar visualization:

1. Open a new visualization of type **Vertical Bar**. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, in the **New Vertical Bar/Choose a source** dialog, choose `opensearch_dashboards_sample_data_flights`.

1. In the visualization tools, select the **Data** tab.

1. In the **Metrics** panel in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Metric Count** to expand the **Metrics** panel.

1. In the **Aggregation** box, choose the aggregation you want to display.

   For this tutorial, select `Average`.

1. In the **Field** box, choose the field you want to display.

   For this tutorial, select `FlightDelayMin`.

1. (Optional) To replace the raw field name in the visualization, enter an alternative name for the data field in the **Custom label** box.

   For this tutorial, enter `Flight delay in minutes`.

1. Select **Update** in the lower right of the visualization tool to view the metric in the display panel.

   The visualization panel displays a single bar with height of about `47`, the average flight delay for every document in the flight database.

   If your visualization displays a different value, make sure that your time filter window is large enough to encompass all the sample flight data.
   {: .note}

1. From the **Add bucket** drop-down, select **X-axis**.

1. In the **Add bucket** drop-down, select **X-axis** to bucket the data by vertical column.

1. In the **Aggregation** drop-down, select an aggregation type for the rows.

   For this example, select `Terms` to compare categorical data.

1. In the Field drop-down, select a field for the row buckets.

   For this example, select the text value `OriginWeather`.

1. For a chart grouped by terms, you must choose the maximum number of terms to display, which sort order to use, and whether to sort ascending or descending on that metric.

   For this tutorial, there are only eight terms in the bucketing metric, so it's reasonable to display all of them. Do the following:

   1. In the **Order by** drop-down, select `Metric: FlightDelayMin`.

   1. In the **Size** box, enter or select the number of terms to display. For this example, choose `8`.

      Any number eight or higher displays all of the available `OriginWeather` terms.
      {: .note}

   1. In the **Order** drop-down, select `Descending`.

1. Select **Update** in the lower right of the visualization tool to redraw the visualization.

   As shown in the following image, the chart shows the average delay for each weather type at the flight origin. The greatest average delay was for `Damaging Wind`.

      <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-bar-chart-flight-delay.png" width="85%"  alt="Aggregation-based area chart"/>


1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).

## Building an area chart

An area chart is a line chart with the area below the line shaded with a color. Multiple buckets can be stacked to show relative proportions of an running absolute value of the variable. Or, you can superimpose buckets or even different variables to compare within x-axis buckets or time values.

In this tutorial, you'll use the OpenSearch sample flight data to create a visualization of the top five logs for flights delayed for every three hours over the last seven days.

To create the area chart:

1. Open a new visualization of type **Area**. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, in the **New Area/Choose a source** dialog, choose `opensearch_dashboards_sample_data_flights`.

1. In the visualization tools, select the **Data** tab.

1. In the **Metrics** panel in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Y-axis Count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Count`. Note that the `Count` metric there is no Field selection. This is because `Count` denotes the number of documents, not a field value.

1. (Optional) To replace the raw field name in the visualization, enter an alternative name for the data field in the **Custom label** box.

   The chart shows only one data point since the data is not yet bucketed.
   {: .note}

1. In the **Buckets** panel, select **Add** to open the **Add Bucket** window.

1. From the **Add bucket** drop-down, select **X-axis**.

1. From the **Aggregation** drop-down, select **Date Histogram**.

1. From the **Field** dropdown list, select **timestamp**.

   The timestamp field is the only date-time field available in the sample flight data.
   {: .note}

1. Select **Update**.

   The Visualize application generates a jagged time-series plot of the document count for an automatically determined bucket size. In this example, the bucket size is one day.

1. Drag-select the portion of the chart containing the data. Make sure to leave a margin on either side of the data so as not to cut any data off.

   The data expands to fill the entire width of the graph. Since there's more room, the auto-calculated bucket size decreases to 12 hours.

1. From the Buckets panel, select **Add**.

1. From the **Add Sub-Buckets** drop-down, select **Split series**.

1. From the **Sub aggregation** drop-down list, select **Terms**.

1. From the **Field** dropdown list, select **Cancelled**.

1. Select **Update** to reflect these parameters in the graph.

   The visualization shows the counts of cancelled vs. uncancelled flights superimposed on the timeline as show in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-area-normal-count.png" width="85%"  alt="Aggregation-based area chart"/>

   Note the following:

   - The count of cancelled (`Cancelled = true`) and uncancelled flights are superimposed on the graph. The cancelled flight count seems to average about 10% of the uncancelled flights.
   - The flight count is cyclic over time, with a one-day dip every week.

1. Select the **Metrics & axes** tab.

1. In the **Metrics** panel, expand **Count**.

1. In the **Mode** box, select `Stacked`.

1. Select **Update**.

   The visualization changes to show the cancelled and uncancelled flight counts stacked rather than superimposed, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-area-stacked-count.png" width="85%"  alt="Aggregation-based area chart"/>

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Building a heat map

A heat map displays values represented as a color or saturation gradient on a two-dimensional grid, effectively rendering a three-dimensional data display. The X and Y dimensions can be the same, as in a spatial heat map; or different, for example months vs. years in a record of average temperature at a location (thus separating the cyclic and trend data for the site).

In this tutorial, you'll use the OpenSearch sample flight data to create a visualization of flight delays for permutations of origin and destination weather descriptors.

To create the area chart:

1. Open a new visualization of type **Heat Map**. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, in the **New Heat Map/Choose a source** dialog, choose `opensearch_dashboards_sample_data_flights`.

1. In the visualization tools, select the **Data** tab.

1. In the **Metrics** panel in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Value Count** to expand the **Metrics** list.

1. In the **Aggregation** box, select the aggregation you want to display.

   For this tutorial, select `Count`. Note that the `Count` metric there is no Field selection. This is because `Count` denotes the number of documents, not a field value.

1. (Optional) To replace the raw field name in the visualization, enter an alternative name for the data field in the **Custom label** box.

1. In the **Buckets** panel, select **Add** to open the **Add Bucket** window.

1. From the **Add bucket** drop-down, select **X-axis**.

1. From the **Aggregation** drop-down, select **Terms**.

1. From the **Field** dropdown list, select **OriginWeather**.

1. Select the following display options for the `OriginWeather` term:

   - **Order by Metric**: `AverageFlightDelayMin`
   - **Order**: `Descending`
   - **Number**: `8`

1. Select **Update**.

   The Visualize application generates a vertical bar for each of the eight origin weather conditions.

1. From the Buckets panel, select **Add**.

1. From the **Add bucket** drop-down, select **Y-axis**.

1. From the **Sub aggregation** drop-down list, select **Terms**.

1. From the **Field** dropdown list, select **DestWeather**.

1. Select the same display options for the `DestWeather` term:

   - **Order by Metric**: `AverageFlightDelayMin`
   - **Order**: `Descending`
   - **Number**: `8`
   
1. Select **Update** to reflect these parameters in the graph.

1. Adjust the display of the heatmap by doing the following:

   1. Select the **Options** tab.

   1. In the **Heatmap settings** panel, select `Greys` from the **Color schema** drop-down.

   1. Enter `8` in the **Number of colors** box.

   1. In the **Labels** panel, select **Show labels**.

   1. Select *Update*.

   The visualization shows average flight delay mapped to origin and destination weather combinations as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-heatmap-flight-delay.png" width="85%"  alt="Aggregation-based area chart"/>

   Note the following:

   - The heat map data is organized into four quadrants, corresponding to the four combinations of "good" (Cloudy, Rain, Clear, Sunny) and "bad" (Hail, Heavy Fog, Damaging Wind, Thunder & Lightening) weather conditions at the destination and origin. This is coincidental, but the interaction pattern is pronounced enough that it's visible if you order one or both buckets differently.
   - The longest delays occurred when the weather was good at both the origin and destination. The shortest delays occurred occurred when the weather was bad at both locations.

1. Now assume that you're interested in flight cancellations. You can limit the heat map display to only cancelled flights.

   You can filter the data using the [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool), but if the visualization is in a dashboard this filters the data for other visualizations as well. The following procedure limits the data only for this current visualization.
   {: .note}

1. In the Buckets panel, select Add.

1. In the Add sub-bucket pop-up, select Split chart.

1. In the Split chart panel, select Rows.

1. In the Sub aggregation drop-down, select Filters.

1. In the **Filter 1** box, enter the following DQL filter to display only cancelled flights:

   `Cancelled: true`

   The filter terms are case-sensitive.
   {: .tip}

1. Select Update.

   The visualization shows cancellations mapped to origin and destination weather combinations as shown in the following image. It shows that no cancellations occurred when the weather was good at both ends of the flight.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-heatmap-cancellation.png" width="85%"  alt="Flight cancellation heat map"/>

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Building a line graph

A line graph shows one or more series of numerical data points on the Y axis plotted against a numerical field on the X axis. The points can be connected by a line. The X axis value can be a timeline or any other continuous or discrete number series.

In this tutorial, 

To create the area chart:

1. Open a new visualization of type **Line**. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

   For this tutorial, in the **New Line/Choose a source** dialog, choose `opensearch_dashboards_sample_data_flights`.

1. In the visualization tools, select the **Data** tab.

1. In the **Metrics** panel in the **Data** tab, select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Y-axis Count** to expand the **Metrics** list.

1. In the **Aggregation** box, choose the aggregation you want to display.

   For this tutorial, select `Average`.

1. In the **Field** box, choose the field you want to display.

   For this tutorial, select `AvgTicketPrice`.

1. (Optional) To replace the raw field name in the visualization, enter an alternative name for the data field in the **Custom label** box.

   For this tutorial, enter `Average Ticket Price`.

1. Select **Update** in the lower right of the visualization tool to view the metric in the display panel.

   The visualization panel displays a single bar with height of a little over `$600`, the average ticket price for every document in the flight database.

   If your visualization displays a different value, make sure that your time filter window is large enough to encompass all the sample flight data.
   {: .note}

1. in the **Buckets** panel, select **Add**.

1. In the **Add bucket** drop-down, select **X-axis** to bucket the data by vertical column.

1. In the **Aggregation** drop-down, select an aggregation type for the rows.

   For this example, select `Histogram` to compare a series of values.

1. In the Field drop-down, select a field for the row buckets.

   For this example, select the text value `DistanceKilometers`.

1. Select **Update** in the lower right of the visualization tool to redraw the visualization.

   The chart shows the average ticket price as a function of bucketed flight distance.

1. in the **Buckets** panel, select **Add**.

1. In the **Add bucket** drop-down, select **Split series** to bucket the data by vertical column.

1. In the **Sub aggregation** drop-down, select an aggregation type for the rows.

   For this example, select `Terms` to compare different discrete values.

1. In the **Field** drop-down, select an aggregation type for the rows.

   For this example, select `Day of week`.

1. In the **Order by** box, select `Alphabetical`.

1. In the **Size** box, select `7`.

1. Select **Update**.

   The average ticket price is displayed per weekday value in seven different lines as shown in the following image. The average ticket price for weekday value keys 5 and 6 are significantly higher across most flight distances. Unfortunately, the data does not provide a key as to which two weekdays these are.

      <img src="{{site.url}}{{site.baseurl}}/images/dashboards/example-line-cost-vs-distance.png" width="85%"  alt="Aggregation-based area chart"/>

1. Save the visualization as described in [Saving a data visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Related links

- [Visualize]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/)
- [Visualization types in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/)

