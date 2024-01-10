---
layout: default
title: OpenSearch Dashboards quickstart
nav_order: 2
has_children: false
redirect_from:
   - /dashboards/quickstart-dashboards/
---

# OpenSearch Dashboards quickstart

This quickstart covers the core concepts that you need to understand to get started with OpenSearch Dashboards. You'll learn how to:

- Add sample data.
- Explore and interact with data.
- Visualize data.

Starting with OpenSearch 2.12, you'll see the following homepage view. This redesign considers the OpenSearch community's feedback about simplifying the dashboard experience. Share your [feedback](<insert-link-feedback-dashboards>) about this update or other tools you want to see in OpenSearch Dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dashboards-home.png" alt="Screenshot of OpenSearch Dashboards homepage" width="700">

## What's new

Here's what's new with the homepage:

- **Enhanced user experience:** Improves your experience by incorporating intuitive navigation, streamlined workflows, and a visually appealing interface. 
- **Optimized data accessibility:** Presents critical information in a more effective manner, making it easier for you to interpret and analyze data.
- **Responsive design for multi-platform access:** Prioritizes responsive design principles, ensuring seamless access and functionality across various devices and screen sizes. 
- **Integration of advanced visualizations:** Enhances your data comprehension and analysis by giving you visualization tools that convey information in a more digestible format.
- **Customization for individual preferences:** Offers customization based on your preferences and needs.
- **OpenSearch Assistant toolkit:** Connects you to tools to build generative AI-powered experiences that unlock actionable insights from complex datasets. Watch the [demo](https://playground.opensearch.org/app/home#/) on the homepage to learn more. 

## Prerequisites

Before getting started with this quickstart, make sure you've installed the latest version of OpenSearch and OpenSearch Dashboards. For information about installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/). If you're running OpenSearch 2.11 or older, see the respective quickstart. 

The following sections include several tutorials to help you learn OpenSearch basics. You can use your own environment or the [OpenSearch Playground](https://playground.opensearch.org/app/home#/), which runs on the latest version of OpenSearch. 

## Adding sample data

Sample datasets come with visualizations, dashboards, and other tools to help you explore OpenSearch Dashboards before you add your own data. To add sample data, follow these steps:

1. On the OpenSearch Dashboards **Home** page, choose **Add data** on the upper-right side of page.
2. On the **Add sample data** page, choose the datasets you want to add. Note that the **Sample flight data** dataset is used in the tutorials throughout this quickstart.

The following image shows a view of the adding sample data window.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample-data-2.png" alt="Screenshot of adding sample data window" width="700">

## Exploring and inspecting data

In [**Discover**]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), you can: 

- Choose data to explore, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Analyze your data, view individual documents, and create tables summarizing your data.
- Visualize your findings and share them.

The following steps give you a basic overview about using the Discover tool:

1. From the OpenSearch Dashboards navigation menu, choose **Discover**. 
2. On the **Discover** page, choose the sample flight dataset from the dropdown menu on the upper-left side of the page. 
3. Select the calendar icon to change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from the default of **Last 15 minutes** to **Last 7 days**.
4. In the DQL search bar, input `FlightDelay:true AND DestCountry: US AND FlightDelayMin >= 60` and then select **Update**. You should see results for US-bound flights delayed by 60 minutes or more.
5. Filter data by choosing **Add filter** from under the DQL search bar and then selecting an **Available field**. For example, select `FlightDelayType`, **is**, and **Weather Delay** from the **Field**, **Operator**, and **Value** dropdown lists on the **Edit Filter** pop-up window.

The following image shows the view you see once you've completed the preceding steps:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-basics.png" alt="Discover tutorial screen view" width="700">

## Visualizing data

Raw data can be difficult to comprehend and use. Data visualizations help you prepare and present data in a visual form. In **Dashboard** you can:

- Display data in a single view.
- Build dynamic dashboards.
- Create and share reports.
- Embed analytics to differentiate your applications.

The following steps give you a basic overview about using the Dashboard tool:

1. On the OpenSearch Dashboards **Home** page, choose **Dashboards** and then **[Flights] Global Flight Dashboard**.
2. To add panels to the dashboard, choose **Edit** and then **Add** from the toolbar.
3. In the **Add panels** window, search for the existing panel **[Flights] Delay Buckets** and then select it. A pop-up message confirms that you've added the panel.
4. Select `x` to close the **Add panels** window.
5. View the added panel **[Flights] Delay Buckets**, which is added as the last panel on the dashboard.

The following image shows the view you see once you've completed the preceding steps:

<img src="{{site.url}}{{site.baseurl}}/images/<insert-new-image>" alt="Dashboard tutorial screen view" width="700">

Continuing with the preceding dashboard, you'll create a bar chart comparing the number of canceled flights and delayed flights to delay type and then add the panel to the dashboard:

1. Change the default [time range]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) from **24 hours** to **Last 7 days**. 
2. In the toolbar, choose **Edit**, then **Create new**.
3. Select **VisBuilder** in the **New Visualizations** window.
4. In the **Data Source** dropdown list, choose `opensearch_dashboards_sample_data_flights`.
5. Drag the fields **Cancelled** and **FlightDelay** to the y-axis column.
6. Drag the field **FlightDelayType** to the x-axis column.
7. Choose **Save** and name the visualization in the **Title** field.
8. Choose **Save and return**. The following bar chart is added as the last panel on the dashboard, as shown in the following image.

The following image shows the view you see once you've completed the preceding steps:

<img src="{{site.url}}{{site.baseurl}}/images/<insert image>" alt="Dashboard tutorial panel view" width="700">

## Interacting with data

Interactive dashboards allow you analyze data in more depth and filter it in several ways. In Dashboards, you can interact directly with data on a dashboard by using dashboard-level filters. For example, continuing with the preceding dashboard, you can filter to show delays and cancellations for a specific airline.

The following steps give you a basic overview about interacting with the sample flight data:

1. On the **[Flights] Airline Carrier** panel, choose **OpenSearch-Air**. The dashboard updates automatically.
2. Choose **Save** to save the customized dashboard.

Alternatively, you can apply filters using the dashboard toolbar:

1. In the dashboard toolbar, choose **Add filter**.
2. From the **Field**, **Operator**, and **Value** dropdown lists, choose **Carrier**, **is**, and **OpenSearch-Air**, respectively, as shown in the following image.
3. Choose **Save**. The dashboard updates automatically, and the result is the dashboard shown in the following image.

The following image shows the view you'll see once you've completed the preceding steps:

<img src="{{site.url}}{{site.baseurl}}//images/<insert image>" alt="Screenshot of Dashboard tutorial panel view" width="700">

# Next steps

- **Visualize data.** To learn more about data visualizations in OpenSearch Dashboards, go to [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- **Create dashboards.** To learn more about creating dashboards in OpenSearch Dashboards, got to [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/quickstart-dashboards/).
- **Explore data.** To learn more about exploring data in OpenSearch Dashboards, go to [Exploring data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/). 
- **Ingest data.** To learn more about ingesting data in OpenSearch, go to [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) and [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/).