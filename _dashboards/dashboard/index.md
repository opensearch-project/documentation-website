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

Before you begin this tutorial, make sure you've installed OpenSearch and OpenSearch Dashboards and that you've connected to Dashboards at [http://localhost:5601](http://localhost:5601). The username and password are `admin`.
{: .note}

## Getting familiar with user interface 

In this tutorial you'll learn the basics of creating a dashboard using the **Dashboard** application and OpenSearch sample log data. Before getting started, get familiar with the Dashboard user interface. The user interface comprises five main parts, as shown in the following image:

![Dashboard user interface]({{site.url}}{{site.baseurl}}/images/dashboards/user-interface.png)

- The **navigation panel** (A) on the left contains the OpenSearch Dashboards applications.
- The **toolbar** (B) contains frequently used commands and shortcuts.
- The **search** bar (C) allows you to search for documents and other objects and add filters.
- The **time filter** (D) allows you to customize the time and date.
- The **panel** (E) allows you to add existing visualizations to the dashboard or create new ones for the dashboard.

## Adding data and creating the dashboard

Add the sample dataset and then use it to create your first dashboard by performing the following steps:

1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**.
1. Choose **Add data** and choose **Sample eCommerce orders**, which is the sample dataset used in this tutorial.

Now that you've added the sample data, you can create a dashboard using that data. The sample dataset has existing sample visualizations, and you can use those visualizations or create new visualizations for the dashboard. For this tutorial, you'll learn to do both.

1. From the navigation panel, choose **Dashboard**.
1. From the **Dashboards** window, choose **Create Dashboard**.
1. Set the time filter to **Last 30 days**.
1. Choose **Add an existing**.
1. From the **Add panels** window, choose **Create new** and **Visualization**. This is a shortcut for creating a dashboard and a visualization in one flow. Alternatively, you can use the **Visualize** application to create visualizations and then add them to the dashboard.
1. From the **New Visualization** window, choose **[eCommerce] Average Sold Quantity**. The donut chart is automatically added to the dashboard.

You've created the following basic dashboard, which you'll continue using throughout this tutorial.

![Creating a basic dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-basic.png)
## Creating and configuring a visualization

In the next steps, you'll create a new visualization in the **Dashboard** application, configure it, and add it to the dashboard. 

Continuing with the dashboard you created in the preceding steps, follow these steps:

1. From the dashboard toolbar, choose **Create new**.
1. From the **New Visualization** window, choose **Vertical Bar** and then choose the index pattern **opensearch_dashboards_sample_data_ecommerce**. You'll see the following image:

    ![New visualization vertical bar chart]({{site.url}}{{site.baseurl}}/images/dashboards/new-bar-viz.png)

Next you'll configure the visualization by following these steps.

1. Verify you are on the **Data** panel. **Metrics** shows **Y-axis Count**.
1. From the **Buckets** panel, choose **Add** and then select **X-axis** from the **Add Bucket** dropdown list.
1. From the **Aggregation** dropdown list, select **Date histogram**.
1. Choose **Update**. You should see the following image:

    ![Configuring and creating a visualization]({{site.url}}{{site.baseurl}}/images/dashboards/configure-bar-viz.png)

Next you'll save the visualization by following these steps.

1. From the toolbar, select **Save**
2. In the **Save visualization** window, add a title for the visualization. In this example, the title is Order Date.
3. Select **Save and return**. The new visualization is automatically added to the dashboard you created previously. 

The dashboard should now look like the following image:

![Dashboard showing existing and new visualizations combined in a single view]({{site.url}}{{site.baseurl}}/images/dashboards/new-dashboard.png)

## Configuring the visualization

saving the visualization takes you back to the dashboard
hiding the legend
resizing the visualization to fit dashboard, move the panel by selecting the title and manually moving it.
using existing visualization with **Add**
viz is added automatically
Panels is the term used for a visualization that is added to a dashboard (panel and visualization may be used interchangeably)
saving the dashboard

