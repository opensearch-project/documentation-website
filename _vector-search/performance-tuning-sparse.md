---
layout: default
title: Sparse performance tuning
nav_order: 30
parent: Neural sparse ANN search performance tuning
has_math: true
canonical_url: https://docs.opensearch.org/latest/vector-search/performance-tuning-sparse/
---

# Neural sparse ANN search performance tuning

[Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/) offers several parameters that allow you to balance the trade-off between query recall (accuracy) and query efficiency (latency). You can change these parameters dynamically, without needing to delete and recreate an index for them to take effect. 

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


## Query performance tuning

These parameters affect search performance and recall:

- `top_n`: The number of query tokens with the highest weights to retain for approximate sparse queries.

    In the neural sparse ANN search algorithm, only the top `top_n` tokens in a query are retained based on their weights. This parameter controls the balance between search efficiency (latency) and accuracy (recall). A higher value improves accuracy but increases latency, while a lower value reduces latency at the cost of accuracy.

- `heap_factor`: Controls the trade-off between recall and performance.

    During neural sparse ANN search, the algorithm decides whether to examine a cluster by comparing the cluster's score with the top score in the result queue divided by `heap_factor`. A larger `heap_factor` lowers the threshold that clusters must meet in order to be examined, causing the algorithm to examine more clusters and improving accuracy at the cost of slower query speed. Conversely, a smaller `heap_factor` raises the threshold, making the algorithm more selective about which clusters to examine. This parameter provides finer control than `top_n`, allowing you to slightly adjust the trade-off between accuracy and latency.


## Other optimization strategies

In addition to tuning the preceding parameters, you can employ the following optimization strategies.

### Building clusters

Index building can benefit from using multiple threads. You can adjust the number of threads used for cluster building by specifying the `knn.algo_param.index_thread_qty` setting (by default, `1`). For information about updating this setting, see [Vector search settings]({{site.url}}{{site.baseurl}}/vector-search/settings/). Using a higher `knn.algo_param.index_thread_qty` can reduce force merge time when neural sparse ANN search is enabled, though it also consumes more system resources.

### Querying after a cold start

After rebooting OpenSearch, the cache is empty, so the first several hundred queries may experience high latency. To address this "cold start" issue, you can use the [Warmup API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#warm-up). This API loads data from disk into cache, ensuring optimal performance for subsequent queries. You can also use the [Clear Cache API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#clear-cache) to free up memory when needed.

### Force merging segments

Neural sparse ANN search automatically builds clustered posting lists once a segment's document count exceeds `approximate_threshold`. However, you can often achieve lower query latency by merging all segments into a single segment:

```json
POST /sparse-ann-documents/_forcemerge?max_num_segments=1
```
{% include copy-curl.html %}

You can also set `approximate_threshold` to a high value so that individual segments do not trigger clustering but the merged segment does. This approach helps avoid repeated cluster building during indexing.

## Best practices

- Start with default parameters and tune based on your specific dataset.
- Monitor memory usage and adjust cache settings accordingly.
- Consider the trade-off between indexing time and query performance.
- Do not combine neural sparse ANN search fields with a pipeline that includes a [two-phase processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/).

## Next steps

- [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/)