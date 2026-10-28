---
layout: default
title: Performance Analyzer
parent: Telemetry
grand_parent: Monitoring your cluster
nav_order: 30
redirect_from:
  - /monitoring-plugins/pa/
  - /monitoring-plugins/pa/index/
  - /monitoring-your-cluster/pa/
  - /monitoring-your-cluster/pa/index/
  - /monitoring-plugins/pa/api/
  - /monitoring-your-cluster/pa/api/
  - /monitoring-plugins/pa/dashboards/
  - /monitoring-your-cluster/pa/dashboards/
  - /monitoring-plugins/pa/reference/
  - /monitoring-your-cluster/pa/reference/
  - /monitoring-plugins/pa/rca/index/
  - /monitoring-your-cluster/pa/rca/
  - /monitoring-your-cluster/pa/rca/index/
  - /monitoring-plugins/pa/rca/api/
  - /monitoring-your-cluster/pa/rca/api/
  - /monitoring-plugins/pa/rca/reference/
  - /monitoring-your-cluster/pa/rca/reference/
  - /monitoring-your-cluster/pa/rca/shard-hotspot/
---

# Performance Analyzer

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6750).
{: .warning}

The Performance Analyzer plugin collects JVM, disk, thread pool, cache, and per-shard operation metrics on each node and publishes them as OpenSearch [metrics]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/metrics/). OpenSearch exports the metrics to a log file or to an OpenTelemetry Collector.

Starting with OpenSearch 3.0, the Performance Analyzer root cause analysis (RCA) agent has been removed. The agent served the Performance Analyzer API on port 9600, so the metrics, batch metrics, and RCA APIs and the PerfTop dashboards are not available. For more information, see [Breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/#performance-analyzer-plugin).
{: .note}

## Prerequisites

The Performance Analyzer plugin is installed by default, except on Windows, where the plugin is not available.

Before you enable Performance Analyzer, enable telemetry and metrics on each node. For more information, see [Enabling telemetry]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/index/#enabling-telemetry).

## Enabling Performance Analyzer

Performance Analyzer is disabled by default. To enable it, send the following request:

```json
POST _plugins/_performanceanalyzer/cluster/config
{
  "enabled": true
}
```
{% include copy-curl.html %}

Then configure Performance Analyzer to publish its metrics using the metrics framework by setting `collectorsSetting` to `1`. The default value, `0`, does not publish metrics using the metrics framework:

```json
POST _plugins/_performanceanalyzer/cluster/config
{
  "collectorsSetting": 1
}
```
{% include copy-curl.html %}

To verify the configuration, send the following request:

```json
GET _plugins/_performanceanalyzer/cluster/config
```
{% include copy-curl.html %}

When Performance Analyzer is enabled, `currentPerformanceAnalyzerClusterState` is `1` and `collectorsSetting` is `1`:

```json
{
  "currentPerformanceAnalyzerClusterState": 1,
  "shardsPerCollection": 0,
  "collectorsSetting": 1,
  "batchMetricsRetentionPeriodMinutes": 7
}
```

The metrics appear at the next metrics publish interval. With the default exporter, OpenSearch writes the metrics to the `<cluster-name>_otel_metrics.log` file in the logs directory.

## Disabling Performance Analyzer

To stop collecting metrics, send the following request:

```json
POST _plugins/_performanceanalyzer/cluster/config
{
  "enabled": false
}
```
{% include copy-curl.html %}

## Metrics

Performance Analyzer publishes the following metrics.

Metric | Description
:--- | :---
`heap_used` | The amount of heap memory used.
`heap_max` | The maximum amount of heap memory.
`gc_collection_event` | The number of garbage collection events.
`gc_collection_time` | The time spent on garbage collection.
`disk_utilization` | The disk utilization.
`disk_wait_time` | The disk wait time.
`disk_service_rate` | The disk service rate.
`threadpool_active_threads` | The number of active threads in a thread pool.
`threadpool_total_threads` | The total number of threads in a thread pool.
`threadpool_queue_size` | The number of tasks in a thread pool queue.
`threadpool_queue_capacity` | The capacity of a thread pool queue.
`threadpool_rejected_reqs` | The number of requests rejected by a thread pool.
`cache_field_data_size` | The size of the field data cache.
`cache_max_size` | The maximum size of a cache.
`cache_request_hit` | The number of request cache hits.
`cache_request_miss` | The number of request cache misses.
`cache_request_size` | The size of the request cache.
`shard_search_rate` | The number of search operations per shard.
`shard_search_latency` | The search latency per shard for each search phase.
`shard_indexing_rate` | The number of indexing operations per shard.
`shard_indexing_latency` | The indexing latency per shard.
`shard_cpu_utilization` | The CPU utilization per shard for an operation.
`shard_heap_allocated` | The heap memory allocated per shard for an operation.
`cpu_utilization` | The CPU utilization per shard for a search phase or an operation.
`heap_allocated` | The heap memory allocated per shard for a search phase or an operation.

## Common issues

When a node starts, Performance Analyzer logs errors about the missing `performance-analyzer.properties` and `plugin-stats-metadata` files in the `config/opensearch-performance-analyzer/` directory. When these files are missing, Performance Analyzer uses its default configuration, so the errors do not prevent it from publishing metrics.
