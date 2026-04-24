---
layout: default
title: Creating dashboards
nav_order: 40
has_children: false
redirect_from:
  - /dashboards/dashboard/
---

# Creating dashboards

You can use the **Dashboards** application in OpenSearch Dashboards to build a page containing multiple visual representations of your data.

>This documentation uses the following terms:
>- _OpenSearch Dashboards_: The web UI for OpenSearch.
>- **Dashboards** application: The application within OpenSearch Dashboards for creating dashboards.
>- _dashboard_ (lowercase): An individual collection of data visualizations created in the **Dashboards** application.{: .note}

Use the following tutorials to learn to create a dashboard using the **Dashboards** application and the OpenSearch sample data. The sample datasets have existing sample visualizations that you can use for the dashboard, or you can create your own visualizations. The tutorials demonstrate how to do both.

This OpenSearch Playground [dashboard example](https://playground.opensearch.org/app/dashboards#/view/722b74f0-b882-11e8-a6d9-e546fe2bba5f?_g=(filters:!(),refreshInterval:(pause:!f,value:900000),time:(from:now-7d,to:now))&_a=(description:'Analyze%20mock%20eCommerce%20orders%20and%20revenue',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!t,title:'%5BeCommerce%5D%20Revenue%20Dashboard',viewMode:view)) comprises several of the visualisations available in OpenSearch Dashboards.
{: .note}

## Navigating the UI

The following components make up the **Dashboards** UI.

![Dashboards user interface]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-UI.png)

- The _navigation panel_ (A) on the left contains the OpenSearch Dashboards applications.
- The _search_ bar (B) enables selection of data using a query language search.
- The _filter_ (C) provides a graphical interface for selecting data values and ranges.
- The _toolbar_ (D) contains frequently used commands and shortcuts.
- The _time filter_ (E) enables selection of data based on a time and date range.
- The _panel_ (F) displays the dashboard. You can add existing visualizations, create new ones, and save the dashboard's configuration.

The following tutorials assumes you're either using your existing installation of OpenSearch Dashboards or using the [OpenSearch Playground](https://playground.opensearch.org/app/home#/). Depending on which one you use, certain capabilities may not be available. For example, sample datasets may not be included in your existing installation, and saving a dashboard isn't an option in the OpenSearch Playground.
{: .note}


## Prerequisites

Before using the **Dashboards** tool, ensure that you:

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards).

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

- Know how to use the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/) and the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

- Understand OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).


## Creating a dashboard and adding an existing visualization

To create a dashboard and add a sample visualization, follow these steps:

1. In the navigation panel, select **OpenSearch Dashboards > Dashboards**.

1. From the **Dashboards** panel, choose **Create** > **Dashboard**.

1. Choose the calendar icon and set the time filter to **Last 30 days**.

1. From the panel, choose **Add an existing**.

1. From the **Add panels** diaog, choose **[eCommerce] Promotion Tracking**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon to close the dialog.

You've created the following dashboard with a single panel, which you'll continue using throughout this tutorial.

![Basic dashboard with single panel]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-basic.png)

## Creating visualizations

To create a new visualization and save it to the dashboard, follow these steps:

1. From the **Dashboards** toolbar, choose **Create new**.

1. From the **New Visualization** window, choose **Gauge**.

1. Select the index pattern **opensearch_dashboards_sample_data_ecommerce**.

1. From the toolbar, choose **Save**.

1. In the **Save visualization** dialog, enter a title for the visualization. For example, the title for the gauge chart panel is [eCommerce] Orders.

1. Choose **Save and return**.

The **Dashboards** application saves the gauge chart visualization and adds it to the dashboard as shown in the following image.

![Dashboard showing visualizations combined in a single view]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-combined.png)

## Adding subsequent panels

To add an existing visualization to the dashboard from the preceding steps, follow these steps:

1. From the dashboard toolbar, choose **Add**.

1. From the **Add panels** dialog, choose **[eCommerce] Sales by Category**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon to close the dialog.

The **Dashboards** application adds an area chart visualization to the dashboard, as shown in the following image.

![Adding another panel to the dashboard]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-adding-panels.png)

## Saving a dashboard

When you've finalized your dashboard, save it. To save a new dashboard, follow these steps:

1. In the **Dashboards** toolbar, choose **Save**.

1. In the **Save dashboard** window, enter a **Title**.

1. (Optional) Enter a **Description**.

1. (Optional) To save the time filter to the dashboard, select **Store time with dashboard**.

1. Choose **Save**.


## Customizing the look of a panel

You can customize details of a visualization panel such as colors and legend text.

To customize the panels:

- In the **Dashboards** toolbar, choose **Edit**.

  The button changes to **Create new** to indicate that **Dashboards** is in edit mode.

  Displaying a legend can give readers more information, while hiding a legend can give the panel a cleaner look. To display or hide the panel legend:

- Choose the list icon in the panel's lower left corner.

To change a color in the panel legend, follow these steps:

1. From the visualization legend, select a category.

1. From the flyout, select a color.

    The area chart updates with your change.

    The color change is only saved for the current panel and dashboard and doesn't affect the saved visualization.
    {: .note}

To change the color of the panel legend in the visualization, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel.

1. From the **Options** menu, select **Edit visualization**.

1. From the visualization legend, select a category.

1. From the flyout, select a color.

    The area chart updates with your change.

1. From the **Visualize** toolbar, select **Save and return**.

    This color change affects the saved visualization and any dashboard that links to the visualization.

To display, hide, or customize the panel title, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel.

1. From the **Options** window, select **Edit panel title**.

1. From the **Customize panel**, enter a title under **Panel title** or toggle the **Show panel title** to hide the title.

1. Choose **Save**.

Changing panel titles only affects the particular panel on the particular dashboard and won't affect any other panel containing that same visualization or any other dashboard.
{: .note}

## Arranging panels

To organize panels, arrange them side by side, or resize them, use the following procedures.

### Moving a panel

To move a panel, follow these steps:

1. Select and hold the panel title or the top of the panel.

1. Drag the panel to the new location.

### Resizing a panel

To resize a panel, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/resize-icon.png" class="inline-icon" alt="resize icon"/>{:/} (resize) icon icon in the panel's lower-right corner.

1. Drag to the new dimensions.

### Viewing a panel in full screen mode

To view a panel in full screen mode, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel or vertical ellipsis (⋮) at the upper right of the panel.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/maximize-icon.png" class="inline-icon" alt="maximize icon"/>{:/} (maximize) **Maximize panel**.

### Minimizing a panel in full screen mode

To minimize the a panel in full screen mode, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel or vertical ellipsis (⋮) at the upper right of the panel.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/minimize-icon.png" class="inline-icon" alt="minimize icon"/>{:/} (minimize) **Minimize**.

The following image shows an example of a customized dashboard created by using this tutorial.

![Customized dashboard with panels arranged side by side and without legends]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-customized.png)
