---
layout: default
title: CAT segment replication
parent: CAT API
nav_order: 53
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-segment-replication/
---

# CAT segment replication
**Introduced 2.7**
{: .label .label-purple }

The CAT segment replication operation returns information about active and last completed [segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/index) events on each replica shard, including related shard-level metrics. These metrics provide information about how far behind the primary shard the replicas are lagging.

Call the CAT Segment Replication API only on indexes with segment replication enabled.
{: .note}

<!-- spec_insert_start
api: cat.segment_replication
component: endpoints
-->
## Endpoints
```json
GET /_cat/segment_replication
GET /_cat/segment_replication/{index}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cat.segment_replication
component: path_parameters
columns: Parameter, Data type, Description
include_deprecated: false
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. |

<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.segment_replication
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `active_only` | Boolean | When `true`, the response only includes ongoing segment replication events. | `false` |
| `allow_no_indices` | Boolean | Whether to ignore the index if a wildcard index expression resolves to no concrete indexes. This includes the `_all` string or when no indexes have been specified. | N/A |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, `p` | N/A |
| `completed_only` | Boolean | When `true`, the response only includes the last-completed segment replication events. | `false` |
| `detailed` | Boolean | When `true`, the response includes additional metrics for each stage of a segment replication event. | `false` |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `ignore_throttled` | Boolean | Whether specified concrete, expanded, or aliased indexes should be ignored when throttled. | N/A |
| `ignore_unavailable` | Boolean | Whether the specified concrete indexes should be ignored when missing or closed. | N/A |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `shards` | List | A comma-separated list of shards to display. | N/A |
| `time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, `d` | N/A |
| `timeout` | String | The operation timeout. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`index` | String | The name of the index, or a comma-separated list or wildcard expression of index names used to filter results. If this parameter is not provided, the response contains information about all indexes in the cluster.

## Query parameters

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

## Example requests

The following examples illustrate various segment replication responses.

### No active segment replication events

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

###  Shard ID specified

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

###  Detailed response

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

###  Sorting the results

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

### Using a metric alias 

In a request, you can either use a metric's full name or one of its aliases. The following query is the same as the preceding query, but it uses the alias `s` instead of `shardID` for sorting:

```json
GET /_cat/segment_replication?v&s=s:desc
```
{% include copy-curl.html %}

## Example response metrics

The following table lists the response metrics that are returned for all requests. When referring to a metric in a query parameter, you can provide either the metric's full name or any of its aliases, as shown in the previous [example](#using-a-metric-alias).

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
