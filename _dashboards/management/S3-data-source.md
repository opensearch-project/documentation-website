---
layout: default
title: Connecting Amazon S3 to OpenSearch
parent: Data sources
nav_order: 15
has_children: true
---

# Connecting Amazon S3 to OpenSearch
Introduced 2.11
{: .label .label-purple }

Starting with OpenSearch 2.11, you can connect OpenSearch to your Amazon S3 data source using the OpenSearch Dashboards user interface (UI). You can then query that data, optimize query performance, define tables, and integrate your S3 data from a single UI.  

## Prerequisites

To connect data from Amazon S3 to OpenSearch using OpenSearch Dashboards, you must have:

- Access to Amazon S3.
- Access to OpenSearch and OpenSearch Dashboards.
- Basic understanding of data and data flow.

## Connect your Amazon S3 data source 

To connect your Amazon S3 data source, follow these steps:

1. From the OpenSearch Dashboards main menu, select **Management** > **Data sources**.
2. From the **Data sources** page, select **New data source** > **S3**. A screenshot of the UI is shown in the following image.

    ![Data sources UI]({{site.url}}{{site.baseurl}}/images/dashboards/data-sources-UI.png)

3. From the **Configure Amazon S3 data source** page, enter the required **Data source details**, **AWS Glue authentication details**, **AWS Glue index store details**, and **Query permissions**.

    ![Amazon S3 configuration UI]({{site.url}}{{site.baseurl}}/images/dashboards/S3-config-UI.png)

4. Select the **Review Configuration** button and verify the details.
5. Select the **Connect to Amazon S3** button.

## Manage your Amazon S3 data source

Once you've connected your Amazon S3 data source, you can explore that data through the **Manage data sources** tab. The following steps guide you through using this functionality:

1. From the **Manage data sources** tab, choose a date source from the list. 
2. From that data source's page, manage the data source, choose a use case, and manage access controls and configurations. An example UI is shown in the following image: 

    ![Manage data sources UI]({{site.url}}{{site.baseurl}}/images/dashboards/manage-data-source-UI.png)

3. (Optional) Explore the Amazon S3 use cases. Go to **Next steps** to learn more about each use case.

## Limitations

This feature is still under development, including the data integration functionality. The following are some limitations:

- 

## Next steps

- Learn about [querying your data in Data Explorer]() through OpenSearch Dashboards.
- Learn about ways to [optimize query performance of your external data sources](), such as Amazon S3, through Query Workbench. 
- Learn about the [Amazon S3 and AWS Glue connector](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/s3glue_connector.rst), including configuration settings and query examples.
- Learn about [managing your indexes]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
  
