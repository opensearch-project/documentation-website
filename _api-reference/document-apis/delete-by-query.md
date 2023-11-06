---
layout: default
title: Delete by query
parent: Document APIs
nav_order: 40
redirect_from:
 - /opensearch/rest-api/document-apis/delete-by-query/
---

# Delete by query
**Introduced 1.0**
{: .label .label-purple}

You can include a query as part of your delete request so OpenSearch deletes all documents that match that query.

## Example

```json
POST sample-index1/_delete_by_query
{
  "query": {
    "match": {
      "movie-length": "124"
    }
  }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST <index>/_delete_by_query
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :--- | :---
&lt;index&gt; | String | Name or list of the data streams, indexes, or aliases to delete from. Supports wildcards. If left blank, OpenSearch searches all indexes.
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
analyzer | String | The analyzer to use in the query string.
analyze_wildcard | Boolean | Specifies whether to analyze wildcard and prefix queries. Default is false.
conflicts | String | Indicates to OpenSearch what should happen if the delete by query operation runs into a version conflict. Valid options are `abort` and `proceed`. Default is `abort`.
default_operator | String | Indicates whether the default operator for a string query should be AND or OR. Default is OR.
df | String | The default field in case a field prefix is not provided in the query string.
expand_wildcards | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
from | Integer | The starting index to search from. Default is 0.
ignore_unavailable | Boolean | Specifies whether to include missing or closed indexes in the response. Default is false.
lenient | Boolean | Specifies whether OpenSearch should accept requests if queries have format errors (for example, querying a text field for an integer). Default is false.
max_docs | Integer | How many documents the delete by query operation should process at most. Default is all documents.
preference | String | Specifies which shard or node OpenSearch should perform the delete by query operation on.
q | String | Lucene query string's query.
request_cache | Boolean | Specifies whether OpenSearch should use the request cache. Default is whether it’s enabled in the index’s settings.
refresh | Boolean | If true, OpenSearch refreshes shards to make the delete by query operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
requests_per_second | Integer | Specifies the request's throttling in sub-requests per second. Default is -1, which means no throttling.
routing | String | Value used to route the operation to a specific shard.
scroll | Time | Amount of time the search context should be open.
scroll_size | Integer | Size of the operation's scroll requests. Default is 1000.
search_type | String | Whether OpenSearch should use global term and document frequencies calculating revelance scores. Valid choices are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It’s usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It’s usually slower but more accurate. Default is `query_then_fetch`.
search_timeout | Time | How long to wait until OpenSearch deems the request timed out. Default is no timeout.
slices | String or Integer | How many slices to cut the operation into for faster processing. Specify an integer to set how many slices to divide the operation into, or use `auto`, which tells OpenSearch it should decide how many slices to divide into. If you have a lot of shards in your index, set a lower number for better efficiency. Default is 1, which means the task should not be divided.
sort | String | A comma-separated list of &lt;field&gt; : &lt;direction&gt; pairs to sort by.
_source | String | Specifies whether to include the `_source` field in the response.
_source_excludes | String | A comma-separated list of source fields to exclude from the response.
_source_includes | String | A comma-separated list of source fields to include in the response.
stats | String | Value to associate with the request for additional logging.
terminate_after | Integer | The maximum number of documents OpenSearch should process before terminating the request.
timeout | Time | How long the operation should wait from a response from active shards. Default is `1m`.
version | Boolean | Whether to include the document version as a match.
wait_for_active_shards | String | The number of shards that must be active before OpenSearch executes the operation. Valid values are `all` or any integer up to the total number of shards in the index. Default is 1, which is the primary shard.
wait_for_completion | Boolean | Setting this parameter to false indicates to OpenSearch it should not wait for completion and perform this request asynchronously. Asynchronous requests run in the background, and you can use the [Tasks]({{site.url}}{{site.baseurl}}/api-reference/tasks) API to monitor progress.


## Request body

To search your index for specific documents, you must include a [query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index) in the request body that OpenSearch uses to match documents. If you don't use a query, OpenSearch treats your delete request as a simple [delete document operation]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-document).

```json
{
  "query": {
    "match": {
      "movie-length": "124"
    }
  }
}
```

## Response
```json
{
  "took": 143,
  "timed_out": false,
  "total": 1,
  "deleted": 1,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": {
    "bulk": 0,
    "search": 0
  },
  "throttled_millis": 0,
  "requests_per_second": -1.0,
  "throttled_until_millis": 0,
  "failures": []
}
```

## Response body fields

Field | Description
:--- | :---
took | The amount of time in milliseconds OpenSearch needed to complete the operation.
timed_out | Whether any delete requests during the operation timed out.
total | Total number of documents processed.
deleted | Total number of documents deleted.
batches | Number of scroll responses the request processed.
version_conflicts | Number of conflicts the request ran into.
noops | How many delete requests OpenSearch ignored during the operation. This field always returns 0.
retries | The number of bulk and search retry requests.
throttled_millis | Number of throttled milliseconds during the request.
requests_per_second | Number of requests executed per second during the operation.
throttled_until_millis | The amount of time until OpenSearch executes the next throttled request. Always equal to 0 in a delete by query request.
failures | Any failures that occur during the request.
