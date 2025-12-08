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

You can connect OpenSearch to your Amazon Simple Storage Service (Amazon S3) data source using the OpenSearch Dashboards interface and then query that data, optimize query performance, define tables, and integrate your S3 data.

## Prerequisites

Before connecting a data source, verify that the following requirements are met:

- You have access to Amazon S3 and the [AWS Glue Data Catalog](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/s3glue_connector.md#id2).
- You have access to OpenSearch and OpenSearch Dashboards.
- You have an understanding of OpenSearch data source and connector concepts. See the [developer documentation](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/datasources.md#introduction) for more information.

## Connect your data source 

To connect your data source, follow these steps:

1. From the OpenSearch Dashboards main menu, go to **Management** > **Dashboards Management** > **Data sources**.
2. On the **Data sources** page, select **Create data source connection** > **Amazon S3**.
3. On the **Configure Amazon S3 data source** page, enter the data source, authentication details, and permissions.
4. Select the **Review Configuration** button to verify the connection details.
5. Select the **Connect to Amazon S3** button to establish a connection.

## Manage your data source

To manage your data source, follow these steps:

1. On the **Manage data sources** tab, choose a date source from the list. 
2. On the page for the data source, you can manage the data source, choose a use case, and configure access controls. 
3. (Optional) Explore the Amazon S3 use cases, including querying your data and optimizing query performance. Refer to the [**Next steps**](#next-steps) section to learn more about each use case.

## Limitations

This feature is currently under development, including the data integration functionality. For up-to-date information, refer to the [developer documentation on GitHub](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#limitations).

## Next steps

- Learn about [querying your data in Data Explorer]({{site.url}}{{site.baseurl}}/dashboards/management/query-data-source/) through OpenSearch Dashboards.
- Learn about [optimizing the query performance of your external data sources]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/), such as Amazon S3, through Query Workbench. 
- Learn about [Amazon S3 and AWS Glue Data Catalog](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/s3glue_connector.md) and the APIS used with Amazon S3 data sources, including configuration settings and query examples.
- Learn about [managing your indexes]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
