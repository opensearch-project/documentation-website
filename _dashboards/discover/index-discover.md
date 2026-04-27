---
layout: default
title: Exploring data with Discover
parent: Exploring data
nav_order: 20
has_children: true
---

# Exploring data with Discover

You can use the **Discover** application in **OpenSearch Dashboards** to explore and visualize your data in OpenSearch.

This page describes how to use **Discover** to:

- [View data](#viewing-the-results-table).
- [Filter data](#filtering-documents).
- [Choose data fields to view](#choosing-data-fields).
- [Examine details of a document](#examining-a-document).
- [Visualize data fields](#visualizing-data-fields).
- [Export data to a CSV file](#export-data).
- [Set alerts](#setting-alerts).


## Navigating the Discover UI

The following components make up the **Discover** application UI.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-app-panel-callouts.png" alt="Discover app default page">

- The _application menu_ (A) provides options for creating and saving Discover filters settings.
- The _field select_ tool (B) determines which fields display in the **Discover** application panel. See [Using the field select tool]({{site.url}}{{site.baseurl}}/dashboards/discover/field-select/).
- The _time filter_ (C) provides a graphical interface for selecting data values and ranges. See [Using the time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).
- The _search_ bar (D) enables selection of data using a query language search. See [Using the search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/).
- The _filter_ tool (E) contains frequently used commands and shortcuts. See [Using the filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).
- The **Discover** _application panel_ displays the following elements:
  - The _date range display_ (F) specifies and selects a date-time range and determines the scale of the timeline visualization.
  - The _timestamp histogram_ (G) displays the count of documents per time interval.
  - The **Results** table (H) displays summaries of the selected documents. You can expand each document and view it in tabular or JSON form.

  If there is no data selected, the application panel displays a **</> No Results** message. This often happens, especially with the OpenSearch Dashboards sample data, because all data falls outside the time filter interval.
  {: .note}

  The time filter interval defaults to **Last 15 minutes**. To change the time filter interval, [Expand the time range]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/#selecting-a-time-range) to include data.
  {: .note}


## Prerequisites

Before using the **Discover** tool, ensure that you:

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards).

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

- Understand OpenSearch [documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document) and [indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).

- Know how to use the various filter tools:
  - [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/)
  - [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/)
  - [filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/)
  - [field-select tool]({{site.url}}{{site.baseurl}}/dashboards/discover/field-select/)

## Viewing the Results table

The **Results** table displays the selected data. Each row represents a single document, and each column contains document attributes.

By default, the table shows all attributes for all selected documents.

To display documents in the **Discover** application, follow these steps:

1. In the navigation panel, select **OpenSearch Dashboards** > **Discover**.

1. Choose the data you want to work with from the **Index patterns** dropdown in the field select tool. See [Selecting an index pattern]({{site.url}}{{site.baseurl}}/dashboards/discover/field-select/#selecting-an-index-pattern).

   For the following example, choose `opensearch_dashboards_sample_data_flights`.

1. Use the time filter to select the time interval of interest. See [Selecting a time range]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/#selecting-a-time-range).

   For the example, select **Last 12 months**.

   The following image shows the resulting display in the Discover app.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-display-flight-data-3-mo.png" alt="Discover interface showing search of flight sample data for last 90 days"  width="95%">

1. Drag-select the narrow band of data from the timestamp histogram as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-drag-select.png" alt="Discover interface showing drag-select"  width="95%">

   The data adjusts to span the width of the data display, and the scale adjusts automatically.

   Selecting a date range interactively results in an absolute time interval.
   {: .note}

1. Select **Auto** from the date range display drop-down.

   The resulting view should look like the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-display-flight-data-adjusted.png" alt="Discover interface showing flight sample data scaled to display width"  width="95%">


## Filtering documents

You can filter documents out of the selected index pattern in several ways:

- By further refining the time interval
- By entering a query language query
- By selecting attribute values in a menu-based filter tool

You can save any combination of these filters and re-apply them later to the same or a different index pattern. See [Saving a query]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/#saving-a-query).


### Refining the time interval

The **Discover** application displays only the documents that are included in the time filter's time interval. The time interval can be _relative_ (a fixed window of time relative to _now_), or _absolute_ (between two fixed times).

Some tools for changing the time interval are demonstrated in the previous example. To learn about others, see [Using the time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).


### Entering a query

You can filter documents by entering a query string in the search bar using one of two query languages.

- [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/) is the default query language in the search bar and is available only in **Dashboards**.
- [Query string query language (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) is based on the [Apache Lucene](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html) query language.

To filter documents using the search bar, see [Using the search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/).

For example, using the _flights_ sample data, enter the following DQL search:

```
Carrier: "OpenSearch-Air"
```

### Selecting attribute values

You can use the filter tool to add any number of discrete filters based on attribute values.

You can turn filters on or off individually or all at once; reverse the inclusion-exclusion status of any filter; and pin the filters as a group so that they apply to the **Dashboards** and  **Visualization** applications.

To use the filter tool, see [Using the filter tool]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).

For example, using the _flights_ sample data, use the filter tool to enter the following filter:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/filter-cancelled-true.png" alt="A data filter"  width="100">


## Choosing data fields

By default, the **Discover** application displays all the fields in a document. You can choose to display one, more, or all fields in the **Results** table.

To choose the fields to display in the **Results** table, see [Using the field select tool]({{site.url}}{{site.baseurl}}/dashboards/discover/field-select/).

For example, select **Dest**, **FlightDelayMin**, and **FlightDelayType** in the field select tool. The **Results** table now displays only those fields (in addition to the **Time**).


## Examining a document

To expand a single document and see a detailed view in the **Results** table, follow these steps:

1. From a row in the **Results** table's left column, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) icon to open the **Document Details** window.

1. (Optional) To display the document in JSON format, select the **JSON** tab under the **Expanded document** label.

1. To return to the (default) tabular view, select the **Table** tab.

1. (Optional) To view documents preceding or following the current document, select **View surrounding documents**.

   The document, along with the five documents before and after by default, are displayed in a new browser window.

   The number of surrounding documents is fewer if there are fewer documents immediately before or after.
   {: .note}

1. (Optional) To view the expanded document in isolation, select **View single document**.

   The expanded document is displayed in a new browser window.

1. To close the **Expanded document** window, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="collapse icon"/>{:/} (down arrow) icon.


## Visualizing data fields

To visualize a data field, follow these steps:

1. In the field select list, mouse over the field you want to visualize.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} (inspect) icon to the right of the field name.

   The **Top 5 views popover** displays as shown in the following image.
   
   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/top-5-values.png" alt="top 5 values popover" width="51%"/>

1. From the **Top 5 values** popover, select the **Visualize** button. The display changes to the **Visualize** application, showing a default visualization of the selected field.

   See [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/) to learn how to edit the visualization display.


## Exporting data

You can export data from the **Results** table to a CSV file or copy a JSON object representing a single document.

### Downloading data to a CSV file

To download a CSV-formatted file of data from the **Results** table:

1. Filter the data to the documents you want to export as described in [Filtering documents](#filtering-documents).

1. Choose the data fields you want to export as described in [Choosing data fields](#choosing-data-fields).

1. Select **Download as CSV**.

1. In the **DOWNLOAD AS CSV** popover, choose whether you want to download only the documents **Visible** on the page, or the **Max available** (all selected documents, limited to 10,000 documents).

1. Select the **Download CSV** button.

   The data is written to a CSV file at the filesystem's default location.

   If the selected fields include objects or arrays, the CSV documents will download as JSON objects. To download as discrete CSV values, select only single-value fields.
   {: .tip}

### Copying a JSON representation of a document

To copy a JSON representation of a document, follow these steps:

1. Select the individual document in the **Results** table. See [Examining a document](#examining-a-document).

1. Select the JSON tab to view the document in JSON form.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/copy-icon.png" class="inline-icon" alt="copy icon"/>{:/} (copy) icon in the upper right of the JSON display area.

## Setting alerts

You can set thresholds for data values and then set alerts to notify you when your data exceeds your thresholds.

To learn about creating and managing alerts, see [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/).
