---
layout: default
title: Live queries
parent: Query insights
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/observing-your-data/query-insights/live-queries/
---

# Live queries
**Introduced 3.0**
{: .label .label-purple }

Use the Live Queries API to retrieve currently running search queries across the cluster or on specific nodes. Monitoring live queries using Query Insights allows you to get real-time visibility into the search queries that are currently executing within your OpenSearch cluster. This is useful for identifying and debugging queries that might be running for an unexpectedly long time or consuming significant resources at the moment.

The API returns a list of currently executing search queries, sorted by a specified metric (defaulting to `latency`) in descending order. The response includes the details for each live query, such as the query source, search type, involved indexes, node ID, start time, latency, and resource usage (on the coordinator node) so far.

## Endpoints

```json
GET /_insights/live_queries
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `verbose` | Boolean | Whether to include detailed query information in the output. Default is `true`. |
| `nodeId` | String | A comma-separated list of node IDs used to filter the results. If omitted, queries from all nodes are returned. |
| `sort` | String | The metric to sort the results by. Valid values are `latency`, `cpu`, or `memory`. Default is `latency`. |
| `size` | Integer | The number of query records to return. Default is 100. |

## Example request

The following example request fetches the top 10 queries sorted by CPU usage, with verbose output disabled:

```json
GET /_insights/live_queries?verbose=false&sort=cpu&size=10
```
{% include copy-curl.html %}

## Example response

```json
{
  "live_queries" : [
    {
      "timestamp" : 1745359226777,
      "id" : "troGHNGUShqDj3wK_K5ZIw:512",
      "description" : "indices[my-index-*], search_type[QUERY_THEN_FETCH], source[{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"userId\",\"boost\":1.0}}}}]",
      "node_id" : "troGHNGUShqDj3wK_K5ZIw",
      "measurements" : {
        "latency" : {
          "number" : 13959364458,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "memory" : {
          "number" : 3104,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 405000,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    },
    {
      "timestamp" : 1745359229158,
      "id" : "Y6eBnbdISPO6XaVfxCBRgg:454",
      "description" : "indices[my-index-*], search_type[QUERY_THEN_FETCH], source[{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"userId\",\"boost\":1.0}}}}]",
      "node_id" : "Y6eBnbdISPO6XaVfxCBRgg",
      "measurements" : {
        "latency" : {
          "number" : 11579097209,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "memory" : {
          "number" : 3104,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 511000,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    }
  ]
}
```

## Response fields

| Field               | Data type | Description                                                                                                |
| :------------------ | :-------- | :--------------------------------------------------------------------------------------------------------- |
| `timestamp`         | Long      | The time at which the query task started, in milliseconds since the epoch.                                          |
| `id`          | String    | The unique identifier of the search request (the search task ID associated with the query).                                     |
| `description`| String | A description of the query, including the indexes on which it runs, search type, and query source. Only included if `verbose` is `true` (default).          |
| `node_id`| String    | The coordinator node ID of the node on which the query task is running.                                                        |
| `measurements`      | Object    | An object containing performance metrics gathered so far for the query.                                     |
| `measurements.LATENCY` | Object    | Contains the `value` (current running time in nanoseconds) and `unit` (`nanos`).                           |
| `measurements.CPU`    | Object    | Contains the `value` (CPU time consumed so far in nanoseconds) and `unit` (`nanos`).                      |
| `measurements.MEMORY` | Object    | Contains the `value` (heap memory used so far in bytes) and `unit` (`bytes`).                             |
