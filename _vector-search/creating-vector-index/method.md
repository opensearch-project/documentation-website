---
layout: default
title: Supported methods
parent: Creating a vector index
nav_order: 20
---

# Supported methods

A _method_ definition refers to the underlying configuration of the approximate k-NN algorithm you want to use. Method definitions are used to either create a `knn_vector` field (when the method does not require training) or [create a model during training]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-a-model) that can then be used to [create a `knn_vector` field]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model).

A method definition will always contain the name of the method, the space_type the method is built for, the engine
(the library) to use, and a map of parameters.

Mapping parameter | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`name` | true | n/a | false | The identifier for the nearest neighbor method.
`space_type` | false | l2 | false | The vector space used to calculate the distance between vectors. Note: This value can also be specified at the top level of the mapping.
`engine` | false | faiss  | false | The approximate k-NN library to use for indexing and search. The available libraries are `faiss`, `nmslib`, and `lucene`.
`parameters` | false | null | false | The parameters used for the nearest neighbor method.

### Supported nmslib methods

Method name | Requires training | Supported spaces | Description
:--- | :--- | :--- | :---
`hnsw` | false | l2, innerproduct, cosinesimil, l1, linf | Hierarchical proximity graph approach to approximate k-NN search. For more details on the algorithm, see this [abstract](https://arxiv.org/abs/1603.09320).

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | false | 100 | false | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.

For nmslib, *ef_search* is set in the [index settings](#index-settings).
{: .note}

An index created in OpenSearch version 2.11 or earlier will still use the old `ef_construction` value (`512`).
{: .note}

### Supported Faiss methods

Method name | Requires training | Supported spaces | Description
:--- | :--- |:---| :---
`hnsw` | false | l2, innerproduct, hamming | Hierarchical proximity graph approach to approximate k-NN search.
`ivf` | true | l2, innerproduct, hamming  | Stands for _inverted file index_. Bucketing approach where vectors are assigned different buckets based on clustering and, during search, only a subset of the buckets is searched.

For hnsw, "innerproduct" is not available when PQ is used.
{: .note}

The `hamming` space type is supported for binary vectors in OpenSearch version 2.16 and later. For more information, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).
{: .note}

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_search` | false | 100 | false | The size of the dynamic list used during k-NN searches. Higher values result in more accurate but slower searches.
`ef_construction` | false | 100 | false | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.
`encoder` | false | flat | false | Encoder definition for encoding vectors. Encoders can reduce the memory footprint of your index, at the expense of search accuracy.

An index created in OpenSearch version 2.11 or earlier will still use the old `ef_construction` and `ef_search` values (`512`).
{: .note}

#### IVF parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`nlist` | false | 4 | false | Number of buckets to partition vectors into. Higher values may lead to more accurate searches at the expense of memory and training latency. For more information about choosing the right value, refer to [Guidelines to choose an index](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index).
`nprobes` | false | 1 | false | Number of buckets to search during query. Higher values lead to more accurate but slower searches.
`encoder` | false | flat | false | Encoder definition for encoding vectors. Encoders can reduce the memory footprint of your index, at the expense of search accuracy.

For more information about setting these parameters, refer to the [Faiss documentation](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes).

#### IVF training requirements

The IVF algorithm requires a training step. To create an index that uses IVF, you need to train a model with the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-a-model), passing the IVF method definition. IVF requires that, at a minimum, there are `nlist` training data points, but it is [recommended that you use more than this](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#how-big-is-the-dataset). Training data can be composed of either the same data that is going to be ingested or a separate dataset.

### Supported Lucene methods

Method name | Requires training | Supported spaces | Description
:--- | :--- |:--------------------------------------------------------------------------------| :---
`hnsw` | false | l2, cosinesimil, innerproduct (supported in OpenSearch 2.13 and later) | Hierarchical proximity graph approach to approximate k-NN search.

#### HNSW parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | false | 100 | false | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed.<br>The Lucene engine uses the proprietary term "beam_width" to describe this function, which corresponds directly to "ef_construction". To be consistent throughout the OpenSearch documentation, we retain the term "ef_construction" for this parameter.
`m` | false | 16 | false | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between 2 and 100.<br>The Lucene engine uses the proprietary term "max_connections" to describe this function, which corresponds directly to "m". To be consistent throughout OpenSearch documentation, we retain the term "m" to label this parameter.

Lucene HNSW implementation ignores `ef_search`  and dynamically sets it to the value of "k" in the search request. Therefore, there is no need to make settings for `ef_search` when using the Lucene engine.
{: .note}

An index created in OpenSearch version 2.11 or earlier will still use the old `ef_construction` value (`512`).
{: .note}

```json
"method": {
    "name":"hnsw",
    "engine":"lucene",
    "parameters":{
        "m":2048,
        "ef_construction": 245
    }
}
```

### Supported Faiss encoders

You can use encoders to reduce the memory footprint of a k-NN index at the expense of search accuracy. The k-NN plugin currently supports the `flat`, `pq`, and `sq` encoders in the Faiss library.

The following example method definition specifies the `hnsw` method and a `pq` encoder:

```json
"method": {
  "name":"hnsw",
  "engine":"faiss",
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
`flat` (Default) | false | Encode vectors as floating-point arrays. This encoding does not reduce memory footprint.
`pq` | true | An abbreviation for _product quantization_, it is a lossy compression technique that uses clustering to encode a vector into a fixed size of bytes, with the goal of minimizing the drop in k-NN search accuracy. At a high level, vectors are broken up into `m` subvectors, and then each subvector is represented by a `code_size` code obtained from a code book produced during training. For more information about product quantization, see [this blog post](https://medium.com/dotstar/understanding-faiss-part-2-79d90b1e5388).
`sq` | false | An abbreviation for _scalar quantization_. Starting with k-NN plugin version 2.13, you can use the `sq` encoder to quantize 32-bit floating-point vectors into 16-bit floats. In version 2.13, the built-in `sq` encoder is the SQFP16 Faiss encoder. The encoder reduces memory footprint with a minimal loss of precision and improves performance by using SIMD optimization (using AVX2 on x86 architecture or Neon on ARM64 architecture). For more information, see [Faiss scalar quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization#faiss-16-bit-scalar-quantization).

#### PQ parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`m` | false | 1 | false |  Determines the number of subvectors into which to break the vector. Subvectors are encoded independently of each other. This vector dimension must be divisible by `m`. Maximum value is 1,024.
`code_size` | false | 8 | false | Determines the number of bits into which to encode a subvector. Maximum value is 8. For IVF, this value must be less than or equal to 8. For HNSW, this value can only be 8.

#### SQ parameters

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :-- | :--- | :---
`type` | false | `fp16` | false |  The type of scalar quantization to be used to encode 32-bit float vectors into the corresponding type. As of OpenSearch 2.13, only the `fp16` encoder type is supported. For the `fp16` encoder, vector values must be in the [-65504.0, 65504.0] range. 
`clip` | false | `false` | false | If `true`, then any vector values outside of the supported range for the specified vector type are rounded so that they are in the range. If `false`, then the request is rejected if any vector values are outside of the supported range. Setting `clip` to `true` may decrease recall.

For more information and examples, see [Using Faiss scalar quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/#using-faiss-scalar-quantization).

#### Examples

The following example uses the `ivf` method  without specifying an encoder (by default, OpenSearch uses the `flat` encoder):

```json
"method": {
  "name":"ivf",
  "engine":"faiss",
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
  "parameters":{
    "ef_construction": 256,
    "m": 8
  }
}
```

The following example uses the `hnsw` method with an `sq` encoder of type `fp16` with `clip` enabled:

```json
"method": {
  "name":"hnsw",
  "engine":"faiss",
  "parameters":{
    "encoder": {
      "name": "sq",
      "parameters": {
        "type": "fp16",
        "clip": true
      }  
    },    
    "ef_construction": 256,
    "m": 8
  }
}
```

The following example uses the `ivf` method with an `sq` encoder of type `fp16`:

```json
"method": {
  "name":"ivf",
  "engine":"faiss",
  "parameters":{
    "encoder": {
      "name": "sq",
      "parameters": {
        "type": "fp16",
        "clip": false
      }
    },
    "nprobes": 2
  }
}
```

### Choosing the right method

There are several options to choose from when building your `knn_vector` field. To determine the correct methods and parameters, you should first understand the requirements of your workload and what trade-offs you are willing to make. Factors to consider are (1) query latency, (2) query quality, (3) memory limits, and (4) indexing latency.

If memory is not a concern, HNSW offers a strong query latency/query quality trade-off.

If you want to use less memory and increase indexing speed as compared to HNSW while maintaining similar query quality, you should evaluate IVF.

If memory is a concern, consider adding a PQ encoder to your HNSW or IVF index. Because PQ is a lossy encoding, query quality will drop.

You can reduce the memory footprint by a factor of 2, with a minimal loss in search quality, by using the [`fp_16` encoder]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/#faiss-16-bit-scalar-quantization). If your vector dimensions are within the [-128, 127] byte range, we recommend using the [byte quantizer]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#byte-vectors) to reduce the memory footprint by a factor of 4. To learn more about vector quantization options, see [k-NN vector quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/). 

### Memory estimation

In a typical OpenSearch cluster, a certain portion of RAM is reserved for the JVM heap. The k-NN plugin allocates native library indexes to a portion of the remaining RAM. This portion's size is determined by the `circuit_breaker_limit` cluster setting. By default, the limit is set to 50%.

Having a replica doubles the total number of vectors.
{: .note }

For information about using memory estimation with vector quantization, see the [vector quantization documentation]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/#memory-estimation).
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
