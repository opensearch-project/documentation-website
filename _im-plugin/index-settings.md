---
layout: default
title: Index settings
nav_order: 3
has_children: true
---

# Index settings

You can specify index settings at index creation. There are two types of index settings:

- [Static index settings](#static-index-settings) are settings that you cannot update while the index is open. To update a static setting, you must close the index, update the setting, and then reopen the index. 
- [Dynamic index settings](#dynamic-index-settings) are settings that you can update at any time.

## Specifying a setting when creating an index

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

## Static index settings

The following table lists all available static index settings.

Setting | Description
:--- | :---
index.number_of_shards | The number of primary shards in the index. Default is 1.
index.number_of_routing_shards | The number of routing shards used to split an index.
index.shard.check_on_startup | Whether the index's shards should be checked for corruption. Available options are `false` (do not check for corruption), `checksum` (check for physical corruption), and `true` (check for both physical and logical corruption). Default is `false`.
index.codec | Determines how the index’s stored fields are compressed and stored on disk. This setting impacts the size of the index shards and the performance of the index operations. Valid values are: <br> - `default`<br> - `best_compression`<br> - `zstd` (OpenSearch 2.9 and later)<br> - `zstd_no_dict`(OpenSearch 2.9 and later). <br>For `zstd` and `zstd_no_dict`, you can specify the compression level in the `index.codec.compression_level` setting. For more information, see [Index codec settings]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/). Optional. Default is `default`.
index.codec.compression_level | The compression level setting provides a tradeoff between compression ratio and speed. A higher compression level results in a higher compression ratio (smaller storage size) with a tradeoff in speed (slower compression and decompression speeds lead to greater indexing and search latencies). Can only be specified if `index.codec` is set to `zstd` and `zstd_no_dict` compression levels in OpenSearch 2.9 and later. Valid values are integers in the [1, 6] range. For more information, see [Index codec settings]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/). Optional. Default is 3. 
index.routing_partition_size | The number of shards a custom routing value can go to. Routing helps an imbalanced cluster by relocating values to a subset of shards rather than a single shard. To enable routing, set this value to greater than 1 but less than `index.number_of_shards`. Default is 1.
index.soft_deletes.retention_lease.period | The maximum amount of time to retain a shard's history of operations. Default is `12h`.
index.load_fixed_bitset_filters_eagerly | Whether OpenSearch should preload cached filters. Available options are `true` and `false`. Default is `true`.
index.hidden | Whether the index should be hidden. Hidden indexes are not returned as part of queries that have wildcards. Available options are `true` and `false`. Default is `false`.
index.merge.policy | This setting controls the merge policy for the Lucene segments. Available options are `tiered` and `log_byte_size`. Default is `tiered`. However, for time-series data, such as log events, it is advisable to switch to the `log_byte_size` merge policy. This can improve the query performance when conducting range queries on the `@timestamp` field.  It is advisable not to change the merge policy of an existing index. Instead, configure this setting when creating a new index.

## Updating a static index setting

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

## Dynamic index settings

The following table lists all available dynamic index settings.

Setting | Description
:--- | :---
index.number_of_replicas | The number of replica shards each primary shard should have. For example, if you have 4 primary shards and set `index.number_of_replicas` to 3, the index has 12 replica shards. Default is 1.
index.auto_expand_replicas | Whether the cluster should automatically add replica shards based on the number of data nodes. Specify a lower bound and upper limit (for example, 0--9) or `all` for the upper limit. For example, if you have 5 data nodes and set `index.auto_expand_replicas` to 0--3, then the cluster does not automatically add another replica shard. However, if you set this value to `0-all` and add 2 more nodes for a total of 7, the cluster will expand to now have 6 replica shards. Default is disabled.
index.search.idle.after | The amount of time a shard should wait for a search or get request until it goes idle. Default is `30s`.
index.refresh_interval | How often the index should refresh, which publishes its most recent changes and makes them available for searching. Can be set to `-1` to disable refreshing. Default is `1s`.
index.max_result_window | The maximum value of `from` + `size` for searches of the index. `from` is the starting index to search from, and `size` is the number of results to return. Default is 10000.
index.max_inner_result_window | The maximum value of `from` + `size` that specifies the number of returned nested search hits and most relevant document aggregated during the query. `from` is the starting index to search from, and `size` is the number of top hits to return. Default is 100.
index.max_rescore_window | The maximum value of `window_size` for rescore requests to the index. Rescore requests reorder the index's documents and return a new score, which can be more precise. Default is the same as `index.max_inner_result_window` or 10000 by default.
index.max_docvalue_fields_search | The maximum number of `docvalue_fields` allowed in a query. Default is 100.
index.max_script_fields | The maximum number of `script_fields` allowed in a query. Default is 32.
index.max_ngram_diff | The maximum difference between `min_gram` and `max_gram` values for the NGramTokenizer and NGramTokenFilter. Default is 1.
index.max_shingle_diff | The maximum difference between `max_shingle_size` and `min_shingle_size` to feed into the `shingle` token filter. Default is 3.
index.max_refresh_listeners | The maximum number of refresh listeners each shard is allowed to have.
index.analyze.max_token_count | The maximum number of tokens that can be returned from the `_analyze` API operation. Default is 10000.
index.highlight.max_analyzed_offset | The number of characters a highlight request can analyze. Default is 1000000.
index.max_terms_count | The maximum number of terms a terms query can accept. Default is 65536.
index.max_regex_length | The maximum character length of regex that can be in a regexp query. Default is 1000.
index.query.default_field | A field or list of fields that OpenSearch uses in queries in case a field isn't specified in the parameters.
index.routing.allocation.enable | Specifies options for the index’s shard allocation. Available options are `all` (allow allocation for all shards), `primaries` (allow allocation only for primary shards), `new_primaries` (allow allocation only for new primary shards), and `none` (do not allow allocation). Default is `all`.
index.routing.rebalance.enable | Enables shard rebalancing for the index. Available options are `all` (allow rebalancing for all shards), `primaries` (allow rebalancing only for primary shards), `replicas` (allow rebalancing only for replicas), and `none` (do not allow rebalancing). Default is `all`.
index.gc_deletes | The amount of time to retain a deleted document's version number. Default is `60s`.
index.default_pipeline | The default ingest node pipeline for the index. If the default pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.
index.final_pipeline | The final ingest node pipeline for the index. If the final pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.

## Updating a dynamic index setting

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
