---
layout: default
title: Vector index settings
parent: Creating a vector index
nav_order: 30
---

# Vector index settings

The k-NN plugin introduces several index settings that can be used to configure the k-NN structure as well.

At the moment, several parameters defined in the settings are in the deprecation process. Those parameters should be set in the mapping instead of the index settings. Parameters set in the mapping will override the parameters set in the index settings. Setting the parameters in the mapping allows an index to have multiple `knn_vector` fields with different parameters.

Setting | Default | Updatable | Description
:--- | :--- | :--- | :---
`index.knn` | false | false | Whether the index should build native library indexes for the `knn_vector` fields. If set to false, the `knn_vector` fields will be stored in doc values, but approximate k-NN search functionality will be disabled.
`index.knn.algo_param.ef_search` | 100 | true | The size of the dynamic list used during k-NN searches. Higher values result in more accurate but slower searches. Only available for NMSLIB.
`index.knn.advanced.approximate_threshold` | 15,000   | true      | The number of vectors a segment must have before creating specialized data structures for approximate search. Set to `-1` to disable building vector data structures and `0` to always build them.
`index.knn.algo_param.ef_construction` | 100 | false | Deprecated in 1.0.0. Instead, use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value.
`index.knn.algo_param.m` | 16 | false | Deprecated in 1.0.0. Use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value instead.
`index.knn.space_type` | l2 | false | Deprecated in 1.0.0. Use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value instead.

An index created in OpenSearch version 2.11 or earlier will still use the old `ef_construction` and `ef_search` values (`512`).
{: .note}
