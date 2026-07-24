---
layout: default
title: Metrics reference
parent: Performance Analyzer
nav_order: 3
redirect_from:
  - /monitoring-plugins/pa/reference/
---

# Performance Analyzer metrics reference

Performance Analyzer provides a number of metrics to help you evaluate performance. The following tables describe the available metrics, grouped by the dimensions that are most relevant for that metric. All metrics support the `avg`, `sum`, `min`, and `max` aggregations, although for certain metrics, the measured value is the same regardless of aggregation type. 

For information about each of the dimensions, see [dimensions reference](#dimensions-reference) later in this topic.

## Relevant dimensions: `ShardID`, `IndexName`, `Operation`, `ShardRole`

| Metric | Description |
| :--- | :--- |
| `CPU_Utilization` | CPU usage ratio. CPU time (in milliseconds) used by the associated thread(s) in the past five seconds, divided by 5000 milliseconds. |
| `Paging_MajfltRate` | The number of major faults per second in the past five seconds. A major fault requires the process to load a memory page from disk. |
| `Paging_MinfltRate` | The number of minor faults per second in the past five seconds. A minor fault does not requires the process to load a memory page from disk. |
| `Paging_RSS` | The number of pages the process has in real memory---the pages that count towards text, data, or stack space. This number does not include pages that have not been demand-loaded in or swapped out. |
| `Sched_Runtime` | Time (seconds) spent executing on the CPU per context switch. |
| `Sched_Waittime` | Time (seconds) spent waiting on a run queue per context switch. |
| `Sched_CtxRate` | Number of times run on the CPU per second in the past five seconds. |
| `Heap_AllocRate` | An approximation, in bytes, of the heap memory allocated per second in the last 5 seconds. |
| `IO_ReadThroughput` | Number of bytes read per second in the last five seconds. |
| `IO_WriteThroughput` | Number of bytes written per second in the last five seconds. |
| `IO_TotThroughput` | Number of bytes read or written per second in the last five seconds. |
| `IO_ReadSyscallRate` | Read system calls per second in the last five seconds. |
| `IO_WriteSyscallRate` | Write system calls per second in the last five seconds. |
| `IO_TotalSyscallRate` | Read and write system calls per second in the last five seconds. |
| `Thread_Blocked_Time` | The average amount of time, in seconds, that the associated thread has been blocked from entering or reentering a monitor. |
| `Thread_Blocked_Event` | The total number of times that the associated thread has been blocked from entering or reentering a monitor (that is, the number of times a thread has been in the `blocked` state). |
| `Thread_Waited_Time` | The average amount of time, in seconds, that the associated thread has waited to enter or reenter a monitor (that is, the amount of time a thread has been in the `WAITING` or `TIMED_WAITING` state)". |
| `Thread_Waited_Event` | The total number of times that the associated thread has waited to enter or reenter a monitor (that is, the number of times a thread has been in the `WAITING` or `TIMED_WAITING` state). |
| `ShardEvents` | The total number of events executed on a shard in the past five seconds. |
| `ShardBulkDocs` | The total number of documents indexed in the past five seconds. |

## Relevant dimensions: `ShardID`, `IndexName` 

| Metric | Description |
| :--- | :--- |
| `Indexing_ThrottleTime` | Time (milliseconds) that the index has been under merge throttling control in the past five seconds. |
| `Cache_Query_Hit` | The number of successful lookups in the query cache in the past five seconds. |
| `Cache_Query_Miss` | The number of lookups in the query cache that failed to retrieve a `DocIdSet` in the past five seconds. `DocIdSet` is a set of document IDs in Lucene. |
| `Cache_Query_Size` | Query cache memory size in bytes. |
| `Cache_FieldData_Eviction` | The number of times OpenSearch has evicted data from the `fielddata` heap space (occurs when the heap space is full) in the past five seconds. |
| `Cache_FieldData_Size` | `fielddata` memory size in bytes. |
| `Cache_Request_Hit` | The number of successful lookups in the shard request cache in the past five seconds. |
| `Cache_Request_Miss` | The number of lookups in the request cache that failed to retrieve the results of search requests in the past five seconds. |
| `Cache_Request_Eviction` | The number of times OpenSearch evicts data from shard request cache (occurs when the request cache is full) in the past five seconds. |
| `Cache_Request_Size` | Shard request cache memory size in bytes. |

## Relevant dimensions: `ShardID`, `IndexName`, `IndexingStage`  
  
| Metric | Description |
| :--- | :--- |
| `Indexing_Pressure_Current_Limits` | The total heap size, in bytes, that is available for use by an index shard in a particular indexing stage (Coordinating, Primary, or Replica). |
| `Indexing_Pressure_Current_Bytes` | The total heap size, in bytes, occupied by an index shard in a particular indexing stage (Coordinating, Primary, or Replica). |
| `Indexing_Pressure_Last_Successful_Timestamp` | The timestamp of a successful request for an index shard in a particular indexing stage (Coordinating, Primary, or Replica). |
| `Indexing_Pressure_Rejection_Count` | The total number of rejections performed by OpenSearch for an index shard in a particular indexing stage (Coordinating, Primary, or Replica). |
| `Indexing_Pressure_Average_Window_Throughput` | The average throughput of the last n requests (The value of n is determined by the `shard_indexing_pressure.secondary_parameter.throughput.request_size_window` setting) for an index shard in a particular indexing stage (Coordinating, Primary, or Replica). |
    
## Relevant dimensions: `Operation`, `Exception`, `Indices`, `HTTPRespCode`, `ShardID`, `IndexName`, `ShardRole`    
   
 | Metric | Description |
| :--- | :--- |
| `Latency` | Latency (milliseconds) of a request. |

## Relevant dimension: `MemType`   
   
 | Metric | Description |
| :--- | :--- |
| `GC_Collection_Event` | The number of garbage collections that have occurred in the past five seconds. |
| `GC_Collection_Time` | The approximate accumulated time (milliseconds) of all garbage collections that have occurred in the past five seconds. |
| `Heap_Committed` | The amount of memory (bytes) that is committed for the JVM to use. |
| `Heap_Init` | The amount of memory (bytes) that the JVM initially requests from the operating system for memory management. |
| `Heap_Max` | The maximum amount of memory (bytes) that can be used for memory management. |
| `Heap_Used` | The amount of used memory in bytes. |

## Relevant dimension: `DiskName`   
   
 | Metric | Description |
| :--- | :--- |
| `Disk_Utilization` | Disk utilization rate: percentage of disk time spent reading and writing by the OpenSearch process in the past five seconds. |
| `Disk_WaitTime` | Average duration (milliseconds) of read and write operations in the past five seconds. |
| `Disk_ServiceRate` | Service rate: MB read or written per second in the past five seconds. This metric assumes that each disk sector stores 512 bytes. |

## Relevant dimension: `DestAddr`   
   
 | Metric | Description |
| :--- | :--- |
| `Net_TCP_NumFlows` | The number of samples collected. Performance Analyzer collects 1 sample every 5 seconds. |
| `Net_TCP_TxQ` | The average number of TCP packets in the send buffer. |
| `Net_TCP_RxQ` | The average number of TCP packets in the receive buffer. |
| `Net_TCP_Lost` | The average number of unrecovered recurring timeouts. This number is reset when the recovery finishes or `SND.UNA` is advanced. `SND.UNA` is the sequence number of the first byte of data that has been sent but not yet acknowledged. |
| `Net_TCP_SendCWND` | The average size, in bytes, of the sending congestion window. |
| `Net_TCP_SSThresh` | The average size, in bytes, of the slow start size threshold. |

## Relevant dimension: `Direction`    
   
 | Metric | Description |
| :--- | :--- |
| `Net_PacketRate4` | The total number of IPv4 datagrams transmitted/received from/by interfaces per second, including those transmitted or received in error. |
| `Net_PacketDropRate4` | The total number of IPv4 datagrams transmitted or received in error per second. |
| `Net_PacketRate6` | The total number of IPv6 datagrams transmitted or received from or by interfaces per second, including those transmitted or received in error. |
| `Net_PacketDropRate6` | The total number of IPv6 datagrams transmitted or received in error per second. |
| `Net_Throughput` | The number of bits transmitted or received per second by all network interfaces. |


## Relevant dimension: `ThreadPoolType`   
   
 | Metric | Description |
| :--- | :--- |
| `ThreadPool_QueueSize` | The size of the task queue. |
| `ThreadPool_RejectedReqs` | The number of rejected executions. |
| `ThreadPool_TotalThreads` | The current number of threads in the pool. |
| `ThreadPool_ActiveThreads` | The approximate number of threads that are actively executing tasks. |
| `ThreadPool_QueueLatency` | The latency of the task queue. |
| `ThreadPool_QueueCapacity` | The current capacity of the task queue. |

## Relevant dimension: `ClusterManager_PendingTaskType`  
   
 | Metric | Description |
| :--- | :--- |
| `ClusterManager_PendingQueueSize` | The current number of pending tasks in the cluster state update thread. Each node has a cluster state update thread that submits cluster state update tasks, such as create index, update mapping, allocate shard, and fail shard. |

## Relevant dimensions: `Operation`, `Exception`, `Indices`, `HTTPRespCode`   
   
| Metric | Description |
| :--- | :--- |
| `HTTP_RequestDocs` | The number of items in the request (only for the `_bulk` request type). |
| `HTTP_TotalRequests` | The number of requests completed in the last 5 seconds. |

## Relevant dimension: `CBType` 
  
| Metric | Description |
| :--- | :--- |
| `CB_EstimatedSize` | The current number of estimated bytes. |
| `CB_TrippedEvents` | The number of times that the circuit breaker has tripped. |
| `CB_ConfiguredSize` | The limit, in bytes, of the amount of memory operations can use. |

## Relevant dimensions: `ClusterManagerTaskInsertOrder`, `ClusterManagerTaskPriority`, `ClusterManagerTaskType`, `ClusterManagerTaskMetadata`
 
| Metric | Description |
| :--- | :--- |
| `ClusterManager_Task_Queue_Time` | The amount of time, in milliseconds, that a cluster manager task spent in the queue. |
| `ClusterManager_Task_Run_Time` | The amount of time, in milliseconds, that a cluster manager task has been running. |
     
## Relevant dimension: `CacheType` 
  
| Metric | Description |
| :--- | :--- |
| `Cache_MaxSize` | The maximum size of the cache, in bytes. |

## Relevant dimension: `ControllerName` 
| Metric | Description |
| :--- | :--- |
| `AdmissionControl_RejectionCount` | The total number of rejections performed by a Controller of Admission Control. |
| `AdmissionControl_CurrentValue` | The current value for Controller of Admission Control. |
| `AdmissionControl_ThresholdValue` | The threshold value for Controller of Admission Control. |

## Relevant dimension: `NodeID` 
  
| Metric | Description |
| :--- | :--- |
| `Data_RetryingPendingTasksCount` | The number of throttled pending tasks on which the data node is actively performing retries. This is an absolute metric measured at the current timestamp. |
| `ClusterManager_ThrottledPendingTasksCount` | The sum of the total pending tasks that were throttled by the cluster manager node. This is a cumulative metric, so make sure to check the max aggregation. |

## Relevant dimensions: N/A
The following metrics are relevant to the cluster as a whole and do not require specific dimensions.

| Metric | Description |
| :--- | :--- |
| `Election_Term` | A number that increases monotonically with every cluster manager election. |
| `PublishClusterState_Latency` | The amount of time taken by the quorum of nodes to publish the new cluster state. This metric is available for the current cluster manager. |
| `PublishClusterState_Failure` | The number of times the new cluster state failed to publish on the cluster manager node. |
| `ClusterApplierService_Latency` | The amount of time taken by each node for the apply cluster state sent by the cluster manager. |
| `ClusterApplierService_Failure` | The number of times that the apply cluster state action failed on each node. |

## Relevant dimensions: `IndexName`, `NodeName`, `ShardType`, `ShardID`
  
| Metric | Description |
| :--- | :--- |
| `Shard_State` | The state of each shard, for example, `STARTED`, `UNASSIGNED`, or `RELOCATING`. |

## Relevant dimensions: `NodeID`, `searchbp_mode`

| Metric | Description |
| :--- | :--- |
| `SearchBP_Shard_Stats_CancellationCount` | The number of tasks marked for cancellation at the shard task level. |
| `SearchBP_Shard_Stats_LimitReachedCount` | The number of times that the cancellable task total exceeded the set cancellation threshold at the shard task level. |
| `SearchBP_Shard_Stats_Resource_Heap_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive heap usage since the node last restarted at the shard task level. |
| `SearchBP_Shard_Stats_Resource_Heap_Usage_CurrentMax` | The maximum heap usage for tasks currently running at the shard task level. |
| `SearchBP_Shard_Stats_Resource_Heap_Usage_RollingAvg` | The rolling average heap usage for the `n` most recent tasks at the shard task level. The default value for `n` is `100`. |
| `SearchBP_Shard_Stats_Resource_CPU_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive CPU usage since the node last restarted at the shard task level. |
| `SearchBP_Shard_Stats_Resource_CPU_Usage_CurrentMax` | The maximum CPU time for all tasks currently running on the node at the shard task level. |
| `SearchBP_Shard_Stats_Resource_CPU_Usage_CurrentAvg` | The average CPU time for all tasks currently running on the node at the shard task level. |
| `SearchBP_Shard_Stats_Resource_ElaspedTime_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive time elapsed since the node last restarted at the shard task level. |
| `SearchBP_Shard_Stats_Resource_ElaspedTime_Usage_CurrentMax` | The maximum time elapsed for all tasks currently running on the node at the shard task level. |
| `SearchBP_Shard_Stats_Resource_ElaspedTime_Usage_CurrentAvg` | The average time elapsed for all tasks currently running on the node at the shard task level. |
| `Searchbp_Task_Stats_CancellationCount` | The number of tasks marked for cancellation at the search task level. |
| `SearchBP_Task_Stats_LimitReachedCount` | The number of times that the cancellable task total exceeded the set cancellation threshold at the search task level. |
| `SearchBP_Task_Stats_Resource_Heap_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive heap usage since the node last restarted at the search task level. |
| `SearchBP_Task_Stats_Resource_Heap_Usage_CurrentMax` | The maximum heap usage for tasks currently running at the search task level. |
| `SearchBP_Task_Stats_Resource_Heap_Usage_RollingAvg` | The rolling average heap usage for the `n` most recent tasks at the search task level. The default value for `n` is `10`. |
| `SearchBP_Task_Stats_Resource_CPU_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive CPU usage since the node last restarted at the search task level. |
| `SearchBP_Task_Stats_Resource_CPU_Usage_CurrentMax` | The maximum CPU time for all tasks currently running on the node at the search task level. |
| `SearchBP_Task_Stats_Resource_CPU_Usage_CurrentAvg` | The average CPU time for all tasks currently running on the node at the search task level. |
| `SearchBP_Task_Stats_Resource_ElaspedTime_Usage_CancellationCount` | The number of tasks marked for cancellation because of excessive time elapsed since the node last restarted at the search task level. |
| `SearchBP_Task_Stats_Resource_ElaspedTime_Usage_CurrentMax` | The maximum time elapsed for all tasks currently running on the node at the search task level. |
| `SearchBP_Task_Stats_Resource_ElaspedTime_Usage_CurrentAvg` | The average time elapsed for all tasks currently running on the node at the search task level. | 


## Dimensions reference

| Dimension            | Return values                                   |
|----------------------|-------------------------------------------------|
| `ShardID`              | The ID of the shard, for example, `1`.           |
| `IndexName`            | The name of the index, for example, `my-index`.   |
| `Operation`            | The type of operation, for example, `shardbulk`.  |
| `ShardRole`            | The shard role, for example, `primary` or `replica`.                            |
| `Exception`            | OpenSearch exceptions, for example, `org.opensearch.index_not_found_exception`. |
| `Indices`              | The list of indexes in the request URL.        |
| `HTTPRespCode`         | The OpenSearch response code, for example, `200`. |
| `MemType`              | The memory type, for example, `totYoungGC`, `totFullGC`, `Survivor`, `PermGen`, `OldGen`, `Eden`, `NonHeap`, or `Heap`. |
| `DiskName`             | The name of the disk, for example, `sda1`.        |
| `DestAddr`             | The destination address, for example, `010015AC`. |
| `Direction`            | The direction, for example, `in` or `out`.                                    |
| `ThreadPoolType`       | The OpenSearch thread pools, for example, `index`, `search`, or `snapshot`. |
| `CBType`               | The circuit breaker type, for example, `accounting`, `fielddata`, `in_flight_requests`, `parent`, or `request`. |
| `ClusterManagerTaskInsertOrder`| The order in which the task was inserted, for example, `3691`. |
| `ClusterManagerTaskPriority`   | The priority of the task, for example, `URGENT`. OpenSearch executes higher-priority tasks before lower-priority ones, regardless of `insert_order`. |
| `ClusterManagerTaskType`       | The task type, for example, `shard-started`, `create-index`, `delete-index`, `refresh-mapping`, `put-mapping`, `CleanupSnapshotRestoreState`, or `Update snapshot state`. |
| `ClusterManagerTaskMetadata`   | The metadata for the task (if any).                 |
| `CacheType`            | The cache type, for example, `Field_Data_Cache`, `Shard_Request_Cache`, or `Node_Query_Cache`. |
| `NodeID`               | The ID of the node.                                |
| `Searchbp_mode`        | The search backpressure mode, for example, `monitor_only` (default), `enforced`, or `disabled`. |
