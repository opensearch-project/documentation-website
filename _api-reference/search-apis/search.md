---
layout: default
title: Search
parent: Search APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/search/
  - /api-reference/search/
---

# Search API
**Introduced 1.0**
{: .label .label-purple }

The search API operation lets you search your cluster for data.

## Endpoints

```json
GET /{index}/_search
GET /_search

POST /{index}/_search
POST /_search

QUERY /{index}/_search
QUERY /_search
```

The QUERY method is supported as of OpenSearch 2.17 (RFC 10008 compliance). The QUERY method is safe, idempotent, and cacheable, making it suitable for search requests that carry a request body.
{: .label .label-blue }

## Query parameters

Many of the parameters apply only when you use the URL `q=` parameter or a `query_string` query. See [Query string query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) for more information.
{: .note}

The following table lists the available query parameters. All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`. Example: `GET test-index-*/_search?allow_no_indices=true`. For more information, see [Targeting multiple indexes]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/#targeting-multiple-indexes). |
`allow_partial_search_results` | Boolean | Whether to return partial results if the request encounters an error or times out. Default is `true`. Example: `GET test-index/_search?allow_partial_search_results=false`. |
`analyzer` | String | The analyzer to use in the query string. Requires `q=` or a `query_string` body. Example: `GET test-index/_search?q=title:test&analyzer=standard`. For more information, see [Text analysis]({{site.url}}{{site.baseurl}}/analyzers/). |
`analyze_wildcard` | Boolean | Whether to analyze wildcard and prefix queries in the query string. Default is `false`. Requires `q=` or `query_string`. Example: `GET test-index/_search?q=title:te*&analyze_wildcard=true`. |
`batched_reduce_size` | Integer | The number of shard results to combine into one batch on the coordinating node before returning the final search results. Limits the number of shard results processed together, helping reduce memory usage when a search request spans many shards. Default is `512`. Example: `GET test-index/_search?batched_reduce_size=2`. |
`cancel_after_time_interval` | Time | The time after which the search request will be canceled. Request-level parameter takes precedence over the `cancel_after_time_interval` [cluster setting]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). Default is `-1`. Example: `GET test-index/_search?cancel_after_time_interval=10ms`. |
`ccs_minimize_roundtrips` | Boolean | Whether to minimize the number of round trips between a node and remote clusters. Default is `true`. Example: `GET test-index/_search?ccs_minimize_roundtrips=true`. |
`default_operator` | String | The default operator for a string query. Valid values are `AND` and `OR`. Default is `OR`. Requires `q=` or `query_string`. Example: `GET test-index/_search?q=title:test one&default_operator=AND`. |
`df` | String | The default field used if a field prefix is not provided in the query string. Requires `q=`  or `query_string`. Example: `GET test-index/_search?q=test&df=title`. |
`docvalue_fields` | String | A comma-separated list of fields whose values should be returned from their doc values representation. Doc values are an optimized, columnar format that improves performance for aggregations, sorting, and scripting. Example: `GET test-index/_search?docvalue_fields=ts,views`. For more information, see [Searching with doc value fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-doc-value-fields). |
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. <br> Default is `open`. Example: `GET test-index-*/_search?expand_wildcards=open`. For more information, see [Targeting multiple indexes]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/#targeting-multiple-indexes). |
`explain` | Boolean | If `true`, returns details about how OpenSearch computed each document's relevance score. Default is `false`. Only applies when `hits` are included in the search response. Example: `GET test-index/_search?explain=true&size=1&q=title:test`. For more information, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/explain/). |
`from` | Integer | The number of hits to skip before returning results. Use with `size` to paginate results. Default is `0`. Example: `GET test-index/_search?from=5&size=5`. For more information, see [The from and size parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters). |
`ignore_throttled` | Boolean | Whether to ignore concrete indexes, expanded indexes, or indexes with aliases if they are frozen. Default is `true`. Example: `GET test-index/_search?ignore_throttled=true`. |
`ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes and unavailable shards during the search. If `false`, the request returns an error when targeting missing or closed indexes. Default is `false`. Example: `GET test-index-*/_search?ignore_unavailable=true`. For more information, see [Targeting multiple indexes]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/#targeting-multiple-indexes). |
`include_named_queries_score` | Boolean | Whether to return score contributions from named queries (queries with `_name`) for each hit. Default is `false`. Requires queries named with `_name`. Example: `POST test-index/_search?include_named_queries_score=true {"size":1,"query":{"match":{"title":{"query":"test","_name":"q1"}}}}`. For more information, see [Named queries]({{site.url}}{{site.baseurl}}/query-dsl/named-queries/). |
`lenient` | Boolean | Whether OpenSearch should accept requests if queries have formatting errors (for example, querying a numeric field using text) instead of returning an error. Default is `false`. Requires `q=` or `query_string`. Example: `GET test-index/_search?q=views:abc&lenient=true`. |
`max_concurrent_shard_requests` | Integer | The maximum number of concurrent shard requests this request should execute on each node. Default is `5`. Example: `GET test-index/_search?max_concurrent_shard_requests=2`. |
`node_level_query_fanout` | Boolean | Whether to use node-level query fan-out for this search request, overriding the `search.node_level_query_fanout.enabled` cluster setting when provided. Node-level query fan-out groups shard-level `query_then_fetch` query and `can_match` requests by target data node. Default is `false`. Example: `POST index1/_search?node_level_query_fanout=true`. |
`phase_took` | Boolean | Whether to return phase-level `took` time values in the response. Default is `false`. Example: `GET test-index/_search?phase_took=true`. |
`pre_filter_shard_size` | Integer | A prefilter size threshold for triggering a prefilter operation on search shards. If the number of shards a search request expands to exceeds this value, OpenSearch performs a prefilter operation to eliminate shards that cannot match documents based on query rewriting. Default is `128`. Example: `GET test-index/_search?pre_filter_shard_size=1`. |
`preference` | String | Specifies the shards or nodes on which OpenSearch should perform the search. Example: `GET test-index/_search?preference=_local`. For valid values, see [The preference query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter). |
`q` | String | A Lucene query string query. Enables query-string helpers. Takes precedence over the `query` parameter in the request body. If both are specified, only documents matching this parameter are returned; the query in the request body is ignored. Example: `GET test-index/_search?q=title:test&size=5`. For more information, see [Query string query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/). |
`request_cache` | Boolean | Whether OpenSearch should use caching of search results for a request if `size=0` is specified. Default is the index-level `request_cache` setting. Example: `GET test-index/_search?request_cache=true`. For more information, see [Index request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/). |
`rest_total_hits_as_int` | Boolean | Whether to return `hits.total` as an integer. Returns an object otherwise. Default is `false`. Use with `track_total_hits` set to `true`. Example: `GET test-index/_search?track_total_hits=true&rest_total_hits_as_int=true`. |
`routing` | String | A custom value used to route the search to a specific shard. Example: `GET test-index/_search?routing=user-42`. For more information, see [Routing]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/routing/). |
`scroll` | Time | The amount of time to keep the search context open. Requires `size` greater than `0` and a follow-up `_search/scroll`. Example: `GET test-index/_search?scroll=1m&size=2`. For more information, see [Scroll search]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#scroll-search). |
`search_type` | String | Whether OpenSearch should use global term and document frequencies when calculating relevance scores. Valid values are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It's usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It's usually slower but more accurate. Default is `query_then_fetch`. Example: `GET test-index/_search?search_type=dfs_query_then_fetch`. |
`seq_no_primary_term` | Boolean | Whether to return the sequence number and primary term of the last operation of each document hit. Example: `GET test-index/_search?seq_no_primary_term=true&size=1&q=title:test`. |
`size` | Integer | The maximum number of results to return. Use with `from` to paginate results. Default is `10`. Example: `GET test-index/_search?size=3`. For more information, see [The from and size parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters). |
`sort` | List | A comma-separated list of `<field>:<direction>` pairs to sort by. Use `track_scores=true` if you want scores when sorting by a non-score field. Example: `GET test-index/_search?sort=views:desc&track_scores=true&size=3`. For more information, see [Sort results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/). |
`_source` | String or Boolean | Controls the `_source` field provided in the response. Valid values are `true` (return the document source), `false` (do not return the document source) and `<string>` (the field or fields in the source to return, provided as a list or wildcard pattern). Examples: `GET test-index/_search?_source=false&size=1`, `GET test-index/_search?_source=titl*&size=1`, `GET test-index/_search?_source=title,description&size=1`. For more information, see [Source filtering](#source-filtering). |
`_source_excludes` | List | A comma-separated list of source fields to exclude from the response. If the `_source` parameter is `false`, this parameter is ignored. Example: `GET test-index/_search?_source_excludes=title&size=1`. For more information, see [Source filtering](#source-filtering). |
`_source_includes` | List | A comma-separated list of source fields to include in the response. If the `_source` parameter is `false`, this parameter is ignored. Example: `GET test-index/_search?_source_includes=title&size=1`. For more information, see [Source filtering](#source-filtering). |
`stats` | String | A comma-separated list of [search stats groups](#search-stats-groups) to associate with the request. Example: `GET test-index/_search?stats=group1`. |
`stored_fields` | List | A comma-separated list of stored fields to return for each hit. Example: `GET test-index-stored/_search?stored_fields=note&size=1`. For more information, see [Searching with stored fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-stored-fields). |
`suggest_field` | String | The field used for term suggestions. Requires `suggest_mode` and either `suggest_text` or `q`. To configure suggestions in the request body, use the `suggest` field. For more information, see [Did-you-mean]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/did-you-mean/).
`suggest_mode` | String | The mode to use when searching. Valid values are `always` (provide suggestions based on the terms in `suggest_text`), `popular` (provide suggestions occurring in more documents on the shard than the search term), and `missing` (provide suggestions for terms not on the shard). Required when you use `suggest_field`.
`suggest_size` | Integer | The number of suggestions to return. Requires `suggest_field` and `suggest_mode`.
`suggest_text` | String | The input text for which OpenSearch should return suggestions. Requires `suggest_field` and `suggest_mode`. If omitted, OpenSearch uses the value of `q`.
`terminate_after` | Integer | The maximum number of matching documents (hits) OpenSearch should process before terminating the request. Default is `0` (no maximum). Example: `GET test-index/_search?terminate_after=1&size=10`. |
`timeout` | Time | How long the operation should wait for a response from active shards. Default is `1m` (1 minute). Example: `GET test-index/_search?timeout=10ms`. |
`track_scores` | Boolean | Whether to return document scores. Default is `false`. Use with `sort`. Example: `GET test-index/_search?sort=views:desc&track_scores=true&size=3`. For more information, see [Tracking scores]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/#tracking-scores). |
`track_total_hits` | Boolean or Integer | How many matching documents to count. Default is `10000`. Example: `GET test-index/_search?track_total_hits=2`. For more information, see [Track total hits](#track-total-hits). |
`typed_keys` | Boolean | Whether returned aggregations and suggested terms should include their types in the response. Default is `false`. Only applicable for aggregations or suggesters. Example: `POST test-index/_search?typed_keys=true {"size":0,"aggs":{"a":{"terms":{"field":"views"}}}}`. For more information, see [Including suggester types in the response]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/did-you-mean/#including-suggester-types-in-the-response). |
`version` | Boolean | Whether to include the document version as a match. Example: `GET test-index/_search?version=true&size=1&q=title:test`. |

### The `preference` query parameter

The `preference` query parameter specifies the shards or nodes on which OpenSearch should perform the search. The following are valid values:

- `_primary`: Perform the search only on primary shards.
- `_replica`: Perform the search only on replica shards.
- `_primary_first`: Perform the search on primary shards but fail over to other available shards if primary shards are not available.
- `_replica_first`: Perform the search on replica shards but fail over to other available shards if replica shards are not available.
- `_local`: If possible, perform the search on the local node's shards.
- `_prefer_nodes:<node-id-1>,<node-id-2>`: If possible, perform the search on the specified nodes. Use a comma-separated list to specify multiple nodes.
- `_shards:<shard-id-1>,<shard-id-2>`: Perform the search only on the specified shards. Use a comma-separated list to specify multiple shards. When combined with other preferences, the `_shards` preference must be listed first. For example, `_shards:1,2|_replica`.
- `_only_nodes:<node-id-1>,<node-id-2>`: Perform the search only on the specified nodes. Use a comma-separated list to specify multiple nodes.
- `<string>`: Specifies a custom string to use for the search. The string cannot start with an underscore character (`_`). Searches with the same custom string are routed to the same shards.

## Request body

The following table lists the available request body fields. All request body fields are optional.

Field | Type | Description
:--- | :--- | :---
`aggregations`, `aggs` | Object | In the optional `aggregations` parameter (or its short form, `aggs`), you can define any number of aggregations. Each aggregation is defined by its name and one of the types of aggregations that OpenSearch supports. For more information, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
`collapse` | Object | Collapses the search results so that only the top document for each value of the specified field is returned. For more information, see [Collapse search results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/collapse-search/).
`derived` | Object | Defines derived fields, which are computed at search time by a script and can be queried, aggregated, and returned like indexed fields. For more information, see [Derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/).
`docvalue_fields` | Array of objects | The fields to return in their `doc_values` form. You can include a format for the returned values (for example, a date format). For `knn_vector` fields, supported formats are `binary` (default, Base64-encoded) and `array` (JSON numeric arrays). For more information, see [Retrieving vector fields using `docvalue_fields`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#retrieving-vector-fields-using-docvalue_fields).
`explain` | Boolean | Whether to return details about how OpenSearch computed the document's score. Default is `false`.
`ext` | Object | Settings used by plugins, such as search pipeline processors. For more information, see [The ext object](#the-ext-object).
`fields` | Array | The fields to return in the `fields` object of each hit. You can use wildcard patterns and specify a format for date fields. For more information, see [Retrieve specific fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/).
`from` | Integer | The number of results to skip before returning results. Use with `size` to paginate results. Default is `0`. For more information, see [The from and size parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).
`highlight` | Object | Returns snippets of the matching text with the search terms highlighted. For more information, see [Highlight query matches]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/).
`include_named_queries_score` | Boolean | Whether to return scores for named queries.
`indices_boost` | Array of objects | Boosts the`_score` of documents from specific indexes. Each entry specifies an index and a boost factor in the format `<index>: <boost-multiplier>`. A boost greater than `1.0` increases the score, while a boost between `0` and `1.0` decreases it.
`min_score` | Float | The minimum score that a document must have to be returned in the results.
`pit` | Object | The Point in Time (PIT) to search. When you search a PIT, do not specify an index in the request path. For more information, see [Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/point-in-time/).
`post_filter` | Object | A query that filters the results after aggregations are calculated. The aggregations include all documents that match the `query`, while the results include only the documents that also match `post_filter`. For more information, see [Filter search results]({{site.url}}{{site.baseurl}}/search-plugins/filter-search/#narrowing-results-using-post-filter-while-preserving-aggregation-visibility).
`profile` | Boolean | Whether to return detailed timing information about how each part of the query was executed. Default is `false`. For more information, see [Profile API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/profile/).
`query` | Object | The [DSL query]({{site.url}}{{site.baseurl}}/query-dsl/) to use in the request.
`rescore` | Object or Array of objects | Reorders the top results returned by the `query` using a second, typically more expensive, query. For more information, see [Rescore]({{site.url}}{{site.baseurl}}/query-dsl/rescore/).
`script_fields` | Object | Fields whose values are computed by a script for each hit and returned in the `fields` object. For more information, see [Using scripted fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields).
`search_after` | Array | The sort values of the last hit on the previous page. Returns the results that follow it in the sort order. Requires `sort`. For more information, see [The search_after parameter]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-search_after-parameter).
`search_pipeline` | Object | A temporary search pipeline that applies only to this request. For more information, see [Search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/).
`seq_no_primary_term` | Boolean | Whether to return sequence number and primary term of the last operation of each document hit.
`size` | Integer | The maximum number of results to return. Use with `from` to paginate results. Default is `10`. For more information, see [The from and size parameters]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).
`slice` | Object | Splits a scroll or PIT search into slices that can be processed independently. For more information, see [Scroll search]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#scroll-search).
`sort` | Array of objects or strings | Specifies how to sort the results. Can be a field name, an object with field and sort options, or an array of these. See [Sorting results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/).
`_source` | Boolean, String, Array of strings, or Object | The document source fields to return in each hit. Default is `true` (return the full document). For more information, see [Source filtering](#source-filtering).
`stats` | Array of strings | A list of [search stats groups](#search-stats-groups) to associate with the request.
`stored_fields` | Array of strings | The stored fields to return for each hit. If you specify `stored_fields`, `_source` is not returned unless you request it. For more information, see [Searching with stored fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-stored-fields).
`suggest` | Object | Returns suggested terms or phrases that are similar to the provided text. For more information, see [Did-you-mean]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/did-you-mean/).
`terminate_after` | Integer | The maximum number of matching documents (hits) OpenSearch should process before terminating the request. Default is 0.
`timeout` | Time | How long to wait for a response. Default is no timeout.
`track_scores` | Boolean | Whether to calculate and return document scores when sorting by a field other than `_score`. Default is `false`, in which case `_score` is `null` in sorted results.
`track_total_hits` | Boolean or Integer | How many matching documents to count accurately. Default is `10000`. For more information, see [Track total hits](#track-total-hits).
`verbose_pipeline` | Boolean | Whether to return information about each search pipeline processor that ran for the request. Default is `false`. For more information, see [Debugging a search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/debugging-search-pipeline/).
`version` | Boolean | Whether to include the document version in the response.

### Search stats groups

You can associate a search request with one or more stats groups by specifying group names in the `stats` field of the request body or as a query parameter. OpenSearch maintains per-group search statistics that you can retrieve using the [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/#specific-search-groups).

The following example associates a search request with two groups:

```json
POST /my-index/_search
{
  "query": {
    "match_all": {}
  },
  "stats": ["group1", "group2"]
}
```
{% include copy-curl.html %}

To retrieve search statistics for specific groups, use the `groups` query parameter of the Index Stats API:

```json
GET /my-index/_stats/search?groups=group1,group2
```
{% include copy-curl.html %}

To return statistics for all groups, use `_all`:

```json
GET /my-index/_stats/search?groups=_all
```
{% include copy-curl.html %}

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /movies/_search
body: |
{
  "query": {
    "match": {
      "director": "Christopher Nolan"
    }
  }
}
-->
{% capture step1_rest %}
GET /movies/_search
{
  "query": {
    "match": {
      "director": "Christopher Nolan"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search(
  index = "movies",
  body =   {
    "query": {
      "match": {
        "director": "Christopher Nolan"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

The following example response shows the structure of a search response:

```json
{
  "took": 14,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.42727602,
    "hits": [
      {
        "_index": "movies",
        "_id": "1",
        "_score": 0.42727602,
        "_source": {
          "title": "The Dark Knight",
          "director": "Christopher Nolan",
          "year": 2008,
          "genre": "Action"
        }
      },
      {
        "_index": "movies",
        "_id": "2",
        "_score": 0.42727602,
        "_source": {
          "title": "Inception",
          "director": "Christopher Nolan",
          "year": 2010,
          "genre": "Science Fiction"
        }
      }
    ]
  }
}
```

## Response body fields

The following table lists the top-level response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `took` | Integer | The time, in milliseconds, that OpenSearch took to run the search. This is measured from the moment the coordinating node receives the request until it is ready to send the response, so it includes communication between the coordinating node and the data nodes, time spent queued in the `search` thread pool, and the search itself. It does not include the time spent transmitting the request or the response over the network. |
| `phase_took` | Object | The time, in milliseconds, spent in each search phase (`can_match`, `dfs_pre_query`, `query`, `dfs_query`, `fetch`, and `expand`). Returned only when the `phase_took` query parameter is `true`. |
| `timed_out` | Boolean | Whether the search timed out before completing. If `true`, the returned results may be partial or empty. |
| `terminated_early` | Boolean | Whether OpenSearch stopped the search early because it collected the number of documents specified in `terminate_after`. Returned only when `terminate_after` is set. |
| `_shards` | Object | The number of shards that the search ran on and the outcome for each group of shards. |
| `hits` | Object | The matching documents and their metadata. |
| `aggregations` | Object | The aggregation results, keyed by aggregation name. Returned only when the request body contains an `aggs` object. |
| `suggest` | Object | The suggestion results, keyed by suggester name. Returned only when the request body contains a `suggest` object. |
| `profile` | Object | Per-shard timing details for the query and fetch phases. Returned only when the request body sets `profile` to `true`. For more information, see [Profile API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/profile/). |
| `_scroll_id` | String | The scroll ID that identifies the search context. Pass this value to the [Scroll API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/scroll/) to retrieve the next batch of results. Returned only when the request includes the `scroll` query parameter. |
| `pit_id` | String | The Point in Time (PIT) ID that identifies the search context. Returned only when the request searches a PIT. For more information, see [Point in Time API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-in-time-api/). |
| `_clusters` | Object | The number of clusters that a cross-cluster search ran on and the outcome for each group of clusters. Returned only for cross-cluster searches. |
| `num_reduce_phases` | Integer | The number of reduce phases that OpenSearch performed in order to combine partial shard results into the final result set. Returned only when the search uses more than one reduce phase. |

The following table lists the fields in the `_shards` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The number of shards that the search needed to query, including unallocated shards. |
| `successful` | Integer | The number of shards that ran the search successfully. |
| `skipped` | Integer | The number of shards that skipped the search because a preliminary check determined that no document on the shard could match. This commonly happens when the search contains a range filter and all values on the shard fall outside of that range. |
| `failed` | Integer | The number of shards that failed to run the search. Unallocated shards count as neither successful nor failed, so if `successful` and `failed` add up to less than `total`, some of the shards were unallocated. |

The following table lists the fields in the `hits` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total` | Object | The number of matching documents. Contains a `value` field with the count and a `relation` field that is `eq` when the count is exact or `gte` when the count is a lower bound. Omitted when `track_total_hits` is `false`. |
| `max_score` | Float | The highest `_score` among the matching documents. Is `null` when the search does not sort by `_score`. |
| `hits` | Array of objects | The matching documents, ordered by relevance or by the specified sort. |

The following table lists the fields in each object in the `hits.hits` array.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_index` | String | The name of the index that contains the document. |
| `_id` | String | The document ID. This ID is unique only within the returned index. |
| `_score` | Float | The relevance score for the document. Is `null` when the search does not sort by `_score`. |
| `_source` | Object | The original JSON document provided at indexing time. To omit this field or to return only specific fields, see [Source filtering](#source-filtering). |
| `fields` | Object | The field values retrieved by `docvalue_fields` or `stored_fields`. Returned only when the request specifies either of those parameters. |
| `sort` | Array | The sort values for the document. Returned only when the request body contains a `sort` array. Pass the values from the last hit as `search_after` to retrieve the next page of results. |
| `highlight` | Object | The highlighted snippets, keyed by field name. Returned only when the request body contains a `highlight` object. |
| `matched_queries` | Array of strings | The names of the named queries that the document matched. Returned only when the search uses the `_name` parameter. |
| `inner_hits` | Object | The matching nested, child, or parent documents. Returned only when the request body contains an `inner_hits` object. |
| `_explanation` | Object | A breakdown of how OpenSearch computed the document's relevance score. Returned only when `explain` is `true`. |
| `_shard` | String | The shard that returned the document. Returned only when `explain` is `true`. |
| `_node` | String | The node that returned the document. Returned only when `explain` is `true`. |

## Source filtering

Each hit in the response contains a `_source` object holding the original JSON document. Returning the full document for every hit transfers more data than most applications need. Source filtering limits the fields that OpenSearch returns in `_source`.

The following table lists the accepted values for the `_source` request body parameter.

| Value | Description |
| :--- | :--- |
| `true` | Returns the full document. This is the default. |
| `false` | Omits the `_source` object from each hit. |
| String | A field name or a wildcard pattern, such as `details.*`. OpenSearch returns only the matching fields. |
| Array of strings | A list of field names or wildcard patterns, such as `["name", "details.*"]`. |
| Object | An object containing `includes` and `excludes` lists. A field that matches a pattern in both lists is not returned because `excludes` takes precedence. |

To filter the source in the request URL instead of the request body, use the `_source`, `_source_includes`, and `_source_excludes` query parameters.

For examples and limitations, see [Using source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering).

## Track total hits

Counting matching documents exactly requires visiting every match, which is expensive for queries that match many documents. The `track_total_hits` parameter limits how many matches OpenSearch counts. Specify it either as a query parameter or in the request body.

By default, OpenSearch counts matches accurately up to `10000`. When more documents match, `hits.total.value` reports `10000` and `hits.total.relation` is `gte`, indicating that the query matched at least that many documents.

The following table lists the accepted values for `track_total_hits`.

| Value | Description |
| :--- | :--- |
| `true` | Counts every matching document. `hits.total.relation` is always `eq`. |
| `false` | Disables hit counting. The response contains no `hits.total` object. |
| Integer | Counts matching documents accurately up to the specified number. When more documents match, `hits.total.value` reports the threshold and `hits.total.relation` is `gte`. |

Counting every match slows down searches that match many documents. Once the count reaches the threshold, OpenSearch can skip documents that cannot enter the top results, which makes searches sorted by relevance faster. Increase the threshold only when your application requires an exact count, and set `track_total_hits` to `false` when you do not display a count at all.

The `rest_total_hits_as_int` query parameter requires an exact count. OpenSearch rejects a request that sets `rest_total_hits_as_int` to `true` and sets `track_total_hits` to an integer.

### Example: Default hit counting

The following example searches a `logs` index containing 10,500 documents without specifying `track_total_hits`:

```json
GET /logs/_search
{
  "size": 0,
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

Because `relation` is `gte`, the index contains at least 10,000 matching documents:

```json
{
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  }
}
```

### Example: Counting every matching document

To count every match, set `track_total_hits` to `true`:

```json
GET /logs/_search
{
  "size": 0,
  "track_total_hits": true,
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

Because `relation` is `eq`, `value` is the exact number of matching documents:

```json
{
  "hits": {
    "total": {
      "value": 10500,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

### Example: Counting up to a custom threshold

An integer threshold returns an exact count when fewer documents match and a lower bound otherwise. In the `logs` index, 35 documents have the `level` value `error`, and the remaining documents have the value `info`. The following request counts `error` documents up to a threshold of 50:

```json
GET /logs/_search
{
  "size": 0,
  "track_total_hits": 50,
  "query": {
    "term": {
      "level": "error"
    }
  }
}
```
{% include copy-curl.html %}

Fewer than 50 documents match, so the count is exact:

```json
{
  "hits": {
    "total": {
      "value": 35,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

If you run the same request with `"level": "info"`, more than 50 documents match. OpenSearch stops counting at the threshold and returns a lower bound:

```json
{
  "hits": {
    "total": {
      "value": 50,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  }
}
```

### Example: Disabling hit counting

If your application does not display the number of matches, set `track_total_hits` to `false`:

```json
GET /logs/_search
{
  "size": 2,
  "_source": false,
  "track_total_hits": false,
  "query": {
    "term": {
      "level": "error"
    }
  }
}
```
{% include copy-curl.html %}

The `hits` object contains the matching documents but no `total` object:

```json
{
  "hits": {
    "max_score": 1.0,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1.0
      },
      {
        "_index": "logs",
        "_id": "301",
        "_score": 1.0
      }
    ]
  }
}
```

## The `ext` object
**Introduced 2.10**
{: .label .label-purple }

Plugin authors can add an `ext` object to both search requests and search responses. The `ext` object contains plugin-specific fields that allow plugins to pass additional parameters in requests or return additional information in responses.

### Using `ext` in search responses

Plugins can add an `ext` object to the search response to include plugin-specific response fields. For example, in conversational search, the result of retrieval-augmented generation (RAG) is a single "hit" (answer). Plugin authors can include this answer in the search response as part of the `ext` object so that it is separate from the search hits. In the following example response, the RAG result is in the `ext.retrieval_augmented_generation.answer` field:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 3,
    "successful": 3,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 110,
      "relation": "eq"
    },
    "max_score": 0.55129033,
    "hits": [
      {
       "_index": "...",
        "_id": "...",
        "_score": 0.55129033,
        "_source": {
          "text": "...",
          "title": "..."
        }
      },
      {
      ...
      }
      ...
      {
      ...
      }
    ],
  }, // end of hits
  "ext": {
    "retrieval_augmented_generation": { // a search response processor
      "answer": "RAG answer"
    }
  }
}
```

### Using `ext` in search requests

Plugins can also accept an `ext` object in search requests to provide plugin-specific parameters. The structure and content of the `ext` object in requests depends on the plugin implementation. Consult your plugin's documentation for the specific fields supported in the request `ext` object.

The following example shows a search request that includes an `ext` object. The exact fields within `ext` depend on which plugins are installed and what parameters they accept:

```json
POST /my-index/_search
{
  "query": {
    "match": {
      "field": "value"
    }
  },
  "ext": {
    "my_plugin": {
      "custom_parameter": "value"
    }
  }
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:data/read/search`.
