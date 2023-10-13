---
layout: default
title: Query and visualize Amazon S3 data  
parent: Connecting Amazon S3 to OpenSearch
grand_parent: Data sources
nav_order: 10
has_children: false
---

# Query and visualize Amazon S3 data
Introduced 2.11
{: .label .label-purple }

This tutorial guides you through using the **Query data** use case for querying and visualizing your Amazon Simple Storage Service (Amazon S3) data using OpenSearch Dashboards. 

## Prerequisites

You must be using the `opensearch-security` plugin and have the appropriate role permissions. Contact your IT administrator to assign you the necessary permissions.  

## Get started with querying

To get started, follow these steps:

1. On the **Manage data sources** page, select your data source from the list. 
2. On the data source's detail page, select the **Query data** card. This option takes you to the **Observability** > **Logs** page, which is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/observability-logs-UI.png" alt="Observability Logs UI" width="700">

3. Select the **Event Explorer** button. This option creates and saves frequently searched queries and visualizations using [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) or [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/), which connects to Spark SQL.
4. Select the Amazon S3 data source from the dropdown menu in the upper-left corner. An example is shown in the following image.

     <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-data-sources-UI-2.png" alt="Observability Logs Amazon S3 dropdown menu" width="700">

5. Enter the query in the **Enter PPL query** field. Note that the default language is SQL. To change the language, select PPL from the dropdown menu.
6. Select the **Search** button. The **Query Processing** message is shown, confirming that your query is being processed.
7. View the results, which are listed in a table on the **Events** tab. On this page, details such as available fields, source, and time are shown in a table format.
8. (Optional) Create data visualizations.

## Create visualizations of your Amazon S3 data

To create visualizations, follow these steps:

1. On the **Explorer** page, select the **Visualizations** tab. An example is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/explorer-S3viz-UI.png" alt="Explorer Amazon S3 visualizations UI" width="700">

2. Select **Index data to visualize**. This option currently only creates [acceleration indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/), which give you views of the data visualizations from the **Visualizations** tab. To create a visualization of your Amazon S3 data, go to **Discover**. See the [Discover documentation]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) for information and a tutorial.

## Use Query Workbench with your Amazon S3 data source

[Query Workbench]({{site.url}}{{site.baseurl}}/search-plugins/sql/workbench/) runs on-demand SQL queries, translates SQL into its REST equivalent, and views and saves results as text, JSON, JDBC, or CSV.

To use Query Workbench with your Amazon S3 data, follow these steps:

1. From the OpenSearch Dashboards main menu, select **OpenSearch Plugins** > **Query Workbench**.
2. From the **Data Sources** dropdown menu in the upper-left corner, choose your Amazon S3 data source. Your data begins loading the databases that are part of your data source. An example is shown in the following image.

     <img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-workbench-S3.png" alt="Query Workbench Amazon S3 data loading UI" width="700">

3. View the databases listed in the left-side navigation menu and select a database to view its details. Any information about acceleration indexes is listed under **Acceleration index destination**. 
4. Choose the **Describe Index** button to learn more about how data is stored in that particular index.
5. Choose the **Drop index** button to delete and clear both the OpenSearch index and the Amazon S3 Spark job that refreshes the data.  
6. Enter your SQL query and select **Run**. 
## Next steps

- Learn about [accelerating the query performance of your external data sources]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/).
