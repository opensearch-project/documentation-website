---
layout: default
title: Bulk replication API
nav_order: 55
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/bulk-api/
---

# Bulk replication API

Use the bulk replication operations to programmatically manage cross-cluster replication across multiple indexes with a single API call. Rather than invoking the single-index replication API for each index, you can specify an index pattern to select matching indexes and perform start, stop, pause, or resume operations in bulk.

Use cases include:

- Stopping replication on all indexes during failover between active-passive clusters.
- Pausing and resuming replication across multiple indexes during cluster maintenance.
- Starting replication for indexes that follow a naming convention.

All bulk operations are asynchronous. Each request returns a `task_id` that you can use to poll progress, retrieve status, or cancel the operation.

#### Table of contents
- TOC
{:toc}

## Key behaviors

- **Asynchronous execution**: All bulk operations run asynchronously and return a `task_id` immediately. Use the [task status](#get-bulk-task-status) endpoint to poll for progress.
- **One task at a time**: Only one bulk replication task can run at a time per cluster. Submitting a new bulk operation while one is already in progress results in a `400 Bad Request` error.
- **Partial success**: If some indexes fail during a bulk operation, the task continues processing the remaining indexes. The task status response reports which indexes succeeded and which failed.
- **Cancellation**: You can cancel a running bulk task at any time. Indexes already processed are not reverted.
- **Batch processing**: Indices are processed in configurable batches. See [Cluster settings](#cluster-settings).

## Bulk start replication
Introduced 2.17
{: .label .label-purple }

Initiates replication for all indexes on the leader cluster that match the specified pattern. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_start
{
   "leader_alias": "<connection-alias-name>",
   "pattern": "<index-pattern>",
   "use_roles": {
      "leader_cluster_role": "<role-name>",
      "follower_cluster_role": "<role-name>"
   },
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`leader_alias` | The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | `string` | Yes
`pattern` | An index pattern to match against indexes on the leader cluster. Supports wildcard characters. For example, `my-index-*` or `*` for all indexes. | `string` | Yes
`use_roles` | The roles to use for all subsequent backend replication tasks between the indexes. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `object` | If Security plugin is enabled
`filters` | An object containing filters to refine index selection. | `object` | No
`filters.exclude_index` | A list of index names to exclude from the operation. | `array` | No

#### Example response

```json
{
   "acknowledged": true,
   "task_id": "nodeId:123"
}
```

## Bulk stop replication
Introduced 2.17
{: .label .label-purple }

Stops replication and converts all matching follower indexes to standard indexes that accept writes. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_stop
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`pattern` | An index pattern to match against follower indexes. Supports wildcard characters. For example, `follower-*` or `*` for all replicating indexes. | `string` | Yes
`filters` | An object containing filters to refine index selection. | `object` | No
`filters.exclude_index` | A list of index names to exclude from the operation. | `array` | No

#### Example response

```json
{
   "acknowledged": true,
   "task_id": "nodeId:456"
}
```

## Bulk pause replication
Introduced 2.17
{: .label .label-purple }

Pauses replication for all matching follower indexes. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_pause
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`pattern` | An index pattern to match against follower indexes. Supports wildcard characters. | `string` | Yes
`filters` | An object containing filters to refine index selection. | `object` | No
`filters.exclude_index` | A list of index names to exclude from the operation. | `array` | No

You can't resume replication after it's been paused for more than 12 hours. You must [stop replication]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication), delete the follower index, and restart replication of the leader.
{: .warning }

#### Example response

```json
{
   "acknowledged": true,
   "task_id": "nodeId:789"
}
```

## Bulk resume replication
Introduced 2.17
{: .label .label-purple }

Resumes replication for all matching paused follower indexes. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/_bulk_resume
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`pattern` | An index pattern to match against paused follower indexes. Supports wildcard characters. | `string` | Yes
`filters` | An object containing filters to refine index selection. | `object` | No
`filters.exclude_index` | A list of index names to exclude from the operation. | `array` | No

#### Example response

```json
{
   "acknowledged": true,
   "task_id": "nodeId:012"
}
```

## Get bulk replication status
Introduced 2.17
{: .label .label-purple }

Returns the current replication state of all indexes matching a pattern. Unlike the [task status](#get-bulk-task-status) endpoint, this returns the live replication state rather than the progress of a bulk operation. Send this request to the follower cluster.

#### Request

```
GET /_plugins/_replication/_bulk_status?pattern=<index-pattern>
```

Specify the following query parameters:

Parameter | Description | Required
:--- | :--- |:---
`pattern` | An index pattern to match against follower indexes. Supports wildcard characters. | Yes
`pretty` | Whether to pretty-print the response. | No

#### Example response

```json
{
   "indices": {
      "bulk-test-3": {
         "status": "SYNCING",
         "reason": "User initiated",
         "leader_alias": "leader-cluster",
         "leader_index": "bulk-test-3",
         "follower_index": "bulk-test-3",
         "syncing_details": {
            "leader_checkpoint": -1,
            "follower_checkpoint": -1,
            "seq_no": 0
         }
      },
      "bulk-test-6": {
         "status": "PAUSED",
         "reason": "bulk_pause",
         "leader_alias": "leader-cluster",
         "leader_index": "bulk-test-6",
         "follower_index": "bulk-test-6"
      }
   }
}
```

## Get bulk task status
Introduced 2.17
{: .label .label-purple }

Returns the progress of a bulk replication task. Use the `task_id` returned by any bulk operation to poll for completion. Send this request to the follower cluster.

#### Request

```
GET /_plugins/_replication/_task_status/{task_id}
```

#### Example response

```json
{
   "operation_type": "bulk_stop_replication",
   "pattern": "my-index-*",
   "start_time": 1717600000000,
   "num_success": 7,
   "num_failed": 1,
   "num_pending": 2,
   "num_cancelled": 0,
   "failed_indices": [
      {
         "index": "my-index-3",
         "failure_reason": "No replication in progress for index:my-index-3"
      }
   ]
}
```

The response includes the following fields:

Field | Description
:--- | :---
`operation_type` | The type of bulk operation. Possible values: `bulk_start_replication`, `bulk_stop_replication`, `bulk_pause_replication`, `bulk_resume_replication`.
`pattern` | The index pattern used for the operation.
`start_time` | The epoch timestamp (in milliseconds) when the task started.
`num_success` | The number of indexes on which the operation completed successfully.
`num_failed` | The number of indexes on which the operation failed.
`num_pending` | The number of indexes waiting to be processed. When this reaches `0`, the task is complete.
`num_cancelled` | The number of indexes that were not processed due to task cancellation.
`failed_indices` | An array of objects containing the `index` name and `failure_reason` for each failed index.

## Cancel bulk task
Introduced 2.17
{: .label .label-purple }

Cancels a running bulk replication task. Indices already processed remain in their new state; remaining indices are marked as cancelled. Send this request to the follower cluster.

#### Request

```
POST /_plugins/_replication/_task_cancel/{task_id}
```

#### Example response

```json
{
   "acknowledged": true
}
```

## Cluster settings

The following cluster-level setting controls bulk replication behavior. This setting is dynamic and can be updated without restarting the cluster.

Setting | Default | Description
:--- | :--- | :---
`plugins.replication.follower.bulk_batch_size` | 10 | The number of indices processed concurrently in each batch during a bulk replication task. Minimum value is `1`. This setting is dynamic and can be changed at any time.

To update this setting:

```json
PUT /_cluster/settings
{
   "persistent": {
      "plugins.replication.follower.bulk_batch_size": 20
   }
}
```

## Pattern matching

The `pattern` field supports the same syntax as OpenSearch index patterns:

- `*` matches any number of characters.
- `?` matches a single character.
- Patterns must not start with `_`.
- Patterns must not contain spaces, quotes (`"`), angle brackets (`<`, `>`), pipes (`|`), backslashes (`\`), hash marks (`#`), or commas (`,`).

Examples:
- `my-index-*` matches `my-index-1`, `my-index-2`, `my-index-logs`, and so on.
- `*` matches all indexes (excluding system indexes starting with `.`).
- `logs-2024-0?` matches `logs-2024-01` through `logs-2024-09`.

## Limitations

- Only one bulk task can run at a time per cluster.
- The bulk API does not automatically retry failed indexes. Re-run the operation or use the single-index API for failed indexes.
- Cancelling a task does not revert operations already performed on processed indexes.
- For bulk resume, the leader cluster must be reachable and retention leases must still be valid for each index.
- Bulk tasks are transient and do not persist across node restarts. Individual replication tasks initiated by a bulk start operation are persistent.
- Bulk APIs are not idempotent. Submitting the same request after a previous task completes creates a new task.
- Single-index replication APIs can be used alongside bulk APIs without conflict.

## Error responses

The following examples show common error responses you may encounter when using the bulk replication APIs.

### Bulk task already running

If you submit a bulk operation while another is already in progress, OpenSearch returns a 400 error:

```json
{
   "error": {
      "root_cause": [
         {
            "type": "resource_already_exists_exception",
            "reason": "A bulk replication task is already running. Only one bulk task is allowed at a time."
         }
      ],
      "type": "resource_already_exists_exception",
      "reason": "A bulk replication task is already running. Only one bulk task is allowed at a time."
   },
   "status": 400
}
```

Wait for the current task to complete or [cancel](#cancel-bulk-task) it before submitting a new one.

### No indices match pattern

If no indices are found matching the specified pattern, OpenSearch returns a 404 error:

```json
{
   "error": {
      "root_cause": [
         {
            "type": "resource_not_found_exception",
            "reason": "No indices found matching pattern: [non-existent-*] on leader cluster"
         }
      ],
      "type": "resource_not_found_exception",
      "reason": "No indices found matching pattern: [non-existent-*] on leader cluster"
   },
   "status": 404
}
```

### Missing leader alias

If you submit a bulk start request without providing a `leader_alias`, OpenSearch returns a 400 error:

```json
{
   "error": {
      "root_cause": [
         {
            "type": "action_request_validation_exception",
            "reason": "Validation Failed: 1: At least one leader_alias is required for bulk start;"
         }
      ],
      "type": "action_request_validation_exception",
      "reason": "Validation Failed: 1: At least one leader_alias is required for bulk start;"
   },
   "status": 400
}
```

### All indices failed validation

If all matched indices are already in the requested state, OpenSearch returns a 400 error. For example, pausing indices that are already paused:

```json
{
   "error": {
      "root_cause": [
         {
            "type": "illegal_argument_exception",
            "reason": "Index bulk-test-1 is already paused; Index bulk-test-2 is already paused"
         }
      ],
      "type": "illegal_argument_exception",
      "reason": "Index bulk-test-1 is already paused; Index bulk-test-2 is already paused"
   },
   "status": 400
}
```

### Task not found

If you attempt to cancel or poll a task that does not exist or has already completed, OpenSearch returns a 404 error:

```json
{
   "error": {
      "root_cause": [
         {
            "type": "resource_not_found_exception",
            "reason": "Task a3PiBHTWTTulezYixxCwkw:7709 not found or already completed"
         }
      ],
      "type": "resource_not_found_exception",
      "reason": "Task a3PiBHTWTTulezYixxCwkw:7709 not found or already completed"
   },
   "status": 404
}
```
