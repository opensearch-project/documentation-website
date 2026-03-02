---
layout: default
title: Improving search performance
nav_order: 220
has_children: true
has_toc: false
---

# Improving search performance

OpenSearch offers several ways to improve search performance, from foundational optimizations to specialized techniques:

- Store frequently accessed data in memory with [caching]({{site.url}}{{site.baseurl}}/search-plugins/caching/) for faster retrieval.

- Search segments concurrently using [concurrent segment search]({{site.url}}{{site.baseurl}}/search-plugins/concurrent-segment-search/) for better resource utilization.

- Control shard selection for optimized query routing with [search shard routing]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/search-shard-routing/).

- Run resource-intensive queries asynchronously with [asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) to avoid timeouts.

- Improve aggregation performance using a [star-tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/) for analytical workloads.
