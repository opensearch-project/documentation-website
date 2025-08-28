---
layout: default
title: Tiered cache
parent: Caching
grand_parent: Improving search performance
nav_order: 10
---

# Tiered cache

A tiered cache is a multi-level cache in which each tier has its own characteristics and performance levels. By combining different tiers, you can achieve a balance between cache performance and size.

## Types of tiered caches

OpenSearch provides one implementation of a tiered spillover cache. It is called `tiered_spillover`, and its implementation is stored in the `cache-common` module. It has two tiers: an upper tier and a lower tier. While any pluggable cache implementation can be used for each tier, typically the upper tier would be a smaller and faster on-heap tier, such as `opensearch_onheap`, and the lower tier would be a larger and slower disk tier, such as `ehcache_disk`. This lower tier can be dynamically enabled and disabled with the setting `indices.requests.cache.tiered_spillover.disk.store.enabled`. 

Items entering the cache will first go into the upper, on-heap tier. Once the upper tier is full, it evicts items (typically in LRU order, although cache implementations can evict items in any order). Those evicted items enter the lower, disk tier. When the disk tier is full, the items it evicts are removed from the cache entirely. If the lower tier is disabled, items evicted from the upper tier will leave the cache. 

Note that a given key can only be in one tier at a time; the upper tier does not contain a subset of the lower tier. When getting a key, each tier is checked in turn.

You can use `tiered_spillover` to make the disk tier very large---larger than it could be if it was in memory. This allows you to cache many more items without using additional heap space.

## Installing required plugins

To use tiered caching, install the `cache-ehcache` plugin. This plugin provides a disk cache implementation, `ehcache_disk`, that can be used as a disk tier within a tiered cache. For more information about installing non-bundled plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins).

A tiered cache will fail to initialize if the `cache-ehcache` plugin is not installed or if disk cache properties are not set. 
{: .warning}

## Tiered cache settings

In OpenSearch 2.14 and later, the request cache can use the `tiered_spillover` cache or any other pluggable cache implementation. To begin, configure the following settings in the `opensearch.yml` file.

### Cache store name

To use the OpenSearch-provided tiered spillover cache implementation, set the cache store name to `tiered_spillover`, as shown in the following example:

```yaml
indices.requests.cache.store.name: tiered_spillover
```
{% include copy.html %}

### Setting on-heap and disk store tiers

Set the on-heap and disk store tiers to `opensearch_onheap` and `ehcache_disk`, as shown in the following example:

```yaml
indices.requests.cache.tiered_spillover.onheap.store.name: opensearch_onheap
indices.requests.cache.tiered_spillover.disk.store.name: ehcache_disk
```
The `opensearch_onheap` setting uses the built-in on-heap cache available in OpenSearch. 

The `ehcache_disk` setting is the disk cache implementation based on [Ehcache](https://www.ehcache.org/) and requires installing the `cache-ehcache` plugin.

{% include copy.html %}

### Configuring on-heap and disk stores

The following table lists the cache store settings for the `opensearch_onheap` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.requests.cache.opensearch_onheap.size` | Percentage | 1% of the heap size | The size of the on-heap cache. Optional.
`indices.requests.cache.opensearch_onheap.expire` | Time unit | `MAX_VALUE` (disabled) | Specifies a time-to-live (TTL) for the cached results. Optional.

The following table lists the disk cache store settings for the `ehcache_disk` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.requests.cache.ehcache_disk.max_size_in_bytes` | Long | `1073741824` (1 GB)  | Defines the size of the disk cache. Optional.
`indices.requests.cache.ehcache_disk.storage.path` | String | `{data.paths}/nodes/{node.id}/request_cache` | Defines the storage path for the disk cache. Optional.
`indices.requests.cache.ehcache_disk.expire_after_access` | Time unit | `MAX_VALUE` (disabled) | Specifies a TTL for the cached results. Optional.
`indices.requests.cache.ehcache_disk.alias` | String | `ehcacheDiskCache#INDICES_REQUEST_CACHE` | Specifies an alias for the disk cache. Optional.
`indices.requests.cache.ehcache_disk.segments` | Integer | `16` | Defines the number of segments into which the disk cache is separated. Used for concurrency. Optional.
`indices.requests.cache.ehcache_disk.concurrency` | Integer | `1` | Defines the number of distinct write queues created for the disk store, where a group of segments shares a write queue. Optional.
`indices.requests.cache.ehcache_disk.min_threads` | Integer | `2`  | Defines the minimum number of ehcache disk threads for the pool. Optional.
`indices.requests.cache.ehcache_disk.max_threads` | Integer | The number of CPU cores  | Defines the maximum number of ehcache disk threads for the pool. The maximum allowed value is `10 * num_cpu_cores`. Disk operations are typically I/O bound rather than CPU bound, so you can set this value to a number greater than the number of CPU cores. Optional.

### Additional settings for the `tiered_spillover` store

The following table lists additional settings for the `tiered_spillover` store setting.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.requests.cache.tiered_spillover.policies.took_time.threshold` | Time unit | `0ms` | A policy used to determine whether to cache a query into the cache based on its query phase execution time. This is a dynamic setting. Optional.
`indices.requests.cache.tiered_spillover.disk.store.policies.took_time.threshold` | Time unit | `10ms` | A policy used to determine whether to cache a query into the disk tier of the cache based on its query phase execution time. This is a dynamic setting. Optional.
`indices.requests.cache.tiered_spillover.disk.store.enabled` | Boolean | `True` | Enables or disables the disk cache dynamically within a tiered spillover cache. Note: After disabling a disk cache, entries are not removed automatically and requires the cache to be manually cleared. Optional.
`indices.requests.cache.tiered_spillover.onheap.store.size` | Percentage | 1% of the heap size | Defines the size of the on-heap cache within a tiered cache. This setting overrides any size setting for the on-heap cache implementation itself, such as `indices.requests.cache.opensearch_onheap.size`. Optional.
`indices.requests.cache.tiered_spillover.disk.store.size` | Long | `1073741824` (1 GB) | Defines the size of the disk cache within a tiered cache. This setting overrides any size setting for the disk cache implementation itself, such as `indices.requests.cache.ehcache_disk.max_size_in_bytes`. Optional.
`indices.requests.cache.tiered_spillover.segments` | Integer | `2 ^ (ceil(log2(CPU_CORES * 1.5)))` | This determines the number of segments in the tiered cache, with each segment secured by a re-entrant read/write lock. These locks enable multiple concurrent readers without contention, while the segmentation allows multiple writers to operate simultaneously, resulting in higher write throughput. Optional.

### Delete stale entries settings

The following table lists the settings related to the deletion of stale entries from the cache.

Setting | Data type | Default | Description
:--- | :--- |:--------| :---
`indices.requests.cache.cleanup.staleness_threshold` | String | `0%`    | Defines the percentage of stale keys in the cache post. After identification, all stale cache entries are deleted. Optional.
`indices.requests.cache.cleanup.interval` | Time unit | `1m`  | Defines the frequency at which the request cache's stale entries are deleted. Optional.

## Getting statistics for the `tiered_spillover` store 

To assess the impact of using the tiered spillover cache, use the [Node Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#caches), as shown in the following example: 

```json
GET /_nodes/stats/caches/request_cache?level=tier
```

The `tier` level is only valid if the `tiered_spillover` cache is in use, and it aggregates stats by upper and lower cache tier. 

