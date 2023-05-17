---
layout: default
title: Performance tuning
parent: k-NN
nav_order: 45
---

# Performance tuning

This topic provides performance tuning recommendations to improve indexing and search performance for approximate k-NN (ANN). From a high level, k-NN works according to these principles:
* Native library indexes are created per knn_vector field / (Lucene) segment pair.
* Queries execute on segments sequentially inside the shard (same as any other OpenSearch query).
* Each native library index in the segment returns <=k neighbors.
* The coordinator node picks up final size number of neighbors from the neighbors returned by each shard.

This topic also provides recommendations for comparing approximate k-NN to exact k-NN with score script.

## Indexing performance tuning

Take the following steps to improve indexing performance, especially when you plan to index a large number of vectors at once:

* **Disable the refresh interval**

   Either disable the refresh interval (default = 1 sec), or set a long duration for the refresh interval to avoid creating multiple small segments:

   ```json
   PUT /<index_name>/_settings
   {
       "index" : {
           "refresh_interval" : "-1"
       }
   }
   ```
   **Note**: Make sure to reenable `refresh_interval` after indexing finishes.

* **Disable replicas (no OpenSearch replica shard)**

   Set replicas to `0` to prevent duplicate construction of native library indexes in both primary and replica shards. When you enable replicas after indexing finishes, the serialized native library indexes are directly copied. If you have no replicas, losing nodes might cause data loss, so it's important that the data lives elsewhere so this initial load can be retried in case of an issue.

* **Increase the number of indexing threads**

   If the hardware you choose has multiple cores, you can allow multiple threads in native library index construction by speeding up the indexing process. Determine the number of threads to allot with the [knn.algo_param.index_thread_qty]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings) setting.

  Keep an eye on CPU utilization and choose the correct number of threads. Because native library index construction is costly, having multiple threads can cause additional CPU load.

## Search performance tuning

Take the following steps to improve search performance:

* **Reduce segment count**

   To improve search performance, you must keep the number of segments under control. Lucene's IndexSearcher searches over all of the segments in a shard to find the 'size' best results.

   Ideally, having one segment per shard provides the optimal performance with respect to search latency. You can configure an index to have multiple shards to avoid giant shards and achieve more parallelism.

   You can control the number of segments by choosing a larger refresh interval, or during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval.

* **Warm up the index**

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

   **Note**: This API operation only loads the segments of the indexes it ***sees*** into the cache. If a merge or refresh operation finishes after the API runs, or if you add new documents, you need to rerun the API to load those native library indexes into memory.

* **Avoid reading stored fields**

   If your use case is simply to read the IDs and scores of the nearest neighbors, you can disable reading stored fields, which saves time retrieving the vectors from stored fields.

* **Use `mmap` file I/O**

   For the Lucene-based approximate k-NN search, there is no dedicated cache layer that speeds up read/write operations. Instead, the plugin relies on the existing caching mechanism in OpenSearch core. In versions 2.4 and earlier of the Lucene-based approximate k-NN search, read/write operations were based on Java NIO by default, which can be slow, depending on the Lucene version and number of segments per shard. Starting with version 2.5, k-NN enables [`mmap`](https://en.wikipedia.org/wiki/Mmap) file I/O by default when the store type is `hybridfs` (the default store type in OpenSearch). This leads to fast file I/O operations and improves the overall performance of both data ingestion and search. The two file extensions specific to vector values that use `mmap` are `.vec` and `.vem`. For more information about these file extensions, see [the Lucene documentation](https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/codecs/lucene90/Lucene90HnswVectorsFormat.html).

   The `mmap` file I/O uses the system file cache rather than memory allocated for the Java heap, so no additional allocation is required. To change the default list of extensions set by the plugin, update the `index.store.hybrid.mmap.extensions` setting at the cluster level using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings). **Note**: This is an expert-level setting that requires closing the index before updating the setting and reopening it after the update.

## Improving recall

Recall depends on multiple factors like number of vectors, number of dimensions, segments, and so on. Searching over a large number of small segments and aggregating the results leads to better recall than searching over a small number of large segments and aggregating results. The larger the native library index, the more chances of losing recall if you're using smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. That being said, it's important to understand your system's requirements for latency and accuracy, and then choose the number of segments you want your index to have based on experimentation.

The default parameters work on a broader set of use cases, but make sure to run your own experiments on your data sets and choose the appropriate values. For index-level settings, see [Index settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#index-settings).

## Approximate nearest neighbor versus score script

The standard k-NN query and custom scoring option perform differently. Test with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latency, but be sure to keep shard size within the [recommended guidelines]({{site.url}}{{site.baseurl}}/opensearch#primary-and-replica-shards).
