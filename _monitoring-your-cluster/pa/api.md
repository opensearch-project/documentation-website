---
layout: default
title: API
parent: Performance Analyzer
nav_order: 1
redirect_from:
  - /monitoring-plugins/pa/api/
---

# Performance Analyzer API
Introduced 1.0
{: .label .label-purple }

Performance Analyzer uses a single HTTP method and URI for most requests:

```
GET <endpoint>:9600/_plugins/_performanceanalyzer/metrics
```

Note the use of port 9600. Provide parameters for metrics, aggregations, dimensions, and nodes (optional):

```
?metrics=<metrics>&agg=<aggregations>&dim=<dimensions>&nodes=all"
```

For a full list of metrics, see [Metrics reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/reference/). Performance Analyzer updates its data every five seconds. If you create a custom client, we recommend using that same interval for calls to the API.


#### Example request

```
GET localhost:9600/_plugins/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all
```


#### Example response

```json
{
  "keHlhQbbTpm1BYicficEQg": {
    "timestamp": 1554940530000,
    "data": {
      "fields": [{
          "name": "ShardID",
          "type": "VARCHAR"
        },
        {
          "name": "Latency",
          "type": "DOUBLE"
        },
        {
          "name": "CPU_Utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          null,
          0.012552206029147535
        ],
        [
          "1",
          4.8,
          0.0009780939762972104
        ]
      ]
    }
  },
  "bHdpbMJZTs-TKtZro2SmYA": {
    "timestamp": 1554940530000,
    "data": {
      "fields": [{
          "name": "ShardID",
          "type": "VARCHAR"
        },
        {
          "name": "Latency",
          "type": "DOUBLE"
        },
        {
          "name": "CPU_Utilization",
          "type": "DOUBLE"
        }
      ],
      "records": [
        [
          null,
          18.2,
          0.011966493817311527
        ],
        [
          "1",
          14.8,
          0.0007670829370071493
        ]
      ]
    }
  }
}
```

In this case, each top-level object represents a node. The API returns names and data types for the metrics and dimensions that you specified, along with values from five seconds ago and current values (if different). Null values represent inactivity during that time period.

Performance Analyzer has one additional URI that returns the unit for each metric.


#### Example request

```
GET localhost:9600/_plugins/_performanceanalyzer/metrics/units
```


#### Example response

```json
{
  "Disk_Utilization": "%",
  "Cache_Request_Hit": "count",
  "HTTP_RequestDocs": "count",
  "Net_TCP_Lost": "segments/flow",
  "Refresh_Time": "ms",
  "GC_Collection_Event": "count",
  "Merge_Time": "ms",
  "Sched_CtxRate": "count/s",
  "Cache_Request_Size": "B",
  "ThreadPool_QueueSize": "count",
  "Sched_Runtime": "s/ctxswitch",
  "Disk_ServiceRate": "MB/s",
  "Heap_AllocRate": "B/s",
  "Heap_Max": "B",
  "Sched_Waittime": "s/ctxswitch",
  "ShardBulkDocs": "count",
  "Thread_Blocked_Time": "s/event",
  "VersionMap_Memory": "B",
  "Master_Task_Queue_Time": "ms",
  "Merge_CurrentEvent": "count",
  "Indexing_Buffer": "B",
  "Bitset_Memory": "B",
  "Net_PacketDropRate4": "packets/s",
  "Heap_Committed": "B",
  "Net_PacketDropRate6": "packets/s",
  "Thread_Blocked_Event": "count",
  "GC_Collection_Time": "ms",
  "Cache_Query_Miss": "count",
  "IO_TotThroughput": "B/s",
  "Latency": "ms",
  "Net_PacketRate6": "packets/s",
  "Cache_Query_Hit": "count",
  "IO_ReadSyscallRate": "count/s",
  "Net_PacketRate4": "packets/s",
  "Cache_Request_Miss": "count",
  "CB_ConfiguredSize": "B",
  "CB_TrippedEvents": "count",
  "ThreadPool_RejectedReqs": "count",
  "Disk_WaitTime": "ms",
  "Net_TCP_TxQ": "segments/flow",
  "Master_Task_Run_Time": "ms",
  "IO_WriteSyscallRate": "count/s",
  "IO_WriteThroughput": "B/s",
  "Flush_Event": "count",
  "Net_TCP_RxQ": "segments/flow",
  "Refresh_Event": "count",
  "Flush_Time": "ms",
  "Heap_Init": "B",
  "CPU_Utilization": "cores",
  "HTTP_TotalRequests": "count",
  "ThreadPool_ActiveThreads": "count",
  "Cache_Query_Size": "B",
  "Paging_MinfltRate": "count/s",
  "Merge_Event": "count",
  "Net_TCP_SendCWND": "B/flow",
  "Cache_Request_Eviction": "count",
  "Segments_Total": "count",
  "Heap_Used": "B",
  "Cache_FieldData_Eviction": "count",
  "IO_TotalSyscallRate": "count/s",
  "CB_EstimatedSize": "B",
  "Net_Throughput": "B/s",
  "Paging_RSS": "pages",
  "Indexing_ThrottleTime": "ms",
  "IndexWriter_Memory": "B",
  "Master_PendingQueueSize": "count",
  "Net_TCP_SSThresh": "B/flow",
  "Cache_FieldData_Size": "B",
  "Paging_MajfltRate": "count/s",
  "ThreadPool_TotalThreads": "count",
  "IO_ReadThroughput": "B/s",
  "ShardEvents": "count",
  "Net_TCP_NumFlows": "count"
}
```
