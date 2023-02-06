---
layout: default
title: Creating dashboards
nav_order: 30
has_children: true
---

# Creating dashboards

A dashboard combines multiple data visualizations into a single view. With the **Dashboard** application you can:

- Get started with pre-built panels and dashboards and customize display properties to create the dashboard you need.
- Analyze, monitor, and alarm on metrics, logs, and traces across multiple data sources.
- Create interactive dashboards and share them with anyone in your organization.

![Single-view dashboard in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-index.png)

To learn about data visualizations in Dashboards, see [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).

In this tutorial you'll learn the basics of creating a dashboard using the **Dashboard** application and OpenSearch sample log data. You'll learn to query indexed data, filter query results to highlight key metrics, build visualizations using the data, and combine the visualization panels onto a dashboard.

Before you begin, make sure you've installed OpenSearch and OpenSearch Dashboards and that you've connected to Dashboards at [http://localhost:5601](http://localhost:5601). The username and password are `admin`.
{: .note}

## Adding data and creating a dashboard

To create a dashboard:

1. From the navigation panel, select **Dashboard**.
1. From the **Dashboards** window, select **Create Dashboard** and then **Add an existing**.
1. From the **Add panels** window, select **Create new** and **Visualization**. 
1. 