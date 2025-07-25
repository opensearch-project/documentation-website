---
layout: default
title: Performance tuning
parent: k-NN
nav_order: 8
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/performance-tuning/
---

# Performance tuning

This topic provides performance tuning recommendations to improve indexing and search performance for approximate k-NN. From a high level, k-NN works according to these principles:
* Graphs are created per knn_vector field / (Lucene) segment pair.
* Queries execute on segments sequentially inside the shard (same as any other OpenSearch query).
* Each graph in the segment returns <=k neighbors.
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

   Set replicas to `0` to prevent duplicate construction of graphs in both primary and replica shards. When you enable replicas after indexing finishes, the serialized graphs are directly copied. If you have no replicas, losing nodes might cause data loss, so it's important that the data lives elsewhere so this initial load can be retried in case of an issue.

* **Increase the number of indexing threads**

   If the hardware you choose has multiple cores, you can allow multiple threads in graph construction by speeding up the indexing process. Determine the number of threads to allot with the [knn.algo_param.index_thread_qty]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings) setting.

  Keep an eye on CPU utilization and choose the correct number of threads. Because graph construction is costly, having multiple threads can cause additional CPU load.

## Search performance tuning

Take the following steps to improve search performance:

* **Reduce segment count**

   To improve search performance, you must keep the number of segments under control. Lucene's IndexSearcher searches over all of the segments in a shard to find the 'size' best results. However, because the complexity of search for the HNSW algorithm is logarithmic with respect to the number of vectors, searching over five graphs with 100 vectors each and then taking the top 'size' results from 5*k results will take longer than searching over one graph with 500 vectors and then taking the top size results from k results.

   Ideally, having one segment per shard provides the optimal performance with respect to search latency. You can configure an index to have multiple shards to avoid giant shards and achieve more parallelism.

   You can control the number of segments by choosing a larger refresh interval, or during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval.

* **Warm up the index**

   Graphs are constructed during indexing, but they're loaded into memory during the first search. In Lucene, each segment is searched sequentially (so, for k-NN, each segment returns up to k nearest neighbors of the query point), and the top 'size' number of results based on the score are returned from all the results returned by segements at a shard level (higher score = better result).

   Once a graph is loaded (graphs are loaded outside OpenSearch JVM), OpenSearch caches them in memory. Initial queries are expensive and take a few seconds, while subsequent queries are faster and take milliseconds (assuming the k-NN circuit breaker isn't hit).

   To avoid this latency penalty during your first queries, you can use the warmup API operation on the indices you want to search:

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

   The warmup API operation loads all graphs for all shards (primary and replica) for the specified indices into the cache, so there's no penalty to load graphs during initial searches.

   **Note**: This API operation only loads the segments of the indices it ***sees*** into the cache. If a merge or refresh operation finishes after the API runs, or if you add new documents, you need to rerun the API to load those graphs into memory.

* **Avoid reading stored fields**

   If your use case is simply to read the IDs and scores of the nearest neighbors, you can disable reading stored fields, which saves time retrieving the vectors from stored fields.

## Improving recall

Recall depends on multiple factors like number of vectors, number of dimensions, segments, and so on. Searching over a large number of small segments and aggregating the results leads to better recall than searching over a small number of large segments and aggregating results. The larger the graph, the more chances of losing recall if you're using smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. That being said, it's important to understand your system's requirements for latency and accuracy, and then choose the number of segments you want your index to have based on experimentation.

To configure recall, adjust the algorithm parameters of the HNSW algorithm exposed through index settings. Algorithm parameters that control recall are `m`, `ef_construction`, and `ef_search`. For more information about how algorithm parameters influence indexing and search recall, see [HNSW algorithm parameters](https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md). Increasing these values can help recall and lead to better search results, but at the cost of higher memory utilization and increased indexing time.

The default recall values work on a broader set of use cases, but make sure to run your own experiments on your data sets and choose the appropriate values. For index-level settings, see [Index settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#index-settings).

## Estimating memory usage

In a typical OpenSearch cluster, a certain portion of RAM is set aside for the JVM heap. The k-NN plugin allocates graphs to a portion of the remaining RAM. This portion's size is determined by the `circuit_breaker_limit` cluster setting. By default, the limit is set at 50%.

The memory required for graphs is estimated to be `1.1 * (4 * dimension + 8 * M)` bytes/vector.

As an example, assume you have a million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```
1.1 * (4 *256 + 8 * 16) * 1,000,000 ~= 1.26 GB
```

Having a replica doubles the total number of vectors.
{: .note }

## Approximate nearest neighbor versus score script

The standard k-NN query and custom scoring option perform differently. Test with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latency, but be sure to keep shard size within the [recommended guidelines]({{site.url}}{{site.baseurl}}/opensearch#primary-and-replica-shards).
