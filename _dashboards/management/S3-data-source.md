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

Starting with OpenSearch 2.11, you can connect OpenSearch to your Amazon Simple Storage Service (Amazon S3) data source using the OpenSearch Dashboards UI. You can then query that data, optimize query performance, define tables, and integrate your S3 data within a single UI.  
Starting with OpenSearch 2.11, you can connect OpenSearch to your Amazon S3 data source using the OpenSearch Dashboards user interface (UI). You can then query that data, optimize query performance, define tables, and integrate your S3 data from a single UI.  

## Prerequisites

To connect data from Amazon S3 to OpenSearch using OpenSearch Dashboards, you must have:

- Access to Amazon S3 and the [AWS Glue Data Catalog](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/s3glue_connector.rst#id2).
- Access to OpenSearch and OpenSearch Dashboards.
- An understanding of OpenSearch data source and connector concepts. See the [developer documentation](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/datasources.rst#introduction) for information about these concepts.

## Connect your Amazon S3 data source 

To connect your Amazon S3 data source, follow these steps:

1. From the OpenSearch Dashboards main menu, select **Management** > **Data sources**.
2. On the **Data sources** page, select **New data source** > **S3**. An example UI is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/data-sources-UI.png" alt="Amazon S3 data sources UI" width="700"/>

3. On the **Configure Amazon S3 data source** page, enter the required **Data source details**, **AWS Glue authentication details**, **AWS Glue index store details**, and **Query permissions**. An example UI is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/S3-config-UI.png" alt="Amazon S3 configuration UI" width="700"/>

4. Select the **Review Configuration** button and verify the details.
5. Select the **Connect to Amazon S3** button.

## Manage your Amazon S3 data source

Once you've connected your Amazon S3 data source, you can explore your data through the **Manage data sources** tab. The following steps guide you through using this functionality:

1. On the **Manage data sources** tab, choose a date source from the list. 
2. On that data source's page, you can manage the data source, choose a use case, and manage access controls and configurations. An example UI is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/manage-data-source-UI.png" alt="Manage data sources UI" width="700"/>

3. (Optional) Explore the Amazon S3 use cases, including querying your data and optimizing query performance. Go to **Next steps** to learn more about each use case.

## Limitations

This feature is still under development, including the data integration functionality. For real-time updates, see the [developer documentation on GitHub](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#limitations).

## Next steps

- Learn about [querying your data in Data Explorer]({{site.url}}{{site.baseurl}}/dashboards/management/query-data-source/) through OpenSearch Dashboards.
- Learn about ways to [optimize the query performance of your external data sources]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/), such as Amazon S3, through Query Workbench. 
- Learn about [Amazon S3 and AWS Glue Data Catalog](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/s3glue_connector.rst) and the APIS used with Amazon S3 data sources, including configuration settings and query examples.
- Learn about [managing your indexes]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
  
