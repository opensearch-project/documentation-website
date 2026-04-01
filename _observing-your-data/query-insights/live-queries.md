---
layout: default
title: Live queries
parent: Query insights
nav_order: 20
---

# Live queries
**Introduced 3.0**
{: .label .label-purple }

Use the Live Queries API to retrieve currently running search queries across the cluster or on specific nodes. Monitoring live queries using Query Insights allows you to get real-time visibility into the search queries that are currently executing within your OpenSearch cluster. This is useful for identifying and debugging queries that might be running for an unexpectedly long time or consuming significant resources at the moment.

The API returns a list of currently executing search queries, sorted by a specified metric (defaulting to `latency`) in descending order. The response includes details for each live query, such as the query status, start time, total resource usage aggregated across coordinator and shard tasks, and individual task-level breakdowns.

## Endpoints

```json
GET /_insights/live_queries
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `verbose` | Boolean | Whether to include detailed query information in the output. Default is `true`. |
| `nodeId` | String | A comma-separated list of node IDs used to filter the results. If omitted, queries from all nodes are returned. |
| `sort` | String | The metric to sort the results by. Valid values are `latency`, `cpu`, or `memory`. Default is `latency`. |
| `size` | Integer | The number of query records to return. Must be a positive integer. Default is `100`. |
| `wlmGroupId` | String | Filters results to only return queries belonging to the specified workload management group. If omitted, queries from all groups are returned. |
| `use_finished_cache` | Boolean | When set to `true`, the response includes a `finished_queries` array containing recently completed queries from the finished queries cache. Default is `false`. |

## Finished queries cache

When `use_finished_cache=true` is specified, the API also returns recently completed queries alongside the currently running ones. This is useful for correlating live queries with queries that have just finished, providing a more complete picture of recent query activity.

### Cache lifecycle

The finished queries cache is lazy — it does not activate at node startup and incurs zero cost until you use it. The lifecycle works as follows:

1. The cache activates on the first API call that includes `use_finished_cache=true`. Once active, the node begins capturing completed queries into the cache.
2. While active, the cache stores up to 1,000 recently finished queries. Individual records are retained for 5 minutes before being automatically evicted. Each API call returns up to 50 of the most recent records.
3. If no API call with `use_finished_cache=true` is made within the idle timeout period (default 5 minutes), the cache automatically deactivates and clears its data.
4. The cache is self-healing: after an idle deactivation, the next API call with `use_finished_cache=true` reactivates it and begins capturing queries again.

Because the cache only activates on demand, queries that complete before the first `use_finished_cache=true` call are not captured. To ensure complete coverage, make an initial API call with `use_finished_cache=true` before the queries you want to monitor.
{: .note}

### Cache settings

You can configure the idle timeout using the following dynamic cluster setting:

```json
PUT _cluster/settings
{
  "persistent": {
    "search.insights.live_queries.cache.idle_timeout": "5m"
  }
}
```
{% include copy-curl.html %}

The `search.insights.live_queries.cache.idle_timeout` setting accepts a time value. Set to `0` to disable the cache entirely and stop it immediately. Non-zero values must be between `2m` and `10m`. The default is `5m`. Changing from `0` to a non-zero value re-activates the cache without requiring a node restart.

## Example requests

The following example request fetches the top 10 queries sorted by CPU usage, with verbose output disabled:

```json
GET /_insights/live_queries?verbose=false&sort=cpu&size=10
```
{% include copy-curl.html %}

The following example request fetches live queries along with recently finished queries:

```json
GET /_insights/live_queries?use_finished_cache=true
```
{% include copy-curl.html %}

The following example request filters live queries by workload management group:

```json
GET /_insights/live_queries?wlmGroupId=DEFAULT_WORKLOAD_GROUP
```
{% include copy-curl.html %}

## Example response

```json
{
  "live_queries": [
    {
      "id": "troGHNGUShqDj3wK_K5ZIw:512",
      "status": "running",
      "start_time": 1745359226777,
      "total_latency_millis": 13959,
      "total_cpu_nanos": 405000,
      "total_memory_bytes": 3104,
      "coordinator_task": {
        "task_id": "troGHNGUShqDj3wK_K5ZIw:512",
        "node_id": "troGHNGUShqDj3wK_K5ZIw",
        "action": "indices:data/read/search",
        "status": "running",
        "description": "indices[my-index-*], search_type[QUERY_THEN_FETCH], source[{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"userId\",\"boost\":1.0}}}}]",
        "start_time": 1745359226777,
        "running_time_nanos": 13959364458,
        "cpu_nanos": 305000,
        "memory_bytes": 2048
      },
      "shard_tasks": [
        {
          "task_id": "Y6eBnbdISPO6XaVfxCBRgg:101",
          "node_id": "Y6eBnbdISPO6XaVfxCBRgg",
          "action": "indices:data/read/search[phase/query]",
          "status": "running",
          "description": "id[0], type[query], indices[my-index-*]",
          "start_time": 1745359226800,
          "running_time_nanos": 13900000000,
          "cpu_nanos": 100000,
          "memory_bytes": 1056
        }
      ]
    }
  ]
}
```

The preceding response shows a single live query. The following sections explain the response structure:

- The top-level fields (`id`, `status`, `start_time`, `total_latency_millis`, `total_cpu_nanos`, `total_memory_bytes`) provide a summary of the entire search request. The `total_*` metrics are aggregated across the coordinator task and all shard tasks, giving you a single view of the query's overall resource consumption.
- The `coordinator_task` object describes the task on the coordinating node that received the search request and is orchestrating the query across shards. In this example, the coordinator (`troGHNGUShqDj3wK_K5ZIw`) has been running for approximately 13.9 seconds and has consumed 305,000 nanoseconds of CPU time and 2,048 bytes of memory. The `description` field includes the target indexes, search type, and the full query source.
- The `shard_tasks` array lists the individual shard-level tasks spawned by the coordinator. Each shard task runs on a specific data node and executes a phase of the search (for example, `search[phase/query]`). In this example, one shard task is running on node `Y6eBnbdISPO6XaVfxCBRgg`, consuming 100,000 nanoseconds of CPU and 1,056 bytes of memory. A query that spans multiple shards or data nodes will have multiple entries in this array.

When `use_finished_cache=true` is specified, the response also includes a `finished_queries` array:

```json
{
  "live_queries": [],
  "finished_queries": [
    {
      "timestamp": 1745359230000,
      "id": "troGHNGUShqDj3wK_K5ZIw:512",
      "top_n_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "completed",
      "node_id": "troGHNGUShqDj3wK_K5ZIw",
      "source": {
        "size": 20,
        "query": {
          "term": {
            "user.id": {
              "value": "userId",
              "boost": 1.0
            }
          }
        }
      },
      "indices": ["my-index-*"],
      "search_type": "query_then_fetch",
      "measurements": {
        "latency": {
          "number": 13959364458,
          "count": 1,
          "aggregationType": "NONE"
        },
        "cpu": {
          "number": 405000,
          "count": 1,
          "aggregationType": "NONE"
        },
        "memory": {
          "number": 3104,
          "count": 1,
          "aggregationType": "NONE"
        }
      }
    }
  ]
}
```

The `id` field in a finished query record uses the same `nodeId:taskId` format as the live query `id` (for example, `troGHNGUShqDj3wK_K5ZIw:512`). This lets you correlate a finished query with the live query it originated from. The `top_n_id` is a separate UUID that links the finished query to its corresponding record in the [top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/) store. If the query did not qualify as a top N query, `top_n_id` is `null`.

## Response fields

The following table lists the fields in each object in the `live_queries` array.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The unique identifier of the search request (the coordinator task ID in `nodeId:taskId` format). |
| `status` | String | The current status of the query. Possible values are `running` or `cancelled`. |
| `start_time` | Long | The time at which the query started, in milliseconds since the epoch. |
| `wlm_group_id` | String | The workload management group ID associated with the query. Only present if the query belongs to a workload group. |
| `total_latency_millis` | Long | The total elapsed time of the query in milliseconds, aggregated across coordinator and shard tasks. |
| `total_cpu_nanos` | Long | The total CPU time consumed by the query in nanoseconds, aggregated across coordinator and shard tasks. |
| `total_memory_bytes` | Long | The total heap memory used by the query in bytes, aggregated across coordinator and shard tasks. |
| `coordinator_task` | Object | Details about the coordinator task for this query. See [Task details](#task-details). |
| `shard_tasks` | Array | A list of shard-level task details for this query. Each element follows the same structure as [Task details](#task-details). |

### Task details

Each task object (coordinator or shard) contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `task_id` | String | The task identifier in `nodeId:taskId` format. |
| `node_id` | String | The ID of the node on which the task is running. |
| `action` | String | The action being performed by the task (for example, `indices:data/read/search` for coordinator tasks or `indices:data/read/search[phase/query]` for shard tasks). |
| `status` | String | The current status of the task. |
| `description` | String | A description of the task, including the target indexes, search type, and query source. Only included if `verbose` is `true`. |
| `start_time` | Long | The time at which the task started, in milliseconds since the epoch. |
| `running_time_nanos` | Long | The elapsed time of the task in nanoseconds. |
| `cpu_nanos` | Long | The CPU time consumed by the task in nanoseconds. |
| `memory_bytes` | Long | The heap memory used by the task in bytes. |

### Finished query fields

When `use_finished_cache=true` is specified, the `finished_queries` array contains objects with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `timestamp` | Long | The time at which the query completed, in milliseconds since the epoch. |
| `id` | String | The live query identifier (in `nodeId:taskId` format) for correlation with live queries. |
| `top_n_id` | String | The UUID linking this record to the corresponding top N queries record. May be `null` if the query did not qualify as a top N query. |
| `status` | String | The completion status of the query (for example, `completed`). |
| `node_id` | String | The coordinator node ID. |
| `source` | Object | The query source body. |
| `indices` | Array | The list of indexes targeted by the query. |
| `search_type` | String | The search execution type (for example, `query_then_fetch`). |
| `phase_latency_map` | Object | A breakdown of latency by search phase. |
| `task_resource_usages` | Array | Per-task resource usage details. |
| `measurements` | Object | An object containing the final performance metrics for the query. Each metric (`latency`, `cpu`, `memory`) contains `number`, `count`, and `aggregationType` fields. |
