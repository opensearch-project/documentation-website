---
layout: default
title: Get Follower Stats API
parent: Replication APIs
nav_order: 40
---

# Get Follower Stats API
Introduced 1.0
{: .label .label-purple }

The Get Follower Stats API retrieves statistics about follower indexes in the replication process. This API provides detailed metrics about operations, progress, and performance of follower indexes during replication activities.

## Endpoints

```json
GET /_plugins/_replication/follower_stats
```

## Example request

The following example gets statistics about all follower indexes in the replication process:

```json
GET /_plugins/_replication/follower_stats
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response with statistics for two follower indexes:

```json
{
  "num_shard_tasks": 7,
  "num_index_tasks": 2,
  "num_bootstrapping_indices": 0,
  "num_syncing_indices": 2,
  "num_paused_indices": 0,
  "num_failed_indices": 0,
  "operations_read": 1254,
  "operations_written": 1254,
  "failed_read_requests": 0,
  "failed_write_requests": 0,
  "throttled_read_requests": 5,
  "throttled_write_requests": 2,
  "leader_checkpoint": 42,
  "follower_checkpoint": 40,
  "total_write_time_millis": 1850,
  "index_stats": {
    "customer-data": {
      "operations_read": 854,
      "operations_written": 854,
      "failed_read_requests": 0,
      "failed_write_requests": 0,
      "throttled_read_requests": 3,
      "throttled_write_requests": 1,
      "leader_checkpoint": 27,
      "follower_checkpoint": 25,
      "total_write_time_millis": 1250
    },
    "product-data": {
      "operations_read": 400,
      "operations_written": 400,
      "failed_read_requests": 0,
      "failed_write_requests": 0,
      "throttled_read_requests": 2,
      "throttled_write_requests": 1,
      "leader_checkpoint": 15,
      "follower_checkpoint": 15,
      "total_write_time_millis": 600
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `failed_read_requests` | Float | The number of failed read requests during replication. |
| `failed_write_requests` | Float | The number of failed write requests during replication. |
| `follower_checkpoint` | Float | The current checkpoint of the follower index. |
| `index_stats` | Object | Per-index statistics for all indexes being replicated. |
| `leader_checkpoint` | Float | The current checkpoint of the leader index. |
| `num_bootstrapping_indices` | Float | The number of indexes currently bootstrapping. |
| `num_failed_indices` | Float | The number of indexes that have failed replication. |
| `num_index_tasks` | Float | The number of active index-level replication tasks. |
| `num_paused_indices` | Float | The number of indexes currently paused. |
| `num_shard_tasks` | Float | The number of active shard-level replication tasks. |
| `num_syncing_indices` | Float | The number of indexes currently syncing. |
| `operations_read` | Float | The total number of operations read during replication. |
| `operations_written` | Float | The total number of operations written during replication. |
| `throttled_read_requests` | Float | The number of throttled read requests during replication. |
| `throttled_write_requests` | Float | The number of throttled write requests during replication. |
| `total_write_time_millis` | Integer or String | The total time in milliseconds spent writing operations. |

<details markdown="block">
  <summary>
    Response body fields: <code>index_stats</code>
  </summary>
  {: .text-delta}

`index_stats` is a JSON object with index names as keys. Each index entry contains the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `failed_read_requests` | Float | The number of failed read requests for this index during replication. |
| `failed_write_requests` | Float | The number of failed write requests for this index during replication. |
| `follower_checkpoint` | Float | The current checkpoint of this follower index. |
| `leader_checkpoint` | Float | The current checkpoint of the leader index for this follower. |
| `operations_read` | Float | The number of operations read for this index during replication. |
| `operations_written` | Float | The number of operations written for this index during replication. |
| `throttled_read_requests` | Float | The number of throttled read requests for this index during replication. |
| `throttled_write_requests` | Float | The number of throttled write requests for this index during replication. |
| `total_write_time_millis` | Integer or String | The total time in milliseconds spent writing operations for this index. |
</details>