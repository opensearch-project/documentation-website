---
layout: default
title: OpenSearch Benchmark
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
permalink: /benchmark/
redirect_from:
  - /benchmark/index/
  - /benchmark/tutorials/index/
tutorial_cards:
  - heading: "Get started with OpenSearch Benchmark"
    description: "Run your first OpenSearch Benchmark workload and receive performance metrics"
    link: "/benchmark/quickstart/"
  - heading: "Choosing a workload"
    description: "Choose a benchmark workload based on your cluster's use case"
    link: "/benchmark/user-guide/understanding-workloads/choosing-a-workload/"
more_cards: 
  - heading: "User guide"
    description: "Learn how to benchmark the performance of your cluster"
    link: "/benchmark/user-guide/index/"
  - heading: "Reference"
    description: "Learn about OpenSearch Benchmark commands and options"
    link: "/benchmark/reference/index/"
items:
  - heading: "Install and configure OpenSearch Benchmark"
    description: "Install OpenSearch Benchmark and configure your experience"
    link: "/benchmark/user-guide/install-and-configure/installing-benchmark/"
  - heading: "Run a workload"
    description: "Run a workload and receive performance metrics." 
    link: "/benchmark/user-guide/working-with-workloads/running-workloads/"
  - heading: "Analyze performance metrics"
    description: "View your benchmark report and analyze your metrics"  
    link: "/benchmark/user-guide/understanding-results/summary-reports/"
---

# OpenSearch Benchmark

OpenSearch Benchmark is a macrobenchmark utility provided by the [OpenSearch Project](https://github.com/opensearch-project). You can use OpenSearch Benchmark to gather performance metrics from an OpenSearch cluster for a variety of purposes, including:

- Tracking the overall performance of an OpenSearch cluster.
- Informing decisions about when to upgrade your cluster to a new version.
- Determining how changes to your workflow---such as modifying mappings or queries---might impact your cluster.

## Get started

OpenSearch Benchmark can be installed directly on a compatible host running Linux or macOS. You can also run OpenSearch Benchmark in a Docker container. See [Installing OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/installing-benchmark/) for more information.
{: .info }

{% include cards.html cards=page.tutorial_cards %}

{% include list.html list_items=page.items%}

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/benchmark/quickstart/){: .btn-dark-blue}
</span>

## Customize your benchmarks

{% include cards.html cards=page.more_cards %}







