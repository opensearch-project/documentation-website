---
layout: default
title: Search (gRPC)
parent: gRPC APIs
nav_order: 20
---

# Search (gRPC)
**Introduced 3.0**
{: .label .label-purple }


This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).    
{: .warning}

The gRPC Search API provides a performant, binary interface for running [queries]({{site.url}}{{site.baseurl}}/api-reference/search/) using protocol buffers over gRPC. It mirrors the capabilities of the HTTP Search API while benefiting from protobuf-typed contracts and gRPC transport. The gRPC APIs are ideal for low-latency, high-throughput applications.

## Prerequisite

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#using-grpc-apis).

## gRPC service and method

gRPC Document APIs reside in the [`SearchService`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/search_service.proto#L22).

You can submit search requests by invoking the [`Search`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/document_service.proto#L23) gRPC method within the `SearchService`. The method takes in a [`SearchRequest`](#searchrequest-fields) and returns a [`SearchResponse`](#searchresponse-fields).

Currently, only the following basic queries are supported: [`match_all`](#match-all-query), [`term`](#term-query), 
[`terms`](#terms-query), and [`match_none`](#match-none-query). Additional query types will be supported in future versions.  
{: .note}

## Request fields 

The gRPC Search API supports the following request fields.

### SearchRequest fields 

The [`SearchRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L18) message accepts the following fields. All fields are optional. 

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | `repeated string` | A list of indexes to search. If not provided, defaults to all indexes. |
| `source` | [`SourceConfigParam`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L154) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `source_excludes` | `repeated string` | Fields to exclude from `_source`. Ignored if `source` is `false`. |
| `source_includes` | `repeated string` | Fields to include in `_source`. Ignored if `source` is `false`.  |
| `allow_no_indices` | `bool` | Whether to ignore wildcards that match no indexes. Default is `true`. |
| `allow_partial_search_results` | `bool` | Whether to return partial results upon an error or timeout. Default is `true`. |
| `analyze_wildcard` | `bool` | Whether to analyze wildcard/prefix queries. Default is `false`.  |
| `analyzer` | `string` | The analyzer to use with the `q` query string.  |
| `batched_reduce_size` | `int32` | The number of shards to reduce on a node. Default is `512`.  |
| `cancel_after_time_interval` | `string` | The time after which the request will be canceled. Default is `-1`. |
| `ccs_minimize_roundtrips` | `bool` | Whether to minimize round trips between the node and remote clusters. Default is `true`.  |
| `default_operator` | [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L43) | The default operator for query strings. Valid values are `AND` or `OR`. Default is `OR`.  |
| `df` | `string` | The default field for query strings without field prefixes.  |
| `docvalue_fields` | `repeated string` | The fields to return as doc values. |
| `expand_wildcards` | `repeated` [`ExpandWildcard`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L56) | Specifies the type of index that wildcard expressions can match. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.|
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
| `search_type` | [`SearchType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L109) | The method for calculating relevance scores. Valid values are `QUERY_THEN_FETCH` and `DFS_QUERY_THEN_FETCH`. Default is `QUERY_THEN_FETCH`. |
| `seq_no_primary_term` | `bool` | Whether to return the sequence number and primary term. |
| `size` | `int32` | The number of results to return. |
| `sort` | `repeated` [`SortOrder`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L122) | The fields and directions by which to sort the results. |
| `stats` | `repeated string` | The tags to associate with the request for logging. |
| `stored_fields` | `repeated string` | A list of stored fields to include in the response. |
| `suggest_field` | `string` | The field on which to base suggestions. |
| `suggest_mode` | [`SuggestMode`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L145) | The suggestion mode (for example, `always`, `missing`, `popular`). |
| `suggest_size` | `int32` | The number of suggestions to return. |
| `suggest_text` | `string` | The input text for generating suggestions. |
| `terminate_after` | `int32` | The maximum number of matching documents (hits) to process before early termination. Default is `0`. |
| `timeout` | `string` | The maximum amount of time to wait for query execution. Default is `1m`. |
| `track_scores` | `bool` | Whether to return document scores. Default is `false`. |
| `track_total_hits` | [`TrackHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L309) | Whether to include total hits metadata. |
| `typed_keys` | `bool` | Whether to include type information in aggregation and suggestion keys. Default is `true`. |
| `verbose_pipeline` | `bool` | Whether to enable verbose mode for the search pipeline. |
| `version` | `bool` | Whether to return the document version in the response. |
| `request_body` | [`SearchRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L176) | The main search request payload, including the query and filters. |
 
### SearchRequestBody fields

The `SearchRequestBody` message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `collapse` | [`FieldCollapse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L975) | Groups the results by a field. Returns only the top document per group. |
| `explain` | `bool` | Returns scoring explanations for matched documents. |
| `ext` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | Plugin-specific metadata, for example, for extensions like RAG. |
| `from` | `int32` | The starting index for paginated results. Default is `0`. |
| `highlight` | [`Highlight`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L585) | Highlights matched terms in the result snippets. |
| `track_total_hits` | [`TrackHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L309) | Whether to return the total hit count. |
| `indices_boost` | `repeated` [`NumberMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L747) | Per-index boost multipliers in the `<index>: <boost>` format. |
| `docvalue_fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L962) | The fields returned using doc values, optionally formatted. |
| `min_score` | float | The minimum score required in order for a document to be included in the results. |
| `post_filter` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L342) | Filters hits after aggregations are applied. |
| `profile` | `bool` | Enables profiling to analyze query performance. |
| `search_pipeline` | `string` | The name of the search pipeline to apply. |
| `verbose_pipeline` | `bool` | Enables verbose logging in the search pipeline. |
| `query` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L342) | The query domain-specific language (DSL) for the search. |
| `rescore` | `repeated` [`Rescore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L631) | Reranks the top N hits to improve precision. |
| `script_fields` | `map<string, `[`ScriptField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L580)`>` | Custom fields whose values are computed by scripts. |
| `search_after` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2002) | Cursor-based pagination using values from the previous page. |
| `size` | `int32` | The number of results to return. Default is `10`. |
| `slice` | [`SlicedScroll`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L641) | Split scroll context into slices for parallel processing. |
| `sort` | `repeated` [`SortCombinations`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L814) | The sorting rules (for example, by field, score, or custom order). |
| `source` | [`SourceConfig`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L176) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L962) | Additional fields to return, with formatting options. |
| `suggest` | [`Suggester`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L654) | Suggestion queries for autocomplete or corrections. |
| `terminate_after` | `int32` | The maximum number of matching documents (hits) to process before early termination. Default is `0`. |
| `timeout` | `string` | The maximum amount of time to wait for query execution. |
| `track_scores` | `bool` | Whether to return document scores in the results. |
| `include_named_queries_score` | `bool` | Whether to include scores for named queries. |
| `version` | `bool` | Whether to include the document version in the response. |
| `seq_no_primary_term` | `bool` | Whether to include the sequence number and primary term for each hit. |
| `stored_fields` | `repeated string` | The stored fields to return (excludes `_source` unless re-enabled). |
| `pit` | [`PointInTimeReference`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L752) | The Point in Time reference used to search a fixed snapshot. |
| `stats` | `repeated string` | The tagging or logging fields to associate with the request. |
| `derived` | `map<string, `[`DerivedField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L292)`>` | Dynamically computed fields returned in the response. |


### QueryContainer fields

`QueryContainer` is the entry point for all supported query types. 

**Exactly one** of the following fields must be provided in each `QueryContainer` message. 

Note that some query types are currently unsupported. Currently, only [`match_all`](#match-all-query), [`term`](#term-query), [`terms`](#terms-query), and [`match_none`](#match-none-query) are supported.  
{: .note}

| Field | Protobuf type | Description |
| :---- | :------------- | :---------- |
| `bool` | [`BoolQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1290) | A Boolean query that combines multiple clauses using `AND`/`OR`/`NOT` logic. Must be the only field set. |
| `boosting` | [`BoostingQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1322) | Boosts the results matching a positive query and demotes the results matching a negative query. Must be the only field set. |
| `constant_score` | [`ConstantScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1338) | Wraps a filter and assigns a constant relevance score to all matching documents. Must be the only field set. |
| `dis_max` | [`DisMaxQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1349) | Returns documents matching any clause. Uses the highest score if multiple clauses match. Must be the only field set. |
| `function_score` | [`FunctionScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1364) | Adjusts the scores of results using custom functions. Must be the only field set. |
| `exists` | [`ExistsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1007) | Matches documents that contain a specific field. Must be the only field set. |
| `fuzzy` | `map<string, `[`FuzzyQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1929)`>` | Matches terms similar to the search term (fuzzy matching). Only one entry is allowed. Must be the only field set. |
| `ids` | [`IdsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2011) | Matches documents by `_id` values. Must be the only field set. |
| `prefix` | `map<string, `[`PrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1547)`>` | Matches terms with a specific prefix. Only one entry is allowed. Must be the only field set. |
| `range` | `map<string, `[`RangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1797)`>` | Matches terms within a specified range. Only one entry is allowed. Must be the only field set. |
| `regexp` | `map<string, `[`RegexpQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1804)`>` | Matches terms using regular expressions. Only one entry is allowed. Must be the only field set. |
| `term` | `map<string, `[`TermQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1670)`>` | Matches exact terms (no analysis). Only one entry is allowed. Must be the only field set. |
| `terms` | [`TermsQueryField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1607) | Matches any document containing one or more specified terms in a field. Must be the only field set. |
| `terms_set` | `map<string, `[`TermsSetQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1647)`>` | Matches documents containing a minimum number of exact terms in a field. Only one entry is allowed. Must be the only field set. |
| `wildcard` | `map<string, `[`WildcardQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1071)`>` | Matches terms using a wildcard pattern. Only one entry is allowed. Must be the only field set. |
| `match` | `map<string, `[`MatchQueryTypeless`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1163)`>` | Full-text match on text or exact-value fields. Only one entry is allowed. Must be the only field set. |
| `match_bool_prefix` | `map<string, `[`MatchBoolPrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2079)`>` | Matches full words and prefixes in a Boolean-style query. Only one entry is allowed. Must be the only field set. |
| `match_phrase` | `map<string, `[`MatchPhraseQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2206)`>` | Matches an exact phrase in order. Only one entry is allowed. Must be the only field set. |
| `match_phrase_prefix` | `map<string, `[`MatchPhrasePrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2171)`>` | Matches a phrase in which the last term is treated as a prefix. Only one entry is allowed. Must be the only field set. |
| `multi_match` | [`MultiMatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2236) | Searches multiple fields using a single query string. Must be the only field set. |
| `query_string` | [`QueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1690) | Parses advanced queries written as a single string. Must be the only field set. |
| `simple_query_string` | [`SimpleQueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1690) | A less strict syntax alternative to `query_string`. Ignores invalid syntax. Must be the only field set. |
| `intervals` | `map<string, `[`IntervalsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1453)`>` | Matches terms based on position/proximity. Only one entry is allowed. Must be the only field set. |
| `knn` | `map<string, `[`KnnField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1126)`>` | A k-NN query across vector fields. Only one entry is allowed. Must be the only field set. |
| `match_all` | [`MatchAllQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2068) | Matches all documents in the index. Must be the only field set. |
| `match_none` | [`MatchNoneQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2156) | Matches no documents. Must be the only field set. |
| `script_score` | [`ScriptScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L991) | Applies custom scoring using scripts. Must be the only field set. |
| `nested` | [`NestedQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L499) | Wraps a query targeting nested fields. Must be the only field set. |

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
        "title": {
          "value": {
            "string_value": "Rush"
          },
          "case_insensitive": true
        }
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
             "string_array": [
               "61809",
                    "61810"
             ]
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

