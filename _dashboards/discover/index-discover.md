---
layout: default
title: Analyzing data with Discover
nav_order: 20
has_children: true
---

# Analyzing data with Discover

To explore and visualize your data in OpenSearch, you can use the **Discover** application in **OpenSearch Dashboards**. The following image shows an example.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover.png" alt="A Discover default page" width="700">

This page describes how to use **Discover** to:

- Add data
- Interpret and visualize data
- Share data findings
- Set alerts

## Prerequisites

Before using the **Discover** tool:

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards).

- Add sample data or import your own data into OpenSearch. Go to [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data) to learn about adding sample datasets. Go to [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/) to learn about importing your own data.

To use the **Discover** tool, it helps if you:

- Know how to use the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar) and the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter).

- Understand [OpenSearch documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).

## Defining a search

To define a search:

1. In the **navigation menu**, select **OpenSearch Dashboards** > **Discover**.

1. Choose the data you want to work with from the upper-left dropdown menu. For the examples used here, choose `opensearch_dashboards_sample_data_flights`.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="time-select icon"/>{:/} (calendar) icon to filter the time range of your search.

1. Change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter) from **Last 15 minutes** to **Last 1 months**.

1. Select **Refresh**.

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/define-search.png" alt="Discover interface showing search of flight sample data for Last 7 days"  width="700">

## Viewing document tables

A **document table** displays unstructured data. Each row represents a single document, and each column contains document attributes.

To examine document a **document table**:

1. From a row in the data table's left column, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} icon to open the **Document Details** window.

1. Choose between data formats by selecting the **Table** or **JSON** tab.

1. Select **View surrounding documents** to view data for other log entries either preceding or following your current document or select **View single document** to view a particular log entry.

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/doc-details.png" alt="Document attributes"  width="700">

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/arrow-down-icon.png" class="inline-icon" alt="collapse icon"/>{:/} icon to close the **Document Details** window.

## Adding and deleting fields in a document table

To add and delete fields in a document table, follow these steps:

1. View the data fields listed under **Available fields** and select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} icon to add the desired fields to the document table. The field is automatically added to both **Selected fields** and the document table. For this example, choose the fields `Carrier`, `AvgTicketPrice`, and `Dest`.

1. Select **Sort fields** > **Pick fields to sort by**. Drag and drop the chosen fields in the desired sort order. 

The resulting view is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-data-fields.png" alt="Adding and deleting data fields"  width="700">

## Searching data

You can use the **search toolbar** to enter a [DQL]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) or [query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) query. 

Use the search toolbar for basic queries. For full query and filter capability, use [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/) in the [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/).
{: .note}

For more information, see [Search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar).

## Filtering data

Filters allow you to narrow the results of a query by specifying a field, value, or range. The **Add filter** pop-up lists the available fields and operators.

To filter your data:

1. Under the DQL search bar, choose **Add filter**.

1. Select the desired options from the **Field**, **Operator**, and **Value** dropdown lists. For example, select `Cancelled`, `is`, and `true`.

1. (Optional) Choose **Create custom label?** to assign a name to the search.

1. Choose **Save**.

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-filter.png" alt="Visualize data findings interface" width="700"/>

To remove a filter:

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} icon to the right of the filter name.


## Saving a search

To save your search, including the query text, filters, and current data view, follow these steps:  

1. Select **Save** on the upper-right toolbar.

1. To save the search as a new search, choose **Save as new search**. Otherwise **Save** overwrites the current saved search.

1. To change the name of the current search or to add a new search, enter a new **Title**.

1. Choose **Save**.

## Selecting a search

To select a saved search:

1. Select **Open** on the upper-right toolbar.

1. (Optional) Enter a search term to narrow the list.

1. Select a search from the list.

## Visualizing data findings

To visualize your data findings, follow these steps:

1. In the field list, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to the right of the field you want to visualize.

   The resulting view is shown in the following image.
   
   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualize-discover.png" alt="Visualize data findings interface" width="700"/>

1. From the **Top 5 values** pop-up, select the **Visualize** button. The display changes to the **Visualize** application, showing the selected visualization.

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-flight.png" alt="Data visualization of flight sample data field destination" width="700"/>

## Setting alerts

You can set alerts to notify you when your data exceeds your specified thresholds.

Go to [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/) to learn about creating and managing alerts.
