---
layout: default
title: Live queries
parent: Query insights
nav_order: 20
---

# Live queries
**Introduced 3.0**

Monitoring live queries using query insights allows you to get real-time visibility into the search queries that are currently executing within your OpenSearch cluster. This is useful for identifying and debugging queries that might be running for an unexpectedly long time or consuming significant resources *right now*.

## Monitoring live queries

You can use the Live Queries API endpoint to retrieve currently running search queries across the cluster or on specific nodes.

### API endpoint
To retrieve live queries across all nodes in the cluster:

```json
GET /_insights/live_queries
```
{% include copy-curl.html %}

The API returns a list of currently executing search queries, sorted by a specified metric (defaulting to latency) in descending order.

You can control the output and sorting behavior using the following query parameters:

*   `verbose`: (Optional, Boolean, defaults to `true`) Set to `false` for a more concise output without the detailed query information.
*   `nodeId`: (Optional, String) A comma-separated list of node IDs to filter the results. If omitted, queries from all nodes are returned.
*   `sort`: (Optional, String, defaults to `latency`) Specifies the metric to sort the results by. Valid values are `latency`, `cpu`, `memory`.
*   `size`: (Optional, Integer, defaults to 100) Limits the number of query records returned.

Example requesting top 10 queries sorted by CPU usage, with verbose output disabled:
```json
GET /_insights/live_queries?verbose=false&sort=cpu&size=10
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
