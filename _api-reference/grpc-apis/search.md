---
layout: default
title: Search (gRPC)
parent: gRPC APIs
nav_order: 20
---

# Search API (gRPC)
**Introduced 3.0**
{: .label .label-purple }


This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).
{: .warning}

The gRPC Search API provides a performant, binary interface for running [queries]({{site.url}}{{site.baseurl}}/api-reference/search/) using protocol buffers over gRPC. It mirrors the capabilities of the HTTP Search API while benefiting from protobuf-typed contracts and gRPC transport. The gRPC APIs are ideal for low-latency, high-throughput applications.

## Prerequisite

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#using-grpc-apis).

## gRPC service and method

gRPC Document APIs reside in the [`SearchService`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/services/search_service.proto#L22).

You can submit search requests by invoking the [`Search`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/services/search_service.proto#L23) gRPC method within the `SearchService`. The method takes in a [`SearchRequest`](#searchrequest-fields) and returns a [`SearchResponse`](#searchresponse-fields).

Currently, only the following basic queries are supported: [`match_all`](#match-all-query), [`term`](#term-query),
[`terms`](#terms-query), and [`match_none`](#match-none-query). Additional query types will be supported in future versions.
{: .note}

## Request fields

The gRPC Search API supports the following request fields.

### SearchRequest fields

The [`SearchRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L18) message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | `repeated string` | A list of indexes to search. If not provided, defaults to all indexes. |
| `source` | [`SourceConfigParam`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L154) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `source_excludes` | `repeated string` | Fields to exclude from `_source`. Ignored if `source` is `false`. |
| `source_includes` | `repeated string` | Fields to include in `_source`. Ignored if `source` is `false`.  |
| `allow_no_indices` | `bool` | Whether to ignore wildcards that match no indexes. Default is `true`. |
| `allow_partial_search_results` | `bool` | Whether to return partial results upon an error or timeout. Default is `true`. |
| `analyze_wildcard` | `bool` | Whether to analyze wildcard/prefix queries. Default is `false`.  |
| `analyzer` | `string` | The analyzer to use with the `q` query string.  |
| `batched_reduce_size` | `int32` | The number of shards to reduce on a node. Default is `512`.  |
| `cancel_after_time_interval` | `string` | The time after which the request will be canceled. Default is `-1`. |
| `ccs_minimize_roundtrips` | `bool` | Whether to minimize round trips between the node and remote clusters. Default is `true`.  |
| `default_operator` | [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L950) | The default operator for query strings. Valid values are `AND` or `OR`. Default is `OR`.  |
| `df` | `string` | The default field for query strings without field prefixes.  |
| `docvalue_fields` | `repeated string` | The fields to return as doc values. |
| `expand_wildcards` | `repeated` [`ExpandWildcard`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L56) | Specifies the type of index that wildcard expressions can match. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.|
| `explain` | `bool` | Whether to return document score computation details. Default is `false`. |
| `from` | `int32` | The starting index for paginated results. Default is `0`. |
| `ignore_throttled` | `bool` | Whether to ignore frozen indexes when resolving aliases. Default is `true`. |
| `ignore_unavailable` | `bool` | Whether to ignore unavailable indexes or shards. Default is `false`. |
| `include_named_queries_score` | `bool` | Whether to include scores for named queries. Default is `false`. |
| `lenient` | `bool` | Whether to accept format errors in queries. Default is `false`. |
| `max_concurrent_shard_requests` | `int32` | The number of concurrent shard requests per node. Default is `5`. |
| `phase_took` | `bool` | Whether to return phase-level `took` values. Default is `false`. |
| `pre_filter_shard_size` | `int32` | The threshold at which to trigger prefiltering by shard size. Default is `128`. |
| `preference` | `string` | The shard or node preferences for query execution. |
| `q` | `string` | The query string in [Lucene syntax]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/#query-string-syntax). |
| `request_cache` | `bool` | Whether to use the request cache. Defaults to the index's settings. |
| `rest_total_hits_as_int` | `bool` | Whether to return the number of total hits as an integer. Default is `false`. |
| `routing` | `repeated string` | The routing values used to direct requests to specific shards. |
| `scroll` | `string` | The amount of time to keep the search context alive for scrolling. |
| `search_pipeline` | `string` | The name of the search pipeline to use. |
| `search_type` | [`SearchType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L109) | The method for calculating relevance scores. Valid values are `QUERY_THEN_FETCH` and `DFS_QUERY_THEN_FETCH`. Default is `QUERY_THEN_FETCH`. |
| `seq_no_primary_term` | `bool` | Whether to return the sequence number and primary term. |
| `size` | `int32` | The number of results to return. |
| `sort` | `repeated` [`SortOrder`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L122) | The fields and directions by which to sort the results. Each `SortOrder` contains a `field` and optional `direction` (ASC/DESC). |
| `stats` | `repeated string` | The tags to associate with the request for logging. |
| `stored_fields` | `repeated string` | A list of stored fields to include in the response. |
| `suggest_field` | `string` | The field on which to base suggestions. |
| `suggest_mode` | [`SuggestMode`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L145) | The suggestion mode (for example, `always`, `missing`, `popular`). |
| `suggest_size` | `int32` | The number of suggestions to return. |
| `suggest_text` | `string` | The input text for generating suggestions. |
| `terminate_after` | `int32` | The maximum number of matching documents (hits) to process before early termination. Default is `0`. |
| `timeout` | `string` | The maximum amount of time to wait for query execution. Default is `1m`. |
| `track_scores` | `bool` | Whether to return document scores. Default is `false`. |
| `track_total_hits` | [`TrackHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L309) | Whether to include total hits metadata. |
| `typed_keys` | `bool` | Whether to include type information in aggregation and suggestion keys. Default is `true`. |
| `verbose_pipeline` | `bool` | Whether to enable verbose mode for the search pipeline. |
| `version` | `bool` | Whether to return the document version in the response. |
| `request_body` | [`SearchRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L176) | The main search request payload, including the query and filters. |

### SearchRequestBody fields

The `SearchRequestBody` message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `collapse` | [`FieldCollapse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L906) | Groups the results by a field. Returns only the top document per group. |
| `explain` | `bool` | Returns scoring explanations for matched documents. |
| `ext` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L76) | Plugin-specific metadata, for example, for extensions like RAG. |
| `from` | `int32` | The starting index for paginated results. Default is `0`. |
| `highlight` | [`Highlight`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L516) | Highlights matched terms in the result snippets. |
| `track_total_hits` | [`TrackHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L309) | Whether to return the total hit count. |
| `indices_boost` | `repeated` [`NumberMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L747) | Per-index boost multipliers in the `<index>: <boost>` format. |
| `docvalue_fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L893) | The fields returned using doc values. Optionally, this field can be formatted for readability. |
| `min_score` | `float` | The minimum score required in order for a document to be included in the results. |
| `post_filter` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L341) | Filters hits after aggregations are applied. |
| `profile` | `bool` | Enables profiling to analyze query performance. |
| `search_pipeline` | `string` | The name of the search pipeline to apply. |
| `verbose_pipeline` | `bool` | Enables verbose logging in the search pipeline. |
| `query` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L341) | The query domain-specific language (DSL) for the search. |
| `rescore` | `repeated` [`Rescore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L631)   | Reranks the top N hits to improve precision. |
| `script_fields` | `map<string, `[`ScriptField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L511)`>`  | Custom fields whose values are computed by scripts. |
| `search_after` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1971) | Cursor-based pagination using values from the previous page. |
| `size` | `int32` | The number of results to return. Default is `10`. |
| `slice` | [`SlicedScroll`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L641) | Splits scroll context into slices for parallel processing. |
| `sort` | `repeated` [`SortCombinations`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L745)   | The sorting rules (for example, by field, score, or custom order). |
| `source` | [`SourceConfig`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L176) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L893) | Additional fields to return, with formatting options. |
| `suggest` | [`Suggester`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L654) | Suggestion queries for autocomplete or corrections. |
| `terminate_after` | `int32` | The maximum number of matching documents (hits) to process before early termination. Default is `0`. |
| `timeout` | `string` | The maximum amount of time to wait for query execution. |
| `track_scores` | `bool` | Whether to return document scores in the results. |
| `include_named_queries_score` | `bool` | Whether to include scores for named queries. |
| `version` | `bool` | Whether to include the document version in the response. |
| `seq_no_primary_term` | `bool` | Whether to include the sequence number and primary term for each hit. |
| `stored_fields` | `repeated string` | The stored fields to return (excludes `_source` unless re-enabled). |
| `pit` | [`PointInTimeReference`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L752) | The Point in Time reference used to search a fixed snapshot. |
| `stats` | `repeated string` | The tagging or logging fields to associate with the request. |
| `derived` | `map<string, `[`DerivedField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L292)`>` | Dynamically computed fields returned in the response. |

### DerivedField fields

The [`DerivedField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L292) message is used for dynamically computed fields that are calculated during search execution. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `name` | `string` | The name of the derived field. Required. |
| `type` | `string` | The data type of the derived field. Required. |
| `script` | [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L27) | The script that computes the field value. Required. |
| `prefilter_field` | `string` | The field to use for prefiltering to optimize script execution. Optional. |
| `properties` | `map<string, `[`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L76)`>` | Additional properties for the derived field. Optional. |
| `ignore_malformed` | `bool` | Whether to ignore malformed values during field computation. Optional. |
| `format` | `string` | The format to apply to the field value (for example, date formatting). Optional. |

### QueryContainer fields

`QueryContainer` is the entry point for all supported query types.

**Exactly one** of the following fields must be provided in each `QueryContainer` message.

Note that some query types are currently unsupported. See [Supported queries](#supported-queries) for the current list of implemented query types.
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `bool` | [`BoolQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1324) | A Boolean query that combines multiple clauses using `AND`/`OR`/`NOT` logic. Must be the only field set. |
| `boosting` | [`BoostingQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1360) | Boosts the results matching a positive query and demotes the results matching a negative query. Must be the only field set. |
| `constant_score` | [`ConstantScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1377) | Wraps a filter and assigns a constant relevance score to all matching documents. Must be the only field set. |
| `dis_max` | [`DisMaxQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1389) | Returns documents matching any clause. Uses the highest score if multiple clauses match. Must be the only field set. |
| `function_score` | [`FunctionScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1405) | Adjusts the scores of results using custom functions. Must be the only field set. |
| `exists` | [`ExistsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1022) | Matches documents that contain a specific field. Must be the only field set. |
| `fuzzy` | [`FuzzyQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2000) | Matches terms similar to the search term (fuzzy matching). Must be the only field set. |
| `ids` | [`IdsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2083) | Matches documents by `_id` values. Must be the only field set. |
| `prefix` | [`PrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1592) | Matches terms with a specific prefix. Must be the only field set. |
| `range` | [`RangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1860) | Matches terms within a specified range. Must be the only field set. |
| `regexp` | [`RegexpQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1870) | Matches terms using regular expressions. Must be the only field set. |
| `term` | [`TermQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1732) | Matches exact terms (no analysis). Must be the only field set. |
| `terms` | [`TermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L462) | Matches any document containing one or more specified terms in a field. Must be the only field set. |
| `terms_set` | [`TermsSetQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1708) | Matches documents containing a minimum number of exact terms in a field. Must be the only field set. |
| `wildcard` | [`WildcardQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1083) | Matches terms using a wildcard pattern. Must be the only field set. |
| `match` | [`MatchQueryTypeless`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1198) | Full-text match on text or exact-value fields. Must be the only field set. |
| `match_bool_prefix` | [`MatchBoolPrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2150) | Matches full words and prefixes in a Boolean-style query. Must be the only field set. |
| `match_phrase` | [`MatchPhraseQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2279) | Matches an exact phrase in order. Must be the only field set. |
| `match_phrase_prefix` | [`MatchPhrasePrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2246)    | Matches a phrase in which the last term is treated as a prefix. Must be the only field set. |
| `multi_match` | [`MultiMatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2309) | Searches multiple fields using a single query string. Must be the only field set. |
| `query_string` | [`QueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1753) | Parses advanced queries written as a single string. Must be the only field set. |
| `simple_query_string` | [`SimpleQueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1039) | A less strict syntax alternative to `query_string`. Ignores invalid syntax. Must be the only field set. |
| `intervals` | [`IntervalsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1495) | Matches terms based on position/proximity. Must be the only field set. |
| `knn` | [`KnnQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1126) | A k-NN query across vector fields. Must be the only field set. |
| `match_all` | [`MatchAllQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2142) | Matches all documents in the index. Must be the only field set. |
| `match_none` | [`MatchNoneQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L2228) | Matches no documents. Must be the only field set. |
| `script_score` | [`ScriptScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1005) | Applies custom scoring using scripts. Must be the only field set. |
| `nested` | [`NestedQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L499) | Wraps a query targeting nested fields. Must be the only field set. |

