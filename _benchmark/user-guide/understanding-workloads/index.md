---
layout: default
title: Understanding workloads
nav_order: 10
parent: User guide
has_toc: false
has_children: true
items:
  - heading: "Anatomy of a workload"
    description: "Understand each component of a workload"
    link: "/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/"
  - heading: "Choosing a workload"
    description: "Determine which workload best matches your dataset"
    link: "/benchmark/user-guide/understanding-workloads/choosing-a-workload/"
  - heading: "Common operations"
    description: "Familiarize yourself with common operations"
    link: "/benchmark/user-guide/understanding-workloads/common-operations/"
canonical_url: https://docs.opensearch.org/docs/latest/benchmark/user-guide/understanding-workloads/index/
---

# Understanding workloads

OpenSearch Benchmark includes a set of [workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) that you can use to benchmark data from your cluster. Workloads contain descriptions of one or more benchmarking scenarios that use a specific document corpus to perform a benchmark against your cluster. The document corpus contains any indexes, data files, and operations invoked when the workflow runs. 

{% include list.html list_items=page.items%}

