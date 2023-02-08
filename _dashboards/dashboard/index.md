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


_Panel_ is a term used to refer to a visualization displayed on a dashboard. The terms _panel_ and _visualization_ may be used interchangeably throughout this and other Dashboard-related documentation.
{: .note}

## Adding sample data

If you haven't already added the OpenSearch Dashboards sample datasets as described in [Quickstart guide for OpenSearch Dashboards](https://opensearch.org/docs/latest/dashboards/quickstart-dashboards/), add them before proceeding to the next steps. **Sample eCommerce orders** is used for this tutorial. 

To add the sample dataset:

1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**.
2. Choose **Add data** and choose **Sample eCommerce orders**.

## Creating dashboards

Now that you've added the sample data, you can create a dashboard using that data. The sample dataset has existing sample visualizations, and you can use those visualizations or create new visualizations for the dashboard. For this tutorial, you'll do both.

1. From the navigation panel, choose **Dashboard**.
2. From the **Dashboards** window, choose **Create Dashboard**.
3. Set the time filter to **Last 30 days**.
4. Choose **Add an existing**.
5. From the **Add panels** window, choose **Create new** and **Visualization**. This is a shortcut for creating a dashboard and a visualization in one flow. Alternatively, you can use the **Visualize** application to create visualizations and then add them to the dashboard.
6. From the **New Visualization** window, choose **[eCommerce] Average Sold Quantity**. The donut chart is added to the dashboard.

You've created a basic dashboard like the following, which you'll continue using throughout this tutorial.

![Creating a basic dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-basic.png)

## Creating and saving visualizations

Continuing with the dashboard you created in the preceding steps, you'll create a new visualization and save it to the dashboard.

1. From the dashboard toolbar, choose **Create new**.
1. From the **New Visualization** window, choose **Vertical Bar** and then select the index pattern **opensearch_dashboards_sample_data_ecommerce**. You'll see an image like the following.

    ![New visualization vertical bar chart]({{site.url}}{{site.baseurl}}/images/dashboards/new-bar-viz.png)

1. Configure the chart's **Data** settings by verifying **Metrics** is **Y-axis Count**.
1. From the **Buckets** panel, choose **Add** and select **X-axis** from the **Add Bucket** dropdown list.
1. From the **Aggregation** dropdown list, select **Date histogram**.
1. Choose **Update**. You'll see a bar chart visualization like the following:

    ![Configuring a visualization]({{site.url}}{{site.baseurl}}/images/dashboards/configure-bar-viz.png)

1. From the toolbar, select **Save**
1. In the **Save visualization** window, add a title for the visualization. For example, the title for the bar chart panel is Order Date.
1. Select **Save and return**.  

The bar chart visualization is now saved and you are taken back to the dashboard. You'll see three visualizations on the dashboard, as shown in the following image: 

![Dashboard showing visualizations combined in a single view]({{site.url}}{{site.baseurl}}/images/dashboards/new-dashboard.png)

## Adding panels

Continuing with the dashboard you created in the preceding steps, you'll add a visualization to the dashboard.

1. From the dashboard toolbar, choose **Add**.
1. From the **Add panels** window, choose **[eCommerce] Sales by Category**.
1. Select `x` to close the **Add panels** window. 

You'll see an area chart visualization display on the dashboard, as shown in the following image: 

![Adding another panel to the dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/new-area-viz.png)

## Editing visualizations

You can edit visualizations, configure panels, and specify labels for a panel. For example, you can change the colors of the shaded areas in the area chart. 

Follow these steps to edit the area chart: 

1. Select the gear icon on the area chart panel.
1. From the **Options** window, select **Edit visualization**.
1. From the visualization legend, select **Men's Accessories** and then select a color. The area chart now displays your edit.
1. Select **Save and return**. The edits area chart is displayed on the dashboard, similar to the following: 

![Editing a visualization]({site.url}}{{site.baseurl}}/images/dashboards/edit-viz.png)



