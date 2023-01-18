---
layout: default
title: Quickstart for OpenSearch Dashboards
nav_order: 20
has_children: false
---

# Quickstart for OpenSearch Dashboards

This quickstart covers the core concepts for you to get started with OpenSearch Dashboards. You'll learn how to:

- Add sample data
- Explore and inspect data with **Discover**
- Visualize data with **Dashboard**

Before you get started, make sure you've installed OpenSearch and OpenSearch Dashboards. For information on installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
{: .note}

# Add sample data

Sample data sets come with visualizations, dashboards, and more to help you explore OpenSearch Dashboards before you add your own data. To add sample data, perform the following steps:

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`.
1. On the OpenSearch Dashboards **Home** page, select **Add sample data**.
1. Select **Add data** to add the data sets.

![Sample data sets]({{site.url}}{{site.baseurl}}/images/add-sample-data.png)

# Explore and inspect data

In [**Discover**](discover/index.md), you can: 

- Select data to explore, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Explore the data's details, view individual documents, and create tables summarizing the data's contents.
- Visualize your findings.

## Try it: Get familiar with Discover

1. On the OpenSearch Dashboards **Home** page, select **Discover.**
1. Change the [time filter](time-filter.md) to **Last 7 days**.
![Time filter interface]({{site.url}}{{site.baseurl}}/images/last-7--days.png)
1. To view US-bound flights delayed 60 minutes or longer in a specific region, use the DQL search field:
`FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60`
1. To filter data by delay type, select the field under **Available field**.
![Filter data interface]({{site.url}}{{site.baseurl}}/images/filter-data.png)

# Visualize the data

Raw data can be hard to comprehend and use, and data visualizations help you prepare and present data in a visual form. In **Dashboard** you can:

- Display data in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

## Try it: Get familiar with Dashboard

1. On the OpenSearch Dashboards **Home** page, select **Dashboard**.
1. Select **[Flights] Global Flight Data** in the **Dashboards** window.
![Data visualization dashboard]({{site.url}}{{site.baseurl}}/images/dashboard-flight-quickstart.png)

## Try it: Create a visualization panel

Continuing with the preceding dashboard, you'll create a bar chart comparing the number of cancelled flights and delayed flights to delay type, and then add the panel to the dashboard.

1. Change the default [time range](time-filter.md) from **24 hours** to **Last 7 days**. 
1. In the toolbar, select **Edit**, then **Create new**.
1. Select **VisBuilder** in the **New Visualizations** window.
1. In the **Data Source** dropdown list, select `opensearch_dashboards_sample_data_flights`.
1. Drag the fields **Cancelled** and **FlightDelay** to the y-axis column.
1. Drag the field **FlightDelayType** to the x-axis column.
1. Select **Save** and name the visualization in the **Title** field.
1. Select *Save and return**. The bar chart is added as the last panel to the dashboard. 
![Bar chart visualization panel]({{site.url}}{{site.baseurl}}/images/viz-panel-quickstart.png)
