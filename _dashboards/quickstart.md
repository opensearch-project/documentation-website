---
layout: default
title: OpenSearch Dashboards quickstart guide
nav_order: 2
has_children: false
redirect_from:
   - /dashboards/quickstart-dashboards/
canonical_url: https://docs.opensearch.org/latest/dashboards/quickstart/
---

# OpenSearch Dashboards quickstart guide

This quickstart guide provides tutorials on using OpenSearch Dashboards applications and tools. You can use these tutorials, either in your own environment or on [OpenSearch Playground](https://playground.opensearch.org/app/home#/), to learn the following fundamental concepts:

- **Adding sample data:** Use preloaded visualizations, dashboards, and other tools to explore OpenSearch Dashboards before adding your own data.
- **Using the Discover application:** Analyze your data to gain insights.
- **Using the Dashboards application:** Create and store data visualizations.
- **Turning dark mode on or off:** Change the Dashboards theme.

To dock or undock the navigation pane, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/menu-icon.png" class="inline-icon" alt="menu icon"/>{:/} icon and then **Dock navigation** or **Undock navigation**. The OpenSearch Dashboards home page is shown in the following image.  

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-home.png" alt="OpenSearch Dashboards home page" width="700">

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon"/>{:/} **Note**<br>Before you get started, make sure you've installed OpenSearch and OpenSearch Dashboards. For information about installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
{: .note}

## Adding sample data

The following tutorials use the [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset.
{: .note}

To add sample data, follow these steps:

1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**. Alternatively, choose **Add data** on the upper-right toolbar.
2. On the **Add sample data** page, choose the dataset(s) you want to add to Dashboards. The following image shows the available sample datasets.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample-data-2.png" alt="Adding sample data window" width="700">

## Using the Discover application 

With [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), you can: 

- Choose data for analysis, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Analyze your data by querying and filtering, viewing results in a table, and examining documents.
- Create histograms to display the distribution of your data.

Follow these steps to use the Discover tool:

1. From the OpenSearch Dashboards navigation menu, choose **Discover**. 
2. On the **Discover** page, choose the index pattern `opensearch_dashboards_sample_data_flights` from the dropdown menu on the upper left. 
3. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} icon to change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from the default of **Last 15 minutes** to **Last 7 days**.
4. In the DQL search bar, enter `FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60` and select **Update**. Results are shown for US-bound flights delayed by 60 minutes or more.
5. Filter data by selecting **Add filter** from the DQL search bar and then selecting a **Field**, **Operator**, and **Value** from the dropdown lists in the **Edit Filter** pop-up window. For example, select `FlightDelayType`, **is**, and **Weather Delay**.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/opensearch-dashboards-discover.png" alt="Discover output of steps 1 through 6" width="700">

## Using the Dashboards application

With **Dashboards**, you can:

- Display data in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

The **Dashboards** application creates and stores visualizations generated from your data. Follow these steps to use the application:

1. On the OpenSearch Dashboards **Home** page, choose **Dashboards**. A list of dashboards generated from the sample data appears.
2. In the search toolbar, search for and select **[Flights] Global Flight Dashboard**. You'll see a dashboard preloaded with visualizations, including charts, maps, and data tables. 
3. To add other panels to the dashboard, select the **Edit** button and then choose **Add** from the toolbar. The **Add panels** window opens. 
4. In the search toolbar in the **Add panels** window, search for and select the existing panel **[Flights] Delay Buckets**. A pop-up message confirms that you've added the panel.
5. Select close `x` to exit the **Add panels** window.
6. The newly added panel is now displayed on the dashboard.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-panel2.png" alt="Add panel tutorial screen view" width="700">

For information about using a specific data visualization type, such as VisBuilder, go to [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/). For information about using dashboards and visualizations in **Observability**, go to [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/).
{: .note}

### Interacting with data using dashboards

Interactive dashboards allow you to analyze data in more depth and filter it in several ways. With **Dashboards**, you can use dashboard-level filters to directly interact with data.

Using the **[Flights] Global Flight Dashboard** dashboard, follow these steps to further analyze and filter the sample flight data:

1. On the **[Flights] Airline Carrier** panel, choose **OpenSearch-Air**. The dashboard updates automatically.
2. Choose **Save** to save the dashboard.

Alternatively, you can use the dashboard toolbar to apply filters by following these steps:

1. In the dashboard toolbar, choose **Add filter**.
2. From the **Field**, **Operator**, and **Value** dropdown lists, choose **Carrier**, **is**, and **OpenSearch-Air**, respectively, as shown in the following image.
3. Choose **Save**. The dashboard updates automatically.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}//images/<insert image>" alt="Screenshot of Dashboard tutorial panel view" width="700">

## Turning dark mode on or off

Changing the Dashboards theme requires admin permissions. If you are an admin, follow these steps:

1. Navigate to **Management** > **Dashboards Management** > **Advanced Settings**.
2. Scroll down to the **Appearance** section and locate the **Dark mode** option.
3. Use the toggle switch to turn dark mode on or off for all users of your Dashboards instance, as shown in the image following these steps.
4. Select the **Save changes** button and then the **Reload** button. The updated theme is applied immediately.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dark-mode.png" alt="Dark mode view" width="700">

## Next steps

- Go to [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/) to learn more about Dashboards data visualizations.
- Go to [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/quickstart-dashboards/) to learn more about creating dashboards.
- Go to [Analyzing data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) to learn more about using Dashboards to analyze data. 
- Go to [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) and [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) to learn more about using OpenSearch for data ingestion.
