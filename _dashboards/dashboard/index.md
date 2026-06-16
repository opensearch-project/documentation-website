---
layout: default
title: Creating dashboards
nav_order: 40
has_children: true
redirect_from:
  - /dashboards/dashboard/
---

# Creating dashboards

You can use the **Dashboards** application in OpenSearch Dashboards to build a dashboard, a page containing multiple panels showing different views of your data.

For terminology definitions, see [Concepts]({{site.url}}{{site.baseurl}}/dashboards/getting-started/concepts/).
{: .note}

Dashboards typically contain visualizations, but can also contain searches.

A dashboard shows one or more panels, usually arranged to support a business goal such as operations, decision support, or observability. A dashboard can contain any number of panels, subject only to display and legibility constraints.

This page describes how to use **Dashboards** to create, modify, and save dashboards.


## Prerequisites

The tutorials on this page use the [**Sample eCommerce data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset that is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you've installed a local OpenSearch Dashboards instance, add the sample data by following these steps:

1. On the OpenSearch Dashboards home page, select **Add sample data**.
2. In the **Sample eCommerce data** panel, select **Add data**.

For more information, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Navigating the Dashboards UI

The following image shows the main components of the **Dashboards** application.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dashboard-UI-blank-callouts.png" alt="Dashboards app default page">

- The _application menu_ (A) contains application options. This menu is context-sensitive and is different for other applications.
- The _search_ bar (B) enables selection of data using a query language search.
- The _time filter_ (C) enables selection of data based on a time and date range.
- The _filter_ (D) provides a graphical interface for selecting data values and ranges.
- The _application panel_ (E) displays the dashboard, which contains visualization and search panels.

## Creating a dashboard and adding an existing visualization

The procedure for creating a dashboard is as follows:

1. Open a dashboard. You can start with a new (empty) dashboard, modify an existing dashboard, or clone an existing dashboard as a starting point for a similar dashboard. See [Opening a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/opening-a-dashboard/).

1. Ensure that the data filters include the data you want to work on. This typically, but not always, means setting the time filter to include a range of timestamps. See [Selecting a time range]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/#selecting-a-time-range).

   OpenSearch applications, including Dashboards, Visualize, and Discover, apply filters to all data in the application. The filter is applied to all index patterns used in the dashboard. For example, a time filter applied to a log monitoring dashboard selects the documents from all log visualizations on that dashboard, even if they include documents from different index patterns. See [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).
   {: .note}

1. Add panels to the dashboard. You can select saved panels or create new visualization within the **Dashboards** application. See [Adding a visualization to a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/adding-a-viz/).

1. Arrange and resize panels on the dashboard. See [Customizing a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/customizing-a-dash/).

1. Save the completed (or work-in-progress) dashboard. See [Saving a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/managing-a-dash/#saving-a-dashboard).


## Next steps

- Learn to create a dashboard using sample data by taking the tutorial. See [Tutorial: creating a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dash-tutorial/).

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

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/resize-icon.png" class="inline-icon" alt="resize icon"/>{:/} (resize) icon in the panel's lower-right corner.

1. Drag to the new dimensions.

### Viewing a panel in full screen mode

To view a panel in full screen mode, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel or vertical ellipsis (⋮) at the upper right of the panel.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/maximize-icon.png" class="inline-icon" alt="maximize icon"/>{:/} (maximize) **Maximize panel**.

### Minimizing a panel in full screen mode

To minimize a panel in full screen mode, follow these steps:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon on the area chart panel or vertical ellipsis (⋮) at the upper right of the panel.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/minimize-icon.png" class="inline-icon" alt="minimize icon"/>{:/} (minimize) **Minimize**.

The following image shows an example of a customized dashboard created by using this tutorial.

![Customized dashboard with panels arranged side by side and without legends]({{site.url}}{{site.baseurl}}/images/dashboards/dashboard-customized.png)
