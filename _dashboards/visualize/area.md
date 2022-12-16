---
layout: default
title: Using Area charts
parent: Visualization types
grand_parent: Visualize
nav_order: 5
---

# Using Area charts

Area charts can be created by searching OpenSearch, extracting data, and processing the results and can be added to a dashboard. An area chart is a line chart with the area between the line and the axis shaded with a color, and is a primary visualization type used to display time series data. You can create area charts in Dashboards using the Area visualization type or using the TSVB, Vega, or VisBuilder visualization tools. For this tutorial, you'll use the Area visualization type.

# Create an area chart

In this tutorial you'll create a simple area chart in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) using sample data.

1. Select **Visualize** from the menu.
2. Select **Create visualization**.
3. Select **Area** and then select **opensearch_dashboards_sample_data_flights** for source.
4. Select **+ Add** => **X-axis** in **Buckets**.
<img src="{{site.url}}{{site.baseurl}}/images/area-chart-2.png" alt="Visual of Step 4 process">
1. Enter Aggregation: **Date Histogram** and Field: **timestamp** in the parameters, and then select **Update** to reflect it in the graph. 
<img src="{{site.url}}{{site.baseurl}}/images/area-chart-3.png" alt="Visual of Step 5 process">
1. Next, select **+Add** => **Split series** in Buckets.
  <img src="{{site.url}}{{site.baseurl}}/images/area-chart-4.png" alt="Visual of Step 6 process"> 
1. Select **Save** from the menu bar at the top left of the screen, enter tutorial - Area in Title, and select **Save** to save. Note that Dashboards playground is read-only and will not save any of your session details such as queries.

# Create an aggregation-based area chart

In Dashboards you have several ways to aggregate numeric data using using a sum, average, count, minimum, and much more. For more information on aggregations in OpenSearch, see the [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/) page.

Following the steps below, you'll learn how to create an aggregation-based visualization in Dashboards.

1. 