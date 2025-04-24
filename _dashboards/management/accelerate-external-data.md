---
layout: default
title: Optimizing query performance using OpenSearch indexing
parent: Data sources
nav_order: 17
canonical_url: https://docs.opensearch.org/docs/latest/dashboards/management/accelerate-external-data/
---

# Optimizing query performance using OpenSearch indexing
Introduced 2.11
{: .label .label-purple }


Query performance can be slow when using external data sources for reasons such as network latency, data transformation, and data volume. You can optimize your query performance by using OpenSearch indexes, such as a skipping index or a covering index. 

- A _skipping index_ uses skip acceleration methods, such as partition, minimum and maximum values, and value sets, to ingest and create compact aggregate data structures. This makes them an economical option for direct querying scenarios. For more information, see [Skipping indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#skipping-indexes).
- A _covering index_ ingests all or some of the data from the source into OpenSearch and makes it possible to use all OpenSearch Dashboards and plugin functionality. For more information, see [Covering indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#covering-indexes).
- A _materialized view_ enhances query performance by storing precomputed and aggregated data from the source data. For more information, see [Materialized views]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#materialized-views).

For comprehensive guidance on each indexing process, see the [Flint Index Reference Manual](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md). 

## Data sources use case: Accelerate performance

To get started with accelerating query performance, perform the following steps:

1. Go to **OpenSearch Dashboards** > **Query Workbench** and select your data source from the **Data sources** dropdown menu.
2. From the navigation menu, select a database.
3. View the results in the table and confirm that you have the correct data.
4. Create an OpenSearch index by following these steps:
    1. Select **Accelerate data**. A pop-up window appears. 
    2. Enter your database and table details under **Select data fields**.
5. For **Acceleration type**, select the type of acceleration according to your use case. Then, enter the information for your acceleration type. For more information, see the following sections:
      - [Skipping indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#skipping-indexes)
      - [Covering indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#covering-indexes)
      - [Materialized views]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#materialized-views)

## Skipping indexes

A _skipping index_ uses skip acceleration methods, such as partition, min/max, and value sets, to ingest data using compact aggregate data structures. This makes them an economical option for direct querying scenarios.

With a skipping index, you can index only the metadata of the data stored in Amazon S3. When you query a table with a skipping index, the query planner references the index and rewrites the query to efficiently locate the data, instead of scanning all partitions and files. This allows the skipping index to quickly narrow down the specific location of the stored data.

### Define skipping index settings

1. Under **Skipping index definition**, select **Generate** to automatically generate a skipping index. Alternately, to manually choose the fields you want to add, select **Add fields**. Choose from the following types:
  - `Partition`: Uses data partition details to locate data. This type is best for partitioning-based columns such as year, month, day, hour.
  - `MinMax`: Uses lower and upper bound of the indexed column to locate data. This type is best for numeric columns.
  - `ValueSet`: Uses a unique value set to locate data. This type is best for columns with low to moderate cardinality that require exact matching.
  - `BloomFilter`: Uses the bloom filter algorithm to locate data. This type is best for columns with high cardinality that do not require exact matching.
2. Select **Create acceleration** to apply your skipping index settings. 
3. View the skipping index query details and then click **Run**. OpenSearch adds your index to the left navigation pane.

Alternately, you can manually create a skipping index using Query Workbench. Select your data source from the dropdown and run a query like the following:

```sql
CREATE SKIPPING INDEX
ON datasourcename.gluedatabasename.vpclogstable(
 `srcaddr` BLOOM_FILTER, 
 `dstaddr` BLOOM_FILTER, 
 `day` PARTITION, 
 `account_id`BLOOM_FILTER
 ) WITH (
index_settings = '{"number_of_shards":5,"number_of_replicas":1}',
auto_refresh = true,
checkpoint_location = 's3://accountnum-vpcflow/AWSLogs/checkpoint'
)
```

## Covering indexes

A _covering index_ ingests all or some of the data from the source into OpenSearch and makes it possible to use all OpenSearch Dashboards and plugin functionality.

With a covering index, you can ingest data from a specified column in a table. This is the most performant of the three indexing types. Because OpenSearch ingests all data from your desired column, you get better performance and can perform advanced analytics.

OpenSearch creates a new index from the covering index data. You can use this new index to create visualizations, or for anomaly detection and geospatial capabilities. You can manage the covering view index with Index State Management. For more information, see [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).

### Define covering index settings

1. For **Index name**, enter a valid index name. Note that each table can have multiple covering indexes.
2. Choose a **Refresh type**. By default, OpenSearch automatically refreshes the index. Otherwise, you must manually trigger a refresh using a REFRESH statement.
3. Enter a **Checkpoint location**, which is a path for refresh job checkpoints. The location must be a path in a file system compatible with the Hadoop Distributed File System (HDFS). For more information, see [Starting streaming queries](https://spark.apache.org/docs/3.5.1/structured-streaming-programming-guide.html#starting-streaming-queries).
4. Define the covering index fields by selecting **(add fields here)** under **Covering index definition**. 
5. Select **Create acceleration** to apply your covering index settings.
6. View the covering index query details and then click **Run**. OpenSearch adds your index to the left navigation pane.

Alternately, you can manually create a covering index on your table using Query Workbench. Select your data source from the dropdown and run a query like the following:

```sql
CREATE INDEX vpc_covering_index
ON datasourcename.gluedatabasename.vpclogstable (version, account_id, interface_id, 
srcaddr, dstaddr, srcport, dstport, protocol, packets, 
bytes, start, action, log_status STRING, 
`aws-account-id`, `aws-service`, `aws-region`, year, 
month, day, hour )
WITH (
  auto_refresh = true,
  refresh_interval = '15 minute',
  checkpoint_location = 's3://accountnum-vpcflow/AWSLogs/checkpoint'
)
```

## Materialized views

With _materialized views_, you can use complex queries, such as aggregations, to power Dashboards visualizations. Materialized views ingest a small amount of your data, depending on the query, into OpenSearch. OpenSearch then forms an index from the ingested data that you can use for visualizations. You can manage the materialized view index with Index State Management. For more information, see [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).

### Define materialized view settings

1. For **Index name**, enter a valid index name. Note that each table can have multiple covering indexes.
2. Choose a **Refresh type**. By default, OpenSearch automatically refreshes the index. Otherwise, you must manually trigger a refresh using a `REFRESH` statement.
3. Enter a **Checkpoint location**, which is a path for refresh job checkpoints. The location must be a path in an HDFS compatible file system. 
4. Enter a **Watermark delay**, which defines how late data can come and still be processed, such as 1 minute or 10 seconds.
5. Define the covering index fields under **Materialized view definition**.
6. Select **Create acceleration** to apply your materialized view index settings.
7. View the materialized view query details and then click **Run**. OpenSearch adds your index to the left navigation pane.

Alternately, you can manually create a materialized view index on your table using Query Workbench. Select your data source from the dropdown and run a query like the following:

```sql
CREATE MATERIALIZED VIEW {table_name}__week_live_mview AS
  SELECT
    cloud.account_uid AS `aws.vpc.cloud_account_uid`,
    cloud.region AS `aws.vpc.cloud_region`,
    cloud.zone AS `aws.vpc.cloud_zone`,
    cloud.provider AS `aws.vpc.cloud_provider`,

    CAST(IFNULL(src_endpoint.port, 0) AS LONG) AS `aws.vpc.srcport`,
    CAST(IFNULL(src_endpoint.svc_name, 'Unknown') AS STRING)  AS `aws.vpc.pkt-src-aws-service`,
    CAST(IFNULL(src_endpoint.ip, '0.0.0.0') AS STRING)  AS `aws.vpc.srcaddr`,
    CAST(IFNULL(src_endpoint.interface_uid, 'Unknown') AS STRING)  AS `aws.vpc.src-interface_uid`,
    CAST(IFNULL(src_endpoint.vpc_uid, 'Unknown') AS STRING)  AS `aws.vpc.src-vpc_uid`,
    CAST(IFNULL(src_endpoint.instance_uid, 'Unknown') AS STRING)  AS `aws.vpc.src-instance_uid`,
    CAST(IFNULL(src_endpoint.subnet_uid, 'Unknown') AS STRING)  AS `aws.vpc.src-subnet_uid`,

    CAST(IFNULL(dst_endpoint.port, 0) AS LONG) AS `aws.vpc.dstport`,
    CAST(IFNULL(dst_endpoint.svc_name, 'Unknown') AS STRING) AS `aws.vpc.pkt-dst-aws-service`,
    CAST(IFNULL(dst_endpoint.ip, '0.0.0.0') AS STRING)  AS `aws.vpc.dstaddr`,
    CAST(IFNULL(dst_endpoint.interface_uid, 'Unknown') AS STRING)  AS `aws.vpc.dst-interface_uid`,
    CAST(IFNULL(dst_endpoint.vpc_uid, 'Unknown') AS STRING)  AS `aws.vpc.dst-vpc_uid`,
    CAST(IFNULL(dst_endpoint.instance_uid, 'Unknown') AS STRING)  AS `aws.vpc.dst-instance_uid`,
    CAST(IFNULL(dst_endpoint.subnet_uid, 'Unknown') AS STRING)  AS `aws.vpc.dst-subnet_uid`,
    CASE
      WHEN regexp(dst_endpoint.ip, '(10\\..*)|(192\\.168\\..*)|(172\\.1[6-9]\\..*)|(172\\.2[0-9]\\..*)|(172\\.3[0-1]\\.*)')
        THEN 'ingress'
      ELSE 'egress'
      END AS `aws.vpc.flow-direction`,

    CAST(IFNULL(connection_info['protocol_num'], 0) AS INT) AS `aws.vpc.connection.protocol_num`,
    CAST(IFNULL(connection_info['tcp_flags'], '0') AS STRING)  AS `aws.vpc.connection.tcp_flags`,
    CAST(IFNULL(connection_info['protocol_ver'], '0') AS STRING)  AS `aws.vpc.connection.protocol_ver`,
    CAST(IFNULL(connection_info['boundary'], 'Unknown') AS STRING)  AS `aws.vpc.connection.boundary`,
    CAST(IFNULL(connection_info['direction'], 'Unknown') AS STRING)  AS `aws.vpc.connection.direction`,

    CAST(IFNULL(traffic.packets, 0) AS LONG) AS `aws.vpc.packets`,
    CAST(IFNULL(traffic.bytes, 0) AS LONG) AS `aws.vpc.bytes`,

    CAST(FROM_UNIXTIME(time / 1000) AS TIMESTAMP) AS `@timestamp`,
    CAST(FROM_UNIXTIME(start_time / 1000) AS TIMESTAMP) AS `start_time`,
    CAST(FROM_UNIXTIME(start_time / 1000) AS TIMESTAMP) AS `interval_start_time`,
    CAST(FROM_UNIXTIME(end_time / 1000) AS TIMESTAMP) AS `end_time`,
    status_code AS `aws.vpc.status_code`,

    severity AS `aws.vpc.severity`,
    class_name AS `aws.vpc.class_name`,
    category_name AS `aws.vpc.category_name`,
    activity_name AS `aws.vpc.activity_name`,
    disposition AS `aws.vpc.disposition`,
    type_name AS `aws.vpc.type_name`,

    region AS `aws.vpc.region`,
    accountid AS `aws.vpc.account-id`
  FROM
  datasourcename.gluedatabasename.vpclogstable 
WITH (
  auto_refresh = true,
  refresh_interval = '15 Minute',
  checkpoint_location = 's3://accountnum-vpcflow/AWSLogs/checkpoint',
  watermark_delay = '1 Minute',
)
```

## Limitations

This feature is still under development, so there are some limitations. For real-time updates, see the [developer documentation on GitHub](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#limitations).
