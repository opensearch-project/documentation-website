---
layout: default
title: Force resume
nav_order: 25
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/force-resume/
---

# Force resume replication

When cross-cluster replication is paused for longer than the retention lease duration (12 hours by default), the leader cluster's translog no longer retains the operations needed by the follower. A normal resume request fails because the retention lease has expired. The force resume feature resolves this by internally stopping replication, deleting the follower index, and restarting replication from scratch — triggering a snapshot bootstrap from the leader — all in a single API call.

## When to use force resume

Use force resume in the following scenarios:

- Replication was paused for more than 12 hours (or the configured retention lease duration) and a normal resume fails.
- The retention lease expired due to extended network partitions or cluster maintenance.
- You want to avoid the manual process of stopping replication, deleting the follower index, and restarting replication from scratch.

Without force resume, recovering from an expired retention lease requires you to:

1. Stop the existing replication.
2. Delete the follower index.
3. Start replication from scratch.

Force resume automates this process in a single API call while preserving the replication configuration.

## How it works

When you send a resume request with `force_resume` set to `true` and the retention lease has expired, the plugin performs the following steps:

1. **Validates the paused state** — Confirms that the replication is currently in a `PAUSED` state and that the retention lease has expired (making a normal resume impossible).
2. **Stops replication** — Internally calls the existing stop replication action, which cleans up replication metadata, removes the index block, and deregisters the replication task.
3. **Deletes the follower index** — Removes the existing follower index so it can be restored from a snapshot.
4. **Starts replication** — Internally calls the existing start replication action using the original connection alias and leader index configuration. This triggers a snapshot restore from the leader cluster via `RemoteClusterRepository`, which also acquires new retention leases during the restore process.
5. **Resumes translog-based replication** — After the restore completes, shard replication tasks start and use the newly acquired retention leases to replicate ongoing operations from the leader.

The following diagram illustrates the force resume flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Follower Cluster                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User sends POST /_resume with force_resume=true              │
│                         │                                        │
│                         ▼                                        │
│  2. Validate PAUSED state + retention lease expired              │
│                         │                                        │
│                         ▼                                        │
│  3. Stop replication (cleanup metadata, remove block)            │
│                         │                                        │
│                         ▼                                        │
│  4. Delete follower index                                        │
│                         │                                        │
│                         ▼                                        │
│  5. Start replication (reuses original connection config)        │
│                         │                                        │
│                         ▼                                        │
│  6. Snapshot restore from leader (acquires retention leases)     │
│                         │                                        │
│                         ▼                                        │
│  7. Normal translog-based replication resumes                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## API

Send this request to the follower cluster.

### Request

```json
POST /_plugins/_replication/{follower-index}/_resume
{
   "force_resume": true
}
```

### Parameters

The following table lists the available request body parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |:---
`force_resume` | When `true`, performs a full stop-delete-start cycle to restore the follower index from the leader if the retention lease has expired. When `false` or omitted, a normal resume is attempted. | `boolean` | No | `false`

### Example response

```json
{
   "acknowledged": true
}
```

### Error responses

The following table describes common error responses.

Status code | Error | Description
:--- | :--- | :---
404 | `Retention lease doesn't exist. Use force_resume=true to restore from snapshot.` | The retention lease has expired and `force_resume` was not set to `true`. Retry the request with `"force_resume": true`.
400 | Replication is not in PAUSED state | Force resume can only be used when replication is paused. Check the replication status first.
500 | Failed to stop replication | The internal stop operation failed. Verify cluster health and retry.
500 | Failed to delete follower index | The follower index could not be deleted after stopping replication. Manual cleanup may be required.
500 | Failed to start replication | The internal start operation failed after the follower was deleted. You may need to manually start replication again.

## Usage example

The following example demonstrates a complete force resume workflow.

### Step 1: Check replication status

First, confirm that replication is paused and identify the reason:

```bash
curl -XGET -k -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/follower-01/_status?pretty'
```

Response:

```json
{
  "status": "PAUSED",
  "reason": "User initiated",
  "leader_alias": "my-connection-alias",
  "leader_index": "leader-01",
  "follower_index": "follower-01"
}
```

