---
layout: default
title: Cache settings
parent: Configuring OpenSearch
nav_order: 65
---

# Cache settings

OpenSearch provides various cache settings to optimize memory usage and performance. These settings control how OpenSearch manages cached data structures and memory allocation for caching operations.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cache recycler settings

The cache recycler manages the reuse of memory pages to reduce garbage collection overhead. OpenSearch supports the following cache recycler settings:

- `cache.recycler.page.limit.heap` (Static, byte size): The memory size limit for page cache recycler heap usage. Default is `10%` of heap.

- `cache.recycler.page.weight.bytes` (Static, double): The weight factor for byte page recycling in the cache recycler. Default is `1.0`. Minimum is `0.0`.

- `cache.recycler.page.weight.ints` (Static, double): The weight factor for integer page recycling in the cache recycler. Default is `1.0`. Minimum is `0.0`.

- `cache.recycler.page.weight.longs` (Static, double): The weight factor for long page recycling in the cache recycler. Default is `1.0`. Minimum is `0.0`.

- `cache.recycler.page.weight.objects` (Static, double): The weight factor for object page recycling in the cache recycler. Object pages are less useful so given lower weight by default. Default is `0.1`. Minimum is `0.0`.