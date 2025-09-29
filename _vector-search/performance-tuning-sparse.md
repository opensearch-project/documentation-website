---
layout: default
title: Sparse performance tuning
nav_order: 30
parent: Performance tuning
has_math: true
---

# Sparse ANN performance tuning

This page provides comprehensive performance tuning guidance for the [sparse ANN]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/) algorithm in OpenSearch sparse ANN search. Sparse ANN offers multiple parameters that allow you to balance the trade-off between query recall (accuracy) and query efficiency (latency).

Our sparse ANN feature supports real-time trade-off controlling when users conduct a query by those search-time parameters. This means that users do not have to delete and recreate an index if they want to change the balance between search accuracy and query performance. In total, sparse ANN employs six key parameters that affect different aspects of the algorithm:

## Index performance tuning

These parameters affect index construction and memory usage:

- **`n_postings`**: Maximum documents per posting list

If a small `n_postings` is set, more aggressive pruning will be applied to the posting list, which means that fewer document identifiers are kept in one posting list. Reducing this parameter will accelerate index building time and query time but also reduce query recall and memory consumption. If you do not specify this parameter, sparse ANN algorithm will decide this value based on $$0.0005 \times \text{document count}$$. Please note that this document count is for segment level.

- **`cluster_ratio`**: Ratio to determine cluster count

After pruning, there will be `cluster_ratio` $$*$$ `posting_document_count` in each posting list. A higher `cluster_ratio` will lead to more clusters, higher query recall, longer index building time, and higher query latency. Also, more clusters will lead to higher memory consumption.

- **`summary_prune_ratio`**: Ratio for pruning summary vectors

This parameter controls how many tokens will be kept in `summary` of each cluster, where `summary` is used to determine whether a cluster should be examined during query. If you are using different embedding models whose number of tokens greatly vary, you can consider change this parameter. Higher `summary_prune_ratio` will keep more tokens inside `summary`.

- **`approximate_threshold`**: Document threshold for sparse ANN activation

This parameter will control whether to activate sparse ANN algorithm in a segment when it's total number of documents reaches the threshold. When you have more documents in total, the number of documents in one segment will tend to increase. In this scenario, you may set this threashold larger to prevent repeating cluster building when segments with fewer documents merge together. This parameter matters especially when you do not `force_merge` all segments into one, as those segments with documents less than the threshold will fall back to rank features mode. Please note that you may not see sparse ANN activated if you set this value very high.

## Query performance tuning

These parameters affect search performance and recall:

- **`top_n`**: Query token pruning limit

In sparse ANN algorithm, a query's tokens will be pruned to only keep `top_n` ones based on their weights. This parameter will dramatically affect the balance between search efficiency (latency) and query accuracy (recall). Higher `top_n` will bring with higher accuracy and latency.

- **`heap_factor`**: Recall vs performance tuning multiplier

Every time when sparse ANN determines whether to examine a cluster, it compares potential cluster's score with current queue top's score dividing by `heap_factor`. Larger `heap_factor` will push sparse ANN algorithm to examine more clusters, resulting in higher accuracy but slower query speed. This parameter is more fine-grained compared with `top_n`, which help you slightly tune the trade-off between accuracy and latency.

## Optimize beyond parameters

### Building clusters

Index building can benefit from multiple thread working, you can adjust the number of threads (`index_thread_qty`) during building clusters. The default value of `index_thread_qty` is 1, and you can change this setting according to [Neural-Search cluster settings]({{site.url}}{{site.baseurl}}/_vector-search/settings.md/). Higher `index_thread_qty` will reduce `force_merge` time when sparse ANN is activated, while consuming more resources at the same time.

### Query after cold start

If you just reboot OpenSearch service, there are no data in cache, so first hundreds of query requests could suffer from empty cache which leads to high query latency. To mitigate this "cold start" issue, you can call `warmup` API according to [Neural Search API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/). This API will automatically load data from disk to cache, making sure the following query can have best performance. Meanwhile, you can also call `clear_cache` API to free memory usage.

### Force merge into one segment

Although sparse ANN will automatically build clustered posting lists once a segment's document count exceeds `approximate_threshold`, you should expect reduced query latency after merging all your segments into one. In addition, you can set `approximate_threshold` to a high value which will not be touched for each segment but be exceeded after merging together. This kind of setting can avoid repeated cluster building during the whole process.

```json
POST /sparse-ann-documents/_forcemerge?max_num_segments=1
```
{% include copy-curl.html %}

## Best practices

- Start with default parameters and tune based on your specific dataset
- Monitor memory usage and adjust cache settings accordingly
- Consider the trade-off between indexing time and query performance
- Do not combine sparse ANN field and two-phase pipeline together

## Next steps

- [Sparse ANN configuration reference]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann-configuration/)