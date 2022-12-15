---
layout: default
title: Area chart
parent: Visualize
nav_order: 5
---

# Area chart

Area charts can be created by searching OpenSearch, extracting data, and processing the results and can be added to a dashboard. 

In this tutorial you'll create an area chart in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/) using sample data. You'll also learn how to add an area chart to a dashboard.

# Create an area chart

1. Select **Visualize** from the menu.
2. Select **Create visualization**.
3. Select **Area** and then select **opensearch_dashboards_sample_data_flights** for source.
4. Select **+ Add** => **X-axis** in **Buckets**.
<img src="{{site.url}}{{site.baseurl}}/images/area-chart-2.png" alt="Visual of Step 4 process">
5. Enter Aggregation: **Date Histogram** and Field: **timestamp** in the parameters, and then select **Update** to reflect it in the graph. 
<img src="{{site.url}}{{site.baseurl}}/images/area-chart-3.png" alt="Visual of Step 5 process">
6. Next, select **+Add** => **Split series** again for Buckets.