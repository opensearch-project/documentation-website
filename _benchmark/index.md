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

The following diagram visualizes how OpenSearch Benchmark works when run against a local host:

![Benchmark workflow]({{site.url}}{{site.baseurl}}/images/benchmark/OSB-workflow.png).

The OpenSearch Benchmark documentation is split into five sections:

- [Quickstart]({{site.url}}{{site.baseurl}}/benchmark/quickstart/): Learn how to quickly run and install OpenSearch Benchmark.
- [User guide]({{site.url}}{{site.baseurl}}/benchmark/user-guide/index/): Dive deep into how OpenSearch Benchmark can help you track the performance of your cluster.
- [Tutorials]({{site.url}}{{site.baseurl}}/benchmark/tutorials/index/): Use step-by-step guides for more advanced benchmarking configurations and functionality.
- [Commands]({{site.url}}{{site.baseurl}}/benchmark/commands/index/): A detailed reference of commands and command options supported by OpenSearch.
- [Workloads]({{site.url}}{{site.baseurl}}/benchmark/workloads/index/): A detailed reference of options available for both default and custom workloads.




