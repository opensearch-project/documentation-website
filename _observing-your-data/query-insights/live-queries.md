---
layout: default
title: Live queries
parent: Query insights
nav_order: 20
---

# Live queries

Monitoring live queries using query insights allows you to get real-time visibility into the search queries that are currently executing within your OpenSearch cluster. This is useful for identifying and debugging queries that might be running for an unexpectedly long time or consuming significant resources *right now*.

## Monitoring live queries

You can use the Live Queries API endpoint to retrieve currently running search queries across the cluster or on specific nodes.

### API endpoint
To retrieve live queries across all nodes in the cluster:

```json
GET /_insights/live_queries
```
{% include copy-curl.html %}

To retrieve live queries from specific nodes, provide a comma-separated list of node IDs:

```json
GET /_insights/live_queries?nodeId={nodeIds}
```
{% include copy-curl.html %}

The API returns a list of currently executing search queries, sorted by latency in descending order.

By default, the response includes verbose information about each query. You can control this using the `verbose` parameter (defaults to `true`). Setting `verbose=false` might provide a more concise output if needed/.

```json
GET /_insights/live_queries?verbose=false
```
{% include copy-curl.html %}

The response includes details for each live query, such as the query source, search type, involved indices, node id, start time, latency and resource usages (on coordinator node) so far.

**Response fields:**

| Field               | Data Type | Description                                                                                                |
| :------------------ | :-------- | :--------------------------------------------------------------------------------------------------------- |
| `timestamp`         | Long      | The time the query task started, in milliseconds since the epoch.                                          |
| `id`          | String    | The unique identifier of the Search Request, i.e. SearchTask ID associated with the query.                                     |
| `description`| String | A description of the query, including the indices, search type, and query source. Only included if `verbose` is `true` (the default).          |
| `node_id`| String    | The coordinator node ID of the node where the query task is running.                                                        |
| `measurements`      | Object    | An object containing performance metrics gathered so far for the query.                                     |
| `measurements.LATENCY` | Object    | Contains the `value` (current running time in nanoseconds) and `unit` (`nanos`).                           |
| `measurements.CPU`    | Object    | Contains the `value` (CPU time consumed so far in nanoseconds) and `unit` (`nanos`).                      |
| `measurements.MEMORY` | Object    | Contains the `value` (heap memory used so far in bytes) and `unit` (`bytes`).                             |

Example response:

```json
{
  "live_queries" : [
    {
      "timestamp" : 1745019842751,
      "id" : "faQoGlu2T8iAcJtIP3vSDQ:303",
      "description" : "indices[my-index-*], search_type[QUERY_THEN_FETCH], source[{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"cyji\",\"boost\":1.0}}}}]",
      "node_id" : "faQoGlu2T8iAcJtIP3vSDQ",
      "measurements" : {
        "memory" : {
          "number" : 0,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "latency" : {
          "number" : 4036077541,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 0,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    },
    {
      "timestamp" : 1745019845138,
      "id" : "moUgDJqvRN-1e2XgnHfkpw:317",
      "description" : "indices[my-index-*], search_type[QUERY_THEN_FETCH], source[{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"cyji\",\"boost\":1.0}}}}]",
      "node_id" : "moUgDJqvRN-1e2XgnHfkpw",
      "measurements" : {
        "memory" : {
          "number" : 0,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "latency" : {
          "number" : 1649338375,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 0,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    }
  ]
}

```