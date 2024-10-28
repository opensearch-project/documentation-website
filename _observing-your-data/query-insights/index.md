---
layout: default
title: Query insights
nav_order: 40
has_children: true
has_toc: false
---

# Query insights
**Introduced 2.12**
{: .label .label-purple }

To monitor and analyze the search queries within your OpenSearch cluster, you can obtain query insights. With minimal performance impact, query insights features aim to provide comprehensive insights into search query execution, enabling you to better understand search query characteristics, patterns, and system behavior during query execution stages. Query insights facilitate enhanced detection, diagnosis, and prevention of query performance issues, ultimately improving query processing performance, user experience, and overall system resilience.

Typical use cases for query insights features include the following:

- Identifying top queries by latency within specific time frames
- Debugging slow search queries and latency spikes

Query insights features are supported by the Query Insights plugin. At a high level, query insights features comprise the following components:

* _Collectors_: Gather performance-related data points at various stages of search query execution.
* _Processors_: Perform lightweight aggregation and processing on data collected by the collectors.
* _Exporters_: Export the data into different sinks.


## Installing the Query Insights plugin

You need to install the `query-insights` plugin to enable query insights features. To install the plugin, run the following command:

```bash
bin/opensearch-plugin install query-insights
```
For information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Query Insights settings

You can obtain the following information using Query Insights:

- [Top n queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/)
- [Grouping top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/grouping-top-n-queries/)
- [Query metrics]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/query-metrics/)

## Monitoring Health of the Query Insights Plugin
The Query Insights plugin provides an API and metrics to monitor its health and performance, enabling proactive identification of issues that may affect query processing or system resources. 

### Health Stats API
The health_stats API provides health metrics for each node running the Query Insights plugin. These metrics allow for an in-depth view of resource usage and the health of query processing components.

To retrieve health statistics, make the following API call:
```json
GET _insights/health_stats
```

The response includes a set of health-related fields for each node:

Field | Data type        | Description
:--- |:---| :---
`ThreadPoolInfo` | Object | Information about the Query Insights thread pool, including type, core count, max threads, and queue size.
`QueryRecordsQueueSize` | Integer | The size of the queue that buffers incoming search queries before processing by Query Insights processors.
`TopQueriesHealthStats` | Object | Performance metrics for each top query service, providing details on memory allocation (heap size) and query grouping.

Below is a sample response, showing health stats for a node identified by "AqegbPL0Tv2XWvZV4PTS8Q":
```json
PUT _cluster/settings
{
  "AqegbPL0Tv2XWvZV4PTS8Q" : {
    "ThreadPoolInfo" : {
      "query_insights_executor" : {
        "type" : "scaling",
        "core" : 1,
        "max" : 5,
        "keep_alive" : "5m",
        "queue_size" : 2
      }
    },
    "QueryRecordsQueueSize" : 2,
    "TopQueriesHealthStats" : {
      "latency" : {
        "TopQueriesHeapSize" : 5,
        "QueryGroupCount_Total" : 0,
        "QueryGroupCount_MaxHeap" : 0
      },
      "memory" : {
        "TopQueriesHeapSize" : 5,
        "QueryGroupCount_Total" : 0,
        "QueryGroupCount_MaxHeap" : 0
      },
      "cpu" : {
        "TopQueriesHeapSize" : 5,
        "QueryGroupCount_Total" : 0,
        "QueryGroupCount_MaxHeap" : 0
      }
    }
  }
}
```
Field Descriptions:
- `ThreadPoolInfo`: Contains detailed configuration and performance data for the thread pool dedicated to Query Insights. The fields include:
  - `type`: Type of thread pool (e.g., scaling).
  - `core`: Minimum number of threads.
  - `max`: Maximum number of threads.
  - `keep_alive`: Time for which idle threads are retained.
  - `queue_size`: Maximum number of tasks in the queue.
- `QueryRecordsQueueSize`: Indicates the size of the buffer queue holding incoming search queries. A high value may suggest increased load or slower processing.
- `TopQueriesHealthStats`: Provides breakdowns for latency, memory, and CPU usage for the top queries service:
  - `TopQueriesHeapSize`: Memory allocation for the query group heap.
  - `QueryGroupCount_Total`: Total number of query groups processed.
  - `QueryGroupCount_MaxHeap`: The size of the Max Heap that stores all query groups in memory.

### OpenTelemetry Counters for error metrics
Query Insights integrates with OpenTelemetry to provide real-time error metrics. These counters help identify specific operational failures in Query Insights and improve reliability.

Field | Description
:--- | :---
 LOCAL_INDEX_READER_PARSING_EXCEPTIONS | Number of errors when parsing with LocalIndexReader
LOCAL_INDEX_EXPORTER_BULK_FAILURES | Number of failures when ingesting Query Insights data to local indices
LOCAL_INDEX_EXPORTER_EXCEPTIONS | Number of exceptions in Query Insights LocalIndexExporter
INVALID_EXPORTER_TYPE_FAILURES | Number of invalid exporter type failures
INVALID_INDEX_PATTERN_EXCEPTIONS | Number of invalid index pattern exceptions
DATA_INGEST_EXCEPTIONS | Number of exceptions during data ingest in Query Insights
QUERY_CATEGORIZE_EXCEPTIONS | Number of exceptions when categorizing the queries
EXPORTER_FAIL_TO_CLOSE_EXCEPTION | Number of failures when closing the exporter

Each metric provides targeted insights into potential error sources within the Query Insights workflow, allowing for more focused debugging and maintenance.