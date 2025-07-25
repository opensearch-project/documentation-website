---
layout: default
title: Settings
parent: k-NN search
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/settings/
---

# k-NN settings

The k-NN plugin adds several new cluster settings. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster settings

The following table lists all available cluster-level k-NN settings. For more information about cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api) and [Updating cluster settings using the API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api).

Setting | Static/Dynamic | Default | Description
:--- | :--- | :--- | :---
`knn.plugin.enabled`| Dynamic | `true` | Enables or disables the k-NN plugin.
`knn.algo_param.index_thread_qty` | Dynamic | `1` | The number of threads used for native library index creation. Keeping this value low reduces the CPU impact of the k-NN plugin but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | Dynamic | `false` | Whether to remove native library indexes that have not been accessed for a certain duration from memory.
`knn.cache.item.expiry.minutes` | Dynamic | `3h` | If enabled, the amount of idle time before a native library index is removed from memory.
`knn.circuit_breaker.unset.percentage` | Dynamic | `75` | The native memory usage threshold for the circuit breaker. Memory usage must be lower than this percentage of `knn.memory.circuit_breaker.limit` in order for `knn.circuit_breaker.triggered` to remain `false`.
`knn.circuit_breaker.triggered` | Dynamic | `false` | True when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | Dynamic | `50%` | The native memory limit for native library indexes. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, then the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, then the plugin removes the native library indexes used least recently.
`knn.memory.circuit_breaker.enabled` | Dynamic | `true` | Whether to enable the k-NN memory circuit breaker.
`knn.model.index.number_of_shards`| Dynamic | `1` | The number of shards to use for the model system index, which is the OpenSearch index that stores the models used for approximate nearest neighbor (ANN) search.
`knn.model.index.number_of_replicas`| Dynamic | `1` | The number of replica shards to use for the model system index. Generally, in a multi-node cluster, this value should be at least 1 in order to increase stability.
`knn.model.cache.size.limit` | Dynamic | `10%` |  The model cache limit cannot exceed 25% of the JVM heap.
`knn.faiss.avx2.disabled` | Static | `false` | A static setting that specifies whether to disable the SIMD-based `libopensearchknn_faiss_avx2.so` library and load the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. For more information, see [SIMD optimization for the Faiss engine]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#simd-optimization-for-the-faiss-engine).
`knn.faiss.avx512.disabled` | Static | `false` | A static setting that specifies whether to disable the SIMD-based `libopensearchknn_faiss_avx512.so` library and load the `libopensearchknn_faiss_avx2.so` library or the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. For more information, see [SIMD optimization for the Faiss engine]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#simd-optimization-for-the-faiss-engine).

## Index settings

The following table lists all available index-level k-NN settings. All settings are static. For information about updating static index-level settings, see [Updating a static index setting]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#updating-a-static-index-setting).

Setting | Default | Description
:--- | :--- | :--- 
`index.knn.advanced.filtered_exact_search_threshold`| `null` | The filtered ID threshold value used to switch to exact search during filtered ANN search. If the number of filtered IDs in a segment is lower than this setting's value, then exact search will be performed on the filtered IDs. 
`index.knn.algo_param.ef_search` | `100` | `ef` (or `efSearch`) represents the size of the dynamic list for the nearest neighbors used during a search. Higher `ef` values lead to a more accurate but slower search. `ef` cannot be set to a value lower than the number of queried nearest neighbors, `k`. `ef` can take any value between `k` and the size of the dataset. 