The following table lists the supported fields for the [`SearchResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L317) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `response_body` | [`ResponseBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L351) | The actual payload of the search response. |

### ResponseBody fields  

The `ResponseBody` contains the following fields.

The source documents are returned as bytes. Use Base64 decoding to read the `_source` field in the gRPC response. 
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `took` | `int64` | The amount of time taken to process the search request, in milliseconds. |
| `timed_out` | `bool` | Whether the search timed out. |
| `shards` | [`ShardStatistics`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L268) | The shard-level success/failure/total metadata. |
| `phase_took` | [`PhaseTook`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L394) | The phase-level `took` time values in the response. |
| `hits` | [`HitsMetadata`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L411) | The main document results and metadata. |
| `profile` | [`Profile`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L594) | Profiling data for query execution (debugging/performance insights). |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | The top-level key-value field structure from the response (if any). |

### HitsMetadata fields

The `HitsMetadata` object contains information about the search results, including the total number of matching documents and an array of individual document matches. It includes the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `total` | [`TotalHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L437) | Metadata about the total number of matching documents (value \+ relation). |
| `max_score` | [`MaxScore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L424) | The highest relevance score of the returned hits (may be `null`). |
| `hits` | `repeated` [`Hit`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L460) | The actual list of matched documents. Each hit includes core fields like `index`, `id`, `score`, and `source`, along with additional optional fields. |

