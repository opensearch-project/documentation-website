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
GET /<index>/_search
GET /_search

POST /<index>/_search
POST /_search
```

## Query parameters

All parameters are optional.

Many of the parameters apply only when you use the URL `q=` parameter or a `query_string` query, see [Query string query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) for further details.
{: .note}

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`. Example: `GET test-index-*/_search?allow_no_indices=true`. |
`allow_partial_search_results` | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`. Example: `GET test-index/_search?allow_partial_search_results=false`. |
`analyzer` | String | The analyzer to use in the query string. Requires `q=` or a `query_string` body. Example: `GET test-index/_search?q=title:test&analyzer=standard`. |
`analyze_wildcard` | Boolean | Whether the update operation should include wildcard and prefix queries in the analysis. Default is `false`. Requires `q=` or `query_string`. Example: `GET test-index/_search?q=title:te*&analyze_wildcard=true`. |
`batched_reduce_size` | Integer | The number of shard results to combine into one batch on the coordinating node before returning the final search results. Limits the number of shard results processed together, helping reduce memory usage when a search request spans many shards. Default is `512`. Example: `GET test-index/_search?batched_reduce_size=2`. |
`cancel_after_time_interval` | Time | The time after which the search request will be canceled. Request-level parameter takes precedence over the `cancel_after_time_interval` [cluster setting]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). Default is `-1`. Example: `GET test-index/_search?cancel_after_time_interval=10ms`. |
`ccs_minimize_roundtrips` | Boolean | Whether to minimize the number of round trips between a node and remote clusters. Default is `true`. Example: `GET test-index/_search?ccs_minimize_roundtrips=true`. |
`default_operator` | String | The default operator for a string query. Valid values are `AND` and `OR`. Default is `OR`. Requires `q=` or `query_string`. Example: `GET test-index/_search?q=title:test one&default_operator=AND`. |
`df` | String | The default field used if a field prefix is not provided in the query string. Requires `q=`  or `query_string`. Example: `GET test-index/_search?q=test&df=title`. |
`docvalue_fields` | String | A comma-separated list of fields whose values should be returned from their doc values representation. Doc values are an optimized, columnar format that improves performance for aggregations, sorting, and scripting. Example: `GET test-index/_search?docvalue_fields=ts,views`. |
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. <br> Default is `open`. Example: `GET test-index-*/_search?expand_wildcards=open`. |
`explain` | Boolean | If `true`, returns details about how OpenSearch computed each document's relevance score. Default is `false`. Only applies when `hits` are included in the search response. Example: `GET test-index/_search?explain=true&size=1&q=title:test`. |
`from` | Integer | The starting index to search from. Default is `0`. Example: `GET test-index/_search?from=5&size=5`. |
`ignore_throttled` | Boolean | Whether to ignore concrete indexes, expanded indexes, or indexes with aliases if they are frozen. Default is `true`. Example: `GET test-index/_search?ignore_throttled=true`. |
`ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes and unavailable shards during the search. If `false`, the request returns an error when targeting missing or closed indexes. Default is `false`. Example: `GET test-index-*/_search?ignore_unavailable=true`. |
`include_named_queries_score` | Boolean | Whether to return score contributions from named queries (queries with `_name`) for each hit. Default is `false`. Requires queries named with `_name`. Example: `POST test-index/_search?include_named_queries_score=true {"size":1,"query":{"match":{"title":{"query":"test","_name":"q1"}}}}`. |
`lenient` | Boolean | Whether OpenSearch should accept requests if queries have format errors (for example, querying a numeric field using text) instead of returning an error. Default is `false`. Requires `q=`  or `query_string`. Example: `GET test-index/_search?q=views:abc&lenient=true`. |
`max_concurrent_shard_requests` | Integer | The maximum number of concurrent shard requests this request should execute on each node. Default is `5`. Example: `GET test-index/_search?max_concurrent_shard_requests=2`. |
`phase_took` | Boolean | Whether to return phase-level `took` time values in the response. Default is `false`. Example: `GET test-index/_search?phase_took=true`. |
`pre_filter_shard_size` | Integer | A prefilter size threshold for triggering a prefilter operation on search shards. If the number of shards a search request expands to exceeds this value, OpenSearch performs a prefilter operation to eliminate shards that cannot match documents based on query rewriting. Default is `128`. Example: `GET test-index/_search?pre_filter_shard_size=1`. |
`preference` | String | Specifies the shards or nodes on which OpenSearch should perform the search. For valid values, see [The preference query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter). Example: `GET test-index/_search?preference=_local`. |
`q` | String | A Lucene query string query. Enables query-string helpers. Takes precedence over the `query` parameter in the request body. If both are specified, only documents matching this parameter are returned; the query in the request body is ignored. Example: `GET test-index/_search?q=title:test&size=5`. |
`request_cache` | Boolean | Whether OpenSearch should use caching of search results for a request if `size=0` is specified. Default is the index-level `request_cache` setting. Example: `GET test-index/_search?request_cache=true`. |
`rest_total_hits_as_int` | Boolean | Whether to return `hits.total` as an integer. Returns an object otherwise. Default is `false`. Use with `track_total_hits` set to `true`. Example: `GET test-index/_search?track_total_hits=true&rest_total_hits_as_int=true`. |
`routing` | String | The value used to route the update by query operation to a specific shard. Example: `GET test-index/_search?routing=user-42`. |
`scroll` | Time | The amount of time to keep the search context open. Requires `size` greater than `0` and a follow-up `_search/scroll`. Example: `GET test-index/_search?scroll=1m&size=2`. |
`search_type` | String | Whether OpenSearch should use global term and document frequencies when calculating relevance scores. Valid values are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It's usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It's usually slower but more accurate. Default is `query_then_fetch`. Example: `GET test-index/_search?search_type=dfs_query_then_fetch`. |
`seq_no_primary_term` | Boolean | Whether to return the sequence number and primary term of the last operation of each document hit. Example: `GET test-index/_search?seq_no_primary_term=true&size=1&q=title:test`. |
`size` | Integer | The number of results to include in the response. Example: `GET test-index/_search?size=3`. |
`sort` | List | A comma-separated list of `<field> : <direction>` pairs to sort by. Use `track_scores=true` if you want scores when sorting by a non-score field. Example: `GET test-index/_search?sort=views:desc&track_scores=true&size=3`. |
`_source` | String or Boolean | Controls the `_source` field provided in the response. Valid values are `true` (return the document source), `false` (do not return the document source) and `<string>` (the field or fields in the source to return provided as a list or wildcard pattern). Examples: `GET test-index/_search?_source=false&size=1`, `GET test-index/_search?_source=titl*&size=1`, `GET test-index/_search?_source=title,description&size=1`. |
`_source_excludes` | List | A comma-separated list of source fields to exclude from the response. If the `_source` parameter is `false`, this parameter is ignored. Example: `GET test-index/_search?_source_excludes=title&size=1`. |
`_source_includes` | List | A comma-separated list of source fields to include in the response. If the `_source` parameter is `false`, this parameter is ignored. Example: `GET test-index/_search?_source_includes=title&size=1`. |
`stats` | String | A value to associate with the request for additional logging. Example: `GET test-index/_search?stats=doc`. |
`stored_fields` | List | Whether the GET operation should retrieve fields stored in the index. Default is `false`. Example: `GET test-index-stored/_search?stored_fields=note&size=1`. |
`terminate_after` | Integer | The maximum number of matching documents (hits) OpenSearch should process before terminating the request. Default is `0` (no maximum). Example: `GET test-index/_search?terminate_after=1&size=10`. |
`timeout` | Time | How long the operation should wait for a response from active shards. Default is `1m` (1 minute). Example: `GET test-index/_search?timeout=10ms`. |
`track_scores` | Boolean | Whether to return document scores. Default is `false`. Use with `sort`. Example: `GET test-index/_search?sort=views:desc&track_scores=true&size=3`. |
`track_total_hits` | Boolean or Integer | Whether to return the total number of documents that matched the query. Example: `GET test-index/_search?track_total_hits=2`. |
`typed_keys` | Boolean | Whether returned aggregations and suggested terms should include their types in the response. Default is `true`. Only applicable for aggregations or suggesters. Example: `POST test-index/_search?typed_keys=true {"size":0,"aggs":{"a":{"terms":{"field":"views"}}}}`. |
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

