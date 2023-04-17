---
layout: default
title: Segment replication back-pressure
nav_order: 10
parent: Segment replication
---

## Segment replication back-pressure

Segment replication back-pressure is a per-shard level rejection mechanism that dynamically rejects indexing requests when replica shards in your cluster are falling behind primary shards. Segment replication back-pressure mechanism starts rejecting indexing requests when more than half of the replication group is stale. This is defined by the `MAX_ALLOWED_STALE_SHARDS` parameter. A replica is considered stale if it's behind more than the defined `MAX_INDEXING_CHECKPOINTS` parameter, and its current replication lag is over the defined `MAX_REPLICATION_TIME_SETTING` parameter.

Replica shards are also monitored to determine whether the shards are stuck or are lagging for an extended period of time. When replica shards are stuck or lagging for more than double the defined `MAX_REPLICATION_TIME_SETTING` parameter, shards are removed and replaced with new replica shards.

## Path and HTTP methods

```
PUT _cluster/settings
GET _cat/segment_replication
```

## Query parameters

All settings below are dynamic cluster setting and users can enable or disable settings using `PUT _cluster/settings`.

`SEGMENT_REPLICATION_INDEXING_PRESSURE_ENABLED` setting must be set to true for rest of the back-pressure settings to work.

Parameter | Data type | Description
:--- | :--- | :---
SEGMENT_REPLICATION_INDEXING_PRESSURE_ENABLED | Boolean | is a setting that enables segment replication back-pressure mechanism. By default segment replication back-pressure is `false` (disabled).
MAX_REPLICATION_TIME_SETTING | Time unit | setting is the maximum time that a replica shard can take to copy from primary. Once `MAX_REPLICATION_TIME_SETTING` is breached along with `MAX_INDEXING_CHECKPOINTS`, then segment replication back-pressure mechanism gets triggered. The default value of this setting is `5 minutes`.
MAX_INDEXING_CHECKPOINTS | Integer | setting is the maximum number of indexing checkpoints that a replica shard can fall behind when copying from primary. Once `MAX_INDEXING_CHECKPOINTS` is breached along with `MAX_REPLICATION_TIME_SETTING` then segment replication back-pressure mechanism gets triggered. The default value of this setting is `4 checkpoints`.
MAX_ALLOWED_STALE_SHARDS | Float | setting is the maximum number of stale replica shards that can exist in a replication group. Once `MAX_ALLOWED_STALE_SHARDS` is breached then segment replication back-pressure mechanism gets triggered. The default value of this setting is `.5` which 50% of a replication group.

## API

```bash
GET _cat/segment_replication
```

API is used to fetch metrics related to segment replication back-pressure:

#### Example response

- Parameters: checkpoints_behind and current_lag directly correlate with MAX_INDEXING_CHECKPOINTS and MAX_REPLICATION_TIME_SETTING .
- These checkpoints_behind and current_lag metrics are taken into consideration when triggering segment replication back-pressure mechanism.

```json
shardId       target_node    target_host   checkpoints_behind bytes_behind   current_lag   last_completed_lag   rejected_requests
[index-1][0]     runTask-1    127.0.0.1              0              0b           0s              7ms                    0
```
