---
layout: default
title: Using Area charts
parent: Visualization types
grand_parent: Visualize
nav_order: 5
---

# Using Area charts

An area chart is a line chart with the area between the line and the axis shaded with a color, and is a primary visualization type used to display time series data. You can create area charts in Dashboards using the Area visualization type or using the TSVB, Vega, or VisBuilder visualization tools. For this tutorial, you'll use the Area visualization type.

# Try it: Create a basic area chart

In this tutorial you'll create a simple area chart in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) using sample data.

<<Note to self: insert video of these steps>>

1. Select **Visualize** from the menu and then select **Create visualization**.
2. Select **Area** from the window.
3. Select **opensearch_dashboards_sample_data_flights** in the **New Area/Choose a source** window.
4. Select the calendar icon to change the time range from the default of **15 min** to **This week.**
5. Under **Buckets**, select **Add**, then select **X-axis** in the **Add Bucket** window.
6. Under **Aggregation**, select **Date Histogram** from the dropdown and under **Field**, select **timestamp** from the dropdown. 
7. Select **Update** to reflect these parameters in the graph. 
8. Select **Add** and then select **Split series** in **Add Buckets**.
9. Select **Update** to reflect these parameters in the graph.  

Dashboards playground is read-only and will not save the session details for this tutorial.
{: .note}

# Try it: Create a simple aggregation-based area chart

In Dashboards you have several ways to aggregate numeric data using using a sum, average, count, minimum, and much more. If you need an overview of aggregations in OpenSearch, see the [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/) page before getting started with this tutorial.

In this tutorial you'll learn how to create a simple aggregation-based visualization in Dashboards.

1. Select **Dashboard** in the 

# Related links

- [Aggregations](https://opensearch.org/docs/latest/opensearch/aggregations/)
- 