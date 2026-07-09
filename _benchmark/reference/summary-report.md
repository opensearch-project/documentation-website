---
layout: default
title: Summary report
nav_order: 40
parent: Reference
redirect_from:
  - /benchmark/user-guide/understanding-results/summary-reports/
---

# Summary report

At the end of each test run, OpenSearch Benchmark prints a summary report of metrics such as service time, throughput, latency, and more. These metrics show how the selected workload performed on the benchmarked OpenSearch cluster.

## Example output

The following example shows a typical summary report:

```bash
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------

|                                                         Metric |                                       Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------------------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                                            |     0.02655 |    min |
|             Min cumulative indexing time across primary shards |                                            |           0 |    min |
|          Median cumulative indexing time across primary shards |                                            |  0.00176667 |    min |
|             Max cumulative indexing time across primary shards |                                            |   0.0140333 |    min |
|                        Cumulative merge time of primary shards |                                            |   0.0102333 |    min |
|                                                     Store size |                                            | 0.000485923 |     GB |
|                                                  Segment count |                                            |          32 |        |
|                                                 Min Throughput |                                      index |     3008.97 | docs/s |
|                                                Mean Throughput |                                      index |     3008.97 | docs/s |
|                                              Median Throughput |                                      index |     3008.97 | docs/s |
|                                                 Max Throughput |                                      index |     3008.97 | docs/s |
|                                        50th percentile latency |                                      index |     351.059 |     ms |
|                                       100th percentile latency |                                      index |     365.058 |     ms |
|                                   50th percentile service time |                                      index |     351.059 |     ms |
|                                  100th percentile service time |                                      index |     365.058 |     ms |
|                                                     error rate |                                      index |           0 |      % |
|                                                 Min Throughput |                                  match_all |       36.09 |  ops/s |
|                                                Mean Throughput |                                  match_all |       36.09 |  ops/s |
|                                              Median Throughput |                                  match_all |       36.09 |  ops/s |
|                                                 Max Throughput |                                  match_all |       36.09 |  ops/s |
|                                       100th percentile latency |                                  match_all |     35.9822 |     ms |
|                                  100th percentile service time |                                  match_all |     7.93048 |     ms |
|                                                     error rate |                                  match_all |           0 |      % |
|                                                            ... |                                        ... |         ... |    ... |
```

Metrics unique to the cluster begin at the `index` task line. For example:

- To assess how much load your cluster can handle, the `index` task metrics show the number of documents ingested during the workload run and the ingestion error rate.
- To assess query latency and service time, the `match_all` and `term` tasks show the number of query operations performed per second, measurable query latency, and query operation error rate.

