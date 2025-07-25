---
layout: default
title: Scheduled Query Acceleration
parent: Data sources
nav_order: 18
has_children: false
canonical_url: https://docs.opensearch.org/latest/dashboards/management/scheduled-query-acceleration/
---

# Scheduled Query Acceleration
Introduced 2.17
{: .label .label-purple }

Scheduled Query Acceleration (SQA) is designed to optimize queries sent directly from OpenSearch to external data sources, such as Amazon Simple Storage Service (Amazon S3). It uses automation to address issues commonly encountered when managing and refreshing indexes, views, and data. 

Query acceleration is facilitated by secondary indexes like [skipping indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#skipping-indexes), [covering indexes]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#covering-indexes), or [materialized views]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/#materialized-views). When queries run, they use these indexes instead of directly querying Amazon S3. 

The secondary indexes need to be refreshed periodically in order to remain current with the Amazon S3 data. This refresh operation can be scheduled using either an internal scheduler (within Spark) or an external scheduler.

SQA provides the following benefits:

- **Cost reduction through optimized resource usage**: SQA reduces the operational load on driver nodes, lowering the costs associated with maintaining auto-refresh for indexes and views.

- **Improved observability of refresh operations**: SQA provides visibility into index states and refresh timing, offering insights into data processing and the current system state.

- **Better control over refresh scheduling**: SQA allows flexible scheduling of refresh intervals, helping you to manage resource usage and refresh frequency according to specific requirements.

- **Simplified index management**: SQA enables updates to index settings, such as refresh intervals, in a single query, which simplifies workflows.

## Concepts

Before configuring SQA, familiarize yourself with the following topics:

- [Optimizing query performance using OpenSearch indexing]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/)
- [Flint index refresh](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#flint-index-refresh)
- [Index State Management](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#index-state-transition-1)

## Prerequisites

Before configuring SQA, verify that the following requirements are met:

- Ensure you're running OpenSearch version 2.17 or later.
- Ensure you have the SQL plugin installed. The SQL plugin is included in most OpenSearch distributions. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).
- Ensure you have configured a data source (in this example, Amazon S3): Configure a skipping index, covering index, or materialized view. These secondary data sources are additional data structures that improve query performance by optimizing queries sent to external data sources, such as Amazon S3. For more information, see [Optimizing query performance using OpenSearch indexing]({{site.url}}{{site.baseurl}}/dashboards/management/accelerate-external-data/).
- Configure Amazon EMR Serverless (needed for access to Apache Spark). 

## Configuring SQA settings

If you want to override default configuration values, change the following cluster settings:

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

- **Configure the external scheduler interval for asynchronous queries**: This setting defines how often the external scheduler checks for tasks, allowing customization of refresh frequency. There is no default value for this setting: if this value is empty, the default comes from `opensearch-spark` and is `5 minutes`. Adjusting the interval based on workload volume can help you to optimize resources and manage costs:
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

By default, the query uses an external scheduler. To use an internal scheduler, set `scheduler_mode` to `internal`:

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

When creating indexes using an accelerated query, you can specify the following parameters in the `WITH` clause to control refresh behavior, scheduling, and timing.

| Parameter  | Description  | 
|:--- | :--- | 
| `auto_refresh`      | Enables automatic refresh for the index. If `true`, the index refreshes automatically at the specified interval. If `false`, the refresh operation must be triggered manually using the `REFRESH` statement. Default is `false`.   |
| `refresh_interval`  | Defines the amount of time between index refresh operations for the index, which determines how frequently new data is ingested into the index. This is applicable only when `auto_refresh` is enabled. The interval determines how frequently new data is integrated and can be specified in formats like `1 minute` or `10 seconds`. For valid time units, see [Time units](#time-units).| 
| `scheduler_mode`    | Specifies the scheduling mode for auto-refresh (internal or external scheduling). The external scheduler requires a `checkpoint_location` (a path for refresh job checkpoints) for state management. For more information, see [Starting streaming queries](https://spark.apache.org/docs/3.5.1/structured-streaming-programming-guide.html#starting-streaming-queries). Valid values are `internal` and `external`.| 

For more information and additional available parameters, see [Flint index refresh](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#flint-index-refresh).

## Time units

You can specify the following time units when defining time intervals:

- Milliseconds: `ms`, `millisecond`, or `milliseconds`
- Seconds: `s`, `second`, or `seconds`
- Minutes: `m`, `minute`, or `minutes`
- Hours: `h`, `hour`, or `hours`
- Days: `d`, `day`, or `days`

## Monitoring index status

To monitor the status of an index, use the following statement:

```sql
SHOW FLINT INDEXES IN spark_catalog.default;
```
{% include copy.html %}

## Managing scheduled jobs

Use the following commands to manage scheduled jobs.

### Enabling jobs

To disable auto-refresh using an internal or external scheduler, set `auto_refresh` to `false`:

```sql
ALTER MATERIALIZED VIEW myglue_test.default.count_by_status_v9 WITH (auto_refresh = false);
```
{% include copy.html %}

### Updating schedules

To update the schedule and modify the refresh settings, specify the `refresh_interval` in the `WITH` clause:

```sql
ALTER INDEX example_index
WITH (refresh_interval = '30 minutes');
```
{% include copy.html %}

### Switching the scheduler mode

To switch the scheduler mode, specify the `scheduler_mode` in the `WITH` clause:

```sql
ALTER MATERIALIZED VIEW myglue_test.default.count_by_status_v9 WITH (scheduler_mode = 'internal');
```
{% include copy.html %}

### Inspecting scheduler metadata

To inspect scheduler metadata, use the following request:

```json
GET /.async-query-scheduler/_search
```
{% include copy-curl.html %}

## Best practices

We recommend the following best practices when using SQA.

### Performance optimization

- **Recommended refresh intervals**: Choosing the right refresh interval is crucial for balancing resource usage and system performance. Consider your workload requirements and the freshness of the data you need when setting intervals.

- **Concurrent job limits**: Limit the number of concurrent running jobs to avoid overloading system resources. Monitor system capacity and adjust job limits accordingly to ensure optimal performance.

- **Resource usage**: Efficient resource allocation is key to maximizing performance. Properly allocate memory, CPU, and I/O based on the workload and the type of queries you're running.

### Cost management

- **Use an external scheduler**: An external scheduler offloads refresh operations, reducing demand on core driver nodes.

- **Configure a refresh interval for your use case**: Longer refresh intervals lead to reduced costs but may impact data freshness.

- **Optimize the refresh schedule**: Adjust refresh intervals based on workload patterns to reduce unnecessary refresh operations.

- **Monitor costs**: Regularly monitor costs related to scheduled queries and refresh operations. Using observability tools can help you gain insights into resource usage and costs over time.

## Validating settings

You can validate your settings by running a test query and verifying the scheduler configuration:

```sql
SHOW FLINT INDEXES EXTENDED
```
{% include copy.html %}

For more information, see the [OpenSearch Spark documentation](https://github.com/opensearch-project/opensearch-spark/blob/main/docs/index.md#all-indexes).

## Troubleshooting

If the refresh operation is not triggering as expected, ensure that the `auto_refresh` setting is enabled and the refresh interval is properly configured.
