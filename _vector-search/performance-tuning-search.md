---
layout: default
title: Search performance tuning
nav_order: 20
parent: Performance tuning
---

# Search performance tuning

Take the following steps to improve search performance.

## Reduce segment count

   To improve search performance, you must keep the number of segments under control. Lucene's IndexSearcher searches over all of the segments in a shard to find the 'size' best results.

   Ideally, having one segment per shard provides the optimal performance with respect to search latency. You can configure an index to have multiple shards to avoid giant shards and achieve more parallelism.

   You can control the number of segments by choosing a larger refresh interval, or during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval.

## Warm up the index

   Native library indexes are constructed during indexing, but they're loaded into memory during the first search. In Lucene, each segment is searched sequentially (so, for k-NN, each segment returns up to k nearest neighbors of the query point), and the top 'size' number of results based on the score are returned from all the results returned by segments at a shard level (higher score = better result).

   Once a native library index is loaded (native library indexes are loaded outside OpenSearch JVM), OpenSearch caches them in memory. Initial queries are expensive and take a few seconds, while subsequent queries are faster and take milliseconds (assuming the k-NN circuit breaker isn't hit).

   To avoid this latency penalty during your first queries, you can use the warmup API operation on the indexes you want to search:

   ```json
   GET /_plugins/_knn/warmup/index1,index2,index3?pretty
   {
     "_shards" : {
       "total" : 6,
       "successful" : 6,
       "failed" : 0
     }
   }
   ```

   The warmup API operation loads all native library indexes for all shards (primary and replica) for the specified indexes into the cache, so there's no penalty to load native library indexes during initial searches.

This API operation only loads the segments of active indexes into the cache. If a merge or refresh operation finishes after the API runs, or if you add new documents, you need to rerun the API to load those native library indexes into memory.
{: .warning}


## Avoid reading stored fields

   If your use case is simply to read the IDs and scores of the nearest neighbors, you can disable reading stored fields, which saves time retrieving the vectors from stored fields.

## Use `mmap` file I/O

   For the Lucene-based approximate k-NN search, there is no dedicated cache layer that speeds up read/write operations. Instead, the plugin relies on the existing caching mechanism in OpenSearch core. In versions 2.4 and earlier of the Lucene-based approximate k-NN search, read/write operations were based on Java NIO by default, which can be slow, depending on the Lucene version and number of segments per shard. Starting with version 2.5, k-NN enables [`mmap`](https://en.wikipedia.org/wiki/Mmap) file I/O by default when the store type is `hybridfs` (the default store type in OpenSearch). This leads to fast file I/O operations and improves the overall performance of both data ingestion and search. The two file extensions specific to vector values that use `mmap` are `.vec` and `.vem`. For more information about these file extensions, see [the Lucene documentation](https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/codecs/lucene90/Lucene90HnswVectorsFormat.html).

   The `mmap` file I/O uses the system file cache rather than memory allocated for the Java heap, so no additional allocation is required. To change the default list of extensions set by the plugin, update the `index.store.hybrid.mmap.extensions` setting at the cluster level using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). 
   
   This is an expert-level setting that requires closing the index before updating the setting and reopening it after the update.
   {: .important}