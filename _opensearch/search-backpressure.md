---
layout: default
title: Search backpressure
nav_order: 63
has_children: false
---

# Search backpressure

Search backpressure is a mechanism to identify resource-intensive search requests and cancel them when the node is under duress. If a search request on a node or shard has breached the resource limits and does not recover within a certain threshold, it is rejected. These thresholds are dynamic and configurable through [cluster settings](#search-backpressure-settings). 

## Measuring resource consumption

To decide whether to apply search backpressure, OpenSearch periodically measures the following resource consumption statistics for each search request:

- CPU usage
- Heap usage
- Elapsed time 

An observer thread tracks the resource consumption of each task thread. It measures the resource consumption at several checkpoints during the query phase of a shard search request. If the node is determined to be under duress based on the JVM memory pressure and CPU utilization, the server examines the resource consumption for each search task. It determines if the CPU usage and elapsed time are within their fixed thresholds, and it compares the heap usage against the rolling average of the heap usage of the 100 most recent tasks. If the task is among the most resource-intensive based on these criteria, the task in canceled. 

Every minute OpenSearch can cancel at most 1% of the number of currently running search shard tasks. Once a task is canceled, OpenSearch monitors the node for the next two seconds to determine if it is still under duress.

## Canceled queries

If a query is canceled, instead of receiving search results you receive an error from the server similar to the error below:

```json
{
  "error" : {
    "root_cause" : [
      {
        "type" : "task_cancelled_exception",
        "reason" : "Task is cancelled due to high resource consumption"
      }
    ],
    "type" : "search_phase_execution_exception",
    "reason" : "all shards failed",
    "phase" : "query",
    "grouped" : true,
    "failed_shards" : [
      {
        "shard" : 0,
        "index" : "nyc_taxis",
        "node" : "MGkMkg9wREW3IVewZ7U_jw",
        "reason" : {
          "type" : "task_cancelled_exception",
          "reason" : "Task is cancelled due to high resource consumption"
        }
      }
    ]
  },
  "status" : 500
}
```

## Search backpressure modes

Search backpressure runs in `monitor_only` (default), `enforced`, or `disabled` mode. In the `enforced` mode, the server rejects search requests.  In the `monitor_only` mode, the server does not actually cancel search requests, but tracks statistics about them. You can specify the mode in the [`search_backpressure.mode`](#search-backpressure-settings) parameter.

## Search backpressure settings

Search backpressure adds several settings to the standard OpenSearch cluster settings. These settings are dynamic, so you can change the default behavior of this feature without restarting your cluster.

Setting | Default | Description
:--- | :--- | :---
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;mode | `monitor_only` | The [mode](#search-backpressure-modes) for search backpressure. Valid values are `monitor_only`, `enforced`, or `disabled`.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;interval | 1 second | The interval at which the observer thread measures the resource consumption and cancels tasks.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;cancellation_ratio | 10% | The maximum percentage of tasks to cancel out of the number of successful task completions.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;cancellation_rate | 0.003 | The maximum number of tasks to cancel per millisecond.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;cancellation_burst | 10 | The maximum number of tasks that can be canceled before no further cancellations are made.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;node_duress.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;num_consecutive_breaches | 3 | The number of consecutive limit breaches after which the node is marked in duress.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;node_duress.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cpu_threshold | 90% | The CPU usage threshold (in percentage) for a node to be considered in duress.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;node_duress.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;heap_threshold | 70% | The heap usage threshold (in percentage) for a node to be considered in duress.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_heap_threshold | 5% | The heap usage threshold (in percentage) for the sum of heap usages across all search tasks before server-side cancellation is applied.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_task_heap_threshold | 0.5% | The heap usage threshold (in percentage) for one task before it is considered for cancellation.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_task_heap_variance | 2 | The heap usage variance for one task before it is considered for cancellation. A task is considered for cancellation when `taskHeapUsage` is greater than or equal to `heapUsageMovingAverage` &middot; `variance`.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_task_cpu_time_threshold | 15 seconds | The CPU usage threshold (in milliseconds) for one task before it is considered for cancellation.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_task_elapsed_time_threshold | 30 seconds | The elapsed time threshold (in milliseconds) for one task before it is considered for cancellation.

## Search Backpressure Stats API
Introduced 2.4
{: .label .label-purple }

You can use the [nodes stats API operation]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/text-analyzers/#how-to-use-text-analyzers) to monitor server-side request cancellations.

#### Sample request

To retrieve the stats, use the following request:

```json
GET _nodes/stats/search_backpressure
```

#### Sample response

The response contains server-side request cancellation statistics:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "T7aqO6zaQX-lt8XBWBYLsA": {
      "timestamp": 1667409521070,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test",
        "shard_indexing_pressure_enabled": "true"
      },
      "search_backpressure": {
        "search_shard_task": {
          "resource_tracker_stats": {
            "heap_usage_tracker": {
              "cancellation_count": 34,
              "current_max": "1.1mb",
              "current_max_bytes": 1203272,
              "current_avg": "683.8kb",
              "current_avg_bytes": 700267,
              "rolling_avg": "1.1mb",
              "rolling_avg_bytes": 1156270
            },
            "cpu_usage_tracker": {
              "cancellation_count": 318,
              "current_max": "731.3ms",
              "current_max_millis": 731,
              "current_avg": "303.6ms",
              "current_avg_millis": 303
            },
            "elapsed_time_tracker": {
              "cancellation_count": 310,
              "current_max": "1.3s",
              "current_max_millis": 1305,
              "current_avg": "649.3ms",
              "current_avg_millis": 649
            }
          },
          "cancellation_stats": {
            "cancellation_count": 318,
            "cancellation_limit_reached_count": 97
          }
        },
        "mode": "enforced"
      }
    }
  }
}
```

### Response fields

The response contains the following fields.

Field Name | Data Type | Description
:--- | :--- | :---
search_backpressure | Object | Contains statistics about search backpressure.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_shard_task | Object | Contains statistics specific to the search shard task.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_shard_task.<br>&nbsp;&nbsp;&nbsp;&nbsp;[resource_tracker_stats](#resource_tracker_stats) | Object | Statistics about the current tasks.
search_backpressure.<br>&nbsp;&nbsp;&nbsp;&nbsp;search_shard_task.<br>&nbsp;&nbsp;&nbsp;&nbsp;[calcellation_stats](#cancellation_stats) | Object |  Statistics about the canceled tasks since the node last restarted.
search_backpressure.mode | String | The [mode](#search-backpressure-modes) for search backpressure. 

### `resource_tracker_stats`

The `resource_tracker_stats` object contains the statistics for each resource tracker: [`elapsed_time_tracker`](#elapsed_time_tracker), [`heap_usage_tracker`](#heap_usage_tracker), and [`cpu_usage_tracker`](#cpu_usage_tracker). 

#### `elapsed_time_tracker`

The `elapsed_time_tracker` object contains the following statistics related to the elapsed time.

Field Name | Data Type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks canceled because of excessive elapsed time since the node last restarted.
current_max_millis | Integer | The maximum elapsed time for all tasks currently running on the node, in milliseconds.
current_avg_millis | Integer | The average elapsed time for all tasks currently running on the node, in milliseconds.

#### `heap_usage_tracker`

The `heap_usage_tracker` object contains the following statistics related to the heap usage.

Field Name | Data Type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks canceled because of excessive heap usage since the node last restarted.
current_max_bytes | Integer | The maximum heap usage for all tasks currently running on the node, in bytes.
current_avg_bytes | Integer | The average heap usage for all tasks currently running on the node, in bytes.
rolling_avg_bytes | Integer | The rolling average heap usage for the 100 most recent tasks, in bytes.

#### `cpu_usage_tracker`

The `cpu_usage_tracker` object contains the following statistics related to the CPU usage.

Field Name | Data Type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks canceled because of excessive CPU usage since the node last restarted.
current_max_millis | Integer | The maximum CPU time for all tasks currently running on the node, in milliseconds.
current_avg_millis | Integer | The average CPU time for all tasks currently running on the node, in milliseconds.

### `cancellation_stats`

The `cancellation_stats` object contains the following statistics for cancelled tasks.

Field Name | Data Type | Description
:--- | :--- | :---
cancellation_count | Integer | The total number of canceled tasks since the node last restarted.
cancellation_limit_reached_count | Integer | The number of situations when there were more tasks eligible for cancellation than the set cancellation threshold.