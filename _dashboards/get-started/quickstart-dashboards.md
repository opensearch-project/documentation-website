---
layout: default
title: Quickstart for OpenSearch Dashboards
nav_order: 20
has_children: false
---

# Quickstart for OpenSearch Dashboards

This quickstart covers the core concepts for getting started with OpenSearch Dashboards. You'll learn how to:

- Add sample data.
- Explore and inspect data with **Discover**.
- Visualize data with **Dashboard**.

Before you get started, make sure you've installed OpenSearch and OpenSearch Dashboards. For information on installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
{: .note}

# Adding sample data

Sample datasets come with visualizations, dashboards, and other tools to help you explore Dashboards before you add your own data. To add sample data, perform the following steps:

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`.
1. On the OpenSearch Dashboards **Home** page, select **Add sample data**.
1. Select **Add data** to add the datasets.

    <img src="{{site.url}}{{site.baseurl}}/images/add-sample-data.png" alt="Sample data sets" width="800">

# Exploring and inspecting data

In [**Discover**](discover/index.md), you can: 

- Select data to explore, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Explore the data's details, view individual documents, and create tables summarizing the data's contents.
- Visualize your findings.

## Try it: Getting familiar with Discover

1. On the OpenSearch Dashboards **Home** page, select **Discover**.
1. Change the [time filter](time-filter.md) to **Last 7 days**.

    <img src="{{site.url}}{{site.baseurl}}/images/last-7--days.png" alt="Time filter interface" width="400"/>

1. To view US-bound flights delayed 60 minutes or longer in a specific region, use the DQL search field:

    `FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60`.

1. To filter data by delay type, select the field under **Available fields**.

    <img src="{{site.url}}{{site.baseurl}}/images/filter-data.png" alt="Filter filter by Available fields" width="300"/>

# Visualizing data

Raw data can be hard to comprehend and use. Data visualizations help you prepare and present data in a visual form. In **Dashboard** you can:

- Display data in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

## Try it: Getting familiar with Dashboard

1. On the OpenSearch Dashboards **Home** page, select **Dashboard**.
1. Select **[Flights] Global Flight Data** in the **Dashboards** window.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboard-flight-quickstart.png" alt="Data visualization dashboard" width="800"/>

1. To add panels to the dashboard, select **Edit** and then **Add** from the toolbar.
1. In the **Add panels** window, select the existing panel **[Flights] Delay Buckets**. You'll see a pop-up window in the bottom right confirming you've added the panel.
1. Select `x` to close the Add panels window.
1. View the added panel **[Flights] Delay Buckets**, which is added as the last panel on the dashboard.

    <img src="{{site.url}}{{site.baseurl}}/images/add-panel.png" alt="Add panel to dashboard" width="600"/>

## Try it: Creating a visualization panel

Continuing with the preceding dashboard, you'll create a bar chart comparing the number of cancelled flights and delayed flights to delay type, and then add the panel to the dashboard.

1. Change the default [time range]({{site.url}}{{site.baseurl}}/dashboards/get-started/time-filter/) from **24 hours** to **Last 7 days**. 
1. In the toolbar, select **Edit**, then **Create new**.
1. Select **VisBuilder** in the **New Visualizations** window.
1. In the **Data Source** dropdown list, select `opensearch_dashboards_sample_data_flights`.
1. Drag the fields **Cancelled** and **FlightDelay** to the y-axis column.
1. Drag the field **FlightDelayType** to the x-axis column.
1. Select **Save** and name the visualization in the **Title** field.
1. Select **Save and return**. The bar chart is added as the last panel to the dashboard.

<img src="{{site.url}}{{site.baseurl}}/images/viz-panel-quickstart.png" alt="Creating a visualization panel" width="500"/>

# Interacting with data

Interactive dashboards allow you analyze data more deeply and filter it several ways. In Dashboards, you can interact directly with data on a dashboard by using dashboard-level filters. For example, continuing with the preceding dashboard, you can filter to show delays and cancellations for a specific airline.

## Try it: Interacting with the sample flight data

1. On the **[Flights] Airline Carrier** panel, select **OpenSearch-Air**. The dashboard updates automatically.
1. Select **Save** to save the customized dashboard.

Alternatively, you can apply filters using the dashboard toolbar:

1. In the dashboard toolbar, select **Add filter**.
1. From the **Field**, **Operator**, and **Value** dropdown lists, select **Carrier**, **is**, and **OpenSearch-Air**, respectively.

    <img src="{{site.url}}{{site.baseurl}}/images/edit-filter.png" alt="Edit field interface" width="400"/>

1. Select **Save**. The dashboard updates automatically.

The result is the following dashboard: 

  <img src="{{site.url}}{{site.baseurl}}/images/interact-filter-dashboard.png" alt="Dashboard view after applying Carrier filter" width="800"/>

# Taking the next steps

**Visualize data**. Learn more about data visualizations in OpenSearch Dashboards. Go to [**Visualize**]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).

**Create dashboards.** Learn more about visualizing data in OpenSearch Dashboards. Go to [**Dashboard**](add link-content in development).

**Explore data**. Learn more about exploring data in OpenSearch Dashboards. Go to [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/). 