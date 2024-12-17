---
layout: default
title: Scheduled Query Acceleration
parent: Data sources
nav_order: 18
has_children: false
---

# Scheduled Query Acceleration
Introduced 2.17
{: .label .label-purple }

Scheduled Query Acceleration (SQA) is designed to optimize direct queries from OpenSearch to external data sources, such as Amazon Simple Storage Service (Amazon S3). It addresses issues often faced when managing and refreshing indexes, views, and data in an automated way. 

Query acceleration is facilitated by secondary indexes like [skipping indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#skipping-indexes), [covering indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#covering-indexes), or [materialized views]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#materialized-views). When queries run, they use these indexes instead of directly querying S3. 

The secondary indexes need to be refreshed periodically to stay current with the Amazon S3 data. This refresh can be scheduled using an internal scheduler (within Spark) or an external scheduler.

Using SQA provides the following benefits:

- **Cost reduction through optimized resource usage**: SQA reduces the operational load on driver nodes, lowering the costs associated with maintaining auto-refresh for indexes and views.

- **Improved observability of refresh operations**: SQA provides visibility into index states and refresh timings, offering insights into data processing and the current system state.

- **Better control over refresh scheduling**: SQA allows flexible scheduling of refresh intervals, helping manage resource usage and refresh frequency according to specific requirements.

- **Simplified index management**: SQA enables updates to index settings, such as refresh intervals, in a single query, simplifying workflows.

## Concepts

Before configuring SQA, familiarize yourself with the following topics:

- [Optimizing query performance using OpenSearch indexing]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/)
- [Flint index refresh](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#flint-index-refresh)
- [Index State Management](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#index-state-transition-1)

## Prerequisites

Before configuring SQA, verify that the following requirements are met:

- Ensure you're running OpenSearch version 2.17 or later.
- Ensure you have the SQL plugin installed. The SQL plugin is part of most OpenSearch distributions. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).
- Ensure you have configured an Amazon S3 and Amazon EMR Serverless (needed for access to Apache Spark). 

## Configuring SQA

To configure SQA, perform the following steps.

### Step 1: Configure the OpenSearch cluster settings

Configure the following cluster settings:

-  **Enable asynchronous query execution**: Set `plugins.query.executionengine.async_query.enabled` to `true` (default value):
    ```json
    PUT /_cluster/settings
    {
      "transient": {
        "plugins.query.executionengine.async_query.enabled": "true"
      }
    }
    ```
    {% include copy-curl.html %}

    For more information, see [Settings](https://github.com/opensearch-project/sql/blob/main/docs/user/admin/settings.rst#pluginsqueryexecutionengineasync_queryenabled).

- **Configure the external scheduler interval for asynchronous queries**: This setting defines how often the external scheduler checks for tasks, allowing customization of refresh frequency. There is no default value for this setting so you must explicitly configure it. Adjusting the interval based on workload can optimize resources and manage costs:
    ```json
    PUT /_cluster/settings
    {
      "transient": {
        "plugins.query.executionengine.async_query.external_scheduler.interval": "10 minutes"
      }
    }
    ```
    {% include copy-curl.html %}

    For more information, see [Settings](https://github.com/opensearch-project/sql/blob/main/docs/user/admin/settings.rst#pluginsqueryexecutionengineasync_queryexternal_schedulerinterval).

### Step 2: Configure a data source

Connect OpenSearch to your Amazon S3 data source using the OpenSearch Dashboards interface. For more information, see [Connecting Amazon S3 to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/S3-data-source/).

After this step, you can directly query your S3 data (the primary data source) using [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/).

### Step 3: Configure query acceleration

Configure a skipping index, covering index, or materialized view. These secondary data sources are additional data structures that improve query performance by optimizing queries on external data sources, such as Amazon S3. For more information, see [Optimize query performance using OpenSearch indexing]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/).

After this step, you can [run accelerated queries](#running-an-accelerated-query) using one of the secondary data sources. 

## Running an accelerated query

You can run accelerated queries in [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/). To run an accelerated query, use the following syntax:

```sql
CREATE SKIPPING INDEX example_index
WITH (
    auto_refresh = true,
    refresh_interval = '15 minutes'
);
```
{% include copy.html %}

By default, the query uses an external scheduler. To specify an internal scheduler, set `scheduler_mode` to `internal`:

```sql
CREATE SKIPPING INDEX example_index
WITH (
    auto_refresh = true,
    refresh_interval = '15 minutes',
    scheduler_mode = 'internal'
);
```
{% include copy.html %}

## Parameters

When creating indexes using an accelerated query, you can specify the following parameters in the `WITH` clause to control the refresh behavior, scheduling, and timing.

| Parameter  | Description  | 
|:--- | :--- | 
| `auto_refresh`      | Enables automatic refresh for the index. If `true`, the index refreshes automatically at the specified interval. If `false`, refresh must be triggered manually using the `REFRESH` statement. Default is `false`.   |
| `refresh_interval`  | Defines the time interval between refresh operations for the index, which determines how frequently new data is integrated into the index. This is applicable only when `auto_refresh` is enabled. The interval determines how frequently new data is integrated and can be specified in formats like `1 minute` or `10 seconds`. For valid time units, see [Time units](#time-units).| 
| `scheduler_mode`    | Specifies the scheduling mode for auto-refresh (internal or external scheduling). The external scheduler requires a `checkpoint_location` (a path for refresh job checkpoints) for state management. For more information, see [Starting streaming queries](https://spark.apache.org/docs/3.5.1/structured-streaming-programming-guide.html#starting-streaming-queries). Valid values are `internal` and `external`.| 

For more information and additional available parameters, see [Flint index refresh](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#flint-index-refresh).

## Time units

You can specify the following time units when defining time intervals:

- Milliseconds: `ms`, `millisecond`, or `milliseconds`
- Seconds: `s`, `second`, or `seconds`
- Minutes: `m`, `minute`, or `minutes`
- Hours: `h`, `hour`, or `hours`
- Days: `d`, `day`, or `days`

## Creating a scheduled refresh job

To create an index with a scheduled refresh job, use the following statement:

```sql
CREATE SKIPPING INDEX example_index
WITH (
    auto_refresh = true,
    refresh_interval = '15 minutes',
    scheduler_mode = 'external'
);
```
{% include copy.html %}

## Monitoring index status

To monitor index status, use the following statement:

```sql
SHOW FLINT INDEXES IN spark_catalog.default;
```
{% include copy.html %}

## Managing scheduled jobs

Use the following commands to manage scheduled jobs.

### Enabling jobs

To disable the external scheduler, use the ALTER command with a manual refresh:

```sql
ALTER MATERIALIZED VIEW myglue_test.default.count_by_status_v9 WITH (auto_refresh = false);
```
{% include copy.html %}

To enable the external scheduler, use the ALTER command with an auto-refresh:

```sql
ALTER MATERIALIZED VIEW myglue_test.default.count_by_status_v9 WITH (auto_refresh = true);
```
{% include copy.html %}

### Updating schedules

To update the schedule and modify refresh settings, specify the `refresh_interval` in the `WITH` clause:

```sql
ALTER INDEX example_index
WITH (refresh_interval = '30 minutes');
```
{% include copy.html %}

### Updating the scheduler mode

To update the scheduler mode, specify the `scheduler_mode` in the `WITH` clause:

```sql
ALTER MATERIALIZED VIEW myglue_test.default.count_by_status_v9 WITH (scheduler_mode = 'internal');
```
{% include copy.html %}

### Verifying scheduler job status

To verify scheduler job status, use the following request:

```json
GET /.async-query-scheduler/_search
```
{% include copy-curl.html %}

## Best practices

We recommend the following best practices when using SQA.

### Performance optimization

We recommend the following practices for best performance:

- **Recommended refresh intervals**: Choosing the right refresh interval is crucial for balancing resource usage and system performance. Consider your workload requirements and the freshness of data you need when setting intervals.

- **Concurrent job limits**: Limit the number of concurrent jobs running to avoid overloading system resources. Monitor system capacity and adjust job limits accordingly to ensure optimal performance.

- **Resource usage**: Efficient resource allocation is key to maximizing performance. Properly allocate memory, CPU, and I/O based on the workload and the type of queries you're running.

### Cost management

We recommend the following practices to reduce costs:

- **Use an external scheduler**: An external scheduler offloads refresh operations, reducing the demand on core driver nodes.

- **Configure a refresh interval for your use case**: Longer refresh intervals lead to reduced costs but may impact data freshness.

- **Optimize the refresh schedule**: Adjust refresh intervals based on workload patterns to reduce unnecessary refresh operations.

- **Monitor costs**: Regularly monitor the costs related to scheduled queries and refresh operations. Using observability tools can help you gain insights into resource usage and costs over time.

## Validations

You can validate your settings by running a test query and verifying the scheduler configurations:

```sql
SHOW FLINT INDEXES EXTENDED
```
{% include copy.html %}

For more information, see [OpenSearch Spark documentation](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#all-indexes).

## Troubleshooting

If the refresh operation is not triggering as expected, ensure the `auto_refresh` setting is enabled and the refresh interval is properly configured.

## Next steps

For answers to more technical questions, see the [OpenSearch Spark RFC](https://github.com/opensearch-project/opensearch-spark/issues/416).