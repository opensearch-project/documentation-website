---
layout: default
title: Segment replication back-pressure
nav_order: 75
parent: Segment replication
has_children: false
grand_parent: Availability and Recovery
---

## Segment replication back-pressure

Segment replication back-pressure is a per-shard level rejection mechanism that dynamically rejects indexing requests when the number of replica shards in your cluster are falling behind the number of primary shards. With Segment replication back-pressure, indexing requests are rejected when more than half of the replication group is stale, which is defined by the `MAX_ALLOWED_STALE_SHARDS` field. A replica is considered stale if it is behind by more than the defined `MAX_INDEXING_CHECKPOINTS` field, and its current replication lag is over the defined `MAX_REPLICATION_TIME_SETTING` field.

Replica shards are also monitored to determine whether the shards are stuck or are lagging for an extended period of time. When replica shards are stuck or lagging for more than double the amount of time defined by the `MAX_REPLICATION_TIME_SETTING` field, the shards are removed and then replaced with new replica shards.

## Request fields

Segment replication back-pressure is enabled by default. The following are dynamic cluster settings, and can be enabled or disabled using the [cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) API endpoint.

Field | Data type | Description
:--- | :--- | :---
SEGMENT_REPLICATION_INDEXING_PRESSURE_ENABLED | Boolean | Enables the segment replication back-pressure mechanism. Default is `true`.
MAX_REPLICATION_TIME_SETTING | Time unit | The maximum time that a replica shard can take to copy from primary. Once `MAX_REPLICATION_TIME_SETTING` is breached along with `MAX_INDEXING_CHECKPOINTS`, the segment replication back-pressure mechanism is triggered. Default is `5 minutes`.
MAX_INDEXING_CHECKPOINTS | Integer | The maximum number of indexing checkpoints that a replica shard can fall behind when copying from primary. Once `MAX_INDEXING_CHECKPOINTS` is breached along with `MAX_REPLICATION_TIME_SETTING`, the segment replication back-pressure mechanism is triggered. Default is `4` checkpoints.
MAX_ALLOWED_STALE_SHARDS | Floating point | The maximum number of stale replica shards that can exist in a replication group. Once `MAX_ALLOWED_STALE_SHARDS` is breached, the segment replication back-pressure mechanism is triggered. Default is `.5`, which is 50% of a replication group.

## Path and HTTP methods

You can use the segment replication API endpoint to retrieve segment replication back-pressure metrics.

```bash
GET _cat/segment_replication
```
{% include copy-curl.html %}

#### Example response

```json
shardId       target_node    target_host   checkpoints_behind bytes_behind   current_lag   last_completed_lag   rejected_requests
[index-1][0]     runTask-1    127.0.0.1              0              0b           0s              7ms                    0
```

- `checkpoints_behind` and `current_lag` directly correlate with `MAX_INDEXING_CHECKPOINTS` and `MAX_REPLICATION_TIME_SETTING`.
- `checkpoints_behind` and `current_lag` metrics are taken into consideration when triggering segment replication back-pressure.
