---
layout: default
title: k-NN index
nav_order: 5
parent: k-NN
has_children: false
---

# k-NN index

The k-NN plugin introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors into an OpenSearch index and perform different kinds of k-NN search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/).

## Lucene byte vector

Starting with k-NN plugin version 2.9, you can use `byte` vectors with the `lucene` engine in order to reduce the amount of storage space needed. For more information, see [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector).

## Method definitions

A method definition refers to the underlying configuration of the Approximate k-NN algorithm you want to use. Method definitions are used to either create a `knn_vector` field (when the method does not require training) or [create a model during training]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-model) that can then be used to [create a `knn_vector` field]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model).

A method definition will always contain the name of the method, the space_type the method is built for, the engine
(the library) to use, and a map of parameters.

Mapping parameter | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`name` | true | n/a | false | The identifier for the nearest neighbor method.
`space_type` | false | l2 | false | The vector space used to calculate the distance between vectors.
`engine` | false | nmslib | false | The approximate k-NN library to use for indexing and search. The available libraries are faiss, nmslib, and Lucene.
`parameters` | false | null | false | The parameters used for the nearest neighbor method.

### Supported nmslib methods

Method name | Requires training | Supported spaces | Description
:--- | :--- | :--- | :---
`hnsw` | false | l2, innerproduct, cosinesimil, l1, linf | Hierarchical proximity graph approach to Approximate k-NN search. For more details on the algorithm, see this [abstract](https://arxiv.org/abs/1603.09320).

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | false | 512 | false | The size of the dynamic list used during k-NN graph creation. Higher values lead to a more accurate graph but slower indexing speed.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.

For nmslib, *ef_search* is set in the [index settings](#index-settings).
{: .note}

### Supported faiss methods

Method name | Requires training | Supported spaces | Description
:--- | :--- | :--- | :---
`hnsw` | false | l2, innerproduct | Hierarchical proximity graph approach to Approximate k-NN search.
`ivf` | true | l2, innerproduct | Bucketing approach where vectors are assigned different buckets based on clustering and, during search, only a subset of the buckets is searched.

For hnsw, "innerproduct" is not available when PQ is used.
{: .note}

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_search` | false | 512 | false | The size of the dynamic list used during k-NN searches. Higher values lead to more accurate but slower searches.
`ef_construction` | false | 512 | false | The size of the dynamic list used during k-NN graph creation. Higher values lead to a more accurate graph but slower indexing speed.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.
`encoder` | false | flat | false | Encoder definition for encoding vectors. Encoders can reduce the memory footprint of your index, at the expense of search accuracy.

#### IVF parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`nlist` | false | 4 | false | Number of buckets to partition vectors into. Higher values may lead to more accurate searches at the expense of memory and training latency. For more information about choosing the right value, refer to [Guidelines to choose an index](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index).
`nprobes` | false | 1 | false | Number of buckets to search during query. Higher values lead to more accurate but slower searches.
`encoder` | false | flat | false | Encoder definition for encoding vectors. Encoders can reduce the memory footprint of your index, at the expense of search accuracy.

For more information about setting these parameters, refer to the [Faiss documentation](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes).

#### IVF training requirements

The IVF algorithm requires a training step. To create an index that uses IVF, you need to train a model with the
[Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-model), passing the IVF method definition. IVF requires that, at a minimum, there should be `nlist` training
data points, but it is [recommended that you use more](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#how-big-is-the-dataset).
Training data can be composed of either the same data that is going to be ingested or a separate dataset.

### Supported Lucene methods

Method name | Requires training | Supported spaces | Description
:--- | :--- | :--- | :---
`hnsw` | false | l2, cosinesimil | Hierarchical proximity graph approach to Approximate k-NN search.

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | false | 512 | false | The size of the dynamic list used during k-NN graph creation. Higher values lead to a more accurate graph but slower indexing speed.<br>The Lucene engine uses the proprietary term "beam_width" to describe this function, which corresponds directly to "ef_construction". To be consistent throughout OpenSearch documentation, we retain the term "ef_construction" to label this parameter.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.<br>The Lucene engine uses the proprietary term "max_connections" to describe this function, which corresponds directly to "m". To be consistent throughout OpenSearch documentation, we retain the term "m" to label this parameter.

Lucene HNSW implementation ignores `ef_search`  and dynamically sets it to the value of "k" in the search request. Therefore, there is no need to make settings for `ef_search` when using the Lucene engine.
{: .note}

```json
{
    "type": "knn_vector",
    "dimension": 100,
    "method": {
        "name":"hnsw",
        "engine":"lucene",
        "space_type": "l2",
        "parameters":{
            "m":2048,
            "ef_construction": 245
        }
    }
}
```

### Supported faiss encoders

You can use encoders to reduce the memory footprint of a k-NN index at the expense of search accuracy. faiss has
several encoder types, but the plugin currently only supports *flat* and *pq* encoding.

The following example method definition specifies the `hnsw` method and a `pq` encoder:

```json
"method": {
  "name":"hnsw",
  "engine":"faiss",
  "space_type": "l2",
  "parameters":{
    "encoder":{
      "name":"pq",
      "parameters":{
        "code_size": 8,
        "m": 8
      }
    }
  }
}
```

The `hnsw` method supports the `pq` encoder for OpenSearch versions 2.10 and later. The `code_size` parameter of a `pq` encoder with the `hnsw` method must be **8**.
{: .important}

Encoder name | Requires training | Description
:--- | :--- | :---
`flat` | false | Encode vectors as floating point arrays. This encoding does not reduce memory footprint.
`pq` | true | An abbreviation for _product quantization_, it is a lossy compression technique that uses clustering to encode a vector into a fixed size of bytes, with the goal of minimizing the drop in k-NN search accuracy. At a high level, vectors are broken up into `m` subvectors, and then each subvector is represented by a `code_size` code obtained from a code book produced during training. For more information about product quantization, see [this blog post](https://medium.com/dotstar/understanding-faiss-part-2-79d90b1e5388).

#### Examples


The following example uses the `ivf` method  without specifying an encoder (by default, OpenSearch uses the `flat` encoder):

```json
"method": {
  "name":"ivf",
  "engine":"faiss",
  "space_type": "l2",
  "parameters":{
    "nlist": 4,
    "nprobes": 2
  }
}
```

The following example uses the `ivf` method with a `pq` encoder:

```json
"method": {
  "name":"ivf",
  "engine":"faiss",
  "space_type": "l2",
  "parameters":{
    "encoder":{
      "name":"pq",
      "parameters":{
        "code_size": 8,
        "m": 8
      }
    }
  }
}
```

The following example uses the `hnsw` method without specifying an encoder (by default, OpenSearch uses the `flat` encoder):

```json
"method": {
  "name":"hnsw",
  "engine":"faiss",
  "space_type": "l2",
  "parameters":{
    "ef_construction": 256,
    "m": 8
  }
}
```

#### PQ parameters

Paramater Name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`m` | false | 1 | false |  Determine how many many sub-vectors to break the vector into. sub-vectors are encoded independently of each other. This dimension of the vector must be divisible by `m`. Max value is 1024.
`code_size` | false | 8 | false | Determines the number of bits to encode a sub-vector into. Max value is 8. **Note** --- for IVF, this value must be less than or equal to 8. For HNSW, this value can only be 8.

### Choosing the right method

There are a lot of options to choose from when building your `knn_vector` field. To determine the correct methods and parameters to choose, you should first understand what requirements you have for your workload and what trade-offs you are willing to make. Factors to consider are (1) query latency, (2) query quality, (3) memory limits, (4) indexing latency.

If memory is not a concern, HNSW offers a very strong query latency/query quality tradeoff.

If you want to use less memory and index faster than HNSW, while maintaining similar query quality, you should evaluate IVF.

If memory is a concern, consider adding a PQ encoder to your HNSW or IVF index. Because PQ is a lossy encoding, query quality will drop.

### Memory estimation

In a typical OpenSearch cluster, a certain portion of RAM is set aside for the JVM heap. The k-NN plugin allocates
native library indexes to a portion of the remaining RAM. This portion's size is determined by
the `circuit_breaker_limit` cluster setting. By default, the limit is set at 50%.

Having a replica doubles the total number of vectors.
{: .note }

#### HNSW memory estimation

The memory required for HNSW is estimated to be `1.1 * (4 * dimension + 8 * M)` bytes/vector.

As an example, assume you have a million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```
1.1 * (4 * 256 + 8 * 16) * 1,000,000 ~= 1.267 GB
```

#### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((4 * dimension) * num_vectors) + (4 * nlist * d))` bytes.

As an example, assume you have a million vectors with a dimension of 256 and nlist of 128. The memory requirement can be estimated as follows:

```
1.1 * (((4 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 1.126 GB

```

## Index settings

Additionally, the k-NN plugin introduces several index settings that can be used to configure the k-NN structure as well.

At the moment, several parameters defined in the settings are in the deprecation process. Those parameters should be set in the mapping instead of the index settings. Parameters set in the mapping will override the parameters set in the index settings. Setting the parameters in the mapping allows an index to have multiple `knn_vector` fields with different parameters.

Setting | Default | Updatable | Description
:--- | :--- | :--- | :---
`index.knn` | false | false | Whether the index should build native library indexes for the `knn_vector` fields. If set to false, the `knn_vector` fields will be stored in doc values, but Approximate k-NN search functionality will be disabled.
`index.knn.algo_param.ef_search` | 512 | true | The size of the dynamic list used during k-NN searches. Higher values lead to more accurate but slower searches. Only available for nmslib.
`index.knn.algo_param.ef_construction` | 512 | false | Deprecated in 1.0.0. Use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value instead.
`index.knn.algo_param.m` | 16 | false | Deprecated in 1.0.0. Use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value instead.
`index.knn.space_type` | l2 | false | Deprecated in 1.0.0. Use the [mapping parameters](https://opensearch.org/docs/latest/search-plugins/knn/knn-index/#method-definitions) to set this value instead.
