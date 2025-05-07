---
layout: default
title: Create asynchronous search
parent: Asynchronous Search APIs
nav_order: 10
---

# Create asynchronous search
**Introduced 1.0**
{: .label .label-purple }

The Create Asynchronous Search API allows you to run search operations in the background and retrieve results later. This is especially useful for resource-intensive searches that may take a long time to complete, helping you avoid request timeouts and providing a better experience for operations involving large data volumes or complex aggregations.

Unlike standard search operations that maintain an open HTTP connection until completion, asynchronous searches let you:

- Submit a search request that runs in the background
- Receive a search ID immediately 
- Check status or retrieve partial results as they become available
- Access the complete results once the search finishes

You can also configure how long the search results are stored in the cluster after completion, enabling flexible retrieval based on your application's needs.


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

The request body follows the standard OpenSearch Search API format using the Query DSL.

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_source` | All | Defines how to fetch a source. Fetching can be disabled entirely, or the source can be filtered. |
| `aggregations` | Object | Defines the aggregations that are run as part of the search request. |
| `collapse` | Object | The field to collapse search results on. |
| `docvalue_fields` | Array of objects or strings | An array of wildcard (`*`) patterns. The request returns doc values for field names matching these patterns in the `hits.fields` property of the response. |
| `explain` | Boolean | When `true`, returns detailed information about score computation as part of a hit. |
| `ext` | Object | Configuration of search extensions defined by OpenSearch plugins. |
| `fields` | Array of object or strings | Array of wildcard (`*`) patterns. The request returns values for field names matching these patterns in the `hits.fields` property of the response. |
| `from` | Float | Starting document offset. Needs to be non-negative. By default, you cannot page through more than 10,000 hits using the `from` and `size` parameters. To page through more hits, use the `search_after` parameter. |
| `highlight` | Object | Highlighting configuration for matched fields. |
| `indices_boost` | Array of objects | Boosts the `_score` of documents from specified indexes. |
| `min_score` | Float | Minimum `_score` for matching documents. Documents with a lower `_score` are not included in the search results. |
| `pit` | Object | Point-in-time context for search operations. |
| `post_filter` | Object | Filter that runs after the query and aggregations. |
| `profile` | Boolean | Set to `true` to return detailed timing information about the execution of individual components in a search request. NOTE: This is a debugging tool and adds significant overhead to search execution. |
| `query` | Object | The query definition using the Query DSL. |
| `rank` | Object | The container for ranking configuration. |
| `script_fields` | Object | Retrieve a script evaluation (based on different fields) for each hit. |
| `search_after` | Array of Booleans, float, or strings | Enables pagination of search results beyond the 10,000 document limit of from/size. |
| `seq_no_primary_term` | Boolean | When `true`, returns sequence number and primary term of the last modification of each hit. |
| `size` | Float | The number of hits to return. By default, you cannot page through more than 10,000 hits using the `from` and `size` parameters. To page through more hits, use the `search_after` parameter. |
| `slice` | Object | The configuration for a sliced scroll request. |
| `sort` | Array of objects or strings | Valid values are: <br> - `_score`: Sort by document score. <br> - `_doc`: Sort by document index order. |
| `stats` | Array of Strings | The statistics groups to associate with the search. Each group maintains a statistics aggregation for its associated searches. You can retrieve these stats using the indexes stats API. |
| `stored_fields` | Array of strings | A list of stored fields to retrieve. |
| `suggest` | Object | Suggests a configuration for similar looking terms. |
| `terminate_after` | Integer | The maximum number of documents to collect for each shard. If a query reaches this limit, OpenSearch terminates the query early. OpenSearch collects documents before sorting. Use with caution. OpenSearch applies this parameter to each shard handling the request. When possible, let OpenSearch perform early termination automatically. Avoid specifying this parameter for requests that target data streams with backing indexes across multiple data tiers. If set to `0` (default), the query does not terminate early. |
| `timeout` | String | Specifies the period of time to wait for a response from each shard. If no response is received before the timeout expires, the request fails and returns an error. Default is no timeout. |
| `track_scores` | Boolean | When `true`, calculate and return document scores, even if the scores are not used for sorting. |
| `track_total_hits` | Boolean or integer | The number of hits matching the query. When `true`, the exact number of hits is returned at the cost of some performance. When `false`, the response does not include the total number of hits matching the query. Default is `10,000` hits. |
| `version` | Boolean | When `true`, returns document version as part of a hit. |


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
