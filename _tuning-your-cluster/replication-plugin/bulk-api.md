---
layout: default
title: Bulk API
nav_order: 55
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/bulk-api/
---

# Bulk replication API

Use these bulk replication operations to start, stop, pause, and resume replication on multiple indices matching a pattern with a single API call. This is useful during failover scenarios or cluster maintenance where managing replication on hundreds or thousands of indices individually would be impractical.

All bulk operations are asynchronous — they return a `task_id` immediately and perform the operation in the background. Use the [task status](#get-task-status) API to poll for progress.

#### Table of contents
- TOC
{:toc}

## Bulk start replication
Introduced 2.17
{: .label .label-purple }

Start replication on all leader indices matching the given pattern. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_start
{
  "pattern": "my-indices-*",
  "leader_alias": "leader-cluster",
  "use_roles": {
    "leader_cluster_role": "cross_cluster_replication_leader_full_access",
    "follower_cluster_role": "cross_cluster_replication_follower_full_access"
  },
  "filters": {
    "exclude_index": ["my-indices-temp"]
  }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:---
`pattern` | Index pattern with wildcard support (e.g., `my-indices-*`). Matches indices on the leader cluster to replicate. | `string` | Yes
`leader_alias` | The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | `string` | Yes
`multiple_leader_aliases` | A list of remote cluster connection aliases. When specified, the operation resolves matching indices across all specified leader clusters. Takes priority over `leader_alias`. | `array` | No
`use_roles` | The roles to use for all subsequent backend replication tasks between the indexes. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `object` | If Security plugin is enabled
`filters.exclude_index` | A list of specific index names to exclude from the bulk operation. | `array` | No
`filters.remote_cluster.exclude` | A list of remote cluster aliases to exclude when using `multiple_leader_aliases`. | `array` | No

#### Example response

```json
{
  "acknowledged": true,
  "task_id": "nodeId:12345"
}
```

## Bulk stop replication
Introduced 2.17
{: .label .label-purple }

Stop replication on all follower indices matching the given pattern. Stopping replication converts the follower index to a standard index that accepts writes. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_stop
{
  "pattern": "my-indices-*",
  "filters": {
    "exclude_index": ["my-indices-keep"]
  }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:---
`pattern` | Index pattern with wildcard support. Matches follower indices to stop replication on. | `string` | Yes
`filters.exclude_index` | A list of specific index names to exclude from the bulk operation. | `array` | No

#### Example response

```json
{
  "acknowledged": true,
  "task_id": "nodeId:12346"
}
```

## Bulk pause replication
Introduced 2.17
{: .label .label-purple }

Pause replication on all running follower indices matching the given pattern. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_pause
{
  "pattern": "my-indices-*",
  "filters": {
    "exclude_index": ["my-indices-critical"]
  }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:---
`pattern` | Index pattern with wildcard support. Matches follower indices to pause replication on. | `string` | Yes
`filters.exclude_index` | A list of specific index names to exclude from the bulk operation. | `array` | No

#### Example response

```json
{
  "acknowledged": true,
  "task_id": "nodeId:12347"
}
```

## Bulk resume replication
Introduced 2.17
{: .label .label-purple }

Resume replication on all paused follower indices matching the given pattern. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_resume
{
  "pattern": "my-indices-*",
  "filters": {
    "exclude_index": ["my-indices-hold"]
  }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:---
`pattern` | Index pattern with wildcard support. Matches paused follower indices to resume replication on. | `string` | Yes
`filters.exclude_index` | A list of specific index names to exclude from the bulk operation. | `array` | No

#### Example response

```json
{
  "acknowledged": true,
  "task_id": "nodeId:12348"
}
```

## Get bulk replication status
Introduced 2.17
{: .label .label-purple }

Get the replication status of all follower indices matching the given pattern. Send this request to the follower cluster.

#### Request

```json
GET /_plugins/_replication/_bulk_status?pattern=my-indices-*
```

Specify the following query parameters:

Parameter | Description | Required
:--- | :--- |:---
`pattern` | Index pattern with wildcard support. | Yes
`remote_cluster` | Comma-separated list of remote cluster aliases to filter results. | No
`pretty` | Whether to pretty-print the response. | No

#### Example response

```json
{
  "indices": {
    "my-indices-1": {
      "status": "SYNCING",
      "reason": "User initiated",
      "leader_alias": "leader-cluster",
      "leader_index": "my-indices-1",
      "follower_index": "my-indices-1",
      "syncing_details": {
        "leader_checkpoint": 5,
        "follower_checkpoint": 5,
        "seq_no": 6
      }
    },
    "my-indices-2": {
      "status": "PAUSED",
      "reason": "bulk_pause",
      "leader_alias": "leader-cluster",
      "leader_index": "my-indices-2",
      "follower_index": "my-indices-2"
    }
  }
}
```

## Get task status
Introduced 2.17
{: .label .label-purple }

Poll the status of a running or completed bulk replication task. Send this request to the follower cluster.

#### Request

```json
GET /_plugins/_replication/_task_status/{task_id}
```

#### Example response

```json
{
  "operation_type": "bulk_start_replication",
  "pattern": "my-indices-*",
  "start_time": 1779799981915,
  "num_success": 8,
  "num_failed": 2,
  "num_pending": 0,
  "num_cancelled": 0,
  "failed_indices": [
    {
      "index": "my-indices-conflict",
      "failure_reason": "Can't use same index again for replication. Delete the index:my-indices-conflict"
    }
  ],
  "failed_clusters": []
}
```

The following table describes the response fields.

Field | Description
:--- | :---
`operation_type` | The type of bulk operation: `bulk_start_replication`, `bulk_stop_replication`, `bulk_pause_replication`, or `bulk_resume_replication`.
`pattern` | The index pattern used for the bulk operation.
`start_time` | The epoch timestamp (in milliseconds) when the task started.
`num_success` | The number of indices processed successfully.
`num_failed` | The number of indices that failed during the operation.
`num_pending` | The number of indices still waiting to be processed.
`num_cancelled` | The number of indices that were not processed due to task cancellation.
`failed_indices` | A list of objects, each containing the `index` name and `failure_reason`.
`failed_clusters` | A list of objects, each containing the `cluster` name and `failure_reason` (applies when using `multiple_leader_aliases`).

## Cancel task
Introduced 2.17
{: .label .label-purple }

Cancel a running bulk replication task. Indices already processed remain in their new state; remaining indices are marked as cancelled. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_task_cancel/{task_id}
```

#### Example response

```json
{
  "acknowledged": true
}
```

## Key behaviors

The following behaviors apply to all bulk replication APIs:

- **Asynchronous execution**: All bulk operations return a `task_id` immediately. Use the [task status](#get-task-status) API to poll for progress.
- **One task at a time**: Only one bulk replication task can run on the cluster at any given time. Concurrent requests return HTTP 400.
- **Partial success**: If some indices fail, the task continues processing the remaining indices. Failures are reported in `failed_indices` in the task status response.
- **Cancellable**: Running tasks can be cancelled using the [cancel task](#cancel-task) API. Already-processed indices are not rolled back.
- **Transient tasks**: Bulk tasks do not survive node restarts. However, individual replication tasks started by a bulk start operation are persistent and survive restarts.
- **Batch processing**: Indices are processed in configurable batches. See [Settings](#settings).

## Settings

You can configure the following setting for bulk replication operations.

Setting | Default | Description
:--- | :--- | :---
`plugins.replication.follower.bulk_batch_size` | 10 | The number of indices processed concurrently in each batch during a bulk replication task. Minimum value is 1. This setting is dynamic and can be changed at any time.

## Error responses

The following table describes common error responses for bulk replication APIs.

HTTP Status | Condition | Description
:--- | :--- | :---
400 | Another bulk task is running | A bulk replication task is already running on the cluster. Wait for it to complete or cancel it.
400 | Missing `leader_alias` | The `leader_alias` field is required for bulk start operations.
400 | Invalid pattern | The pattern contains invalid characters (`` " < > | \ # , `` or spaces) or starts with `_`.
400 | Indices already in target state | All matched indices are already in the requested state (e.g., already paused when pausing).
404 | No indices match pattern | No follower indices were found matching the specified pattern.
404 | Task not found | The specified task ID was not found or has already completed and been evicted from the cache.
