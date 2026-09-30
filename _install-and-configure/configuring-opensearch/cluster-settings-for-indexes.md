---
layout: default
title: Cluster settings for indexes
parent: Configuring OpenSearch
nav_order: 60
---

# Cluster settings for indexes

The following cluster settings apply to all indexes in the cluster. For settings that apply to individual indexes, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

To learn how to apply these settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Static settings

OpenSearch supports the following static cluster settings for indexes:

- `indices.cache.cleanup_interval` (Static, time unit): Schedules a recurring background task that cleans up expired entries from the cache at the specified interval. Default is `1m` (1 minute). For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/).

- `indices.requests.cache.size` (Static, string): The cache size as a percentage of the heap size (for example, to use 1% of the heap, specify `1%`). Default is `1%`. For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/).

- `indices.analysis.hunspell.dictionary.ignore_case` (Static, Boolean): Controls whether Hunspell dictionary matching ignores case globally for all locales. When enabled, dictionary matching becomes case insensitive. This setting can be configured at multiple levels: node level (this setting), per-locale using `indices.analysis.hunspell.dictionary.<locale>.ignore_case` (for example, `indices.analysis.hunspell.dictionary.en_US.ignore_case`), or in dictionary-specific `settings.yml` files within each dictionary directory. Per-locale and dictionary-specific settings override the global setting. Default is `false`.

- `indices.analysis.hunspell.dictionary.lazy` (Static, Boolean): Controls when Hunspell dictionaries are loaded. If `true`, dictionary loading is deferred until a dictionary is actually used, reducing startup time but potentially increasing latency on first use. If `false`, the dictionary directory is checked and all dictionaries are automatically loaded when the node starts. Default is `false`.

- `indices.analysis.hunspell.dictionary.<locale>.strict_affix_parsing` (Static, Boolean): Controls whether errors encountered while reading Hunspell affix rules files cause exceptions or are silently ignored. When set to `true`, parsing errors in affix files will throw exceptions and prevent dictionary loading. When set to `false`, parsing errors are ignored and the dictionary continues to load. This setting can be configured per locale by replacing `<locale>` with the specific locale code (for example, `indices.analysis.hunspell.dictionary.en_US.strict_affix_parsing`). Default is `true`.

- `indices.memory.index_buffer_size` (Static, string): Controls the amount of heap memory allocated for indexing operations across all shards on a node. Accepts either a percentage (like `10%`) or a byte size value (like `512mb`). This buffer is shared across all shards and is used to batch indexing operations before writing to disk. Default is `10%` of the total heap.

- `indices.memory.min_index_buffer_size` (Static, byte unit): Sets the absolute minimum size for the indexing buffer when `indices.memory.index_buffer_size` is specified as a percentage. This ensures the indexing buffer never becomes too small on nodes with limited heap memory. Default is `48mb`.

- `indices.memory.max_index_buffer_size` (Static, byte unit): Sets the absolute maximum size for the indexing buffer when `indices.memory.index_buffer_size` is specified as a percentage. This prevents the indexing buffer from consuming too much memory on nodes with large heaps. Default is unbounded (no limit).

- `indices.queries.cache.size` (Static, string): Controls the memory size allocated for the query cache (filter cache) on each data node. The query cache stores the results of frequently used filters to improve search performance. Accepts either a percentage value (like `5%`) or an exact byte value (like `512mb`). Default is `10%` of heap memory.

- `indices.queries.cache.all_segments` (Static, Boolean): Whether to cache queries across all segments or only frequently accessed ones.

- `indices.queries.cache.count` (Static, integer): The maximum number of queries to cache.

- `index.store.hybrid.nio.extensions` (Static, list): **Expert setting.** Lucene file extensions to load with NIO instead of memory mapping. Default includes common extensions like `segments_N`, `write.lock`, `si`, and `cfe`.

- `indexing_pressure.memory.limit` (Static, byte size): Controls the memory limit for indexing operations to prevent memory exhaustion during heavy indexing workloads. When indexing operations exceed this threshold, they may be rejected or throttled to protect cluster stability. Accepts percentage values (like `10%` of heap) or byte size values (like `512mb`). Default is `10%` of the total heap memory.

- `indices.query.query_string.allowLeadingWildcard` (Static, Boolean): Controls whether leading wildcards are allowed in query string queries. When enabled, queries like `*term` or `?term` are permitted but may impact performance as they require scanning all terms in the index. When disabled, leading wildcard queries are rejected to improve query performance. Default is `true`.

- `indices.query.query_string.analyze_wildcard` (Static, Boolean): Controls whether wildcard terms in query string queries are analyzed using the configured analyzer. When enabled, wildcard queries undergo analysis (tokenization, filtering) which can improve matching but may affect performance. When disabled, wildcard terms are used as-is without analysis. Default is `false`.

- `indices.time_series_index.default_index_merge_policy` (Static, string): Sets the default merge policy for time series indices across the cluster. This setting controls how Lucene segments are merged for time-series data, which can significantly impact indexing performance and storage efficiency. Valid values include `default`, `tiered`, and `log_byte_size`. Default is `default`.

- `cluster.remote_store.translog.path.prefix` (Static, string): Controls the fixed path prefix for translog data on a remote-store-enabled cluster. This setting only applies when the `cluster.remote_store.index.path.type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

- `cluster.remote_store.segments.path.prefix` (Static, string): Controls the fixed path prefix for segment data on a remote-store-enabled cluster. This setting only applies when the `cluster.remote_store.index.path.type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

- `cluster.snapshot.shard.path.prefix` (Static, string): Controls the fixed path prefix for snapshot shard-level blobs. This setting only applies when the repository `shard_path_type` setting is either `HASHED_PREFIX` or `HASHED_INFIX`. Default is an empty string, `""`.

