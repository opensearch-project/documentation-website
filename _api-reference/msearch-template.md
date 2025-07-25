---
layout: default
title: Multi-search Template 
nav_order: 47
canonical_url: https://docs.opensearch.org/latest/api-reference/msearch-template/
---

# Multi-search Template 

**Introduced 1.0**
{: .label .label-purple }

The Multi-search Template API runs multiple search template requests in a single API request.

## Path and HTTP methods

The Multi-search Template API uses the following paths:

```json
GET /_msearch/template
POST /_msearch/template
GET /{index}/_msearch/template
POST /{index}/_msearch/template
```


## Query parameters and metadata options

All parameters are optional. Some can also be applied per search as part of each metadata line.

Parameter | Type | Description | Supported in metadata
:--- | :--- | :---  | :---
allow_no_indices | Boolean | Specifies whether to ignore wildcards that don't match any indexes. Default is `true`. | Yes
cancel_after_time_interval | Time | The interval of time after which the search request will be canceled. Supported at both parent and child request levels. The order of precedence is child-level parameter, parent-level parameter, and [cluster setting]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/). Default is `-1`. | Yes
css_minimize_roundtrips | Boolean | Specifies whether OpenSearch should try to minimize the number of network round trips between the coordinating node and remote clusters (only applicable to cross-cluster search requests). Default is `true`. | No
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`. | Yes
ignore_unavailable | Boolean | If an index or shard from the index list doesn’t exist, then this setting specifies whether to ignore the missing index or shard rather than fail the query. Default is `false`. | Yes
max_concurrent_searches | Integer | The maximum number of concurrent searches. The default depends on your node count and search thread pool size. Higher values can improve performance, but there may be a risk of overloading the cluster. | No
max_concurrent_shard_requests | Integer | The maximum number of concurrent shard requests that each search executes per node. Default is `5`. Higher values can improve performance, but there may be a risk of overloading the cluster. | No
pre_filter_shard_size | Integer | Default is `128`. | No
rest_total_hits_as_int | String | Specifies whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). Default is `false`. | No
search_type | String | Affects the relevance score. Valid options are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using term and document frequencies for a single shard (faster, less accurate), whereas `dfs_query_then_fetch` uses term and document frequencies across all shards (slower, more accurate). Default is `query_then_fetch`. | Yes
typed_keys | Boolean | Specifies whether to prefix aggregation names with their internal types in the response. Default is `false`. | No

### Metadata-only options

Some options can't be applied as parameters to the entire request. Instead, you can apply them per search as part of each metadata line. All are optional.

Option | Type | Description
:--- | :--- | :---
index | String, string array | If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it under this option. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
preference | String | Specifies the nodes or shards on which you want to perform the search. This setting can be useful for testing, but in most situations, the default behavior provides the best search latencies. Options include `_local`, `_only_local`, `_prefer_nodes`, `_only_nodes`, and `_shards`. These last three options accept a list of nodes or shards. Examples include `"_only_nodes:data-node1,data-node2"` and `"_shards:0,1`.
request_cache | Boolean | Specifies whether to cache results, which can improve latency for repeated searches. Default is to use the `index.requests.cache.enable` setting for the index (which defaults to `true` for new indexes).
routing | String | Comma-separated custom routing values, for example, `"routing": "value1,value2,value3"`.

## Request body

The multi-search template request body follows this pattern, similar to the [Multi-search API]({{site.url}}{{site.baseurl}}/api-reference/multi-search/) pattern:

```
Metadata\n
Query\n
Metadata\n
Query\n

```

- Metadata lines include options, such as which indexes to search and the type of search.
- Query lines use [query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/).

Like the [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) operation, the JSON doesn't need to be minified---spaces are fine---but it does need to be on a single line. OpenSearch uses newline characters to parse multi-search requests and requires that the request body end with a newline character.

## Example request

The following example `msearch/template` API request runs queries against a single index using multiple templates named `line_search_template` and `play_search_template`:

```json
GET _msearch/template
{"index":"shakespeare"}
{"id":"line_search_template","params":{"text_entry":"All the world's a stage","limit":false,"size":2}}
{"index":"shakespeare"}
{"id":"play_search_template","params":{"play_name":"Henry IV"}}
```
{% include copy-curl.html %}

## Example response

OpenSearch returns an array with the results of each search in the same order as in the multi-search template request:

```json
{
  "took": 5,
  "responses": [
    {
      "took": 5,
      "timed_out": false,
      "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 0,
          "relation": "eq"
        },
        "max_score": null,
        "hits": []
      }
    },
    {
      "took": 3,
      "timed_out": false,
      "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 0,
          "relation": "eq"
        },
        "max_score": null,
        "hits": []
      }
    }
  ]
}
```
