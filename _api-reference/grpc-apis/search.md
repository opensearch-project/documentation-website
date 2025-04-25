---
layout: default
title: Search gRPC
parent: GRPC APIs
nav_order: 20
---

# Search (gRPC)
**Introduced 3.0**
{: .label .label-purple }


This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).    
{: .warning}

The gRPC Search API provides a performant, binary interface to run [queries]({{site.url}}{{site.baseurl}}/api-reference/search/) using protocol buffers over gRPC. It mirrors the capabilities of the HTTP Search API while benefiting from protobuf-typed contracts and gRPC transport. The gRPC APis are ideal for low-latency, high-throughput applications.

## Client protobufs
In order for users to submit GRPC requests, a set of protobufs are required on the client-side. These can be obtained by one of the following ways.
1. Download the raw protobufs from the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs). Client-side code can then be generated using the protocol buffer compiler for these [supported languages](https://grpc.io/docs/languages/). 
1. For Java clients specifically, download the `opensearch-protobufs` jar from the [Central Maven repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0). 

## GRPC service and method
[`SearchService`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/search_service.proto#L22) is where all the GRPC Search APIs reside.

Search requests can be submitted by invoking the GRPC method `Search` within the `SearchService`. The method takes in a [`SearchRequest`](#searchrequest-fields) and returns a [`SearchResponse`](#searchresponse-fields).

### 

Currently, only basic queries (`match_all`, `term`, `terms`, `match_none`) are supported. Additional query types will be supported in future releases.  
{: .note}

## Request fields 

The gRPC Search API supports the following request fields.
### SearchRequest fields 

The [`SearchRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L18) message accepts the following fields. All fields are optional. 

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | repeated string | A list of indices to search. Defaults to all indices if not provided. Optional. |
| `source` | [SourceConfigParam](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L154) | Whether to include the `_source` field in the response. Optional. |
| `source_excludes` | repeated string | Fields to exclude from `_source`. Ignored if `source` is false. Optional. |
| `source_includes` | repeated string | Fields to include in `_source`. Ignored if `source` is false. Optional. |
| `allow_no_indices` | bool | Whether to ignore wildcards that match no indices. Default is true. Optional. |
| `allow_partial_search_results` | bool | Return partial results on error or timeout. Default is true. Optional. |
| `analyze_wildcard` | bool | Analyze wildcard/prefix queries. Default is false. Optional. |
| `analyzer` | string | Analyzer to use with the `q` query string. Optional. |
| `batched_reduce_size` | int32 | Number of shards to reduce on a node. Default is 512. Optional. |
| `cancel_after_time_interval` | string | Time after which the request will be canceled. Default is -1. Optional. |
| `ccs_minimize_roundtrips` | bool | Minimize round-trips between node and remote clusters. Default is true. Optional. |
| `default_operator` | [Operator](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L43) | Default operator for query strings (`AND` or `OR`). Default is `OR`. Optional. |
| `df` | string | Default field for query strings without field prefixes. Optional. |
| `docvalue_fields` | repeated string | Fields to return as doc values. Optional. |
| `expand_wildcards` | repeated [ExpandWildcard](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L56) | Types of indices that wildcard patterns match. Default is `open`. Optional. |
| `explain` | bool | Return document score computation details. Default is false. Optional. |
| `from` | int32 | Starting index for paginated results. Default is 0. Optional. |
| `ignore_throttled` | bool | Ignore frozen indices when resolving aliases. Default is true. Optional. |
| `ignore_unavailable` | bool | Ignore unavailable indices or shards. Default is false. Optional. |
| `include_named_queries_score` | bool | Include scores for named queries. Default is false. Optional. |
| `lenient` | bool | Accept format errors in queries. Default is false. Optional. |
| `max_concurrent_shard_requests` | int32 | Number of concurrent shard requests per node. Default is 5. Optional. |
| `phase_took` | bool | Return phase-level took values. Default is false. Optional. |
| `pre_filter_shard_size` | int32 | Threshold to trigger prefiltering by shard size. Default is 128. Optional. |
| `preference` | string | Shard or node preferences for query execution. Optional. |
| `q` | string | Query string in Lucene syntax. Optional. |
| `request_cache` | bool | Use request cache. Defaults to index settings. Optional. |
| `rest_total_hits_as_int` | bool | Return total hits as integer. Default is false. Optional. |
| `routing` | repeated string | Routing values to direct requests to specific shards. Optional. |
| `scroll` | string | Duration to keep the search context alive for scrolling. Optional. |
| `search_pipeline` | string | Name of the search pipeline to use. Optional. |
| `search_type` | [SearchType](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L109) | Method for calculating relevance scores. Default is `QUERY_THEN_FETCH`. Optional. |
| `seq_no_primary_term` | bool | Return sequence number and primary term. Optional. |
| `size` | int32 | Number of results to return. Optional. |
| `sort` | repeated [SortOrder](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L122) | Fields and directions to sort results by. Optional. |
| `stats` | repeated string | Tags to associate with the request for logging. Optional. |
| `stored_fields` | repeated string | List of stored fields to include in the response. Optional. |
| `suggest_field` | string | Field to base suggestions on. Optional. |
| `suggest_mode` | [SuggestMode](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L145) | Suggestion mode (e.g., `always`, `missing`, `popular`). Optional. |
| `suggest_size` | int32 | Number of suggestions to return. Optional. |
| `suggest_text` | string | Input text for generating suggestions. Optional. |
| `terminate_after` | int32 | Max docs to process before early termination. Default is 0. Optional. |
| `timeout` | string | Max time to wait for query execution. Default is 1m. Optional. |
| `track_scores` | bool | Whether to return document scores. Default is false. Optional. |
| `track_total_hits` | [TrackHits](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L309) | Whether to include total hits metadata. Optional. |
| `typed_keys` | bool | Include type info in aggregation and suggestion keys. Default is true. Optional. |
| `verbose_pipeline` | bool | Enable verbose mode for the search pipeline. Optional. |
| `version` | bool | Return document version in the response. Optional. |
| `request_body` | [SearchRequestBody](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L176) | The main search request payload, including query and filters. Optional. |
 
### SearchRequestBody fields

The `SearchRequestBody` message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `collapse` | [FieldCollapse](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L975) | Groups results by a field; returns only the top document per group. Optional. |
| `explain` | bool | Returns scoring explanations for matched documents. Optional. |
| `ext` | [ObjectMap](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | Plugin-specific metadata, e.g., for extensions like RAG. Optional. |
| `from` | int32 | Starting index for results. Default is 0. Optional. |
| `highlight` | [Highlight](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L585) | Highlights matched terms in the result snippets. Optional. |
| `track_total_hits` | [TrackHits](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L309) | Whether to return total hit count. Optional. |
| `indices_boost` | repeated [NumberMap](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L747) | Per-index boost multipliers. Format: `<index>: <boost>`. Optional. |
| `docvalue_fields` | repeated [FieldAndFormat](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L962) | Fields returned using doc values, optionally formatted. Optional. |
| `min_score` | float | Minimum score required for a document to be included in results. Optional. |
| `post_filter` | [QueryContainer](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L342) | Filters hits after aggregations are applied. Optional. |
| `profile` | bool | Enables profiling to analyze query performance. Optional. |
| `search_pipeline` | string | Name of search pipeline to apply. Optional. |
| `verbose_pipeline` | bool | Enables verbose logging in the search pipeline. Optional. |
| `query` | [QueryContainer](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L342) | The query DSL for the search. Optional. |
| `rescore` | repeated [Rescore](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L631) | Re-ranks top N hits to improve precision. Optional. |
| `script_fields` | map<string, [ScriptField](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L580)> | Custom fields whose values are computed by scripts. Optional. |
| `search_after` | repeated [FieldValue](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2002) | Cursor-based pagination using values from previous page. Optional. |
| `size` | int32 | Number of results to return. Default is 10. Optional. |
| `slice` | [SlicedScroll](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L641) | Split scroll context into slices for parallel processing. Optional. |
| `sort` | repeated [SortCombinations](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L814) | Sorting rules (e.g., by field, score, or custom order). Optional. |
| `source` | [SourceConfig](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L176) | Controls inclusion and filtering of `_source` field. Optional. |
| `fields` | repeated [FieldAndFormat](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L962) | Additional fields to return with formatting options. Optional. |
| `suggest` | [Suggester](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L654) | Suggestion queries for autocomplete or corrections. Optional. |
| `terminate_after` | int32 | Max docs to collect before terminating search early. Default is 0. Optional. |
| `timeout` | string | Time limit for query execution before it times out. Optional. |
| `track_scores` | bool | Whether to return document scores in results. Optional. |
| `include_named_queries_score` | bool | Whether to include scores for named queries. Optional. |
| `version` | bool | Includes document version in the response. Optional. |
| `seq_no_primary_term` | bool | Includes sequence number and primary term for each hit. Optional. |
| `stored_fields` | repeated string | Stored fields to return (excludes `_source` unless re-enabled). Optional. |
| `pit` | [PointInTimeReference](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L752) | Point in Time reference to search a fixed snapshot. Optional. |
| `stats` | repeated string | Tagging or logging fields to associate with the request. Optional. |
| `derived` | map<string, [DerivedField](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L292)> | Dynamically computed fields returned in the response. Optional. |


### `QueryContainer` fields
The entrypoint for all supported query types is `QueryContainer`. 

**Exactly one** of the below fields must be provided inside each `QueryContainer` message. 

Note that some query types are currently unsupported. Only `match_all`, `term`, `terms`, and `match_none` are currently supported in the experimental 3.0.0 release.

| Field | Protobuf type | Description |
| :---- | :------------- | :---------- |
| `bool` | [BoolQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1290) | A Boolean query that combines multiple clauses using AND/OR/NOT logic. Must be the only field set. Optional. |
| `boosting` | [BoostingQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1322) | Boosts results matching a positive query, and demotes results matching a negative query. Must be the only field set. Optional. |
| `constant_score` | [ConstantScoreQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1338) | Wraps a filter and assigns a constant relevance score to all matching documents. Must be the only field set. Optional. |
| `dis_max` | [DisMaxQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1349) | Returns documents matching any clause; uses the highest score if multiple clauses match. Must be the only field set. Optional. |
| `function_score` | [FunctionScoreQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1364) | Adjusts scores of results using custom functions. Must be the only field set. Optional. |
| `exists` | [ExistsQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1007) | Matches documents that contain a specific field. Must be the only field set. Optional. |
| `fuzzy` | map<string, [FuzzyQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1929)> | Matches terms similar to the search term (fuzzy matching). Only one entry allowed. Must be the only field set. Optional. |
| `ids` | [IdsQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2011) | Matches documents by `_id` values. Must be the only field set. Optional. |
| `prefix` | map<string, [PrefixQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1547)> | Matches terms with a specific prefix. Only one entry allowed. Must be the only field set. Optional. |
| `range` | map<string, [RangeQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1797)> | Matches terms within a specified range. Only one entry allowed. Must be the only field set. Optional. |
| `regexp` | map<string, [RegexpQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1804)> | Matches terms using regular expressions. Only one entry allowed. Must be the only field set. Optional. |
| `term` | map<string, [TermQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1670)> | Matches exact terms (no analysis). Only one entry allowed. Must be the only field set. Optional. |
| `terms` | [TermsQueryField](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1607) | Matches any document containing one or more specified terms in a field. Must be the only field set. Optional. |
| `terms_set` | map<string, [TermsSetQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1647)> | Matches documents with a minimum number of exact terms in a field. Only one entry allowed. Must be the only field set. Optional. |
| `wildcard` | map<string, [WildcardQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1071)> | Matches terms using a wildcard pattern. Only one entry allowed. Must be the only field set. Optional. |
| `match` | map<string, [MatchQueryTypeless](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1163)> | Full-text match on text or exact-value fields. Only one entry allowed. Must be the only field set. Optional. |
| `match_bool_prefix` | map<string, [MatchBoolPrefixQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2079)> | Matches full words and prefixes in a Boolean-style query. Only one entry allowed. Must be the only field set. Optional. |
| `match_phrase` | map<string, [MatchPhraseQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2206)> | Matches an exact phrase in order. Only one entry allowed. Must be the only field set. Optional. |
| `match_phrase_prefix` | map<string, [MatchPhrasePrefixQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2171)> | Matches a phrase where the last term is treated as a prefix. Only one entry allowed. Must be the only field set. Optional. |
| `multi_match` | [MultiMatchQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2236) | Searches multiple fields with a single query string. Must be the only field set. Optional. |
| `query_string` | [QueryStringQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1690) | Parses advanced queries from a single string. Must be the only field set. Optional. |
| `simple_query_string` | [SimpleQueryStringQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1690) | Less strict syntax alternative to `query_string`. Ignores invalid syntax. Must be the only field set. Optional. |
| `intervals` | map<string, [IntervalsQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1453)> | Matches terms based on position/proximity. Only one entry allowed. Must be the only field set. Optional. |
| `knn` | map<string, [KnnField](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L1126)> | k-Nearest Neighbors query across vector fields. Only one entry allowed. Must be the only field set. Optional. |
| `match_all` | [MatchAllQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2068) | Matches all documents in the index. Must be the only field set. Optional. |
| `match_none` | [MatchNoneQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2156) | Matches no documents. Must be the only field set. Optional. |
| `script_score` | [ScriptScoreQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L991) | Custom scoring using scripts. Must be the only field set. Optional. |
| `nested` | [NestedQuery](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L499) | Wraps a query targeting nested fields. Must be the only field set. Optional. |

## Supported queries 

The gRPC Search API supports the following queries.

All examples below show valid request payloads that can be sent to the `SearchService/Search` GRPC method.

### Match all query 

Returns all documents from the index. For example, the following request returns a maximum of 50 documents from the index:

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

Matches a single field with a specific term:

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

Matches documents in which a specific field contains any value from a list. 

For example, the following query searches for lines with the IDs 61809 and 61810:

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

### Terms query with terms lookup

Matches documents in the `students` index for every student whose `id` matches one of the values in the `enrolled` array:

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


### Match none

Matches none of the documents:

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
| `response_body` | [ResponseBody](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L351) | The actual payload of the search response. |

### ResponseBody fields  

The source documents are returned as bytes. Use Base64 decoding to read the `_source` field in the gRPC response. 
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `took` | int64 | Time taken to execute the search (in ms). |
| `timed_out` | bool | Whether the search timed out. |
| `shards` | [ShardStatistics](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L268) | Shard-level success/failure/total metadata. |
| `phase_took` | [PhaseTook](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L394) | Phase-level took time values in the response. |
| `hits` | [HitsMetadata](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L411) | Main document results and metadata. |
| `profile` | [Profile](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L594) | Profiling data for query execution (debugging/perf insights). |
| `fields` | [ObjectMap](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | Top-level key-value field structure from the response (if any). |

### HitsMetadata fields

Each `Hit` represents a single document matched by the query.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `total` | [TotalHits](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L437) | Metadata about the total number of matching documents (value \+ relation). |
| `max_score` | [MaxScore](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L424) | The highest relevance score of returned hits (may be null). |
| `hits` | repeated [Hit](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L460) | The actual list of matched documents. Each hit includes index, ID, score, and source. |

### Hit fields
The following table lists the supported fields for the `Hit` message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | string | Name of the index containing the returned document. |
| `id` | string | Unique ID for the document (within the index). |
| `score` | [Score](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L469) | Relevance score of the hit. |
| `explanation` | [Explanation](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L951) | Text explanation of how the _score was calculated. |
| `fields` | [ObjectMap](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | Field values of the document. |
| `highlight` | map<string, [StringArray](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L165)> | Highlighted fields and fragments per hit. |
| `inner_hits` | map<string, [InnerHitsResult](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L453)> | Nested hits responsible for the match in another scope. |
| `matched_queries` | repeated string | List of query names that matched for this document. |
| `nested` | [NestedIdentity](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L962) | Path to the inner nested object from which this hit originated. |
| `ignored` | repeated string | List of ignored fields. |
| `ignored_field_values` | map<string, [StringArray](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L165)> | Raw, unprocessed values from the document's original JSON. |
| `shard` | string | Shard ID from which this hit was retrieved. |
| `node` | string | Node ID from which this hit was retrieved. |
| `routing` | string | Routing value used for custom shard routing. |
| `source` | bytes | Base64-encoded _source document. |
| `seq_no` | int64 | Sequence number (used for indexing history/versioning). |
| `primary_term` | int64 | Primary term number (used for optimistic concurrency control). |
| `version` | int64 | Document version number. |
| `sort` | repeated [FieldValue](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L2002) | Sort values used in the result sorting. |
| `meta_fields` | [ObjectMap](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/common.proto#L76) | Metadata values for the document. |

`source` is base64-encoded and must be decoded to obtain the JSON document.
{: .note}

### Example response
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
The following example shows a Java client that submits a sample Search term query GRPC request, then prints the number of hits returned in the search response. 

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
