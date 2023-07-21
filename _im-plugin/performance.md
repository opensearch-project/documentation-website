---
layout: default
title: Performance considerations
nav_order: 41
has_children: false
---

# Performance considerations while tuning Opensearch for indexing speed

The following configurations have demonstrated around 60% improvements in throughput when
running an indexing only workload compared to the out of box experience. The workload did not
incorporate search or other scenarios. Only the opensearch server process was run on the machines,
with the benchmark clients hosted on a different node.

The execution environment used comprises of Intel EC2 instances (r7iz.2xlarge) on the AWS cloud, and
workload was StackOverflow dataset available as part of OpenSearch Benchmark.

## Java Heap Size

A larger Java heap size is useful for indexing. Setting the Java min and max heap sizes to 50% of RAM
sizes shows better indexing performance on ec2 instances.

## Flush translog threshold

Default value for `flush_threshold_size` is 512MB. For pure indexing workloads, consider increasing this
value, e.g., 25% of the Java Heap size, to improve indexing performance.

## Index Refresh Interval

By default, Opensearch periodically refreshes indices every second, but only on indices that have
received one search request in the last 30 second1.

If you can afford to increase the amount of time between when a document gets indexed and when it
becomes visible, increasing the `index.refresh_interval` to a larger value, e.g. 30s, or even disable it in a
pure indexing scenario, it helps improve indexing speed.

## Index Buffer Size

If the node is doing heavy indexing, be sure this value is large enough. This is set as a percentage of the
java heap or in bytes. In most cases, the default value of 10% of JVM memory is sufficient2. You can try
increasing it up to 25% to observe further gains.

## Concurrent merges

Concurrent merges with `max_merge_count`: The concurrentMergeScheduler controls the execution of
merge operations when they are needed. Merges run in separate threads, and when max number of
threads is reached, further merges will wait until a merge thread becomes available3.
In cases where index throttling is an issue, consider increasing the number of merge threads beyond the
default value.