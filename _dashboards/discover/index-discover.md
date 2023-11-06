---
layout: default
title: Discover
nav_order: 20
has_children: true
---

# Discover

**Discover** is a tool for exploring your data in OpenSearch Dashboards. You can use **Discover** to visually represent your data on a dashboard and provide a high-level view of key metrics. 

The following image represents a typical **Discover** page using sample data.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-app.png" alt="Discover start screen" width="700">

## Getting started

In this tutorial, you'll learn about using **Discover** to:

- Add data.
- Interpret and visualize data.
- Share the data findings.
- Set alerts.

## Prerequisites

The following are prerequisites for using **Discover**:

- Install [OpenSearch Dashboards 2.10 or later](https://opensearch.org/downloads.html).
- Add OpenSearch [sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/) or import your own data into OpenSearch.
- Have a foundational understanding of OpenSearch [documents and indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).   

## Adding data

Data must be added to OpenSearch before it can be analyzed. In this tutorial, you'll use the sample data. To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

To add the sample data, follow these steps:

1. On the OpenSearch Dashboards home page, choose **Add sample data**.
2. Choose the desired sample data and select the **Add data** button. A screenshot of the **Add sample data** interface is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-sample.png" alt="Add sample data interface"  width="700">

## Defining the search

To define a search, follow these steps:  

1. On the OpenSearch Dashboards navigation menu, select **Discover**.
2. Choose the data you want to work with. In this case, choose `opensearch_dashboards_sample_data_flights` from the upper-left dropdown menu. 
3. Select the calendar icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/}) to change the time range of your search and then select **Refresh**.

You'll see a view similar to the one in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/define-search.png" alt="Discover interface showing search of flight sample data for Last 7 days"  width="700">

## Adding data fields and viewing data details

The document table contains document data. Each row represents a single document, and each column contains a different document field representing metrics such as flight destination, average ticket price, and flight delay. You can add, delete, or modify data fields in a document table as needed to meet your data analysis requirements. 

To add or delete fields in a document table, follow these steps:

1. View the data fields listed under **Available fields** and select the plus icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/}) to add the desired fields to the document table. The field will be automatically added to both **Selected fields** and the document table. For this example, choose the fields `Carrier`, `AvgTicketPrice`, and `Dest`.
2. To arrange or sort the columns, select **Sort fields** > **Pick fields to sort by** and then drag and drop the fields in the order you want them to be ordered.

You'll see a view similar to the one in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-data-fields.png" alt="Discover interface showing adding and sorting data fields"  width="700">

You can view individual or multiple fields in the document table. To gather information about the data in the document table, follow these steps: 

1. From the data table's left-side column, choose the inspect icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/}) to open the **Document Details** window. Select the minimize icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/minimize-icon.png" class="inline-icon" alt="minimize icon"/>{:/}) to close the **Document Details** window.
2. Review the data details. You can switch between the **Table** and **JSON** tabs to view the data in your preferred format. 
3. Select **View surrounding documents** to view data for other log entries either preceding or following your current document or select **View single document** to view a particular log entry.

You'll see a view similar to the one in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/doc-details.png" alt="Document details interface"  width="700">

## Searching the data

You can use the search toolbar or enter a [DQL]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) query using the **DevTools** console to search data. While the search toolbar is best for basic queries, such as field name queries, DQL is best for complex queries, such as term, string, Boolean, date, range, or nested queries. DQL provides suggestions for fields and operators as you type, helping you build structured queries.

To search data, follow these steps:

1. Enter a simple query in the DQL search bar. For example, enter `FlightDelay:true`, which searches for delayed flights.
2. Select the **Update** button to the right of the search bar.
3. Enter a more complex query in the DQL search bar, and then select **Update**. For example, enter `FlightDelay:true AND FlightDelayMin >= 60`, which searches the data for flights delayed by 60 minutes or more.

## Filtering the data

Filters allow you to narrow the results of a query by specifying certain criteria. You can filter by field, value, or range. The **Add filter** pop-up suggests the available fields and operators.

To filter your data, follow these steps:

1. Under the DQL search bar, choose **Add filter**.
2. Select the desired options from the **Field**, **Operator**, and **Value** dropdown lists. For example, select `Cancelled`, `is`, and `true`.
3. Choose **Save**.
4. To remove the filter, choose the cross icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/}) next to the filter name.
5. Add more filters to further explore the data.  

## Saving a search

To save your search, including the query text, filters, and current data view, follow these steps:  

1. Select **Save** in the upper-right corner. 
2. Give the search a title, and then choose **Save**. 
3. Select **Open** to access the saved search. 

## Creating data visualizations through Discover

To create visualizations of the data findings using the **Discover** app, follow these steps:

1. Select the inspect icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/}) next to the field you want to visualize. 

   You'll see a view similar to the following image.
   
   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualize-discover.png" alt="Visualize data findings interface" width="700"/>

2. Select the **Visualize** button. The **Visualize** app opens and a visualization is displayed. Learn more about the **Visualize** app and data visualizations in [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/). 

   You'll see a view similar to the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-flight.png" alt="Data visualization of flight sample data field destination" width="700"/>

## Setting alerts

You can set alerts to notify you when your data changes beyond the thresholds you define. To learn more about using **Discover** to create and manage alerts, see [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/).
