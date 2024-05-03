---
layout: default
title: Segment replication backpressure
nav_order: 75
parent: Segment replication
has_children: false
grand_parent: Availability and recovery
---

# Segment replication backpressure

Segment replication backpressure is a shard-level rejection mechanism that dynamically rejects indexing requests as replica shards in your cluster fall behind primary shards. With segment replication backpressure, indexing requests are rejected when the percentage of stale shards in the replication group exceeds `segrep.pressure.replica.stale.limit` (50% by default). A replica is considered stale if it is behind the primary shard by the number of checkpoints that exceeds the `segrep.pressure.checkpoint.limit` setting and its current replication lag is greater than the defined `segrep.pressure.time.limit` field.

Replica shards are also monitored to determine whether the shards are stuck or lagging for an extended period of time. When replica shards are stuck or lagging for more than double the amount of time defined by the `segrep.pressure.time.limit` field, the shards are removed and replaced with new replica shards.

## Request fields

Segment replication backpressure is disabled by default. To enable it, set `segrep.pressure.enabled` to `true`. You can update the following dynamic cluster settings using the [cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) API endpoint.

Field | Data type | Description
:--- | :--- | :---
`segrep.pressure.enabled `| Boolean | Enables the segment replication backpressure mechanism. Default is `false`.
`segrep.pressure.time.limit` | Time unit | The maximum amount of time that a replica shard can take to copy from the primary shard. Once `segrep.pressure.time.limit` is breached along with `segrep.pressure.checkpoint.limit`, the segment replication backpressure mechanism is initiated. Default is `5 minutes`.
`segrep.pressure.checkpoint.limit` | Integer | The maximum number of indexing checkpoints that a replica shard can fall behind when copying from primary. Once `segrep.pressure.checkpoint.limit` is breached along with `segrep.pressure.time.limit`, the segment replication backpressure mechanism is initiated. Default is `4` checkpoints.
`segrep.pressure.replica.stale.limit `| Floating point | The maximum number of stale replica shards that can exist in a replication group. Once `segrep.pressure.replica.stale.limit` is breached, the segment replication backpressure mechanism is initiated. Default is `.5`, which is 50% of a replication group.

## Path and HTTP methods

You can use the segment replication API endpoint to retrieve segment replication backpressure metrics as follows:

```bash
GET _cat/segment_replication
```
{% include copy-curl.html %}

#### Example response

```json
shardId       target_node    target_host   checkpoints_behind bytes_behind   current_lag   last_completed_lag   rejected_requests
[index-1][0]     runTask-1    127.0.0.1              0              0b           0s              7ms                    0
```

The `checkpoints_behind` and `current_lag` metrics are taken into consideration when initiating segment replication backpressure. They are checked against `segrep.pressure.checkpoint.limit` and `segrep.pressure.time.limit`, respectively.
