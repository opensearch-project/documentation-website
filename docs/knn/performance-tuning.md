---
layout: default
title: Performance Tuning
parent: k-NN
nav_order: 7
---

# Performance tuning

This section provides recommendations for performance tuning to improve indexing/search performance for approximate k-NN. From a high level, k-NN works according to these principles:
* Graphs are created per knn_vector field / (Lucene) segment pair.
* Queries execute on segments sequentially inside the shard (same as any other OpenSearch query).
* Each graph in the segment returns <=k neighbors.
* Coordinator node picks up final size number of neighbors from the neighbors returned by each shard.

Additionally, this section provides recommendations for comparing approximate k-NN to exact k-NN with score script.

## Indexing performance tuning

The following steps can be taken to help improve indexing performance, especially when you plan to index a large number of vectors at once:
1. Disable refresh interval (Default = 1 sec) or set a long duration for refresh interval to avoid creating multiple small segments

```json
PUT /<index_name>/_settings
{
    "index" : {
        "refresh_interval" : "-1"
    }
}
```
*Note* -- Be sure to reenable refresh_interval after indexing finishes.

2. Disable Replicas (No OpenSearch replica shard).

Settings replicas to 0 avoids duplicate construction of graphs in both primary and replicas. When we enable replicas after the indexing, the serialized graphs are directly copied. Having no replicas means that losing a node(s) may incur data loss, so it is important that the data lives elsewhere so that this initial load can be retried in case of an issue.

3. Increase number of indexing threads

If the hardware we choose has multiple cores, we can allow multiple threads in graph construction by speeding up the indexing process. You can determine the number of threads to be allotted by using the [knn.algo_param.index_thread_qty](../settings/#Cluster-settings) setting.

Please keep an eye on CPU utilization and choose the right number of threads. Because graph construction is costly, having multiple threads can put additional load on CPU.

## Search performance tuning

1. Have fewer segments

To improve search performance, it is necessary to keep the number of segments under control. Lucene's IndexSearcher searches over all of the segments in a shard to find the 'size' best results. But, because the complexity of search for the HNSW algorithm is logarithmic with respect to the number of vectors, searching over 5 graphs with 100 vectors each and then taking the top size results from 5*k results will take longer than searching over 1 graph with 500 vectors and then taking the top size results from k results. Ideally, having 1 segment per shard will give the optimal performance with respect to search latency. We can configure index to have multiple shards to avoid giant shards and achieve more parallelism.

We can control the number of segments either during indexing by asking OpenSearch to slow down segment creation by disabling the refresh interval or choosing larger refresh interval.

2. Warm up the index

The graphs are constructed during indexing, but they are loaded into memory during the first search. The way search works in Lucene is that each segment is searched sequentially (so, for k-NN, each segment returns up to k nearest neighbors of the query point), and the top size number of results based on the score would be returned from all of the results returned by segements at a shard level (higher score --> better result).

Once a graph is loaded (graphs are loaded outside OpenSearch JVM), we cache the graphs in memory. The initial queries would be expensive in the order of a few seconds, and subsequent queries should be faster in the order of milliseconds (assuming knn circuit breaker is not hit).

To avoid this latency penalty during your first queries, you can use the warmup API operation on the indices they want to search.

### Usage

```json
GET /_opensearch/_knn/warmup/index1,index2,index3?pretty
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

The warmup API operation loads all of the graphs for all of the shards (primaries and replicas) for the specified indices into the cache. Thus, there will be no penalty to load graphs during initial searches.

*Note* - This API only loads the segments of the indices it sees into the cache. If a merge or refresh operation finishes after this API is ran or if new documents are added, this API will need to be re-ran to load those graphs into memory.

3. Avoid reading stored fields

If the use case is to just read the nearest neighbors' Ids and scores, then we can disable reading stored fields, which can save some time retrieving the vectors from stored fields.

## Improving Recall

Recall depends on multiple factors like number of vectors, number of dimensions, segments, etc. Searching over a large number of small segments and aggregating the results leads to better recall than searching over a small number of large segments and aggregating results. The larger the graph, the more chances of losing recall if you are sticking with smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. That being said, it is important to understand your system's requirements for latency and accuracy, and then choose the number of segments you want your index to have based on experimentation.

Recall can be configured by adjusting the algorithm parameters of the HNSW algorithm exposed through index settings. Algorithm params that control recall are m, ef_construction, ef_search. For more details on influence of algorithm parameters on the indexing and search recall, please refer to the [HNSW algorithm parameters document](https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md). Increasing these values could help recall (leading to better search results) but at the cost of higher memory utilization and increased indexing time. Our default values work on a broader set of use cases from our experiments, but we encourage users to run their own experiments on their data sets and choose the appropriate values. For index-level settings, please refer to the [settings page](../settings#index-settings). We will add details on our experiments here shortly.

## Estimating Memory Usage

Typically, in an OpenSearch cluster, a certain portion of RAM is set aside for the JVM heap. The k-NN plugin allocates graphs to a portion of the remaining RAM. This portion's size is determined by the circuit_breaker_limit cluster setting. By default, the circuit breaker limit is set at 50%.

The memory required for graphs is estimated to be `1.1 * (4 * dimension + 8 * M)` bytes/vector.

As an example, assume that we have 1 Million vectors with a dimension of 256 and M of 16, and the memory required can be estimated as:

```
1.1 * (4 *256 + 8 * 16) * 1,000,000 ~= 1.26 GB
```

*Note* -- Remember that having a replica will double the total number of vectors.

## Approximate nearest neighbor vs. score script

The standard k-NN query and custom scoring option perform differently. Test with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latencies, but be sure to keep shard size within [the recommended guidelines](../../opensearch/#primary-and-replica-shards).
