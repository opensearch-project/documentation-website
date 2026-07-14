---
layout: default
title: Creating visualizations in the Visualize application
nav_order: 40
parent: Building data visualizations
grand_parent: OpenSearch Dashboards
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualize-app/
  - /dashboards/visualize/viz-index/
---

# Creating visualizations in the Visualize application

The **Visualize** application uses a point-and-click interface to create data visualizations from aggregations. You select a visualization type, configure metrics and buckets, and adjust display settings to build charts, tables, maps, and other visual representations of your data.

## Prerequisites

The examples on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset that is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you've installed a local OpenSearch Dashboards instance, add the sample data by following these steps:

1. On the OpenSearch Dashboards home page, select **Add sample data**.
2. In the **Sample flight data** panel, select **Add data**.

For more information, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

To use your own data, you need an index pattern. See [Setting up your data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/).

## Navigating the Visualize UI

The following image shows the main components of the **Visualize** application.

![Visualize application interface]({{site.url}}{{site.baseurl}}/images/dashboards/viz-app-panel-callouts.png)

- The _search bar_ (A) enables selection of data using a query language search. See [Using the search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/).
- The _time filter_ (B) provides a graphical interface for selecting data values and ranges. See [Using the time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
- The _filter tool_ (C) contains frequently used commands and shortcuts. See [Using the filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).
- The _visualization panel_ (D) displays the visualization.
- The _configuration panel_ (E) contains all the controls to select and configure the visualization. Its contents depend on the visualization type. See [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

## Creating a visualization

To create a visualization, follow these steps:

1. In the left navigation menu, select **OpenSearch Dashboards** > **Visualize**.

   The application displays the **Visualizations** list, a table of saved visualizations.

1. In the upper-right corner, select **Create visualization**.

   The application displays the **New Visualization** dialog, as shown in the following image.

   ![New visualization dialog]({{site.url}}{{site.baseurl}}/images/dashboards/new-viz-dialog.png){: width=500 }

1. Select a visualization type by choosing its icon. For help choosing a type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).

1. If prompted, select an index pattern in the **Choose a source** dialog. Not all visualization types display this dialog. For examples of creating each visualization type, see the individual visualization type pages.
   
   The default visualization shows a single value, the document count, for the current dataset.

   If the visualization shows no data, or a count different than expected, verify that the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/), [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/), and especially the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) are not filtering out the missing documents.
   {: .tip}

1. Configure the visualization. For more information, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/) or the individual visualization type pages. For a complete example, see [Explore the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-visualize/).

## Other ways to start creating a visualization

In addition to the **Visualize** application, you can start creating a new visualization from the following locations:

- To create a visualization from a [workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/) (if workspaces are enabled), follow these steps:

    1. On the home page, select or create a [workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/).
    1. In the left navigation menu, expand **Visualize and report** and select **Visualizations**.
    1. Select **Create new visualization**.

- To create a visualization from a dashboard, follow these steps:

    1. In the left navigation menu, select **OpenSearch Dashboards** > **Dashboards**.
    1. Open an existing dashboard or create a new one.
    1. Select **Edit**.
    1. Select **Create new** in the toolbar, or select **Add** (or the plus icon) and then select **Create new** in the **Add panels** dialog.

    When you create a visualization from a dashboard, it is automatically added to that dashboard when you save.
    {: .note}

## Saving a visualization

Your visualization remains in the **Visualize** application if you leave the application. However, if you select the **Visualize** application again without saving the visualization, changes to the visualization are lost. We recommend always saving your visualization before you leave the **Visualize** application.
{: .warning}

### Saving a new visualization

To save a new visualization, follow these steps:

1. Select **Save** in the upper right of the **Create** panel.

   The application displays the **Save visualization** dialog.

1. Enter a title for the visualization in the **Title** box.

1. (Optional) Enter a **Description**.

1. Select **Save**.

### Saving an existing visualization

You can save a visualization at any time, as often as you like.

To save an existing visualization, follow these steps:

1. Select **Save** in the upper right of the **Create** panel.

   If you have previously saved the visualization, the **Save visualization** **Title** box contains the visualization title.

1. (Optional) To change the visualization name, enter a new title for the visualization in the **Title** box.

1. (Optional) Update the **Description**.

1. (Optional) To leave the saved visualization in its current state and save the changes as a new visualization, select **Save as new visualization**.

   Saving an existing visualization without selecting **Save as new visualization** overwrites the previous state of the visualization, even if you've renamed the visualization.
   {: .warning}

1. To save the current changes, select the **Save** button.

## Adding a visualization to a dashboard

To add a saved visualization to a dashboard, follow these steps:

1. Open a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
1. Select **Edit**.
1. Select **Add** or the plus icon in the toolbar. If prompted, select **From library**.
1. Select the saved visualization from the list.

The visualization appears as a panel on the dashboard. You can resize, reposition, and configure it alongside other panels.

## Try it

For a hands-on walkthrough of creating a line chart with sample data, see [Explore the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-visualize/).

## Next steps

- To learn how to create various visualizations using sample data, see [Creating aggregation-based visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/aggregation-based-viz/).
- For help choosing a visualization type, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/). 
- To learn about adding visualizations to dashboards, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
