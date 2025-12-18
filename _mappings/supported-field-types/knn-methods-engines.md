---
layout: default
title: Methods and engines
parent: k-NN vector
grand_parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/knn-methods-engines/
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/mappings/supported-field-types/knn-methods-engines/
---

# Methods and engines

A _method_ defines the algorithm used for organizing vector data at indexing time and searching it at search time in [approximate k-NN search]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/). 

OpenSearch supports the following methods:

- **Hierarchical Navigable Small World (HNSW)** creates a hierarchical graph structure of connections between vectors. For more information about the algorithm, see [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320).
- **Inverted File Index (IVF)** organizes vectors into buckets based on clustering and, during search, searches only a subset of the buckets.

An _engine_ is the library that implements these methods. Different engines can implement the same method, sometimes with varying optimizations or characteristics. For example, HNSW is implemented by all supported engines, each with its own advantages.

OpenSearch supports the following engines:
- [**Lucene**](#lucene-engine): The native search library, offering an HNSW implementation with efficient filtering capabilities
- [**Faiss**](#faiss-engine) (Facebook AI Similarity Search): A comprehensive library implementing both the HNSW and IVF methods, with additional vector compression options
- [**NMSLIB**](#nmslib-engine-deprecated) (Non-Metric Space Library): A legacy implementation of HNSW (now deprecated)

## Method definition example

A method definition contains the following components:

- The `name` of the method (for example, `hnsw` or `ivf`)
- The `space_type` for which the method is built (for example, `l2` or `cosinesimil`)
- The `engine` that will implement the method (for example, `faiss` or `lucene`)
- A map of `parameters` specific to that implementation

The following example configures an `hnsw` method with the `l2` space type, the `faiss` engine, and the method-specific parameters:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "faiss",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Not every method/engine combination supports each of the spaces. For a list of supported spaces, see the section for a specific engine.
{: .note}

## Common parameters

The following parameters are common to all method definitions.

Mapping parameter | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`name` | Yes | N/A | No | The nearest neighbor method. Valid values are `hnsw` and `ivf`. Not every engine combination supports each of the methods. For a list of supported methods, see the section for a specific engine.
`space_type` | No | `l2` | No | The vector space used to calculate the distance between vectors. Valid values are `l1`, `l2`, `linf`, `cosinesimil`, `innerproduct`, `hamming`, and `hammingbit`. Not every method/engine combination supports each of the spaces. For a list of supported spaces, see the section for a specific engine. Note: This value can also be specified at the top level of the mapping. For more information, see [Spaces]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-spaces/).
`engine` | No | `faiss`  | No | The approximate k-NN library to use for indexing and search. Valid values are `faiss`, `lucene`, and `nmslib` (deprecated).
`parameters` | No | `null` | No | The parameters used for the nearest neighbor method. For more information, see the section for a specific engine.

## Lucene engine

The Lucene engine provides a native implementation of vector search directly within Lucene. It offers efficient filtering capabilities and is well suited for smaller deployments.

### Supported methods

The Lucene engine supports the following method.

Method name | Requires training | Supported spaces 
:--- | :--- |:---
[`hnsw`](#hnsw-parameters) | No | `l2`, `cosinesimil`, `innerproduct` (supported in OpenSearch 2.13 and later) 

#### HNSW parameters

The HNSW method supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | No | 100 | No | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed.<br>Note: Lucene uses the term `beam_width` internally, but the OpenSearch documentation uses `ef_construction` for consistency.
`m` | No | 16 | No | The number of bidirectional links created for each new element. Impacts memory consumption significantly. Keep between `2` and `100`.<br>Note: Lucene uses the term `max_connections` internally, but the OpenSearch documentation uses `m` for consistency.

The Lucene HNSW implementation ignores `ef_search` and dynamically sets it to the value of "k" in the search request. There is therefore no need to configure settings for `ef_search` when using the Lucene engine.
{: .note}

An index created in OpenSearch version 2.11 or earlier will still use the previous `ef_construction` value (`512`).
{: .note}

### Example configuration

```json
"method": {
    "name": "hnsw",
    "engine": "lucene",
    "parameters": {
        "m": 2048,
        "ef_construction": 245
    }
}
```

## Faiss engine

The Faiss engine provides advanced vector indexing capabilities with support for multiple methods and encoding options to optimize memory usage and search performance.

### Supported methods

The Faiss engine supports the following methods.

Method name | Requires training | Supported spaces 
:--- | :--- |:---
[`hnsw`](#hnsw-parameters-1) | No | `l2`, `innerproduct` (not available when [PQ](#pq-parameters) is used), `hamming`, and `cosinesimil` (supported in OpenSearch 2.19 and later).
[`ivf`](#ivf-parameters) | Yes | `l2`, `innerproduct`, `hamming` (supported for binary vectors in OpenSearch version 2.16 and later. For more information, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized#binary-vectors), `cosinesimil` (supported in OpenSearch 2.19 and later).


#### HNSW parameters

The `hnsw` method supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_search` | No | 100 | No | The size of the dynamic list used during k-NN searches. Higher values result in more accurate but slower searches. Default is `256` for [binary indexes]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/binary-quantization/).
`ef_construction` | No | 100 | No | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed. Default is `256` for [binary indexes]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/binary-quantization/).
`m` | No | 16 | No | The number of bidirectional links that the plugin creates for each new element. Increasing and decreasing this value can have a large impact on memory consumption. Keep this value between `2` and `100`.
`encoder` | No | flat | No | An encoder definition for encoding vectors. Encoders can reduce the memory footprint of your index at the expense of search accuracy.

An index created in OpenSearch version 2.11 or earlier will still use the previous `ef_construction` value (`512`).
{: .note}

#### IVF parameters

The IVF method supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`nlist` | No | 4 | No | The number of buckets into which to partition vectors. Higher values may increase accuracy but also increase memory and training latency.
`nprobes` | No | 1 | No | The number of buckets to search during a query. Higher values result in more accurate but slower searches.
`encoder` | No | flat | No | An encoder definition for encoding vectors.

For more information about these parameters, see the [Faiss documentation](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes).

### IVF training requirements

The IVF algorithm requires a training step. To create an index that uses IVF, you need to train a model with the [Train API]({{site.url}}{{site.baseurl}}/vector-search/api/knn#train-a-model), passing the IVF method definition. IVF requires, at a minimum, that there be `nlist` training data points, but we recommend [that you use more than this](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#how-big-is-the-dataset). Training data can be the same as the data you plan to index or come from a separate dataset.

### Supported encoders

You can use encoders to reduce the memory footprint of a vector index at the expense of search accuracy. 

OpenSearch currently supports the following encoders in the Faiss library.

Encoder name | Requires training | Description
:--- | :--- | :---
`flat` (Default) | No | Encode vectors as floating-point arrays. This encoding does not reduce memory footprint.
[`pq`](#pq-parameters) | Yes | An abbreviation for _product quantization_, PQ is a lossy compression technique that uses clustering to encode a vector into a fixed byte size, with the goal of minimizing the drop in k-NN search accuracy. At a high level, vectors are separated into `m` subvectors, and then each subvector is represented by a `code_size` code obtained from a code book produced during training. For more information about product quantization, see [this blog post](https://medium.com/dotstar/understanding-faiss-part-2-79d90b1e5388).
[`sq`](#sq-parameters) | No | An abbreviation for _scalar quantization_. Starting with OpenSearch version 2.13, you can use the `sq` encoder to quantize 32-bit floating-point vectors into 16-bit floats. In version 2.13, the built-in `sq` encoder is the SQFP16 Faiss encoder. The encoder reduces memory footprint with a minimal loss of precision and improves performance by using SIMD optimization (using AVX2 on x86 architecture or Neon on ARM64 architecture). For more information, see [Faiss scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-16-bit-quantization/).

#### PQ parameters

The `pq` encoder supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`m` | No | `1` | No |  Determines the number of subvectors into which to separate the vector. Subvectors are encoded independently of each other. This vector dimension must be divisible by `m`. Maximum value is 1,024.
`code_size` | No | `8` | No | Determines the number of bits into which to encode a subvector. Maximum value is `8`. For `ivf`, this value must be less than or equal to `8`. For `hnsw`, this value must be `8`.

The `hnsw` method supports the `pq` encoder for OpenSearch version 2.10 and later. The `code_size` parameter of a `pq` encoder with the `hnsw` method must be **8**.
{: .important}

#### SQ parameters

The `sq` encoder supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :-- | :--- | :---
`type` | No | `fp16` | No |  The type of scalar quantization to be used to encode 32-bit float vectors into the corresponding type. As of OpenSearch 2.13, only the `fp16` encoder type is supported. For the `fp16` encoder, vector values must be in the [-65504.0, 65504.0] range. 
`clip` | No | `false` | No | If `true`, then any vector values outside of the supported range for the specified vector type are rounded so that they are within the range. If `false`, then the request is rejected if any vector values are outside of the supported range. Setting `clip` to `true` may decrease recall.

For more information and examples, see [Using Faiss scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-16-bit-quantization/).

### SIMD optimization 

Starting with version 2.13, OpenSearch supports [Single Instruction Multiple Data (SIMD)](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data) processing if the underlying hardware supports SIMD instructions (AVX2 on x64 architecture and Neon on ARM64 architecture). SIMD is supported by default on Linux machines only for the Faiss engine. SIMD architecture helps boost overall performance by improving indexing throughput and reducing search latency. Starting with version 2.18, OpenSearch supports AVX-512 SIMD instructions on x64 architecture. Starting with version 2.19, OpenSearch supports advanced AVX-512 SIMD instructions on x64 architecture for Intel Sapphire Rapids or a newer-generation processor, improving the performance of Hamming distance computation. 

SIMD optimization is applicable only if the vector dimension is a multiple of 8.
{: .note}

<!-- vale off -->
#### x64 architecture
<!-- vale on -->

For x64 architecture, the following versions of the Faiss library are built and shipped with the artifact:

- `libopensearchknn_faiss_avx512_spr.so`: The Faiss library containing advanced AVX-512 SIMD instructions for newer-generation processors, available on public clouds such as AWS for c/m/r 7i or newer instances. 
- `libopensearchknn_faiss_avx512.so`: The Faiss library containing AVX-512 SIMD instructions. 
- `libopensearchknn_faiss_avx2.so`: The Faiss library containing AVX2 SIMD instructions.
- `libopensearchknn_faiss.so`: The non-optimized Faiss library without SIMD instructions.

When using the Faiss library, the performance ranking is as follows: advanced AVX-512 > AVX-512 > AVX2 > no optimization.
{: .note }

If your hardware supports advanced AVX-512(spr), OpenSearch loads the `libopensearchknn_faiss_avx512_spr.so` library at runtime.

If your hardware supports AVX-512, OpenSearch loads the `libopensearchknn_faiss_avx512.so` library at runtime.

If your hardware supports AVX2 but doesn't support AVX-512, OpenSearch loads the `libopensearchknn_faiss_avx2.so` library at runtime.

To disable the advanced AVX-512 (for Sapphire Rapids or newer-generation processors), AVX-512, and AVX2 SIMD instructions and load the non-optimized Faiss library (`libopensearchknn_faiss.so`), specify the `knn.faiss.avx512_spr.disabled`, `knn.faiss.avx512.disabled`, and `knn.faiss.avx2.disabled` static settings as `true` in `opensearch.yml` (by default, all of these are set to `false`).

Note that to update a static setting, you must stop the cluster, change the setting, and restart the cluster. For more information, see [Static settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).

#### ARM64 architecture

For the ARM64 architecture, only one performance-boosting Faiss library (`libopensearchknn_faiss.so`) is built and shipped. The library contains Neon SIMD instructions and cannot be disabled. 

### Example configurations

The following example uses the `ivf` method without specifying an encoder (by default, OpenSearch uses the `flat` encoder):

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

## NMSLIB engine (deprecated)

The Non-Metric Space Library (NMSLIB) engine was one of the first vector search implementations in OpenSearch. While still supported, it has been deprecated in favor of the Faiss and Lucene engines.

### Supported methods

The NMSLIB engine supports the following method.

Method name | Requires training | Supported spaces 
:--- | :--- | :--- 
[`hnsw`](#hnsw-parameters-2) | No | `l2`, `innerproduct`, `cosinesimil`, `l1`, `linf` 

#### HNSW parameters

The HNSW method supports the following parameters.

Parameter name | Required | Default | Updatable | Description
:--- | :--- | :--- | :--- | :---
`ef_construction` | No | 100 | No | The size of the dynamic list used during k-NN graph creation. Higher values result in a more accurate graph but slower indexing speed.
`m` | No | 16 | No | The number of bidirectional links created for each new element. Impacts memory consumption significantly. Keep between `2` and `100`.

For NMSLIB (deprecated), *ef_search* is set in the [index settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings).
{: .note}

An index created in OpenSearch version 2.11 or earlier will still use the previous `ef_construction` value (`512`).
{: .note}

### Example configuration

```json
"method": {
    "name": "hnsw",
    "engine": "nmslib",
    "space_type": "l2",
    "parameters": {
        "ef_construction": 100,
        "m": 16
    }
}
```

## Choosing the right method

There are several options to choose from when building your `knn_vector` field. To select the correct method and parameters, you should first understand the requirements of your workload and what trade-offs you are willing to make. Factors to consider are (1) query latency, (2) query quality, (3) memory limits, and (4) indexing latency.

If memory is not a concern, HNSW offers a strong query latency/query quality trade-off.

If you want to use less memory and increase indexing speed as compared to HNSW while maintaining similar query quality, you should evaluate IVF.

If memory is a concern, consider adding a PQ encoder to your HNSW or IVF index. Because PQ is a lossy encoding, query quality will drop.

You can reduce the memory footprint by a factor of 2, with a minimal loss in search quality, by using the [`fp_16` encoder]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-16-bit-quantization/). If your vector dimensions are within the [-128, 127] byte range, we recommend using the [byte quantizer]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#byte-vectors) to reduce the memory footprint by a factor of 4. To learn more about vector quantization options, see [k-NN vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/). 

## Engine recommendations

In general, select Faiss for large-scale use cases. Lucene is a good option for smaller deployments and offers benefits like smart filtering, where the optimal filtering strategy—pre-filtering, post-filtering, or exact k-NN—is automatically applied depending on the situation. The following table summarizes the differences between each option.

| |   Faiss/HNSW |  Faiss/IVF |  Lucene/HNSW |
|:---|:---|:---|:---|
|  Max dimensions |    16,000 |  16,000 |  16,000 |
|  Filter |    Post-filter |  Post-filter |  Filter during search |
|  Training required |    No (Yes for PQ) |  Yes |  No |
|  Similarity metrics | `l2`, `innerproduct`, `cosinesimil` |  `l2`, `innerproduct`, `cosinesimil` |  `l2`, `cosinesimil` |
|  Number of vectors   |    Tens of billions |  Tens of billions |  Less than 10 million |
|  Indexing latency |   Low  |  Lowest  |  Low  |
|  Query latency and quality  |    Low latency and high quality  |  Low latency and low quality  |  High latency and high quality  |
|  Vector compression  |   Flat <br><br>PQ |  Flat <br><br>PQ |  Flat  |
|  Memory consumption |   High <br><br> Low with PQ |  Medium <br><br> Low with PQ |  High  |

## Memory estimation

In a typical OpenSearch cluster, a certain portion of RAM is reserved for the JVM heap. OpenSearch allocates native library indexes to a portion of the remaining RAM. This portion's size is determined by the `circuit_breaker_limit` cluster setting. By default, the limit is set to 50%.

Using a replica doubles the total number of vectors.
{: .note }

For information about using memory estimation with vector quantization, see [Vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/).
{: .note }

### HNSW memory estimation

The memory required for HNSW is estimated to be `1.1 * (4 * dimension + 8 * m)` bytes/vector.

As an example, assume you have 1 million vectors with a `dimension` of 256 and an `m` of 16. The memory requirement can be estimated as follows:

```r
1.1 * (4 * 256 + 8 * 16) * 1,000,000 ~= 1.267 GB
```

### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((4 * dimension) * num_vectors) + (4 * nlist * d))` bytes.

As an example, assume you have 1 million vectors with a `dimension` of `256` and an `nlist` of `128`. The memory requirement can be estimated as follows:

```r
1.1 * (((4 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 1.126 GB
```

## Next steps

- [Performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning/)
- [Optimizing vector storage]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/)
- [Vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/)
