---
layout: default
title: Quickstart guide
nav_order: 10
has_children: false
redirect_from:
  - /dashboards/get-started/quickstart-dashboards/
  - /dashboards/quickstart-dashboards/
  - /dashboards/browser-compatibility/
---

# OpenSearch Dashboards quickstart guide

This quickstart guide provides demonstrations to help you quickly explore OpenSearch Dashboards applications. You can use this guide either in your own environment or in the [OpenSearch Playground](https://playground.opensearch.org/app/home#/) to explore the following features:

- **[Adding sample data](#adding-sample-data)**: Use preloaded visualizations and dashboards to explore OpenSearch Dashboards before adding your own data.
- **[Using the Discover tool](#using-the-discover-tool)**: Run one-time data queries to gain insights.
- **[Using the Dashboards application](#using-the-dashboards-application)**: Create a collection of data visualizations.


## Prerequisites

To follow this guide, you need access to one of the following OpenSearch installations:

- Access the [OpenSearch Playground](https://playground.opensearch.org/app/home#/) online. The online OpenSearch Playground is read-only.

- Install OpenSearch and OpenSearch Dashboards images on a local machine using the  [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/).

- Choose from other installation methods. See [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

## Accessing OpenSearch Dashboards

Once the OpenSearch and OpenSearch Dashboards processes are running, view the OpenSearch Dashboards application by opening your browser and going to the dashboard URL:

- [https://playground.opensearch.org/app/home#/](https://playground.opensearch.org/app/home#/) for the OpenSearch Playground.

- [http://localhost:5601/app/home#/](http://localhost:5601/app/home#/) (without the Security plugin) or [https://localhost:5601/app/home#/](https://localhost:5601/app/home#/) (with the Security plugin) for a local installation.

The OpenSearch Dashboards default view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/home-page-nav.png" alt="OpenSearch Dashboards interface default view" width="700">

The demonstrations on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset. If you've installed a local OpenSearch Dashboards instance, [access OpenSearch Dashboards](#accessing-opensearch-dashboards) and add the sample data as described in [Adding sample data](#adding-sample-data).
{: .tip}

### Hiding the navigation panel

To enlarge the main page panel, you can undock and hide the navigation panel.

#### Undocking and hiding the navigation panel

To undock and hide the navigation panel, follow these steps:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-docked-icon.png" class="inline-icon" alt="docked icon"/>{:/} (dock) **Undock navigation** at the bottom of the navigation panel.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon or {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to the right of the menu.

#### Unhiding and docking the navigation panel

To unhide and dock the navigation panel, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} (menu) icon.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-undocked-icon.png" class="inline-icon" alt="undocked icon"/>{:/} (undock) **Dock navigation** at the bottom of the navigation panel.


## Adding sample data

If you've installed a local OpenSearch Dashboards instance, add one or more sample datasets by following these steps:

1. On the OpenSearch Dashboards home page, choose **Add sample data**. Or on any page, choose {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/add-data-icon.png" class="inline-icon" alt="add-data icon"/>{:/} (add data) **Add data** from the upper-right toolbar.

1. On the **Add sample data** page, select the **Add data** button in the **Sample flight data** tile and any others that you want to add.

    The following image shows the available sample datasets.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample.png" alt="Adding sample data window" width="700">


## Using the Discover tool

With [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), you can:

- Choose data for analysis, set a time range for that data, search the data using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Analyze your data: query and filter data, view results in a table, and examine documents.
- Create histograms to display the distribution of your data.

Follow these steps to use the **Discover** tool:

1. From the navigation panel, choose **OpenSearch Dashboards** > **Discover**.

1. On the **Discover** page, choose the index pattern `opensearch_dashboards_sample_data_flights` from the dropdown menu on the upper left.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) icon to change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from the default of **Last 15 minutes** to **Last 7 days**.

1. In the DQL search bar, enter

    ```sql
    FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60
    ```
    {% include copy.html %}

1. Select **Update**.

    Results are shown for US-bound flights delayed by 60 minutes or more.

1. Filter data by selecting {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) **Add filter** from the DQL **search bar** and then selecting a **Field**, **Operator**, and **Value** from the dropdown lists in the **Edit Filter** popover. For example, select `FlightDelayType`, **is**, and **Weather Delay**.

1. Select **Save**.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-discover.png" alt="Discover output of steps 1 through 6" width="700">


## Using the Dashboards application

The **Dashboards** application creates and stores visualizations generated from your data.

With [**Dashboards**]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/), you can:

- Display multiple data visualizations in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

Follow these steps to use the application:

1. From the navigation panel, select **OpenSearch Dashboards** > **Dashboards**. The panel displays a list of existing dashboards.

1. In the search toolbar, search for and select **[Flights] Global Flight Dashboard**.

    The panel displays a dashboard preloaded with visualizations, including charts, maps, and data tables.

1. To add other panels to the dashboard, select the **Edit** button and choose **Add** from the toolbar.

1. In the search toolbar in the **Add panels** window, enter `flights`.

1. From the narrowed list, select **[Flights] Delay Buckets**.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to exit the confirmation dialog.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) to exit the **Add panels** window.

1. Scroll down to confirm that the newly added panel is now displayed as the last panel on the dashboard.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-dash-panel.png" alt="Add panel view" width="700">

For information about visualization types, see [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/). For information about using dashboards and visualizations in **Observability**, see [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).
{: .tip}

### Filtering data in Dashboards

In **Dashboards**, you can interact with visualizations to filter data.

Using the **[Flights] Global Flight Dashboard** dashboard, follow these steps to further filter the sample flight data:

1. On the **[Flights] Airline Carrier** panel, choose **OpenSearch-Air**.

    The dashboard updates automatically, adding the filter `Carrier: OpenSearch-Air` to the upper-left filter bar, as shown in the following image.

    ![Filter data demo]({{site.url}}{{site.baseurl}}/images/dashboards/airline-carrier.gif)

1. Choose **Save** to save the dashboard.

Alternatively, you can use the dashboard toolbar to apply filters:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) in the `Carrier: OpenSearch-Air` filter in the filter bar to remove the filter.

1. In the dashboard toolbar, choose {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) **Add filter**.

1. From the **Field**, **Operator**, and **Value** dropdown lists, choose **Carrier**, **is**, and **OpenSearch-Air**, respectively.

1. Choose **Save**.

    The dashboard updates automatically.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/filter-data-dash.png" alt="Dashboards tutorial panel view" width="700">


## Next steps

- To learn more about using Dashboards to analyze data, see [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
- To learn more about data visualizations, see [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- To learn more about creating dashboards, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
- To learn more about data ingestion using OpenSearch, see [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) and [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/).
