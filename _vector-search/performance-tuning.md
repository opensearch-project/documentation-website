---
layout: default
title: Performance tuning
nav_order: 70
has_children: true
redirect_from:
  - /search-plugins/knn/performance-tuning/
---

# Performance tuning

This topic provides performance tuning recommendations for improving indexing and search performance for approximate k-NN (ANN) search. At a high level, k-NN works according to these principles:
* Vector indexes are created per `knn_vector` field/Lucene segment pair.
* Queries execute sequentially on segments in the shard (as with any other OpenSearch query).
* The coordinator node selects the final `size` neighbors from the neighbors returned by each shard.

The following sections provide recommendations regarding comparing ANN to exact k-NN with a scoring script.

## Recommendations for engines and cluster node sizing

Each of the three engines used for ANN search has attributes that make it more sensible to use than the others in a given situation. Use the following information to help determine which engine will best meet your requirements.

To optimize for indexing throughput, Faiss is a good option. For relatively smaller datasets (up to a few million vectors), the Lucene engine demonstrates better latencies and recall. At the same time, the size of the index is smallest compared to the other engines, which allows it to use smaller AWS instances for data nodes. For further considerations, see [Choosing the right method]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#choosing-the-right-method) and [Memory estimation]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#memory-estimation).

When considering cluster node sizing, a general approach is to first establish an even distribution of the index across the cluster. However, there are other considerations. To help make these choices, you can refer to the OpenSearch managed service guidance in the [Sizing domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/sizing-domains.html) section.

## Improving recall

Recall depends on multiple factors, such as the number of vectors, dimensions, segments, and so on. Searching a large number of small segments and aggregating the results leads to better recall than searching a small number of large segments and aggregating the results. Larger native library indexes are more likely to lose recall if you're using smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. It's important to understand your system's requirements for latency and accuracy and then choose the number of segments based on experimentation.

The default parameters work for a broader set of use cases, but make sure to run your own experiments on your datasets and choose the appropriate values. For index-level settings, see [Index settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings).

## ANN compared to scoring script

The standard k-NN query and custom scoring options perform differently. Run tests with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing the shard count can improve latency, but be sure to keep the shard size within the [recommended guidelines]({{site.url}}{{site.baseurl}}/intro/#primary-and-replica-shards).