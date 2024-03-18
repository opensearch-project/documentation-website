# Cache plugins
This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated GitHub issue.

Cache plugins gives an ability to use different kind of cache stores(like on-heap, disk and tiered) within Opensearch. 

## Background

OpenSearch relies heavily on different on-heap caches to speed up the data retrieval process and thereby providing significant improvement in search latencies. But cache size is limited by the amount of memory available on a node. In cases where we are dealing with larger datasets which can potentially be cached, this causes a lot of cache evictions/misses and potentially impacting performance as we need to process/compute the query again causing high resource consumption.

Different on-heap cache types within OpenSearch(as of today):
- Request cache: Caches the local results on each shard. This allows frequently used (and potentially heavy) search requests to return results almost instantly. 
- Query cache: The shard-level query cche aches data when a similar query is used. The query cache is even more granular and can cache data that is reused between different queries.
- Field data cache: The field data cache contains field data and global ordinals, which are both used to support aggregations on certain field types.

## New cache stores

In addition to on-heap cache, we have introduced new cache implementations as listed below:

- Disk cache: This cache uses disk to store precomputed result of a query and can be used to extend the capabilities of OpenSearch. This can be used to cache much larger dataset provided that the disk latencies are acceptable.
- Tiered cache: This is basically a multi level cache with each tier having it’s own characteristics and performance levels. For example, it can contain on-heap and disk tier. This tries to utilize the combination of different tiers and provide a balance between performance and size. To learn more about this, see {}

## Integration points

As of now, we have integrated below caches within OpenSearch with above plugin and provided an ability to extend its capabilities to use tiered or disk cache.
- Request cache 
