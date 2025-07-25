---
layout: default
title: Performance tuning
parent: k-NN search
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/performance-tuning/
---

# Performance tuning

This topic provides performance tuning recommendations to improve indexing and search performance for approximate k-NN (ANN). From a high level, k-NN works according to these principles:
* Native library indexes are created per knn_vector field / (Lucene) segment pair.
* Queries execute on segments sequentially inside the shard (same as any other OpenSearch query).
* Each native library index in the segment returns <=k neighbors.
* The coordinator node picks up final size number of neighbors from the neighbors returned by each shard.

This topic also provides recommendations for comparing approximate k-NN to exact k-NN with score script.

## Indexing performance tuning

Take any of the following steps to improve indexing performance, especially when you plan to index a large number of vectors at once.

### Disable the refresh interval

Either disable the refresh interval (default = 1 sec) or set a long duration for the refresh interval to avoid creating multiple small segments:

   ```json
   PUT /<index_name>/_settings
   {
       "index" : {
           "refresh_interval" : "-1"
       }
   }
   ```

Make sure to reenable `refresh_interval` after indexing is complete.

### Disable replicas (no OpenSearch replica shard)

   Set replicas to `0` to prevent duplicate construction of native library indexes in both primary and replica shards. When you enable replicas after indexing completes, the serialized native library indexes are copied directly. If you have no replicas, losing nodes might cause data loss, so it's important that the data be stored elsewhere so that this initial load can be retried in the event of an issue.

### Increase the number of indexing threads

If your hardware has multiple cores, you can allow multiple threads in native library index construction by speeding up the indexing process. Determine the number of threads to allot with the [knn.algo_param.index_thread_qty]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings) setting.

Monitor CPU utilization and choose the correct number of threads. Because native library index construction is costly, choosing more threads then you need can cause additional CPU load.


### (Expert level) Disable vector field storage in the source field

The `_source` field contains the original JSON document body that was passed at index time. This field is not indexed and is not searchable but is stored so that it can be returned when executing fetch requests such as `get` and `search`. When using vector fields within the source, you can remove the vector field to save disk space, as shown in the following example where the `location` vector is excluded:

  ```json
  PUT /<index_name>/_mappings
  {
      "_source": {
        "excludes": ["location"]
      },
      "properties": {
          "location": {
              "type": "knn_vector",
              "dimension": 2,
            "space_type": "l2",
              "method": {
                  "name": "hnsw",
                  "engine": "faiss"
              }
          }
      }
  }
  ```


Disabling the `_source` field can cause certain features to become unavailable, such as the `update`, `update_by_query`, and `reindex` APIs and the ability to debug queries or aggregations by using the original document at index time.

In OpenSearch 2.15 or later, you can further improve indexing speed and reduce disk space by removing the vector field from the `_recovery_source`, as shown in the following example:

  ```json
  PUT /<index_name>/_mappings
  {
      "_source": {
        "excludes": ["location"],
        "recovery_source_excludes": ["location"]
      },
      "properties": {
          "location": {
              "type": "knn_vector",
              "dimension": 2,
            "space_type": "l2",
              "method": {
                  "name": "hnsw",
                  "engine": "faiss"
              }
          }
      }
  }
  ```

This is an expert-level setting. Disabling the `_recovery_source` may lead to failures during peer-to-peer recovery. Before disabling the `_recovery_source`, check with your OpenSearch cluster admin to determine whether your cluster performs regular flushes before starting the peer-to-peer recovery of shards prior to disabling the `_recovery_source`.  
{: .warning}

### (Expert level) Build vector data structures on demand

This approach is recommended only for workloads that involve a single initial bulk upload and will be used exclusively for search after force merging to a single segment.

During indexing, vector search builds a specialized data structure for a `knn_vector` field to enable efficient approximate k-NN search. However, these structures are rebuilt during [force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/) on k-NN indexes. To optimize indexing speed, follow these steps:

1. **Disable vector data structure creation**: Disable vector data structure creation for new segments by setting [`index.knn.advanced.approximate_threshold`]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#index-settings) to `-1`. 

    To specify the setting at index creation, send the following request:

    ```json
    PUT /test-index/
    {
      "settings": {
        "index.knn.advanced.approximate_threshold": "-1"
      }
    }
    ```
    {% include copy-curl.html %}

    To specify the setting after index creation, send the following request:

    ```json
    PUT /test-index/_settings
    {
      "index.knn.advanced.approximate_threshold": "-1"
    }
    ```
    {% include copy-curl.html %}

1. **Perform bulk indexing**: Index data in [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) without performing any searches during ingestion:

    ```json
    POST _bulk
    { "index": { "_index": "test-index", "_id": "1" } }
    { "my_vector1": [1.5, 2.5], "price": 12.2 }
    { "index": { "_index": "test-index", "_id": "2" } }
    { "my_vector1": [2.5, 3.5], "price": 7.1 }
    ```
    {% include copy-curl.html %}

    If searches are performed while vector data structures are disabled, they will run using exact k-NN search.

1. **Reenable vector data structure creation**: Once indexing is complete, enable vector data structure creation by setting `index.knn.advanced.approximate_threshold` to `0`:

    ```json
    PUT /test-index/_settings
    {
      "index.knn.advanced.approximate_threshold": "0"
    }
    ```
    {% include copy-curl.html %}

    If you do not reset the setting to `0` before the force merge, you will need to reindex your data.
    {: .note}

1. **Force merge segments into one segment**: Perform a force merge and specify `max_num_segments=1` to create the vector data structures only once:

    ```json
    POST test-index/_forcemerge?max_num_segments=1
    ```
    {% include copy-curl.html %}

    After the force merge, new search requests will execute approximate k-NN search using the newly created data structures.

## Search performance tuning

Take the following steps to improve search performance:

### Reduce segment count

   To improve search performance, you must keep the number of segments under control. Lucene's IndexSearcher searches over all of the segments in a shard to find the 'size' best results.

   Ideally, having one segment per shard provides the optimal performance with respect to search latency. You can configure an index to have multiple shards to avoid giant shards and achieve more parallelism.

   You can control the number of segments by choosing a larger refresh interval, or during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval.

### Warm up the index

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


### Avoid reading stored fields

   If your use case is simply to read the IDs and scores of the nearest neighbors, you can disable reading stored fields, which saves time retrieving the vectors from stored fields.

### Use `mmap` file I/O

   For the Lucene-based approximate k-NN search, there is no dedicated cache layer that speeds up read/write operations. Instead, the plugin relies on the existing caching mechanism in OpenSearch core. In versions 2.4 and earlier of the Lucene-based approximate k-NN search, read/write operations were based on Java NIO by default, which can be slow, depending on the Lucene version and number of segments per shard. Starting with version 2.5, k-NN enables [`mmap`](https://en.wikipedia.org/wiki/Mmap) file I/O by default when the store type is `hybridfs` (the default store type in OpenSearch). This leads to fast file I/O operations and improves the overall performance of both data ingestion and search. The two file extensions specific to vector values that use `mmap` are `.vec` and `.vem`. For more information about these file extensions, see [the Lucene documentation](https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/codecs/lucene90/Lucene90HnswVectorsFormat.html).

   The `mmap` file I/O uses the system file cache rather than memory allocated for the Java heap, so no additional allocation is required. To change the default list of extensions set by the plugin, update the `index.store.hybrid.mmap.extensions` setting at the cluster level using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings). **Note**: This is an expert-level setting that requires closing the index before updating the setting and reopening it after the update.

## Improving recall

Recall depends on multiple factors like number of vectors, number of dimensions, segments, and so on. Searching over a large number of small segments and aggregating the results leads to better recall than searching over a small number of large segments and aggregating results. The larger the native library index, the more chances of losing recall if you're using smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. That being said, it's important to understand your system's requirements for latency and accuracy, and then choose the number of segments you want your index to have based on experimentation.

The default parameters work on a broader set of use cases, but make sure to run your own experiments on your data sets and choose the appropriate values. For index-level settings, see [Index settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#index-settings).

## Approximate nearest neighbor versus score script

The standard k-NN query and custom scoring option perform differently. Test with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latency, but be sure to keep shard size within the [recommended guidelines]({{site.url}}{{site.baseurl}}/intro/#primary-and-replica-shards).