## Supported queries

The gRPC Search API supports the following queries.

All of the following examples show valid request payloads that can be sent to the `SearchService/Search` gRPC method.

### Match all query

A `match_all` query returns all documents in the index. For example, the following request returns a maximum of 50 documents from the index:

```json
{
  "request_body": {
    "query": {
      "match_all": {}
    },
    "size": 50
  }
}
```
{% include copy.html %}

### Term query

A `term` query matches a single field with a specific term. For example, the following query searches for titles containing the word `Rush`:

```json
{
  "index": "my_index",
  "request_body": {
    "query": {
      "term": {
        "field": "title",
        "value": {
          "string_value": "Rush"
        },
        "case_insensitive": true
      }
    }
  }
}
```
{% include copy.html %}

### Terms query

A `terms` query matches documents in which a specific field contains any value from a list. For example, the following query searches for lines with the IDs `61809` and `61810`:

```json
{
 "request_body": {
   "query": {
     "terms": {
       "terms_lookup_field_string_array_map": {
         "line_id": {
           "string_array": {
             "string_array": ["61809", "61810"]
           }
         }
       }
     }
   }
 }
}
```
{% include copy.html %}

### Terms query with a terms lookup

A `terms` query with a `terms` lookup is a specialized form of the `terms` query that allows you to fetch the terms for filtering from another document in your cluster rather than specifying them directly in the query. For example, the following request matches documents in the `students` index with every student whose `id` matches one of the values in the `enrolled` array:

