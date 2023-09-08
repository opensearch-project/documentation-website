---
layout: default
title: Metric keys
nav_order: 35
parent: Metrics
---

# Metric keys

Metric keys are the metrics that OpenSearch Benchmark stores, based on the configuration in the [metrics record]({{site.url}}{{site.baseurl}}/benchmark/metric-keys). OpenSearch Benchmark stores the following metrics:


- `latency`: The time period between the submission of a request and the receiving of the complete response. This also includes wait time, such as the time the request spends waiting until it is ready to be serviced by OpenSearch Benchmark.
- `service_time`: The time period between sending a request and receiving the corresponding response. This metric can easily be mixed up with latency but does not include waiting time. 
- `processing_time`: The time period between start of request processing and receiving the complete response. Contrary to service time, this metric also includes OpenSearch Benchmarks’s client side processing overhead. Large differences between service time and processing time indicate a high overhead in the client and can thus point to a potential client-side bottleneck which requires investigation.
- `throughput`: The number of operations that OpenSearch Benchmark can perform within a certain time period, usually per second. See the [workload reference]({{site.url}}{{site.baseurl}}/benchmark/workloads/index/) for a definition of operation types.
- `disk_io_write_bytes`: The number of bytes that have been written to disk during the benchmark. On Linux this metric reports only the bytes that have been written by OpenSearch Benchmark. On Mac OS, it reports the number of bytes written by all processes.
- `disk_io_read_bytes`: The number of bytes that have been read from disk during the benchmark. The same caveats apply on Mac OS as for `disk_io_write_bytes`.
- `node_startup_time`: The time in seconds it took from process start until the node is up.
- node_total_young_gen_gc_time: The total runtime of the young generation garbage collector across the whole cluster as reported by the node stats API.
- node_total_young_gen_gc_count: The total number of young generation garbage collections across the whole cluster as reported by the node stats API.
- node_total_old_gen_gc_time: The total runtime of the old generation garbage collector across the whole cluster as reported by the node stats API.
- node_total_old_gen_gc_count: The total number of old generation garbage collections across the whole cluster as reported by the node stats API.
- node_total_zgc_cycles_gc_time: The total time spent doing GC by the ZGC garbage collector across the whole cluster as reported by the node stats API.
- node_total_zgc_cycles_gc_count: The total number of garbage collections performed by ZGC across the whole cluster as reported by the node stats API.
- node_total_zgc_pauses_gc_time: The total time spent in Stop-The-World pauses by the ZGC garbage collector across the whole cluster as reported by the node stats API.
- node_total_zgc_pauses_gc_count: The total number of Stop-The-World pauses performed by ZGC across the whole cluster as reported by the node stats API.
- segments_count: Total number of segments as reported by the index stats API.
- segments_memory_in_bytes: Number of bytes used for segments as reported by the index stats API.
- segments_doc_values_memory_in_bytes: Number of bytes used for doc values as reported by the index stats API.
- segments_stored_fields_memory_in_bytes: Number of bytes used for stored fields as reported by the index stats API.
- segments_terms_memory_in_bytes: Number of bytes used for terms as reported by the index stats API.
- segments_norms_memory_in_bytes: Number of bytes used for norms as reported by the index stats API.
- segments_points_memory_in_bytes: Number of bytes used for points as reported by the index stats API.
- merges_total_time: Cumulative runtime of merges of primary shards, as reported by the index stats API. Note that this is not Wall clock time (i.e. if M merge threads ran for N minutes, we will report M * N minutes, not N minutes). These metrics records also have a per-shard property that contains the times across primary shards in an array.
- merges_total_count: Cumulative number of merges of primary shards, as reported by index stats API under _all/primaries.
- merges_total_throttled_time: Cumulative time within merges have been throttled as reported by the index stats API. Note that this is not Wall clock time. These metrics records also have a per-shard property that contains the times across primary shards in an array.
- indexing_total_time: Cumulative time used for indexing of primary shards, as reported by the index stats API. Note that this is not Wall clock time. These metrics records also have a per-shard property that contains the times across primary shards in an array.
- indexing_throttle_time: Cumulative time that indexing has been throttled, as reported by the index stats API. Note that this is not Wall clock time. These metrics records also have a per-shard property that contains the times across primary shards in an array.
- refresh_total_time: Cumulative time used for index refresh of primary shards, as reported by the index stats API. Note that this is not Wall clock time. These metrics records also have a per-shard property that contains the times across primary shards in an array.
- refresh_total_count: Cumulative number of refreshes of primary shards, as reported by index stats API under _all/primaries.
- flush_total_time: Cumulative time used for index flush of primary shards, as reported by the index stats API. Note that this is not Wall clock time. These metrics records also have a per-shard property that contains the times across primary shards in an array.
- flush_total_count: Cumulative number of flushes of primary shards, as reported by index stats API under _all/primaries.
- final_index_size_bytes: Final resulting index size on the file system after all nodes have been shutdown at the end of the benchmark. It includes all files in the nodes’ data directories (actual index files and translog).
- store_size_in_bytes: The size in bytes of the index (excluding the translog), as reported by the index stats API.
- translog_size_in_bytes: The size in bytes of the translog, as reported by the index stats API.
- ml_processing_time: A structure containing the minimum, mean, median and maximum bucket processing time in milliseconds per machine learning job. These metrics are only available if a machine learning job has been created in the respective benchmark.
