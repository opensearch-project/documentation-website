---
layout: default
title: Metric keys
nav_order: 35
parent: Metrics reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/metrics/metric-keys/
---

# Metric keys

Metric keys are the metrics that OpenSearch Benchmark stores, based on the configuration in the [metrics record]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-records/). OpenSearch Benchmark stores the following metrics:


- `latency`: The time period between submitting a request and receiving the complete response. This also includes wait time, such as the time the request spends waiting until it is ready to be serviced by OpenSearch Benchmark.
- `service_time`: The time period between sending a request and receiving the corresponding response. This metric is similar to latency but does not include wait time. 
- `processing_time`: The time period between starting to process a request and receiving the complete response. Contrary to service time, this metric also includes the OpenSearch Benchmark client-side processing overhead. Large differences between service time and processing time indicate a high overhead in the client and can thus point to a potential client-side bottleneck, which requires investigation.
- `throughput`: The number of operations that OpenSearch Benchmark can perform within a certain time period, usually per second. See the [workload reference]({{site.url}}{{site.baseurl}}/benchmark/workloads/index/) for definitions of operation types.
- `disk_io_write_bytes`: The number of bytes written to disk during the benchmark. On Linux, this metric corresponds to only the bytes that have been written by OpenSearch Benchmark. On Mac OS, it includes the number of bytes written by all processes.
- `disk_io_read_bytes`: The number of bytes read from disk during the benchmark. On MacOS, this includes the number of bytes written by all processes.
- `node_startup_time`: The amount of time, in seconds, from the start of the process until the node is running.
- `node_total_young_gen_gc_time`: The total runtime of the young-generation garbage collector across the whole cluster, as reported by the Nodes Stats API.
- `node_total_young_gen_gc_count`: The total number of young-generation garbage collections across the whole cluster, as reported by the Nodes Stats API.
- `node_total_old_gen_gc_time`: The total runtime of the old-generation garbage collector across the whole cluster, as reported by the Nodes Stats API.
- `node_total_old_gen_gc_count`: The total number of old-generation garbage collections across the whole cluster, as reported by the Nodes Stats API.
- `node_total_zgc_cycles_gc_time`: The total time spent by the Z Garbage Collector (ZGC) on garbage collecting across the whole cluster, as reported by the Nodes Stats API.
- `node_total_zgc_cycles_gc_count`: The total number of garbage collections ZGC performed across the whole cluster, as reported by the Nodes Stats API.
- `node_total_zgc_pauses_gc_time`: The total time ZGC spent in Stop-The-World pauses across the whole cluster, as reported by the Nodes Stats API.
- `node_total_zgc_pauses_gc_count`: The total number of Stop-The-World pauses during ZGC execution across the whole cluster, as reported by the Nodes Stats API.
- `segments_count`: The total number of open segments, as reported by the Index Stats API.
- `segments_memory_in_bytes`: The total number of bytes used for all open segments, as reported by the Index Stats API.
- `segments_doc_values_memory_in_bytes`: The number of bytes used for document values, as reported by the Index Stats API.
- `segments_stored_fields_memory_in_bytes`: The number of bytes used for stored fields, as reported by the Index Stats API.
- `segments_terms_memory_in_bytes`: The number of bytes used for terms, as reported by the Index Stats API.
- `segments_norms_memory_in_bytes`: The number of bytes used for norms, as reported by the Index Stats API.
- `segments_points_memory_in_bytes`: The number of bytes used for points, as reported by the Index Stats API.
- `merges_total_time`: The cumulative runtime of merges for primary shards, as reported by the Index Stats API. Note that this time is not wall clock time. If M merge threads ran for N minutes, Benchmark reports the amount of time as M * N minutes, not N minutes. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `merges_total_count`: The cumulative number of merges of primary shards, as reported by Index Stats API under `_all/primaries`.
- `merges_total_throttled_time`: The cumulative time for merges that have been throttled, as reported by the Index Stats API. Note that this time is not wall clock time. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `indexing_total_time`: The cumulative time used for indexing of primary shards, as reported by the Index Stats API. Note that this is not wall clock time. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `indexing_throttle_time`: The cumulative time during which indexing has been throttled, as reported by the Index Stats API. Note that this is not wall clock time. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `refresh_total_time`: The cumulative time used for index refresh of primary shards, as reported by the Index Stats API. Note that this is not wall clock time. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `refresh_total_count`: The cumulative number of refreshes of primary shards, as reported by the Index Stats API under `_all/primaries`.
- `flush_total_time`: The cumulative time used for index flush of primary shards, as reported by the Index Stats API. Note that this is not wall clock time. These metrics records have an additional per-shard property that contains the times across primary shards in an array.
- `flush_total_count`: The cumulative number of flushes of primary shards, as reported by the Index Stats API under `_all/primaries`.
- `final_index_size_bytes`: The final index size on the file system after all nodes have been shut down at the end of the benchmark, in bytes. It includes all files in the nodes’ data directories, such as index files and the translog.
- `store_size_in_bytes`: The size of the index, excluding the translog, as reported by the Index Stats API, in bytes .
- `translog_size_in_bytes`: The size of the translog, as reported by the Index Stats API, in bytes.
- `ml_processing_time`: An object containing the minimum, mean, median, and maximum bucket processing time per machine learning job, in milliseconds. These metrics are only available if a machine learning job has been created in the respective benchmark.
