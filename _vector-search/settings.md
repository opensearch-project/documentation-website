---
layout: default
title: Settings
nav_order: 90
redirect_from:
  - /search-plugins/knn/settings/
---

# Vector search settings

OpenSearch supports the following vector search settings. Dynamic settings are updated using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api); static settings must be configured in `opensearch.yml` on each node. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## k-NN plugin settings

The k-NN plugin supports the following settings.

### Cluster settings

The following k-NN plugin settings apply at the cluster level:

- `knn.algo_param.index_thread_qty` (Dynamic, integer): The number of threads used for native library and Lucene library (for OpenSearch version 2.19 and later) index creation. Keeping this value low reduces the CPU impact of the k-NN plugin but also reduces indexing performance. Default is `1` for systems with fewer than 32 CPU cores and `4` for systems with 32 or more cores.

- `knn.cache.item.expiry.enabled` (Dynamic, Boolean): Whether to remove native library indexes that have not been accessed for a specified period of time from memory. Default is `false`.

- `knn.cache.item.expiry.minutes` (Dynamic, time unit): The amount of idle time before a native library index is removed from memory. Takes effect only when `knn.cache.item.expiry.enabled` is `true`. Default is `3h`.

- `knn.circuit_breaker.unset.percentage` (Dynamic, percentage): The native memory usage threshold for the circuit breaker. Memory usage must be lower than this percentage of `knn.memory.circuit_breaker.limit` for `knn.circuit_breaker.triggered` to remain `false`. Default is `75`.

- `knn.circuit_breaker.triggered` (Dynamic, Boolean): Set to `true` when memory usage exceeds the `knn.circuit_breaker.unset.percentage` value. Default is `false`.

- `knn.memory.circuit_breaker.limit` (Dynamic, percentage or byte unit): The native memory limit for native library indexes. At the default value, if a machine has 100 GB of memory and the JVM uses 32 GB, then the k-NN plugin uses 50% of the remaining 68 GB (34 GB). If memory usage exceeds this value, then the plugin removes the native library indexes used least recently. To configure this limit at the node level, add `node.attr.knn_cb_tier: "<tier-name>"` in `opensearch.yml` and set `knn.memory.circuit_breaker.limit.<tier-name>` in the cluster settings. For example, define a node tier as `node.attr.knn_cb_tier: "integ"` and set `knn.memory.circuit_breaker.limit.integ: "80%"`. Nodes use their tier's circuit breaker limit if one is configured and the cluster-wide setting if no node-specific value is set. Default is `50%`.

- `knn.memory.circuit_breaker.enabled` (Dynamic, Boolean): Whether to enable the k-NN memory circuit breaker. Default is `true`.

- `knn.model.index.number_of_shards` (Dynamic, integer): The number of shards to use for the model system index, which is the OpenSearch index that stores the models used for approximate nearest neighbor (ANN) search. Default is `1`.

- `knn.model.index.number_of_replicas` (Dynamic, integer): The number of replica shards to use for the model system index. In a multi-node cluster, set this value to at least `1` to increase stability. Default is `1`.

- `knn.model.cache.size.limit` (Dynamic, percentage): The model cache limit, which cannot exceed 25% of the JVM heap. Default is `10%`.

- `knn.faiss.avx2.disabled` (Static, Boolean): Whether to disable the SIMD-based `libopensearchknn_faiss_avx2.so` library and load the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. Default is `false`. For more information, see [Single Instruction Multiple Data (SIMD) optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization).

- `knn.faiss.avx512.disabled` (Static, Boolean): Whether to disable the SIMD-based `libopensearchknn_faiss_avx512.so` library and load either the `libopensearchknn_faiss_avx2.so` or the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. Default is `false`. For more information, see [SIMD optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization).

