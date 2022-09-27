---
layout: default
title: Performance Analyzer draft
nav_order: 12345
parent: Opensearch
---

** Performance Analyzer Draft **

## Performance Analyzer Install and Configuration

- Does anything need to be installed on top of OpenSearch and where does it come from?
  - Is included with Docker install composer yml.
  - Is including with tarball install but just in case:
    - To install on tarball install:
      - Download plugin from [Maven](https://search.maven.org/search?q=org.opensearch.plugin).
      - Install Plugin - [Plugins](https://opensearch.org/docs/latest/opensearch/install/plugins/).
      - To run on tarball install:
      ````bash
      OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
      ````
- Does this "agent" have dependencies that need to be pre-installed as well?
  - No, PA is a plugin and is installed like any other plugin.
- What exactly (command line) needs to be started? (tar install only, docker install starts automatically by default)
    ````bash
    OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
    ````
- Should it run in the same container?
  - Yes.
- Is there a way to configure OpenSearch to auto-start this agent today?
  - Yes:
    ````bash
    curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
    ````
  - Add systemd or cronny command start at boot.

- How does it work in a multi-node setup, do we need to start the agent on every node?
  - Yes.
- How does one shutdown the agent?
  - Disable:
    ````bash
    ps aux | grep performance-analyzer
    kill <PID>
    ````
    ````bash
    curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
    ````
    ````bash
    uninstall plugin
    ````

### Configure performance analyzer

For configuration options, check [here](https://opensearch.org/docs/latest/monitoring-plugins/pa/index/).

- Create performance-analyzer.properties in `bin/opensearch-performance-analyzer`.
````bash
# ======================== OpenSearch performance analyzer plugin config =========================

# NOTE: this is an example for Linux. Please modify the config accordingly if you are using it under other OS.

# WebService bind host; default to all interfaces
webservice-bind-host = 0.0.0.0

# Metrics data location
metrics-location = /dev/shm/performanceanalyzer/

# Metrics deletion interval (minutes) for metrics data.
# Interval should be between 1 to 60.
metrics-deletion-interval = 1

# If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
# metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
# the files and wouldn't like for them to be cleaned up.
cleanup-metrics-db-files = true

# WebService exposed by App's port
webservice-listener-port = 9600

# Metric DB File Prefix Path location
metrics-db-file-prefix-path = /tmp/metricsdb_

https-enabled = false

#Setup the correct path for certificates
#certificate-file-path = specify_path

#private-key-file-path = specify_path

# Plugin Stats Metadata file name, expected to be in the same location
plugin-stats-metadata = plugin-stats-metadata

# Agent Stats Metadata file name, expected to be in the same location
agent-stats-metadata = agent-stats-metadata
````
- To start performance analyzer:
````bash
OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
````
- Sample API querey:
  ````bash
  curl localhost:9600/_plugins/_performanceanalyzer/metrics/units
  ````
- Output:
````json
{"Disk_Utilization":"%","Cache_Request_Hit":"count", 
"Refresh_Time":"ms","ThreadPool_QueueLatency":"count",
"Merge_Time":"ms","ClusterApplierService_Latency":"ms",
"PublishClusterState_Latency":"ms",
"Cache_Request_Size":"B","LeaderCheck_Failure":"count",
"ThreadPool_QueueSize":"count","Sched_Runtime":"s/ctxswitch","Disk_ServiceRate":"MB/s","Heap_AllocRate":"B/s","Indexing_Pressure_Current_Limits":"B",
"Sched_Waittime":"s/ctxswitch","ShardBulkDocs":"count",
"Thread_Blocked_Time":"s/event","VersionMap_Memory":"B",
"Master_Task_Queue_Time":"ms","IO_TotThroughput":"B/s",
"Indexing_Pressure_Current_Bytes":"B",
"Indexing_Pressure_Last_Successful_Timestamp":"ms",
"Net_PacketRate6":"packets/s","Cache_Query_Hit":"count",
"IO_ReadSyscallRate":"count/s","Net_PacketRate4":"packets/s","Cache_Request_Miss":"count",
"ThreadPool_RejectedReqs":"count","Net_TCP_TxQ":"segments/flow","Master_Task_Run_Time":"ms",
"IO_WriteSyscallRate":"count/s","IO_WriteThroughput":"B/s",
"Refresh_Event":"count","Flush_Time":"ms","Heap_Init":"B",
"Indexing_Pressure_Rejection_Count":"count",
"CPU_Utilization":"cores","Cache_Query_Size":"B",
"Merge_Event":"count","Cache_FieldData_Eviction":"count",
"IO_TotalSyscallRate":"count/s","Net_Throughput":"B/s",
"Paging_RSS":"pages",
"AdmissionControl_ThresholdValue":"count",
"Indexing_Pressure_Average_Window_Throughput":"count/s",
"Cache_MaxSize":"B","IndexWriter_Memory":"B",
"Net_TCP_SSThresh":"B/flow","IO_ReadThroughput":"B/s",
"LeaderCheck_Latency":"ms","FollowerCheck_Failure":"count",
"HTTP_RequestDocs":"count","Net_TCP_Lost":"segments/flow",
"GC_Collection_Event":"count","Sched_CtxRate":"count/s",
"AdmissionControl_RejectionCount":"count","Heap_Max":"B",
"ClusterApplierService_Failure":"count",
"PublishClusterState_Failure":"count",
"Merge_CurrentEvent":"count","Indexing_Buffer":"B",
"Bitset_Memory":"B","Net_PacketDropRate4":"packets/s",
"Heap_Committed":"B","Net_PacketDropRate6":"packets/s",
"Thread_Blocked_Event":"count","GC_Collection_Time":"ms",
"Cache_Query_Miss":"count","Latency":"ms",
"Shard_State":"count","Thread_Waited_Event":"count",
"CB_ConfiguredSize":"B","ThreadPool_QueueCapacity":"count",
"CB_TrippedEvents":"count","Disk_WaitTime":"ms",
"Data_RetryingPendingTasksCount":"count",
"AdmissionControl_CurrentValue":"count",
"Flush_Event":"count","Net_TCP_RxQ":"segments/flow",
"Shard_Size_In_Bytes":"B","Thread_Waited_Time":"s/event",
"HTTP_TotalRequests":"count",
"ThreadPool_ActiveThreads":"count",
"Paging_MinfltRate":"count/s","Net_TCP_SendCWND":"B/flow",
"Cache_Request_Eviction":"count","Segments_Total":"count",
"FollowerCheck_Latency":"ms","Heap_Used":"B",
"Master_ThrottledPendingTasksCount":"count",
"CB_EstimatedSize":"B","Indexing_ThrottleTime":"ms",
"Master_PendingQueueSize":"count",
"Cache_FieldData_Size":"B","Paging_MajfltRate":"count/s",
"ThreadPool_TotalThreads":"count","ShardEvents":"count",
"Net_TCP_NumFlows":"count","Election_Term":"count"}
````

### Performance Analyzer API

- https://opensearch.org/docs/latest/monitoring-plugins/pa/api/.

**Notes**

- Step-by-step documentation to use performance analyzer.
  - https://github.com/opensearch-project/performance-analyzer-rca/blob/main/docs/rfc-rca.pdf
  - https://opensearch.org/docs/latest/opensearch/install/docker/#start-a-cluster that talks about restarting the agent, as well.
- RCA instructions - https://opensearch.org/docs/latest/monitoring-plugins/pa/rca/index/ 
- Docker:

  ````bash
  kill $(ps aux | grep -i 'PerformanceAnalyzerApp' | grep -v grep | awk '{print $2}')
  ````

- Manually start PA:

  ````bash
  OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
  ````