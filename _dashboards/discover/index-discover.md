---
layout: default
title: Analyzing data
nav_order: 20
has_children: true
redirect_from: 
  - /dashboards/discover/index-discover/
canonical_url: https://docs.opensearch.org/latest/dashboards/discover/index-discover/
---

# Analyzing data

To analyze your data in OpenSearch and visualize key metrics, you can use the **Discover** application in OpenSearch Dashboards. An example of data analysis in **Discover** is shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover.png" alt="A Discover default page" width="700">

## Getting started

In this tutorial, you'll learn about using **Discover** to:

- Add data.
- Interpret and visualize data.
- Share data findings.
- Set alerts.

Before getting started, make sure you:

- Install [OpenSearch Dashboards](https://opensearch.org/downloads.html).
- Add sample data or import your own data into OpenSearch. Go to the [OpenSearch Dashboards quickstart guide]({{site.url}}{{site.baseurl}}/dashboards/quickstart/) to learn about adding sample datasets. Go to [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/) to learn about importing your own data.
- Have a foundational understanding of [OpenSearch documents and indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).
  
## Defining the search

To define a search, follow these steps:  

1. On the OpenSearch Dashboards navigation menu, select **Discover**.
2. Choose the data you want to work with. In this case, choose `opensearch_dashboards_sample_data_flights` from the upper-left dropdown menu. 
3. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} icon to change the time range of your search and then select **Refresh**.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/define-search.png" alt="Discover interface showing search of flight sample data for Last 7 days"  width="700">

## Analyzing document tables

In OpenSearch, a document table stores unstructured data. In a document table, each row represents a single document, and each column contains document attributes. 

To examine document attributes, follow these steps: 

1. From the data table's left column, choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to open the **Document Details** window. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/minimize-icon.png" class="inline-icon" alt="minimize icon"/>{:/} icon to close the **Document Details** window.
2. Examine the metadata. You can switch between the **Table** and **JSON** tabs to view the data in your preferred format. 
3. Select **View surrounding documents** to view data for other log entries either preceding or following your current document or select **View single document** to view a particular log entry.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/doc-details.png" alt="Document attributes"  width="700">

To add or delete fields in a document table, follow these steps:

1. View the data fields listed under **Available fields** and select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} icon to add the desired fields to the document table. The field will be automatically added to both **Selected fields** and the document table. For this example, choose the fields `Carrier`, `AvgTicketPrice`, and `Dest`.
2. Select **Sort fields** > **Pick fields to sort by**. Drag and drop the chosen fields in the desired sort order. 

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-data-fields.png" alt="Adding and deleting data fields"  width="700">

## Searching data

You can use the search toolbar to enter a [DQL]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) or [query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) query. The search toolbar is best for basic queries; for full query and filter capability, use [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/) in the [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/).

For more information, see [Discover and Dashboard search toolbar]({{site.url}}{{site.baseurl}}/dashboards/index/#discover-and-dashboard-search-bar).

## Filtering data

Filters allow you to narrow the results of a query by specifying certain criteria. You can filter by field, value, or range. The **Add filter** pop-up suggests the available fields and operators.

To filter your data, follow these steps:

1. Under the DQL search bar, choose **Add filter**.
2. Select the desired options from the **Field**, **Operator**, and **Value** dropdown lists. For example, select `Cancelled`, `is`, and `true`.
3. Choose **Save**.
4. To remove a filter, choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} icon to the right of the filter name.

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-filter.png" alt="Visualize data findings interface" width="700"/>

## Saving a search

To save your search, including the query text, filters, and current data view, follow these steps:  

1. Select **Save** on the upper-right toolbar. 
2. Add a title, and then choose **Save**. 
3. Select **Open** on the upper-right toolbar to access your saved searches. 

## Visualizing data findings

To visualize your data findings, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to the right of the field you want to visualize. 

   The resulting view is shown in the following image.
   
   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualize-discover.png" alt="Visualize data findings interface" width="700"/>

2. Select the **Visualize** button. When the **Visualize** application is launched, a visualization appears. 

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-flight.png" alt="Data visualization of flight sample data field destination" width="700"/>

## Setting alerts

Set alerts to notify you when your data exceeds your specified thresholds. Go to [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/) to learn about creating and managing alerts.