- `knn.faiss.avx512_spr.disabled` (Static, Boolean): Whether to disable the SIMD-based `libopensearchknn_faiss_avx512_spr.so` library and load either the `libopensearchknn_faiss_avx512.so`, `libopensearchknn_faiss_avx2.so`, or the non-optimized `libopensearchknn_faiss.so` library for the Faiss engine on machines with x64 architecture. Default is `false`. For more information, see [SIMD optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization).

- `knn.dynamic_mapping.enabled` (Dynamic, Boolean): Whether to enable [dynamic mapping]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/#dynamic-mapping) of `knn_vector` fields, including inference of unmapped flat numeric arrays and dynamic templates that reference `knn_vector` as `match_mapping_type`. Default is `false`.

### Index settings

Several parameters defined in the index settings are currently in the deprecation process. Set those parameters in the mapping instead of in the index settings. Parameters set in the mapping override the parameters set in the index settings and allow an index to have multiple `knn_vector` fields with different parameters.

The following k-NN plugin settings apply at the index level. For information about updating these settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/):

- `index.knn` (Static, Boolean): Whether the index builds native library indexes for its `knn_vector` fields. If `false`, the `knn_vector` fields are stored in doc values, but approximate k-NN search is disabled. Default is `false`.

- `index.knn.algo_param.ef_search` (Dynamic, integer): The size of the dynamic list of nearest neighbors used during a search (`ef`, or `efSearch`). Higher values produce a more accurate but slower search. This value cannot be lower than the number of queried nearest neighbors, `k`, and can be any value between `k` and the size of the dataset. Default is `100`.

- `index.knn.advanced.approximate_threshold` (Dynamic, integer): The number of vectors that a segment must contain before OpenSearch creates specialized data structures for ANN search. Set to `-1` to disable building vector data structures and to `0` to always build them. Default is `0`.

- `index.knn.advanced.filtered_exact_search_threshold` (Dynamic, integer): The filtered ID threshold at which OpenSearch switches to exact search during filtered ANN search. If the number of filtered IDs in a segment is lower than this value, then exact search is performed on the filtered IDs. Default is `-1`, which applies no threshold.

- `index.knn.faiss.efficient_filter.disable_exact_search` (Dynamic, Boolean): When `true`, disables the exact search fallback that occurs when a Faiss efficient-filtered approximate nearest neighbor (ANN) search returns fewer than `k` results. Default is `false`. For more information, see [Disabling the exact search fallback]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/efficient-knn-filtering/#disabling-the-exact-search-fallback).

- `index.knn.derived_source.enabled` (Static, Boolean): Prevents vectors from being stored in `_source`, reducing disk usage for vector indexes. Default is `true` for an index created with `index.knn` set to `true` and `false` for all other indexes.

- `index.knn.memory_optimized_search` (Static, Boolean): Enables [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/) on an index. Default is `false`.

An index created in OpenSearch version 2.11 or earlier still uses the previous `ef_construction` and `ef_search` values (`512`).
{: .note}

When you create an index with `index.knn` set to `true`, the k-NN plugin also lowers two [tiered merge policy settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#tiered-merge-policy-settings) so that merges compete less with search for CPU: it sets `index.merge.policy.max_merge_at_once` to `10` rather than the default of `30` and `index.merge.policy.floor_segment` to `2mb` rather than the default of `16mb`. Both settings are dynamic, so you can change them after creating the index.

### Remote index build settings

The following settings control [remote vector index building]({{site.url}}{{site.baseurl}}/vector-search/remote-index-build/).

#### Cluster settings

The following remote index build settings apply at the cluster level:

- `knn.remote_index_build.enabled` (Dynamic, Boolean): Enables remote vector index building for the cluster. Default is `false`.

- `knn.remote_index_build.repository` (Dynamic, string): The name of the registered repository to which the remote index builder writes. No default value; you must set this setting before using the remote index build service.

- `knn.remote_index_build.service.endpoint` (Dynamic, string): The endpoint URL of the remote build service. No default value; you must set this setting before using the remote index build service.

- `knn.remote_index_build.poll.interval` (Dynamic, time unit): How frequently the client polls the remote build service for job status. Default is `5s`.

- `knn.remote_index_build.client.timeout` (Dynamic, time unit): The maximum amount of time to wait for the remote build to complete. If the build does not complete within this time, OpenSearch builds the index locally on the CPU. Default is `60m`.

- `knn.remote_index_build.size.max` (Dynamic, byte unit): The maximum segment size that the remote index build service accepts. Set this setting according to the constraints of your remote build service implementation. Default is `0`, which places no upper bound on segment size.

#### Index settings

The following remote index build settings apply at the index level. For information about updating these settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/):

