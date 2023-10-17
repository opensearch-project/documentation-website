---
layout: default
title: Metrics Reference
parent: Performance Analyzer
nav_order: 3
redirect_from:
  - /monitoring-plugins/pa/reference/
---

# Metrics reference

Performance Analyzer provides a number of metrics to help you evaluate performance. The following tables describe the available metrics, grouped by the dimensions that are most relevant for that metric. All metrics support the `avg`, `sum`, `min`, and `max` aggregations, although for certain metrics, the measured value is the same regardless of aggregation type. 

For information about each of the dimensions, see [dimensions reference](#dimensions-reference) later in this topic.

This list is extensive. We recommend using Ctrl/Cmd + F to find what you're looking for.
{: .tip }

## Relevant dimensions: `ShardID`, `IndexName`, `Operation`, `ShardRole`

<table>
 <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Description</th>
    </tr>
 </thead>
  <tbody>
    <tr>
      <td>CPU_Utilization
      </td>
      <td>CPU usage ratio. CPU time (in milliseconds) used by the associated thread(s) in the past five seconds, divided by 5000 milliseconds.
      </td>
    </tr>
    <tr>
      <td>Paging_MajfltRate
      </td>
      <td>The number of major faults per second in the past five seconds. A major fault requires the process to load a memory page from disk.
      </td>
    </tr>
    <tr>
      <td>Paging_MinfltRate
      </td>
      <td>The number of minor faults per second in the past five seconds. A minor fault does not requires the process to load a memory page from disk.
      </td>
    </tr>
    <tr>
      <td>Paging_RSS
      </td>
      <td>The number of pages the process has in real memory---the pages that count towards text, data, or stack space. This number does not include pages that have not been demand-loaded in or swapped out.
      </td>
    </tr>
    <tr>
      <td>Sched_Runtime
      </td>
      <td>Time (seconds) spent executing on the CPU per context switch.
      </td>
    </tr>
    <tr>
      <td>Sched_Waittime
      </td>
      <td>Time (seconds) spent waiting on a run queue per context switch.
      </td>
    </tr>
    <tr>
      <td>Sched_CtxRate
      </td>
      <td>Number of times run on the CPU per second in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Heap_AllocRate
      </td>
      <td>An approximation, in bytes, of the heap memory allocated per second in the last 5 seconds.
      </td>
    </tr>
    <tr>
      <td>IO_ReadThroughput
      </td>
      <td>Number of bytes read per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_WriteThroughput
      </td>
      <td>Number of bytes written per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_TotThroughput
      </td>
      <td>Number of bytes read or written per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_ReadSyscallRate
      </td>
      <td>Read system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_WriteSyscallRate
      </td>
      <td>Write system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>IO_TotalSyscallRate
      </td>
      <td>Read and write system calls per second in the last five seconds.
      </td>
    </tr>
    <tr>
      <td>Thread_Blocked_Time
      </td>
      <td>The average amount of time, in seconds, that the associated thread has been blocked from entering or reentering a monitor.
      </td>
    </tr>
    <tr>
      <td>Thread_Blocked_Event
      </td>
      <td>The total number of times that the associated thread has been blocked from entering or reentering a monitor (that is, the number of times a thread has been in the `blocked` state).
      </td>
    </tr>
    <tr>
      <td>Thread_Waited_Time
      </td>
      <td>The average amount of time, in seconds, that the associated thread has waited to enter or reenter a monitor (that is, the amount of time a thread has been in the `WAITING` or `TIMED_WAITING` state)".
      </td>
    </tr>
    <tr>
      <td>Thread_Waited_Event
      </td>
      <td>The total number of times that the associated thread has waited to enter or reenter a monitor (that is, the number of times a thread has been in the <code>WAITING</code> or <code>TIMED_WAITING</code> state).
      </td>
    </tr>
    <tr>
      <td>ShardEvents
      </td>
      <td>The total number of events executed on a shard in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>ShardBulkDocs
      </td>
      <td>The total number of documents indexed in the past five seconds.
      </td>
    </tr> 
  </tbody>
</table>

## Relevant dimensions: `ShardID`, `IndexName` 

<table>
  <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
      <td>Indexing_ThrottleTime
      </td>
      <td>Time (milliseconds) that the index has been under merge throttling control in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Hit
      </td>
      <td>The number of successful lookups in the query cache in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Miss
      </td>
      <td>The number of lookups in the query cache that failed to retrieve a `DocIdSet` in the past five seconds. `DocIdSet` is a set of document IDs in Lucene.
      </td>
    </tr>
    <tr>
      <td>Cache_Query_Size
      </td>
      <td>Query cache memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Cache_FieldData_Eviction
      </td>
      <td>The number of times OpenSearch has evicted data from the fielddata heap space (occurs when the heap space is full) in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_FieldData_Size
      </td>
      <td>Fielddata memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Hit
      </td>
      <td>The number of successful lookups in the shard request cache in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Miss
      </td>
      <td>The number of lookups in the request cache that failed to retrieve the results of search requests in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Eviction
      </td>
      <td>The number of times OpenSearch evicts data from shard request cache (occurs when the request cache is full) in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Cache_Request_Size
      </td>
      <td>Shard request cache memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Refresh_Event
      </td>
      <td>The total number of refreshes executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Refresh_Time
      </td>
      <td>The total time (milliseconds) spent executing refreshes in the past five seconds
      </td>
    </tr>
    <tr>
      <td>Flush_Event
      </td>
      <td>The total number of flushes executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Flush_Time
      </td>
      <td>The total time (milliseconds) spent executing flushes in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_Event
      </td>
      <td>The total number of merges executed in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_Time
      </td>
      <td>The total time (milliseconds) spent executing merges in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Merge_CurrentEvent
      </td>
      <td>The current number of merges executing.
      </td>
    </tr>
    <tr>
      <td>Indexing_Buffer
      </td>
      <td>Index buffer memory size in bytes.
      </td>
    </tr>
    <tr>
      <td>Segments_Total
      </td>
      <td>The number of segments.
      </td>
    </tr>
    <tr>
      <td>IndexWriter_Memory
      </td>
      <td>Estimated memory usage by the index writer in bytes.
      </td>
    </tr>
    <tr>
      <td>Bitset_Memory
      </td>
      <td>Estimated memory usage for the cached bit sets in bytes.
      </td>
    </tr>
    <tr>
      <td>VersionMap_Memory
      </td>
      <td>Estimated memory usage of the version map in bytes.
      </td>
    </tr>
    <tr>
      <td>Shard_Size_In_Bytes
      </td>
      <td>Estimated disk usage of the shard in bytes.
      </td>
    </tr>
  </tbody>
</table>

## Relevant dimensions: `ShardID`, `IndexName`, `IndexingStage`  
  
<table>
  <thead style="text-align: left">
   <tr>
    <th>Metric</th>
    <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Indexing_Pressure_Current_Limits
      </td>
      <td>The total heap size, in bytes, that is available for use by an index shard in a particular indexing stage (Coordinating, Primary, or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Current_Bytes
      </td>
      <td>The total heap size, in bytes, occupied by an index shard in a particular indexing stage (Coordinating, Primary, or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Last_Successful_Timestamp
      </td>
      <td>The timestamp of a successful request for an index shard in a particular indexing stage (Coordinating, Primary, or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Rejection_Count
      </td>
      <td>The total number of rejections performed by OpenSearch for an index shard in a particular indexing stage (Coordinating, Primary, or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Average_Window_Throughput
      </td>
      <td>The average throughput of the last n requests (The value of n is determined by the `shard_indexing_pressure.secondary_parameter.throughput.request_size_window` setting) for an index shard in a particular indexing stage (Coordinating, Primary, or Replica).
      </td>
    </tr>
   </tbody>
 </table>
    
## Relevant dimensions: `Operation`, `Exception`, `Indices`, `HTTPRespCode`, `ShardID`, `IndexName`, `ShardRole`    
   
 <table>
  <thead style="text-align: left">
    <tr>
     <th>Metric</th>
     <th>Description</th>
    </tr>
   </thead>
   <tbody>
    <tr>
     <td>Latency
      </td>
      <td>Latency (milliseconds) of a request.
      </td>
    </tr>
   </tbody>
 </table>

## Relevant dimension: `MemType`   
   
 <table>
   <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Description</th>
    </tr>
   </thead>
   <tbody>  
    <tr>
      <td>GC_Collection_Event
      </td>
      <td>The number of garbage collections that have occurred in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>GC_Collection_Time
      </td>
      <td>The approximate accumulated time (milliseconds) of all garbage collections that have occurred in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Heap_Committed
      </td>
      <td>The amount of memory (bytes) that is committed for the JVM to use.
      </td>
    </tr>
    <tr>
      <td>Heap_Init
      </td>
      <td>The amount of memory (bytes) that the JVM initially requests from the operating system for memory management.
      </td>
    </tr>
    <tr>
      <td>Heap_Max
      </td>
      <td>The maximum amount of memory (bytes) that can be used for memory management.
      </td>
    </tr>
    <tr>
      <td>Heap_Used
      </td>
      <td>The amount of used memory in bytes.
      </td>
    </tr>
   </tbody>
  </table>

## Relevant dimension: `DiskName`   
   
 <table>
   <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Description</th>
    </tr>
   </thead>
   <tbody>  
    <tr>
      <td>Disk_Utilization
      </td>
      <td>Disk utilization rate: percentage of disk time spent reading and writing by the OpenSearch process in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Disk_WaitTime
      </td>
      <td>Average duration (milliseconds) of read and write operations in the past five seconds.
      </td>
    </tr>
    <tr>
      <td>Disk_ServiceRate
      </td>
      <td>Service rate: MB read or written per second in the past five seconds. This metric assumes that each disk sector stores 512 bytes.
      </td>
    </tr>
  </tbody>
</table>

## Relevant dimension: `DestAddr`   
   
 <table>
  <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Net_TCP_NumFlows
     </td>
     <td>The number of samples collected. Performance Analyzer collects 1 sample every 5 seconds.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_TxQ
     </td>
     <td>The average number of TCP packets in the send buffer.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_RxQ
     </td>
     <td>The average number of TCP packets in the receive buffer.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_Lost
     </td>
     <td>The average number of unrecovered recurring timeouts. This number is reset when the recovery finishes or `SND.UNA` is advanced. `SND.UNA` is the sequence number of the first byte of data that has been sent but not yet acknowledged.
     </td>
  </tr>
  <tr>
     <td>Net_TCP_SendCWND
     </td>
     <td>The average size, in bytes, of the sending congestion window.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_SSThresh
     </td>
     <td>The average size, in bytes, of the slow start size threshold.
     </td>
   </tr>
 </tbody>
</table>

## Relevant dimension: `Direction`    
   
 <table>
   <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
   </thead>
   <tbody>  
    <tr>
     <td>Net_PacketRate4
     </td>
     <td>The total number of IPv4 datagrams transmitted/received from/by interfaces per second, including those transmitted or received in error.
     </td>
    </tr>
    <tr>
      <td>Net_PacketDropRate4
      </td>
      <td>The total number of IPv4 datagrams transmitted or received in error per second.
      </td>
    </tr>
    <tr>
      <td>Net_PacketRate6
      </td>
      <td>The total number of IPv6 datagrams transmitted or received from or by interfaces per second, including those transmitted or received in error.
      </td>
    </tr>
    <tr>
      <td>Net_PacketDropRate6
      </td>
      <td>The total number of IPv6 datagrams transmitted or received in error per second.
      </td>
    </tr>
    <tr>
      <td>Net_Throughput
      </td>
      <td>The number of bits transmitted or received per second by all network interfaces.
      </td>
    </tr>
   </tbody>
  </table>


## Relevant dimension: `ThreadPoolType`   
   
 <table>
   <thead style="text-align: left">
    <tr>
     <th>Metric</th>
     <th>Description</th>
    </tr>
  </thead>
  <tbody>  
   <tr>
     <td>ThreadPool_QueueSize
     </td>
     <td>The size of the task queue.
     </td>
   </tr>
   <tr>
     <td>ThreadPool_RejectedReqs
     </td>
     <td>The number of rejected executions.
     </td>
   </tr>
   <tr>
     <td>ThreadPool_TotalThreads
     </td>
     <td>The current number of threads in the pool.
     </td>
   </tr>
   <tr>
     <td>ThreadPool_ActiveThreads
     </td>
     <td>The approximate number of threads that are actively executing tasks.
     </td>
   </tr>
   <tr>
     <td>ThreadPool_QueueLatency
     </td>
     <td>The latency of the task queue.
     </td>
   </tr>
   <tr>
     <td>ThreadPool_QueueCapacity
     </td>
     <td>The current capacity of the task queue.
     </td>
    </tr>
  </tbody>
</table>

## Relevant dimension: `ClusterManager_PendingTaskType`  
   
 <table>
  <thead style="text-align: left">
   <tr>
    <th>Metric</th>
    <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>ClusterManager_PendingQueueSize
     </td>
     <td>The current number of pending tasks in the cluster state update thread. Each node has a cluster state update thread that submits cluster state update tasks, such as create index, update mapping, allocate shard, and fail shard.
     </td>
   </tr>
  </tbody>
 </table>

## Relevant dimensions: `Operation`, `Exception`, `Indices`, `HTTPRespCode`   
   
<table>
  <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
    <td>HTTP_RequestDocs
    </td>
    <td>The number of items in the request (only for the `_bulk` request type).
    </td>
  </tr>
  <tr>
    <td>HTTP_TotalRequests
    </td>
    <td>The number of requests completed in the last 5 seconds.
    </td>
  </tr>
  </tbody>
</table>

## Relevant dimension: `CBType` 
  
<table>
  <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>CB_EstimatedSize
     </td>
     <td>The current number of estimated bytes.
     </td>
    </tr>
    <tr>
     <td>CB_TrippedEvents
     </td>
     <td>The number of times that the circuit breaker has tripped.
     </td>
    </tr>
    <tr>
      <td>CB_ConfiguredSize
      </td>
      <td>The limit, in bytes, of the amount of memory operations can use.
      </td>
    </tr>
   </tbody>
  </table>

## Relevant dimensions: `ClusterManagerTaskInsertOrder`, `ClusterManagerTaskPriority`, `ClusterManagerTaskType`, `ClusterManagerTaskMetadata`
 
<table>
 <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
 </thead>
 <tbody>  
   <tr>
     <td>ClusterManager_Task_Queue_Time
     </td>
     <td>The amount of time, in milliseconds, that a cluster manager task spent in the queue.
     </td>
   </tr>
   <tr>
      <td>ClusterManager_Task_Run_Time
      </td>
      <td>The amount of time, in milliseconds, that a cluster manager task has been running.
      </td>
    </tr>
 </tbody>
</table>
     
## Relevant dimension: `CacheType` 
  
<table>
  <thead style="text-align: left">
    <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Cache_MaxSize
     </td>
     <td>The maximum size of the cache, in bytes.
     </td>
   </tr>
 </tbody>
</table>

## Relevant dimension: `ControllerName` 
<table>
 <thead style="text-align: left">
  <tr>
    <th>Metric</th>
    <th>Description</th>
  </tr>
 </thead>
 <tbody>  
  <tr>
    <td>AdmissionControl_RejectionCount 
    </td>
    <td>The total number of rejections performed by a Controller of Admission Control.
    </td>
  </tr>
  <tr>
    <td>AdmissionControl_CurrentValue 
    </td>
    <td>The current value for Controller of Admission Control.
    </td>
  </tr>
  <tr>
    <td>AdmissionControl_ThresholdValue
    </td>
    <td>The threshold value for Controller of Admission Control.
    </td>
  </tr>
 </tbody>
</table>

## Relevant dimension: `NodeID` 
  
<table>
  <thead style="text-align: left">
   <tr>
   <th>Metric</th>
   <th>Description</th>
    </tr>
  </thead>
  <tbody>  
    <tr>
      <td>Data_RetryingPendingTasksCount 
      </td>
      <td>The number of throttled pending tasks on which the data node is actively performing retries. It is an absolute metric at that point in time.
      </td>
    </tr>
    <tr>
      <td>ClusterManager_ThrottledPendingTasksCount 
      </td>
      <td>The sum of the total pending tasks that were throttled by the cluster manager node. This is a cumulative metric, so make sure to check the max aggregation.
      </td>
    </tr>
  </tbody>
 </table>

## Relevant dimensions: N/A
The following metrics are relevant to the cluster as a whole and do not require specific dimensions.

<table>
  <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Election_Term 
     </td>
     <td>A number that increases monotonically with every cluster manager election.
     </td>
   </tr>
   <tr>
     <td>PublishClusterState_Latency 
     </td>
     <td>The amount of time taken by the quorum of nodes to publish the new cluster state. This metric is available for the current cluster manager.
     </td>
   </tr>
   <tr>
     <td>PublishClusterState_Failure 
     </td>
     <td>The number of times the new cluster state failed to publish on the cluster manager node.
     </td>
   </tr>
   <tr>
     <td>ClusterApplierService_Latency 
     </td>
     <td>The amount of time taken by each node for the apply cluster state sent by the cluster manager.
     </td>
   </tr>
   <tr>
     <td>ClusterApplierService_Failure 
     </td>
     <td>The number of times that the apply cluster state action failed on each node.
     </td>
   </tr>
  </tbody>
 </table>

## Relevant dimensions: `IndexName`, `NodeName`, `ShardType`, `ShardID`
  
<table>
   <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Shard_State 
     </td>
     <td>The state of each shard, for example, `STARTED`, `UNASSIGNED`, or `RELOCATING`.
     </td>
   </tr>
   </tbody>
</table>


## Dimensions reference

| Dimension            | Return values                                   |
|----------------------|-------------------------------------------------|
| ShardID              | The ID of the shard, for example, `1`.           |
| IndexName            | The name of the index, for example, `my-index`.   |
| Operation            | The type of operation, for example, `shardbulk`.  |
| ShardRole            | The shard role, for example, `primary` or `replica`.                            |
| Exception            | OpenSearch exceptions, for example, `org.opensearch.index_not_found_exception`. |
| Indices              | The list of indexes in the request URL.        |
| HTTPRespCode         | The response code from OpenSearch, for example, `200`. |
| MemType              | The memory type, for example, `totYoungGC`, `totFullGC`, `Survivor`, `PermGen`, `OldGen`, `Eden`, `NonHeap`, or `Heap`. |
| DiskName             | The name of the disk, for example, `sda1`.        |
| DestAddr             | The destination address, for example, `010015AC`. |
| Direction            | The direction, for example, `in` or `out`.                                    |
| ThreadPoolType       | The OpenSearch thread pools, for example, `index`, `search`, or `snapshot`. |
| CBType               | The circuit breaker type, for example, `accounting`, `fielddata`, `in_flight_requests`, `parent`, or `request`. |
| ClusterManagerTaskInsertOrder| The order in which the task was inserted, for example, `3691`. |
| ClusterManagerTaskPriority   | The priority of the task, for example, `URGENT`. OpenSearch executes higher-priority tasks before lower-priority ones, regardless of `insert_order`. |
| ClusterManagerTaskType       | The task type, for example, `shard-started`, `create-index`, `delete-index`, `refresh-mapping`, `put-mapping`, `CleanupSnapshotRestoreState`, or `Update snapshot state`. |
| ClusterManagerTaskMetadata   | The metadata for the task (if any).                 |
| CacheType            | The cache type, for example, `Field_Data_Cache`, `Shard_Request_Cache`, or `Node_Query_Cache`. |

