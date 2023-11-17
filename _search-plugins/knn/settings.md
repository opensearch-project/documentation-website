---
layout: default
title: Settings
parent: k-NN
nav_order: 40
---

# k-NN settings

The k-NN plugin adds several new cluster settings. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster settings

Setting | Default | Description
:--- | :--- | :---
`knn.algo_param.index_thread_qty` | 1 | The number of threads used for native library index creation. Keeping this value low reduces the CPU impact of the k-NN plugin, but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | false | Whether to remove native library indexes that have not been accessed for a certain duration from memory.
`knn.cache.item.expiry.minutes` | 3h | If enabled, the idle time before removing a native library index from memory.
`knn.circuit_breaker.unset.percentage` | 75% | The native memory usage threshold for the circuit breaker. Memory usage must be below this percentage of `knn.memory.circuit_breaker.limit` for `knn.circuit_breaker.triggered` to remain false.
`knn.circuit_breaker.triggered` | false | True when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | 50% | The native memory limit for native library indexes. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, k-NN removes the least recently used native library indexes.
`knn.memory.circuit_breaker.enabled` | true | Whether to enable the k-NN memory circuit breaker.
`knn.plugin.enabled`| true | Enables or disables the k-NN plugin.
`knn.model.index.number_of_shards`| 1 | The number of shards to use for the model system index, the OpenSearch index that stores the models used for Approximate Nearest Neighbor (ANN) search.
`knn.model.index.number_of_replicas`| 1 | The number of replica shards to use for the model system index. Generally, in a multi-node cluster, this should be at least 1 to increase stability.
`knn.advanced.filtered_exact_search_threshold`| null | The threshold value for the filtered IDs that is used to switch to exact search during filtered ANN search. If the number of filtered IDs in a segment is less than this setting's value, exact search will be performed on the filtered IDs.  