Which values are shown in the report depends on the `--show-in-results` flag; see [Storing results](#storing-results) below.

## Storing results

Results are stored in-memory by default. When stored in-memory, they're written to `~/.benchmark/benchmarks/test-runs/<test_run_id>/`, named by the `test_run_id` of the most recent workload test.

While [running a test]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/run/#general-settings), the following flags customize how results are stored:

- `--results-file`: File path to write the summary report to.
- `--results-format`: Output format for the summary. `markdown` or `csv`. Default is `markdown`.
- `--show-in-results`: Which values appear in the published report. `available`, `all-percentiles`, or `all`. Default is `available`.
- `--user-tag`: Key-value pairs stored with the run as metadata (for example, `intention:baseline-ticket-12345`). Useful when storing metrics in external storage.

To store results outside the test-runs directory, configure an external metrics datastore. For nightly published results, see the OpenSearch Benchmark [nightly test dashboard](https://opensearch.org/benchmarks).

## Metric reference

The following metrics are included in the summary report.

### Cumulative indexing time of primary shards

**Corresponding metric key**: `indexing_total_time`

The cumulative time used for indexing as reported by the Index Stats API. Note that this is not wall-clock time, for example, if M indexing threads ran for N minutes, report M * N minutes, not N minutes.

### Cumulative indexing time across primary shards

**Corresponding metric key**: `indexing_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time used for indexing across primary shards as reported by the Index Stats API.

### Cumulative indexing throttle time of primary shards

**Corresponding metric key**: `indexing_throttle_time`

The cumulative time that the indexing has been throttled as reported by the Index Stats API. Note that this is not wall-clock time, for example, if M indexing threads ran for N minutes, report M * N minutes, not N minutes.


### Cumulative indexing throttle time across primary shards

**Corresponding metric key**: `indexing_throttle_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time used that indexing has been throttled across primary shards as reported by the Index Stats API.


### Cumulative merge time of primary shards

**Corresponding metric key**: `merges_total_time`

The cumulative runtime of merges of primary shards, as reported by the index stats API. Note that this is not wall-clock time.

### Cumulative merge count of primary shards

**Corresponding metric key**: `merges_total_count`

The cumulative number of merges of primary shards, as reported by the Index Stats API under `_all/primaries`.


### Cumulative merge time across primary shards

**Corresponding metric key**: `merges_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time of merges across primary shards as reported by the Index Stats API.


### Cumulative refresh time of primary shards

**Corresponding metric key**: `refresh_total_time`

The cumulative time used for index refresh of primary shards as reported by the Index Stats API. Note that this is not wall-clock time.

### Cumulative refresh count of primary shards

**Corresponding metric key**: `refresh_total_count`

The cumulative number of refreshes of primary shards as reported by the Index Stats API under `_all/primaries`.

### Cumulative refresh time across primary shards

**Corresponding metric key**: `refresh_total_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time for index refresh across primary shards as reported by the Index Stats API.

### Cumulative flush time of primary shards

**Corresponding metric key**: `flush_total_time`

The cumulative time used for index flush of primary shards as reported by the Index Stats API. Note that this is not wall-clock time.

### Cumulative flush count of primary shards

**Corresponding metric key**: `flush_total_count`

The cumulative number of flushes of primary shards as reported by the Index Stats API under `_all/primaries`.


### Cumulative flush time across primary shards

**Corresponding metric key**: `flush_total_time` (property: `per-shard`)

The minimum, median, and maximum time for index flush across primary shards as reported by the Index Stats API.

### Cumulative merge throttle time of primary shards

**Corresponding metric key**: `merges_total_throttled_time`

The cumulative time within merges that have been throttled as reported by the Index Stats API. Note that this is not wall-clock time.

### Cumulative merge throttle time across primary shards

**Corresponding metric key**: `merges_total_throttled_time` (property: `per-shard`)

The minimum, median, and maximum cumulative time that merges have been throttled across primary shards as reported by the Index Stats API.

### ML processing time

**Corresponding metric key**: `ml_processing_time`

The minimum, mean, median, and maximum time in milliseconds that a machine learning (ML) job has spent processing a single bucket.


### Total young gen GC time

**Corresponding metric key**: `node_total_young_gen_gc_time`

The total runtime of the young generation (gen) garbage collector (GC) across the whole cluster as reported by the Node Stats API.

### Total young gen GC count

**Corresponding metric key**: `node_total_young_gen_gc_count`

The total number of young gen GCs across the whole cluster as reported by the Node Stats API.


### Total old gen GC time

**Corresponding metric key**: `node_total_old_gen_gc_time`

The total runtime of the old gen GC across the whole cluster as reported by the Node Stats API.

### Total old gen GC count

**Corresponding metric key**: `node_total_old_gen_gc_count`

The total number of old gen GCs across the whole cluster as reported by the Node Stats API.

### Total ZGC cycles GC time

**Corresponding metric key**: `node_total_zgc_cycles_gc_count`

The total number of garbage collections performed by the Z garbage collector (ZGC) across the whole cluster as reported by the Node Stats API.

### Total ZGC pauses GC time

**Corresponding metric key**: `node_total_zgc_pauses_gc_time`

The total time spent in stop-the-world pauses by the ZGC across the whole cluster as reported by the Node Stats API.


### Total ZGC pauses GC count

**Corresponding metric key**: `node_total_zgc_pauses_gc_count`

The total number of stop-the-world pauses performed by the ZGC across the whole cluster as reported by the Node Stats API.


### Store size

**Corresponding metric key**: `store_size_in_bytes`

The index size in bytes (excluding the translog) as reported by the Index Stats API.

### Translog size

**Corresponding metric key**: `translog_size_in_bytes`

The translog size in bytes as reported by the Index Stats API.

### Heap used for X

**Corresponding metric keys**: `segments_*_in_bytes`

The number of bytes used for the corresponding item as reported by the Index Stats API. The item may be any of the following:

- Doc values
- Terms
- Norms
- Points
- Stored fields


### Segments count

**Corresponding metric key**: `segments_count`

The total number of segments as reported by the Index Stats API.


### Total ingest pipeline count

**Corresponding metric key**: `ingest_pipeline_cluster_count`

The total number of documents ingested by all nodes within the cluster over the race duration.

### Total ingest pipeline time

**Corresponding metric key**: `ingest_pipeline_cluster_time`

The total time in milliseconds spent preprocessing ingest documents by all nodes within the cluster over the race duration.


### Total ingest pipeline failed

**Corresponding metric key**: `ingest_pipeline_cluster_failed`

The total number of failed ingest operations by all nodes within the cluster over the race duration.


### Throughput

**Corresponding metric key**: `throughput`

Reports the minimum, mean, median, and maximum throughput for each task.

The number of operations that OpenSearch can perform within a certain time period per second. The report includes the minimum, mean, median, and maximum throughput for each task.


### Latency

**Corresponding metric key**: `latency`

The time period between submission of a request and receiving the complete response. It includes the wait time the request spends waiting before it is processed by OpenSearch. OpenSearch reports several percentile numbers for each task. Which percentiles are shown depends on how many requests OpenSearch can capture during the latency period.


### Service time

**Corresponding metric key**: `service_time`

The time period between sending a request and receiving the corresponding response. It does not include waiting time. While many load testing tools refer to this metric as _latency_, it is not the same. OpenSearch reports several percentile numbers for each task. Which percentiles are shown depends on how many requests OpenSearch can capture during the latency period.



### Processing time

Processing time is only reported if the setting `output.processingtime` is set to `true` in the OpenSearch Benchmark configuration file.
{: note.}

**Corresponding metric key**: `processing_time`


The time period between start of request processing and retrieval of the complete response. Unlike `service_time`, this metric includes OpenSearch’s client-side processing overhead. The larger the difference between `service_time` and `processing_time`, the higher the overhead in the client. Depending on your processing goals, this can point to a potential client-side bottleneck that requires investigation.


### Error rate

**Corresponding metric key**: `service_time`. Each `service_time` record has a `meta.success` flag. 

The ratio of erroneous responses relative to the total number of responses. Any exception thrown by the Python OpenSearch client is considered erroneous, for example, HTTP response codes 4xx, 5xx, or network errors (network unreachable). You can investigate the root cause by inspecting OpenSearch and OpenSearch Benchmark logs and rerunning the benchmark.


### Disk usage

**Corresponding metric keys**: `disk_usage_total`
**Metric metadata**: `index` and `field`

The total number of bytes that a single field uses on disk. Recorded for each field returned by the Disk Usage API even if the total is `0`.
