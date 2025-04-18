---
layout: default
title: Search gRPC
parent: GRPC APIs
nav_order: 20
redirect_from:
 - /opensearch/rest-api/grpc-apis/search/
---

# Search (gRPC)
**Introduced 3.0**
{: .label .label-purple }

The gRPC Search API provides a performant, binary interface to run [OpenSearch queries]({{site.url}}{{site.baseurl}}/api-reference/search/) using Protocol Buffers over gRPC. It mirrors the capabilities of the HTTP Search API while benefiting from protobuf-typed contracts and gRPC transport. The gRPC APis are ideal for low-latency, high-throughput applications.

This plugin is experimental and not recommended for production use. APIs and behavior may change without notice in future releases.
{: .note}

## Client protobufs 

1. Refer to the full protobuf schema in the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs) for the source of truth:  
* [search_service.proto](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/services/search_service.proto)  
* [search.proto](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto)   
1. Java clients can also download the  `opensearch-protobufs`  jar from the [Central Maven repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0).

## Usage notes 

* Currently, only basic queries (`match_all`, `term`, `terms`, `match_none`) are supported. Additional query types will be supported in future releases.  
* The source documents will be returned as bytes. Use base64 decoding to read `_source` field in the GRPC response. 

## Request fields 
### SearchRequest fields 