### Hit fields

Each `Hit` represents a single document matched by the query and contains the following fields. 

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | `string` | The name of the index containing the returned document. |
| `id` | `string` | The unique ID for the document within the index. |
| `score` | [`Score`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L469) | The relevance score of the hit. |
| `explanation` | [`Explanation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L951) | A text explanation of how the `_score` was calculated. |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | The document field values. |
| `highlight` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L165)`>` | The highlighted fields and fragments per hit. |
| `inner_hits` | `map<string, `[`InnerHitsResult`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L453)`>` | The matching nested documents from a different scope that contributed to the overall query result. |
| `matched_queries` | `repeated string` | A list of query names matching the document. |
| `nested` | [`NestedIdentity`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L962) | The path to the inner nested object from which the hit originated. |
| `ignored` | `repeated string` | A list of ignored fields. |
| `ignored_field_values` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L165)`>` | Raw, unprocessed values from the document's original JSON. |
| `shard` | `string` | The shard ID from which the hit was retrieved. |
| `node` | `string` | The node ID from which the hit was retrieved. |
| `routing` | `string` | The routing value used for custom shard routing. |
| `source` | `bytes` | The Base64-encoded `_source` document. |
| `seq_no` | `int64` | The sequence number (used for indexing history and versioning). |
| `primary_term` | `int64` | The primary term number (used for optimistic concurrency control). |
| `version` | `int64` | The document version number. |
| `sort` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2002) | The sort values used for result sorting. |
| `meta_fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | The metadata values for the document. |

`source` is Base64 encoded and must be decoded to obtain the JSON document.
{: .note}

## Example response

```json
{
  "responseBody": {
    "took": "64",
    "timedOut": false,
    "shards": {
      "successful": 1,
      "total": 1
    },
    "hits": {
      "total": {
        "totalHits": {
          "relation": "TOTAL_HITS_RELATION_EQ",
          "value": "1"
        }
      },
      "hits": [
        {
          "index": "my_index",
          "id": "3",
          "score": {
            "floatValue": 1
          },
          "source": "eyAidGl0bGUiOiAiUnVzaCIsICJ5ZWFyIjogMjAxM30=",
          "metaFields": {}
        }
      ],
      "maxScore": {
        "floatValue": 1
      }
    }
  }
}
```
{% include copy.html %}

## Java gRPC client example 

The following example shows a Java client-side program that submits a sample search term query gRPC request and then prints the number of hits returned in the search response:

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

        Query query = Query.newBuilder()
            .setTerm(TermQuery.newBuilder().setField("director").setValue("Nolan"))
            .build();

        SearchRequest request = SearchRequest.newBuilder()
            .addIndex("movies")
            .setQuery(query)
            .setSize(5)
            .build();

        SearchResponse response = stub.search(request);
        System.out.println("Found hits: " + response.getHits().getTotal());
        channel.shutdown();
    }
}
```
{% include copy.html %}
