# Tiered cache

A multi level cache with each tier having it’s own characteristics and performance levels. This tries to utilize the combination of different tiers and provide a balance between performance and size.

## Get started

Tiered caching feature is an experimental feature as of OpenSearch 2.13. To begin using this feature, you need to first enable it using the `opensearch.experimental.feature.pluggable.caching.enabled` feature flag.

## Types of tiered cache

As of today, we have below implementations available for tiered cache:
- Tiered spillover cache: This implementation spills the evicted items from upper to lower tiers. Here upper tier is relatively smaller in size but offers better latency like on-heap tier. Lower is relatively larger in size but is slower(in terms of latency) compared to upper tiers. Example for lower tier can be a disk tier. As of now, it offers on-heap and disk tier. 

### Installing required plugins

Tiered cache provides you a way to plugin any kind of disk or on-heap tier implementation. You can install desired plugins which you intend to use in Tiered cache. As of now, we only have ```cache-ehcache``` plugin available which essentially provides a disk cache implementation which can be used within tiered cache as a disk tier. Also note that failing to install this plugin and not setting disk cache properties appropriately will fail to initialize tiered cache.


### Tiered cache settings

Currently we have extended OpenSearch request cache capabilites to use tiered cache. This section provides with desired instruction to appropriately set desired settings in ```opensearch.yml``` file.
Below instructions takes Request cache as an example as that is the only option as of today.

#### 1. Set the cache store name

Here tiered_spillover signifies that we intend to use a tiered spilover cache as mentioned above.

```indices.request.cache.store.name: tiered_spillover```

#### 2. Set the underlying onHeap and disk stores for tiered cache

Here ```opensearch_onheap``` is the inbuilt/default on-heap cache available within OpenSearch.
```ehcache_disk``` is the disk cache implementation from ehcache. This is provided via plugin, so needs to be installed as a pre-requisite.

```
indices.request.cache.tiered_spillover.onheap.store.name: opensearch_onheap
indices.request.cache.tiered_spillover.disk.store.name: ehcache_disk
```

#### 3. Set appropriate configs for on-heap and disk store


OnHeap cache store settings for ```opensearch_onheap``` store.

Setting | Default | Description
:--- | :--- | :---
`indices.request.cache.opensearch_onheap.size` | 1% of the heap | Size of on heap cache. Optional.
`indices.request.cache.opensearch_onheap.expire` | MAX_VALUE(disabled) | Specify a time-to-live(ttl) for the cached results. Optional.

Disk cache store setting for ```ehcache_disk``` store.

Setting | Default | Description
:--- | :--- | :---
`indices.request.cache.ehcache_disk.max_size_in_bytes` | 1073741824 (1gb)  | Defines size of the disk cache. Optional.
`indices.request.cache.ehcache_disk.storage.path` | "" | Defines storage path for disk cache. Required.
`indices.request.cache.ehcache_disk.expire_after_access` | MAX_VALUE(disabled) | Specify a time-to-live(ttl) for the cached results. Optional.
`indices.request.cache.ehcache_disk.alias` | ehcacheDiskCache#INDICES_REQUEST_CACHE (taking requets cache as an example) | Specify an alias for disk cache. Optional.
`indices.request.cache.ehcache_disk.segments` | 16 | Defines how many segments the disk cache is separated into. Used for concurrency. Optional.
`indices.request.cache.ehcache_disk.concurrency` | 1 | Defines distinct write queues created for disk store where a group of segments share a write queue. Optional.

