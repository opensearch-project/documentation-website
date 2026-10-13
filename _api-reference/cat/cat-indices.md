---
layout: default
title: CAT indices
parent: CAT APIs
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-indices/
---

# CAT Indices API
**Introduced 1.0**
{: .label .label-purple }

The CAT indices operation lists information related to indexes, that is, how much disk space they are using, how many shards they have, their health status, and so on.

The document counts in the response are sourced directly from Lucene, so they include hidden [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) documents. For example, a document containing two nested objects counts as three documents. To count only top-level documents, use the [CAT count]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-count/) or [Count]({{site.url}}{{site.baseurl}}/api-reference/search-apis/count/) API.


<!-- spec_insert_start
api: cat.indices
component: endpoints
-->
## Endpoints
```json
GET /_cat/indices
GET /_cat/indices/{index}
```
<!-- spec_insert_end -->


## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | `open,closed` if `system` is `false` or omitted, `open,closed,hidden` if `system` is `true`. |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `health` | String | Limits indexes based on their health status. Supported values are `green`, `yellow`, and `red`. <br> Valid values are: `green`, `GREEN`, `yellow`, `YELLOW`, `red`, and `RED`. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `include_unloaded_segments` | Boolean | Whether to include information from segments not loaded into memory. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `pri` | Boolean | When `true`, returns information only from the primary shards. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `system` | Boolean | Filters indexes by their system index classification. When `true`, returns only system indexes. When `false`, returns only non-system indexes. For more information, see [System indexes](#system-indexes). | N/A |
| `time` | String | Specifies the time units. <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, and `d`. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

