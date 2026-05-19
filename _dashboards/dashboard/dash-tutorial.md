---
layout: default
title: Dashboard tutorial
parent: Creating dashboards
nav_order: 50
has_children: false
---

# Tutorial: creating a dashboard

You can use the **Dashboards** application in OpenSearch Dashboards to build a page containing multiple visual representations of your data.

>This documentation uses the following terms:
>- _OpenSearch Dashboards_: The web UI for OpenSearch.
>- **Dashboards** application: The application within OpenSearch Dashboards for creating dashboards.
>- _dashboard_ (lowercase): An individual collection of data visualizations created in the **Dashboards** application.
{: .note}

Use the following tutorial to learn to create a dashboard using the **Dashboards** application and the OpenSearch sample data. The sample datasets have existing sample visualizations that you can use for the dashboard, or you can create your own visualizations. The tutorials demonstrate how to do both.


## Prerequisites

Before starting this tutorial, ensure that you:

- Familiarize yourself with the **Dashboards** UI. See [Navigating the UI]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/#navigating-the-ui).

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

   You can instead complete this tutorial online on the [OpenSearch Playground](https://playground.opensearch.org/app/home#). You cannot save your work on the OpenSearch Playground site. Also, the interface looks different because the OpenSearch Playground uses the [New Home Page interface]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#the-new-home-page-interface), but functionality is the same in all other important respects. OpenSearch Playground already contains all sample data.
   {: .note}

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

- Know how to use the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/) and the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

- Understand OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).


## Creating a dashboard

To create a new dashboard, follow these steps:

1. | In the default navigation panel | In the New Home Page navigation panel |
   | :-- | :-- |
   | - Select **OpenSearch Dashboards** > **Dashboards**.<br/>- Select **Dashboards**. | Select **Dashboards**. |

1. | In the default navigation panel | In the New Home Page navigation panel |
   | :-- | :-- |
   | - In the Dashboards panel, select **Create**.<br/>- From the drop-down, select **Dashboard**. | From the application menu, select **Create Dashboard**. |

## Adding an existing visualization

To add a saved visualization to the dashboard, follow these steps:

1. From the application panel, choose **Add an existing**.

1. In the **Add panels** dialog, type `ecommerce` in the **Search** box to filter the list of available visualizations.

1. From the **Add panels** dialog, choose **[eCommerce] Sales by Category**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon to close the dialog.

1. Use the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) to select `Last 2 years` as the time window as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-time-2-years.png" alt="Time filter set to Last 2 years" width="40%">

1. Drag-select the narrow band of data from the area chart as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-sales-drag.png" alt="Visualization showing drag-select"  width="60%">

   The data adjusts to span the width of the data display and the scale adjusts automatically, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-sales-area.png" alt="Sales by category area visualization"  width="60%">

   Selecting a date range interactively results in an absolute time interval.
   {: .note}

You've created a dashboard with a single panel, which you'll continue to modify in this tutorial. Save the dashboard as described in the following section.


## Saving a dashboard

To save a new dashboard, follow these steps:

1. In the **Dashboards** toolbar, choose **Save**.

1. In the **Save dashboard** dialog, enter `[Ecommerce] tutorial dashboard` in the **Title** box.

1. Save the time filter with the dashboard by selecting **Store time with dashboard**.

1. Choose **Save**.

1. Choose **Edit** from the application menu to continue editing the dashboard.


## Creating a visualization

To create a new visualization in **Dashboards**, follow these steps:

1. From the application toolbar, choose **Create new**.

1. From the **New Visualization** window, choose **Metric**.

1. In the **New Metric/Choose a source** dialog, select the index pattern **opensearch_dashboards_sample_data_ecommerce**.

1. From the toolbar, choose **Save**.

1. In the **Save visualization** dialog, enter a title for the visualization. For this tutorial, enter `[eCommerce] Order Count`.

1. Choose **Save and return**.

   The **Dashboards** application saves the metric visualization and adds it to the dashboard as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-combined.png" alt="Dashboard with two panels"  width="100%">


## Adding subsequent panels

Add a Markdown visualization to the dashboard. Follow these steps:

1. From the dashboard toolbar, choose **Add**.

1. From the **Add panels** dialog, choose **[eCommerce] Markdown**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon to close the dialog.

   The **Dashboards** application adds the Markdown panel to the dashboard as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-three-panel.png" alt="Example dashboard"  width="100%">


## Organizing a dashboard

You can organize a dashboard by resizing and rearranging panels. Move and resize the Markdown panel to serve as a title and description for the dashboard. Follow these steps:

1. Select and hold the top of the panel anywhere to the left of the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="options icon"/>{:/} (options) icon.

1. Drag the panel to the top of the application panel.

   The Sales by Category panel automatically swaps places with the Markdown panel as you move it up.
1. Select and hold the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/resize-icon.png" class="inline-icon" alt="resize icon"/>{:/} (resize) icon in the panel's lower-right corner.
Select and hold the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/resize-icon.png" class="inline-icon" alt="resize icon"/>{:/} (resize) icon in the panel's lower-right corner.

1. Drag to make the panel longer and narrower so that it serves as a banner across the entire upper part of the dashboard.

   The metric panel automatically moves down to allow room for the resized Markdown panel.

   The resulting dashboard should look like the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-tut-banner.png" alt="Example dashboard"  width="100%">

1. Save your dashboard. See [Saving a dashboard](#saving-a-dashboard).