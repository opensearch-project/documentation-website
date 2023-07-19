---
layout: default
title: Create index
parent: Index APIs
nav_order: 25
redirect_from:
  - /opensearch/rest-api/index-apis/create-index/
  - /opensearch/rest-api/create-index/
---

# Create index
Introduced 1.0
{: .label .label-purple }

While you can create an index by using a document as a base, you can also create an empty index for later use.

## Example

The following example demonstrates how to create an index with a non-default number of primary and replica shards, specifies that `age` is of type `integer`, and assigns a `sample-alias1` alias to the index.

```json
PUT /sample-index1
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      }
    }
  },
  "aliases": {
    "sample-alias1": {}
  }
}
```

## Path and HTTP methods

```
PUT <index-name>
```

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

You can include the following URL parameters in your request. All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the request to return. Default is `30s`.

## Request body

As part of your request, you can supply parameters in your request's body that specify index settings, mappings, and [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/) for your newly created index. The following sections provide more information about index settings and mappings.

### Index settings
Index settings are separated into two types: static index settings and dynamic index settings. Static index settings are settings that you specify at index creation and can't change later. You can change dynamic settings at any time, including at index creation.

#### Static index settings

Setting | Description
:--- | :---
index.number_of_shards | The number of primary shards in the index. Default is 1.
index.number_of_routing_shards | The number of routing shards used to split an index.
index.shard.check_on_startup | Whether the index's shards should be checked for corruption. Available options are `false` (do not check for corruption), `checksum` (check for physical corruption), and `true` (check for both physical and logical corruption). Default is `false`.
index.routing_partition_size | The number of shards a custom routing value can go to. Routing helps an imbalanced cluster by relocating values to a subset of shards rather than just a single shard. To enable, set this value to greater than 1 but less than `index.number_of_shards`. Default is 1.
index.soft_deletes.retention_lease.period | The maximum amount of time to retain a shard's history of operations. Default is `12h`.
index.load_fixed_bitset_filters_eagerly | Whether OpenSearch should pre-load cached filters. Available options are `true` and `false`. Default is `true`.
index.hidden | Whether the index should be hidden. Hidden indexes are not returned as part of queries that have wildcards. Available options are `true` and `false`. Default is `false`.

#### Dynamic index Settings

