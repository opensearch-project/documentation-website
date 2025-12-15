---
layout: default
title: Index settings
parent: Configuring OpenSearch
nav_order: 60
redirect_from:
  - /im-plugin/index-settings/
---

# Index settings

Index settings can be of two types: [cluster-level settings](#cluster-level-index-settings) that affect all indexes in the cluster and [index-level settings](#index-level-index-settings) that affect individual indexes.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster-level index settings

There are two types of cluster settings:

- [Static cluster-level index settings](#static-cluster-level-index-settings) are settings that you cannot update while the cluster is running. To update a static setting, you must stop the cluster, update the setting, and then restart the cluster. 
- [Dynamic cluster-level index settings](#dynamic-cluster-level-index-settings) are settings that you can update at any time.

### Static cluster-level index settings

OpenSearch supports the following static cluster-level index settings:

- `indices.cache.cleanup_interval` (Time unit): Schedules a recurring background task that cleans up expired entries from the cache at the specified interval. Default is `1m` (1 minute). For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/).

- `indices.requests.cache.size` (String): The cache size as a percentage of the heap size (for example, to use 1% of the heap, specify `1%`). Default is `1%`. For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/).

- `indices.analysis.hunspell.dictionary.ignore_case` (Static, Boolean): Controls whether Hunspell dictionary matching ignores case globally for all locales. When enabled, dictionary matching becomes case insensitive. This setting can also be configured per locale using `indices.analysis.hunspell.dictionary.<locale>.ignore_case`. Default varies by implementation.

- `indices.analysis.hunspell.dictionary.lazy` (Static, Boolean): Controls when Hunspell dictionaries are loaded. If `true`, dictionary loading is deferred until a dictionary is actually used, reducing startup time but potentially increasing latency on first use. If `false`, the dictionary directory is checked and all dictionaries are automatically loaded when the node starts. Default is `false`.

- `indices.memory.index_buffer_size` (Static, string): Controls the amount of heap memory allocated for indexing operations across all shards on a node. Accepts either a percentage (like `10%`) or a byte size value (like `512mb`). This buffer is shared across all shards and is used to batch indexing operations before writing to disk. Default is `10%` of the total heap.

- `indices.memory.min_index_buffer_size` (Static, byte unit): Sets the absolute minimum size for the indexing buffer when `indices.memory.index_buffer_size` is specified as a percentage. This ensures the indexing buffer never becomes too small on nodes with limited heap memory. Default is `48mb`.

- `indices.memory.max_index_buffer_size` (Static, byte unit): Sets the absolute maximum size for the indexing buffer when `indices.memory.index_buffer_size` is specified as a percentage. This prevents the indexing buffer from consuming too much memory on nodes with large heaps. Default is unbounded (no limit).

- `indices.queries.cache.size` (Static, string): Controls the memory size allocated for the query cache (filter cache) on each data node. The query cache stores the results of frequently used filters to improve search performance. Accepts either a percentage value (like `5%`) or an exact byte value (like `512mb`). Default is `10%` of heap memory.

### Dynamic cluster-level index settings

OpenSearch supports the following dynamic cluster-level index settings:

- `action.auto_create_index` (Boolean): Automatically creates an index if the index doesn't already exist. Also applies any index templates that are configured. Default is `true`. 

- `action.destructive_requires_name` (Boolean): When `true`, you must specify the index name to delete an index. You cannot delete all indexes or use wildcards. Default is `false`. 

- `cluster.default.index.refresh_interval` (Time unit): Sets the refresh interval when the `index.refresh_interval` setting is not provided. This setting can be useful when you want to set a default refresh interval across all indexes in a cluster and support the `searchIdle` setting. You cannot set the interval lower than the `cluster.minimum.index.refresh_interval` setting. 

- `cluster.minimum.index.refresh_interval` (Time unit): Sets the minimum refresh interval and applies it to all indexes in the cluster. The `cluster.default.index.refresh_interval` setting should be higher than this setting's value. If, during index creation, the `index.refresh_interval` setting is lower than the minimum set, index creation fails. 

- `cluster.indices.close.enable` (Boolean): Enables closing of open indexes in OpenSearch. Default is `true`. 

- `indices.recovery.max_bytes_per_sec` (String): Limits the total inbound and outbound recovery traffic for each node. This applies to peer recoveries and snapshot recoveries. Default is `40mb`. If you set the recovery traffic value to less than or equal to `0mb`, rate limiting will be disabled, which causes recovery data to be transferred at the highest possible rate. 

- `indices.recovery.max_concurrent_file_chunks` (Integer): The number of file chunks sent in parallel for each recovery operation. Default is `2`. 

- `indices.recovery.max_concurrent_operations` (Integer): The number of operations sent in parallel for each recovery. Default is `1`. 

- `indices.recovery.max_concurrent_remote_store_streams` (Integer): The number of streams to the remote repository that can be opened in parallel when recovering a remote store index. Default is `20`. 

- `indices.replication.max_bytes_per_sec` (String): Limits the total inbound and outbound replication traffic for each node. If a value is not specified in the configured value the `indices.recovery.max_bytes_per_sec` setting is used, which defaults to 40 mb. If you set the replication traffic value to less than or equal to 0 mb, rate limiting is disabled, which causes replication data to be transferred at the highest possible rate.

- `indices.fielddata.cache.size` (String): The maximum size of the field data cache. May be specified as an absolute value (for example, `8GB`) or a percentage of the node heap (for example, `50%`). This setting is dynamic. If you don't specify this setting, the maximum size is `35%`. This value should be smaller than the `indices.breaker.fielddata.limit`. For more information, see [Field data circuit breaker]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/circuit-breaker/#field-data-circuit-breaker-settings).

- `indices.query.bool.max_clause_count` (Integer): Defines the maximum product of fields and terms that are queryable simultaneously. Before OpenSearch 2.16, a cluster restart was required in order to apply this static setting. Now dynamic, existing search thread pools may use the old static value initially, causing `TooManyClauses` exceptions. New thread pools use the updated value. Default is `1024`.

- `cluster.remote_store.index.path.type` (String): The path strategy for the data stored in the remote store. This setting is effective only for remote-store-enabled clusters. This setting supports the following values:
  - `fixed`: Stores the data in path structure `<repository_base_path>/<index_uuid>/<shard_id>/`.
  - `hashed_prefix`: Stores the data in path structure `hash(<shard-data-idenitifer>)/<repository_base_path>/<index_uuid>/<shard_id>/`.
  - `hashed_infix`: Stores the data in path structure `<repository_base_path>/hash(<shard-data-idenitifer>)/<index_uuid>/<shard_id>/`.
  `shard-data-idenitifer` is characterized by the index_uuid, shard_id, kind of data (translog, segments), and type of data (data, metadata, lock_files).
  Default is `fixed`.

- `cluster.remote_store.index.path.hash_algorithm` (String): The hash function used to derive the hash value when `cluster.remote_store.index.path.type` is set to `hashed_prefix` or `hashed_infix`. This setting is effective only for remote-store-enabled clusters. This setting supports the following values:
  - `fnv_1a_base64`: Uses the FNV1a hash function and generates a url-safe 20-bit base64-encoded hash value.
  - `fnv_1a_composite_1`: Uses the FNV1a hash function and generates a custom encoded hash value that scales well with most remote store options. The FNV1a function generates 64-bit value. The custom encoding uses the most significant 6 bits to create a url-safe base64 character and the next 14 bits to create a binary string. Default is `fnv_1a_composite_1`.

- `cluster.remote_store.translog.transfer_timeout` (Time unit): Controls the timeout value while uploading translog and checkpoint files during a sync to the remote store. This setting is applicable only for remote-store-enabled clusters. Default is `30s`.

- `cluster.remote_store.index.segment_metadata.retention.max_count` (Integer): Controls the minimum number of metadata files to keep in the segment repository on a remote store. A value below `1` disables the deletion of stale segment metadata files. Default is `10`.

- `cluster.remote_store.segment.transfer_timeout` (Time unit): Controls the maximum amount of time to wait for all new segments to update after refresh to the remote store. If the upload does not complete within a specified amount of time, it throws a `SegmentUploadFailedException` error. Default is `30m`. It has a minimum constraint of `10m`.

- `cluster.remote_store.translog.path.prefix` (String): Controls the fixed path prefix for translog data on a remote-store-enabled cluster. This setting only applies when the `cluster.remote_store.index.path.type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

- `cluster.remote_store.segments.path.prefix` (String): Controls the fixed path prefix for segment data on a remote-store-enabled cluster. This setting only applies when the `cluster.remote_store.index.path.type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

- `cluster.snapshot.shard.path.prefix` (String): Controls the fixed path prefix for snapshot shard-level blobs. This setting only applies when the repository `shard_path_type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

- `cluster.default_number_of_replicas` (Integer): Controls the default number of replicas for indexes in the cluster. The index-level `index.number_of_replicas` setting defaults to this value if not configured. Default is `1`.

- `cluster.thread_pool.<fixed-threadpool>.size` (Integer): Controls the sizes of both the fixed and resizable queue thread pools. Overrides the defaults provided in `opensearch.yml`.

- `cluster.thread_pool.<scaling-threadpool>.max` (Integer): Sets the maximum size of the scaling thread pool. Overrides the default provided in `opensearch.yml`.

- `cluster.thread_pool.<scaling-threadpool>.core` (Integer): Specifies the core size of the scaling thread pool. Overrides the default provided in `opensearch.yml`.


Before tuning thread pool settings dynamically, note that these are expert-level settings that can potentially destabilize your cluster. Modifying thread pool settings applies the same thread pool size to all nodes, so it's not recommended for clusters with different hardware for the same roles. Similarly, avoid tuning thread pools shared by both data nodes and cluster manager nodes. After making these changes, we recommend monitoring your cluster to ensure that it remains stable and performs as expected.
{: .warning}

### Updating dynamic cluster settings

To learn how to update dynamic settings, see [Updating cluster settings using the API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api).

## Index-level index settings

You can specify index settings at index creation. There are two types of index settings:

- [Static index-level index settings](#static-index-level-index-settings) are settings that you cannot update while the index is open. To update a static setting, you must close the index, update the setting, and then reopen the index. 
- [Dynamic index-level index settings](#dynamic-index-level-index-settings) are settings that you can update at any time.

### Specifying a setting when creating an index

When creating an index, you can specify its static or dynamic settings as follows:

```json
PUT /testindex
{
  "settings": {
    "index.number_of_shards": 1,
    "index.number_of_replicas": 2
  }
}
```
{% include copy-curl.html %}

### Static index-level index settings

OpenSearch supports the following static index-level index settings:

- `index.number_of_shards` (Integer): The number of primary shards in the index. Default is 1.

- `index.number_of_routing_shards` (Integer): The number of routing shards used to split an index.

- `index.shard.check_on_startup` (Boolean): Whether the index's shards should be checked for corruption. Available options are `false` (do not check for corruption), `checksum` (check for physical corruption), and `true` (check for both physical and logical corruption). Default is `false`.

- `index.codec` (String): Determines how the index’s stored fields are compressed and stored on disk. This setting impacts the size of the index shards and the performance of the index operations. 
    
    Valid values are: 
        
    - `default`
    - `best_compression`
    - `zstd` (OpenSearch 2.9 and later)
    - `zstd_no_dict`(OpenSearch 2.9 and later)
    - `qat_lz4` (OpenSearch 2.14 and later, on supported systems)
    - `qat_deflate` (OpenSearch 2.14 and later, on supported systems)
        
For `zstd`, `zstd_no_dict`, `qat_lz4`, and `qat_deflate`, you can specify the compression level in the `index.codec.compression_level` setting. For more information, see [Index codec settings]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/). Optional. Default is `default`.

- `index.codec.compression_level` (Integer): The compression level setting provides a trade-off between compression ratio and speed. A higher compression level results in a higher compression ratio (smaller storage size), but slower compression and decompression speeds lead to higher indexing and search latencies. This setting can only be specified if `index.codec` is set to `zstd` and `zstd_no_dict` in OpenSearch 2.9 and later or `qat_lz4` and `qat_deflate` in OpenSearch 2.14 and later. Valid values are integers in the [1, 6] range. For more information, see [Index codec settings]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/). Optional. Default is 3.

- `index.codec.qatmode` (String): The hardware acceleration mode used for the `qat_lz4` and `qat_deflate` compression codecs. Valid values are `auto` and `hardware`. For more information, see [Index codec settings]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/). Optional. Default is `auto`. 

- `index.routing_partition_size` (Integer): The number of shards a custom routing value can go to. Routing helps an imbalanced cluster by relocating values to a subset of shards rather than a single shard. To enable routing, set this value to greater than 1 but less than `index.number_of_shards`. Default is 1.

- `index.soft_deletes.retention_lease.period` (Time unit): The maximum amount of time to retain a shard's history of operations. Default is `12h`.

<p id="index-sort-settings"></p>

- `index.sort.field` (String): Specifies the field used to sort documents at index time. The default sort order is `asc` (ascending). To change the order, set the `index.sort.order` parameter.

- `index.sort.order` (String): Specifies the document sort order at index time. Valid values are `asc` (ascending) and `desc` (descending). Default is `asc`. This setting requires `index.sort.field` to also be set.

- `index.sort.mode` (String): Controls how multi-valued fields are handled during sorting. Valid values are `min` (uses the lowest value) and `max` (uses the highest value).

- `index.sort.missing` (String): Determines how documents missing the sort field are handled. Valid values are `_last` (places documents without the field at the end) and `_first` (places documents without the field at the beginning).

- `index.load_fixed_bitset_filters_eagerly` (Boolean): Whether OpenSearch should preload cached filters. Available options are `true` and `false`. Default is `true`.

- `index.hidden` (Boolean): Whether the index should be hidden. Hidden indexes are not returned as part of queries that have wildcards. Available options are `true` and `false`. Default is `false`.

- `index.merge.policy` (String): This setting controls the merge policy for the Lucene segments. The available options are `tiered` and `log_byte_size`. The default is `tiered`, but for time-series data, such as log events, we recommend that you use the `log_byte_size` merge policy, which can improve query performance when conducting range queries on the `@timestamp` field. We recommend that you not change the merge policy of an existing index. Instead, configure this setting when creating a new index.

- `index.merge.policy.max_merged_segment` (Byte size): The maximum size of a merged segment. OpenSearch performs background segment merges that produce segments no larger than this value. Default is `5gb`. For more information, see [Force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).

- `index.merge.policy.segments_per_tier` (Integer): The number of segments per tier used by the tiered merge policy. Smaller values use more segments per tier, which means more merging but fewer segments overall. Larger values use fewer segments per tier, which means less merging but more segments overall. Default is `10`. This setting only applies when `index.merge.policy` is set to `tiered`.

- `index.merge.policy.max_merge_at_once` (Integer): The maximum number of segments to merge at one time during normal merging. Default is `10`. This setting only applies when `index.merge.policy` is set to `tiered`.

- `index.merge.policy.max_merge_at_once_explicit` (Integer): The maximum number of segments to merge at one time during explicit force merges (for example, when using the [Force merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/)). Default is `30`. This setting only applies when `index.merge.policy` is set to `tiered`.

- `index.merge.policy.expunge_deletes_allowed` (Float): The percentage of deleted documents in a segment that triggers automatic expunging of deleted documents. When a segment contains more than this percentage of deleted documents, OpenSearch automatically merges the segment to remove the deleted documents. Default is `10.0` (10%). For more information, see [Force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).

- `index.merge.scheduler.max_thread_count` (Integer): The maximum number of threads that may be merging at once. The default is `Math.max(1, Math.min(4, Runtime.getRuntime().availableProcessors() / 2))`, which means half of the available processors, with a minimum of 1 and a maximum of 4. This setting controls the number of merge threads per shard. Increasing this value can speed up merging but may also increase resource consumption.

- `index.merge.scheduler.max_merge_count` (Integer): The maximum number of merges that can be running at once. Default is `Math.max(1, Math.min(4, Runtime.getRuntime().availableProcessors() / 2))`, which means half of the available processors, with a minimum of 1 and a maximum of 4. This setting controls the number of concurrent merges per shard.

- `index.merge_on_flush.enabled` (Boolean): This setting controls Apache Lucene's merge-on-refresh feature that aims to reduce the number of segments by performing merges _on refresh_ (or in terms of OpenSearch, _on flush_). Default is `true`.

- `index.merge_on_flush.max_full_flush_merge_wait_time` (Time unit): This setting sets the amount of time to wait for merges when `index.merge_on_flush.enabled` is enabled. Default is `10s`.

- `index.merge_on_flush.policy` (default | merge-on-flush): This setting controls which merge policy should be used when `index.merge_on_flush.enabled` is enabled. Default is `default`.

- `index.check_pending_flush.enabled` (Boolean): This setting controls the Apache Lucene `checkPendingFlushOnUpdate` index writer setting, which specifies whether an indexing thread should check for pending flushes on an update in order to flush indexing buffers to disk. Default is `true`.

- `index.use_compound_file` (Boolean): This setting controls the Apache Lucene `useCompoundFile` index writer settings, which specifies whether newly written segment files will be packed into a compound file. Default is `true`.

- `index.append_only.enabled` (Boolean): Set to `true` to prevent any updates to documents in the index. Default is `false`.

- `index.derived_source.enabled` (Boolean): Set to `true` to dynamically generate the source without explicitly storing the `_source` field, which can optimize storage. Default is `false`. For more information, see [Derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source). 

### Updating a static index setting

You can update a static index setting only on a closed index. The following example demonstrates updating the index codec setting.

First, close an index: 

```json
POST /testindex/_close
```
{% include copy-curl.html %}

Then update the settings by sending a request to the `_settings` endpoint:

```json
PUT /testindex/_settings
{
  "index": {
    "codec": "zstd_no_dict",
    "codec.compression_level": 3
  }
}
```
{% include copy-curl.html %}

Last, reopen the index to enable read and write operations:

```json
POST /testindex/_open
```
{% include copy-curl.html %}

For more information about updating settings, including supported query parameters, see [Update settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/).

### Dynamic index-level index settings

OpenSearch supports the following dynamic index-level index settings:

- `index.number_of_replicas` (Integer): The number of replica shards each primary shard should have. For example, if you have 4 primary shards and set `index.number_of_replicas` to 3, the index has 12 replica shards. If not set, defaults to `cluster.default_number_of_replicas` (which is `1` by default).

- `index.number_of_search_replicas` (Integer): The number of search replica shards that each primary shard should have. For example, if you have 4 primary shards and set `index.number_of_search_replicas` to 3, the index has 12 search replica shards. Default is `0`.

- `index.auto_expand_replicas` (String): Whether the cluster should automatically add replica shards based on the number of data nodes. Specify a lower bound and upper limit (for example, 0--9) or `all` for the upper limit. For example, if you have 5 data nodes and set `index.auto_expand_replicas` to 0--3, then the cluster does not automatically add another replica shard. However, if you set this value to `0-all` and add 2 more nodes for a total of 7, the cluster will expand to now have 6 replica shards. Default is disabled.

- `index.auto_expand_search_replicas` (String): Controls whether the cluster automatically adjusts the number of search replica shards based on the number of available search nodes. Specify the value as a range with a lower and upper bound, for example, `0-3` or `0-all`. If you don't specify a value, this feature is disabled. 

   For example, if you have 5 data nodes and set `index.auto_expand_search_replicas` to `0-3`, the index can have up to 3 search replicas and the cluster does not automatically add another search replica shard. However, if you set `index.auto_expand_search_replicas` to `0-all` and add 2 more nodes, for a total of 7, the cluster will expand to now have 7 search replica shards. This setting is disabled by default.

- `index.blocks.write` (Boolean): Specifies whether the index is read-only. Setting to `true` blocks all write requests and makes the index read-only. Default is `false`.

- `index.search.idle.after` (Time unit): The amount of time a shard should wait for a search or get request until it goes idle. Default is `30s`.

- `index.search.default_pipeline` (String): The name of the search pipeline that is used if no pipeline is explicitly set when searching an index. If a default pipeline is set and the pipeline doesn't exist, then the index requests fail. Use the pipeline name `_none` to specify no default search pipeline. For more information, see [Default search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#default-search-pipeline).

- `index.refresh_interval` (Time unit): How often the index should refresh, which publishes its most recent changes and makes them available for searching. Can be set to `-1` to disable refreshing. Default is `1s`.

- `index.max_result_window` (Integer): The maximum value of `from` + `size` for searches of the index. `from` is the starting index to search from, and `size` is the number of results to return. Default is 10000.

- `index.max_inner_result_window` (Integer): The maximum value of `from` + `size` that specifies the number of returned nested search hits and most relevant document aggregated during the query. `from` is the starting index to search from, and `size` is the number of top hits to return. Default is 100.

- `index.max_rescore_window` (Integer): The maximum value of `window_size` for rescore requests to the index. Rescore requests reorder the index's documents and return a new score, which can be more precise. Default is the same as `index.max_inner_result_window` or 10000 by default.

- `index.max_docvalue_fields_search` (Integer): The maximum number of `docvalue_fields` allowed in a query. Default is 100.

- `index.max_script_fields` (Integer): The maximum number of `script_fields` allowed in a query. Default is 32.

- `index.max_ngram_diff` (Integer): The maximum difference between `min_gram` and `max_gram` values for the `NGramTokenizer` and `NGramTokenFilter`. Default is 1.

- `index.max_shingle_diff` (Integer): The maximum difference between `max_shingle_size` and `min_shingle_size` to feed into the `shingle` token filter. Default is 3.

- `index.max_refresh_listeners` (Integer): The maximum number of refresh listeners each shard is allowed to have.

- `index.analyze.max_token_count` (Integer): The maximum number of tokens that can be returned from the `_analyze` API operation. Default is 10000.

- `index.highlight.max_analyzed_offset` (Integer): The number of characters a highlight request can analyze. Default is 1000000.

- `index.max_terms_count` (Integer): The maximum number of terms a terms query can accept. Default is 65536.

- `index.max_regex_length` (Integer): The maximum character length of regex that can be in a regexp query. Default is 1000.

- `index.query.default_field` (List): A field or list of fields that OpenSearch uses in queries in case a field isn't specified in the parameters.

- `index.query.max_nested_depth` (Integer): The maximum number of nesting levels for `nested` queries. Default is `20`. Minimum is `1` (single `nested` query).

- `index.requests.cache.enable` (Boolean): Enables or disables the index request cache. Default is `true`. For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/).

- `index.routing.allocation.enable` (String): Specifies options for the index’s shard allocation. Available options are `all` (allow allocation for all shards), `primaries` (allow allocation only for primary shards), `new_primaries` (allow allocation only for new primary shards), and `none` (do not allow allocation). Default is `all`.

- `index.routing.rebalance.enable` (String): Enables shard rebalancing for the index. Available options are `all` (allow rebalancing for all shards), `primaries` (allow rebalancing only for primary shards), `replicas` (allow rebalancing only for replicas), and `none` (do not allow rebalancing). Default is `all`.

- `index.gc_deletes` (Time unit): The amount of time to retain a deleted document's version number. Default is `60s`.

- `index.default_pipeline` (String): The default ingest node pipeline for the index. If the default pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.

- `index.final_pipeline` (String): The final ingest node pipeline for the index. If the final pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.

- `index.optimize_doc_id_lookup.fuzzy_set.enabled` (Boolean): This setting controls whether `fuzzy_set` should be enabled in order to optimize document ID lookups in index or search calls by using an additional data structure, in this case, the Bloom filter data structure. Enabling this setting improves performance for upsert and search operations that rely on document IDs by creating a new data structure (Bloom filter). The Bloom filter allows for the handling of negative cases (that is, IDs being absent in the existing index) through faster off-heap lookups. Note that creating a Bloom filter requires additional heap usage during indexing time. Default is `false`.

- `index.optimize_doc_id_lookup.fuzzy_set.false_positive_probability` (Double): Sets the false-positive probability for the underlying `fuzzy_set` (that is, the Bloom filter). A lower false-positive probability ensures higher throughput for upsert and get operations but results in increased storage and memory use. Allowed values range between `0.01` and `0.50`. Default is `0.20`.

- `index.routing.allocation.total_shards_per_node` (Integer): The maximum combined total number of primary and replica shards from a single index that can be allocated to a single node. Default is `-1` (unlimited). Helps control per-index shard distribution across nodes by limiting the number of shards per node. Use with caution because shards from this index may remain unallocated if nodes reach their configured limits.

- `index.routing.allocation.total_primary_shards_per_node` (Integer): The maximum number of primary shards from a single index that can be allocated to a single node. This setting is applicable only for remote-backed clusters. Default is `-1` (unlimited). Helps control per-index primary shard distribution across nodes by limiting the number of primary shards per node. Use with caution because primary shards from this index may remain unallocated if nodes reach their configured limits.

- `index.derived_source.translog.enabled` (Boolean): Controls how documents are read from the translog for an index with derived source enabled. Defaults to the `index.derived_source.enabled` value. For more information, see [Derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source).

- `index.periodic_flush_interval` (Time unit): Triggers a flush periodically at the configured interval, storing all in-memory operations to segments on disk. OpenSearch automatically performs flush operations in the background based on conditions such as transaction log size. Default is `-1`, which disables periodic flush. You can configure this setting if your workload requires predictable, time-based flush intervals.

### Updating a dynamic index setting

You can update a dynamic index setting at any time through the API. For example, to update the refresh interval, use the following request:

```json
PUT /testindex/_settings
{
  "index": {
    "refresh_interval": "2s"
  }
}
```
{% include copy-curl.html %}

For more information about updating settings, including supported query parameters, see [Update settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/).
