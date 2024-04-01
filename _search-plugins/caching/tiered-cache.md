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

OpenSearch 2.13 provides an implementation of a _tiered spillover cache_. This implementation spills the evicted items from upper to lower tiers. An upper tier, such as an on-heap tier, is smaller in size but offers better latency. A lower tier, such as a disk cache, is larger in size but is slower in terms of latency. OpenSearch 2.13 offers on-heap and disk tiers. 

## Enabling a tiered cache

To enable a tiered cache, configure the following setting:

```yaml
opensearch.experimental.feature.pluggable.caching.enabled: true
```
{% include copy.html %}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Installing required plugins

To use tiered caching, install a tiered cache plugin. As of OpenSearch 2.13, the only available cache plugin is the `cache-ehcache` plugin. This plugin provides a disk cache implementation to use within a tiered cache as a disk tier. For more information about installing non-bundled plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins).

A tiered cache will fail to initialize if the `cache-ehcache` plugin is not installed or disk cache properties are not set.
{: .warning}

## Tiered cache settings

In OpenSearch 2.13, a request cache can use a tiered cache. To begin, configure the following settings in the `opensearch.yml` file.

### Cache store name

To use the OpenSearch-provided tiered spillover cache implementation, set the cache store name to `tiered_spillover`:

```yaml
indices.request.cache.store.name: tiered_spillover
```
{% include copy.html %}

### Setting on-heap and disk store tiers

Set the on-heap and disk store tiers as follows:

```yaml
indices.request.cache.tiered_spillover.onheap.store.name: opensearch_onheap
indices.request.cache.tiered_spillover.disk.store.name: ehcache_disk
```
{% include copy.html %}

The `opensearch_onheap` setting is the built-in on-heap cache available in OpenSearch. 

The `ehcache_disk` setting is the disk cache implementation from [Ehcache](https://www.ehcache.org/). Using `ehcache_disk` requires installing the `cache-ehcache` plugin. 

### Configuring on-heap and disk stores

The following table lists the cache store settings for the `opensearch_onheap` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.request.cache.opensearch_onheap.size` | Percentage (for example, `1%`) | 1% of the heap | The size of the on-heap cache. Optional.
`indices.request.cache.opensearch_onheap.expire` | Integer | `MAX_VALUE` (disabled) | Specify a time-to-live (TTL) for the cached results. Optional.

The following table lists the disk cache store settings for the `ehcache_disk` store.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`indices.request.cache.ehcache_disk.storage.path` | String | `""` | Defines the storage path for the disk cache. Required.
`indices.request.cache.ehcache_disk.max_size_in_bytes` | Integer | `1073741824` (1 GB)  | Defines the size of the disk cache, in bytes. Optional.
`indices.request.cache.ehcache_disk.expire_after_access` | Integer | `MAX_VALUE` (disabled) | Specify a time-to-live (TTL) for the cached results. Optional.
`indices.request.cache.ehcache_disk.alias` | String | `ehcacheDiskCache#INDICES_REQUEST_CACHE` (this is an example of request cache) | Specify an alias for the disk cache. Optional.
`indices.request.cache.ehcache_disk.segments` | Integer | `16` | Defines the number of segments the disk cache is separated into. Used for concurrency. Optional.
`indices.request.cache.ehcache_disk.concurrency` | Integer | `1` | Defines the number of distinct write queues created for the disk store, where a group of segments share a write queue. Optional.

