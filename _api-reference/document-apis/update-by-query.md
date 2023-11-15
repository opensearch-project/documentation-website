---
layout: default
title: Update by query
parent: Document APIs
nav_order: 50
redirect_from: 
 - /opensearch/rest-api/document-apis/update-by-query/
---

# Update by query
**Introduced 1.0**
{: .label .label-purple}

You can include a query and a script as part of your update request so OpenSearch can run the script to update all of the documents that match the query.

## Example

```json
POST test-index1/_update_by_query
{
  "query": {
    "term": {
      "oldValue": 10
    }
  },
  "script" : {
    "source": "ctx._source.oldValue += params.newValue",
    "lang": "painless",
    "params" : {
      "newValue" : 20
    }
  }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST <target-index1>, <target-index2>/_update_by_query
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :--- | :---
&lt;index&gt; | String | Comma-separated list of indexes to update. To update all indexes, use * or omit this parameter.
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
analyzer | String | Analyzer to use in the query string.
analyze_wildcard | Boolean | Whether the update operation should include wildcard and prefix queries in the analysis. Default is false.
conflicts | String | Indicates to OpenSearch what should happen if the update by query operation runs into a version conflict. Valid options are `abort` and `proceed`. Default is `abort`.
default_operator | String | Indicates whether the default operator for a string query should be `AND` or `OR`. Default is `OR`.
df | String | The default field if a field prefix is not provided in the query string.
expand_wildcards | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
from | Integer | The starting index to search from. Default is 0.
ignore_unavailable | Boolean | Whether to exclude missing or closed indexes in the response. Default is false.
lenient | Boolean | Specifies whether OpenSearch should accept requests if queries have format errors (for example, querying a text field for an integer). Default is false.
max_docs | Integer | How many documents the update by query operation should process at most. Default is all documents.
pipeline | String | ID of the pipeline to use to process documents.
preference | String | Specifies which shard or node OpenSearch should perform the update by query operation on.
q | String | Lucene query string's query.
request_cache | Boolean | Specifies whether OpenSearch should use the request cache. Default is whether it’s enabled in the index’s settings.
refresh | Boolean | If true, OpenSearch refreshes shards to make the update by query operation available to search results. Valid options are `true` and `false`. Default is `false`.
requests_per_second | Integer | Specifies the request's throttling in sub-requests per second. Default is -1, which means no throttling.
routing | String | Value used to route the update by query operation to a specific shard.
scroll | Time | How long to keep the search context open.
scroll_size | Integer | Size of the operation's scroll request. Default is 1000.
search_type | String | Whether OpenSearch should use global term and document frequencies calculating relevance scores. Valid choices are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It’s usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It’s usually slower but more accurate. Default is `query_then_fetch`.
search_timeout | Time | How long to wait until OpenSearch deems the request timed out. Default is no timeout.
slices | String or integer | The number slices to split an operation into for faster processing, specified by integer. When set to `auto` OpenSearch it should decides how many the number of slices for the operation. Default is `1`, which indicates an operation will not be split.
sort | List | A comma-separated list of &lt;field&gt; : &lt;direction&gt; pairs to sort by.
_source | String | Whether to include the `_source` field in the response.
_source_excludes | String | A comma-separated list of source fields to exclude from the response.
_source_includes | String | A comma-separated list of source fields to include in the response.
stats | String | Value to associate with the request for additional logging.
terminate_after | Integer | The maximum number of documents OpenSearch should process before terminating the request.
timeout | Time | How long the operation should wait from a response from active shards. Default is `1m`.
version | Boolean | Whether to include the document version as a match.
wait_for_active_shards | String | The number of shards that must be active before OpenSearch executes the operation. Valid values are `all` or any integer up to the total number of shards in the index. Default is 1, which is the primary shard.
wait_for_completion | boolean | When set to `false`, the response body includes a task ID and OpenSearch executes the operation asynchronously. The task ID can be used to check the status of the task or to cancel the task. Default is set to `true`.

## Request body

To update your indexes and documents by query, you must include a [query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index) and a script in the request body that OpenSearch can run to update your documents. If you don't specify a query, then every document in the index gets updated.

```json
{
  "query": {
    "term": {
      "oldValue": 20
    }
  },
  "script" : {
    "source": "ctx._source.oldValue += params.newValue",
    "lang": "painless",
    "params" : {
      "newValue" : 10
    }
  }
}
```

## Response
```json
{
  "took": 21,
  "timed_out": false,
  "total": 1,
  "updated": 1,
  "deleted": 0,
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
timed_out | Whether any update requests during the operation timed out.
total | Total number of documents processed.
updated | Total number of documents updated.
batches | Number of scroll responses the request processed.
version_conflicts | Number of conflicts the request ran into.
noops | How many update requests OpenSearch ignored during the operation. This field always returns 0.
retries | The number of bulk and search retry requests.
throttled_millis | Number of throttled milliseconds during the request.
requests_per_second | Number of requests executed per second during the operation.
throttled_until_millis | The amount of time until OpenSearch executes the next throttled request. Always equal to 0 in an update by query request.
failures | Any failures that occur during the request.
