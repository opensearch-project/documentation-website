---
layout: default
title: Settings
nav_order: 90
redirect_from:
  - /search-plugins/knn/settings/
canonical_url: https://docs.opensearch.org/latest/vector-search/settings/
---

# Vector search settings

OpenSearch supports the following vector search settings. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster settings

The following table lists all available cluster-level vector search settings. For more information about cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api) and [Updating cluster settings using the API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api).

Setting | Static/Dynamic | Default | Description
:--- | :--- | :--- | :---
`knn.plugin.enabled`| Dynamic | `true` | Enables or disables the k-NN plugin.
`knn.algo_param.index_thread_qty` | Dynamic | `1` | The number of threads used for native library and Lucene library (for OpenSearch version 2.19 and later) index creation. Keeping this value low reduces the CPU impact of the k-NN plugin but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | Dynamic | `false` | Whether to remove native library indexes from memory that have not been accessed in a specified period of time.
`knn.cache.item.expiry.minutes` | Dynamic | `3h` | If enabled, the amount of idle time before a native library index is removed from memory.
`knn.circuit_breaker.unset.percentage` | Dynamic | `75` | The native memory usage threshold for the circuit breaker. Memory usage must be lower than this percentage of `knn.memory.circuit_breaker.limit` in order for `knn.circuit_breaker.triggered` to remain `false`.
`knn.circuit_breaker.triggered` | Dynamic | `false` | `true` when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | Dynamic | `50%` | The native memory limit for native library indexes. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, then the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, then the plugin removes the native library indexes used least recently.
`knn.memory.circuit_breaker.enabled` | Dynamic | `true` | Whether to enable the k-NN memory circuit breaker.
`knn.model.index.number_of_shards`| Dynamic | `1` | The number of shards to use for the model system index, which is the OpenSearch index that stores the models used for approximate nearest neighbor (ANN) search.
`knn.model.index.number_of_replicas`| Dynamic | `1` | The number of replica shards to use for the model system index. Generally, in a multi-node cluster, this value should be at least 1 in order to increase stability.
`knn.model.cache.size.limit` | Dynamic | `10%` |  The model cache limit cannot exceed 25% of the JVM heap.
`knn.faiss.avx2.disabled` | Static | `false` | A static setting that specifies whether to disable the SIMD-based `libopensearchknn_faiss_avx2.so` library and load the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. For more information, see [Single Instruction Multiple Data (SIMD) optimization]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#simd-optimization).
`knn.faiss.avx512_spr.disabled` | Static | `false` | A static setting that specifies whether to disable the SIMD-based `libopensearchknn_faiss_avx512_spr.so` library and load either the `libopensearchknn_faiss_avx512.so` , `libopensearchknn_faiss_avx2.so`, or the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. For more information, see [SIMD optimization for the Faiss engine]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#simd-optimization).

## Index settings

The following table lists all available index-level k-NN settings. For information about updating these settings, see [Index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#index-level-index-settings).

Several parameters defined in the settings are currently in the deprecation process. Those parameters should be set in the mapping instead of in the index settings. Parameters set in the mapping will override the parameters set in the index settings. Setting the parameters in the mapping allows an index to have multiple `knn_vector` fields with different parameters.

Setting | Static/Dynamic | Default | Description
:--- | :--- |:--------| :---
`index.knn` | Static | `false` | Whether the index should build native library indexes for the `knn_vector` fields. If set to `false`, the `knn_vector` fields will be stored in doc values, but approximate k-NN search functionality will be disabled.
`index.knn.algo_param.ef_search` | Dynamic | `100`   | `ef` (or `efSearch`) represents the size of the dynamic list for the nearest neighbors used during a search. Higher `ef` values lead to a more accurate but slower search. `ef` cannot be set to a value lower than the number of queried nearest neighbors, `k`. `ef` can take any value between `k` and the size of the dataset. 
`index.knn.advanced.approximate_threshold` | Dynamic | `15000` | The number of vectors that a segment must have before creating specialized data structures for ANN search. Set to `-1` to disable building vector data structures and to `0` to always build them.
`index.knn.advanced.filtered_exact_search_threshold`| Dynamic | None    | The filtered ID threshold value used to switch to exact search during filtered ANN search. If the number of filtered IDs in a segment is lower than this setting's value, then exact search will be performed on the filtered IDs.
`index.knn.derived_source.enabled` (Experimental) | Static | `false` | Removes vectors from `_source` storage, reducing overall disk consumption for vector indexes. Only supported for non-nested fields. This feature is experimental in OpenSearch 2.19. It is not recommended for production use. Backward compatibility is not guaranteed.
`index.knn.algo_param.ef_construction` | Static | `100`   | Deprecated in 1.0.0. Use the [mapping parameters]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) to set this value instead.
`index.knn.algo_param.m` | Static | `16`    | Deprecated in 1.0.0. Use the [mapping parameters]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) to set this value instead.
`index.knn.space_type` | Static | `l2`    | Deprecated in 1.0.0. Use the [mapping parameters]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) to set this value instead.

An index created in OpenSearch version 2.11 or earlier will still use the previous `ef_construction` and `ef_search` values (`512`).
{: .note}