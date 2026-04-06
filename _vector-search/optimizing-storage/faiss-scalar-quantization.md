---
layout: default
title: Faiss scalar quantization
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 20
has_children: false
has_math: true
redirect_from:
  - /vector-search/optimizing-storage/faiss-16-bit-quantization/
---

# Faiss scalar quantization

OpenSearch supports built-in scalar quantization for the Faiss engine. The Faiss scalar quantizer converts 32-bit floating-point input vectors into lower-bit representations during ingestion and stores the quantized vectors in a vector index. OpenSearch supports 16-bit quantization and 1-bit quantization. Quantization can decrease the memory footprint in exchange for some loss in recall. When used with [SIMD optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization), Faiss scalar quantization can also significantly reduce search latencies and improve indexing throughput.

The `bits` parameter is required when configuring the `sq` encoder.
{: .important}

SIMD optimization is not supported on Windows. Using Faiss scalar quantization on Windows can lead to a significant drop in performance, including decreased indexing throughput and increased search latencies.
{: .warning}

## Using Faiss scalar quantization

To use Faiss scalar quantization, set the k-NN vector field's `method.parameters.encoder.name` to `sq` when creating a vector index. You must specify the `bits` parameter in the `method.parameters.encoder.parameters` object:

```json
PUT /test-index
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
        "dimension": 3,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "bits": 16
              }
            },
            "ef_construction": 256,
            "m": 8
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The Faiss `sq` encoder supports the following parameters.

Parameter name | Required | Default | Description
:--- | :--- | :--- | :---
`bits` | Yes | 1 | The number of bits used to quantize each vector dimension. Valid values are `1` and `16`.
`type` | No | `fp16` | The type of scalar quantization to be used. For the `fp16` encoder, vector values must be in the [-65504.0, 65504.0] range. Supported for 16-bit quantization only.
`clip` | No | `false` | If `true`, any vector values outside of the supported range are rounded so that they are within the range. If `false`, the request is rejected if any vector values are outside of the supported range. Setting `clip` to `true` may decrease recall. Supported for 16-bit quantization only.

The `type` and `clip` parameters are supported only for 16-bit quantization. If you set `bits` to any other value and specify `type` or `clip`, the request is rejected.
{: .warning}

## 1-bit quantization
**Introduced 3.6**
{: .label .label-purple }

You can use 1-bit scalar quantization to significantly reduce the memory footprint. With 1-bit quantization, each vector dimension is represented using a single bit, resulting in a much smaller index size compared to 16-bit quantization.

Faiss 1-bit scalar quantization requires [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/), which is enabled by default and cannot be disabled.
{: .important}

The following example creates an index with 1-bit Faiss scalar quantization:

```json
PUT /test-index
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
        "dimension": 3,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "bits": 1
              }
            },
            "ef_construction": 256,
            "m": 8
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## 16-bit quantization

With 16-bit quantization, the Faiss scalar quantizer (SQfp16) converts 32-bit floating-point vectors into 16-bit floating-point vectors. At search time, SQfp16 decodes the vector values back into 32-bit floating-point values for distance computation. The SQfp16 quantization can decrease the memory footprint by a factor of 2 with minimal loss in recall when differences between vector values are large compared to the error introduced by eliminating their two least significant bits.

### Type and clip parameters

The `fp16` encoder converts 32-bit vectors into their 16-bit counterparts. For this encoder type, the vector values must be in the [-65504.0, 65504.0] range. To define how to handle out-of-range values, you can specify the `clip` parameter. By default, this parameter is `false`, and any vectors containing out-of-range values are rejected.

When `clip` is set to `true`, out-of-range vector values are rounded up or down so that they are in the supported range. For example, if the original 32-bit vector is `[65510.82, -65504.1]`, the vector will be indexed as a 16-bit vector `[65504.0, -65504.0]`.

We recommend setting `clip` to `true` only if very few vector dimensions lie outside of the supported range. Rounding the values may cause a drop in recall.
{: .note}

The following example specifies the Faiss SQfp16 encoder with 16-bit quantization, which rejects any indexing request that contains out-of-range vector values (because the `clip` parameter is `false` by default):

```json
PUT /test-index
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
        "dimension": 3,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "bits": 16
              }
            },
            "ef_construction": 256,
            "m": 8
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

When indexing vectors, ensure that each vector dimension is in the supported range ([-65504.0, 65504.0]).

```json
PUT test-index/_doc/1
{
  "my_vector1": [-65504.0, 65503.845, 55.82]
}
```
{% include copy-curl.html %}

When querying vectors, the query vector has no range limitation:

```json
GET test-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector1": {
        "vector": [265436.876, -120906.256, 99.84],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

## Memory estimation

In the best-case scenario, 16-bit vectors produced by the Faiss SQfp16 quantizer require 50% of the memory that 32-bit vectors require.

### HNSW memory estimation

The memory required for Hierarchical Navigable Small Worlds (HNSW) is estimated to be `1.1 * (dimension * bits_per_dimension / 8 + 8 * m)` bytes per vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `m` of 16.

For 16-bit quantization, the memory requirement can be estimated as follows:

```r
1.1 * (2 * 256 + 8 * 16) * 1,000,000 ~= 0.656 GB
```

For 1-bit quantization, the memory requirement can be estimated as follows:

```r
1.1 * (256 / 8 + 8 * 16) * 1,000,000 ~= 0.176 GB
```

### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((bytes_per_dimension * dimension) * num_vectors) + (4 * nlist * dimension))` bytes, where `nlist` is the number of buckets to partition vectors into.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `nlist` of 128.

For 16-bit quantization, the memory requirement can be estimated as follows:

```r
1.1 * (((2 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 0.525 GB
```

For 1-bit quantization, the memory requirement can be estimated as follows:

```r
1.1 * (((256 / 8) * 1,000,000) + (4 * 128 * 256))  ~= 0.035 GB
```

## Next steps

- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
