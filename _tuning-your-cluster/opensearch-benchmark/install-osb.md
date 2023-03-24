---
layout: default
title: Installing OpenSearch Benchmark
nav_order: 5
parent: OpenSearch Benchmark
---

# Installing OpenSearch Benchmark

Before installing OpenSearch Benchmark you must verify that the host's operating system is compatible. There are also hardware considerations and a few required software packages that must be installed before you can use OpenSearch Benchmark.

## Supported operating systems

OpenSearch Benchmark is supported on Linux and macOS, and can only be installed on a compatible host. You can run OpenSearch Benchmark workloads against any accessible OpenSearch cluster, regardless of that cluster's underlying operating system or hardware.

## Hardware considerations

There are no specific hardware constraints regarding the OpenSearch Benchmark host, but there are still a few factors to keep in mind.

First, you should decide whether you want to benchmark an existing cluster or if you want OpenSearch Benchmark to create a cluster 

consider which type of [workload]({{site.url}}{{site.baseurl}}/_tuning-your-cluster/opensearch-benchmark/workloads/) you want to use to measure the performance of your OpenSearch cluster.

## Prerequisite software packages

OpenSearch Benchmark requires a few packages that should be installed first. These include:
- [Python](https://www.python.org/) 3.8 or newer (with `pip3`).
- [Git](https://git-scm.com/) 1.9 or newer.

You can check which version of Python is being used with the following command:
```bash
python3 -V
```

**Tip**:If your host is using an older version of Python, then you can use a utility like [pyenv](https://github.com/pyenv/pyenv) that allows users to install and managed multiple versions of Python.
{: .tip}



## Installing OpenSearch Benchmark