- `index.knn.remote_index_build.enabled` (Dynamic, Boolean): Enables remote index building for the index. Takes effect only when `knn.remote_index_build.enabled` is `true`. Default is `true`.

- `index.knn.remote_index_build.size.min` (Dynamic, byte unit): The minimum segment size for which OpenSearch uses the remote index build service. Smaller segments are built locally. Default is `50mb`.

#### Remote build authentication

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

The following Neural Search plugin settings apply at the cluster level. Dynamic settings are updated using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#updating-cluster-settings-using-the-api); static settings must be configured in `opensearch.yml` on each node:

- `plugins.neural_search.stats_enabled` (Dynamic, Boolean): Enables the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats). Default is `false`.
- `plugins.neural_search.circuit_breaker.limit` (Dynamic, percentage): Specifies the JVM memory limit for the [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/) circuit breaker. This limit bounds the JVM heap caches used by the Lucene engine only and has no effect on the native engine, which relies on the operating system page cache. Default is `10%` of the JVM heap. For more information, see [Memory and caching settings]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#memory-and-caching-settings).
- `plugins.neural_search.circuit_breaker.overhead` (Dynamic, Float): A multiplier used to adjust memory usage estimates for [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/). Higher values provide more conservative memory estimates. Like `plugins.neural_search.circuit_breaker.limit`, this setting applies to the Lucene engine only. Default is `1.0`. 
- `plugins.neural_search.sparse.algo_param.index_thread_qty` (Dynamic, Integer): The number of threads used for building indexes for [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/). Increasing this value allocates more CPUs to the index build job and boosts indexing performance. Valid values are in the range from `1` to `1024`. This setting applies to both the Lucene engine and the native engine. Default is `1`. For more information, see [Thread pool configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#thread-pool-configuration).
- `plugins.neural_search.sparse.native_engine_feature_enabled` (Static, Boolean): Whether the [native engine]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#native-engine) for neural sparse ANN search is available. Because this setting is static, configure it in `opensearch.yml` on each node; changing it requires a node restart. Default is `true`.
- `plugins.neural_search.sparse.native_engine_enabled` (Dynamic, Boolean): Whether the [native engine]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#native-engine) for neural sparse ANN search is enabled at runtime. Both this setting and `plugins.neural_search.sparse.native_engine_feature_enabled` must be `true` before a field can use the native engine. Default is `false`. For more information, see [Enabling the native engine]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#enabling-the-native-engine).

No setting bounds the amount of memory that a native engine index uses. The native engine reads its index from a memory-mapped file, so to size a node for the native engine, leave enough RAM for the operating system page cache, the same as for any other memory-mapped Lucene data.
{: .note}

### Index settings

The following Neural Search plugin settings apply at the index level:

- `index.neural_search.semantic_ingest_batch_size` (Dynamic, integer): Specifies the number of documents batched together when generating embeddings for `semantic` fields during ingestion. Default is `10`. 

<p id="hybrid-collapse-docs-per-group"></p>

- `index.neural_search.hybrid_collapse_docs_per_group_per_subquery` (_Deprecated_):  This setting is deprecated and no longer has any impact. The number of documents returned is controlled entirely by the `size` parameter.