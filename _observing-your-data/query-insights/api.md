---
layout: default
title: Query Insights API
parent: Query insights
nav_order: 50
---

# Query Insights API

The Query Insights plugin provides an API and metrics to monitor its health and performance, enabling proactive identification of issues that may affect query processing or system resources. 

## Health Stats API

The Health Stats API provides health metrics for each node running the Query Insights plugin. These metrics allow for an in-depth view of resource usage and the query processing component health.

### Path and HTTP methods

```json
GET _insights/health_stats
```

### Example request

```json
GET _insights/health_stats
```
{% include copy-curl.html %}

### Example response

The response includes a set of health-related fields for each node:

```json
PUT _cluster/settings
{
  "AqegbPL0Tv2XWvZV4PTS8Q": {
    "ThreadPoolInfo": {
      "query_insights_executor": {
        "type": "scaling",
        "core": 1,
        "max": 5,
        "keep_alive": "5m",
        "queue_size": 2
      }
    },
    "QueryRecordsQueueSize": 2,
    "TopQueriesHealthStats": {
      "latency": {
        "TopQueriesHeapSize": 5,
        "QueryGroupCount_Total": 0,
        "QueryGroupCount_MaxHeap": 0
      },
      "memory": {
        "TopQueriesHeapSize": 5,
        "QueryGroupCount_Total": 0,
        "QueryGroupCount_MaxHeap": 0
      },
      "cpu": {
        "TopQueriesHeapSize": 5,
        "QueryGroupCount_Total": 0,
        "QueryGroupCount_MaxHeap": 0
      }
    }
  }
}
```

### Response fields

The following table lists all response body fields.

Field | Data type        | Description
:--- |:---| :---
`ThreadPoolInfo` | Object | Information about the Query Insights thread pool, including type, core count, max threads, and queue size. See [The ThreadPoolInfo object](#the-threadpoolinfo-object).
`QueryRecordsQueueSize` | Integer | The size of the queue that buffers incoming search queries before processing by Query Insights processors. A high value may suggest increased load or slower processing.
`TopQueriesHealthStats` | Object | Performance metrics for each top query service, providing details on memory allocation (heap size) and query grouping. See [The TopQueriesHealthStats object](#the-topquerieshealthstats-object).

### The ThreadPoolInfo object

The `ThreadPoolInfo` object contains the following detailed configuration and performance data for the thread pool dedicated to Query Insights.

Field | Data type        | Description
:--- |:---| :---
`type`| String | The thread pool type (for example, `scaling`).
`core`| Integer | The minimum number of threads in the thread pool.
`max`| Integer | The maximum number of threads in the thread pool.
`keep_alive`| Time unit | The amount of time for which idle threads are retained.
`queue_size`| Integer | The maximum number of tasks in the queue.

### The TopQueriesHealthStats object

The `TopQueriesHealthStats` provides breakdowns for latency, memory, and CPU usage and contains the following information.

Field | Data type        | Description
:--- |:---| :---
`TopQueriesHeapSize`| Integer | The heap memory allocation for the query group.
`QueryGroupCount_Total`| Integer | The total number of query groups processed.
`QueryGroupCount_MaxHeap`| Integer | The size of the max heap that stores all query groups in memory.