Setting | Description
:--- | :---
index.number_of_replicas | The number of replica shards each primary shard should have. For example, if you have 4 primary shards and set `index.number_of_replicas` to 3, the index has 12 replica shards. Default is 1.
index.auto_expand_replicas | Whether the cluster should automatically add replica shards based on the number of data nodes. Specify a lower bound and upper limit (for example, 0-9), or `all` for the upper limit. For example, if you have 5 data nodes and set `index.auto_expand_replicas` to 0-3, then the cluster does not automatically add another replica shard. However, if you set this value to `0-all` and add 2 more nodes for a total of 7, the cluster will expand to now have 6 replica shards. Default is disabled.
index.codec | Determines how the index’s stored fields are compressed and stored on the disk. This setting impacts the size of the index shards and the performance of the index operations. Available values are `default', 'best_compression`, `zstd`, and `zstd_no_dict`. Two new codecs are introduced in OpenSearch 2.9: `zstd` and `zstd_no_dict`. They provide an option to configure the compression level as an index setting, `index.codec.compression_level`, that is not available for other codecs. For information about each setting, see [Index codec settings](#Index-codec-settings). This setting is optional and cannot be updated dynamically.
index.codec.compression_level | The compression level setting provides a trade-off between compression ratio and speed. A higher compression level results in a higher compression ratio (less storage size) with a trade-off on speed, that is, slower compression and decompression speeds (slower indexing and search latencies). Currently, `zstd` and `zstd_no_dict` support compression levels from 1 to 6. Similar to `index.codec`, `index.codec.compression_level` is an optional index setting. The default compression level is 3 if not provided. This setting cannot be updated dynamically.
index.search.idle.after | Amount of time a shard should wait for a search or get request until it goes idle. Default is `30s`.
index.refresh_interval | How often the index should refresh, which publishes its most recent changes and makes them available for searching. Can be set to `-1` to disable refreshing. Default is `1s`.
index.max_result_window | The maximum value of `from` + `size` for searches to the index. `from` is the starting index to search from, and `size` is the amount of results to return. Default: 10000.
index.max_inner_result_window | Maximum value of `from` + `size` to return nested search hits and most relevant document aggregated during the query. `from` is the starting index to search from, and `size` is the amount of top hits to return. Default is 100.
index.max_rescore_window | The maximum value of `window_size` for rescore requests to the index. Rescore requests reorder the index's documents and return a new score, which can be more precise. Default is the same as index.max_inner_result_window or 10000 by default.
index.max_docvalue_fields_search | Maximum amount of `docvalue_fields` allowed in a query. Default is 100.
index.max_script_fields | Maximum amount of `script_fields` allowed in a query. Default is 32.
index.max_ngram_diff | Maximum difference between `min_gram` and `max_gram` values for `NGramTokenizer` and `NGramTokenFilter` fields. Default is 1.
index.max_shingle_diff | Maximum difference between `max_shingle_size` and `min_shingle_size` to feed into the `shingle` token filter. Default is 3.
index.max_refresh_listeners | Maximum amount of refresh listeners each shard is allowed to have.
index.analyze.max_token_count | Maximum amount of tokens that can return from the `_analyze` API operation. Default is 10000.
index.highlight.max_analyzed_offset | The amount of characters a highlight request can analyze. Default is 1000000.
index.max_terms_count | The maximum amount of terms a terms query can accept. Default is 65536.
index.max_regex_length | The maximum character length of regex that can be in a regexp query. Default is 1000.
index.query.default_field | A field or list of fields that OpenSearch uses in queries in case a field isn't specified in the parameters.
index.routing.allocation.enable | Specifies options for the index’s shard allocation. Available options are all (allow allocation for all shards), primaries (allow allocation only for primary shards), new_primaries (allow allocation only for new primary shards), and none (do not allow allocation). Default is all.
index.routing.rebalance.enable | Enables shard rebalancing for the index. Available options are `all` (allow rebalancing for all shards), `primaries` (allow rebalancing only for primary shards), `replicas` (allow rebalancing only for replicas), and `none` (do not allow rebalancing). Default is `all`.
index.gc_deletes | Amount of time to retain a deleted document's version number. Default is `60s`.
index.default_pipeline | The default ingest node pipeline for the index. If the default pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.
index.final_pipeline | The final ingest node pipeline for the index. If the final pipeline is set and the pipeline does not exist, then index requests fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.

#### Index codec settings 
The `index.codec` setting of an OpenSearch index determines how the index’s stored fields are compressed and stored on the disk. The setting impacts the size of the index shards and the performance of the index operations. OpenSearch provides support for four different codecs that can be used for compressing the stored fields. Each codec offers different trade-offs between compression ratio (storage size) and indexing performance (speed). The available codecs are:
* `default` -- This codec employs the `LZ4` algorithm with a preset dictionary, which prioritizes performance over compression ratio. It offers faster indexing and search operations when compared with `best_compression` but may result in larger index/shard sizes. If no codec is provided in the index settings, then `LZ4`  is used as the default algorithm for compression.
* `best_compression` -- This codec utilizes `zlib` as an underlying algorithm for compression. It achieves high compression ratios resulting in smaller index sizes. However, this may incur additional CPU usage during index operations and may subsequently result in high indexing and search latencies. 
* `zstd` -- This codec uses the [`Zstandard` compression algorithm](https://github.com/facebook/zstd), which provides a good balance between compression ratio and speed. It provides significant compression comparable to the `best_compression` codec with reasonable CPU usage and improved indexing/search performance comparable to the `default` codec.
* `zstd_no_dict` -- This codec is similar to `zstd` but excludes the dictionary compression feature. It provides faster indexing and search operations compared to `zstd` at the expense of a slightly larger index size.

Index settings can be updated using a PUT request. Here's an example using the curl commands to close an index, update the settings, and open an index:

```json
POST /your_index/_close
```
{% include copy-curl.html %}

```json
PUT /your_index/_settings
{
  "index": {
    "codec": "zstd_no_dict",
    "codec.compression_level": 3
  }
}
```
{% include copy-curl.html %}

```json
POST /your_index/_open
```
{% include copy-curl.html %}


