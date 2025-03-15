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

Having one segment per shard provides optimal performance with respect to search latency. You can configure an index to have multiple shards in order to avoid very large shards and achieve more parallelism.

You can control the number of segments by choosing a larger refresh interval or during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval.

## Warm up the index

Native library indexes are constructed during indexing, but they're loaded into memory during the first search. In Lucene, each segment is searched sequentially (so, for k-NN, each segment returns up to k nearest neighbors of the query point). The top `size` results, ranked by score, are returned from all segment-level results within a shard (a higher score indicates a better result).

Once a native library index is loaded (native library indexes are loaded outside of the OpenSearch JVM), OpenSearch caches them in memory. Initial queries are expensive and complete in a few seconds, while subsequent queries are faster and complete in milliseconds (assuming that the k-NN circuit breaker isn't triggered).

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
{% include copy-curl.html %}

The warmup API operation loads all native library indexes for all shards (primaries and replicas) for the specified indexes into the cache, so there's no penalty for loading native library indexes during initial searches.

This API operation only loads the segments of active indexes into the cache. If a merge or refresh operation finishes after the API runs, or if you add new documents, you need to rerun the API to load those native library indexes into memory.
{: .warning}


## Avoid reading stored fields

If your use case only involves reading the IDs and scores of the nearest neighbors, you can disable the reading of stored fields, which saves time that would otherwise be spent retrieving the vectors from stored fields.

