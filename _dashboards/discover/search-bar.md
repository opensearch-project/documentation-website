---
layout: default
title: Search bar
parent: Exploring data with Discover
grand_parent: Exploring data
nav_order: 20
redirect_from: 
  - /dashboards/#discover-and-dashboard-search-bar
---

# Using the search bar

The same search bar is at the top of the [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/), [Dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/), and [Visualize]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/) applications. Use it to filter the data displayed in those applications.

In the search bar, you do text-based searches using either of two languages:

- [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/): A basic query language with nested field queries.

- [Query string query language (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/): A query language based on the [Apache Lucene](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html) query language. 

The terms _Query string query language_ and _Lucene_ are used interchangeably in the documentation and UI.  
{: .note}

Query string query language and DQL support different features. For example, DQL has nested expressions; Lucene has fuzzy searches and regular expressions. For a full comparison, see [DQL and query string query quick reference]({{site.url}}{{site.baseurl}}/dashboards/dql/#dql-and-query-string-query-quick-reference).


## Navigating the search bar

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/search-bar-callouts.png" alt="Search bar interface">

The following components make up the search bar.

- The {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon (A) saves the current query.
- The **Search** box (B) accepts a query in the currently selected query language.
- The query language selector (C) opens the **Syntax options** popover for selecting the query language.

## Changing the query language

The current query language, OpenSearch Dashboards Query Language (DQL) or Query String Query Language (Lucene), is displayed at the right side of the **Search** box.

To switch between DQL and query string query language, follow these steps:

1. Choose the query language selector (displaying the current query language).

1. In the **Syntax options** dialog, toggle **OpenSearch Dashboards Query Language** on or off.

   If **OpenSearch Dashboard Query Language** (DQL) is turned **off**, the query language is set to OpenSearch Dashboards Query Language, and the query language selector displays **Lucene**.
   {: .note}

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-lucene-syntax.png" alt="Using query string syntax in OpenSearch Dashboards Discover"  width="97%">


## Filtering based on a query

To filter using the **Search** box, follow these steps:

1. Enter a filter criterion in the **Search** box. For example, using DQL against the OpenSearch [Ecommerce] sample data, enter `category: "Men's Clothing"`.

   For information about querying in DQL, see [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/).

   For information about querying in Lucene, see [Query string query language (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/).

1. Select **Refresh**.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/refresh-button.png" alt="Refresh button"  width="100">

   The **Results** table is updated to reflect filtering by the query.

## Editing a filter query

To change the query, follow these steps:

1. Edit the filter criterion in the **Search** box. For example, to change the DQL query in the previous example, change the query to `sales_by_category is "Women's Clothing"`.

1. Select **Refresh**.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/refresh-button.png" alt="Refresh button"  width="100">

   The **Results** table is updated to reflect the altered query.

## Saving a query

Use this procedure to save any combination of:

- The DQL or Lucene query.
- The filters.
- The time filter.

To save a query, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon.

There does not have to be a query in the **Search** box. You can use this procedure to save the filters and/or the time filter without saving a query.
{: .note}

1. From the **Save** popover, select **Save current query** or **Save as new**.

1. In the **Save query** dialog, enter a **Name** for the query.

1. (Optional) In the **Description** box, enter a description of the query.

1. (Optional) Activate the **Include filters** toggle to also save the filters in the [filter list]({{site.url}}{{site.baseurl}}/dashboards/discover/filter-tool/).

1. (Optional) Activate the **Include time filter** toggle to also save the currently active [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

1. Select **Save**.


## Loading a saved search

To load a saved search, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon.

1. Select the search you want to load.

   The filter loads and the data displayed in the **Discover** application is updated.


## Editing a query

To change an existing query, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon.

1. Select the query you want to edit.

1. Filter the data using the search query, filters, and time filter you want to update a query to.

1. Again select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon. The current saved query is checked in the list.

1. Select **Save changes**.

1. (Optional) In the **Save query** dialog, enter or change the **Description**.

1. Select **Save**.


## Deleting a query

To delete a query, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/save-icon.png" class="inline-icon" alt="save icon"/>{:/} (save) icon.

1. Hover over the query you want to delete.

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/trash-icon.png" class="inline-icon" alt="trash icon"/>{:/} (trash) icon.

1. In the delete confirmation dialog, select **Delete**.

