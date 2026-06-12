---
layout: default
title: Creating visualizations in the Visualize application
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualize-app/
  - /dashboards/visualize/viz-index/
---

# Creating visualizations in the Visualize application

The **Visualize** application uses a point-and-click interface to create data visualizations from aggregations. You select a visualization type, configure metrics and buckets, and adjust display settings to build charts, tables, maps, and other visual representations of your data.

## Prerequisites

The following background knowledge is helpful:

- Familiarity with OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).
- Familiarity with the **[Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/)** application for exploring data.

Before creating a visualization, complete the following setup steps.

### Install sample data (optional)

The examples in this documentation use the **Sample flight data** dataset. To install sample data, follow these steps:

1. On the OpenSearch Dashboards home page, select **Add sample data**.
2. In the **Sample flight data** panel, select **Add data**.

For more information, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data).

### Create an index pattern

The **Visualize** application requires an index pattern. To create an index pattern, follow these steps:

1. Go to **Index patterns** (under **Management**).
2. Select **Create index pattern**.
3. Enter the index name.
4. Select **Next step**.
5. Select a time field.
6. Select **Create index pattern**.

For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

## Navigating the Visualize UI

The following image shows the main components of the **Visualize** application.

![Visualize application interface]({{site.url}}{{site.baseurl}}/images/dashboards/viz-app-panel-callouts.png)

- The _search bar_ (A) enables selection of data using a query language search. See [Using the search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/).
- The _time filter_ (B) provides a graphical interface for selecting data values and ranges.  See [Using the time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
- The _filter tool_ (C) contains frequently used commands and shortcuts. See [Using the filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).
- The _visualization panel_ (D) displays the visualization.
- The _configuration panel_ (E) contains all the controls to select and configure the visualization. Its contents depend on the visualization type. See [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/).

## Key terms

The configuration panel uses the following terms:

- An _index pattern_ is a view into one or more indexes in OpenSearch. The terms _data set_ and _data source_ refer to the data exposed by a single index pattern. For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).
- A _field_ is a typed value contained in a data set, the equivalent of a table column in a relational database.
- A _bucket_ is a grouping of field values based on an aggregation. Buckets can be categorical (based on text values), range-based (user-defined numeric ranges), histogram-based (automatically sized numeric intervals), or time-based (segments of a timestamp field).

## Creating a visualization

To create a visualization, follow these steps:

1. In the left navigation menu, select **OpenSearch Dashboards** > **Visualize**.

   The application displays the **Visualizations** list, a table of saved visualizations.

1. In the upper-right corner, select **Create visualization**.

   The application displays the **New Visualization** dialog, as shown in the following image.

   ![New visualization dialog]({{site.url}}{{site.baseurl}}/images/dashboards/new-viz-dialog.png){: width=500 }

1. Select a visualization type by choosing its icon. For help choosing a type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).

1. If prompted, select an index pattern in the **Choose a source** dialog. Not all visualization types display this dialog. For examples of creating each visualization type, see the individual visualization type pages.
   
   The default visualization shows a single value, the document count, for the current data set.

   If the visualization shows no data, or a count different than expected, verify that the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/), [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/), and especially the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) are not filtering out the missing documents.
   {: .tip}

1. Configure the visualization. For more information, see [Configuring visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/configuring-viz/) or the individual visualization type pages. For a complete example, see [Try it: Create a line chart with sample data](#try-it-create-a-line-chart-with-sample-data).

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

## Try it: Create a line chart with sample data

This example walks through the complete workflow using a line chart that shows flight count over time.

1. [Install sample data](#install-sample-data-optional): Select **Add data** for **Sample flight data**.
2. [Create an index pattern](#create-an-index-pattern): Enter `opensearch_dashboards_sample_data_flights` as the index name and select `timestamp` as the time field.
3. In the **Visualize** application, select **Create visualization**.
4. In the **New Visualization** dialog, select **Line**.
5. In the **Choose a source** dialog, select **opensearch_dashboards_sample_data_flights**.
6. Set the time filter to **Last 7 days**.
7. Under **Buckets**, select **Add** > **X-axis**.
8. Set **Aggregation** to **Date Histogram** and **Field** to **timestamp**.
9. Select **Update**. The chart displays flight count per time interval, as shown in the following image.

   ![Line chart showing flight count over time]({{site.url}}{{site.baseurl}}/images/dashboards/visualize-app-line-chart-example.png)

10. From the toolbar, select **Save**.
11. In the **Save visualization** dialog, enter `Flight count over time` as the title.
12. Select **Save**.

The visualization is saved and appears in the **Visualizations** list. To add it to a dashboard, see [Adding a visualization to a dashboard](#adding-a-visualization-to-a-dashboard).

## Next steps

- For help choosing a visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/). 
- To learn about adding visualizations to dashboards, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
- Many of the visualization UI elements and tools are identical among the visualization types, so familiarity with one type will help you create others. To take a methodical tutorial approach, starting with basic visualization elements and building on previous learning, try these tutorials in order:
  1. [Markdown visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/markdown/)
  1. [Metric visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/metric/)
  1. [Data tables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/data-table/)
  1. [Bar charts]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/bar-charts/)