### Step 2: Attempt a normal resume

Try a normal resume first:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/follower-01/_resume?pretty' -d '{}'
```

If the retention lease has expired, you receive an error:

```json
{
  "error": {
    "root_cause": [{
      "type": "resource_not_found_exception",
      "reason": "Retention lease doesn't exist. Use force_resume=true to restore from snapshot."
    }],
    "type": "resource_not_found_exception",
    "reason": "Retention lease doesn't exist. Use force_resume=true to restore from snapshot."
  },
  "status": 404
}
```

### Step 3: Force resume

Use force resume to restore from a snapshot:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/follower-01/_resume?pretty' -d '
{
   "force_resume": true
}'
```

Response:

```json
{
   "acknowledged": true
}
```

### Step 4: Monitor progress

After force resume is initiated, the follower index is temporarily unavailable while the snapshot restore is in progress. Monitor the status:

```bash
curl -XGET -k -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/follower-01/_status?pretty'
```

During the restore:

```json
{
  "status": "RESTORING",
  "reason": "User initiated",
  "leader_alias": "my-connection-alias",
  "leader_index": "leader-01",
  "follower_index": "follower-01"
}
```

After the restore completes:

```json
{
  "status": "SYNCING",
  "reason": "User initiated",
  "leader_alias": "my-connection-alias",
  "leader_index": "leader-01",
  "follower_index": "follower-01",
  "syncing_details": {
    "leader_checkpoint": 150,
    "follower_checkpoint": 150,
    "seq_no": 0
  }
}
```

## Behavior details

### Retention lease handling

During the force resume process, retention leases are acquired by `RemoteClusterRepository` as part of the snapshot restore phase. This is the same mechanism used when starting replication for the first time. The leases ensure that the leader retains translog operations from the restore point forward, allowing the follower to catch up with any writes that occurred during the restore.

### Interaction with the `force_resume` flag

The following table describes the behavior based on the state of the retention lease and the `force_resume` flag.

Retention lease state | `force_resume` value | Behavior
:--- | :--- | :---
Exists (valid) | `false` or omitted | Normal resume. Translog-based replication continues from where it left off.
Exists (valid) | `true` | Normal resume. The flag is ignored because the lease is still valid and a normal resume can proceed.
Expired | `false` or omitted | Request fails with a `404` error suggesting the use of `force_resume=true`.
Expired | `true` | Stop-delete-start cycle is triggered. The follower index is restored from the leader via snapshot.

### Failure recovery

Force resume internally executes stop, delete, and start as sequential steps. If a failure occurs at any stage:

- **If stop fails** — The operation is aborted and the follower remains in a `PAUSED` state. No changes are made. You can retry force resume.
- **If delete fails after stop** — Replication has been stopped but the follower index still exists. You can manually delete the index and start replication, or retry force resume.
- **If start fails after delete** — The follower index has been deleted and replication metadata has been cleaned up. You need to manually start replication using the standard start replication API with the original connection alias and leader index.
- **If the snapshot restore fails** — The replication task transitions to a failed state and auto-pauses. You can retry force resume.

### Concurrent requests

Only one resume or force resume operation can run at a time for a given index. If a second request is sent while a force resume is in progress, it is rejected.

## Limitations

- **Follower index unavailability** — During the force resume process, the follower index is deleted and restored. It is completely unavailable for search queries during this time. The duration depends on the index size and network bandwidth between clusters.
- **No partial restore** — Force resume restores the entire index. There is no option to restore only specific shards.
- **Fresh start** — After force resume, replication checkpoints start from zero. The follower index is a fresh copy of the leader at the time of the snapshot restore.
- **Non-atomic operation** — Because force resume internally performs stop, delete, and start as separate steps, a failure between steps may require manual intervention (see [Failure recovery](#failure-recovery)).

## Security

Force resume reuses the security context from the original replication configuration. The internal start operation uses `isAutoFollowRequest=true` to skip redundant setup checks, since the user already had the required permissions when replication was originally configured. All force resume operations are logged for audit purposes.
