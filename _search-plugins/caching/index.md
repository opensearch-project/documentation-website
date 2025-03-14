---
layout: default
title: Caching
parent: Improving search performance
has_children: true
nav_order: 100
---

# Caching

OpenSearch relies on different on-heap cache types to accelerate data retrieval, providing significant improvement in search latency. However, cache size is limited by the amount of memory available on a node. When processing a larger dataset that can potentially be cached, the cache size limit can result in many pieces of data either being removed from the cache or not being cached, causing an incomplete query. This impacts performance because OpenSearch needs to process the query again, causing high resource consumption.

Understanding how your data uses the cache can help improve your cluster's performance and prevent you from using too much memory, reducing the cost of querying your data.

## Supported on-heap cache types

OpenSearch supports the following on-heap cache types:

- [**Index request cache**]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache/): Caches the local results on each shard. This allows frequently used and potentially resource-heavy search requests to return results almost instantaneously. 
- **Query cache**: Caches common data from similar queries at the shard level. The query cache is more granular than the request cache and can cache data to be reused in different queries.
- **Field data cache**: Caches field data and global ordinals, which are both used to support aggregations on certain field types.

## Additional cache stores

**Introduced 2.14**
{: .label .label-purple }

In addition to existing custom OpenSearch on-heap cache stores, cache plugins provide the following cache stores: 

- **Disk cache**: Stores the precomputed result of a query on disk. Use a disk cache to cache much larger datasets, provided that the disk's latency is within an acceptable range.
- **Tiered cache**: A multi-level cache in which each tier has its own characteristics and performance levels. For example, a tiered cache can contain both on-heap and disk tiers. By combining different tiers, you can achieve a balance between cache performance and size. To learn more, see [Tiered cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/tiered-cache/).

In OpenSearch 2.14, the request cache is integrated with cache plugins. You can use a tiered or disk cache as a request-level cache.
{: .note}
