---
layout: default
title: k-NN Index
nav_order: 1
parent: k-NN
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/knn-index/
---

# k-NN Index

## knn_vector data type

The k-NN plugin introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors
into an OpenSearch index.

```json
"my_vector": {
  "type": "knn_vector",
  "dimension": 4,
  "method": {
    "name": "hnsw",
    "space_type": "l2",
    "engine": "nmslib",
    "parameters": {
      "ef_construction": 128,
      "m": 24
    }
  }
}
```

Mapping Pararameter | Required | Default | Updateable | Description
:--- | :--- | :--- | :--- | :---
`type` | true | n/a | false | The type of the field
`dimension` | true | n/a | false | The vector dimension for the field
`method` | false | null | false | The configuration for the Approximate nearest neighbor method
`method.name` | true, if `method` is specified | n/a | false | The identifier for the nearest neighbor method. Currently, "hnsw" is the only valid method.
`method.space_type` | false | "l2" | false | The vector space used to calculate the distance between vectors. Refer to [here]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn#spaces)) to see available spaces.
`method.engine` | false | "nmslib" | false | The approximate k-NN library to use for indexing and search. Currently, "nmslib" is the only valid engine.
`method.parameters` | false | null | false | The parameters used for the nearest neighbor method.
`method.parameters.ef_construction` | false | 512 | false | The size of the dynamic list used during k-NN graph creation. Higher values lead to a more accurate graph, but slower indexing speed. Only valid for "hnsw" method.
`method.parameters.m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2-100. Only valid for "hnsw" method

## Index settings

Additionally, the k-NN plugin introduces several index settings that can be used to configure the k-NN structure as well.

At the moment, several parameters defined in the settings are in the deprecation process. Those parameters should be set
in the mapping instead of the index settings. Parameters set in the mapping will override the parameters set in the
index settings. Setting the parameters in the mapping allows an index to have multiple `knn_vector` fields with
different parameters.

Setting | Default | Updateable | Description
:--- | :--- | :--- | :---
`index.knn` | false | false | Whether the index should build hnsw graphs for the `knn_vector` fields. If set to false, the `knn_vector` fields will be stored in doc values, but Approximate k-NN search functionality will be disabled.
`index.knn.algo_param.ef_search` | 512 | true | The size of the dynamic list used during k-NN searches. Higher values lead to more accurate but slower searches.
`index.knn.algo_param.ef_construction` | 512 | false | (Deprecated in 1.0.0. Use the mapping parameters to set this value instead.) Refer to mapping definition.
`index.knn.algo_param.m` | 16 | false | (Deprecated in 1.0.0. Use the mapping parameters to set this value instead.) Refer to mapping definition.
`index.knn.space_type` | "l2" | false | (Deprecated in 1.0.0. Use the mapping parameters to set this value instead.) Refer to mapping definition.
