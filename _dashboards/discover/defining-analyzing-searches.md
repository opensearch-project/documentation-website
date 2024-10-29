---
layout: default
title: Defining and analyzing searches
parent: Analyzing data
nav_order: 10
---

# Defining and analyzing searches

The **Discover** application in OpenSearch Dashboards offers a flexible interface for defining and analyzing searches across your data, enabling powerful insights and visualizations.

## Defining a search

To define a search, follow these steps:  

1. On the OpenSearch Dashboards navigation menu, select **Discover**.
2. Choose the data you want to work with. In this case, choose `opensearch_dashboards_sample_data_flights` from the upper-left dropdown menu. 
3. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} icon to change the time range of your search and then select **Refresh**.

## Analyzing document tables

OpenSearch uses document tables to store unstructured data, where each row corresponds to an individual document and columns represent various document attributes.

### View document attributes

To review document attributes, follow these steps: 

1. From the data table's left column, choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to open the **Document Details** window. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/minimize-icon.png" class="inline-icon" alt="minimize icon"/>{:/} icon to close the **Document Details** window.
2. Examine the metadata. You can switch between the **Table** and **JSON** tabs to view the data in your preferred format. 
3. Select **View surrounding documents** to view data for other log entries either preceding or following your current document or select **View single document** to view a particular log entry.

### Add or delete fields in document tables

To add or delete fields in a document table, follow these steps:

1. View the data fields listed under **Available fields** and select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} icon to add the desired fields to the document table. The field will be automatically added to both **Selected fields** and the document table. For this example, choose the fields `Carrier`, `AvgTicketPrice`, and `Dest`.
2. Select **Sort fields** > **Pick fields to sort by**. Drag and drop the chosen fields in the desired sort order. 

## Searching data

The search toolbar in **Discover** supports both [DQL]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) and [query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) queries. For more complex queries and full filter capabilities, use [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/) in the [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/).

For more information, see [Discover and Dashboard search toolbar]({{site.url}}{{site.baseurl}}/dashboards/index/#discover-and-dashboard-search-bar).

## Filtering data

Filters allow you to narrow the results of a query by specifying certain criteria. You can filter by field, value, or range. The **Add filter** pop-up suggests the available fields and operators.

To filter your data, follow these steps:

1. Under the DQL search bar, choose **Add filter**.
2. Select the desired options from the **Field**, **Operator**, and **Value** dropdown lists. For example, select `Cancelled`, `is`, and `true`.
3. Choose **Save**.
4. To remove a filter, choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} icon to the right of the filter name.

## Saving a search

To save your search, including the query text, filters, and current data view, follow these steps:  

1. Select **Save** on the upper-right toolbar. 
2. Add a title, and then choose **Save**. 
3. Select **Open** on the upper-right toolbar to access your saved searches. 

## Visualizing data findings

To visualize your data findings, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to the right of the field you want to visualize. 
2. Select the **Visualize** button. When the **Visualize** application is launched, a visualization appears. 

## Setting alerts

Set alerts to notify you when your data exceeds your specified thresholds. Go to [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/) to learn about creating and managing alerts.
