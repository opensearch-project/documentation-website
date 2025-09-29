---
layout: default
title: Settings
nav_order: 90
redirect_from:
  - /search-plugins/knn/settings/
---

# Vector search settings

OpenSearch supports the following vector search settings. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster settings

The following table lists all available cluster-level vector search settings. For more information about cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api) and [Updating cluster settings using the API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api).

Setting | Static/Dynamic | Default | Description
:--- | :--- | :--- | :---
`knn.algo_param.index_thread_qty` | Dynamic |  `1` for systems with fewer than 32 CPU cores, `4` for systems with 32 or more cores | The number of threads used for native library and Lucene library (for OpenSearch version 2.19 and later) index creation. Keeping this value low reduces the CPU impact of the k-NN plugin but also reduces indexing performance.
`knn.cache.item.expiry.enabled` | Dynamic | `false` | Whether to remove native library indexes from memory that have not been accessed in a specified period of time.
`knn.cache.item.expiry.minutes` | Dynamic | `3h` | If enabled, the amount of idle time before a native library index is removed from memory.
`knn.circuit_breaker.unset.percentage` | Dynamic | `75` | The native memory usage threshold for the circuit breaker. Memory usage must be lower than this percentage of `knn.memory.circuit_breaker.limit` in order for `knn.circuit_breaker.triggered` to remain `false`.
`knn.circuit_breaker.triggered` | Dynamic | `false` | `true` when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value.
`knn.memory.circuit_breaker.limit` | Dynamic | `50%` | The native memory limit for native library indexes. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, then the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, then the plugin removes the native library indexes used least recently. <br><br> To configure this limit at the node level, add `node.attr.knn_cb_tier: "<tier-name>"` in `opensearch.yml` and set `knn.memory.circuit_breaker.limit.<tier-name>` in the cluster settings. For example, define a node tier as `node.attr.knn_cb_tier: "integ"` and set `knn.memory.circuit_breaker.limit.integ: "80%"`. Nodes use their tier's circuit breaker limit if configured, defaulting to the cluster-wide setting if no node-specific value is set.
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
`index.knn.advanced.approximate_threshold` | Dynamic | `0` | The number of vectors that a segment must have before creating specialized data structures for ANN search. Set to `-1` to disable building vector data structures and to `0` to always build them.
`index.knn.advanced.filtered_exact_search_threshold`| Dynamic | None    | The filtered ID threshold value used to switch to exact search during filtered ANN search. If the number of filtered IDs in a segment is lower than this setting's value, then exact search will be performed on the filtered IDs.
`index.knn.derived_source.enabled` | Static | `true` | Prevents vectors from being stored in `_source`, reducing disk usage for vector indexes.
| `index.knn.memory_optimized_search`    | Dynamic | `false` | Enables memory-optimized search on an index. |

An index created in OpenSearch version 2.11 or earlier will still use the previous `ef_construction` and `ef_search` values (`512`).
{: .note}

## Remote index build settings

The following settings control [remote vector index building]({{site.url}}{{site.baseurl}}/vector-search/remote-index-build/).

### Cluster settings

The following remote index build settings apply at the cluster level.

| Setting                                   | Static/Dynamic | Default | Description                                                                                              |
|:------------------------------------------|:---------------|:--------|:---------------------------------------------------------------------------------------------------------|
| `knn.remote_index_build.enabled`          | Dynamic        | `false` | Enables remote vector index building for the cluster.                                                    |
| `knn.remote_index_build.repository`       | Dynamic        | None    | The repository to which the remote index builder should write.                                           |
| `knn.remote_index_build.service.endpoint` | Dynamic        | None    | The endpoint URL of the remote build service.                                                            |

#### Advanced cluster settings

The following are advanced cluster settings. The default values for these settings are configured using extensive benchmarking. 

| Setting                                 | Static/Dynamic | Default | Description                                                                                                                                                                                                                                                                                                                        |
|:----------------------------------------|:---------------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `knn.remote_index_build.poll.interval`  | Dynamic        | `5s`    | How frequently the client should poll the remote build service for job status.                                                                                                                                                                                                                                                     |
| `knn.remote_index_build.client.timeout` | Dynamic        | `60m`   | The maximum amount of time to wait for remote build completion before falling back to a CPU-based build.                                                                                                                                                                                                                           |
| `knn.remote_index_build.size.max`       | Dynamic        | `0`     | The maximum segment size for the remote index build service, based on the service implementation constraints. Must be greater than `0`. |

### Index settings

The following remote index build settings apply at the index level.

| Setting                                       | Static/Dynamic | Default | Description                                               |
|:----------------------------------------------|:---------------|:--------|:----------------------------------------------------------|
| `index.knn.remote_index_build.enabled`        | Dynamic        | `false` | Enables remote index building for the index.              |

#### Advanced index settings

The following index settings are advanced settings whose default values are set as a result of extensive benchmarking.

| Setting                                 | Static/Dynamic | Default | Description                                               |
|:----------------------------------------|:---------------|:--------|:----------------------------------------------------------|
| `index.knn.remote_index_build.size.min` | Dynamic        | `50mb`  | The minimum size required to enable remote vector builds. |

### Remote build authentication

The remote build service username and password are secure settings that must be set in the [OpenSearch keystore]({{site.url}}{{site.baseurl}}/security/configuration/opensearch-keystore/) as follows:

```bash
./bin/opensearch-keystore add knn.remote_index_build.service.username
./bin/opensearch-keystore add knn.remote_index_build.service.password
```
{% include copy.html %}

You can reload the secure settings without restarting the node by using the [Nodes Reload Secure Settings API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-reload-secure/).

## Neural Search plugin settings

The Neural Search plugin supports the following settings.

### Cluster settings

The following Neural Search plugin settings apply at the cluster level:

- `plugins.neural_search.stats_enabled` (Dynamic, Boolean): Enables the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats). Default is `false`.
- `plugins.neural_search.circuit_breaker.limit` (Dynamic, Percentage): Specifies the JVM memory limit for the neural search circuit breaker. Default is `10%` of the JVM heap.
- `plugins.neural_search.circuit_breaker.overhead` (Dynamic, Float): A constant by which the sparse data estimation is multiplied to determine the final estimation. Default is `1.0`.
- `plugins.neural_search.sparse.algo_param.index_thread_qty` (Dynamic, Integer): The number of threads used for [sparse ANN]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann) index build. Increasing this value allocates more CPUs to the index build job and boosts the indexing performance. Default is `1`.

### Index settings

The following Neural Search plugin settings apply at the index level:

- `index.neural_search.semantic_ingest_batch_size` (Dynamic, integer): Specifies the number of documents batched together when generating embeddings for `semantic` fields during ingestion. Default is `10`. 

<p id="hybrid-collapse-docs-per-group"></p>

- `index.neural_search.hybrid_collapse_docs_per_group_per_subquery` (Dynamic, integer): Controls how many documents are stored per group per subquery. By default, the value is set to the `size` parameter specified in the query. Lower values prioritize latency, while higher values increase recall. Valid values are `0`--`1000`, inclusive. A value of `0` uses the `size` parameter from the query, not zero documents.
