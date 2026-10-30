---
layout: default
title: Bulk Replication API
nav_order: 55
parent: Cross-cluster replication
---

# Bulk Replication API

Use the bulk replication operations to programmatically manage cross-cluster replication across multiple indexes using a single API call. You can specify an index pattern to select matching indexes and perform start, stop, pause, or resume operations in bulk.

All bulk replication operations are asynchronous. Each request returns a `task_id` that you can use to [check the task progress](#get-bulk-task-status) or [cancel the operation](#cancel-bulk-task). Only one bulk replication task can run at a time per cluster; submitting a new bulk replication operation while one is in progress results in a `409 Conflict` error. If a bulk replication operation fails for some indexes, the task continues processing the remaining indexes and reports a list of indexes for which the operation succeeded and failed. You can cancel a running bulk task at any time, but indexes already processed are not reverted. Indexes are processed in configurable batches (see [Settings](#settings)). Bulk replication operations are not idempotent: if you submit the same request after a previous task has finished running, a new task is created.

## Pattern matching

The `pattern` field supports the same syntax as OpenSearch index patterns:

- `*` matches any number of characters.
- `?` matches a single character.
- Patterns must not start with `_`.
- Patterns must not contain spaces, quotes (`"`), angle brackets (`<`, `>`), pipes (`|`), backslashes (`\`), hash marks (`#`), or commas (`,`).

Examples:
- `my-index-*` matches `my-index-1`, `my-index-2`, `my-index-logs`, and so on.
- `*` matches all indexes (excluding system indexes starting with `.`).
- `logs-2024-0?` matches `logs-2024-01`--`logs-2024-09`.

---

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Bulk start replication
**Introduced 3.7**
{: .label .label-purple }

Initiates replication for all indexes of the leader cluster that match the specified pattern. Send this request to the follower cluster.

### Endpoints

```json
POST /_plugins/_replication/_bulk_start
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description | Required
:--- | :--- |:--- |:--- 
`leader_alias` | String | The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | Yes
`pattern` | String | An index pattern to match indexes on the leader cluster. Supports wildcard characters. For example, `my-index-*` or `*` for all indexes. | Yes
`use_roles` | Object | The roles to use for all subsequent backend replication tasks between the indexes. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | If the Security plugin is enabled
`filters` | Object | An object containing filters to refine index selection. | No
`filters.exclude_index` | Array | A list of index names to exclude from the operation. | No

### Example request

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
{% include copy-curl.html %}

## Bulk stop replication
**Introduced 3.7**
{: .label .label-purple }

Stops replication and converts all matching follower indexes to standard indexes that accept write operations. Send this request to the follower cluster.

### Endpoints

```json
POST /_plugins/_replication/_bulk_stop
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description | Required
:--- | :--- |:--- |:---
`pattern` | String | An index pattern to match follower indexes. Supports wildcard characters. For example, `follower-*` or `*` for all replicating indexes. | Yes
`filters` | Object | An object containing filters to refine index selection. | No
`filters.exclude_index` | Array | A list of index names to exclude from the operation. | No

### Example request

```json
POST /_plugins/_replication/_bulk_stop
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```
{% include copy-curl.html %}

## Bulk pause replication
**Introduced 3.7**
{: .label .label-purple }

Pauses replication for all matching follower indexes. Send this request to the follower cluster.

You can't resume replication after it's been paused for more than 12 hours. You must [stop replication]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication), delete the follower index, and restart replication of the leader.
{: .warning }

### Endpoints

```json
POST /_plugins/_replication/_bulk_pause
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description | Required
:--- | :--- |:--- |:---
`pattern` | String | An index pattern to match follower indexes. Supports wildcard characters. | Yes
`filters` | Object | An object containing filters to refine index selection. | No
`filters.exclude_index` | Array | A list of index names to exclude from the operation. | No

### Example request

```json
POST /_plugins/_replication/_bulk_pause
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```
{% include copy-curl.html %}

## Bulk resume replication
**Introduced 3.7**
{: .label .label-purple }

Resumes replication for all paused follower indexes that match the specified pattern. The leader cluster must be reachable and retention leases must still be valid for each index. Send this request to the follower cluster.

### Endpoints

```json
POST /_plugins/_replication/_bulk_resume
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description | Required
:--- | :--- |:--- |:---
`pattern` | String | An index pattern to match paused follower indexes. Supports wildcard characters. | Yes
`filters` | Object | An object containing filters to refine index selection. | No
`filters.exclude_index` | Array | A list of index names to exclude from the operation. | No

### Example request

```json
POST /_plugins/_replication/_bulk_resume
{
   "pattern": "<index-pattern>",
   "filters": {
      "exclude_index": ["<index-name-1>", "<index-name-2>"]
   }
}
```
{% include copy-curl.html %}

## Get bulk replication status
**Introduced 3.7**
{: .label .label-purple }

Returns the current replication status of all indexes matching a pattern. Unlike the [Get Bulk Task Status](#get-bulk-task-status) endpoint, this endpoint returns the live replication state rather than the progress of a bulk replication operation. Send this request to the follower cluster.

### Endpoints

```json
GET /_plugins/_replication/_bulk_status?pattern={index-pattern}
```

### Query parameters

The following table lists the available query parameters.

Parameter | Data type | Description | Required
:--- | :--- |:--- |:---
`pattern` | String | An index pattern to match follower indexes. Supports wildcard characters. | Yes

### Example response

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
      },
      "bulk-test-9": {
         "status": "BOOTSTRAPPING",
         "reason": "User initiated",
         "leader_alias": "leader-cluster",
         "leader_index": "bulk-test-9",
         "follower_index": "bulk-test-9",
         "bootstrap_details": {
            "status": "IN_PROGRESS",
            "shard_restore_details": {
               "total_shards": 5,
               "successful_shards": 2,
               "failed_shards": 0,
               "in_progress_shards": 3
            }
         }
      }
   }
}
```

### Response body fields

The following table lists the response body fields.

Field | Data type | Description
:--- | :--- | :---
`indices` | Object | A map of index names to their replication status objects.
`indices.<index>.status` | String | The current replication status. Possible values are `SYNCING`, `BOOTSTRAPPING`, `PAUSED`, `RESTORING`.
`indices.<index>.reason` | String | The reason for the current status.
`indices.<index>.leader_alias` | String | The cross-cluster connection alias for the leader cluster.
`indices.<index>.leader_index` | String | The name of the index on the leader cluster.
`indices.<index>.follower_index` | String | The name of the index on the follower cluster.
`indices.<index>.syncing_details` | Object | Replication progress details. Present when the status is `SYNCING`.
`indices.<index>.syncing_details.leader_checkpoint` | Integer | The latest checkpoint on the leader index.
`indices.<index>.syncing_details.follower_checkpoint` | Integer | The latest checkpoint on the follower index.
`indices.<index>.syncing_details.seq_no` | Integer | The current sequence number.
`indices.<index>.bootstrap_details` | Object | Bootstrap progress details. Present only when the status is `BOOTSTRAPPING`. Once bootstrap completes and replication enters the syncing phase, this field is replaced by `syncing_details`.
`indices.<index>.bootstrap_details.status` | String | The bootstrap status. Possible values are `IN_PROGRESS`, `COMPLETED`, `FAILED`.
`indices.<index>.bootstrap_details.shard_restore_details` | Object | Shard-level restore progress during bootstrap.
`indices.<index>.bootstrap_details.shard_restore_details.total_shards` | Integer | The total number of shards to restore.
`indices.<index>.bootstrap_details.shard_restore_details.successful_shards` | Integer | The number of shards restored successfully.
`indices.<index>.bootstrap_details.shard_restore_details.failed_shards` | Integer | The number of shards that failed to restore.
`indices.<index>.bootstrap_details.shard_restore_details.in_progress_shards` | Integer | The number of shards currently being restored.

## Get bulk task status
**Introduced 3.7**
{: .label .label-purple }

Returns the progress of a bulk replication task. Use the `task_id` returned by any bulk replication operation to check the task status. Send this request to the follower cluster.

### Endpoints

```json
GET /_plugins/_replication/_task_status/{task_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description | Required
:--- | :--- |:--- |:---
`task_id` | String | The task ID returned by the bulk replication operation. | Yes

### Example response

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

### Response body fields

The following table lists the response body fields.

Field | Data type | Description
:--- | :--- | :---
`operation_type` | String | The type of bulk replication operation. Possible values are `bulk_start_replication`, `bulk_stop_replication`, `bulk_pause_replication`, `bulk_resume_replication`.
`pattern` | String | The index pattern used for the operation.
`start_time` | Long | The epoch timestamp (in milliseconds) when the task started.
`num_success` | Integer | The number of indexes for which the operation completed successfully.
`num_failed` | Integer | The number of indexes for which the operation failed.
`num_pending` | Integer | The number of indexes waiting to be processed. When this reaches `0`, the task is complete.
`num_cancelled` | Integer | The number of indexes that were not processed because of task cancellation.
`failed_indices` | Array | An array of objects containing the `index` name and `failure_reason` for each failed index.

## Cancel bulk task
**Introduced 3.7**
{: .label .label-purple }

Cancels a running bulk replication task. Indexes already processed remain in the state applied by the operation; remaining indexes are marked as canceled. Send this request to the follower cluster.

### Endpoints

```json
POST /_plugins/_replication/_task_cancel/{task_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description | Required
:--- | :--- |:--- |:---
`task_id` | String | The task ID of the bulk replication operation to cancel. | Yes

## Settings

For bulk replication settings, see [Bulk replication settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/settings/#bulk-replication-settings). To learn about updating dynamic settings, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

## Error responses

The following examples show common error responses you may encounter when using the bulk replication API operations.

### Bulk task already running

If you submit a bulk replication operation while another is already in progress, OpenSearch returns a 409 error:

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
   "status": 409
}
```

Wait for the current task to complete or [cancel](#cancel-bulk-task) it before submitting a new one.

### No indexes match pattern

If no indexes are found matching the specified pattern, OpenSearch returns a 404 error:

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
            "reason": "Validation Failed: 1: leader_alias is required for bulk start;"
         }
      ],
      "type": "action_request_validation_exception",
      "reason": "Validation Failed: 1: leader_alias is required for bulk start;"
   },
   "status": 400
}
```

### All indexes failed validation

If all matched indexes are already in the state that the operation requests (for example, you send a pause replication operation to indexes for which replication is already paused), OpenSearch returns a 400 error:

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

If you attempt to cancel or check a task that does not exist or has already completed, OpenSearch returns a 404 error:

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


## Limitations

Note the following limitations:

- The Bulk Replication API does not automatically rerun operations for failed indexes. Rerun the bulk replication operation manually or use the [Replication API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/api/) for individual indexes.
- Bulk replication tasks are transient and do not persist across node restarts. Individual replication tasks initiated by a bulk start operation are persistent.