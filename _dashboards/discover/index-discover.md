---
layout: default
title: Exploring data with Discover
nav_order: 20
has_children: true
---

# Exploring data with Discover 

**Discover** in OpenSearch Dashboards helps you extract insights and get value out of data assets across your organization. Discover enables you to:

1. **Select data.** You can explore, customize, and filter data, as well as search data using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/).
1. **Explore the data.** You can analyze data details, view individual documents, and create tables summarizing data contents.
1. **Visualize data.** You can display findings from your saved searches in a single dashboard that combines different data visualization types.

## Try it: Exploring sample data with Discover

This tutorial shows you how to use Discover to analyze and understand a sample data set. At the end of this tutorial, you should be ready to use Discover with your own data.

Before starting this tutorial, make sure you've added the **Sample flight data**. See [Quickstart for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/quickstart/) for details about how to get started.
{: .warning}
### Setting up data

Watch the following short video or start with the tutorial steps to learn how to set up a sample data set in Discover.

![Setting up the sample data in Discover]({{site.url}}{{site.baseurl}}/images/discover-setting-up-data.gif)

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`. 
1. On the **Home** page, select **Discover** in the navigation pane.
1. On the index pattern toolbar, select the **opensearch_dashboards_sample_data_flights** data set.
1. On the time filter toolbar, select the calendar icon and change the time range to **Last 7 days**.

### Exploring the data fields

In the Discover panel, you'll see a table that shows all the documents that match your search. The table includes a list of data fields that are available in the document table.

1. View the list of **Available fields**.
1. Select **Cancelled** to view the values (`true` and `false`).
1. Select the plus sign (+) to add the field to the document table. You'll see this field automatically add to **Selected fields** and the document table.  
1. Select **FlightDelay** from the **Available fields** list, and then select the plus sign icon to add the field to the document table.
1. Optional: Rearrange the table columns by selecting the table header and then **Move left** or **Move right**.

![Exploring data fields interface]({{site.url}}{{site.baseurl}}/images/discover-data-fields.png)

## Searching data

You can use the search toolbar or enter a DQL query in the **DevTools** console to search data in Dashboards. The search toolbar is best for basic queries, such as searching by a field name. DQL is best for complex queries, such as searching data using a term, string, boolean, date, range, or nested query.

1. In the search toolbar, enter the boolean query. For example, `FlightDelay:true AND FlightDelayMin >= 60` to search the data for flights delayed 60 minutes or longer.
1. Select **Update**.
1. Optional: Select the arrow icon `>` in a table row to expand the row and view the document table details.

![Searching data interface]({{site.url}}{{site.baseurl}}/images/discover-search.png)

## Filtering data

Filters allow you to refine sets of documents to subsets of those documents. For example, you can filter data to include or exclude certain fields.

1. In the filter bar, select **Add filter**.
1. Select **Field > Operator > Value** (for example, `Cancelled > is > true`).
1. Select **Save**.
1. To remove the filter, select the close icon `x` next to filter name.
1. Optional: Add more filters to further explore the data.  

![Filtering data interface]({{site.url}}{{site.baseurl}}/images/discover-filter.png)

## Analyzing data in the document table

You can view the document table fields to better understand the data and gather insights for more informed decision-making. 

1. Select the arrow icon `>` to expand a table row.
1. View the fields and details.
1. Switch between **Table** and **JSON** tabs to view the different formats.  

![Analyzing data in the document table]({{site.url}}{{site.baseurl}}/images/discover-analyze.png)

## Saving the search

You can save your search to use it later, generate a report, or build visualizations and dashboards. Saving a search saves the query text, filters, and current data view.  

1. Select the save icon in the toolbar. 
1. Give the search a title, and then select **Save**.## 
1. Select the save icon to access the saved search. 

<img src="{{site.url}}{{site.baseurl}}/images/discover-save.png" alt= "Save search interface" width="400" height="400">

## Visualizing the search

You can quickly visualize an aggregated field from **Discover**.

1. From the **Available fields** list, select `FlightDelayType`, and then select **Visualize**.

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize.png" alt= "Visualizing search queries from Discover" width="500" height="500">

Dashboards creates a visualization for this field (in this example, a basic bar chart).

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize-2.png" alt= "Bar chart created from Discover" width="600" height="600">