All fields are optional.

Field | Type | Description
:--- | :--- | :---
aggs | Object | In the optional `aggs` parameter, you can define any number of aggregations. Each aggregation is defined by its name and one of the types of aggregations that OpenSearch supports. For more information, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
docvalue_fields | Array of objects | The fields that OpenSearch should return using their docvalue forms. Specify a format to return results in a certain format, such as date and time.
fields | Array | The fields to search for in the request. Specify a format to return results in a certain format, such as date and time.
explain | String | Whether to return details about how OpenSearch computed the document's score. Default is `false`.
from | Integer | The starting index to search from. Default is 0.
include_named_queries_score | Boolean | Whether to return scores for named queries.
indices_boost | Array of objects | Boosts the`_score` of documents from specific indexes. Each entry specifies an index and a boost factor in the format `<index>: <boost-multiplier>`. A boost greater than `1.0` increases the score, while a boost between `0` and `1.0` decreases it.
min_score | Integer | Specify a score threshold to return only documents above the threshold.
query | Object | The [DSL query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) to use in the request.
seq_no_primary_term | Boolean | Whether to return sequence number and primary term of the last operation of each document hit.
size | Integer | How many results to return. Default is 10.
_source | | Whether to include the `_source` field in the response.
stats | String | Value to associate with the request for additional logging.
suggest_field | String | The field used for suggestions. Use with `suggest_text` and, optionally, `suggest_mode` or `suggest_size`. |
suggest_mode | String | The mode to use when searching. Valid values are `always` (provide suggestions based on the terms in `suggest_text`), `popular` (provide suggestions occurring in more documents on the shard than the search term), and `missing` (provide suggestions for terms not in the shard). Requires `suggest_field` and `suggest_text`. |
suggest_size | Integer | The number of suggestions to return. Requires `suggest_field` and `suggest_text`. |
suggest_text | String | The input text for which OpenSearch should return suggestions. Requires `suggest_field` and `suggest_text`. |
terminate_after | Integer | The maximum number of matching documents (hits) OpenSearch should process before terminating the request. Default is 0.
timeout | Time | How long to wait for a response. Default is no timeout.
version | Boolean | Whether to include the document version in the response.

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /movies/_search
body: |
{
  "query": {
    "match": {
      "text_entry": "I am the night"
    }
  }
}
-->
{% capture step1_rest %}
GET /movies/_search
{
  "query": {
    "match": {
      "text_entry": "I am the night"
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
        "text_entry": "I am the night"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Response body fields

```json
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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "superheroes",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "superheroes": [
            {
              "Hero name": "Superman",
              "Real identity": "Clark Kent",
              "Age": 28
            },
            {
              "Hero name": "Batman",
              "Real identity": "Bruce Wayne",
              "Age": 26
            },
            {
              "Hero name": "Flash",
              "Real identity": "Barry Allen",
              "Age": 28
            },
            {
              "Hero name": "Robin",
              "Real identity": "Dick Grayson",
              "Age": 15
            }
          ]
        }
      }
    ]
  }
}
```

## The `ext` object

Starting with OpenSearch 2.10, plugin authors can add an `ext` object to the search response. The `ext` object contains plugin-specific response fields. For example, in conversational search, the result of retrieval-augmented generation (RAG) is a single "hit" (answer). Plugin authors can include this answer in the search response as part of the `ext` object so that it is separate from the search hits. In the following example response, the RAG result is in the `ext.retrieval_augmented_generation.answer` field:

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
