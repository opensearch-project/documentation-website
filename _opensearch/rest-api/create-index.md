---
layout: default
title: Create index
parent: REST API reference
grand_parent: OpenSearch
nav_order: 5
---

# Create index

While you can create an index by using a document as a base, you can also just create an empty index for use later.

## Example

The following example demonstrates how to create an index with specifies numbers of shards and replicas, specifies that `age` is of type `integer`, and assigns a `sample-alias1` alias to the index.

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

## Index naming restrictions

OpenSearch Indices have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

You can include the following URL parameters in your request. All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
include_type_name | Boolean | If `true`, the request expects a type in the body of mappings. Default is `false`.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default `30s`.
timeout | Time | How long to wait for the request to return. Default `30s`.

## Request body

As part of your request, you can supply parameters in your request's body that specify index settings, mappings, and aliases for your newly created index. The following sections provide more information about index settings and mappings. An alias is a virtual index name that references one or more indices. Because changing an alias's reference index is an atomic operation, aliases offer the benefit of reindexing data without any downtime. See [Index Aliases](../../index-alias) to learn more.

### Index settings

Index settings are separated into two varieties: static index settings and dynamic index settings. Static index settings are settings you specify and index creation and cannot be changed once the index is created. Dynamic index settings can be specified or changed at any time, including index creation.

#### Static index settings

Setting | Description
:--- | :---
index.number_of_shards | The number of primary shards in the index. (Default: 1)
index.number_of_routing_shards | The number of routing shards used to split an index.
index.shard.check_on_startup | Whether the index's shards should be checked for corruption. Available options are `false` (do not check for corruption), `checksum` (check for physical corruption), and `true` (check for both physical and logical corruption). (Default: `false`)
index.codec | The compression type to use to compress stored data. Available values are `best_compression` and `default`.
index.routing_partition_size | The number of shards a custom routing value can go to. Routing helps an out-of-balance by relocating values to a subset of shards rather than just a single shard. To enable, set this value to greater than 1 but less than `index.number_of_shards`. (Default: 1)
index.soft_deletes_enabled | Whether to retain a history of operations performed on the index.
index.soft_deletes.retention_lease.period | The maximum amount of time to retain a shard's history of operations. (Default: `12h`)
index.load_fixed_bitset_filters_eagerly | Indicates whether cached filters should be pre-loaded for nested queries. Available options are `true` and `false`. (Default: true)
index.hidden | Whether the index should be hidden. Hidden indices are not returned as part of queries that have wildcards. Available options are `true` and `false`. (Default: `false`)

#### Dynamic index Settings

