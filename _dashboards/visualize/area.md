---
layout: default
title: Using Area charts
parent: Visualization types
grand_parent: Visualize
nav_order: 5
---

# Using Area charts

An area chart is a line chart with the area between the line and the axis shaded with a color, and is a primary visualization type used to display time series data. You can create area charts in Dashboards using the Area visualization type or using the TSVB, Vega, or VisBuilder visualization tools. For this tutorial, you'll use the Area visualization type.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/aggregation-based-area.gif" alt="Demonstration of the area chart tutorial steps" height="100">

# Try it: Create a simple aggregation-based area chart

In this tutorial you'll create a simple area chart in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) using sample data and aggregations.

You have several aggregation options in Dashboards, and the choice influences your analysis. The use cases of aggregations vary from analyzing data in real time to using Dashboards to create a visualization dashboard. If you need an overview of aggregations in OpenSearch, see [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/) before getting started with this tutorial.

The Dashboards playground is read-only and will not save the session details for this tutorial.
{: .note}

## Set up the area chart

1. Select **Visualize** from the menu and then select **Create visualization**.
2. Select **Area** from the window.
3. Select **opensearch_dashboards_sample_data_flights** in the **New Area/Choose a source** window.
4. Select the calendar icon and set the time filter to **Last 7 days.**

## Add aggregations to the area chart

You'll create an area chart that displays the top five logs for flights cancelled for every three hours over the last seven days.

1. Add a **Buckets** aggregation.
   a. Select **Add** and then **X-axis** in the **Add Bucket** window.
   b. From the **Aggregation** dropdown, select **Date Histogram**. 
   c. From the **Field** dropdown, select **timestamp**. 
   d. Select **Update**. 
2. Add a sub aggregation.
   a. Select **Add** and then in the **Add Sub-Buckets** window, select **Split series**.
   b. From the **Sub aggregation** dropdown, select **Terms.**
   c. From the **Field** dropdown, select **Cancelled.**
   d. Select **Update** to reflect these parameters in the graph.  

You've now created the following simple aggregation-based area chart.

<img src="{{site.url}}{{site.baseurl}}/images/aggregation-area.png" alt="Example aggregation-based area chart in OpenSearch Dashboards" height="100">

# Related links

- [Visualize]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/)
- [Visualization types in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-types/)
- [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/)