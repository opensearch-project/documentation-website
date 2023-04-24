---
layout: default
title: Segment replication back-pressure
nav_order: 75
parent: Segment replication
has_children: false
grand_parent: Availability and Recovery
---

## Segment replication backpressure

Segment replication backpressure is a shard-level rejection mechanism that dynamically rejects indexing requests as replica shards in your cluster fall behind primary shards. With segment replication backpressure, indexing requests are rejected when the percentage of stale shards in the replication group exceeds `MAX_ALLOWED_STALE_SHARDS` (50% by default). A replica is considered stale if it is behind the primary shard by the number of checkpoints that exceeds the `MAX_INDEXING_CHECKPOINTS` setting and its current replication lag is greater than the defined `MAX_REPLICATION_TIME_SETTING` field.

Replica shards are also monitored to determine whether the shards are stuck or lagging for an extended period of time. When replica shards are stuck or lagging for more than double the amount of time defined by the `MAX_REPLICATION_TIME_SETTING` field, the shards are removed and replaced with new replica shards.

## Request fields

Segment replication backpressure is disabled by default. To enable it, set `SEGMENT_REPLICATION_INDEXING_PRESSURE_ENABLED` to `true`. You can update the following dynamic cluster settings using the [cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) API endpoint.

Field | Data type | Description
:--- | :--- | :---
SEGMENT_REPLICATION_INDEXING_PRESSURE_ENABLED | Boolean | Enables the segment replication backpressure mechanism. Default is `false`.
MAX_REPLICATION_TIME_SETTING | Time unit | The maximum amount of time that a replica shard can take to copy from the primary shard. Once `MAX_REPLICATION_TIME_SETTING` is breached along with `MAX_INDEXING_CHECKPOINTS`, the segment replication backpressure mechanism is initiated. Default is `5 minutes`.
MAX_INDEXING_CHECKPOINTS | Integer | The maximum number of indexing checkpoints that a replica shard can fall behind when copying from primary. Once `MAX_INDEXING_CHECKPOINTS` is breached along with `MAX_REPLICATION_TIME_SETTING`, the segment replication backpressure mechanism is initiated. Default is `4` checkpoints.
MAX_ALLOWED_STALE_SHARDS | Floating point | The maximum number of stale replica shards that can exist in a replication group. Once `MAX_ALLOWED_STALE_SHARDS` is breached, the segment replication backpressure mechanism is initiated. Default is `.5`, which is 50% of a replication group.

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

The `checkpoints_behind` and `current_lag` metrics are taken into consideration when initiating segment replication backpressure. They are checked against `MAX_INDEXING_CHECKPOINTS` and `MAX_REPLICATION_TIME_SETTING`, respectively.
