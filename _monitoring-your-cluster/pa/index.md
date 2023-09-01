---
layout: default
title: Performance Analyzer
nav_order: 58
has_children: true
redirect_from:
  - /monitoring-plugins/pa/
  - /monitoring-plugins/pa/index/
---

# Performance Analyzer

Performance Analyzer is a plugin that contains an agent and REST API that allow you to query numerous cluster performance metrics, including aggregations of those metrics. 

The Performance Analyzer plugin is installed by default in OpenSearch versions 2.0 and later. If you want to use OpenSearch 2.0 or later with Performance Analyzer disabled, see [Disable Performance Analyzer](#disable-performance-analyzer).
{: .note }

## Prerequisites

Before using Performance Analyzer with OpenSearch, review the following prerequisites.

### Storage

Performance Analyzer uses `/dev/shm` for temporary storage. During heavy cluster workloads, Performance Analyzer can use up to 1 GB of space.

Docker, however, has a default `/dev/shm` size of 64 MB. To change this value, you can use the `docker run --shm-size 1gb` flag or [a similar setting in Docker Compose](https://docs.docker.com/compose/compose-file#shm_size).

If you're not using Docker, you can check the size of `/dev/shm` using `df -h`. The default value should be adequate, but if you need to change its size, add the following line to `/etc/fstab`:

```bash
tmpfs /dev/shm tmpfs defaults,noexec,nosuid,size=1G 0 0
```

Then remount the file system:

```bash
mount -o remount /dev/shm
```

### Security 

Performance Analyzer supports encryption in transit for requests. It currently does *not* support client or server authentication for requests. To enable encryption in transit, edit `performance-analyzer.properties` in your `$OPENSEARCH_HOME` directory:

```properties
vi $OPENSEARCH_HOME/config/opensearch-performance-analyzer/performance-analyzer.properties
```

Change the following lines to configure encryption in transit. Note that `certificate-file-path` must be a certificate for the server and not a root certificate authority (CA).

````properties
https-enabled = true

#Setup the correct path for certificates
certificate-file-path = specify_path

private-key-file-path = specify_path
````

## Install Performance Analyzer 

The Performance Analyzer plugin is included in the installations for [Docker]({{site.url}}{{site.baseurl}}/opensearch/install/docker/) and [tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/), but you can also install the plugin manually. 

To install the Performance Analyzer plugin manually, download the plugin from [Maven](https://search.maven.org/search?q=org.opensearch.plugin) and install it using the standard [plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/) process. Performance Analyzer runs on each node in a cluster.

To start the Performance Analyzer root cause analysis (RCA) agent on a tarball installation, run the following command:
      
````bash
OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
````

The following command enables the Performance Analyzer plugin. 

````bash
curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
````

## Disable Performance Analyzer

If you prefer to save memory and run your local instance of OpenSearch with the Performance Analyzer plugin disabled, perform the following steps:

1. Before disabling Performance Analyzer, stop any currently running RCA agent action by using the following command:

  ```bash
  curl -XPOST localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": false}'
  ```

2. Shut down the Performance Analyzer RCA agent by running the following command:

  ```bash
  kill $(ps aux | grep -i 'PerformanceAnalyzerApp' | grep -v grep | awk '{print $2}')
  ```

3. Disable the Performance Analyzer plugin by running the following command:

  ```bash
  curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": false}'
  ```

4. Uninstall the Performance Analyzer plugin by running the following command:

  ```bash
  bin/opensearch-plugin remove opensearch-performance-analyzer
  ```

## Configure Performance Analyzer 

To configure the Performance Analyzer plugin, edit the `performance-analyzer.properties` configuration file in the `config/opensearch-performance-analyzer/` directory. Make sure to uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`. You can reference the following example configuration.

````bash
# ======================== OpenSearch Performance Analyzer plugin config =========================

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
To start the Performance Analyzer RCA agent, run the following command:

````bash
OPENSEARCH_HOME=~/opensearch-2.2.1 OPENSEARCH_JAVA_HOME=~/opensearch-2.2.1/jdk OPENSEARCH_PATH_CONF=~/opensearch-2.2.1/bin ./performance-analyzer-agent-cli
````


## Enable Performance Analyzer for RPM/YUM installations

If you installed OpenSearch from an RPM distribution, you can start and stop Performance Analyzer with `systemctl`:

```bash
# Start OpenSearch Performance Analyzer
sudo systemctl start opensearch-performance-analyzer.service
# Stop OpenSearch Performance Analyzer
sudo systemctl stop opensearch-performance-analyzer.service
```

## Example API query and response

The following is an example Performance Analyzer API query. The query pulls performance metrics related to your OpenSearch cluster:
  
````bash
GET localhost:9600/_plugins/_performanceanalyzer/metrics/units
````

The following is an example response:

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

## Root cause analysis

The [root cause analysis]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/rca/index/) (RCA) framework uses the information from Performance Analyzer to inform administrators of the root cause of performance and availability issues experienced by their clusters.

### Enable the RCA framework

To enable the RCA framework, run the following command:

```bash
curl -XPOST http://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
```

If you encounter the `curl: (52) Empty reply from server` response, run the following command to enable RCA:

```bash
curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
```

### Example API query and response

To request all available RCAs, run the following command:

````bash
GET localhost:9600/_plugins/_performanceanalyzer/rca
````

To request a specific RCA, run the following command:

````bash
GET localhost:9600/_plugins/_performanceanalyzer/rca?name=HighHeapUsageClusterRCA
````

The following is an example response:

```json
{
  "HighHeapUsageClusterRCA": [{
    "RCA_name": "HighHeapUsageClusterRCA",
    "state": "unhealthy",
    "timestamp": 1587426650942,
    "HotClusterSummary": [{
      "number_of_nodes": 2,
      "number_of_unhealthy_nodes": 1,
      "HotNodeSummary": [{
        "host_address": "192.168.144.2",
        "node_id": "JtlEoRowSI6iNpzpjlbp_Q",
        "HotResourceSummary": [{
          "resource_type": "old gen",
          "threshold": 0.65,
          "value": 0.81827232588145373,
          "avg": NaN,
          "max": NaN,
          "min": NaN,
          "unit_type": "heap usage in percentage",
          "time_period_seconds": 600,
          "TopConsumerSummary": [{
              "name": "CACHE_FIELDDATA_SIZE",
              "value": 590702564
            },
            {
              "name": "CACHE_REQUEST_SIZE",
              "value": 28375
            },
            {
              "name": "CACHE_QUERY_SIZE",
              "value": 12687
            }
          ],
        }]
      }]
    }]
  }]
}
```


### Related links

Further documentation on the use of Performance Analyzer and RCA can be found at the following links:

- [Performance Analyzer API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/api/)
- [Root cause analysis]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/rca/index/)
- [Root cause analysis]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/rca/api/).
- [RFC: Root cause analysis](https://github.com/opensearch-project/performance-analyzer-rca/blob/main/docs/rfc-rca.pdf)
