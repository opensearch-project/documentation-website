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

## Explore and query data with Discover

This tutorial shows you how to use **Discover** to:

- Add data
- Explore and visualize data
- Share the findings

#### Prerequisites

The following are prerequisites for getting started with **Discover**

- **_SME: What are the prerequisites?_**  

### Add data

You must add data to OpenSearch before you can start exploring it. This tutorial uses sample data. To add the sample data, follow these steps:

1. On the OpenSearch Dashboards Home page, choose **Add sample data**.
2. Choose the desired sample data and select the **Add data** button. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/sample-data.png" alt="Add sample data interface" width="700"/>

**Note:** To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).
{: .note}

### Define your search

To define your search, follow these steps:  

1. On the OpenSearch Dashboards navigation menu, select **Discover**.
2. Choose the data you want to work with. In this case, choose `opensearch_dashboards_sample_data_flights` from the upper-left dropdown menu. 
3. (Optional) Select the calendar icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/}) or clock icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="clock icon"/>{:/}) to change the time range of your search. 

You should see a view like the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/discover-ui.png" alt="Discover interface showing flight sample data query" width="700"/>

### Explore the data

Under the bar graph visualization you have a table showing all the documents that match your search. The table includes your selected data fields. To add other fields to the table, follow these steps:

1. Choose a data field(s) listed under **Available fields** by selecting the plus icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/}) For this example, choose `Carrier`, `AvgTicketPrice`, and `Dest`.
1. Choose the plus (+) sign to add the field to the document table. The field will be automatically added to **Selected fields** and the document table.  
1. Select **FlightDelay** from the **Available fields** list, and then choose the plus (+) sign to add the field to the document table.
1. Optional: Rearrange the table columns by selecting the table header and then choosing **Move left** or **Move right**.

**Step 3: Search the data**

You can use the search toolbar or enter a DQL query in the **DevTools** console to search data in Dashboards, as shown in the following image. The search toolbar is best for basic queries, such as searching by a field name. DQL is best for complex queries, such as searching data using a term, string, Boolean, date, range, or nested query. Follow these steps to search data:

1. In the search toolbar, enter the Boolean query. For example, enter `FlightDelay:true AND FlightDelayMin >= 60` to search the data for flights delayed by 60 minutes or more.
1. Choose **Update**.
1. Optional: Choose the arrow (`>`) in a table row to expand the row and view the document table details.

**Step 4: Filter the data**

Filters allow you to refine sets of documents to subsets of those documents. For example, you can filter data to include or exclude certain fields, as shown in the following image. Follow these steps to filter the data:

1. In the filter bar, choose **Add filter**.
1. Select options from the **Field**, **Operator**, and **Value** dropdown lists. For example, `Cancelled`, `is`, and `true`.
1. Choose **Save**.
1. To remove the filter, choose the close icon (x) next to the filter name.
1. Optional: Add more filters to further explore the data.  

**Step 5: Analyze the data in a document table**

You can view the document table fields to better understand the data and gather insights for more informed decision-making. Follow these steps to view the data: 

1. Choose the arrow icon (>) to expand a table row.
1. View the fields and details.
1. Switch between the **Table** and **JSON** tabs to view the different formats, as shown in the following image.  

**Step 6: Save a search**

Saving a search saves the query text, filters, and current data view. To save your search to use it later, generate a report, or build visualizations and dashboards, follow these steps:  

1. Choose the save icon in the toolbar. 
1. Give the search a title, and then choose **Save**. 
1. Choose the save icon to access the saved search, as shown in the following image. 

**Step 7: Visualize the search**

You can quickly visualize an aggregated field from **Discover**:

1. From the **Available fields** list, select `FlightDelayType` and then choose **Visualize**, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize.png" alt= "Visualizing search queries with Discover" width="350" height="350">

Dashboards creates a visualization for this field, which in this case is a basic bar chart, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/discover-visualize-2.png" alt= "Bar chart created with Discover" width="600" height="600">
