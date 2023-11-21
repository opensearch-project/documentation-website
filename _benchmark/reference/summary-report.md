---
layout: default
title: Summary report
nav_order: 40
parent: Metrics
---

# Summary report

At the end of each run, OpenSearch Benchmark shows a summary report based on the metric keys defined in the workload. This page gives details on each line of the summary report and that line's associated metric key.

## Cumulative indexing time of primary shards

**Corresponding metrics key**: `indexing_total_time`

The cumulative time used for indexing as reported by the Index Stats API. Note that this is not wall-clock time, for example, if M indexing threads ran for N minutes, report M * N minutes, not N minutes.

## Cumulative indexing time across primary shards

**Corresponding metrics key:** `indexing_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time used for indexing across primary shards as reported by the Index Stats API.

## Cumulative indexing throttle time of primary shards

**Corresponding metrics key:** `indexing_throttle_time`

The cumulative time that the indexing has been throttled as reported by the Index Stats API. Note that this is not wall-clock time, for example, if M indexing threads ran for N minutes, report M * N minutes, not N minutes.


## Cumulative indexing throttle time across primary shards

**Corresponding metrics key:** `indexing_throttle_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time used that indexing has been throttled across primary shards as reported by the Index Stats API.


## Cumulative merge time of primary shards

**Corresponding metrics key:** `merges_total_time`

The cumulative runtime of merges of primary shards, as reported by the index stats API. Note that this is not wall clock time.

## Cumulative merge count of primary shards

**Corresponding metrics key:** `merges_total_count`

The cumulative number of merges of primary shards, as reported by index stats API under `_all/primaries`.


## Cumulative merge time across primary shards

**Corresponding metrics key:** `merges_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time of merges across primary shards as reported by the Index Stats API.


## Cumulative refresh time of primary shards

**Corresponding metrics key**: `refresh_total_time`

The cumulative time used for index refresh of primary shards as reported by the Index Stats API. Note that this is not wall-clock time.

## Cumulative refresh count of primary shards

**Corresponding metrics key:** `refresh_total_count`

The cumulative number of refreshes of primary shards as reported by the Index Stats API under `_all/primaries`.

## Cumulative refresh time across primary shards

**Corresponding metrics key:** `refresh_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time for index refresh across primary shards as reported by the Index Stats API.

## Cumulative flush time of primary shards

**Corresponding metrics key:** `flush_total_time`

The cumulative time used for index flush of primary shards as reported by the Index Stats API. Note that this is not wall-clock time.

## Cumulative flush count of primary shards

**Corresponding metrics key**: `flush_total_count`

The cumulative number of flushes of primary shards as reported by the Index Stats API under `_all/primaries`.


## Cumulative flush time across primary shards

**Corresponding metrics key:** `flush_total_time` (property: `per-shard`)

The minimum, median, and maximum time for index flush across primary shards as reported by the Index Stats API.

## Cumulative merge throttle time of primary shards

**Corresponding metrics key:** `merges_total_throttled_time`

The cumulative time within merges that have been throttled as reported by the Index Stats API. Note that this is not wall-clock time.

## Cumulative merge throttle time across primary shards

