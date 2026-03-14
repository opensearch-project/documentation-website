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

This quickstart guide provides demonstrations to help you quickly explore essential OpenSearch Dashboards applications. You can use this guide, either in your own environment or on [OpenSearch Playground](https://playground.opensearch.org/app/home#/), to explore the following features:

- **Adding sample data**: Use preloaded visualizations and dashboards to explore OpenSearch Dashboards before adding your own data.
- **Using the Discover application**: Perform ad hoc data queries to gain insights.
- **Using the Dashboards application**: Create a collection of data visualizations.
- **Customizing the appearance theme**: Quickly change the OpenSearch Dashboards appearance theme from the home page.


## Prerequisites

Gain access to an Opensearch installation. You can:

- Access the [OpenSearch Playground](https://playground.opensearch.org/app/home#/) online. The online OpenSearch Playground is read-only.

- Install OpenSearch and OpenSearch Dashboards images on a local machine using the  [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/).

- Choose from other installation methods. See [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

The demonstrations on this page use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset. If you've installed a local OpenSearch Dashboards instance, add the sample data as described in [Adding sample data](#adding-sample-data) once you've opened the UI.


## Viewing the UI

Once the OpenSearch and OpenSearch Dashboards processes are running, view the OpenSearch Dashboards application by opening your browser and going to the dashboard URL:

- <https://playground.opensearch.org/app/home#/> for the OpenSearch Playground.

- <http://localhost:5601/app/home#/> for a local installation.

The OpenSearch Dashboards default view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/home-page-nav.png" alt="OpenSearch Dashboards interface default view" width="700">



### Hiding the navigation menu

You can undock and hide the **navigation menu** to enlarge the main page **panel**.

#### Undocking and hiding the navigation menu

To undock and hide the navigation menu:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-docked-icon.png" class="inline-icon" alt="docked icon"/>{:/} **Undock navigation** at the bottom of the **navigation menu**.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} icon or `x` to the right of the menu.

#### Unhiding and docking the navigation menu

To unhide and dock the **navigation menu**:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} icon.

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/nav-undocked-icon.png" class="inline-icon" alt="undocked icon"/>{:/} **Dock navigation** at the bottom of the **navigation menu**.


## Adding sample data

If you've installed a local OpenSearch Dashboards instance, add one or more sample datasets:

1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**, or choose **Add data** from the upper-right toolbar.

1. On the **Add sample data** page, select the **Add data** button in the **Sample flight data** tile and any others that you want to add.

    The following image shows the available sample datasets.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample.png" alt="Adding sample data window" width="700">


## Using the Discover tool

With [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), you can:

- Choose data for analysis, set a time range for that data, search the data using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results
- Analyze your data by querying and filtering, viewing results in a table, and examining documents
- Create histograms to display the distribution of your data

Follow these steps to use the Discover tool:

1. From the **navigation menu**, choose **OpenSearch Dashboards** > **Discover**.

1. On the **Discover** page, choose the index pattern `opensearch_dashboards_sample_data_flights` from the dropdown menu on the upper left.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) icon to change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from the default of **Last 15 minutes** to **Last 7 days**.

1. In the DQL **search bar**, enter

    ```sql
    FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60
    ```
    {% include copy.html %}

1. Select **Update**.

    Results are shown for US-bound flights delayed by 60 minutes or more.

1. Filter data by selecting **Add filter** from the DQL **search bar** and then selecting a **Field**, **Operator**, and **Value** from the dropdown lists in the **Edit Filter** pop-up window. For example, select `FlightDelayType`, **is**, and **Weather Delay**.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-discover.png" alt="Discover output of steps 1 through 6" width="700">


## Using the Dashboards application

With [**Dashboards**]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/), you can:

- Display multiple data visualizations in a single view
- Build dynamic dashboards
- Create and share reports
- Embed analytics to differentiate your applications

The **Dashboards** application creates and stores visualizations generated from your data. Follow these steps to use the application:

1. From the **navigation menu**, select **OpenSearch Dashboards** > **Dashboards**. The **panel** displays a list of existing dashboards.
1. In the **search toolbar**, search for and select **[Flights] Global Flight Dashboard**. 

    The **panel** displays a dashboard preloaded with visualizations, including charts, maps, and data tables.

1. To add other panels to the dashboard, select the **Edit** button and choose **Add** from the toolbar.

1. In the search toolbar in the **Add panels** window, enter `flights`.

1. From the narrowed list, select **[Flights] Delay Buckets**.

1. Select `x` to exit the confirmation dialog.

1. Select `x` to exit the **Add panels** window.

1. Scroll down to confirm that the newly added panel is now displayed as the last panel on the dashboard.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-dash-panel.png" alt="Add panel view" width="700">

For information about visualization types, go to [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/). For information about using dashboards and visualizations in **Observability**, go to [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).
{: .note}

### Interacting with data using dashboards

In **Dashboards**, you can interact with visualizations to filter data and analyze data in more depth.

Using the **[Flights] Global Flight Dashboard** dashboard, follow these steps to further analyze and filter the sample flight data:

1. On the **[Flights] Airline Carrier** panel, choose **OpenSearch-Air**. 

    The dashboard updates automatically, adding the filter `Carrier: OpenSearch-Air` to the upper-left **filter bar**. The following GIF illustrates this step.

    ![Filter data demo]({{site.url}}{{site.baseurl}}/images/dashboards/airline-carrier.gif)

1. Choose **Save** to save the dashboard.

This is the same as if you had used the **dashboard toolbar** to apply filters. To demonstrate this do the following:

1. Click `x` in the filter `Carrier: OpenSearch-Air` in the **filter bar** to remove the filter.

1. In the **dashboard toolbar**, choose **Add filter**.

1. From the **Field**, **Operator**, and **Value** dropdown lists, choose **Carrier**, **is**, and **OpenSearch-Air**, respectively.

1. Choose **Save**. 

    The dashboard updates automatically.

    The resulting view is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/filter-data-dash.png" alt="Dashboards tutorial panel view" width="700">


## Next steps

- Go to [Analyzing data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) to learn more about using Dashboards to analyze data.
- Go to [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/) to learn more about data visualizations.
- Go to [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/) to learn more about creating dashboards.
- Go to [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) and [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) to learn more about data ingestion using OpenSearch.
