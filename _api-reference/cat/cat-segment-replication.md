---
layout: default
title: CAT segment replication
parent: CAT API
nav_order: 53
has_children: false
---

# CAT segment replication
**Introduced 2.7**
{: .label .label-purple }

The CAT segment replication operation returns information about active and last completed [segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/index) events on each replica shard, including related shard-level metrics. These metrics provide information about how far behind the primary shard the replicas are lagging.

Call the CAT Segment Replication API only on indexes with segment replication enabled.
{: .note}

## Path and HTTP methods

```json
GET /_cat/segment_replication
GET /_cat/segment_replication/<index>
```

## Path parameters

The following table lists the available optional path parameter.

Parameter | Type | Description
:--- | :--- | :---
`index` | String | The name of the index, or a comma-separated list or wildcard expression of index names used to filter results. If this parameter is not provided, the response contains information about all indexes in the cluster.

## Query parameters

The CAT segment replication API operation supports the following optional query parameters.

Parameter | Data type  | Description
:--- |:-----------| :---
`active_only` | Boolean    | If `true`, the response only includes active segment replications. Defaults to `false`. 
[`detailed`](#additional-detailed-response-metrics) | String     | If `true`, the response includes additional metrics for each stage of a segment replication event. Defaults to `false`.
`shards` | String     | A comma-separated list of shards to display.
`bytes` | Byte units | [Units]({{site.url}}{{site.baseurl}}/opensearch/units/) used to display byte size values.
`format` | String     | A short version of the HTTP accept header. Valid values include `JSON` and `YAML`.  
`h` | String     | A comma-separated list of column names to display. 
`help` | Boolean    | If `true`, the response includes help information. Defaults to `false`.
`time` | Time units | [Units]({{site.url}}{{site.baseurl}}/opensearch/units/) used to display time values.
`v` | Boolean    | If `true`, the response includes column headings. Defaults to `false`.
`s` | String     | Specifies to sort the results. For example, `s=shardId:desc` sorts by shardId in descending order.

## Example

The following examples illustrate various segment replication responses.

#### Example 1: No active segment replication events

The following query requests segment replication metrics with column headings for all indexes:

```json
GET /_cat/segment_replication?v=true
```
{% include copy-curl.html %}

The response contains the metrics for the preceding request:

```bash
shardId target_node target_host checkpoints_behind bytes_behind current_lag last_completed_lag rejected_requests
[index-1][0] runTask-1 127.0.0.1 0 0b 0s 7ms 0
```

#### Example 2: Shard ID specified

The following query requests segment replication metrics with column headings for shards with the ID `0` from indexes `index1` and `index2`:

```json
GET /_cat/segment_replication/index1,index2?v=true&shards=0
```
{% include copy-curl.html %}

The response contains the metrics for the preceding request. The column headings correspond to the metric names:

```bash
shardId target_node target_host checkpoints_behind bytes_behind current_lag last_completed_lag rejected_requests
[index-1][0] runTask-1 127.0.0.1 0 0b 0s 3ms 0
[index-2][0] runTask-1 127.0.0.1 0 0b 0s 5ms 0
```

#### Example 3: Detailed response

The following query requests detailed segment replication metrics with column headings for all indexes:

```json
GET /_cat/segment_replication?v=true&detailed=true
```
{% include copy-curl.html %}

The response contains additional metrics about the files and stages of a segment replication event:

```bash
shardId target_node target_host checkpoints_behind bytes_behind current_lag last_completed_lag rejected_requests stage time files_fetched files_percent bytes_fetched bytes_percent start_time stop_time files files_total bytes bytes_total replicating_stage_time_taken get_checkpoint_info_stage_time_taken file_diff_stage_time_taken get_files_stage_time_taken finalize_replication_stage_time_taken
[index-1][0] runTask-1 127.0.0.1 0 0b 0s 3ms 0 done 10ms 6 100.0% 4753 100.0% 2023-03-16T13:46:16.802Z 2023-03-16T13:46:16.812Z 6 6 4.6kb 4.6kb 0s 2ms 0s 3ms 3ms
[index-2][0] runTask-1 127.0.0.1 0 0b 0s 5ms 0 done 7ms 3 100.0% 3664 100.0% 2023-03-16T13:53:33.466Z 2023-03-16T13:53:33.474Z 3 3 3.5kb 3.5kb 0s 1ms 0s 2ms 2ms
```

#### Example 4: Sorting the results

The following query requests segment replication metrics with column headings for all indexes, sorted by shard ID in descending order:

```json
GET /_cat/segment_replication?v&s=shardId:desc
```
{% include copy-curl.html %}

The response contains the sorted results:

```bash
shardId    target_node  target_host checkpoints_behind bytes_behind current_lag last_completed_lag rejected_requests
[test6][1] runTask-2   127.0.0.1   0                  0b           0s          5ms                0
[test6][0] runTask-2   127.0.0.1   0                  0b           0s          4ms                0
```

#### Example 5: Using a metric alias 

In a request, you can either use a metric's full name or one of its aliases. The following query is the same as the preceding query, but it uses the alias `s` instead of `shardID` for sorting:

```json
GET /_cat/segment_replication?v&s=s:desc
```
{% include copy-curl.html %}

## Response metrics

The following table lists the response metrics that are returned for all requests. When referring to a metric in a query parameter, you can provide either the metric's full name or any of its aliases, as shown in the previous [example](#example-5-using-a-metric-alias).

Metric | Alias | Description
:--- | :--- | :---
`shardId` | `s` | The ID of a specific shard.
`target_host` | `thost` | The target host IP address.
`target_node` | `tnode` | The target node name.
`checkpoints_behind` | `cpb` | The number of checkpoints by which the replica shard is behind the primary shard.
`bytes_behind` | `bb` | The number of bytes by which the replica shard is behind the primary shard.
`current_lag` | `clag` | The time elapsed while waiting for a replica shard to catch up to the primary shard.
`last_completed_lag` | `lcl` | The time taken for a replica shard to catch up to the latest primary shard refresh.
`rejected_requests` | `rr` | The number of rejected requests for the replication group.

### Additional detailed response metrics

The following table lists the additional response fields returned if `detailed` is set to `true`.

Metric | Alias | Description
:--- |:--- |:---
`stage` | `st` | The current stage of a segment replication event.
`time` | `t`, `ti` | The amount of time a segment replication event took to complete, in milliseconds.
`files_fetched` | `ff` | The number of files fetched so far for a segment replication event.
`files_percent` | `fp` | The percentage of files fetched so far for a segment replication event.
`bytes_fetched` | `bf` | The number of bytes fetched so far for a segment replication event.
`bytes_percent` | `bp` | The number of bytes fetched so far for a segment replication event as a percentage.
`start_time` | `start` | The segment replication start time.
`stop_time` | `stop` | The segment replication stop time.
`files` | `f` | The number of files that needs to be fetched for a segment replication event.
`files_total` | `tf` | The total number of files that are part of this recovery, including both reused and recovered files.
`bytes` | `b` | The number of bytes that needs to be fetched for a segment replication event.
`bytes_total` | `tb` | The total number of bytes in the shard.
`replicating_stage_time_taken` | `rstt` | The amount of time the `replicating` stage of a segment replication event took to complete. 
`get_checkpoint_info_stage_time_taken` | `gcistt` | The amount of time the `get checkpoint info` stage of a segment replication event took to complete. 
`file_diff_stage_time_taken` | `fdstt` | The amount of time the `file diff` stage of a segment replication event took to complete. 
`get_files_stage_time_taken` | `gfstt` | The amount of time the `get files` stage of a segment replication event took to complete. 
`finalize_replication_stage_time_taken` | `frstt` | The amount of time the `finalize replication` stage of a segment replication event took to complete.
