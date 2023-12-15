---
layout: default
title: Search backpressure
nav_order: 60
has_children: false
parent: Availability and recovery
redirect_from: 
  - /opensearch/search-backpressure/
---

# Search backpressure

Search backpressure is a mechanism used to identify resource-intensive search requests and cancel them when the node is under duress. If a search request on a node or shard has breached the resource limits and does not recover within a certain threshold, it is rejected. These thresholds are dynamic and configurable through [cluster settings](#search-backpressure-settings). 

## Measuring resource consumption

To decide whether to apply search backpressure, OpenSearch periodically measures the following resource consumption statistics for each search request:

- CPU usage
- Heap usage
- Elapsed time 

An observer thread periodically measures the resource usage of the node. If OpenSearch determines that the node is under duress, OpenSearch examines the resource usage of each search task and search shard task and compares it against configurable thresholds. OpenSearch considers CPU usage, heap usage, and elapsed time and assigns each task a cancellation score that is then used to cancel the most resource-intensive tasks.

OpenSearch limits the number of cancellations to a fraction of successful task completions. Additionally, it limits the number of cancellations per unit time. OpenSearch continues to monitor and cancel tasks until the node is no longer under duress.

## Canceled queries

If a query is canceled, OpenSearch may return partial results if some shards failed. If all shards failed, OpenSearch returns an error from the server similar to the following error:

```json
{
  "error": {
    "root_cause": [
      {
          "type": "task_cancelled_exception",
          "reason": "cancelled task with reason: cpu usage exceeded [17.9ms >= 15ms], elapsed time exceeded [1.1s >= 300ms]"
      },
      {
          "type": "task_cancelled_exception",
          "reason": "cancelled task with reason: elapsed time exceeded [1.1s >= 300ms]"
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed",
    "phase": "query",
    "grouped": true,
    "failed_shards": [
      {
        "shard": 0,
        "index": "foobar",
        "node": "7yIqOeMfRyWW1rHs2S4byw",
        "reason": {
            "type": "task_cancelled_exception",
            "reason": "cancelled task with reason: cpu usage exceeded [17.9ms >= 15ms], elapsed time exceeded [1.1s >= 300ms]"
        }
      },
      {
        "shard": 1,
        "index": "foobar",
        "node": "7yIqOeMfRyWW1rHs2S4byw",
        "reason": {
            "type": "task_cancelled_exception",
            "reason": "cancelled task with reason: elapsed time exceeded [1.1s >= 300ms]"
        }
      }
    ]
  },
  "status": 500
}
```

## Search backpressure modes

Search backpressure runs in `monitor_only` (default), `enforced`, or `disabled` mode. In the `enforced` mode, the server rejects search requests. In the `monitor_only` mode, the server does not actually cancel search requests but tracks statistics about them. You can specify the mode in the [`search_backpressure.mode`](#search-backpressure-settings) parameter.

## Search backpressure settings

Search backpressure adds several settings to the standard OpenSearch cluster settings. These settings are dynamic, so you can change the default behavior of this feature without restarting your cluster.

Setting | Default | Description
:--- | :--- | :---
search_backpressure.mode | `monitor_only` | The search backpressure [mode](#search-backpressure-modes). Valid values are `monitor_only`, `enforced`, or `disabled`.
search_backpressure.cancellation_ratio<br> *Deprecated in 2.6. Replaced by search_backpressure.search_shard_task.cancellation_ratio* | 10% | The maximum number of tasks to cancel, as a percentage of successful task completions.
search_backpressure.cancellation_rate<br> *Deprecated in 2.6. Replaced by search_backpressure.search_shard_task.cancellation_rate* | 0.003 | The maximum number of tasks to cancel per millisecond of elapsed time.
search_backpressure.cancellation_burst<br> *Deprecated in 2.6. Replaced by search_backpressure.search_shard_task.cancellation_burst* | 10 | The maximum number of search shard tasks to cancel in a single iteration of the observer thread.
search_backpressure.node_duress.num_successive_breaches | 3 | The number of successive limit breaches after which the node is considered to be under duress.
search_backpressure.node_duress.cpu_threshold | 90% | The CPU usage threshold (as a percentage) required for a node to be considered to be under duress.
search_backpressure.node_duress.heap_threshold | 70% | The heap usage threshold (as a percentage) required for a node to be considered to be under duress.
search_backpressure.search_task.elapsed_time_millis_threshold | 45,000 | The elapsed time threshold (in milliseconds) required for an individual parent task before it is considered for cancellation.
search_backpressure.search_task.cancellation_ratio | 0.1 | The maximum number of search tasks to cancel, as a percentage of successful search task completions.
search_backpressure.search_task.cancellation_rate| 0.003 | The maximum number of search tasks to cancel per millisecond of elapsed time.
search_backpressure.search_task.cancellation_burst | 5 | The maximum number of search tasks to cancel in a single iteration of the observer thread.
search_backpressure.search_task.heap_percent_threshold | 2% | The heap usage threshold (as a percentage) required for an individual parent task before it is considered for cancellation.
search_backpressure.search_task.total_heap_percent_threshold | 5% | The heap usage threshold (as a percentage) required for the sum of heap usages of all search tasks before cancellation is applied.
search_backpressure.search_task.heap_variance | 2.0 | The heap usage variance required for an individual parent task before it is considered for cancellation. A task is considered for cancellation when `taskHeapUsage` is greater than or equal to `heapUsageMovingAverage` * `variance`.
search_backpressure.search_task.heap_moving_average_window_size | 10 | The window size used to calculate the rolling average of the heap usage for the completed parent tasks.
search_backpressure.search_task.cpu_time_millis_threshold | 30,000 | The CPU usage threshold (in milliseconds) required for an individual parent task before it is considered for cancellation.
search_backpressure.search_shard_task.elapsed_time_millis_threshold | 30,000 | The elapsed time threshold (in milliseconds) required for a single search shard task before it is considered for cancellation.
search_backpressure.search_shard_task.cancellation_ratio | 0.1 | The maximum number of search shard tasks to cancel, as a percentage of successful search shard task completions.
search_backpressure.search_shard_task.cancellation_rate | 0.003 | The maximum number of search shard tasks to cancel per millisecond of elapsed time.
search_backpressure.search_shard_task.cancellation_burst | 10 | The maximum number of search shard tasks to cancel in a single iteration of the observer thread.
search_backpressure.search_shard_task.heap_percent_threshold | 0.5% | The heap usage threshold (as a percentage) required for a single search shard task before it is considered for cancellation.
search_backpressure.search_shard_task.total_heap_percent_threshold | 5% | The heap usage threshold (as a percentage) required for the sum of heap usages of all search shard tasks before cancellation is applied.
search_backpressure.search_shard_task.heap_variance | 2.0 | The minimum variance required for a single search shard task's heap usage compared to the rolling average of previously completed tasks before it is considered for cancellation.
search_backpressure.search_shard_task.heap_moving_average_window_size | 100 | The number of previously completed search shard tasks to consider when calculating the rolling average of heap usage.
search_backpressure.search_shard_task.cpu_time_millis_threshold | 15,000 | The CPU usage threshold (in milliseconds) required for a single search shard task before it is considered for cancellation.

## Search Backpressure Stats API
Introduced 2.4
{: .label .label-purple }

You can use the [nodes stats API operation]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats) to monitor server-side request cancellations.

#### Example request

To retrieve the statistics, use the following request:

```json
GET _nodes/stats/search_backpressure
```

#### Example response

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
         
      ],
      "attributes": {
        "testattr": "test",
        "shard_indexing_pressure_enabled": "true"
      },
      "search_backpressure": {
        "search_task": {
          "resource_tracker_stats": {
            "heap_usage_tracker": {
              "cancellation_count": 57,
              "current_max_bytes": 5739204,
              "current_avg_bytes": 962465,
              "rolling_avg_bytes": 4009239
            },
            "elapsed_time_tracker": {
              "cancellation_count": 97,
              "current_max_millis": 15902,
              "current_avg_millis": 9705
            },
            "cpu_usage_tracker": {
              "cancellation_count": 64,
              "current_max_millis": 8483,
              "current_avg_millis": 7843
            }
          },
          "cancellation_stats": {
            "cancellation_count": 102,
            "cancellation_limit_reached_count": 25
          }
        },
        "search_shard_task": {
          "resource_tracker_stats": {
            "heap_usage_tracker": {
              "cancellation_count": 34,
              "current_max_bytes": 1203272,
              "current_avg_bytes": 700267,
              "rolling_avg_bytes": 1156270
            },
            "cpu_usage_tracker": {
              "cancellation_count": 318,
              "current_max_millis": 731,
              "current_avg_millis": 303
            },
            "elapsed_time_tracker": {
              "cancellation_count": 310,
              "current_max_millis": 1305,
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

Field Name | Data type | Description
:--- | :--- | :---
search_backpressure | Object | Statistics about search backpressure.
search_backpressure.search_task | Object | Statistics specific to the search task.
search_backpressure.search_task.[resource_tracker_stats](#resource_tracker_stats) | Object | Statistics about the current search tasks.
search_backpressure.search_task.[cancellation_stats](#cancellation_stats) | Object | Statistics about the search tasks canceled since the node last restarted.
search_backpressure.search_shard_task | Object | Statistics specific to the search shard task.
search_backpressure.search_shard_task.[resource_tracker_stats](#resource_tracker_stats) | Object | Statistics about the current search shard tasks.
search_backpressure.search_shard_task.[cancellation_stats](#cancellation_stats) | Object |  Statistics about the search shard tasks canceled since the node last restarted.
search_backpressure.mode | String | The [mode](#search-backpressure-modes) for search backpressure. 

### `resource_tracker_stats`

The `resource_tracker_stats` object contains the statistics for each resource tracker: [`elapsed_time_tracker`](#elapsed_time_tracker), [`heap_usage_tracker`](#heap_usage_tracker), and [`cpu_usage_tracker`](#cpu_usage_tracker). 

#### `elapsed_time_tracker`

The `elapsed_time_tracker` object contains the following statistics related to the elapsed time.

Field Name | Data type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks marked for cancellation because of excessive elapsed time since the node last restarted.
current_max_millis | Integer | The maximum elapsed time for all tasks currently running on the node, in milliseconds.
current_avg_millis | Integer | The average elapsed time for all tasks currently running on the node, in milliseconds.

#### `heap_usage_tracker`

The `heap_usage_tracker` object contains the following statistics related to the heap usage.

Field Name | Data type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks marked for cancellation because of excessive heap usage since the node last restarted.
current_max_bytes | Integer | The maximum heap usage for all tasks currently running on the node, in bytes.
current_avg_bytes | Integer | The average heap usage for all tasks currently running on the node, in bytes.
rolling_avg_bytes | Integer | The rolling average heap usage for `n` most recent tasks, in bytes. `n` is configurable and defined by the `search_backpressure.search_shard_task.heap_moving_average_window_size` setting. The default value for this setting is 100.

#### `cpu_usage_tracker`

The `cpu_usage_tracker` object contains the following statistics related to the CPU usage.

Field Name | Data type | Description
:--- | :--- | :---
cancellation_count | Integer | The number of tasks marked for cancellation because of excessive CPU usage since the node last restarted.
current_max_millis | Integer | The maximum CPU time for all tasks currently running on the node, in milliseconds.
current_avg_millis | Integer | The average CPU time for all tasks currently running on the node, in milliseconds.

### `cancellation_stats`

The `cancellation_stats` object contains the following statistics for the tasks that are marked for cancellation.

Field Name | Data type | Description
:--- | :--- | :---
cancellation_count | Integer | The total number of tasks marked for cancellation since the node last restarted.
cancellation_limit_reached_count | Integer | The number of times when the number of tasks eligible for cancellation exceeded the set cancellation threshold.