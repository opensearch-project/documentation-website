---
layout: default
title: Create asynchronous search
parent: Asynchronous Search APIs
nav_order: 10
---

# Create asynchronous search
**Introduced 1.0**
{: .label .label-purple }


The Create Asynchronous Search API lets you run a search in the background and retrieve results later. This is useful for large or complex queries that might time out if executed synchronously. Asynchronous searches perform the following actions:

- Run in the background.
- Return a search ID immediately.
- Let you check the status or get partial results while the search is running.
- Allow access to full results once complete.

You can configure how long the search results are stored in the cluster after completion.


<!-- spec_insert_start
api: asynchronous_search.search
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_asynchronous_search
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: asynchronous_search.search
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the index to be searched. Can be an individual name, a comma-separated list of indexes, or a wildcard expression of index names. |
| `keep_alive` | String | The amount of time that the result is saved in the cluster. For example, `2d` means that the results are stored in the cluster for 48 hours. The saved search results are deleted after this period or if the search is canceled. Note that this includes the query execution time. If the query exceeds this amount of time, the process cancels this query automatically. |
| `keep_on_completion` | Boolean | Whether to save the results in the cluster after the search is complete. You can examine the stored results at a later time. |
| `wait_for_completion_timeout` | String | The amount of time to wait for the results. You can poll the remaining results based on an ID. The maximum value is 300 seconds. Default is `1s`. |

<!-- spec_insert_end -->

## Request body fields

## Request body fields

The request body follows the standard [Search API format]({{site.url}}{{site.baseurl}}/query-dsl/) using the Query DSL. The body is optional.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_source` | All | Controls how the `_source` field is returned. You can disable fetching or filter specific fields. |
| `aggregations` | Object | Defines aggregation operations to perform during the search. |
| `collapse` | Object | Collapses search results based on a field value. |
| `docvalue_fields` | Array | Returns doc values for matching fields in the `hits.fields` section. Accepts wildcards. |
| `explain` | Boolean | When `true`, includes score explanation for each hit. |
| `ext` | Object | Plugin-specific search extensions. |
| `fields` | Array | Returns values for matching fields in `hits.fields`. Accepts wildcards. |
| `from` | Integer | Offset for the first result to return. Used for pagination. |
| `highlight` | Object | Configures field highlighting in the response. |
| `indices_boost` | Array | Boosts relevance scores for specified indices. |
| `min_score` | Float | Excludes documents with a `_score` below this threshold. |
| `pit` | Object | Defines a point-in-time (PIT) context for consistent snapshots. |
| `post_filter` | Object | Applies a filter after aggregations are computed. |
| `profile` | Boolean | When `true`, includes profiling data for debugging. |
| `query` | Object | Defines the search criteria using the Query DSL. |
| `rank` | Object | Configures ranking algorithms or features. |
| `script_fields` | Object | Returns custom script-based values for each hit. |
| `search_after` | Array | Enables pagination beyond 10,000 results using sort values. |
| `seq_no_primary_term` | Boolean | When `true`, includes sequence number and primary term metadata. |
| `size` | Integer | Number of hits to return. |
| `slice` | Object | Enables parallel execution of a sliced scroll request. |
| `sort` | Array | Sorts results by specified fields. Valid values: `_score`, `_doc`. |
| `stats` | Array | Assigns search statistics to named groups. |
| `stored_fields` | Array | Specifies stored fields to return in the response. |
| `suggest` | Object | Provides term or phrase suggestions based on input text. |
| `terminate_after` | Integer | Stops collecting results after a specified number per shard. |
| `timeout` | String | Maximum time to wait for shard responses before failing the request. |
| `track_scores` | Boolean | When `true`, calculates scores even if not used for sorting. |
| `track_total_hits` | Boolean or Integer | Controls total hit count calculation. `true` for exact count; `false` disables it. |
| `version` | Boolean | When `true`, includes the document version in hits. |



## Example requests

### Basic asynchronous search

The following example submits an asynchronous search for the term "OpenSearch" across all indices with a 2-minute wait time:

```json
POST /_plugins/_asynchronous_search?wait_for_completion_timeout=2m&keep_alive=10m&keep_on_completion=true
{
  "query": {
    "match": {
      "content": "OpenSearch"
    }
  },
  "size": 100
}
```
{% include copy-curl.html %}

### Asynchronous search with aggregations

The following example runs an asynchronous search with both a query and aggregations:

```json
POST /_plugins/_asynchronous_search?wait_for_completion_timeout=5s&keep_alive=1d
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "now-1d/d",
        "lt": "now/d"
      }
    }
  },
  "size": 0,
  "aggs": {
    "categories": {
      "terms": {
        "field": "category",
        "size": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example responses

### Response with partial results

```json
{
  "id": "FmRldE8zREVEUzA2ZVpUeGs2ejJFUFEaMkZ5QTVrSTZSaVN3WlNFVmtlWGJKdFQ0USsydzoxMDc=",
  "state": "RUNNING",
  "start_time_in_millis": 1663276896192,
  "expiration_time_in_millis": 1663363296192,
  "response": {
    "took": 1019,
    "timed_out": false,
    "_shards": {
      "total": 10,
      "successful": 5,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 3,
        "relation": "eq"
      },
      "max_score": 0.9530773,
      "hits": [
        {
          "_index": "my-index",
          "_id": "1",
          "_score": 0.9530773,
          "_source": {
            "content": "OpenSearch is a community-driven open source search and analytics suite"
          }
        },
        // Additional hits omitted for brevity
      ]
    }
  }
}
```

### Response for a completed search

```json
{
  "id": "MkZ5QTVrSTZSaVN3WlNFVmtlWGJKdFQ0USsydzoxFmRldE8zREVEUzA2ZVpUeGs2ejJFUFE=",
  "state": "SUCCEEDED",
  "start_time_in_millis": 1663276892345,
  "expiration_time_in_millis": 1663363292345,
  "took": 3876,
  "response": {
    "took": 3876,
    "timed_out": false,
    "_shards": {
      "total": 10,
      "successful": 10,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 15,
        "relation": "eq"
      },
      "max_score": 2.341092,
      "hits": [
        // Hits omitted for brevity
      ]
    },
    "aggregations": {
      "categories": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "documentation",
            "doc_count": 7
          },
          {
            "key": "blog",
            "doc_count": 5
          },
          {
            "key": "tutorial",
            "doc_count": 3
          }
        ]
      }
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `expiration_time_in_millis` | Long | The UNIX timestamp in milliseconds when the asynchronous search results will expire and be deleted from the cluster. |
| `id` | String | The unique identifier for the asynchronous search request. Use this ID to check the status, get results, or delete the search. |
| `response` | Object | Contains the search results (if available) in the same format as a standard search response. May be empty if no results are available yet. |
| `start_time_in_millis` | Long | The UNIX timestamp in milliseconds when the asynchronous search was started. |
| `state` | String | The current state of the asynchronous search. Possible values include `RUNNING`, `SUCCEEDED`, `FAILED`, or `PERSISTED`. |
| `took` | Integer | The time in milliseconds that the search took to execute so far. |
