---
layout: default
title: Creating dashboards
nav_order: 30
has_children: true
---

# Creating dashboards

A dashboard in OpenSearch Dashboards lets you visually represent your analytical, operational, and strategic data to help users quickly understand the current situation. A well-designed, effective dashboard provides a high-level view of key metrics, simplifies data exploration, and delivers insights to users when and where they need them. 

The **Dashboard** application in OpenSearch Dashboards gives you the ability to:

- Create a collection of visualizations that can be filtered and customized.
- Build interactive dashboards and share them with anyone in your organization.
- Analyze, monitor, and alarm on metrics, logs, and traces across multiple data sources.

The following tutorial assumes you're either using your existing installation of OpenSearch Dashboards or using the [OpenSearch playground](https://playground.opensearch.org/app/home#/). Depending on which one you use, certain capabilities aren't available. For example, sample datasets may not be in your existing installation and saving a dashboard isn't an option in the playground.
{: .note}

## Getting familiar with user interface

In this tutorial you'll learn the basics of creating a dashboard using the **Dashboard** application and OpenSearch sample data. Before getting started, get familiar with the **Dashboard** user interface. The user interface comprises the following main parts:

![Dashboard user interface]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-UI.png)

- The **navigation panel** (A) on the left contains the OpenSearch Dashboards applications.
- The **search** bar (B) lets you search for documents and other objects and add filters.
- The **filter** (C) lets you apply different data perspectives to narrow a dashboard's results.
- The **toolbar** (D) contains frequently used commands and shortcuts.
- The **time filter** (E) lets you customize the time and date.
- The **panel** (F) allows you to add existing visualizations to the dashboard or create new ones for the dashboard.

_Panel_ is a term used to refer to a visualization displayed on a dashboard. The terms _panel_ and _visualization_ may be used interchangeably throughout this and other Dashboard-related documentation.
{: .note}

## Creating the dashboard

You'll use an OpenSearch Dashboards sample dataset to create a dashboard. The sample dataset has existing sample visualizations, and you can use those visualizations or create new visualizations for the dashboard. For this tutorial, you'll do both. Once you've completed this tutorial, you'll have learned the foundations of creating a new dashboard in OpenSearch Dashboards.

![Dashboard displaying sample dataset visualizations]({{site.url}}{{site.baseurl}}/images/dashboards/example-dashboard.png)

To create the dashboard:

1. From the navigation panel, choose **Dashboard**.
2. From the **Dashboards** window, choose **Create Dashboard**.
3. Set the time filter to **Last 30 days**.
4. From the panel, choose **Add an existing**.
5. From the **Add panels** window, choose **[eCommerce] Average Sold Quantity**. The donut chart is added to the dashboard.

You've created a basic dashboard with a single panel, which you'll continue using throughout this tutorial.
You've created a basic dashboard with a single panel like the following, which you'll continue using throughout this tutorial.

![Basic dashboard with single panel]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-basic.png)

## Creating visualizations

Continuing with the dashboard you created in the preceding steps, you'll create a new visualization and save it to the dashboard.

1. From the dashboard toolbar, choose **Create new**, then **Visualization**.
1. From the **New Visualization** window, choose **Vertical Bar** and then select the index pattern **opensearch_dashboards_sample_data_ecommerce**. 
1. From the toolbar, select **Save**
1. In the **Save visualization** window, add a title for the visualization. For example, the title for the bar chart panel is Order Date.
9.  Select **Save and return**.  

The bar chart visualization is now saved and you are taken back to the dashboard. You'll see two visualizations on the dashboard, as shown in the following image: 
The bar chart visualization is now saved and you are taken back to the dashboard. You'll see two visualizations on the dashboard, as shown in the following image: 

![Dashboard showing visualizations combined in a single view]({{site.url}}{{site.baseurl}}/images/dashboards/new-dashboard.png)

## Adding subsequent panels

Continuing with the dashboard you created in the preceding steps, you'll add a visualization to the dashboard.

1. From the dashboard toolbar, choose **Add**.
1. From the **Add panels** window, choose **[eCommerce] Sales by Category**.
1. Select `x` to close the **Add panels** window. 

You'll see an area chart visualization display on the dashboard, as shown in the following image: 

![Adding another panel to the dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/new-area-viz.png)

## Saving dashboards

When you've finalized your dashboard, save it. If you're saving a new dashboard:

1. In the toolbar, choose **Save**.
2. On the **Save dashboard** window, enter the **Title**. The **Description** is optional.
3. To save the time filter to the dashboard, select **Store time with dashboard**.
4. Choose **Save**.

## Customizing the look of a panel

Showing a legend can give readers more information, while hiding a legend can give it a cleaner look. If you want to show or hide the panel legend:

1. To show the legend, 
2. To hide the legend, select the list icon in the panel's lower left corner.

If you want to change the color of the panel legend:

1. Select the gear icon on the area chart panel.
2. From the **Options** window, select **Edit visualization**.
3. From the visualization legend, select a category and then select a color from the flyout. The area chart updates with your change.
4. Select **Save and return**. 

If you want to show or hide panel title or customize it without applying the changes across the dashboard overall:

1. Select the gear icon on the panel.
2. From the **Options** window, select **Edit panel title**.
3. From the **Customize panel**, add a title under **Panel title** or toggle the **Show panel title** to hide the title.
4. Choose **Save**.

## Arranging panels

To organize panels, arrange them side-by-side, or resize them, you can use these options:

- To move, select and hold the panel title and drag to the new location.
- To resize, select the resize icon in the panel's lower right corner and drag to the new dimensions.
- To view in fullscreen mode, select the vertical ellipsis in the top right of the panel and select **Maximize panel**. To minimize the fullscreen mode, select the vertical ellipsis and select **Minimize**.

The following is an example of a customized dashboard.

![Customized dashboard with panels arranged side by side and without legends]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-arranged.png)
