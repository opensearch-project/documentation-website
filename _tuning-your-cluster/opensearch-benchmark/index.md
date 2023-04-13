---
layout: default
title: OpenSearch Benchmark
nav_order: 15
has_children: true
---

# OpenSearch Benchmark

OpenSearch Benchmark is a macrobenchmark utility provided by the [OpenSearch Project](https://github.com/opensearch-project). You can use OpenSearch Benchmark to gather performance metrics from an OpenSearch cluster for a variety of purposes, including:

- Tracking the overall performance of an OpenSearch cluster.
- Informing decisions about when to upgrade your cluster to a new version.
- Comparing how changes to your workflow might impact your OpenSearch cluster.

OpenSearch Benchmark is supported on Linux and macOS. You can also run OpenSearch Benchmark in a Docker container. See [Installing OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/tuning-your-cluster/opensearch-benchmark/install-osb/) for more information.

## Running commands

OpenSearch Benchmark supports the following operations:

// Will convert these to a table
    execute_test        Run a benchmark
    list                List configuration options
    info                Show info about a workload
    create-workload     Create a Benchmark workload from existing data
    generate            Generate artifacts
    compare             Compare two test_executions
    download            Downloads an artifact
    install             Installs an OpenSearch node locally
    start               Starts an OpenSearch node locally
    stop                Stops an OpenSearch node locally