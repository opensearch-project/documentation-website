---
layout: default
title: Update by query
parent: Document APIs
grand_parent: REST API reference
nav_order: 50
---

# Update by query
Introduced 1.0
{: .label .label-purple}

You can include a query as part of your update request so OpenSearch updates all documents that match that query.

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

## Path and HTTP methods

```
POST <target-index1>, <target-index2>/_update_by_query
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :--- | :---
&lt;target-index&gt; | String | Comma-separated list of indices to update. To update all indices, use * or omit this parameter.
allow_no_indices | String | If false, the request returns an error if wildcard expressions match closed or missing indices. Default is true.
analyzer | String | Analyzer to use in the query string.
analyze_wildcard | Boolean | Whether the operation should include wildcard and prefix queries in the analysis. Default is false.
conflicts | String | Specifies whether the operation should continue if the request runs into version conflicts. Valid options are `abort` and `proceed`. Default is `abort`.
default_operator | String | The default operator the string query should use. Valid options are `AND` and `OR`. Default is `OR`.
df | String | The default field when the query string does not have a field prefix.
expand_wildcards | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indices), `closed` (match closed, non-hidden indices), `hidden` (match hidden indices), and `none` (deny wildcard expressions). Default is `open`.
from | Integer | The starting index to search from. Default is 0.
ignore_unavailable | Boolean | Whether to exclude missing or closed indices in the response. Default is false.
lenient | Boolean | Whether OpenSearch should ignore format-based query failures (for example, querying an integer field for a string). Default is false.
max_docs | Integer | Maximum number of documents the request should process. Default is all documents.
pipeline | String | ID of the pipeline to use to process documents.
preference | String | The node or shard OpenSearch should perform the operation on.
q | String | Query in the Lucene query string syntax.
request_cache | Boolean | Whether OpenSearch should use the request cache for the operation. Default is whether it's enabled in the index's settings.
refresh | Boolean | Specifies whether OpenSearch should refresh shards involved in the operation to make the operation visible to searching.
requests_per_second | Integer | Specifies the request's throttling in sub-requests per second. Default is -1, which means no throttling.
routing | String | Value used to route the operation to a specific shard.
scroll | Time | How long to keep the search context open.
scroll_size | Integer | Size of the operation's scroll request. Default is 1000.
search_type | String | Whether OpenSearch should use global term and document frequencies calculating revelance scores. Valid choices are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It’s usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It’s usually slower but more accurate. Default is `query_then_fetch`.
search_timeout | Time | Amount of time until timeout for the search request. Default is no timeout.
slices | Integer | Number of sub-tasks OpenSearch should divide this task into. Default is 1, which means OpenSearch should not divide this task.
sort | String | A comma-separated list of &lt;field&gt; : &lt;direction&gt; pairs to sort by.
_source | String | Whether to include the `_source` field in the response.
_source_excludes | String | A comma-separated list of source fields to exclude from the response.
_source_includes | String | A comma-separated list of source fields to include in the response.
stats | String | Value to associate with the request for additional logging.
terminate_after | Integer | The maximum number of documents OpenSearch should process before terminating the request.
timeout | Time | How long the operation should wait from a response from active shards. Default is `1m`.
version | Boolean | Whether to include the document version as a match.
wait_for_active_shards | String | The number of shards that must be active before OpenSearch executes the operation. Valid values are `all` or any integer up to the total number of shards in the index. Default is 1, which is the primary shard.

## Request body

To update your indices and documents by query, you must include a [query]({{site.baseurl}}{{site.url}}/opensearch/query-dsl/index) and a script in the request body that OpenSearch can run to update your documents. If you don't specify a query, then every document in the index gets updated.

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
