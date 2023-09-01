---
layout: default
title: OpenSearch Benchmark
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
---

# OpenSearch Benchmark

OpenSearch Benchmark is a macrobenchmark utility provided by the [OpenSearch Project](https://github.com/opensearch-project). You can use OpenSearch Benchmark to gather performance metrics from an OpenSearch cluster for a variety of purposes, including:

- Tracking the overall performance of an OpenSearch cluster.
- Informing decisions about when to upgrade your cluster to a new version.
- Determining how changes to your workflow---such as modifying mappings or queries---might impact your cluster.

OpenSearch Benchmark can be installed directly on a compatible host running Linux and macOS. You can also run OpenSearch Benchmark in a Docker container. See [Installing OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/installing-benchmark/) for more information.

## Concepts

Before using OpenSearch Benchmark, familiarize yourself with the following concepts:

- **Workload**: The description of one or more benchmarking scenarios that use a specific document corpus from which to perform a benchmark against your cluster. The document corpus contains any indexes, data files, and operations invoked when the workflow runs. You can list the available workloads by using `opensearch-benchmark list workloads` or view any included workloads inside the [OpenSearch Benchmark Workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). For information about building a custom workload, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/).

- **Pipeline**: A series of steps before and after a workload is run that determines benchmark results. OpenSearch Benchmark supports three pipelines:
  - `from-sources`: Builds and provisions OpenSearch, runs a benchmark, and then publishes the results.
  - `from-distribution`: Downloads an OpenSearch distribution, provisions it, runs a benchmark, and then publishes the results.
  - `benchmark-only`: The default pipeline. Assumes an already running OpenSearch instance, runs a benchmark on that instance, and then publishes the results.

- **Test**: A single invocation of the OpenSearch Benchmark binary.


