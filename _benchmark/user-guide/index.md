---
layout: default
title: User guide
nav_order: 5
has_children: true
user_cards:
  - heading: "Concepts"
    description: "Learn the core Benchmark concepts"
    link: "/benchmark/user-guide/concepts/"
  - heading: "Install and configure"
    description: "Install OpenSearch Benchmark then configure your Benchmark experience"
    link: "/benchmark/user-guide/install-and-configure/index/"
  - heading: "Understanding workloads"
    description: "Dive deep into each workload component and decide which workload matches your cluster's data"
    link: "/benchmark/user-guide/understanding-workloads/index/"
  - heading: "Working with workloads"
    description: "Run and customize your OpenSearch workload to get the most accurate results"
    link: "/benchmark/user-guide/working-with-workloads/index/"  
  - heading: "Understanding results"
    description: "Analyze your benchmark results and store them"
    link: "/benchmark/user-guide/understanding-results/index/"  
  - heading: "Optimizing benchmarks"
    description: "Customize your benchmark experience further through randomization and best practices"
    link: "/benchmark/user-guide/optimizing-benchmarks/index/" 
---

# OpenSearch Benchmark User Guide

The OpenSearch Benchmark User Guide includes core [concepts]({{site.url}}{{site.baseurl}}/benchmark/user-guide/concepts/), [installation]({{site.url}}{{site.baseurl}}/benchmark/installing-benchmark/) instructions, and [configuration options]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/) to help you get the most out of OpenSearch Benchmark.

The following diagram visualizes how OpenSearch Benchmark works when run against a local host:

![Benchmark workflow]({{site.url}}{{site.baseurl}}/images/benchmark/osb-workflow.jpg).

## Sections

{% include cards.html cards=page.user_cards %}