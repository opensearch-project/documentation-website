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

>This documentation uses the following terms:
>- _OpenSearch Dashboards_: The web UI for OpenSearch.
>- **Dashboards** application: The application within OpenSearch Dashboards for creating dashboards.
>- _dashboard_ (lowercase): An individual collection of data visualizations created in the **Dashboards** application.
>- A _data visualization_ or _visualization_ is a single pane in the UI containing a graph, chart, or other visual representation of data.
>- A _search_ is a panel containing a saved data set constructed in the Discover application.
>- A _panel_ is a pane in a dashboard that contains a single visualization or search.
{: .note}

Dashboards typically contain visualizations, but can also contain searches.

A dashboard shows one or more panels, usually arranged to support a business goal such as operations, decision support, or observability. A dashboard can contain any number of panels, subject only to display and legibility constraints.

This page describes how to use **Dashboards** to create, modify, and save dashboards.


## Navigating the UI

The following components make up the **Dashboards** UI.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dashboard-UI-blank-callouts.png" alt="Discover app default page">

- The _application menu_ (A) contains application options. This menu is context-sensitive and is different for other applications.
- The _search_ bar (B) enables selection of data using a query language search.
- The _time filter_ (C) enables selection of data based on a time and date range.
- The _filter_ (D) provides a graphical interface for selecting data values and ranges.
- The _application panel_ (E) displays the dashboard, which contains visualization and search panels.


## Prerequisites

Before using the **Dashboards** tool, ensure that you:

- Install OpenSearch Dashboards. See [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

  The Dashboards examples and tutorials assume you're using an existing installation of OpenSearch Dashboards. You can also do the tutorials using preinstalled sample data in the [OpenSearch Playground](https://playground.opensearch.org/app/home#/). You cannot save your changes in OpenSearch Playground.
  {: .note}

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

- Know how to use the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/), [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/), and [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

- Understand OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).


## Creating a dashboard

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

- Create a dashboard for real-time data using OpenSearch Dashboard's observability features. See [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).
