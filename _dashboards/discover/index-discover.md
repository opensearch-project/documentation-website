---
layout: default
title: Exploring data
nav_order: 20
has_children: true
canonical_url: https://docs.opensearch.org/latest/dashboards/discover/index-discover/
---

# Exploring data 

**Discover** in OpenSearch Dashboards helps you extract insights and get value out of data assets across your organization. Discover enables you to:

1. **Explore data**. You can explore, customize, and filter data as well as search data using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/).
2. **Analyze data**. You can analyze data, view individual documents, and create tables summarizing data contents.
3. **Visualize data**. You can display findings from your saved searches in a single dashboard that combines different data visualization types.

## Try it: Exploring sample data with Discover

This tutorial shows you how to use Discover to analyze and understand a sample dataset. At the end of this tutorial, you should be ready to use Discover with your own data.

Before starting this tutorial, make sure you've added the **Sample flight data**. See [Quickstart guide for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/quickstart/) for information about how to get started.
{: .warning}

### Setting up data

Watch the following short video or start with the tutorial steps to learn how to set up a sample dataset in Discover.

![Setting up the sample data in Discover]({{site.url}}{{site.baseurl}}/images/discover-setting-up-data.gif)

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`. 
1. On the **Home** page, choose **Discover** in the navigation pane.
1. On the index pattern toolbar, select the **opensearch_dashboards_sample_data_flights** dataset.
1. On the time filter toolbar, choose the calendar icon and then change the time range to **Last 7 days**.

### Exploring the data fields

In the **Discover** panel, you'll see a table that shows all the documents that match your search. The table includes a list of data fields that are available in the document table, as shown in the following image.

![Exploring data fields interface]({{site.url}}{{site.baseurl}}/images/discover-data-fields.png)

Follow these steps to explore the data fields:

1. View the list of **Available fields**.
1. Choose **Cancelled** to view the values (`true` and `false`).
1. Choose the plus (+) sign to add the field to the document table. The field will be automatically added to **Selected fields** and the document table.  
1. Select **FlightDelay** from the **Available fields** list, and then choose the plus (+) sign to add the field to the document table.
1. Optional: Rearrange the table columns by selecting the table header and then choosing **Move left** or **Move right**.

## Searching data

You can use the search toolbar or enter a DQL query in the **DevTools** console to search data in Dashboards, as shown in the following image. The search toolbar is best for basic queries, such as searching by a field name. DQL is best for complex queries, such as searching data using a term, string, Boolean, date, range, or nested query.

![Searching data interface]({{site.url}}{{site.baseurl}}/images/discover-search.png)

Follow these steps to search data:

1. In the search toolbar, enter the Boolean query. For example, enter `FlightDelay:true AND FlightDelayMin >= 60` to search the data for flights delayed by 60 minutes or more.
1. Choose **Update**.
1. Optional: Choose the arrow (`>`) in a table row to expand the row and view the document table details.

## Filtering data

Filters allow you to refine sets of documents to subsets of those documents. For example, you can filter data to include or exclude certain fields, as shown in the following image.

![Filtering data interface]({{site.url}}{{site.baseurl}}/images/discover-filter.png)

Follow these steps to filter data:

1. In the filter bar, choose **Add filter**.
1. Select options from the **Field**, **Operator**, and **Value** dropdown lists. For example, `Cancelled`, `is`, and `true`.
1. Choose **Save**.
1. To remove the filter, choose the close icon (x) next to the filter name.
1. Optional: Add more filters to further explore the data.  

## Analyzing data in the document table

You can view the document table fields to better understand the data and gather insights for more informed decision-making: 

1. Choose the arrow icon (>) to expand a table row.
1. View the fields and details.
1. Switch between the **Table** and **JSON** tabs to view the different formats, as shown in the following image.  

![Analyzing data in the document table]({{site.url}}{{site.baseurl}}/images/discover-analyze.png)

## Saving the search

Saving a search saves the query text, filters, and current data view. To save your search to use it later, generate a report, or build visualizations and dashboards:  

1. Choose the save icon in the toolbar. 
1. Give the search a title, and then choose **Save**. 
1. Choose the save icon to access the saved search, as shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/discover-save.png" alt= "Save search interface" width="350" height="350">

## Visualizing the search

You can quickly visualize an aggregated field from **Discover**:

1. From the **Available fields** list, select `FlightDelayType` and then choose **Visualize**, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize.png" alt= "Visualizing search queries from Discover" width="350" height="350">

Dashboards creates a visualization for this field, which in this case is a basic bar chart, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize-2.png" alt= "Bar chart created from Discover" width="600" height="600">
