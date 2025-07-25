---
layout: default
title: Metrics Reference
parent: Performance Analyzer
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/monitoring-your-cluster/pa/reference/
---

# Metrics reference

This page contains all Performance Analyzer metrics. All metrics support the `avg`, `sum`, `min`, and `max` aggregations, although certain metrics measure only one thing, making the choice of aggregation irrelevant.

For information on dimensions, see the [dimensions reference](#dimensions-reference).

This list is extensive. We recommend using Ctrl/Cmd + F to find what you're looking for.
{: .tip }

<table>
  <thead style="text-align: left">
    <tr>
      <th>Metric</th>
      <th>Dimensions</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>CPU_Utilization
      </td>
      <td rowspan="20">ShardID, IndexName, Operation, ShardRole
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
    <tr>
      <td>Indexing_ThrottleTime
      </td>
      <td rowspan="30">ShardID, IndexName
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
      <td>Segments_Memory
      </td>
      <td>Estimated memory usage of segments in bytes.
      </td>
    </tr>
    <tr>
      <td>Terms_Memory
      </td>
      <td>Estimated memory usage of terms dictionaries in bytes.
      </td>
    </tr>
    <tr>
      <td>StoredFields_Memory
      </td>
      <td>Estimated memory usage of stored fields in bytes.
      </td>
    </tr>
    <tr>
      <td>TermVectors_Memory
      </td>
      <td>Estimated memory usage of term vectors in bytes.
      </td>
    </tr>
    <tr>
      <td>Norms_Memory
      </td>
      <td>Estimated memory usage of norms (normalization factors) in bytes.
      </td>
    </tr>
    <tr>
      <td>Points_Memory
      </td>
      <td>Estimated memory usage of points in bytes.
      </td>
    </tr>
    <tr>
      <td>DocValues_Memory
      </td>
      <td>Estimated memory usage of doc values in bytes.
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
    <tr>
      <td>Indexing_Pressure_Current_Limits
      </td>
      <td rowspan="5">ShardID, IndexName, IndexingStage
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
    <tr>
      <td>Latency
      </td>
      <td>Operation, Exception, Indices, HTTPRespCode, ShardID, IndexName, ShardRole
      </td>
      <td>Latency (milliseconds) of a request.
      </td>
    </tr>
    <tr>
      <td>GC_Collection_Event
      </td>
      <td rowspan="6">MemType
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
    <tr>
      <td>Disk_Utilization
      </td>
      <td rowspan="3">DiskName
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
    <tr>
      <td>Net_TCP_NumFlows
      </td>
      <td rowspan="6">DestAddr
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
    <tr>
      <td>Net_PacketRate4
      </td>
      <td rowspan="5">Direction
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
    <tr>
      <td>ThreadPool_QueueSize
      </td>
      <td rowspan="6">ThreadPoolType
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
    <tr>
      <td>Master_PendingQueueSize
      </td>
      <td>Master_PendingTaskType
      </td>
      <td>The current number of pending tasks in the cluster state update thread. Each node has a cluster state update thread that submits cluster state update tasks (create index, update mapping, allocate shard, fail shard, etc.).
      </td>
    </tr>
    <tr>
      <td>HTTP_RequestDocs
      </td>
      <td rowspan="2">Operation, Exception, Indices, HTTPRespCode
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
    <tr>
      <td>CB_EstimatedSize
      </td>
      <td rowspan="3">CBType
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
    <tr>
      <td>Master_Task_Queue_Time
      </td>
      <td rowspan="2">MasterTaskInsertOrder, MasterTaskPriority, MasterTaskType, MasterTaskMetadata
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
    <tr>
      <td>Cache_MaxSize
      </td>
      <td>CacheType
      </td>
      <td>The max size of the cache in bytes.
      </td>
    </tr>
    <tr>
      <td>AdmissionControl_RejectionCount (WIP)
      </td>
      <td rowspan="3">ControllerName
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
    <tr>
      <td>Data_RetryingPendingTasksCount (WIP)
      </td>
      <td rowspan="2"> NodeID
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
    <tr>
      <td>Election_Term (WIP)
      </td>
      <td rowspan="5">N/A
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
    <tr>
      <td>Shard_State (WIP)
      </td>
      <td>IndexName, NodeName, ShardType, ShardID
      </td>
      <td>The state of each shard - whether it is STARTED, UNASSIGNED, RELOCATING etc.
      </td>
    </tr>
    <tr>
      <td>LeaderCheck_Latency (WIP)
      </td>
      <td rowspan="4">WIP
      </td>
      <td rowspan="4">WIP
      </td>
    </tr>
    <tr>
      <td>FollowerCheck_Failure (WIP)
      </td>
    </tr>
    <tr>
      <td>LeaderCheck_Failure (WIP)
      </td>
    </tr>
    <tr>
      <td>FollowerCheck_Latency (WIP)
      </td>
    </tr>
  </tbody>
</table>


## Dimensions reference

Dimension | Return values
:--- | :---
ShardID | ID for the shard (e.g. `1`).
IndexName | Name of the index (e.g. `my-index`).
Operation | Type of operation (e.g. `shardbulk`).
ShardRole | `primary`, `replica`
Exception | OpenSearch exceptions (e.g. `org.opensearch.index_not_found_exception`).
Indices | The list of indices in the request URI.
HTTPRespCode | Response code from OpenSearch (e.g. `200`).
MemType | `totYoungGC`, `totFullGC`, `Survivor`, `PermGen`, `OldGen`, `Eden`, `NonHeap`, `Heap`
DiskName | Name of the disk (e.g. `sda1`).
DestAddr | Destination address (e.g. `010015AC`).
Direction | `in`, `out`
ThreadPoolType | The OpenSearch thread pools (e.g. `index`, `search`,`snapshot`).
CBType | `accounting`, `fielddata`, `in_flight_requests`, `parent`, `request`
MasterTaskInsertOrder | The order in which the task was inserted (e.g. `3691`).
MasterTaskPriority | Priority of the task (e.g. `URGENT`). OpenSearch executes higher priority tasks before lower priority ones, regardless of `insert_order`.
MasterTaskType | `shard-started`, `create-index`, `delete-index`, `refresh-mapping`, `put-mapping`, `CleanupSnapshotRestoreState`, `Update snapshot state`
MasterTaskMetadata | Metadata for the task (if any).
CacheType | `Field_Data_Cache`, `Shard_Request_Cache`, `Node_Query_Cache`