## Example requests

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices?v
-->
{% capture step1_rest %}
GET /_cat/indices?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To limit the information to a specific index, add the index name after your query.

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices/<index>?v
-->
{% capture step1_rest %}
GET /_cat/indices/<index>?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  index = "<index>",
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If you want to get information for more than one index, separate the indexes with commas:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices/index1,index2,index3
-->
{% capture step1_rest %}
GET /_cat/indices/index1,index2,index3
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  index = "index1,index2,index3"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
```

## Response columns

By default, the response contains the `health`, `status`, `index`, `uuid`, `pri`, `rep`, `docs.count`, `docs.deleted`, `store.size`, and `pri.store.size` columns. To choose the columns to display, provide a comma-separated list of column names or aliases in the `h` query parameter. The `h` parameter also accepts wildcards, for example, `h=index,search.*`. To list all available columns, send `GET /_cat/indices?help`.

For example, the following request returns the name, health, document count, and store size of the `opensearch_dashboards_sample_data_ecommerce` index:

```json
GET /_cat/indices/opensearch_dashboards_sample_data_ecommerce?v&h=index,health,docs.count,store.size
```
{% include copy-curl.html %}

The response contains only the requested columns:

```json
index                                       health docs.count store.size
opensearch_dashboards_sample_data_ecommerce green        4675        4mb
```

The following table lists the general index information columns.

| Column | Aliases | Description |
| :--- | :--- | :--- |
| `health` | `h` | The current health status of the index. |
| `status` | `s` | Whether the index is open or closed. |
| `index` | `i`, `idx` | The index name. |
| `uuid` | `id` | The index UUID. |
| `pri` | `p`, `shards.primary`, `shardsPrimary` | The number of primary shards. |
| `rep` | `r`, `shards.replica`, `shardsReplica` | The number of replica shards. |
| `docs.count` | `dc`, `docsCount` | The number of available documents. |
| `docs.deleted` | `dd`, `docsDeleted` | The number of deleted documents. |
| `creation.date` | `cd` | The index creation date, in milliseconds since the epoch. |
| `creation.date.string` | `cds` | The index creation date, as a string. |
| `store.size` | `ss`, `storeSize` | The store size of the primary and replica shards. |
| `pri.store.size` | N/A | The store size of the primary shards. |
| `search.throttled` | `sth` | Whether search on the index is throttled. |
| `last_index_request_timestamp` | `last_index_ts`, `lastIndexRequestTimestamp` | The timestamp of the last processed index request, in milliseconds since the epoch. |
| `last_index_request_timestamp_string` | `last_index_ts_string`, `lastIndexRequestTimestampString` | The timestamp of the last processed index request, as an ISO 8601 string. |
| `system` | `sys` | Whether the index is marked as a system index in the cluster metadata. Returned when you specify the `system` query parameter. For more information, see [System indexes](#system-indexes). |
| `system.description` | `sysdesc` | The description from the matching system index descriptor, when available. Returned when you specify the `system` query parameter. For more information, see [System indexes](#system-indexes). |

The following table lists the index statistics columns. These columns report values for both primary and replica shards. Each column has a counterpart prefixed with `pri.` that reports the value for primary shards only, for example, `pri.completion.size` or `pri.search.query_total`. The `pri.` columns have no aliases. The primary-shard counterparts of `search.startree_query_current`, `search.startree_query_time`, and `search.startree_query_total` are named `pri.search.startree.query_current`, `pri.search.startree.query_time`, and `pri.search.startree.query_total`.

| Column | Aliases | Description |
| :--- | :--- | :--- |
| `completion.size` | `cs`, `completionSize` | The size of the completion data. |
| `fielddata.evictions` | `fe`, `fielddataEvictions` | The number of field data cache evictions. |
| `fielddata.memory_size` | `fm`, `fielddataMemory` | The memory used by the field data cache. |
| `flush.total` | `ft`, `flushTotal` | The number of flush operations. |
| `flush.total_time` | `ftt`, `flushTotalTime` | The time spent in flush operations. |
| `get.current` | `gc`, `getCurrent` | The number of current get operations. |
| `get.exists_time` | `geti`, `getExistsTime` | The time spent in successful get operations. |
| `get.exists_total` | `geto`, `getExistsTotal` | The number of successful get operations. |
| `get.missing_time` | `gmti`, `getMissingTime` | The time spent in failed get operations. |
| `get.missing_total` | `gmto`, `getMissingTotal` | The number of failed get operations. |
| `get.time` | `gti`, `getTime` | The time spent in get operations. |
| `get.total` | `gto`, `getTotal` | The number of get operations. |
| `indexing.delete_current` | `idc`, `indexingDeleteCurrent` | The number of current delete operations. |
| `indexing.delete_time` | `idti`, `indexingDeleteTime` | The time spent in delete operations. |
| `indexing.delete_total` | `idto`, `indexingDeleteTotal` | The number of delete operations. |
| `indexing.index_current` | `iic`, `indexingIndexCurrent` | The number of current indexing operations. |
| `indexing.index_failed` | `iif`, `indexingIndexFailed` | The number of failed indexing operations. |
| `indexing.index_time` | `iiti`, `indexingIndexTime` | The time spent in indexing operations. |
| `indexing.index_total` | `iito`, `indexingIndexTotal` | The number of indexing operations. |
| `memory.total` | `tm`, `memoryTotal` | The total memory used. |
| `merges.current` | `mc`, `mergesCurrent` | The number of current merge operations. |
| `merges.current_docs` | `mcd`, `mergesCurrentDocs` | The number of documents in current merge operations. |
| `merges.current_size` | `mcs`, `mergesCurrentSize` | The size of current merge operations. |
| `merges.total` | `mt`, `mergesTotal` | The number of completed merge operations. |
| `merges.total_docs` | `mtd`, `mergesTotalDocs` | The number of merged documents. |
| `merges.total_size` | `mts`, `mergesTotalSize` | The total size of merged data. |
| `merges.total_time` | `mtt`, `mergesTotalTime` | The time spent in merge operations. |
| `merges.warmer.ongoing_count` | `mswoc`, `mergedSegmentWarmerOngoingCount` | The number of merged segment warming operations currently in progress. |
| `merges.warmer.total_bytes_received` | `mswtbr`, `mergedSegmentWarmerTotalBytesReceived` | The total number of bytes received by replica shards during merged segment warming. |
| `merges.warmer.total_bytes_sent` | `mswtbs`, `mergedSegmentWarmerTotalBytesSent` | The total number of bytes sent by primary shards during merged segment warming. |
| `merges.warmer.total_failure_count` | `mswtfc`, `mergedSegmentWarmerTotalFailureCount` | The total number of merged segment warmer failures. |
| `merges.warmer.total_invocations` | `mswti`, `mergedSegmentWarmerTotalInvocations` | The total number of merged segment warmer invocations. |
| `merges.warmer.total_receive_time` | `mswtrt`, `mergedSegmentWarmerTotalReceiveTime` | The total wall-clock time replica shards spent receiving merged segments. |
| `merges.warmer.total_send_time` | `mswtst`, `mergedSegmentWarmerTotalSendTime` | The total wall-clock time primary shards spent sending merged segments. |
| `merges.warmer.total_time` | `mswtt`, `mergedSegmentWarmerTotalTime` | The total wall-clock time spent in merged segment warming operations. |
| `query_cache.evictions` | `qce`, `queryCacheEvictions` | The number of query cache evictions. |
| `query_cache.memory_size` | `qcm`, `queryCacheMemory` | The memory used by the query cache. |
| `refresh.external_time` | `rti`, `refreshTime` | The time spent in external refresh operations. |
| `refresh.external_total` | `rto`, `refreshTotal` | The total number of external refresh operations. |
| `refresh.listeners` | `rli`, `refreshListeners` | The number of pending refresh listeners. |
| `refresh.time` | N/A | The time spent in refresh operations. The help output lists the `rti` and `refreshTime` aliases for this column, but they select `refresh.external_time`. |
| `refresh.total` | N/A | The total number of refresh operations. The help output lists the `rto` and `refreshTotal` aliases for this column, but they select `refresh.external_total`. |
| `request_cache.evictions` | `rce`, `requestCacheEvictions` | The number of request cache evictions. |
| `request_cache.hit_count` | `rchc`, `requestCacheHitCount` | The number of request cache hits. |
| `request_cache.memory_size` | `rcm`, `requestCacheMemory` | The memory used by the request cache. |
| `request_cache.miss_count` | `rcmc`, `requestCacheMissCount` | The number of request cache misses. |
| `search.concurrent_avg_slice_count` | `casc`, `searchConcurrentAvgSliceCount` | The average slice count for concurrent segment search. |
| `search.concurrent_query_current` | `scqc`, `searchConcurrentQueryCurrent` | The number of current concurrent query phase operations. |
| `search.concurrent_query_time` | `scqti`, `searchConcurrentQueryTime` | The time spent in the concurrent query phase. |
| `search.concurrent_query_total` | `scqto`, `searchConcurrentQueryTotal` | The number of concurrent query phase operations. |
| `search.fetch_current` | `sfc`, `searchFetchCurrent` | The number of current fetch phase operations. |
| `search.fetch_time` | `sfti`, `searchFetchTime` | The time spent in the fetch phase. |
| `search.fetch_total` | `sfto`, `searchFetchTotal` | The number of fetch phase operations. |
| `search.open_contexts` | `so`, `searchOpenContexts` | The number of open search contexts. |
| `search.point_in_time_current` | `scc`, `searchPointInTimeCurrent` | The number of open point-in-time contexts. |
| `search.point_in_time_time` | `scti`, `searchPointInTimeTime` | The time that point-in-time contexts were held open. |
| `search.point_in_time_total` | `scto`, `searchPointInTimeTotal` | The number of completed point-in-time contexts. |
| `search.query_current` | `sqc`, `searchQueryCurrent` | The number of current query phase operations. |
| `search.query_failed` | `sqf`, `searchQueryFailed` | The number of failed query phase operations. |
| `search.query_time` | `sqti`, `searchQueryTime` | The time spent in the query phase. |
| `search.query_total` | `sqto`, `searchQueryTotal` | The number of query phase operations. |
| `search.scroll_current` | `searchScrollCurrent` | The number of open scroll contexts. |
| `search.scroll_time` | `searchScrollTime` | The time that scroll contexts were held open. |
| `search.scroll_total` | `searchScrollTotal` | The number of completed scroll contexts. |
| `search.startree_query_current` | `stqc` | The number of current star-tree query operations. |
| `search.startree_query_failed` | `stqf`, `startreeQueryFailed` | The number of failed star-tree query operations. |
| `search.startree_query_time` | `stqti`, `startreeQueryTime` | The time spent in star-tree queries. |
| `search.startree_query_total` | `stqto`, `startreeQueryCurrent` | The number of queries resolved using a star-tree index. |
| `segments.count` | `sc`, `segmentsCount` | The number of segments. |
| `segments.fixed_bitset_memory` | `sfbm`, `fixedBitsetMemory` | The memory used by fixed bit sets for nested object field types and type filters. |
| `segments.index_writer_memory` | `siwm`, `segmentsIndexWriterMemory` | The memory used by the index writer. |
| `segments.memory` | `sm`, `segmentsMemory` | The memory used by segments. |
| `segments.version_map_memory` | `svmm`, `segmentsVersionMapMemory` | The memory used by the version map. |
| `suggest.current` | `suc`, `suggestCurrent` | The number of current suggest operations. |
| `suggest.time` | `suti`, `suggestTime` | The time spent in suggest operations. |
| `suggest.total` | `suto`, `suggestTotal` | The number of suggest operations. |
| `warmer.current` | `wc`, `warmerCurrent` | The number of current warmer operations. |
| `warmer.total` | `wto`, `warmerTotal` | The number of warmer operations. |
| `warmer.total_time` | `wtt`, `warmerTotalTime` | The time spent in warmer operations. |

## System indexes
**Introduced 3.9**
{: .label .label-purple }

The `system` query parameter filters indexes by their system index classification:

- `system=true` returns only system indexes.
- `system=false` returns only non-system indexes.

Omitting `system` returns both system and non-system indexes, subject to the request's index selection and wildcard expansion.

When `system=true` and `expand_wildcards` is omitted, wildcard expansion includes hidden indexes by default. When `system=false` or `system` is omitted, hidden indexes are not included in wildcard expansion by default. An explicit `expand_wildcards` value overrides these defaults. For example, `system=true&expand_wildcards=open` excludes hidden indexes, while `system=true&expand_wildcards=all` includes open, closed, and hidden indexes.

An index's system classification is independent of whether the index is hidden. The `system` filter does not identify every hidden index or every index protected by the Security plugin. It does not grant access to indexes; your existing permissions still apply. For information about how the Security plugin protects system indexes, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

The response includes the `system` and `system.description` columns whenever you specify `system`, including `system=false`. When `system` is omitted, the default columns are unchanged. Use `h` to select the columns explicitly. Selecting either column with `h` does not change index selection or include hidden indexes in wildcard expansion.

The description is provided independently of the `system` flag. An index without a matching descriptor has no description. If the descriptor registry and the index metadata are temporarily out of sync, an index with `system=false` can still have a description.

For example, to list system indexes and their descriptions, including hidden indexes by default, use the following request:

```json
GET /_cat/indices?system=true&h=index,system,system.description&format=json
```
{% include copy-curl.html %}

The following example response is for a cluster containing a task result index:

```json
[
  {
    "index": ".tasks",
    "system": "true",
    "system.description": "Task Result Index"
  }
]
```

To display both system and non-system indexes, including open, closed, and hidden indexes, use the following request:

```json
GET /_cat/indices?expand_wildcards=all&h=index,system,system.description&format=json
```
{% include copy-curl.html %}

## Limiting the response size

To limit the number of indexes returned, configure the `cat.indices.response.limit.number_of_indices` setting. For more information, see [Cluster-level CAT response limit settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-cat-response-limit-settings).

When `system` is specified, the limit counts only indexes that match the requested system classification.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:monitor/stats` and `cluster:monitor/state`.
