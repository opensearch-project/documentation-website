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

A tiered cache is a multi-level cache, in which each tier has its own characteristics and performance levels. By combining different tiers, you can achieve a balance between cache performance and size.

## Types of tiered caches

OpenSearch 2.13 provides an implementation of _tiered spillover cache_. This implementation spills the evicted items from upper to lower tiers. The upper tier is smaller in size but offers better latency, like the on-heap tier. The lower tier is larger in size but is slower in terms of latency compared to the upper tier. A disk cache is an example of a lower tier. OpenSearch 2.13 offers on-heap and disk tiers. 

## Enabling a tiered cache

To enable a tiered cache, configure the following setting:

```yaml
opensearch.experimental.feature.pluggable.caching.enabled: true
```
{% include copy.html %}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Installing required plugins

A tiered cache provides a way to plug in any disk or on-heap tier implementation. You can install the plugins you intend to use in the tiered cache. As of OpenSearch 2.13, the available cache plugin is the `cache-ehcache` plugin. This plugin provides a disk cache implementation to use within a tiered cache as a disk tier. 

A tiered cache will fail to initialize if the `cache-ehcache` plugin is not installed or disk cache properties are not set.
{: .warning}

## Tiered cache settings

In OpenSearch 2.13, a request cache can use a tiered cache. To begin, configure the following settings in the `opensearch.yml` file.

### Cache store name

Set the cache store name to `tiered_spillover` to use the OpenSearch-provided tiered spillover cache implementation:

```yaml
indices.request.cache.store.name: tiered_spillover: true
```
{% include copy.html %}

### Setting on-heap and disk store tiers

The `opensearch_onheap` setting is the built-in on-heap cache available in OpenSearch. The `ehcache_disk` setting is the disk cache implementation from [Ehcache](https://www.ehcache.org/). This requires installing the `cache-ehcache` plugin:

```yaml
indices.request.cache.tiered_spillover.onheap.store.name: opensearch_onheap
indices.request.cache.tiered_spillover.disk.store.name: ehcache_disk
```
{% include copy.html %}

For more information about installing non-bundled plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins).

### Configuring on-heap and disk stores

The following table lists the cache store settings for the `opensearch_onheap` store.

Setting | Default | Description
:--- | :--- | :---
`indices.request.cache.opensearch_onheap.size` | 1% of the heap | The size of the on-heap cache. Optional.
`indices.request.cache.opensearch_onheap.expire` | `MAX_VALUE` (disabled) | Specify a time-to-live (TTL) for the cached results. Optional.

The following table lists the disk cache store settings for the `ehcache_disk` store.

Setting | Default | Description
:--- | :--- | :---
`indices.request.cache.ehcache_disk.max_size_in_bytes` | `1073741824` (1 GB)  | Defines the size of the disk cache. Optional.
`indices.request.cache.ehcache_disk.storage.path` | `""` | Defines the storage path for the disk cache. Required.
`indices.request.cache.ehcache_disk.expire_after_access` | `MAX_VALUE` (disabled) | Specify a time-to-live (TTL) for the cached results. Optional.
`indices.request.cache.ehcache_disk.alias` | `ehcacheDiskCache#INDICES_REQUEST_CACHE` (this is an example of request cache) | Specify an alias for the disk cache. Optional.
`indices.request.cache.ehcache_disk.segments` | `16` | Defines the number of segments the disk cache is separated into. Used for concurrency. Optional.
`indices.request.cache.ehcache_disk.concurrency` | `1` | Defines the number of distinct write queues created for the disk store, where a group of segments share a write queue. Optional.

