---
layout: default
title: Using Area charts
parent: Visualization types
grand_parent: Visualize
nav_order: 5
---

# Using Area charts

An area chart is a line chart with the area between the line and the axis shaded with a color, and is a primary visualization type used to display time series data. You can create area charts in Dashboards using the Area visualization type or using the TSVB, Vega, or VisBuilder visualization tools. For this tutorial, you'll use the Area visualization type.

# Try it: Create a simple aggregation-based area chart

In this tutorial you'll create a simple area chart in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) using sample data and aggregations. You have several aggregation options in Dashboards, and the choice influences your analysis. 

If you need an overview of aggregations in OpenSearch, see [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/) before getting started with this tutorial.
{: .note}

<<Note to self: insert video of these steps>>

1. Select **Visualize** from the menu and then select **Create visualization**.
2. Select **Area** from the window.
3. Select **opensearch_dashboards_sample_data_flights** in the **New Area/Choose a source** window.
4. Select the calendar icon to change the time range from the default **Last 15 minutes** to **This week.**
5. Under **Buckets**, select **Add** and then **X-axis** in the **Add Bucket** window.
6. Under **Aggregation**, select **Date Histogram** from the dropdown, and under **Field**, select **timestamp** from the dropdown. 
7. Select **Update** to reflect these parameters in the graph. 
8. Select **Add** and then **Split series** in **Add Sub-Buckets** window.
9. Select **Update** to reflect these parameters in the graph.  

Dashboards playground is read-only and will not save the session details for this tutorial.
{: .note}

# Related links

- [Visualize]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/)
- [Visualization types in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-types/)
- [Aggregations]({{site.url}}{{site.baseurl}}/opensearch/aggregations/)