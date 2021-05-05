---
layout: default
title: Settings
parent: k-NN
nav_order: 6
---

# k-NN Settings

The k-NN plugin adds several new index and cluster settings.


## Index settings

The default values should work well for most use cases, but you can change these settings when you create the index.

Setting | Default | Description
:--- | :--- | :---
`index.knn.algo_param.ef_search` | 512 | The size of the dynamic list used during KNN searches. Higher values lead to more accurate, but slower searches.
`index.knn.algo_param.ef_construction` | 512 | The size of the dynamic list used during KNN graph creation. Higher values lead to a more accurate graph, but slower indexing speed.
`index.knn.algo_param.m` | 16 | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2-100.
`index.knn.space_type` | "l2" | The vector space used to calculate the distance between vectors. Currently, the KNN plugin supports the `l2` space (Euclidean distance) and `cosinesimil` space (cosine similarity). For more information on these spaces, refer to the [nmslib documentation](https://github.com/nmslib/nmslib/blob/master/manual/spaces.md).


## Cluster settings

Setting | Default | Description
:--- | :--- | :---
`knn.algo_param.index_thread_qty` | 1 | The number of threads used for graph creation. Keeping this value low reduces the CPU impact of the KNN plugin, but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | false | Whether to remove graphs that have not been accessed for a certain duration from memory.
`knn.cache.item.expiry.minutes` | 3h | If enabled, the idle time before removing a graph from memory.
`knn.circuit_breaker.unset.percentage` | 75.0 | The native memory usage threshold for the circuit breaker. Memory usage must be below this percentage of `knn.memory.circuit_breaker.limit` for `knn.circuit_breaker.triggered` to remain false.
`knn.circuit_breaker.triggered` | false | True when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | 50% | The native memory limit for graphs. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, KNN removes the least recently used graphs.
`knn.memory.circuit_breaker.enabled` | true | Whether to enable the KNN memory circuit breaker.
`knn.plugin.enabled`| true | Enables or disables the KNN plugin.
