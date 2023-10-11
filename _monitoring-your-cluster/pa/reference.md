---
layout: default
title: Metrics Reference
parent: Performance Analyzer
nav_order: 3
redirect_from:
  - /monitoring-plugins/pa/reference/
---

# Metrics reference

OpenSearch provides a number of metrics to help you evaluate performance. The tables below describe the metrics available, grouped by their supported dimensions. All metrics support the `avg`, `sum`, `min`, and `max` aggregations, although certain metrics measure one thing, making the choice of aggregation irrelevant.

For information about each of the dimensions, see [dimensions reference](#dimensions-reference) later in this topic.

This list is extensive. We recommend using Ctrl/Cmd + F to find what you're looking for.
{: .tip }

## Dimensions `ShardID`, `IndexName`, `Operation`, `ShardRole`

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
      <td>An approximation of the heap memory allocated, in bytes, per second in the past five seconds
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
      <td>Average time (seconds) that the associated thread(s) blocked to enter or reenter a monitor.
      </td>
    </tr>
    <tr>
      <td>Thread_Blocked_Event
      </td>
      <td>The total number of times that the associated thread(s) blocked to enter or reenter a monitor (i.e. the number of times a thread has been in the blocked state).
      </td>
    </tr>
    <tr>
      <td>Thread_Waited_Time
      </td>
      <td>Average time (seconds) that the associated thread(s) waited to enter or reenter a monitor in WAITING or TIMED_WAITING state.
      </td>
    </tr>
    <tr>
      <td>Thread_Waited_Event
      </td>
      <td>The total number of times that the associated thread(s) waited to enter or reenter a monitor (i.e. the number of times a thread has been in the WAITING or TIMED_WAITING state).
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

## Dimensions `ShardID`, `IndexName` 

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

## Dimensions `ShardID`, `IndexName`, `IndexingStage`  
  
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
      <td>Total heap size (in bytes) that is available for utilization by a shard of an index in a particular indexing stage (Coordinating, Primary or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Current_Bytes
      </td>
      <td>Total heap size (in bytes) occupied by a shard of an index in a particular indexing stage (Coordinating, Primary or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Last_Successful_Timestamp
      </td>
      <td>Timestamp of a request that was successful for a shard of an index in a particular indexing stage (Coordinating, Primary or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Rejection_Count
      </td>
      <td>Total rejections performed by OpenSearch for a shard of an index in a particular indexing stage (Coordinating, Primary or Replica).
      </td>
    </tr>
    <tr>
      <td>Indexing_Pressure_Average_Window_Throughput
      </td>
      <td>Average throughput of the last n requests (The value of n is determined by `shard_indexing_pressure.secondary_parameter.throughput.request_size_window` setting) for a shard of an index in a particular indexing stage (Coordinating, Primary or Replica).
      </td>
    </tr>
   </tbody>
 </table>
    
## Dimensions `Operation`, `Exception`, `Indices`, `HTTPRespCode`, `ShardID`, `IndexName`, `ShardRole`    
   
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

## Dimension `MemType`   
   
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

## Dimension `DiskName`   
   
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

## Dimension `DestAddr`   
   
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
     <td>Number of samples collected. Performance Analyzer collects one sample every five seconds.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_TxQ
     </td>
     <td>Average number of TCP packets in the send buffer.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_RxQ
     </td>
     <td>Average number of TCP packets in the receive buffer.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_Lost
     </td>
     <td>Average number of unrecovered recurring timeouts. This number is reset when the recovery finishes or `SND.UNA` is advanced. `SND.UNA` is the sequence number of the first byte of data that has been sent, but not yet acknowledged.
     </td>
  </tr>
  <tr>
     <td>Net_TCP_SendCWND
     </td>
     <td>Average size (bytes) of the sending congestion window.
     </td>
   </tr>
   <tr>
     <td>Net_TCP_SSThresh
     </td>
     <td>Average size (bytes) of the slow start size threshold.
     </td>
   </tr>
 </tbody>
</table>

## Dimension `Direction`    
   
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


## Dimension `ThreadPoolType`   
   
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

## Dimension `Master_PendingTaskType`  
   
 <table>
  <thead style="text-align: left">
   <tr>
    <th>Metric</th>
    <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Master_PendingQueueSize
     </td>
     <td>The current number of pending tasks in the cluster state update thread. Each node has a cluster state update thread that submits cluster state update tasks (create index, update mapping, allocate shard, fail shard, etc.).
     </td>
   </tr>
  </tbody>
 </table>

## Dimensions `Operation`, `Exception`, `Indices`, `HTTPRespCode`   
   
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
    <td>The number of items in the request (only for `_bulk` request type).
    </td>
  </tr>
  <tr>
    <td>HTTP_TotalRequests
    </td>
    <td>The number of finished requests in the past five seconds.
    </td>
  </tr>
  </tbody>
</table>

## Dimension `CBType` 
  
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
     <td>The number of times the circuit breaker has tripped.
     </td>
    </tr>
    <tr>
      <td>CB_ConfiguredSize
      </td>
      <td>The limit (bytes) for how much memory operations can use.
      </td>
    </tr>
   </tbody>
  </table>

## Dimensions `MasterTaskInsertOrder`, `MasterTaskPriority`, `MasterTaskType`, `MasterTaskMetadata`
 
<table>
 <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
 </thead>
 <tbody>  
   <tr>
     <td>Master_Task_Queue_Time
     </td>
     <td>The time (milliseconds) that a master task spent in the queue.
     </td>
   </tr>
   <tr>
      <td>Master_Task_Run_Time
      </td>
      <td>The time (milliseconds) that a master task has been executed.
      </td>
    </tr>
 </tbody>
</table>
     
## Dimension `CacheType` 
  
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
     <td>The max size of the cache in bytes.
     </td>
   </tr>
 </tbody>
</table>

## Dimension `ControllerName` 
<table>
 <thead style="text-align: left">
  <tr>
    <th>Metric</th>
    <th>Description</th>
  </tr>
 </thead>
 <tbody>  
  <tr>
    <td>AdmissionControl_RejectionCount (WIP)
    </td>
    <td>Total rejections performed by a Controller of Admission Control.
    </td>
  </tr>
  <tr>
    <td>AdmissionControl_CurrentValue (WIP)
    </td>
    <td>Current value for Controller of Admission Control.
    </td>
  </tr>
  <tr>
    <td>AdmissionControl_ThresholdValue (WIP)
    </td>
    <td>Threshold value for Controller of Admission Control.
    </td>
  </tr>
 </tbody>
</table>

## Dimension `NodeID` 
  
<table>
  <thead style="text-align: left">
   <tr>
   <th>Metric</th>
   <th>Description</th>
    </tr>
  </thead>
  <tbody>  
    <tr>
      <td>Data_RetryingPendingTasksCount (WIP)
      </td>
      <td>Number of throttled pending tasks on which data node is actively performing retries. It will be an absolute metric at that point of time.
      </td>
    </tr>
    <tr>
      <td>Master_ThrottledPendingTasksCount (WIP)
      </td>
      <td>Sum of total pending tasks which got throttled by node (master node). It is a cumulative metric so look at the max aggregation.
      </td>
    </tr>
  </tbody>
 </table>

## Dimensions: N/A
<table>
  <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Election_Term (WIP)
     </td>
     <td>Monotonically increasing number with every master election.
     </td>
   </tr>
   <tr>
     <td>PublishClusterState_Latency (WIP)
     </td>
     <td>The time taken by quorum of nodes to publish new cluster state. This metric is available for current master.
     </td>
   </tr>
   <tr>
     <td>PublishClusterState_Failure (WIP)
     </td>
     <td>The number of times publish new cluster state action failed on master node.
     </td>
   </tr>
   <tr>
     <td>ClusterApplierService_Latency (WIP)
     </td>
     <td>The time taken by each node to apply cluster state sent by master.
     </td>
   </tr>
   <tr>
     <td>ClusterApplierService_Failure (WIP)
     </td>
     <td>The number of times apply cluster state action failed on each node.
     </td>
   </tr>
  </tbody>
 </table>

## Dimensions `IndexName`, `NodeName`, `ShardType`, `ShardID`
  
<table>
   <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody>  
   <tr>
     <td>Shard_State (WIP)
     </td>
     <td>The state of each shard - whether it is STARTED, UNASSIGNED, RELOCATING etc.
     </td>
   </tr>
   </tbody>
</table>

## Dimension `WIP`
 
 <table>
   <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Description</th>
    </tr>
   </thead>
   <tbody>  
      <tr>
        <td>LeaderCheck_Latency (WIP)
        </td>
        <td> WIP
        </td>
      </tr>
    <tr>
      <td>FollowerCheck_Failure (WIP)
      </td>
      <td> WIP
      </td>
    </tr>
    <tr>
      <td>LeaderCheck_Failure (WIP)
      </td>
      <td> WIP
       </td>
    </tr>
    <tr>
      <td>FollowerCheck_Latency (WIP)
      </td>
      <td> WIP
      </td>
    </tr>
  </tbody>
</table>

## Dimensions `NodeID`, `searchbp_mode`
The following metrics are new as of OpenSearch 2.11.

<table>
   <thead style="text-align: left">
   <tr>
     <th>Metric</th>
     <th>Description</th>
   </tr>
  </thead>
  <tbody> 
     <tr>
     <td>searchbp_shard_stats_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_limitReachedCount
     </td>
     <td>The number of times when the number of tasks eligible for cancellation exceeded the set cancellation threshold, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_heap_usage_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation because of excessive heap usage since the node last restarted, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_heap_usage_currentMax
     </td>
     <td>The maximum heap usage for tasks currently running, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_heap_usage_rollingAvg
     </td>
     <td> The rolling average heap usage for n most recent tasks, on search shard task level. The default value for n is 100.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_cpu_usage_cancellationCount
     </td>
     <td>he number of tasks marked for cancellation because of excessive CPU usage since the node last restarted, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_cpu_usage_currentMax
     </td>
     <td>The maximum CPU time for all tasks currently running on the node, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_cpu_usage_currentAvg
     </td>
     <td>The average CPU time for all tasks currently running on the node, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_elaspedtime_usage_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation because of excessive elapsed time since the node last restarted, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_elaspedtime_usage_currentMax
     </td>
     <td>The maximum elapsed time for all tasks currently running on the node, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_shard_stats_resource_elaspedtime_usage_currentAvg
     </td>
     <td>The average elapsed time for all tasks currently running on the node, on search shard task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_limitReachedCount
     </td>
     <td>The number of times when the number of tasks eligible for cancellation exceeded the set cancellation threshold, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_heap_usage_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation because of excessive heap usage since the node last restarted, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_heap_usage_currentMax
     </td>
     <td>The maximum heap usage for tasks currently running, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_heap_usage_rollingAvg
     </td>
     <td> The rolling average heap usage for n most recent tasks, on search task level. The default value for n is 10.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_cpu_usage_cancellationCount
     </td>
     <td>he number of tasks marked for cancellation because of excessive CPU usage since the node last restarted, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_cpu_usage_currentMax
     </td>
     <td>The maximum CPU time for all tasks currently running on the node, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_cpu_usage_currentAvg
     </td>
     <td>The average CPU time for all tasks currently running on the node, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_elaspedtime_usage_cancellationCount
     </td>
     <td>The number of tasks marked for cancellation because of excessive elapsed time since the node last restarted, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_elaspedtime_usage_currentMax
     </td>
     <td>The maximum elapsed time for all tasks currently running on the node, on search task level.
     </td>
   </tr>
   <tr>
     <td>searchbp_task_stats_resource_elaspedtime_usage_currentAvg
     </td>
     <td>The average elapsed time for all tasks currently running on the node, on search task level.
     </td>
   </tr>
 </tbody>
</table> 

## Dimensions reference

| Dimension            | Return values                                   |
|----------------------|-------------------------------------------------|
| ShardID              | ID for the shard (for example, `1`).           |
| IndexName            | Name of the index (for example, `my-index`).   |
| Operation            | Type of operation (for example, `shardbulk`).  |
| ShardRole            | `primary`, `replica`                            |
| Exception            | OpenSearch exceptions (for example, `org.opensearch.index_not_found_exception`). |
| Indices              | The list of indexes in the request URI.        |
| HTTPRespCode         | Response code from OpenSearch (for example, `200`). |
| MemType              | `totYoungGC`, `totFullGC`, `Survivor`, `PermGen`, `OldGen`, `Eden`, `NonHeap`, `Heap` |
| DiskName             | Name of the disk (for example, `sda1`).        |
| DestAddr             | Destination address (for example, `010015AC`). |
| Direction            | `in`, `out`                                    |
| ThreadPoolType       | The OpenSearch thread pools (for example, `index`, `search`, `snapshot`). |
| CBType               | `accounting`, `fielddata`, `in_flight_requests`, `parent`, `request` |
| MasterTaskInsertOrder| The order in which the task was inserted (for example, `3691`). |
| MasterTaskPriority   | Priority of the task (for example, `URGENT`). OpenSearch executes higher priority tasks before lower priority ones, regardless of `insert_order`. |
| MasterTaskType       | `shard-started`, `create-index`, `delete-index`, `refresh-mapping`, `put-mapping`, `CleanupSnapshotRestoreState`, `Update snapshot state` |
| MasterTaskMetadata   | Metadata for the task (if any).                 |
| CacheType            | `Field_Data_Cache`, `Shard_Request_Cache`, `Node_Query_Cache` |
| NodeID               | ID for the node                                |
| searchbp_mode        | `monitor_only` (default), `enforced`, `disabled` |