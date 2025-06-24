---
layout: default
title: Tiered cache
parent: Caching
grand_parent: Improving search performance
nav_order: 10
canonical_url: https://docs.opensearch.org/docs/latest/search-plugins/caching/tiered-cache/
---

# Tiered cache

A tiered cache is a multi-level cache in which each tier has its own characteristics and performance levels. By combining different tiers, you can achieve a balance between cache performance and size.

## Types of tiered caches

OpenSearch provides an implementation of a `_tiered` spillover `cache_`. This implementation spills any items removed from the upper tiers to the lower tiers of cache. The upper tier, such as the on-heap tier, is smaller in size but offers better latency. The lower tier, such as the disk cache, is larger in size but slower in terms of latency. OpenSearch offers both on-heap and disk tiers. 

## Installing required plugins

To use tiered caching, install a tiered cache plugin. As of OpenSearch 2.13, the only available cache plugin is the `cache-ehcache` plugin. This plugin provides a disk cache implementation that can be used as a disk tier within a tiered cache. For more information about installing non-bundled plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins).

A tiered cache will fail to initialize if the `cache-ehcache` plugin is not installed or if disk cache properties are not set. 
{: .warning}

## Tiered cache settings

In OpenSearch 2.14, a request cache can be used in a tiered cache. To begin, configure the following settings in the `opensearch.yml` file.

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

The `ehcache_disk` setting is the disk cache implementation from [Ehcache](https://www.ehcache.org/) and requires installing the `cache-ehcache` plugin.

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

### Additional settings for the `tiered_spillover` store

The following table lists additional settings for the `tiered_spillover` store setting.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.requests.cache.tiered_spillover.policies.took_time.threshold` | Time unit | `0ms` | A policy used to determine whether to cache a query into the cache based on its query phase execution time. This is a dynamic setting. Optional.
`indices.requests.cache.tiered_spillover.disk.store.policies.took_time.threshold` | Time unit | `10ms` | A policy used to determine whether to cache a query into the disk tier of the cache based on its query phase execution time. This is a dynamic setting. Optional.
`indices.requests.cache.tiered_spillover.disk.store.enabled` | Boolean | `True` | Enables or disables the disk cache dynamically within a tiered spillover cache. Note: After disabling a disk cache, entries are not removed automatically and requires the cache to be manually cleared. Optional.
`indices.requests.cache.tiered_spillover.onheap.store.size` | Percentage | 1% of the heap size | Defines the size of the on-heap cache within tiered cache. Optional.
`indices.requests.cache.tiered_spillover.disk.store.size` | Long | `1073741824` (1 GB) | Defines the size of the disk cache within tiered cache. Optional.
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

