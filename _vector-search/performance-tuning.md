---
layout: default
title: Performance tuning
nav_order: 70
has_children: true
redirect_from:
  - /search-plugins/knn/performance-tuning/
---

# Performance tuning

This topic provides performance tuning recommendations to improve indexing and search performance for approximate k-NN (ANN). From a high level, k-NN works according to these principles:
* Native library indexes are created per knn_vector field / (Lucene) segment pair.
* Queries execute on segments sequentially inside the shard (same as any other OpenSearch query).
* Each native library index in the segment returns <=k neighbors.
* The coordinator node picks up final size number of neighbors from the neighbors returned by each shard.

This topic also provides recommendations for comparing approximate k-NN to exact k-NN with score script.

## Recommendations for engines and cluster node sizing

Each of the three engines used for approximate k-NN search has its own attributes that make one more sensible to use than the others in a given situation. Use the following information to help determine which engine will best meet your requirements.

In general, NMSLIB (deprecated) outperforms both Faiss and Lucene when used for search operations. However, to optimize for indexing throughput, Faiss is a good option. For relatively smaller datasets (up to a few million vectors), the Lucene engine demonstrates better latencies and recall. At the same time, the size of the index is smallest compared to the other engines, which allows it to use smaller AWS instances for data nodes. For further considerations, see [Choosing the right method]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#choosing-the-right-method) and [Memory estimation]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#memory-estimation).

When considering cluster node sizing, a general approach is to first establish an even distribution of the index across the cluster. However, there are other considerations. To help make these choices, you can refer to the OpenSearch managed service guidance in the section [Sizing domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/sizing-domains.html).

## Improving recall

Recall depends on multiple factors like number of vectors, number of dimensions, segments, and so on. Searching over a large number of small segments and aggregating the results leads to better recall than searching over a small number of large segments and aggregating results. The larger the native library index, the more chances of losing recall if you're using smaller algorithm parameters. Choosing larger values for algorithm parameters should help solve this issue but sacrifices search latency and indexing time. That being said, it's important to understand your system's requirements for latency and accuracy, and then choose the number of segments you want your index to have based on experimentation.

The default parameters work on a broader set of use cases, but make sure to run your own experiments on your data sets and choose the appropriate values. For index-level settings, see [Index settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings).

## Approximate nearest neighbor compared to score script

The standard k-NN query and custom scoring option perform differently. Test with a representative set of documents to see if the search results and latencies match your expectations.

Custom scoring works best if the initial filter reduces the number of documents to no more than 20,000. Increasing shard count can improve latency, but be sure to keep shard size within the [recommended guidelines]({{site.url}}{{site.baseurl}}/intro/#primary-and-replica-shards).

## SIMD optimization for the Faiss engine

Starting with version 2.13, OpenSearch supports [Single Instruction Multiple Data (SIMD)](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data) processing if the underlying hardware supports SIMD instructions (AVX2 on x64 architecture and Neon on ARM64 architecture). SIMD is supported by default on Linux machines only for the Faiss engine. SIMD architecture helps boost overall performance by improving indexing throughput and reducing search latency. Starting with version 2.18, OpenSearch supports AVX-512 SIMD instructions on x64 architecture. Starting with version 2.19, OpenSearch supports advanced AVX-512 SIMD instructions on x64 architecture for Intel Sapphire Rapids or a newer-generation processor, improving the performance of Hamming distance computation. 

SIMD optimization is applicable only if the vector dimension is a multiple of 8.
{: .note}

<!-- vale off -->
### x64 architecture
<!-- vale on -->

For x64 architecture, the following versions of the Faiss library are built and shipped with the artifact:

- `libopensearchknn_faiss_avx512_spr.so`: The Faiss library containing advanced AVX-512 SIMD instructions for newer-generation processors, available on public clouds such as AWS for c/m/r 7i or newer instances. 
- `libopensearchknn_faiss_avx512.so`: The Faiss library containing AVX-512 SIMD instructions. 
- `libopensearchknn_faiss_avx2.so`: The Faiss library containing AVX2 SIMD instructions.
- `libopensearchknn_faiss.so`: The non-optimized Faiss library without SIMD instructions.

When using the Faiss library, the performance ranking is as follows: advanced AVX-512 > AVX-512 > AVX2 > no optimization.
{: .note }

If your hardware supports advanced AVX-512(spr), OpenSearch loads the `libopensearchknn_faiss_avx512_spr.so` library at runtime.

If your hardware supports AVX-512, OpenSearch loads the `libopensearchknn_faiss_avx512.so` library at runtime.

If your hardware supports AVX2 but doesn't support AVX-512, Open loads the `libopensearchknn_faiss_avx2.so` library at runtime.

To disable the advanced AVX-512 (for Sapphire Rapids or newer-generation processors), AVX-512, and AVX2 SIMD instructions and load the non-optimized Faiss library (`libopensearchknn_faiss.so`), specify the `knn.faiss.avx512_spr.disabled`, `knn.faiss.avx512.disabled`, and `knn.faiss.avx2.disabled` static settings as `true` in `opensearch.yml` (by default, all of these are `false`).

Note that to update a static setting, you must stop the cluster, change the setting, and restart the cluster. For more information, see [Static settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).

### ARM64 architecture

For the ARM64 architecture, only one performance-boosting Faiss library (`libopensearchknn_faiss.so`) is built and shipped. The library contains Neon SIMD instructions and cannot be disabled. 