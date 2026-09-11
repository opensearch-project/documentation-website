---
layout: default
title: Neural sparse ANN search performance tuning
parent: Performance tuning
nav_order: 30
has_math: true
---

# Neural sparse ANN search performance tuning

[Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/) offers several parameters that allow you to balance the trade-off between query recall (accuracy) and query efficiency (latency). You can change the algorithm parameters described in this section dynamically, without needing to delete and recreate an index for them to take effect. The `method` object of a `sparse_vector` field is an exception: the `engine` parameter and everything in `method.parameters`, including `forward_index`, are fixed when the field is created, so changing them requires reindexing into a new index.

## Choosing an engine
**Introduced 3.9**
{: .label .label-purple }

Neural sparse ANN search runs the SEISMIC algorithm on one of two engines, which you select for each `sparse_vector` field using the `method.engine` mapping parameter. Valid values are `lucene` (default) and `native`. For a conceptual overview of the engines, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).

The following request creates an index with a field that uses the native engine:

```json
PUT /sparse-ann-documents
{
  "settings": {
    "index": {
      "sparse": true
    }
  },
  "mappings": {
    "properties": {
      "sparse_embedding": {
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "engine": "native",
          "parameters": {
            "n_postings": 4000,
            "cluster_ratio": 0.1,
            "forward_index": "per_block"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Before a field can use the native engine, both `plugins.neural_search.sparse.native_engine_feature_enabled` and `plugins.neural_search.sparse.native_engine_enabled` must be `true`. Because `plugins.neural_search.sparse.native_engine_enabled` defaults to `false`, the native engine is opt-in. For more information, see [Enabling the native engine]({{site.url}}{{site.baseurl}}/vector-search/settings/#enabling-the-native-engine).

Both engines support the same query `method_parameters` values, and they support the same `method.parameters` values except for `clustering_batch_size` and `forward_index`, which apply to the native engine only. The tuning guidance in the rest of this page therefore applies to both engines. The engines differ in where they keep the data structures that the algorithm reads, which changes how you size a node:

Characteristic | Lucene engine | Native engine
:--- | :--- | :---
Query performance | Baseline | Higher search throughput and lower query latency
Index build performance | Baseline | Faster segment and force merge builds
Storage of clustered posting lists and forward index | JVM heap caches | A memory-mapped file on disk, read off-heap
Cache management | A plugin-managed cache bounded by `plugins.neural_search.circuit_breaker.limit`, which you can preload using the [Warm up API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#warm-up) and release using the [Clear cache API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#clear-cache) | No plugin-managed cache and no eviction
Effect on garbage collection | Index memory is retained on the JVM heap | Index memory is reclaimable operating system page cache, so it does not add garbage collection pressure
First query against a segment | Loads the segment's sparse data into the cache | Pays a one-time memory-mapping cost
Disk usage | Managed by Lucene | Adds a dedicated engine file, whose size depends on the [forward index layout](#forward-index-layout)
Memory statistics | Reported by the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats) | Not reported by the Neural Search Stats API

The engine is fixed when the field is created. Switching engines requires reindexing your data into a new index.
{: .important}

Consider the native engine when you want better query and index build performance, when your sparse indexes are large enough that holding them in JVM heap constrains the node, or when you want to serve a large sparse index from a comparatively small heap. Consider the Lucene engine when you want the default, fully supported path, or when you rely on the warm up and clear cache APIs or the sparse memory statistics.

Benchmark both engines against your own data and query mix before choosing one. Relative throughput, latency, and memory usage depend on your corpus, your parameter settings, and the resources available on the node.
{: .note}

### Forward index layout

For fields that use the native engine, the `forward_index` algorithm parameter controls how the forward index is laid out on disk. Specify it in the field's `method.parameters` object. Valid values are `shared` (default) and `per_block`:

- `shared`: Stores one contiguous forward index for the field. This layout uses less disk space.
- `per_block`: Stores each block's vectors inline next to the block, so a query reads only the blocks that it selects. This layout reduces query latency but uses more disk space.

The `forward_index` parameter is supported by the native engine only. Specifying a value other than the default with the Lucene engine is rejected.
{: .note}

## Indexing performance tuning

These parameters control index construction and memory usage:

- `n_postings`: The maximum number of documents to retain in each posting list.

    A smaller `n_postings` value applies more aggressive pruning, meaning fewer document identifiers are kept in each posting list. Lower values speed up index building and query execution but reduce recall and memory consumption. If not specified, the algorithm calculates the value as $$0.0005 \times \text{document count}$$ at the segment level.

- `cluster_ratio`: The fraction of documents in each posting list used to determine the cluster count.

    After pruning, each posting list contains `cluster_ratio × posting_document_count`. Increasing `cluster_ratio` results in more clusters, which improves recall but increases index build time, query latency, and memory usage.

- `summary_prune_ratio`: The fraction of tokens to keep in cluster summary vectors for approximate matching.

    This parameter controls how many tokens are retained in the `summary` of each cluster. The `summary` helps determine whether to examine a cluster during a query. If embeddings vary widely in token counts, adjust this parameter accordingly. Higher values retain more tokens in the `summary`.

- `approximate_threshold`: The minimum number of documents in a segment required to activate neural sparse ANN search.

    This parameter controls whether to activate the neural sparse ANN algorithm in a segment once the segment's document count reaches the specified threshold. As the total number of documents increases, individual segments contain more documents. In this case, you can set `approximate_threshold` to a higher value in order to avoid rebuilding clusters repeatedly when segments with fewer documents are merged. This parameter is especially important if you do not use force merge operations to combine all segments into one, because segments with fewer documents than the threshold fall back to the `rank_features` (regular neural sparse search) mode. Note that if you set this value too high, neural sparse ANN search may never activate.

- `clustering_batch_size`: The number of batches that each inverted list is split into for clustering. Supported for the native engine only.

    By default, this parameter is `1` and clustering runs over the whole corpus. Setting it to a higher value, up to `10000`, splits each inverted list into that many batches and clusters each batch separately, which significantly reduces the memory required to build the index in exchange for a longer build time. Increase this value if index building is memory constrained.

## Query performance tuning

These parameters affect search performance and recall:

- `top_n`: The number of query tokens with the highest weights to retain for approximate sparse queries.

    In the neural sparse ANN search algorithm, only the top `top_n` tokens in a query are retained based on their weights. This parameter controls the balance between search efficiency (latency) and accuracy (recall). A higher value improves accuracy but increases latency, while a lower value reduces latency at the cost of accuracy.

- `heap_factor`: Controls the trade-off between recall and performance.

    During neural sparse ANN search, the algorithm decides whether to examine a cluster by comparing the cluster's score with the top score in the result queue divided by `heap_factor`. A larger `heap_factor` lowers the threshold that clusters must meet in order to be examined, causing the algorithm to examine more clusters and improving accuracy at the cost of slower query speed. Conversely, a smaller `heap_factor` raises the threshold, making the algorithm more selective about which clusters to examine. This parameter provides finer control than `top_n`, allowing you to slightly adjust the trade-off between accuracy and latency.


## Other optimization strategies

In addition to tuning the preceding parameters, you can employ the following optimization strategies.

### Building clusters

Index building can benefit from using multiple threads. You can adjust the number of threads used for cluster building by specifying the `neural_search.sparse.algo_param.index_thread_qty` setting (by default, `1`). For information about updating this setting, see [Vector search settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#cluster-settings-2). Using a higher `neural_search.sparse.algo_param.index_thread_qty` can reduce force merge time when neural sparse ANN search is enabled, though it also consumes more system resources. This setting applies to both the Lucene engine and the native engine.

### Querying after a cold start

On the Lucene engine, the cache is empty after rebooting OpenSearch, so the first several hundred queries may experience high latency. To address this "cold start" issue, you can use the [Warmup API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#warm-up). This API loads data from disk into cache, ensuring optimal performance for subsequent queries. You can also use the [Clear Cache API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#clear-cache) to free up memory when needed.

The native engine does not use this cache, so the Warmup and Clear Cache APIs do not apply to it. Instead, the first query against a segment pays a one-time cost to memory map the segment's index file. Later queries reuse the existing mapping.

### Force merging segments

Neural sparse ANN search automatically builds clustered posting lists once a segment's document count exceeds `approximate_threshold`. However, you can often achieve lower query latency by merging all segments into a single segment:

```json
POST /sparse-ann-documents/_forcemerge?max_num_segments=1
```
{% include copy-curl.html %}

You can also set `approximate_threshold` to a high value so that individual segments do not trigger clustering but the merged segment does. This approach helps avoid repeated cluster building during indexing.

Building the sparse index is substantially faster on the native engine, so force merges complete sooner. For more information, see [Choosing an engine](#choosing-an-engine).

## Best practices

- Start with default parameters and tune based on your specific dataset.
- On the Lucene engine, monitor memory usage and adjust cache settings accordingly.
- Consider the trade-off between indexing time and query performance.
- Choose an engine before creating the field. `method` is not updatable, so switching engines later requires reindexing into a new index.
- If you are memory constrained or your JVM heap is under pressure, we recommend the native engine, which keeps its index in a memory-mapped file instead of the JVM heap.
- When sizing a node for the native engine, leave enough RAM for operating system page cache rather than increasing the JVM heap.
- Use `forward_index: per_block` when query latency matters more than disk usage, and keep the default `shared` layout when you want to minimize disk usage.
- On the native engine, if index building is memory constrained, increase `clustering_batch_size` to lower peak build memory in exchange for a longer build time.
- Do not combine neural sparse ANN search fields with a pipeline that includes a [two-phase processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/).

## Next steps

- [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/)