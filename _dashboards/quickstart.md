---
layout: default
title: Quickstart guide
nav_order: 2
has_children: false
redirect_from:
   - /dashboards/quickstart-dashboards/
---

# Quickstart guide

This quickstart guide covers the core concepts that you need to understand to get started with OpenSearch Dashboards. You'll learn how to:

- Add sample data.
- Explore and inspect data.
- Visualize data.

Here's a glance at the view you see when you open the **Dashboard** or **Discover** tool.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/new-look.png" alt="Light and dark mode UI on Discover and Dashboard tools' home page" width="700">

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon"/>{:/} **Note**<br>Before you get started, make sure you've installed OpenSearch and OpenSearch Dashboards. For information about installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
{: .note}
# Adding sample data

Sample datasets come with visualizations, dashboards, and other tools to help you explore Dashboards before you add your own data. To add sample data, perform the following steps:

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`.
1. On the OpenSearch Dashboards **Home** page, choose **Add sample data**.
2. Choose **Add data** to add the datasets, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample-data.png" alt="Sample datasets" width="700">

# Exploring and inspecting data

In [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), you can: 

- Choose data to explore, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Explore the data, view individual documents, and create tables summarizing the data's contents.
- Visualize your findings.

## Try it: Getting familiar with Discover

1. On the OpenSearch Dashboards **Home** page, choose **Discover**.
1. Change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) to **Last 7 days**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/last-7--days.png" alt="Time filter interface" width="250"/>

2. Search using the DQL query `FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60` and then choose **Update**. You should see results for US-bound flights delayed by 60 minutes or more, as shown in the following image.
   
    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dql-search-field.png" alt="DQL search field example" width="700"/>

3. To filter data, choose **Add filter** and then select an **Available field**. For example, select `FlightDelayType`, **is**, and **Weather delay** from the **Field**, **Operator**, and **Value** dropdown lists, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/filter-data-discover.png" alt="Filter data by FlightDelayType field" width="250"/>

# Visualizing data

Raw data can be difficult to comprehend and use. Data visualizations help you prepare and present data in a visual form. In **Dashboard** you can:

- Display data in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

## Try it: Getting familiar with Dashboard

1. On the OpenSearch Dashboards **Home** page, choose **Dashboard**.
1. Choose **[Flights] Global Flight Data** in the **Dashboards** window, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/dashboard-flight-quickstart.png" alt="Data visualization dashboard" width="700"/>

1. To add panels to the dashboard, choose **Edit** and then **Add** from the toolbar.
1. In the **Add panels** window, choose the existing panel **[Flights] Delay Buckets**. You'll see a pop-up window on the lower right confirming that you've added the panel.
1. Select `x` to close the **Add panels** window.
1. View the added panel **[Flights] Delay Buckets**, which is added as the last panel on the dashboard, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-panel.png" alt="Add panel to dashboard" width="700"/>

## Try it: Creating a visualization panel

Continuing with the preceding dashboard, you'll create a bar chart comparing the number of canceled flights and delayed flights to delay type and then add the panel to the dashboard:

1. Change the default [time range]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from **24 hours** to **Last 7 days**. 
1. In the toolbar, choose **Edit**, then **Create new**.
1. Select **VisBuilder** in the **New Visualizations** window.
1. In the **Data Source** dropdown list, choose `opensearch_dashboards_sample_data_flights`.
1. Drag the fields **Cancelled** and **FlightDelay** to the y-axis column.
1. Drag the field **FlightDelayType** to the x-axis column.
1. Choose **Save** and name the visualization in the **Title** field.
2. Choose **Save and return**. The following bar chart is added as the last panel on the dashboard, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/viz-panel-quickstart.png" alt="Creating a visualization panel" width="700"/>

# Interacting with data

Interactive dashboards allow you analyze data in more depth and filter it in several ways. In Dashboards, you can interact directly with data on a dashboard by using dashboard-level filters. For example, continuing with the preceding dashboard, you can filter to show delays and cancellations for a specific airline.

## Try it: Interacting with the sample flight data

1. On the **[Flights] Airline Carrier** panel, choose **OpenSearch-Air**. The dashboard updates automatically.
1. Choose **Save** to save the customized dashboard.

Alternatively, you can apply filters using the dashboard toolbar:

1. In the dashboard toolbar, choose **Add filter**.
1. From the **Field**, **Operator**, and **Value** dropdown lists, choose **Carrier**, **is**, and **OpenSearch-Air**, respectively, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/edit-filter.png" alt="Edit field interface" width="400"/>

1. Choose **Save**. The dashboard updates automatically, and the result is the dashboard shown in the following image.

  <img src="{{site.url}}{{site.baseurl}}/images/interact-filter-dashboard.png" alt="Dashboard view after applying Carrier filter" width="700"/>

# Next steps

- **Visualize data**. To learn more about data visualizations in OpenSearch Dashboards, see [**Building data visualizations**]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- **Create dashboards**. To learn more about creating dashboards in OpenSearch Dashboards, see [**Creating dashboards**]({{site.url}}{{site.baseurl}}/dashboards/quickstart-dashboards/).
- **Explore data**. To learn more about exploring data in OpenSearch Dashboards, see [**Exploring data**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/). 