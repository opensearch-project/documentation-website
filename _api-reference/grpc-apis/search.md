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

To submit gRPC requests, you must have a set of protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).

## gRPC service and method

gRPC Document APIs reside in the [`SearchService`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/services/search_service.proto#L22).

You can submit search requests by invoking the [`Search`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/services/search_service.proto#L23) gRPC method within the `SearchService`. The method takes a [`SearchRequest`](#searchrequest-fields) and returns a [`SearchResponse`](#searchresponse-fields).

See [Supported Queries](#supported-queries) for currently supported search queries. Additional query types will be supported in future versions.
{: .note}

## Request fields

The gRPC Search API supports the following request fields.

### SearchRequest fields

The [`SearchRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L19) message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `index` | `repeated string` | A list of indexes to search. If not provided, defaults to all indexes. |
| `x_source` | [`SourceConfigParam`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L195) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `x_source_excludes` | `repeated string` | Fields to exclude from `_source`. Ignored if `source` is `false`. |
| `x_source_includes` | `repeated string` | Fields to include in `_source`. Ignored if `source` is `false`.  |
| `allow_no_indices` | `bool` | Whether to ignore wildcards that match no indexes. Default is `true`. |
| `allow_partial_search_results` | `bool` | Whether to return partial results upon an error or timeout. Default is `true`. |
| `analyze_wildcard` | `bool` | Whether to analyze wildcard/prefix queries. Default is `false`.  |
| `batched_reduce_size` | `int32` | The number of shards to reduce on a node. Default is `512`.  |
| `cancel_after_time_interval` | `string` | The time after which the request will be canceled. Default is `-1`. |
| `ccs_minimize_roundtrips` | `bool` | Whether to minimize round trips between the node and remote clusters. Default is `true`.  |
| `default_operator` | [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1159) | The default operator for query strings. Valid values are `AND` or `OR`. Default is `OR`.  |
| `df` | `string` | The default field for query strings without field prefixes.  |
| `docvalue_fields` | `repeated string` | The fields to return as doc values. |
| `expand_wildcards` | `repeated` [`ExpandWildcard`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L75) | Specifies the type of index that wildcard expressions can match. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.|
| `ignore_throttled` | `bool` | Whether to ignore frozen indexes when resolving aliases. Default is `true`. |
| `ignore_unavailable` | `bool` | Whether to ignore unavailable indexes or shards. Default is `false`. |
| `max_concurrent_shard_requests` | `int32` | The number of concurrent shard requests per node. Default is `5`. |
| `phase_took` | `bool` | Whether to return phase-level `took` values. Default is `false`. |
| `pre_filter_shard_size` | `int32` | The threshold at which to trigger prefiltering by shard size. Default is `128`. |
| `preference` | `string` | The shard or node preferences for query execution. |
| `q` | `string` | The query string in [Lucene syntax]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/#query-string-syntax). |
| `request_cache` | `bool` | Whether to use the request cache. Defaults to the index's settings. |
| `total_hits_as_int` | `bool` | Whether to return the number of total hits as an integer. Default is `false`. |
| `routing` | `repeated string` | The routing values used to direct requests to specific shards. |
| `scroll` | `string` | The amount of time to keep the search context alive for scrolling. |
| `search_type` | [`SearchType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L84) | The method for calculating relevance scores. Valid values are `QUERY_THEN_FETCH` and `DFS_QUERY_THEN_FETCH`. Default is `QUERY_THEN_FETCH`. |
| `suggest_field` | `string` | The field on which to base suggestions. |
| `suggest_mode` | [`SuggestMode`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L90) | The suggestion mode (for example, `always`, `missing`, `popular`). |
| `suggest_size` | `int32` | The number of suggestions to return. |
| `suggest_text` | `string` | The input text for generating suggestions. |
| `typed_keys` | `bool` | Whether to include type information in aggregation and suggestion keys. Default is `true`. |
| `search_request_body` | [`SearchRequestBody`](#searchrequestbody-fields) | The main search request payload, including the query and filters. |
| `global_params` | [`GlobalParams`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L15) | Global parameters for the request. Optional. |

### SearchRequestBody fields

The `SearchRequestBody` message accepts the following fields. All fields are optional.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `collapse` | [`FieldCollapse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1118) | Groups the results by a field. Returns only the top document per group. |
| `explain` | `bool` | Returns scoring explanations for matched documents. |
| `ext` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | Plugin-specific metadata, for example, for extensions like RAG. |
| `from` | `int32` | The starting index for paginated results. Default is `0`. |
| `highlight` | [`Highlight`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L787) | Highlights matched terms in the result snippets. |
| `track_total_hits` | [`TrackHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L221) | Whether to return the total hit count. |
| `indices_boost` | `map<string, float>` | Per-index boost multipliers in the `<index>: <boost>` format. |
| `docvalue_fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1108) | The fields returned using doc values. Optionally, this field can be formatted for readability. |
| `min_score` | `float` | The minimum score required in order for a document to be included in the results. |
| `post_filter` | [`QueryContainer`](#querycontainer-fields) | Filters hits after aggregations are applied. |
| `profile` | `bool` | Enables profiling to analyze query performance. |
| `search_pipeline` | `string` | The name of the search pipeline to apply. |
| `verbose_pipeline` | `bool` | Enables verbose logging in the search pipeline. |
| `query` | [`QueryContainer`](#querycontainer-fields) | The query domain-specific language (DSL) for the search. |
| `rescore` | `repeated` [`Rescore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L524)   | Reranks the top N hits to improve precision. |
| `script_fields` | `map<string, `[`ScriptField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L703)`>`  | Custom fields whose values are computed by scripts. |
| `search_after` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094) | Cursor-based pagination using values from the previous page. |
| `size` | `int32` | The number of results to return. Default is `10`. |
| `slice` | [`SlicedScroll`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L534) | Splits scroll context into slices for parallel processing. |
| `sort` | `repeated` [`SortCombinations`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L746)   | The sorting rules (for example, by field, score, or custom order). |
| `x_source` | [`SourceConfig`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L226) | Controls whether to return the full `_source`, no `_source`, or only specific fields from `_source` in the response. |
| `fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1108) | Additional fields to return, with formatting options. |
| `suggest` | [`Suggester`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L547) | Suggestion queries for autocomplete or corrections. |
| `terminate_after` | `int32` | The maximum number of matching documents (hits) to process before early termination. Default is `0`. |
| `timeout` | `string` | The maximum amount of time to wait for query execution. |
| `track_scores` | `bool` | Whether to return document scores in the results. |
| `include_named_queries_score` | `bool` | Whether to include scores for named queries. |
| `version` | `bool` | Whether to include the document version in the response. |
| `seq_no_primary_term` | `bool` | Whether to include the sequence number and primary term for each hit. |
| `stored_fields` | `repeated string` | The stored fields to return (excludes `_source` unless re-enabled). |
| `pit` | [`PointInTimeReference`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L647) | The Point in Time reference used to search a fixed snapshot. |
| `stats` | `repeated string` | The tagging or logging fields to associate with the request. |
| `derived` | `map<string, `[`DerivedField`](#derivedfield-fields)`>` | Dynamically computed fields returned in the response. |

### DerivedField fields

The [`DerivedField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L204) message is used for dynamically computed fields that are calculated during search execution. It accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `name` | `string` | The name of the derived field. Required. |
| `type` | `string` | The data type of the derived field. Required. |
| `script` | [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L37) | The script that computes the field value. Required. |
| `prefilter_field` | `string` | The field to use for prefiltering to optimize script execution. Optional. |
| `properties` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | Additional properties for the derived field. Optional. |
| `ignore_malformed` | `bool` | Whether to ignore malformed values during field computation. Optional. |
| `format` | `string` | The format to apply to the field value (for example, date formatting). Optional. |

### QueryContainer fields

`QueryContainer` is the entry point for all supported query types.

**Exactly one** of the following fields must be provided in each `QueryContainer` message.

Note that some query types are currently unsupported. See [Supported queries](#supported-queries) for the current list of implemented query types.
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `bool` | [`BoolQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1368) | A Boolean query that combines multiple clauses using `AND`/`OR`/`NOT` logic. Must be the only field set. |
| `boosting` | [`BoostingQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1404) | Boosts the results matching a positive query and demotes the results matching a negative query. Must be the only field set. |
| `constant_score` | [`ConstantScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1421) | Wraps a filter and assigns a constant relevance score to all matching documents. Must be the only field set. |
| `dis_max` | [`DisMaxQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1430) | Returns documents matching any clause. Uses the highest score if multiple clauses match. Must be the only field set. |
| `function_score` | [`FunctionScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1446) | Adjusts the scores of results using custom functions. Must be the only field set. |
| `exists` | [`ExistsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1148) | Matches documents that contain a specific field. Must be the only field set. |
| `fuzzy` | [`FuzzyQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2062) | Matches terms similar to the search term (fuzzy matching). Must be the only field set. |
| `ids` | [`IdsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2104) | Matches documents by `_id` values. Must be the only field set. |
| `prefix` | [`PrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1689) | Matches terms with a specific prefix. Must be the only field set. |
| `range` | [`RangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1920) | Matches terms within a specified range. Must be the only field set. |
| `regexp` | [`RegexpQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2036) | Matches terms using regular expressions. Must be the only field set. |
| `term` | [`TermQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1796) | Matches exact terms (no analysis). Must be the only field set. |
| `terms` | [`TermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L611) | Matches any document containing one or more specified terms in a field. Must be the only field set. |
| `terms_set` | [`TermsSetQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1775) | Matches documents containing a minimum number of exact terms in a field. Must be the only field set. |
| `wildcard` | [`WildcardQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1209) | Matches terms using a wildcard pattern. Must be the only field set. |
| `match` | `map<string, `[`MatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1324)`>` | Full-text match on text or exact-value fields. Must be the only field set. |
| `match_bool_prefix` | [`MatchBoolPrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2171) | Matches full words and prefixes in a Boolean-style query. Must be the only field set. |
| `match_phrase` | [`MatchPhraseQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2235) | Matches an exact phrase in order. Must be the only field set. |
| `match_phrase_prefix` | [`MatchPhrasePrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2216)    | Matches a phrase in which the last term is treated as a prefix. Must be the only field set. |
| `multi_match` | [`MultiMatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2252) | Searches multiple fields using a single query string. Must be the only field set. |
| `query_string` | [`QueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1817) | Parses advanced queries written as a single string. Must be the only field set. |
| `simple_query_string` | [`SimpleQueryStringQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1165) | A less strict syntax alternative to `query_string`. Ignores invalid syntax. Must be the only field set. |
| `intervals` | [`IntervalsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1531) | Matches terms based on position/proximity. Must be the only field set. |
| `knn` | [`KnnQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1267) | A k-NN query across vector fields. Must be the only field set. |
| `match_all` | [`MatchAllQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2163) | Matches all documents in the index. Must be the only field set. |
| `match_none` | [`MatchNoneQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2198) | Matches no documents. Must be the only field set. |
| `script_score` | [`ScriptScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1131) | Applies custom scoring using scripts. Must be the only field set. |
| `nested` | [`NestedQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L625) | Wraps a query targeting nested fields. Must be the only field set. |

## Supported queries

The gRPC Search API supports the following query types:
* Term-level: `exists`, `fuzzy`, `ids`, `prefix`, `range`, `regexp`, `term`, `terms`, `terms_set`, `wildcard`
* Full-text: `match`, `match_bool_prefix`, `match_phrase`, `match_phrase_prefix`, `multi_match`
* Compound queries: `bool`, `constant_score`
* Geographic: `geo_bounding_box`, `geo_distance`
* Joining queries: `nested`
* Specialized queries: `script`

For more information about these query types, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

### Term-level query fields

The following sections describe the fields for each term-level query message.

#### ExistsQuery fields

The [`ExistsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1148) message accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. The name of the field to search. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |

#### FuzzyQuery fields

The following table lists the fields for the [`FuzzyQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2062) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `value` | [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094) | Required. The term you wish to find in the provided field. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `max_expansions` | `optional int32` | The maximum number of terms to which the query can expand. Default is `50`. |
| `prefix_length` | `optional int32` | The number of leading characters that are not considered in fuzziness. Default is `0`. |
| `rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. Default is `constant_score`. |
| `transpositions` | `optional bool` | Specifies whether to allow transpositions of two adjacent characters as edits. Default is `true`. |
| `fuzziness` | `optional` [`Fuzziness`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2083) | The number of character edits needed to change one word to another. |

#### IdsQuery fields

The following table lists the fields for the [`IdsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2104) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `values` | `repeated string` | The document IDs to search for. |

#### PrefixQuery fields

The following table lists the fields for the [`PrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1689) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `value` | `string` | Required. The term to search for in the specified field. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. Default is `constant_score`. |
| `case_insensitive` | `optional bool` | Allows ASCII case-insensitive matching. Default is `false`. |

#### RangeQuery fields

The [`RangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1920) message is a `oneof` type that can contain either a [`NumberRangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1928) or a [`DateRangeQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1983).

##### NumberRangeQuery fields

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `relation` | `optional` [`RangeRelation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2029) | Indicates how the range query matches values for range fields. |
| `gt` | `optional double` | Greater than. |
| `gte` | `optional double` | Greater than or equal to. |
| `lt` | `optional double` | Less than. |
| `lte` | `optional double` | Less than or equal to. |
| `from` | `optional` [`NumberRangeQueryAllOfFrom`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1964) | The starting value for the range. |
| `to` | `optional` [`NumberRangeQueryAllOfTo`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1973) | The ending value for the range. |
| `include_lower` | `optional bool` | Include the lower bound. |
| `include_upper` | `optional bool` | Include the upper bound. |

##### DateRangeQuery fields

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `relation` | `optional` [`RangeRelation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2029) | Indicates how the range query matches values for range fields. |
| `gt` | `optional string` | Greater than. |
| `gte` | `optional string` | Greater than or equal to. |
| `lt` | `optional string` | Less than. |
| `lte` | `optional string` | Less than or equal to. |
| `from` | `optional` [`DateRangeQueryAllOfFrom`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2014) | The starting value for the range. |
| `to` | `optional` [`DateRangeQueryAllOfTo`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2021) | The ending value for the range. |
| `format` | `optional string` | The date format pattern. |
| `time_zone` | `optional string` | The time zone identifier. |
| `include_lower` | `optional bool` | Include the lower bound. |
| `include_upper` | `optional bool` | Include the upper bound. |

#### RegexpQuery fields

The following table lists the fields for the [`RegexpQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2036) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `value` | `string` | Required. Regular expression for terms you wish to find in the provided field. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `case_insensitive` | `optional bool` | Allows case-insensitive matching of the regular expression. Default is `false`. |
| `flags` | `optional string` | Enables optional operators for the regular expression. |
| `max_determinized_states` | `optional int32` | Maximum number of automaton states the query requires. Default is `10000`. |
| `rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites and scores multi-term queries. Default is `constant_score`. |

#### TermQuery fields

The following table lists the fields for the [`TermQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1796) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `value` | [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094) | Required. The term you wish to find in the provided field. Must exactly match the field value. |
| `case_insensitive` | `optional bool` | Allows ASCII case-insensitive matching. Default is `false`. |

#### TermsQuery fields

The following table lists the fields for the [`TermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L611) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `value_type` | `optional` [`TermsQueryValueType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1719) | Specifies the types of values used for filtering. Valid values are `default` and `bitmap`. Default is `default`. |
| `terms` | `map<string, `[`TermsQueryField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1725)`>` | A map of field names to terms values or terms lookup. |

#### TermsSetQuery fields

The following table lists the fields for the [`TermsSetQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1775) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `terms` | `repeated string` | Required. The array of terms to search for in the specified field. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `minimum_should_match_field` | `optional string` | The name of the numeric field that specifies the number of matching terms required. |
| `minimum_should_match_script` | `optional` [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L37) | A script that returns the number of matching terms required. |

#### WildcardQuery fields

The following table lists the fields for the [`WildcardQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1209) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `case_insensitive` | `optional bool` | Allows case-insensitive matching. Default is `false`. |
| `rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. |
| `value` | `optional string` | Wildcard pattern for terms you wish to find. Required when `wildcard` is not set. |
| `wildcard` | `optional string` | Wildcard pattern for terms you wish to find. Required when `value` is not set. |

### Full-text query fields

#### MatchQuery fields

The following table lists the fields for the [`MatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1324) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `query` | [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094) | Required. The query string to use for search. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `analyzer` | `optional string` | The analyzer used to tokenize the query string text. |
| `auto_generate_synonyms_phrase_query` | `optional bool` | Specifies whether to create a match phrase query automatically for multi-term synonyms. |
| `fuzziness` | `optional` [`Fuzziness`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2083) | The number of character edits that it takes to change one word to another. |
| `fuzzy_rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. Default is `constant_score`. |
| `fuzzy_transpositions` | `optional bool` | Adds swaps of adjacent characters to the fuzziness operations. Default is `true`. |
| `lenient` | `optional bool` | Ignores data type mismatches between the query and the document field. Default is `false`. |
| `max_expansions` | `optional int32` | The maximum number of terms to which the query can expand. Default is `50`. |
| `minimum_should_match` | `optional` [`MinimumShouldMatch`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1395) | The number of terms that need to match for the document to be considered a match. |
| `operator` | `optional` [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1159) | Whether all terms need to match (`AND`) or only one term needs to match (`OR`). Default is `OR`. |
| `prefix_length` | `optional int32` | The number of leading characters that are not considered in fuzziness. Default is `0`. |
| `zero_terms_query` | `optional` [`ZeroTermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2208) | Specifies whether to match no documents (`none`) or all documents (`all`) when the analyzer removes all terms. Default is `none`. |

#### MatchBoolPrefixQuery fields

The following table lists the fields for the [`MatchBoolPrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2171) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `query` | `string` | Required. The terms you wish to find in the provided field. The last term is used in a prefix query. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `analyzer` | `optional string` | The analyzer used to tokenize the query string text. |
| `fuzziness` | `optional` [`Fuzziness`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2083) | The number of character edits that it takes to change one word to another. |
| `fuzzy_rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. Default is `constant_score`. |
| `fuzzy_transpositions` | `optional bool` | Adds swaps of adjacent characters to the fuzziness operations. Default is `true`. |
| `max_expansions` | `optional int32` | The maximum number of terms to which the query can expand. Default is `50`. |
| `minimum_should_match` | `optional` [`MinimumShouldMatch`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1395) | The number of terms that need to match for the document to be considered a match. |
| `operator` | `optional` [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1159) | Whether all terms need to match (`AND`) or only one term needs to match (`OR`). Default is `OR`. |
| `prefix_length` | `optional int32` | The number of leading characters that are not considered in fuzziness. Default is `0`. |

#### MatchPhraseQuery fields

The following table lists the fields for the [`MatchPhraseQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2235) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `query` | `string` | Required. The query string to use for search. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `analyzer` | `optional string` | The analyzer used to tokenize the query string text. |
| `slop` | `optional int32` | The number of other words permitted between words in the query phrase. Default is `0` (exact match). |
| `zero_terms_query` | `optional` [`ZeroTermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2208) | Specifies whether to match no documents (`none`) or all documents (`all`) when the analyzer removes all terms. Default is `none`. |

#### MatchPhrasePrefixQuery fields

The following table lists the fields for the [`MatchPhrasePrefixQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2216) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `field` | `string` | Required. Specifies the field against which to run a search query. |
| `query` | `string` | Required. The query string to use for search. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `analyzer` | `optional string` | The analyzer used to tokenize the query string text. |
| `max_expansions` | `optional int32` | The maximum number of terms to which the query can expand. Default is `50`. |
| `slop` | `optional int32` | The number of other words permitted between words in the query phrase. Default is `0` (exact match). |
| `zero_terms_query` | `optional` [`ZeroTermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2208) | Specifies whether to match no documents (`none`) or all documents (`all`) when the analyzer removes all terms. Default is `none`. |

#### MultiMatchQuery fields

The following table lists the fields for the [`MultiMatchQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2252) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `query` | `string` | Required. The query string to use for search. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `analyzer` | `optional string` | The analyzer used to tokenize the query string text. |
| `auto_generate_synonyms_phrase_query` | `optional bool` | Specifies whether to create a match phrase query automatically for multi-term synonyms. Default is `true`. |
| `fields` | `repeated string` | The list of fields in which to search. |
| `fuzzy_rewrite` | `optional` [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) | Determines how OpenSearch rewrites the query. Default is `constant_score`. |
| `fuzziness` | `optional` [`Fuzziness`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2083) | The number of character edits that it takes to change one word to another. |
| `fuzzy_transpositions` | `optional bool` | Adds swaps of adjacent characters to the fuzziness operations. Default is `true`. |
| `lenient` | `optional bool` | Ignores data type mismatches between the query and the document field. Default is `false`. |
| `max_expansions` | `optional int32` | The maximum number of terms to which the query can expand. Default is `50`. |
| `minimum_should_match` | `optional` [`MinimumShouldMatch`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1395) | The number of terms that need to match for the document to be considered a match. |
| `operator` | `optional` [`Operator`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1159) | Whether all terms need to match (`AND`) or only one term needs to match (`OR`). Default is `OR`. |
| `prefix_length` | `optional int32` | The number of leading characters that are not considered in fuzziness. Default is `0`. |
| `slop` | `optional int32` | The number of other words permitted between words in the query phrase. Supported for `phrase` and `phrase_prefix` query types. |
| `tie_breaker` | `optional float` | A factor between `0` and `1.0` used to give more weight to documents matching multiple query clauses. |
| `type` | `optional` [`TextQueryType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1890) | The multi-match query type. Valid values are `best_fields`, `most_fields`, `cross_fields`, `phrase`, `phrase_prefix`, `bool_prefix`. Default is `best_fields`. |
| `zero_terms_query` | `optional` [`ZeroTermsQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2208) | Specifies whether to match no documents (`none`) or all documents (`all`) when the analyzer removes all terms. Default is `none`. |

#### MatchAllQuery fields

The following table lists the fields for the [`MatchAllQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2163) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |

#### MatchNoneQuery fields

The following table lists the fields for the [`MatchNoneQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2198) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |

### Compound query fields

#### BoolQuery fields

The following table lists the fields for the [`BoolQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1368) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `filter` | `repeated` [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | The clause (query) must appear in matching documents. The score of the query will be ignored. |
| `minimum_should_match` | `optional` [`MinimumShouldMatch`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1395) | The minimum number of `should` clauses that must match. |
| `must` | `repeated` [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | The clause (query) must appear in matching documents and will contribute to the score. |
| `must_not` | `repeated` [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | The clause (query) must not appear in matching documents. A score of `0` is returned for all documents. |
| `should` | `repeated` [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | The clause (query) should appear in the matching document. |
| `adjust_pure_negative` | `optional bool` | Ensures correct behavior when a query contains only `must_not` clauses. Default is `true`. |

#### ConstantScoreQuery fields

The following table lists the fields for the [`ConstantScoreQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1421) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `filter` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | Required. The filter query that a document must match to be returned in the results. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |

### Joining query fields

#### NestedQuery fields

The following table lists the fields for the [`NestedQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L625) message.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `path` | `string` | Required. The path to a field or an array of paths. |
| `query` | [`QueryContainer`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L493) | Required. The query to run on the nested objects within the specified path. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |
| `ignore_unmapped` | `optional bool` | Set to `true` to ignore an unmapped field and not match any documents. Default is `false`. |
| `inner_hits` | `optional` [`InnerHits`](#innerhits-fields) | If provided, returns the underlying hits that matched the query. |
| `score_mode` | `optional` [`ChildScoreMode`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L642) | Defines how scores of matching inner documents influence the parent document's score. |

### Geographic query fields

#### GeoBoundingBoxQuery fields

The following table lists the fields for the [`GeoBoundingBoxQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L507) message. This query returns documents whose geopoints are within the bounding box specified in the query.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | The name of the filter. |
| `type` | `optional` [`GeoExecution`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L573) | The execution type for the geo query. |
| `validation_method` | `optional` [`GeoValidationMethod`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1066) | The validation method. Valid values are `IGNORE_MALFORMED`, `COERCE`, and `STRICT`. Default is `STRICT`. |
| `ignore_unmapped` | `optional bool` | Specifies whether to ignore an unmapped field. Default is `false`. |
| `bounding_box` | `map<string, `[`GeoBounds`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L522)`>` | A map of field names to geo bounds defining the bounding box. |

#### GeoDistanceQuery fields

The following table lists the fields for the [`GeoDistanceQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L579) message. This query returns documents with geopoints that are within a specified distance from the provided geopoint.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `distance` | `string` | Required. The distance within which to match the points. This is the radius of a circle centered at the specified point. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | The name of the filter. |
| `distance_type` | `optional` [`GeoDistanceType`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1033) | Specifies how to calculate the distance. Valid values are `arc` or `plane`. |
| `validation_method` | `optional` [`GeoValidationMethod`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1066) | The validation method. Valid values are `IGNORE_MALFORMED`, `COERCE`, and `STRICT`. Default is `STRICT`. |
| `ignore_unmapped` | `optional bool` | Set to `true` to ignore an unmapped field and not match any documents. Default is `false`. |
| `unit` | `optional` [`DistanceUnit`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L598) | The unit of distance measurement. |
| `location` | `map<string, `[`GeoLocation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L145)`>` | A map of field names to geo locations specifying the center point. |

### Specialized query fields

#### ScriptQuery fields

The following table lists the fields for the [`ScriptQuery`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L497) message. This query filters documents based on a custom condition written in the Painless scripting language.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `script` | [`Script`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L37) | Required. The script to execute for filtering documents. |
| `boost` | `optional float` | Floating point number used to decrease or increase the relevance scores of the query. Default is `1.0`. |
| `x_name` | `optional string` | Query name for query tagging. |

### Common types

#### Fuzziness

The [`Fuzziness`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2083) message is a `oneof` type that can contain:

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `string` | `string` | `AUTO` generates an edit distance based on the length of the term. You can optionally provide `AUTO:[low],[high]`. |
| `int32` | `int32` | `0`, `1`, or `2`: The maximum allowed Levenshtein Edit Distance. |

#### MultiTermQueryRewrite

The [`MultiTermQueryRewrite`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1232) enum determines how OpenSearch rewrites and scores multi-term queries.

| Value | Description |
| :---- | :---- |
| `MULTI_TERM_QUERY_REWRITE_UNSPECIFIED` | Unspecified. |
| `MULTI_TERM_QUERY_REWRITE_CONSTANT_SCORE` | Uses a constant score equal to the query boost for all matching documents. |
| `MULTI_TERM_QUERY_REWRITE_CONSTANT_SCORE_BOOLEAN` | Uses a constant score boolean query. |
| `MULTI_TERM_QUERY_REWRITE_SCORING_BOOLEAN` | Uses a scoring boolean query. |
| `MULTI_TERM_QUERY_REWRITE_TOP_TERMS_N` | Scores terms and selects the top N. |
| `MULTI_TERM_QUERY_REWRITE_TOP_TERMS_BLENDED_FREQS_N` | Blends term frequencies for the top N terms. |
| `MULTI_TERM_QUERY_REWRITE_TOP_TERMS_BOOST_N` | Uses boost values for the top N terms. |

#### MinimumShouldMatch

The [`MinimumShouldMatch`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L1395) message is a `oneof` type that can contain:

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `int32` | `int32` | An integer specifying the minimum number of terms that should match. |
| `string` | `string` | A string specifying a percentage or combination. See [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/). |

#### FieldValue

The [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094) message represents a field value and accepts the following values.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `bool` | `optional bool` | A Boolean value. |
| `general_number` | `optional` [`GeneralNumber`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L186) | A numeric value. |
| `string` | `optional string` | A string value. |
| `null_value` | `optional` [`NullValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L132) | A null value. |

#### InnerHits fields

The [`InnerHits`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L651) message accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `name` | `optional string` | The name to be used for the particular inner hit definition in the response. |
| `size` | `optional int32` | The maximum number of hits to return in `inner_hits`. |
| `from` | `optional int32` | The starting document offset for an inner hit. |
| `collapse` | `optional` [`FieldCollapse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L713) | Groups search results by a particular field value. |
| `docvalue_fields` | `repeated` [`FieldAndFormat`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L748) | The fields that OpenSearch should return using their `doc_values`. |
| `explain` | `optional bool` | Whether to return details about how OpenSearch computed the document's score. Default is `false`. |
| `highlight` | `optional` [`Highlight`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L758) | Highlighting emphasizes the search term(s) in the results. |
| `ignore_unmapped` | `optional bool` | Specifies how to treat an unmapped field. Default is `false`. |
| `script_fields` | `map<string, `[`ScriptField`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L710)`>` | Custom fields whose values are computed using scripts. |
| `seq_no_primary_term` | `optional bool` | Whether to return sequence number and primary term of the last operation of each document hit. |


All of the following examples show valid request payloads that can be sent to the `SearchService/Search` gRPC method.

### Match all query

A `match_all` query returns all documents in the index. For example, the following request returns a maximum of 50 documents from the index:

```json
{
  "search_request_body": {
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
  "search_request_body": {
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
 "search_request_body": {
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
  "search_request_body": {
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
  "search_request_body": {
    "query": {
      "match_none": {}
    }
  }
}
```
{% include copy.html %}

## Response fields
### SearchResponse fields

The following table lists the supported fields for the [`SearchResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L230) message.

The source documents are returned as bytes. Use Base64 decoding to read the `_source` field in the gRPC response.
{: .note}

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `took` | `int64` | The amount of time taken to process the search request, in milliseconds. |
| `timed_out` | `bool` | Whether the search timed out. |
| `x_shards` | [`ShardStatistics`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L311) | The shard-level success/failure/total metadata. |
| `phase_took` | [`PhaseTook`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L295)   | The phase-level `took` time values in the response. |
| `hits` | [`HitsMetadata`](#hitsmetadata-fields)    | The main document results and metadata. |
| `processor_results` | `repeated` [`ProcessorExecutionDetail`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L278) | Processor execution details. |
| `x_clusters` | [`ClusterStatistics`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L430) | Information about the search on each cluster when searching remote clusters. |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107)    | Retrieved specific fields in the search response. |
| `num_reduce_phases` | `int32` | The number of times that the coordinating node aggregates results from batches of shard responses. |
| `profile` | [`Profile`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L492) | Profiling data for query execution (debugging/performance insights). |
| `pit_id` | `string` | The Point in Time ID. |
| `x_scroll_id` | `string` | The identifier for the search and its search context. |
| `terminated_early` | `bool` | Whether the query was terminated early. |

### HitsMetadata fields

The `HitsMetadata` object contains information about the search results, including the total number of matching documents and an array of individual document matches. It includes the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `total` | [`HitsMetadataTotal`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L312)  | Metadata about the total number of matching documents (value \+ relation). |
| `max_score` | [`HitsMetadataMaxScore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L319)   | The highest relevance score of the returned hits (may be `null`). |
| `hits` | `repeated` [`HitsMetadataHitsInner`](#hitsmetadatahitsinner-fields) | The actual list of matched documents. Each hit includes core fields like `index`, `id`, `score`, and `source`, along with additional optional fields. |

### HitsMetadataHitsInner fields

Each `HitsMetadataHitsInner` represents a single document matched by the query and contains the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `x_type` | `string` | The document type. |
| `x_index` | `string` | The name of the index containing the returned document. |
| `x_id` | `string` | The unique ID for the document within the index. |
| `x_score` | [`HitXScore`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L359) | The relevance score of the hit. |
| `x_explanation` | [`Explanation`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L850) | A text explanation of how the `_score` was calculated. |
| `fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | The document field values. |
| `highlight` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L206)`>` | The highlighted fields and fragments per hit. |
| `inner_hits` | `map<string, `[`InnerHitsResult`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L352)`>` | The matching nested documents from a different scope that contributed to the overall query result. |
| `matched_queries` | `repeated string` | A list of query names matching the document. |
| `x_nested` | [`NestedIdentity`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/search.proto#L861) | The path to the inner nested object from which the hit originated. |
| `x_ignored` | `repeated string` | A list of ignored fields. |
| `ignored_field_values` | `map<string, `[`StringArray`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L206)`>` | Raw, unprocessed values from the document's original JSON. |
| `x_shard` | `string` | The shard ID from which the hit was retrieved. |
| `x_node` | `string` | The node ID from which the hit was retrieved. |
| `x_routing` | `string` | The routing value used for custom shard routing. |
| `x_source` | `bytes` | The Base64-encoded `_source` document. |
| `x_seq_no` | `int64` | The sequence number (used for indexing history and versioning). |
| `x_primary_term` | `int64` | The primary term number (used for optimistic concurrency control). |
| `x_version` | `int64` | The document version number. |
| `sort` | `repeated` [`FieldValue`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L2094)  | The sort values used for result sorting. |
| `meta_fields` | [`ObjectMap`](https://github.com/opensearch-project/opensearch-protobufs/blob/0.24.0/protos/schemas/common.proto#L107) | The metadata values for the document. |

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
            .setSearchRequestBody(requestBody)
            .build();

        try {
            SearchResponse response = stub.search(request);

            // Handle the response
            System.out.println("Search took: " + response.getTook() + " ms");
            System.out.println("Timed out: " + response.getTimedOut());

            HitsMetadata hits = response.getHits();
            if (hits.hasTotal()) {
                System.out.println("Total hits: " + hits.getTotal().getTotalHits().getValue());
            }

            // Process individual hits
            for (HitsMetadataHitsInner hit : hits.getHitsList()) {
                System.out.println("Hit ID: " + hit.getXId());
                System.out.println("Hit Index: " + hit.getXIndex());
                if (hit.hasXScore()) {
                    System.out.println("Score: " + hit.getXScore().getDouble());
                }
            }
        } catch (io.grpc.StatusRuntimeException e) {
            System.err.println("gRPC search request failed with status: " + e.getStatus());
            System.err.println("Error message: " + e.getMessage());
        }

        channel.shutdown();
    }
}
```
{% include copy.html %}

## Python gRPC client example

The following example shows how to send the same request using a Python client application.

First, install the `opensearch-protobufs` package using `pip`:

```bash
pip install opensearch-protobufs==0.24.0
```
{% include copy.html %}

Use the following code to send the request:

```python
import grpc

from opensearch.protobufs.schemas import *
from opensearch.protobufs.services import SearchServiceStub


channel = grpc.insecure_channel(
    target="localhost:9400",
)

search_stub = SearchServiceStub(channel)

# Create a term query
term_query = TermQuery(
    field="field",
    value=FieldValue(string="value")
)
query_container = QueryContainer(term=term_query)

# Create a search request
request = SearchRequest(
    search_request_body=SearchRequestBody(query=query_container),
    index=["my-index"]
)

# Send request and handle response
try:
    response = search_stub.Search(request=request)
    if response.hits:
        print("Found {} hits".format(response.hits.total))
        print(response.hits)
    elif response.timed_out or response.terminated_early:
        print("Request timed out or terminated early")
    elif response.x_shards.failed:
        print("Some shards failed to execute the search")
        print(response.x_shards.failures)
except grpc.RpcError as e:
    if e.code() == StatusCode.UNAVAILABLE:
        print("Failed to reach server: {}".format(e))
    elif e.code() == StatusCode.PERMISSION_DENIED:
        print("Permission denied: {}".format(e))
    elif e.code() == StatusCode.INVALID_ARGUMENT:
        print("Invalid argument: {}".format(e))
finally:
    channel.close()
```
