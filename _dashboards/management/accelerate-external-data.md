---
layout: default
title: Optimize query performance using an acceleration index
parent: Connecting Amazon S3 to OpenSearch
grand_parent: Data sources
nav_order: 15
has_children: false
---

# Optimize query performance using an acceleration index
Introduced 2.11
{: .label .label-purple }

Query performance can be slow when using external data sources for reasons such as network latency, data transformation, and data volume. You can optimize your query performance by using an acceleration index. 

To get started with the **Accelerate performance** use case available under **Data sources**, follow these steps:

1. Go to **OpenSearch Dashboards** > **Query Workbench** and select your Amazon S3 data source from the **Data Sources** dropdown menu in the upper-left corner.
2. From the left-side navigation menu, select a database. An example using the `http_logs` database is shown in the following image:

    ![Query Workbench accelerate data UI]({{site.url}}{{site.baseurl}}/images/dashboards/query-workbench-accelerate-data.png)

3. View the results in the table.

To create an acceleration index, follow these steps:

1. Select the **Accelerate data** button. A pop-up window appears.
2. Enter details in the **Select data fields**. In the **Database** field, you will select the desired acceleration index, **Skipping index** or **Covering index**. An example is shown in the following image:

    ![Accelerate data pop-up window]({{site.url}}{{site.baseurl}}/images/dashboards/accelerate-data-popup.png)

3. Under **Index settings**, enter the details for your acceleration index. For information about naming, select **Help**. Note that an Amazon S3 table can only have one skipping index at a time. An example is shown in the following image:

    ![Skipping index settings]({{site.url}}{{site.baseurl}}/images/dashboards/skipping-index-settings.png)

### Define skipping index settings

1. Under **Skipping index definition**, select the **Add fields** button to define the skipping index acceleration method and choose the fields you want to add. An example is shown in the following image:

    ![Skipping index add fields]({{site.url}}{{site.baseurl}}/images/dashboards/add-fields-skipping-index.png)

2. Select the **Copy Query to Editor** button to apply your skipping index settings. 
3. View the covering index query details in the table pane and then select the **Run** button. Your index is added the left-side navigation menu containing the list of your databases. An example is shown in the following image:

    

### Define cover index settings

1. Under **Index settings**, enter a valid index name. Note that each Amazon S3 table can have multiple covering indexes. An example is shown in the following image:

    ![Covering index settings]({{site.url}}{{site.baseurl}}/images/dashboards/covering-index-naming.png)


2. Once you have added the index name, define the covering index fields by selecting `(add fields here)` under **Covering index definition**. An example is shown in the following image:

    ![Covering index field naming]({{site.url}}{{site.baseurl}}/images/dashboards/covering-index-fields.png)

3. Select the **Copy Query to Editor** button to apply your covering index settings.
4. View the covering index query details in the table pane and then select the **Run** button. Your index is added the left-side navigation menu containing the list of your databases.   
 
    ![Run index in Query Workbench]({{site.url}}{{site.baseurl}}/images/dashboards/run-index-query-workbench.png)

## Limitations

This feature is still under development, so there are some limitations:

- 
- 