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

In this tutorial you'll learn the basics of creating a dashboard using the **Dashboard** application and OpenSearch sample log data. You'll learn to query indexed data, filter query results to highlight key metrics, build visualizations using the data, and combine the visualization panels onto a dashboard.

Before you begin, make sure you've installed OpenSearch and OpenSearch Dashboards and that you've connected to Dashboards at [http://localhost:5601](http://localhost:5601). The username and password are `admin`.
{: .note}

## Getting familiar with user interface 

Before getting started, you should be familiar with the Dashboard user interface. The user interface comprises five main parts, which are show in the image below:

- The **navigation panel** (A) on the left contains the OpenSearch Dashboards applications.
- The **toolbar** (B) contains frequently used commands and shortcuts.
- The **search** bar (C) allows you to search for documents and other objects and add other filters.
- The **time filter** (D) allows you to customize the time and date.
- The **panel** (E) allows you to add existing visualizations to or create new ones for the dashboard.

![Dashboard user interface]({{site.url}}{{site.baseurl}}/images/dashboards/user-interface.png)

## Adding data and creating a dashboard

To get started creating a dashboard, you'll first add the sample dataset and then use it to create your first dashboard. To add the sample data:

1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**.
1. Choose **Add data** and choose **Sample eCommerce orders**, which is the sample data set used in this tutorial.

Now that you've added the sample data, you'll create a dashboard using that data. This data set has existing example visualizations, and you can use the existing visualizations or create new visualizations. For this tutorial, you'll do both.








To get started with creating a dashboard and a new visualization: 

1. From the navigation panel, choose **Dashboard**.
2. From the **Dashboards** window, choose **Create Dashboard** and then **Add an existing**.
3. From the **Add panels** window, choose **Create new** and **Visualization**. This is a shortcut for creating a dashboard and a visualization in one flow. Alternatively, you can use the **Visualize** application to create visualizations and then add them to the dashboard.
4. From the **New Visualization** window, choose ** 


## Configuring the visualization

saving the visualization takes you back to the dashboard
hiding the legend
resizing the visualization to fit dashboard, move the panel by selecting the title and manually moving it.
using existing visualization with **Add**
viz is added automatically
Panels is the term used for a visualization that is added to a dashboard (panel and visualization may be used interchangeably)
saving the dashboard