```json
{
  "request_body": {
    "query": {
      "terms": {
        "boost": 1.0,
        "terms_lookup_field_string_array_map": {
          "student_id": {
            "terms_lookup_field": {
              "index": "classes",
              "id": "101",
              "path": "enrolled"
            }
          }
        }
      }
    }
  }
}
```
{% include copy.html %}


### Match none query

A `match_none` query matches none of the documents:

```json
{
  "request_body": {
    "query": {
      "match_none": {}
    }
  }
}
```
{% include copy.html %}

## Response fields

The gRPC Search API provides the following response fields.

### SearchResponse fields

The following table lists the supported fields for the [`SearchResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L317) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `response` | `oneof` | Contains one of the following response types: `response_body` (success), `error_4xx_response_body` (4xx error), or `error_5xx_response` (5xx error). |
| `response_body` | [`ResponseBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L329) | The actual payload of the search response (success case). |
| `error_4xx_response_body` | [`Error4xxResponseBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L309) | The 4xx error response body. |
| `error_5xx_response` | [`Error5xxResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L317) | The 5xx error response. |

### ResponseBody fields

The `ResponseBody` contains the following fields.

The source documents are returned as bytes. Use Base64 decoding to read the `_source` field in the gRPC response.
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `took` | `int64` | The amount of time taken to process the search request, in milliseconds. |
| `timed_out` | `bool` | Whether the search timed out. |
| `shards` | [`ShardStatistics`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L268) | The shard-level success/failure/total metadata. |
| `phase_took` | [`PhaseTook`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L394)   | The phase-level `took` time values in the response. |
| `hits` | [`HitsMetadata`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L411)    | The main document results and metadata. |
| `profile` | [`Profile`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L594) | Profiling data for query execution (debugging/performance insights). |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L76)    | The top-level key-value field structure from the response (if any). |
| `num_reduce_phases` | `int32` | The number of times that the coordinating node aggregates results from batches of shard responses. |
| `clusters` | [`ClusterStatistics`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L532) | Information about the search on each cluster when searching remote clusters. |
| `max_score` | `float` | The highest returned document score. Optional. |
| `pit_id` | `string` | The Point in Time ID. |
| `scroll_id` | `string` | The identifier for the search and its search context. |
| `terminated_early` | `bool` | Whether the query was terminated early. |