## Dynamic settings

OpenSearch supports the following dynamic cluster settings for indexes:

- `action.auto_create_index` (Dynamic, Boolean): Automatically creates an index if the index doesn't already exist. Also applies any index templates that are configured. Default is `true`.

- `action.destructive_requires_name` (Dynamic, Boolean): When `true`, you must specify the index name to delete an index. You cannot delete all indexes or use wildcards. Default is `false`.

- `cluster.default.index.refresh_interval` (Dynamic, time unit): Sets the refresh interval when the `index.refresh_interval` setting is not provided. This setting can be useful when you want to set a default refresh interval across all indexes in a cluster and support the `searchIdle` setting. You cannot set the interval lower than the `cluster.minimum.index.refresh_interval` setting.

- `cluster.minimum.index.refresh_interval` (Dynamic, time unit): Sets the minimum refresh interval and applies it to all indexes in the cluster. The `cluster.default.index.refresh_interval` setting should be higher than this setting's value. If, during index creation, the `index.refresh_interval` setting is lower than the minimum set, index creation fails.

- `cluster.indices.close.enable` (Dynamic, Boolean): Enables closing of open indexes in OpenSearch. Default is `true`.

- `indices.recovery.max_bytes_per_sec` (Dynamic, string): Limits the total inbound and outbound recovery traffic for each node. This applies to peer recoveries and snapshot recoveries. Default is `40mb`. If you set the recovery traffic value to less than or equal to `0mb`, rate limiting will be disabled, which causes recovery data to be transferred at the highest possible rate.

- `indices.recovery.max_concurrent_file_chunks` (Dynamic, integer): The number of file chunks sent in parallel for each recovery operation. Default is `2`.

- `indices.recovery.max_concurrent_operations` (Dynamic, integer): The number of operations sent in parallel for each recovery. Default is `1`.

- `indices.recovery.max_concurrent_remote_store_streams` (Dynamic, integer): The number of streams to the remote repository that can be opened in parallel when recovering a remote store index. Default is `20`.

- `indices.replication.max_bytes_per_sec` (Dynamic, string): Limits the total inbound and outbound replication traffic for each node. If a value is not specified in the configured value the `indices.recovery.max_bytes_per_sec` setting is used, which defaults to 40 Mb. If you set the replication traffic value to less than or equal to 0 Mb, rate limiting is disabled, which causes replication data to be transferred at the highest possible rate.

- `indices.fielddata.cache.size` (Dynamic, string): The maximum size of the field data cache. May be specified as an absolute value (for example, `8GB`) or a percentage of the node heap (for example, `50%`). This setting is dynamic. If you don't specify this setting, the maximum size is `35%`. This value should be smaller than the `indices.breaker.fielddata.limit`. For more information, see [Field data circuit breaker]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/circuit-breaker/#field-data-circuit-breaker-settings).

- `indices.query.bool.max_clause_count` (Dynamic, integer): Defines the maximum product of fields and terms that can be searched simultaneously. Before OpenSearch 2.16, a cluster restart was required in order to apply this static setting. Now dynamic, existing search thread pools may use the old static value initially, causing `TooManyClauses` exceptions. New thread pools use the updated value. Default is `1024`.

- `cluster.remote_store.index.path.type` (Dynamic, string): The path strategy for the data stored in the remote store. This setting is effective only for remote-store-enabled clusters. This setting supports the following values:
  - `fixed`: Stores the data in path structure `<repository_base_path>/<index_uuid>/<shard_id>/`.
  - `hashed_prefix`: Stores the data in path structure `hash(<shard-data-idenitifer>)/<repository_base_path>/<index_uuid>/<shard_id>/`.
  - `hashed_infix`: Stores the data in path structure `<repository_base_path>/hash(<shard-data-idenitifer>)/<index_uuid>/<shard_id>/`.
  `shard-data-idenitifer` is characterized by the index_uuid, shard_id, kind of data (translog, segments), and type of data (data, metadata, lock_files).
  Default is `fixed`.

- `cluster.remote_store.index.path.hash_algorithm` (Dynamic, string): The hash function used to derive the hash value when `cluster.remote_store.index.path.type` is set to `hashed_prefix` or `hashed_infix`. This setting is effective only for remote-store-enabled clusters. This setting supports the following values:
  - `fnv_1a_base64`: Uses the FNV1a hash function and generates a url-safe 20-bit Base64-encoded hash value.
  - `fnv_1a_composite_1`: Uses the FNV1a hash function and generates a custom encoded hash value that scales well with most remote store options. The FNV1a function generates 64-bit value. The custom encoding uses the most significant 6 bits to create a URL-safe Base64 character and the next 14 bits to create a binary string. Default is `fnv_1a_composite_1`.

- `cluster.remote_store.translog.transfer_timeout` (Dynamic, time unit): Controls the timeout value while uploading translog and checkpoint files during a sync to the remote store. This setting is applicable only for remote-store-enabled clusters. Default is `30s`.

- `cluster.remote_store.index.segment_metadata.retention.max_count` (Dynamic, integer): Controls the minimum number of metadata files to keep in the segment repository on a remote store. A value below `1` disables the deletion of stale segment metadata files. Default is `10`.

- `cluster.remote_store.segment.transfer_timeout` (Dynamic, time unit): Controls the maximum amount of time to wait for all new segments to update after refresh to the remote store. If the upload does not complete within a specified amount of time, it throws a `SegmentUploadFailedException` error. Default is `30m`. It has a minimum constraint of `10m`.

- `cluster.default_number_of_replicas` (Dynamic, integer): Controls the default number of replicas for indexes in the cluster. The index-level `index.number_of_replicas` setting defaults to this value if not configured. Default is `1`.
