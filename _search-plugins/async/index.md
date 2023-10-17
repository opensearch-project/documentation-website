---
layout: default
title: Asynchronous search
nav_order: 51
has_children: true
redirect_from:
  - /search-plugins/async/
---

# Asynchronous search

Searching large volumes of data can take a long time, especially if you're searching across warm nodes or multiple remote clusters.

Asynchronous search in OpenSearch lets you send search requests that run in the background. You can monitor the progress of these searches and get back partial results as they become available. After the search finishes, you can save the results to examine at a later time.

## REST API
Introduced 1.0
{: .label .label-purple }

To perform an asynchronous search, send requests to `_plugins/_asynchronous_search`, with your query in the request body:

```json
POST _plugins/_asynchronous_search
```

You can specify the following options.

Options | Description | Default value | Required
:--- | :--- |:--- |:--- |
`wait_for_completion_timeout` |  The amount of time that you plan to wait for the results. You can see whatever results you get within this time just like in a normal search. You can poll the remaining results based on an ID. The maximum value is 300 seconds. | 1 second | No
`keep_on_completion` |  Whether you want to save the results in the cluster after the search is complete. You can examine the stored results at a later time. | `false` | No
`keep_alive` |  The amount of time that the result is saved in the cluster. For example, `2d` means that the results are stored in the cluster for 48 hours. The saved search results are deleted after this period or if the search is canceled. Note that this includes the query execution time. If the query overruns this time, the process cancels this query automatically. | 12 hours | No

#### Example request

```json
POST _plugins/_asynchronous_search/?pretty&size=10&wait_for_completion_timeout=1ms&keep_on_completion=true&request_cache=false
{
  "aggs": {
    "city": {
      "terms": {
        "field": "city",
        "size": 10
      }
    }
  }
}
```

#### Example response

```json
{
  "*id*": "FklfVlU4eFdIUTh1Q1hyM3ZnT19fUVEUd29KLWZYUUI3TzRpdU5wMjRYOHgAAAAAAAAABg==",
  "state": "RUNNING",
  "start_time_in_millis": 1599833301297,
  "expiration_time_in_millis": 1600265301297,
  "response": {
    "took": 15,
    "timed_out": false,
    "terminated_early": false,
    "num_reduce_phases": 4,
    "_shards": {
      "total": 21,
      "successful": 4,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 807,
        "relation": "eq"
      },
      "max_score": null,
      "hits": []
    },
    "aggregations": {
      "city": {
        "doc_count_error_upper_bound": 16,
        "sum_other_doc_count": 403,
        "buckets": [
          {
            "key": "downsville",
            "doc_count": 1
          },
        ....
        ....
        ....
          {
            "key": "blairstown",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

#### Response parameters

Options | Description
:--- | :---
`id` | The ID of an asynchronous search. Use this ID to monitor the progress of the search, get its partial results, and/or delete the results. If the asynchronous search finishes within the timeout period, the response doesn't include the ID because the results aren't stored in the cluster.
`state` | Specifies whether the search is still running or if it has finished, and if the results persist in the cluster. The possible states are `RUNNING`, `SUCCEEDED`, `FAILED`, `PERSISTING`, `PERSIST_SUCCEEDED`, `PERSIST_FAILED`, `CLOSED` and `STORE_RESIDENT`.
`start_time_in_millis` | The start time in milliseconds.
`expiration_time_in_millis` | The expiration time in milliseconds.
`took` | The total time that the search is running.
`response` | The actual search response.
`num_reduce_phases` | The number of times that the coordinating node aggregates results from batches of shard responses (5 by default). If this number increases compared to the last retrieved results, you can expect additional results to be included in the search response.
`total` | The total number of shards that run the search.
`successful` | The number of shard responses that the coordinating node received successfully.
`aggregations` | The partial aggregation results that have been completed by the shards so far.

## Get partial results
Introduced 1.0
{: .label .label-purple }

After you submit an asynchronous search request, you can request partial responses with the ID that you see in the asynchronous search response.

```json
GET _plugins/_asynchronous_search/<ID>?pretty
```

#### Example response

```json
{
  "id": "Fk9lQk5aWHJIUUltR2xGWnpVcWtFdVEURUN1SWZYUUJBVkFVMEJCTUlZUUoAAAAAAAAAAg==",
  "state": "STORE_RESIDENT",
  "start_time_in_millis": 1599833907465,
  "expiration_time_in_millis": 1600265907465,
  "response": {
    "took": 83,
    "timed_out": false,
    "_shards": {
      "total": 20,
      "successful": 20,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 1000,
        "relation": "eq"
      },
      "max_score": 1,
      "hits": [
        {
          "_index": "bank",
          "_id": "1",
          "_score": 1,
          "_source": {
            "email": "amberduke@abc.com",
            "city": "Brogan",
            "state": "IL"
          }
        },
       {....}
      ]
    },
    "aggregations": {
      "city": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 997,
        "buckets": [
          {
            "key": "belvoir",
            "doc_count": 2
          },
          {
            "key": "aberdeen",
            "doc_count": 1
          },
          {
            "key": "abiquiu",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

After the response is successfully persisted, you get back the `STORE_RESIDENT` state in the response.

You can poll the ID with the `wait_for_completion_timeout` parameter to wait for the results received for the time that you specify.

For asynchronous searches with `keep_on_completion` as `true` and a sufficiently long `keep_alive` time, you can keep polling the IDs until the search finishes. If you don’t want to periodically poll each ID, you can retain the results in your cluster with the `keep_alive` parameter and come back to it at a later time.

## Delete searches and results
Introduced 1.0
{: .label .label-purple }

To delete an asynchronous search:

```
DELETE _plugins/_asynchronous_search/<ID>?pretty
```

- If the search is still running, OpenSearch cancels it.
- If the search is complete, OpenSearch deletes the saved results.


#### Example response

```json
{
  "acknowledged": "true"
}
```

## Monitor stats
Introduced 1.0
{: .label .label-purple }

You can use the stats API operation to monitor asynchronous searches that are running, completed, and/or persisted.

```json
GET _plugins/_asynchronous_search/stats
```

#### Example response

```json
{
  "_nodes": {
    "total": 8,
    "successful": 8,
    "failed": 0
  },
  "cluster_name": "264071961897:asynchronous-search",
  "nodes": {
    "JKEFl6pdRC-xNkKQauy7Yg": {
      "asynchronous_search_stats": {
        "submitted": 18236,
        "initialized": 112,
        "search_failed": 56,
        "search_completed": 56,
        "rejected": 18124,
        "persist_failed": 0,
        "cancelled": 1,
        "running_current": 399,
        "persisted": 100
      }
    }
  }
}
```

#### Response parameters

Options | Description
:--- | :---
`submitted` | The number of asynchronous search requests that were submitted.
`initialized` | The number of asynchronous search requests that were initialized.
`rejected` | The number of asynchronous search requests that were rejected.
`search_completed` | The number of asynchronous search requests that completed with a successful response.
`search_failed` | The number of asynchronous search requests that completed with a failed response.
`persisted` | The number of asynchronous search requests whose final result successfully persisted in the cluster.
`persist_failed` | The number of asynchronous search requests whose final result failed to persist in the cluster.
`running_current` | The number of asynchronous search requests that are running on a given coordinator node.
`cancelled` | The number of asynchronous search requests that were canceled while the search was running.
