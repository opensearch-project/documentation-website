---
layout: default
title: CAT segment replication
parent: CAT API

nav_order: 57
has_children: false
---

# CAT segment replication
Introduced 2.6
{: .label .label-purple }

The CAT segment replication operation returns information about active and completed segment replication events for replica shards. This API returns metrics on a shard level.

Call the CAT Segment Replication API only on indexes with segment replication enabled.
{: .note}

[Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/index) is the process of copying segment files from primary shard to replica shards. When the primary shard sends a checkpoint to replica shards on a refresh, a new segment replication event is triggered on replica shards. This happens when:

- A new replica shard is added to a cluster.
- There are segment file changes on a primary shard refresh.
- Replica shards are being recovered from primary shard using peer recovery.

## Path and HTTP methods

```json
GET /_cat/segment_replication
GET /_cat/segment_replication/<index>
```

## Path parameters

The following table lists the available optional path parameter.

Parameter | Type | Description
:--- |:-------| :---
index | String | A comma-separated list or a wildcard expression of index names used to filter results. Defaults to all indexes in the cluster.

## Query parameters

You can include the following query parameters in your request. All query parameters are optional.

Parameter | Data type | Description
:--- |:---| :---
active_only | Boolean | If `true`, the response only includes active segment replications. Defaults to `false`.
[default](#additional-metrics-returned-when-default-is-set-to-true) | String | If `true`, the response includes additional metrics about the start and stop time of a segment replication event. Defaults to `false`.
[detailed](#additional-metrics-returned-when-detailed-is-set-to-true) | String | If `true`, the response includes detailed metrics about the files and stages of a segment replication event. Defaults to `false`.
completed_only | Boolean | If `true`, the response only includes the latest completed segment replications. Defaults to `false`.
shards | String | A comma-separated list of shards to display.
format | String | A short version of the HTTP accept header. Valid values are: `JSON`, `YAML`, and so on.
h | String | A comma-separated list of metrics to display.
help | Boolean | If `true`, the response includes help information. Defaults to `false`.
time | Time value | [Units]({{site.url}}{{site.baseurl}}/opensearch/units) used to display time values. Defaults to `ms` (milliseconds).
v | Boolean | If `true`, the response includes column headings. Defaults to `false`.

## Examples 

#### Sample request

The following query requests segment replication metrics for shards with the ID `0` from indexes `index1` and `index2` with column headings:

```json
GET /_cat/segment_replication/index1,index2?v=true&shards=0
```

#### Sample response

The response contains the metrics for the preceding request. The column headings correspond to the metric names:

```bash
index shardId time stage source_description target_host target_node files_fetched files_percent bytes_fetched bytes_percent
index2 0 8ms done runTask-1 127.0.0.1 runTask-2 3 100.0% 3661 100.0%
index1 0 19ms done runTask-1 127.0.0.1 runTask-2 3 100.0% 3661 100.0%
```

If `detailed` is set to `true`, the response contains additional metrics about the files and stages of a segment replication event.

#### Sample request

The following query requests detailed segment replication metrics for shards with the ID `0` from indexes `index1` and `index2` with column headings:

```json
GET /_cat/segment_replication/index1,index2?v=true&shards=0&detailed=true
```

#### Sample response

The response contains the detailed metrics for the preceding request:

```bash
index shardId time stage source_description target_host target_node files_fetched files_percent bytes_fetched bytes_percent files files_total bytes bytes_total replicating_stage_time_taken get_checkpoint_info_stage_time_taken file_diff_stage_time_taken get_files_stage_time_taken finalize_replication_stage_time_taken
index2 0 21ms done runTask-1 127.0.0.1 runTask-2 3 100.0% 3661 100.0% 3 3 3661 3661 0s 2ms 0s 4ms 14ms
index1 0 9ms done runTask-1 127.0.0.1 runTask-2 3 100.0% 3661 100.0% 3 3 3661 3661 0s 2ms 0s 3ms 3ms
```

## Response metrics

The following table lists the response metrics that are returned for all requests.

Metric | Description
:--- |:---
index | The name of the index.
shardId | The ID of a specific shard.
time | The time a segment replication event took to complete, in milliseconds.
stage | The current stage of a segment replication event.
source_description | The description of the source.
target_host | The target host IP address.
target_node | The target node name.
files_fetched | The number of files fetched so far for a segment replication event.
files_percent | The percentage of files fetched so far for a segment replication event.
bytes_fetched | The number of bytes fetched so far for a segment replication event.
bytes_percent| The number of bytes fetched so far for a segment replication event as a percentage.

### Additional metrics returned when `default` is set to `true`

The following table lists the additional response fields that if `default` is set to `true`.

Metric | Description
:--- |:---
start_time | The segment replication start time.
start_time_millis | The segment replication start time in epoch milliseconds.
stop_time | The segment replication stop time.
stop_time_millis | The segment replication stop time in epoch milliseconds. 

### Additional metrics returned when `detailed` is set to `true`

The following table lists the additional response fields that if `detailed` is set to `true`.

Metric | Description
:--- |:---
files | The number of files that needs to be fetched for a segment replication event.
files_total | The total number of files that are part of this recovery, including both reused and recovered files.
bytes | The number of bytes that needs to be fetched for a segment replication event.
bytes_total | The total number of bytes in the shard.
replicating_stage_time_taken | The time the `replicating` stage of a segment replication event took to complete. 
get_checkpoint_info_stage_time_taken | The time the `get checkpoint info` stage of a segment replication event took to complete. 
file_diff_stage_time_taken | The time the `file diff` stage of a segment replication event took to complete. 
get_files_stage_time_taken | The time the `get files` stage of a segment replication event took to complete. 
finalize_replication_stage_time_taken | The time the `finalize replication` stage of a segment replication event took to complete.
