---
layout: default
title: Discover
nav_order: 20
has_children: true
---

# Discover
Updated 2.10
{: .label .label-purple } 

**Discover** is the tool for exploring your data in OpenSearch Dashboards. You can use **Discover** to visually represent your data on a dashboard and provide a high-level view of key metrics. 

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon"/>{:/} The legacy **Discover** tool will be retired in OpenSearch 2.11. The updated **Discover** tool provides you with new features and enhancements that make the data exploration experience in OpenSearch Dashboards more intuitive and user-friendly. To experience the updated tool now, install the [latest version of OpenSearch Dashboards](https://opensearch.org/downloads.html) or try out these features using the [OpenSearch Playground](https://playground.opensearch.org/app/home#/).  
{: .note} 

In this tutorial, you'll learn about using **Discover** to:

- Add data
- Explore and visualize data
- Share the data findings
- Set alerts

#### Prerequisites

The following are prerequisites for using **Discover** effectively:

- Install [OpenSearch Dashboards 2.10 or later](https://opensearch.org/downloads.html).
- Add OpenSearch [sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/) or import your own data into OpenSearch.
- Have foundational understanding of OpenSearch [documents and indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).   

## Import data

You must add data to OpenSearch before you can start exploring it. This tutorial uses sample data. To add the sample data, follow these steps:

1. On the OpenSearch Dashboards Home page, choose **Add sample data**.
2. Choose the desired sample data and select the **Add data** button. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/sample-data.png" alt="Add sample data interface" width="700"/>

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}//images/icons/info-icon.png" class="inline-icon" alt="info icon"/>{:/} **Note**<br>To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).
{: .note}

## Define your search

To define a search, follow these steps:  

1. On the OpenSearch Dashboards navigation menu, select **Discover**.
2. Choose the data you want to work with. In this case, choose `opensearch_dashboards_sample_data_flights` from the upper-left dropdown menu. 
3. Select the calendar icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/}) or clock icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="clock icon"/>{:/}) to change the time range of your search. An example is shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-ui.png" alt="Discover interface showing flight sample data query" width="700"/>

## Add data fields and explore the data in your document table

The document table contains document data. Each row represents a single document and each column contains a different document field, representing metrics such as flight destination, average ticket price, and flight delay. You can add, delete, or modify data fields in a document table as needed to meet your data analysis requirements. 

To add or delete fields in a document table, follow these steps:

1. View the data fields listed under **Available fields** and select the plus icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/}) to add the desired fields to the document table. The field will be automatically added to **Selected fields** and the document table. For this example, choose the fields `Carrier`, `AvgTicketPrice`, and `Dest`.
1. To arrange or sort the columns, select the column header containing the field name and select the desired action. An example is shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/arrange-columns.png" alt="Document table interface" width="700"/>

You can view individual or multiple fields in the document table to gain deeper knowledge about your data. To explore data in the document table, follow these steps: 

1. Choose the inspect icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/}) to open the **Document Details** window.
1. Review the data details. You can switch between the **Table** and **JSON** tabs to view the data in your preferred format. 
1. Select **View surrounding documents** to view data about events that occurred before or after the data you're searching or select **View single document** to view data about a particular event. An example is shown in the following image.

### Search your data

You can use the search toolbar or enter a [DQL]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) query using the **DevTools** console to search data. While the search toolbar is best for basic queries, such as searching by a field name, DQL is best for complex queries, such as searching data using a term, string, Boolean, date, range, or nested query. DQL provides suggestions for fields and operators as you type, helping you build structures queries.

To search data, follow these steps:

1. Enter a simple query in the DQL search bar. For example, enter `FlightDelay:true`, which searches for delayed flights.
1. Select the **Update** button right of the search bar.
1. Enter a more complex query in the DQL search bar, and then select **Update**. For example, enter `FlightDelay:true AND FlightDelayMin >= 60`, which searches the data for flights delayed by 60 minutes or more.

### Filter your data

Filters allow you to narrow down the results of a query by specifying specific criteria. You can filter by field, value, or range. The **Add filter** popup suggests the available fields and operators.

To filter your data:

1. Under the DQL search bar, choose **Add filter**.
1. Select the desired options from the **Field**, **Operator**, and **Value** dropdown lists. For example, select `Cancelled`, `is`, and `true`.
1. Choose **Save**.
1. To remove the filter, choose the cross icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/}) next to the filter name.
1. Add more filters to further explore the data.  

## Save a search

To save your search, including the query text, filters, and current data view, follow these steps:  

1. Select **Save** in the upper-right area. 
1. Give the search a title, and then choose **Save**. 
1. Select **Open** to access the saved search. 

## Create visual representations of your data discoveries

To create visualizations of your data findings, follow these steps:

1. Select the inspect icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/}) next to the field you want to visualize. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-visual.png" alt="Visualize button in Discover" width="400"/>

2. Select the **Visualize** button. A visualization is displayed. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualize-discover.png" alt="Visual representation of data" width="700"/>

## Set alerts

You can set alerts to notify you when your data changes beyond the thresholds you define. Learn more about using **Discover** to set up [alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/).