Setting | Description
:--- | :---
index.number_of_replicas | The number of replica shards each shard should have. (Default: 1)
index.auto_expand_replicas | Automatically expands the number of replicas based on the amount of data nodes in the cluster. Specify a lower bound and upper limit (for example, 0-9), or `all` for the upper limit. (Default: disabled)
index.search.idle.after | Amount of time a shard should wait for a search or get request until it goes idle. (Default: `30s`)
index.refresh_interval | How often the index should refresh, which publishes its most recent changes and makes them available for searching. Can be set to `-1` to disable refreshing. (Default: `1s`)
index.max_result_window | The maximum value of `from` + `size` for searches to the index. `from` is the starting index to search from, and `size` is the amount of results to return. (Default: 10000)
index.max_inner_result_window | The maximum value of `from` + `size` for inner hits definitions and top hits aggregations to the index. `from` is the starting index to search from, and `size` is the amount of top hits to return. (Default: 100)
index.max_rescore_window | The maximum value of `window_size` for rescore requests to the index. Rescore requests reorder the index's documents and return a new score, which can be more precise. (Default: same as index.max_inner_result_window or 10000 by default)
index.max_docvalue_fields_search | Maximum amount of `docvalue_fields` allowed in a query. (Default: 100)
index.max_script_fields | Maximum amount of `script_fields` allowed in a query. (Default: 32)
index.max_ngram_diff | Maximum allowed difference between `min_gram` and `max_gram` values for `NGramTokenizer` and `NGramTokenFilter`. (Default: 1)
index.max_shingle_diff | Maximum allowed difference between `max_shingle_size` and `min_shingle_size` for the `shingle` token filter. (Default: 3)
index.max_refrehs_listeners | Maximum amount of refresh listeners available on the index's shards.
index.analyze.max_token_count | Maximum amount of tokens that can return from the `_analyze` API operation. (Default: 10000)
index.highlight.max_analyzed_offset | The maximum amount of characters that will be analyzed in a highlight request. (Default: 1000000)
index.max_terms_count | The maximum amount of terms that can be used in a terms query. (Default: 65536)
index.max_regex_length | The maximum character length of regex that can be in a regexp query. (Default: 1000)
index.query.default_field | A field or list of fields that OpenSearch uses in queries in case a field isn't specified in the parameters.
index.routing.allocation.enable | Specifies options for the index's shard allocation. Available options are `all` (allow shard allocation for all shards), `primaries` (allow shard allocation only for primary shards), `new_primaries` (allow shard allocaiton only for new primary shards), and `none` (do not allow shard allocation). (Default: `all`)
index.routing.rebalance.enable | Enables shard reblaancing for the index. Available options are `all` (allow shard rebalancing for all shards), `primaries`, (allow shard rebalancing only for primary shards), `replicas` (allow shard rebalancing only for replicas), and `none` (do not allow shard rebalancing). (Default: `all`)
index.gc_deletes | Amount of time to retain a deleted document's version number. (Default: `60s`)
index.default_pipeline | The default ingest node pipeline for the index. If the default pipeline is set and the pipeline does not exist, then index requests will fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.
index.final_pipeline | The final ingest node pipeline for htei ndex. If the final pipeline is set and the pipeline does not exist, then index requests will fail. The pipeline name `_none` specifies that the index does not have an ingest pipeline.

### Mappings

Mappings define how a documents and its fields are stored and indexed. If you're just starting to build out your cluster and data, you may not know exactly how your data should be stored. In those cases, you can use dynamic mappings, which tell OpenSearch to dynamically add data and their fields. However, if you know exactly what types your data fall under, then you can use explicit mappings.

For example, if you want to indicate that `year` should be of type `text` instead of an `integer`, and `age` should be an `integer`, you can do so with explicit mappings. Using dynamic mapping, OpenSearch might interpret both `year` and `age` as integers.

#### Dynamic mapping types

Type | Description
:--- | :---
null | A `null` field cannot be indexed or searched. When a field is set to null, OpenSearch behaves as if that field has no values.
boolean | OpenSearch accepts `true` and `false` as boolean values. An empty string is equal to `false.`
float | A single-precision 32-bit floating point number.
double | A double-precision 64-bit floating point number.
integer | A signed 32-bit number.
object | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, `director`.
array | Arrays in OpenSearch can only store values of one type, such as an array of just integers or strings. Empty arrays are treated as though they are fields with no values.
text | A `string` sequence of characters that represent full-text values.
keyword | A `string` sequence of structured characters, such as an email or zip code.
date detection string | Enabled by default, if new `string` fields match a date's format, then the `string` is processed as a `date` field. For example, `date: "2012/03/11"` is processed as a date.
numeric detection string | If disabled, OpenSearch may automatically process numeric values as `strings` when they should be processed as numbers. When enabled, OpenSearch can process `strings` into `long`, `integer`, `short`, `byte`, `double`, `float`, `half_float`, `scaled_float`, `unsigned_long`. Default is disabled.

#### Explicit mapping

If you know exactly what your data's typings need to be, you can specify them in your request body when creating your index.

```json
{
  "mappings": {
    "properties": {
      "year":    { "type" : "text" },
      "age":     { "type" : "integer" },
      "director":{ "type" : "text" }
    }
  }
}
```

## Response
```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "sample-index1"
}
```
