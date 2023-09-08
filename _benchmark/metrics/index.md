---
layout: default
title: Metrics
nav_order: 25
has_children: true
---

# Metrics

After a workload completes, OpenSearch Benchmark stores all metric records within its metrics store. These metrics can be kept in memory or inside of an OpenSearch cluster. 

## Storing metrics

You set where metrics are stored using the [`datastore.type`](https://opensearch.org/docs/latest/benchmark/configuring-benchmark/#results_publishing) parameter in your `benchmark.ini` file.

