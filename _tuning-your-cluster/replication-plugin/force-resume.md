---
layout: default
title: Force-resume
nav_order: 25
parent: Cross-cluster replication
---

# Force-resume replication
**Introduced 3.8**
{: .label .label-purple }


When cross-cluster replication is paused for longer than the retention lease duration (controlled by the `index.soft_deletes.retention_lease.period` setting on the leader index, which defaults to 12 hours), the leader cluster's translog no longer retains the operations needed by the follower. A normal resume request fails because the retention lease has expired. You can use the `force_resume` parameter when sending a resume request to restore the follower index from a snapshot of the leader and reestablish replication. This eliminates the need to manually stop the existing replication, delete the follower index, and start replication from the beginning.

Force-resuming replication follows these steps:

1. Validate that the replication is currently in a `PAUSED` state and that the retention lease has expired (making a normal resume impossible). If the retention lease has not expired, the `force_resume` flag is ignored and replication resumes normally.
1. Stop replication by calling the existing stop replication action, which deletes replication metadata and removes the index block and the replication task.
1. Delete the follower index so it can be restored from a snapshot.
1. Start replication using the original connection alias and leader index configuration. This triggers a snapshot restore from the leader cluster and acquires new retention leases during the restore process.
1. Resume translog-based replication after the restore completes. Shard replication tasks start and use the newly acquired retention leases to replicate ongoing operations from the leader.

Force-resume uses the original replication permissions and does not require reconfiguration. All operations are logged for auditing.
{: .note}

## Force-resume workflow

The following example demonstrates a complete force-resume workflow.

### Step 1: Verify the replication status

Confirm that replication is paused and identify the reason for the pause:

```json
GET /_plugins/_replication/follower-01/_status
```
{% include copy-curl.html %}

For example, the following response shows that replication is in a user-initiated paused state:

```json
{
  "status": "PAUSED",
  "reason": "User initiated",
  "leader_alias": "my-connection-alias",
  "leader_index": "leader-01",
  "follower_index": "follower-01"
}
```

### Step 2: Attempt resuming replication normally

Try to resume replication normally:

```json
POST /_plugins/_replication/follower-01/_resume
{}
```
{% include copy-curl.html %}

If the retention lease has expired, you receive the following error:

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

### Step 3: Use force-resume

Use force-resume to restore the follower index from a snapshot:

```json
POST /_plugins/_replication/follower-01/_resume
{
   "force_resume": true
}
```
{% include copy-curl.html %}


### Step 4: Monitor the resume progress

After force-resume is initiated, the follower index is temporarily unavailable while the snapshot restore is in progress. To monitor its status, send the following request:

```json
GET /_plugins/_replication/follower-01/_status
```
{% include copy-curl.html %}

During the snapshot restore, the `status` is `RESTORING`:

```json
{
  "status": "RESTORING",
  "reason": "User initiated",
  "leader_alias": "my-connection-alias",
  "leader_index": "leader-01",
  "follower_index": "follower-01"
}
```

After the restore completes, the `status` changes to `SYNCING`:

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

## Failure recovery

The following list describes the expected behavior if a failure occurs at any stage during force-resume:

- If stop fails, the operation is aborted and the follower remains in a `PAUSED` state. No changes are made. You can retry force-resume.
- If delete fails after stop, replication has been stopped but the follower index still exists. You can manually delete the index and start replication, or retry force-resume.
- If start fails after delete, the follower index has been deleted and replication metadata has been removed. You need to manually start replication using the standard start replication API with the original connection alias and leader index.
- If the snapshot restore fails, the replication task transitions to a failed state and auto-pauses. You can retry force-resume.

## Limitations

Note the following limitations:

- During the force-resume process, the follower index is deleted and restored. It is unavailable for search queries during this time. The duration depends on the index size and network bandwidth between clusters.
- Force-resume restores the entire index. There is no option to restore only specific shards.
- After force-resume, the follower index is a fresh copy of the leader at the time of the snapshot restore, and replication continues from that point forward.
- Only one resume or force-resume operation can run at a time for a given index. A second request sent while force-resume is in progress is rejected.

## Related documentation

- For the API reference, including the request syntax and parameters, see [Resume replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/api/#resume-replication).