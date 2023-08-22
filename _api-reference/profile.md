---
layout: default
title: Profile
nav_order: 55
---

# Profile

The Profile API provides timing information about the the execution of individual components of a search request. Using the Profile API, you can debug slow requests and understand how to improve their performance.The Profile API does not mearue the following:

- Network latency
- Time spent in the search fetch phase
- Time a request spends in queues
- Idle time while merging shard responses on the coordinating node

The Profile API is a resource-consuming operation that adds overhead to search.
{: .warning}

#### Example request

To use the Profile API, include the `profile` parameter set to `true` in the search request sent to the `_search` endpoint:

```json
GET /testindex/_search
{
  "profile": true,
  "query" : {
    "match" : { "title" : "wind" }
  }
}
```
{% include copy-curl.html %}

The response contains profiling information:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 18,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.19363807,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.19363807,
        "_source": {
          "title": "The wind rises"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.17225474,
        "_source": {
          "title": "Gone with the wind",
          "description": "A 1939 American epic historical film"
        }
      }
    ]
  },
  "profile": {
    "shards": [
      {
        "id": "[LidyZ1HVS-u93-73Z49dQg][testindex][0]",
        "inbound_network_time_in_millis": 0,
        "outbound_network_time_in_millis": 0,
        "searches": [
          {
            "query": [
              {
                "type": "TermQuery",
                "description": "title:wind",
                "time_in_nanos": 3157165,
                "breakdown": {
                  "set_min_competitive_score_count": 0,
                  "match_count": 0,
                  "shallow_advance_count": 0,
                  "set_min_competitive_score": 0,
                  "next_doc": 3083,
                  "match": 0,
                  "next_doc_count": 2,
                  "score_count": 2,
                  "compute_max_score_count": 0,
                  "compute_max_score": 0,
                  "advance": 6542,
                  "advance_count": 2,
                  "score": 103832,
                  "build_scorer_count": 4,
                  "create_weight": 316416,
                  "shallow_advance": 0,
                  "create_weight_count": 1,
                  "build_scorer": 2727292
                }
              }
            ],
            "rewrite_time": 24750,
            "collector": [
              {
                "name": "SimpleTopScoreDocCollector",
                "reason": "search_top_hits",
                "time_in_nanos": 131250
              }
            ]
          }
        ],
        "aggregations": []
      }
    ]
  }
}
```
</details>

The Profile API response is verbose so if you're running the request through the `curl` command, include the `?pretty` query parameter for easier understanding of the response.
{: .tip}

## Response fields

The response inculdes the following fields.

Field | Data type | Description
:--- | :--- | :---
`profile` | Object | Contains profiling information.
`profile.shards` | Array of objects | A search request can be executed against one or more shards in the index and a search may involve one or more indexes. Thus, the `profile.shards` array contains profiling information for each shard that was involved in the search.
`profile.shards.id` | String | The shard ID of the shard in the `[node-ID][index-name][shard-ID]` format.
`profile.shards.searches` | Array of objects | A search represents a query executed against the underlying Lucene index. Most search requests execute a single search against a Lucene index, but some search requests can execute more than one search. For example, including a global aggregation results in a secondary `match_all` query for the global context. The `profile.shards` array contains profiling information about each search execution.
[`profile.shards.searches.query`](#the-query-object) | Array of objects | Profiling information about the query execution.
`profile.shards.searches.rewrite_time` | Integer | The cumulative rewrite time spent on rewriting the query, in nanoseconds.
`profile.shards.searches.collector` | Array of objects | Profiling information about the Lucene collectors that ran the search.
`profile.shards.aggregations` | Array of objects | Profiling information about the aggregation execution.

### The `query` object

The `query` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`type` | String | The Lucene query type into which the search query was rewritten. Corresponds to the Lucene class name (which often has the same name in OpenSearch).
`description` | String | Contains Lucene explanation of the query. Helps differentiate queries with the same type.
`time_in_nanos` | String | The time the query took to execute, in nanoseconds. In a parent query, the time is inclusive of execution times of all the child queries.
[`breakdown`](#the-breakdown-object) | Object | Contains timing statistics about low-level Lucene execution.
`children` | Array of objects | Contains information about all subqueries for this query.

### The `breakdown` object

The `breakdown` object represents the timing statistics about low-level Lucene execution. Timings are listed in wall-clock nanoseconds and are not normalized. The `breakdown` timings are inclusive of all children times. The `breakdown` object is comprised of the following fields. All fields contain integer values.

Field | Description
:--- | :--- 
`create_weight` | The


### Human-readable format

To turn on human-readable format, include the `?human=true` query parameter in the request:

```json
GET /testindex/_search?human=true
{
  "profile": true,
  "query" : {
    "match" : { "title" : "wind" }
  }
}
```
{% include copy-curl.html %}

The response contains an additional `time` field with human-readable units, for example:

```json
"collector": [
    {
        "name": "SimpleTopScoreDocCollector",
        "reason": "search_top_hits",
        "time": "113.7micros",
        "time_in_nanos": 113711
    }
]
```