The [SearchRequest](https://github.com/opensearch-project/opensearch-protobufs/blob/0.3.0/protos/schemas/search.proto#L18) message is the top-level container for a gRPC search request. 

The `SearchRequest` message accepts the following fields. All fields are optional. 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| index | repeated string | (Optional.) A list of indices to search. Defaults to all indices if not provided. |
| source | SourceConfigParam | (Optional.) Whether to include the `_source` field in the response. |
| source_excludes | repeated string | (Optional.) Fields to exclude from `_source`. Ignored if `source` is false. |
| source_includes | repeated string | (Optional.) Fields to include in `_source`. Ignored if `source` is false. |
| allow_no_indices | bool | (Optional.) Whether to ignore wildcards that match no indices. Default is true. |
| allow_partial_search_results | bool | (Optional.) Return partial results on error or timeout. Default is true. |
| analyze_wildcard | bool | (Optional.) Analyze wildcard/prefix queries. Default is false. |
| analyzer | string | (Optional.) Analyzer to use with the `q` query string. |
| batched_reduce_size | int32 | (Optional.) Number of shards to reduce on a node. Default is 512. |
| cancel_after_time_interval | string | (Optional.) Time after which the request will be canceled. Default is -1. |
| ccs_minimize_roundtrips | bool | (Optional.) Minimize round-trips between node and remote clusters. Default is true. |
| default_operator | Operator | (Optional.) Default operator for query strings (`AND` or `OR`). Default is `OR`. |
| df | string | (Optional.) Default field for query strings without field prefixes. |
| docvalue_fields | repeated string | (Optional.) Fields to return as doc values. |
| expand_wildcards | repeated ExpandWildcard | (Optional.) Types of indices that wildcard patterns match. Default is `open`. |
| explain | bool | (Optional.) Return document score computation details. Default is false. |
| from | int32 | (Optional.) Starting index for paginated results. Default is 0. |
| ignore_throttled | bool | (Optional.) Ignore frozen indices when resolving aliases. Default is true. |
| ignore_unavailable | bool | (Optional.) Ignore unavailable indices or shards. Default is false. |
| include_named_queries_score | bool | (Optional.) Include scores for named queries. Default is false. |
| lenient | bool | (Optional.) Accept format errors in queries. Default is false. |
| max_concurrent_shard_requests | int32 | (Optional.) Number of concurrent shard requests per node. Default is 5. |
| phase_took | bool | (Optional.) Return phase-level took values. Default is false. |
| pre_filter_shard_size | int32 | (Optional.) Threshold to trigger prefiltering by shard size. Default is 128. |
| preference | string | (Optional.) Shard or node preferences for query execution. |
| q | string | (Optional.) Query string in Lucene syntax. |
| request_cache | bool | (Optional.) Use request cache. Defaults to index settings. |
| rest_total_hits_as_int | bool | (Optional.) Return total hits as integer. Default is false. |
| routing | repeated string | (Optional.) Routing values to direct requests to specific shards. |
| scroll | string | (Optional.) Duration to keep the search context alive for scrolling. |
| search_pipeline | string | (Optional.) Name of the search pipeline to use. |
| search_type | SearchType | (Optional.) Method for calculating relevance scores. Default is `QUERY_THEN_FETCH`. |
| seq_no_primary_term | bool | (Optional.) Return sequence number and primary term. |
| size | int32 | (Optional.) Number of results to return. |
| sort | repeated SortOrder | (Optional.) Fields and directions to sort results by. |
| stats | repeated string | (Optional.) Tags to associate with the request for logging. |
| stored_fields | repeated string | (Optional.) List of stored fields to include in the response. |
| suggest_field | string | (Optional.) Field to base suggestions on. |
| suggest_mode | SuggestMode | (Optional.) Suggestion mode (e.g., `always`, `missing`, `popular`). |
| suggest_size | int32 | (Optional.) Number of suggestions to return. |
| suggest_text | string | (Optional.) Input text for generating suggestions. |
| terminate_after | int32 | (Optional.) Max docs to process before early termination. Default is 0. |
| timeout | string | (Optional.) Max time to wait for query execution. Default is 1m. |
| track_scores | bool | (Optional.) Whether to return document scores. Default is false. |
| track_total_hits | TrackHits | (Optional.) Whether to include total hits metadata. |
| typed_keys | bool | (Optional.) Include type info in aggregation and suggestion keys. Default is true. |
| verbose_pipeline | bool | (Optional.) Enable verbose mode for the search pipeline. |
| version | bool | (Optional.) Return document version in the response. |
| request_body | SearchRequestBody | (Optional.) The main search request payload, including query and filters. |
 
### SearchRequestBody fields

The `SearchRequestBody` message accepts the following fields. All fields are optional.

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| collapse | FieldCollapse | (Optional.) Groups results by a field; returns only the top document per group. |
| explain | bool | (Optional.) Returns scoring explanations for matched documents. |
| ext | ObjectMap | (Optional.) Plugin-specific metadata, e.g., for extensions like RAG. |
| from | int32 | (Optional.) Starting index for results. Default is 0. |
| highlight | Highlight | (Optional.) Highlights matched terms in the result snippets. |
| track_total_hits | TrackHits | (Optional.) Whether to return total hit count. |
| indices_boost | repeated NumberMap | (Optional.) Per-index boost multipliers. Format: `<index>: <boost>`. |
| docvalue_fields | repeated FieldAndFormat | (Optional.) Fields returned using doc values, optionally formatted. |
| min_score | float | (Optional.) Minimum score required for a document to be included in results. |
| post_filter | QueryContainer | (Optional.) Filters hits after aggregations are applied. |
| profile | bool | (Optional.) Enables profiling to analyze query performance. |
| search_pipeline | string | (Optional.) Name of search pipeline to apply. |
| verbose_pipeline | bool | (Optional.) Enables verbose logging in the search pipeline. |
| query | QueryContainer | (Optional.) The query DSL for the search. |
| rescore | repeated Rescore | (Optional.) Re-ranks top N hits to improve precision. |
| script_fields | map<string, ScriptField> | (Optional.) Custom fields whose values are computed by scripts. |
| search_after | repeated FieldValue | (Optional.) Cursor-based pagination using values from previous page. |
| size | int32 | (Optional.) Number of results to return. Default is 10. |
| slice | SlicedScroll | (Optional.) Split scroll context into slices for parallel processing. |
| sort | repeated SortCombinations | (Optional.) Sorting rules (e.g., by field, score, or custom order). |
| source | SourceConfig | (Optional.) Controls inclusion and filtering of `_source` field. |
| fields | repeated FieldAndFormat | (Optional.) Additional fields to return with formatting options. |
| suggest | Suggester | (Optional.) Suggestion queries for autocomplete or corrections. |
| terminate_after | int32 | (Optional.) Max docs to collect before terminating search early. Default is 0. |
| timeout | string | (Optional.) Time limit for query execution before it times out. |
| track_scores | bool | (Optional.) Whether to return document scores in results. |
| include_named_queries_score | bool | (Optional.) Whether to include scores for named queries. |
| version | bool | (Optional.) Includes document version in the response. |
| seq_no_primary_term | bool | (Optional.) Includes sequence number and primary term for each hit. |
| stored_fields | repeated string | (Optional.) Stored fields to return (excludes `_source` unless re-enabled). |
| pit | PointInTimeReference | (Optional.) Point in Time reference to search a fixed snapshot. |
| stats | repeated string | (Optional.) Tagging or logging fields to associate with the request. |
| derived | map<string, DerivedField> | (Optional.) Dynamically computed fields returned in the response. |


### `QueryContainer` fields
The entrypoint for all supported query types is `QueryContainer`. 

Exactly one of the below fields must be provided inside each QueryContainer message. 

Note that some query types are currently unsupported. Only `match_all`, `term`, `terms`, and `match_none` are currently supported in the experimental 3.0.0 release.

| Field | Protobuf Type | Description |
| :---- | :------------- | :---------- |
| bool | BoolQuery | (Optional.) A Boolean query that combines multiple clauses using AND/OR/NOT logic. Must be the only field set. |
| boosting | BoostingQuery | (Optional.) Boosts results matching a positive query, and demotes results matching a negative query. Must be the only field set. |
| constant_score | ConstantScoreQuery | (Optional.) Wraps a filter and assigns a constant relevance score to all matching documents. Must be the only field set. |
| dis_max | DisMaxQuery | (Optional.) Returns documents matching any clause; uses the highest score if multiple clauses match. Must be the only field set. |
| function_score | FunctionScoreQuery | (Optional.) Adjusts scores of results using custom functions. Must be the only field set. |
| exists | ExistsQuery | (Optional.) Matches documents that contain a specific field. Must be the only field set. |
| fuzzy | map<string, FuzzyQuery> | (Optional.) Matches terms similar to the search term (fuzzy matching). Only one entry allowed. Must be the only field set. |
| ids | IdsQuery | (Optional.) Matches documents by `_id` values. Must be the only field set. |
| prefix | map<string, PrefixQuery> | (Optional.) Matches terms with a specific prefix. Only one entry allowed. Must be the only field set. |
| range | map<string, RangeQuery> | (Optional.) Matches terms within a specified range. Only one entry allowed. Must be the only field set. |
| regexp | map<string, RegexpQuery> | (Optional.) Matches terms using regular expressions. Only one entry allowed. Must be the only field set. |
| term | map<string, TermQuery> | (Optional.) Matches exact terms (no analysis). Only one entry allowed. Must be the only field set. |
| terms | TermsQueryField | (Optional.) Matches any document containing one or more specified terms in a field. Must be the only field set. |
| terms_set | map<string, TermsSetQuery> | (Optional.) Matches documents with a minimum number of exact terms in a field. Only one entry allowed. Must be the only field set. |
| wildcard | map<string, WildcardQuery> | (Optional.) Matches terms using a wildcard pattern. Only one entry allowed. Must be the only field set. |
| match | map<string, MatchQueryTypeless> | (Optional.) Full-text match on text or exact-value fields. Only one entry allowed. Must be the only field set. |
| match_bool_prefix | map<string, MatchBoolPrefixQuery> | (Optional.) Matches full words and prefixes in a Boolean-style query. Only one entry allowed. Must be the only field set. |
| match_phrase | map<string, MatchPhraseQuery> | (Optional.) Matches an exact phrase in order. Only one entry allowed. Must be the only field set. |
| match_phrase_prefix | map<string, MatchPhrasePrefixQuery> | (Optional.) Matches a phrase where the last term is treated as a prefix. Only one entry allowed. Must be the only field set. |
| multi_match | MultiMatchQuery | (Optional.) Searches multiple fields with a single query string. Must be the only field set. |
| query_string | QueryStringQuery | (Optional.) Parses advanced queries from a single string. Must be the only field set. |
| simple_query_string | SimpleQueryStringQuery | (Optional.) Less strict syntax alternative to `query_string`. Ignores invalid syntax. Must be the only field set. |
| intervals | map<string, IntervalsQuery> | (Optional.) Matches terms based on position/proximity. Only one entry allowed. Must be the only field set. |
| knn | map<string, KnnField> | (Optional.) k-Nearest Neighbors query across vector fields. Only one entry allowed. Must be the only field set. |
| match_all | MatchAllQuery | (Optional.) Matches all documents in the index. Must be the only field set. |
| match_none | MatchNoneQuery | (Optional.) Matches no documents. Must be the only field set. |
| script_score | ScriptScoreQuery | (Optional.) Custom scoring using scripts. Must be the only field set. |
| nested | NestedQuery | (Optional.) Wraps a query targeting nested fields. Must be the only field set. |

## Supported queries 

### 1. Match all query 

Returns all documents from the index, capped to a maximum of 50 docs.

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

### 2. Term query 

Match a single field with a specific term.

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

### 3. Terms query 

Match documents where a specific field contains any  value from a list. 

The following query searches for lines with the IDs 61809 and 61810:

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
EOM
```
{% include copy.html %}

### 4. Terms query with terms lookup

Match documents in the `students` index for every student whose `id` matches one of the values in the `enrolled` array:

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


### 5. Match none

The counterpart to the Match All query. 

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

## Response 
### SearchResponse fields 

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| response_body | ResponseBody | (Required.) The actual payload of the search response. |

### ResponseBody fields  

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| took | int64 | Time taken to execute the search (in ms). |
| timed_out | bool | Whether the search timed out. |
| shards | ShardStatistics | Shard-level success/failure/total metadata. |
| phase_took | PhaseTook | (Optional.) Phase-level took time values in the response. |
| hits | HitsMetadata | Main document results and metadata. |
| profile | Profile | (Optional.) Profiling data for query execution (debugging/perf insights). |
| fields | ObjectMap | (Optional.) Top-level key-value field structure from the response (if any). |

### HitsMetadata fields

Each `Hit` represents a single document matched by the query.

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| total | TotalHits | Metadata about the total number of matching documents (value \+ relation). |
| max_score | MaxScore (float, string, or null) | The highest relevance score of returned hits (may be null). |
| hits | repeated Hit | The actual list of matched documents. Each hit includes index, ID, score, and source. |

### Hit fields

| Field | Protobuf Type | Description |
| :---- | :---- | :---- |
| Protobuf Type | string | Protobuf Type of the document (legacy; may be unused in modern OpenSearch). |
| index | string | (Required.) Name of the index containing the returned document. |
| id | string | (Required.) Unique ID for the document (within the index). |
| score | Score | (Optional.) Relevance score of the hit. |
| explanation | Explanation | (Optional.) Text explanation of how the _score was calculated. |
| fields | ObjectMap | (Optional.) Field values of the document. |
| highlight | map<string, StringArray> | (Optional.) Highlighted fields and fragments per hit. |
| inner_hits | map<string, InnerHitsResult> | (Optional.) Nested hits responsible for the match in another scope. |
| matched_queries | repeated string | (Optional.) List of query names that matched for this document. |
| nested | NestedIdentity | (Optional.) Path to the inner nested object from which this hit originated. |
| ignored | repeated string | (Optional.) List of ignored fields. |
| ignored_field_values | map<string, StringArray> | (Optional.) Raw, unprocessed values from the document's original JSON. |
| shard | string | (Optional.) Shard ID from which this hit was retrieved. |
| node | string | (Optional.) Node ID from which this hit was retrieved. |
| routing | string | (Optional.) Routing value used for custom shard routing. |
| source | bytes | (Optional.) Base64-encoded _source document. |
| seq_no | int64 | (Optional.) Sequence number (used for indexing history/versioning). |
| primary_term | int64 | (Optional.) Primary term number (used for optimistic concurrency control). |
| version | int64 | (Optional.) Document version number. |
| sort | repeated FieldValue | (Optional.) Sort values used in the result sorting. |
| meta_fields | ObjectMap | (Optional.) Metadata values for the document. |

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
