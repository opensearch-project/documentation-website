---
layout: default
title: Tiered cache
parent: Caching
grand_parent: Improving search performance
nav_order: 10
---

# Tiered cache

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10024).    
{: .warning}

A tiered cache is a multi-level cache in which each tier has its own characteristics and performance levels. By combining different tiers, you can achieve a balance between cache performance and size.

## Types of tiered caches

OpenSearch provides an implementation of a `_tiered` spillover `cache_`. This implementation spills any items removed from the upper tiers to the lower tiers of cache. The upper tier, such as the on-heap tier, is smaller in size but offers better latency. The lower tier, such as the disk cache, is larger in size but slower in terms of latency. OpenSearch offers both on-heap and disk tiers. 

## Enabling a tiered cache

To enable a tiered cache, configure the following setting in `opensearch.yml`:

```yaml
opensearch.experimental.feature.pluggable.caching.enabled: true
```
{% include copy.html %}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Installing required plugins

To use tiered caching, install a tiered cache plugin. As of OpenSearch 2.13, the only available cache plugin is the `cache-ehcache` plugin. This plugin provides a disk cache implementation that can be used as a disk tier within a tiered cache. For more information about installing non-bundled plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins).

A tiered cache fails to initialize if the `cache-ehcache` plugin is not installed or disk cache properties are not set. 
{: .warning}

## Tiered cache settings

In OpenSearch 2.14, a request cache can be used in a tiered cache. To begin, configure the following settings in the `opensearch.yml` file.

### Cache store name

To use the OpenSearch-provided tiered spillover cache implementation, set the cache store name to `tiered_spillover` as shown in the following example:

```yaml
indices.request.cache.store.name: tiered_spillover: true
```
{% include copy.html %}

### Setting on-heap and disk store tiers

Set the on-heap and disk store tiers to `opensearch_onheap` and `ehcache_disk`, as shown in the following example:

```yaml
indices.request.cache.tiered_spillover.onheap.store.name: opensearch_onheap
indices.request.cache.tiered_spillover.disk.store.name: ehcache_disk
```
The `opensearch_onheap` setting uses the built-in on-heap cache available in OpenSearch. 

The `ehcache_disk` setting is the disk cache implementation from [Ehcache](https://www.ehcache.org/) which requires installing the `cache-ehcache` plugin.

{% include copy.html %}

### Configuring on-heap and disk stores

The following table lists the cache store settings for the `opensearch_onheap` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.request.cache.opensearch_onheap.size` | Percentage | 1% of the heap size | The size of the on-heap cache. Optional.
`indices.request.cache.opensearch_onheap.expire` | Time unit | `MAX_VALUE` (disabled) | Specifies a time-to-live (TTL) for the cached results. Optional.

The following table lists the disk cache store settings for the `ehcache_disk` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.request.cache.ehcache_disk.max_size_in_bytes` | Long | `1073741824` (1 GB)  | Defines the size of the disk cache. Optional.
`indices.request.cache.ehcache_disk.storage.path` | String | `""` | Defines the storage path for the disk cache. Required.
`indices.request.cache.ehcache_disk.expire_after_access` | Time unit | `MAX_VALUE` (disabled) | Specifies a time-to-live (TTL) for the cached results. Optional.
`indices.request.cache.ehcache_disk.alias` | String | `ehcacheDiskCache#INDICES_REQUEST_CACHE` | Specifies an alias for the disk cache. Optional.
`indices.request.cache.ehcache_disk.segments` | Integer | `16` | Defines the number of segments the disk cache is separated into. Used for concurrency. Optional.
`indices.request.cache.ehcache_disk.concurrency` | Integer | `1` | Defines the number of distinct write queues created for the disk store where a group of segments share a write queue. Optional.

### Additional settings for the `tiered_spillover` store

The following table lists additional settings for the `tiered_spillover` store setting.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.request.cache.tiered_spillover.disk.store.policies.took_time.threshold` | Time unit | `10ms` | A policy which is used to determine whether to cache a query onto disk cache based on its took time. This is a dynamic setting. Optional.
`indices.request.cache.tiered_spillover.disk.store.enabled` | Boolean | `True` | Setting to enable or disable the disk cache dynamically within tiered spillover cache. Note: After disabling disk cache, entries are not removed automatically and requires a manual cache clear. Optional.