### HitsMetadata fields

The `HitsMetadata` object contains information about the search results, including the total number of matching documents and an array of individual document matches. It includes the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `total` | [`HitsMetadataTotal`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L412)  | Metadata about the total number of matching documents (value \+ relation). |
| `max_score` | [`HitsMetadataMaxScore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L424)   | The highest relevance score of the returned hits (may be `null`). |
| `hits` | `repeated` [`Hit`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L460) | The actual list of matched documents. Each hit includes core fields like `index`, `id`, `score`, and `source`, along with additional optional fields. |

### Hit fields

Each `Hit` represents a single document matched by the query and contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `type` | `string` | The document type. |
| `index` | `string` | The name of the index containing the returned document. |
| `id` | `string` | The unique ID for the document within the index. |
| `score` | [`HitUnderscoreScore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L455) | The relevance score of the hit. |
| `explanation` | [`Explanation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L944) | A text explanation of how the `_score` was calculated. |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L76) | The document field values. |
| `highlight` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L165)`>` | The highlighted fields and fragments per hit. |
| `inner_hits` | `map<string, `[`InnerHitsResult`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L448)`>` | The matching nested documents from a different scope that contributed to the overall query result. |
| `matched_queries` | `repeated string` | A list of query names matching the document. |
| `nested` | [`NestedIdentity`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/search.proto#L962) | The path to the inner nested object from which the hit originated. |
| `ignored` | `repeated string` | A list of ignored fields. |
| `ignored_field_values` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L165)`>` | Raw, unprocessed values from the document's original JSON. |
| `shard` | `string` | The shard ID from which the hit was retrieved. |
| `node` | `string` | The node ID from which the hit was retrieved. |
| `routing` | `string` | The routing value used for custom shard routing. |
| `source` | `bytes` | The Base64-encoded `_source` document. |
| `seq_no` | `int64` | The sequence number (used for indexing history and versioning). |
| `primary_term` | `int64` | The primary term number (used for optimistic concurrency control). |
| `version` | `int64` | The document version number. |
| `sort` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L1971)  | The sort values used for result sorting. |
| `meta_fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.6.0/protos/schemas/common.proto#L76) | The metadata values for the document. |

`source` is Base64 encoded and must be decoded to obtain the JSON document.
{: .note}

## Example response

```json
{
  "response_body": {
    "took": 64,
    "timed_out": false,
    "shards": {
      "successful": 1,
      "total": 1
    },
    "hits": {
      "total": {
        "total_hits": {
          "relation": "TOTAL_HITS_RELATION_EQ",
          "value": 1
        }
      },
      "hits": [
        {
          "index": "my_index",
          "id": "3",
          "score": {
            "float_value": 1.0
          },
          "source": "eyAidGl0bGUiOiAiUnVzaCIsICJ5ZWFyIjogMjAxM30=",
          "meta_fields": {}
        }
      ],
      "max_score": {
        "float_value": 1.0
      }
    }
  }
}
```
{% include copy.html %}

## Java gRPC client example

The following example shows a Java client-side program that submits an example search term query gRPC request and then prints the number of hits returned in the search response:

```java
import org.opensearch.protobufs.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class SearchClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9400)
            .usePlaintext()
            .build();

        SearchServiceGrpc.SearchServiceBlockingStub stub = SearchServiceGrpc.newBlockingStub(channel);

        // Create a term query
        TermQuery termQuery = TermQuery.newBuilder()
            .setField("director")
            .setValue(FieldValue.newBuilder().setStringValue("Nolan").build())
            .build();

        // Create query container
        QueryContainer queryContainer = QueryContainer.newBuilder()
            .setTerm(termQuery)
            .build();

        // Create search request body
        SearchRequestBody requestBody = SearchRequestBody.newBuilder()
            .setQuery(queryContainer)
            .setSize(5)
            .build();

        // Create search request
        SearchRequest request = SearchRequest.newBuilder()
            .addIndex("movies")
            .setRequestBody(requestBody)
            .build();

        SearchResponse response = stub.search(request);

        // Handle the response
        if (response.hasResponseBody()) {
            ResponseBody responseBody = response.getResponseBody();
            HitsMetadata hits = responseBody.getHits();
            System.out.println("Found hits: " + hits.getTotal().getTotalHits().getValue());
        } else if (response.hasError4XxResponse()) {
            System.out.println("4xx Error: " + response.getError4XxResponse().getError());
        } else if (response.hasError5XxResponse()) {
            System.out.println("5xx Error: " + response.getError5XxResponse().getMessage());
        }

        channel.shutdown();
    }
}
```
{% include copy.html %}