Corresponding metrics key: `merges_total_throttled_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time that merges have been throttled across primary shards as reported by the Index Stats API.

## ML processing time

Corresponding metrics key: `ml_processing_time`

The minimum, mean, median, and maximum time in milliseconds that a machine learning (ML) job has spent processing a single bucket.


## Total young gen GC time

**Corresponding metrics key**: `node_total_young_gen_gc_time`

The total runtime of the young generation (gen) garbage collector (GC) across the whole cluster as reported by the Node Stats API.

## Total young gen GC count

**Corresponding metrics key:** `node_total_young_gen_gc_count`

The total number of young gen GCs across the whole cluster as reported by the Node Stats API.


## Total old gen GC time

**Corresponding metrics key:** `node_total_old_gen_gc_time`

The total runtime of the old gen GC across the whole cluster as reported by the Node Stats API.

## Total old gen GC count

**Corresponding metrics key:** `node_total_old_gen_gc_count`

The total number of old gen GCs across the whole cluster as reported by the Node Stats API.

## Total ZGC cycles GC time

**Corresponding metrics key**: `node_total_zgc_cycles_gc_count`

The total number of garbage collections performed by the Z garbage collector (ZGC) across the whole cluster as reported by the Node Stats API.

## Total ZGC pauses GC time

**Corresponding metrics key**: `node_total_zgc_pauses_gc_time`

The total time spent in stop-the-world pauses by the ZGC across the whole cluster as reported by the Node Stats API.


## Total ZGC Pauses GC count

**Corresponding metrics key**: `node_total_zgc_pauses_gc_count`

The total number of stop-the-world pauses performed by the ZGC across the whole cluster as reported by the Node Stats API.


## Store size

**Corresponding metrics key**: `store_size_in_bytes`

The index size in bytes (excluding the translog) as reported by the Index Stats API.

## Translog size

**Corresponding metrics key**: `translog_size_in_bytes`

The translog size in bytes as reported by the Index Stats API.

## Heap used for X

**Corresponding metrics keys**: `segments_*_in_bytes`

The number of bytes used for the corresponding item as reported by the Index Stats API. The item may be any of the following:

- Doc values
- Terms
- Norms
- Points
- Stored fields


## Segments count

**Corresponding metrics key**: `segments_count`

The total number of segments as reported by the Index Stats API.


## Total ingest pipeline count

**Corresponding metrics key**: `ingest_pipeline_cluster_count`

The total number of documents ingested by all nodes within the cluster over the race duration.

## Total ingest pipeline time

**Corresponding metrics key**: `ingest_pipeline_cluster_time`

The total time in milliseconds spent preprocessing ingest documents by all nodes within the cluster over the race duration.


## Total ingest pipeline failed

**Corresponding metrics key**: `ingest_pipeline_cluster_failed`

The total number of failed ingest operations by all nodes within the cluster over the race duration.


## Throughput

**Corresponding metrics key**: `throughput`

Reports the minimum, mean, median, and maximum throughput for each task.

The number of operations that OpenSearch can perform within a certain time period  per second. The report includes the minimum, mean, median, and maximum throughput for each task.


## Latency

**Corresponding metrics key**: `latency`

The time period between submission of a request and receiving the complete response. It includes the wait time the request spends waiting before it is processed by OpenSearch. OpenSearch reports several percentile numbers for each task. Which percentiles are shown depends on how many requests OpenSearch can capture during the latency period.


## Service time

**Corresponding metrics key**: `service_time`

The time period between sending a request and receiving the corresponding response. It does not include waiting time. While many load testing tools refer to this metic as _latency_, it is not the same. OpenSearch reports several percentile numbers for each task. Which percentiles are shown depends on how many requests OpenSearch can capture during the latency period.



## Processing time

Processing time is only reported if the setting `output.processingtime` is set to `true` in the OpenSearch Benchmark configuration file.
{: note.}

**Corresponding metrics key**: `processing_time`


The time period between start of request processing and receiving the complete response. Unlike `service_time`, this metric includes OpenSearch’s client-side processing overhead. Large differences between `service_time` and `processing_time` indicate a high overhead in the client and thus can point to a potential client-side bottleneck that requires investigation.


## Error rate

Corresponding metrics key: `service_time`. Each `service_time` record has a `meta.success` flag. 

The ratio of erroneous responses relative to the total number of responses. Any exception thrown by the Python OpenSearch client is considered erroneous, for example, HTTP response codes 4xx, 5xx, or network errors (network unreachable).  You can investigate the root cause by inspecting OpenSearch and OpenSearch Benchmark logs and rerunning the benchmark.


## Disk usage

**Corresponding metrics keys**: `disk_usage_total`
**Metric metadata**: `index` and `field`

The total number of bytes that a single field uses on disk. Recorded for each field returned by the Disk Usage API even if the total is `0`.


