---
layout: default
title: Telemetry devices
nav_order: 45
parent: OpenSearch Benchmark Reference
---

# Telemetry devices

Telemetry devices give you additional insights on benchmark results. To view a list of the available telemetry devices, use the command `opensearch-benchmark list telemetry`. 

All telemetry devices with a `--stats` can be used with clusters not provisioned by OpenSearch Benchmark. These devices are referred to as **Runtime level telemetry devices**. Alternatively, **Setup level telemetry devices** encompass devices that can only be used when OpenSearch Benchmark provisions a cluster. 

This page lists the telemetry devices supported by OpenSearch Benchmark.

## jfr

The `jfr` telemetry device enables the [Java Flight Recorder (JFR)](https://docs.oracle.com/javacomponents/jmc-5-5/jfr-runtime-guide/index.html) on the benchmark candidate. Up to Java Development Kit (JDK) 11, JFR ships only with Oracle JDK. OpenSearch Benchmark assumes that Oracle JDK is used for benchmarking. If you run benchmarks on JDK 11 or later, [JFR](https://jdk.java.net/jmc/) is also available on OpenJDK.

To enable `jfr`, invoke **Workload** with the command `opensearch-benchmark workload --workload=pmc --telemetry jfr`. Then `jfr` will write a flight recording file that can be opened in Java Mission Control. OpenSearch Benchmark prints the location of the flight recording file on the command line.

The `jfr` devices support the following parameters:


- `recording-template`: The name of a custom flight recording template. It is your responsibility to correctly install these recording templates on each target machine. If none is specified, the default recording JFR template is used.
- `jfr-delay`: The length of time to wait before starting to record. Optional.
- `jfr-duration`:  The length of time to record. Optional.

## jit

The `jit` telemetry device enables JIT compiler logs for the benchmark candidate. If the HotSpot disassembler library is available, the logs will contain the disassembled JIT compiler output, which can be used for low-level analysis.

## gc

The `gc` telemetry device enables garbage collector (GC) logs for the benchmark candidate. You can use tools such as GCViewer to analyze the GC logs.

If the runtime JDK is Java 9 or higher, you can specify the `gc-log-config` parameter. The GC logging configuration consists of a list of tags and levels, such as the default value `gc*=info,safepoint=info,age*=trace`. Run `java -Xlog:help` to view a list of available levels and tags. 

## heapdump

The `heapdump` telemetry device captures a heap dump after a benchmark has finished and right before the node is shut down.

## node-stats

The `node-stats` telemetry device regularly calls the cluster [Node Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) and records metrics from the following stats and their associated keys:

- Index stats: `indices`
- Thread pool stats: `thread_pool` 
- JVM buffer pool stats: `jvm.buffer_pools`
- JVM gc stats: `jvm.gc` 
- OS mem stats: `os.mem` 
- OS cgroup stats: `os.cgroup` 
- JVM mem stats: `jvm.mem` 
- Circuit breaker stats: `breakers`
- Network-related stats: `transport` 
- Process CPU stats: `process.cpu` 

The `node-stats` device supports the following parameters:

- `node-stats-sample-interval`: A positive number greater than zero denoting the sampling interval in seconds. Default is `1`.
- `node-stats-include-indices`: A Boolean indicating whether index stats should be included. Default is `false`.
- `node-stats-include-indices-metrics`: A comma-separated string specifying the index stats metrics to include. This is useful, for example, to restrict the collected index stats metrics. Specifying this parameter implicitly enables collection of index stats, so you don’t also need to specify `node-stats-include-indices: true.`  For example, `--telemetry-params="node-stats-include-indices-metrics:'docs'"` will collect the docs metrics from the index stats. If you want to use multiple fields, pass a JSON file to `telemetry-params`.  Default is `docs,store,indexing,search,merges,query_cache,fielddata,segments,translog,request_cache`.
- `node-stats-include-thread-pools`: A Boolean indicating whether thread pool stats should be included. Default is `true`.
- `node-stats-include-buffer-pools`: A Boolean indicating whether buffer pool stats should be included. Default is `true`.
- `node-stats-include-breakers`: A Boolean indicating whether circuit breaker stats should be included. Default is `true`.
- `node-stats-include-gc`: A Boolean indicating whether JVM GC stats should be included. Default is `true`.
- `node-stats-include-mem`: A Boolean indicating whether both JVM heap and OS mem stats should be included. Default is `true`.
- `node-stats-include-cgroup`: A Boolean to include operating system cgroup stats. Memory stats are omitted since OpenSearch outputs them as string values. Use the `os_mem_*` fields instead. Default is `true`.
- `node-stats-include-network`: A Boolean indicating whether network-related stats should be included. Default is `true`.
- `node-stats-include-process`: A Boolean indicating whether process CPU stats should be included. Default is `true`.
- `node-stats-include-indexing-pressure`:  A Boolean indicating whether indexing presser stats should be included. Default is `true`.

## recovery-stats

The `recovery-stats` telemetry device regularly calls the [CAT Recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/) and records one metrics document per shard.

This telemetry device supports the following parameters:

- `searchable-snapshots-stats-indices` A string with the index pattern, or list of index patterns, that searchable snapshots stats should additionally be collected from. If unset, only cluster-level stats will be collected. Default is `None`.
- `searchable-snapshots-stats-sample-interval`: A positive number greater than zero denoting the sampling interval in seconds. Default is `1`.

## shard-stats

The `shard-stats` telemetry device regularly calls the cluster [Node Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) using a `level=shard` cluster parameter and records one metrics document per shard.

This device supports the `shard-stats-sample-interval` parameter, which defines the sampling interval in seconds. Default is `60`.

## data-stream-stats

The `data-stream-stats` telemetry device regularly calls the [Data Stream Stats API]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/#step-2-create-a-data-stream) and records one metrics document for cluster-level stats (`_all`) and one metrics document per data stream.

The following is an example of recorded documents given two data streams in the cluster:

```json
{
  "data_streams" : [
    {
      "name" : "logs-nginx",
      "timestamp_field" : {
        "name" : "request_time"
      },
      "indices" : [
        {
          "index_name" : ".ds-logs-nginx-000001",
          "index_uuid" : "-VhmuhrQQ6ipYCmBhn6vLw"
        }
      ],
      "generation" : 1,
      "status" : "GREEN",
      "template" : "logs-template-nginx"
    }
  ]
},
{
  "name": "data-stream-stats",
  "data_stream": "my-data-stream-1",
  "backing_indices": 1,
  "store_size_bytes": 439137,
  "maximum_timestamp": 1579936446448
},
{
  "name": "data-stream-stats",
  "data_stream": "my-data-stream-2",
  "backing_indices": 1,
  "store_size_bytes": 439199,
  "maximum_timestamp": 1579936446448
}
```

This telemetry device supports the `data-stream-stats-sample-interval` parameter, which defines the sampling interval in seconds. Default is `10`.

## ingest-pipeline-stats

The `ingest-pipeline-stats` telemetry device makes a call at the beginning and end of the benchmark to the Node Stats API and records the deltas in the form of the following documents:

- Three results documents for each cluster: `ingest_pipeline_cluster_count`, `ingest_pipeline_cluster_time`, `ingest_pipeline_cluster_failed`
- One metrics document for each node’s respective stats: `ingest_pipeline_node_count`, `ingest_pipeline_node_time`, `ingest_pipeline_node_failed`
- One metrics document for each pipeline’s respective stats: `ingest_pipeline_pipeline_count`, `ingest_pipeline_pipeline_time`, `ingest_pipeline_pipeline_failed`
- One metrics document for each pipeline processor’s respective stats: `ingest_pipeline_processor_count`, `ingest_pipeline_processor_time`, `ingest_pipeline_processor_failed`


The following example shows each document record given a single cluster, single node, and single pipeline:

```json
{
    "name": "ingest_pipeline_cluster_count",
    "value": 1001,
    "meta": {
      "cluster_name": "docker-cluster"
    }
},
{
    "name": "ingest_pipeline_node_count",
    "value": 1001,
    "meta": {
      "cluster_name": "docker-cluster",
      "node_name": "node-001"
    }
},
{
    "name": "ingest_pipeline_pipeline_count",
    "value": 1001,
    "meta": {
      "cluster_name": "docker-cluster",
      "node_name": "node-001",
      "ingest_pipeline": "test-pipeline-1"
    }
},
{
    "name": "ingest_pipeline_processor_count",
    "value": 1001,
    "meta": {
      "cluster_name": "docker-cluster",
      "node_name": "node-001",
      "ingest_pipeline": "test-pipeline-1",
      "processor_name": "uppercase_1",
      "type": "uppercase"
    }
}
```




