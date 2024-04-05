---
layout: default
title: Concepts
nav_order: 3
parent: User Guide
has_children: true
redirect_from: 
  - /benchmark/user-guide/concepts
---

# Concepts

Before using OpenSearch Benchmark, familiarize yourself with the following concepts.

## Core concepts and definitions

- **Workload**: The description of one or more benchmarking scenarios that use a specific document corpus to perform a benchmark against your cluster. The document corpus contains any indexes, data files, and operations invoked when the workflow runs. You can list the available workloads by using `opensearch-benchmark list workloads` or view any included workloads in the [OpenSearch Benchmark Workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). For more information about the elements of a workload, see [Anatomy of a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/). For information about building a custom workload, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/).

- **Pipeline**: A series of steps occurring before and after a workload is run that determines benchmark results. OpenSearch Benchmark supports three pipelines:
  - `from-sources`: Builds and provisions OpenSearch, runs a benchmark, and then publishes the results.
  - `from-distribution`: Downloads an OpenSearch distribution, provisions it, runs a benchmark, and then publishes the results.
  - `benchmark-only`: The default pipeline. Assumes an already running OpenSearch instance, runs a benchmark on that instance, and then publishes the results.

- **Test**: A single invocation of the OpenSearch Benchmark binary.

A workload is a specification of one or more benchmarking scenarios. A workload typically includes the following:

- One or more data streams that are ingested into indexes.
- A set of queries and operations that are invoked as part of the benchmark.

## Throughput, latency, and service time

For more information about throughput, latency, and service time, see [Throughput, latency, and service time]({{site.url}}{{site.baseurl}}/benchmark/user-guide/concepts/time-latency/)