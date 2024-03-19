---
layout: default
title: Cache types
parent: Improving search performance
has_children: true
nav_order: 100
---

# Cache types

OpenSearch relies heavily on different types of on-heap cache to accelerate data retrieval, providing significant improvement in search latencies. However, cache size is limited by the amount of memory available on a node. If you are processing a larger dataset that can potentially be cached, the cache size limit causes a lot of cache evictions and misses. The increasing number of evictions impacts performance because OpenSearch needs to process the query again, causing high resource consumption.

Prior to version 2.13, OpenSearch supported the following on-heap cache types:

- **Request cache**: Caches the local results on each shard. This allows frequently used (and potentially resource-heavy) search requests to return results almost instantly. 
- **Query cache**: The shard-level query cache caches common data from similar queries. The query cache is more granular than the request cache and can cache data that is reused between different queries.
- **Field data cache**: The field data cache contains field data and global ordinals, which are both used to support aggregations on certain field types.

## Additional cache stores
**Introduced 2.13**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10024).    
{: .warning}

In addition to existing OpenSearch cache types, you can use the following cache stores with the help of cache plugins: 

- **Disk cache**: This cache stores a precomputed result of a query on disk. You can use disk cache to cache much larger datasets, provided that the disk latencies are acceptable.
- **Tiered cache**: This is a multi-level cache, in which each tier has its own characteristics and performance levels. For example, a tiered cache can contain on-heap and disk tiers. By combining different tiers, you can achieve a balance between cache performance and size. To learn more, see [Tiered cache]({{site.url}}{{site.baseurl}}/search-plugins/cache-plugins/tiered-cache/).

In OpenSearch 2.13, request cache is integrated with cache plugins. You can use tiered or disk cache on a request level.
{: .note}