---
layout: default
title: Workload reference
nav_order: 60
has_children: true
---

# OpenSearch Benchmark workload reference

A workload is a specification of one or more benchmarking scenarios within a specific document corpus. A workload typically includes the following:

- One or more indexes that the workload measures.
- One of more data stream the workload measures.
- The queries to issue against the indexes and data streams.
- The URL where the workload sends benchmark data.
- The steps to run inside the benchmark, for example, whether to benchmark against a certain number of documents in an index or running searches 