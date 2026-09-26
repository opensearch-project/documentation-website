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

OpenSearch supports built-in scalar quantization for the Faiss engine. The Faiss scalar quantizer converts 32-bit floating-point input vectors into lower-bit representations during ingestion and stores the quantized vectors in a vector index. OpenSearch supports 1-, 2-, 4-, and 16-bit Faiss scalar quantization.

Quantization can decrease the memory footprint in exchange for some loss in recall. When used with [SIMD optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization), Faiss scalar quantization can also significantly reduce search latencies and improve indexing throughput.

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
      "knn": true
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
`bits` | Yes | None | The number of bits used to quantize each vector dimension. Valid values are `1`, `2`, `4`, and `16`.
`type` | No | `fp16` | The type of scalar quantization to be used. Valid values are `fp16` and `bf16`. The `bf16` type was introduced in OpenSearch 3.9. For the `fp16` encoder, vector values must be in the [-65504.0, 65504.0] range. The `bf16` encoder accepts any finite 32-bit floating-point value. Supported for 16-bit quantization only.
`clip` | No | `false` | For `fp16`, if `true`, vector values outside of the supported range are rounded so that they are within the range. If `false`, the request is rejected if any vector values are outside of the supported range. Setting `clip` to `true` may decrease recall. For `bf16`, `false` has no effect and `true` is rejected.

The `type` and `clip` parameters are supported only for 16-bit quantization. If you set `bits` to any other value and specify `type` or `clip`, the request is rejected.
{: .warning}

## 1-bit, 2-bit, and 4-bit quantization

For the lowest memory footprint, quantize each vector dimension to 1, 2, or 4 bits. Each bit width corresponds to a `compression_level`.

Bits | `compression_level` | Memory reduction compared to 32-bit vectors | Introduced
:--- | :--- | :--- | :---
`1` | `32x` | 32x | 3.6
`2` | `16x` | 16x | 3.9
`4` | `8x` | 8x | 3.9

Fewer bits per dimension produce a smaller index at the cost of recall. These bit widths are supported only for the HNSW method; IVF requires 16-bit quantization. 1-bit quantization uses [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/).

The following example enables 2-bit quantization for `float` fields by setting `compression_level` to `16x` in the `knn_vector` mapping. To use 1-bit or 4-bit quantization, set `compression_level` to `32x` or `8x`:

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "l2",
        "compression_level": "16x"
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, specify the encoder explicitly by setting `bits` in the `sq` encoder:

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "bits": 2
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

1-bit quantization is also supported for [`half_float` vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#half-float-vectors). Because `half_float` fields do not accept an `encoder` in the `method` mapping, set `compression_level` to `16x` instead. This level is measured against the 16-bit baseline of `half_float` vectors and therefore maps each dimension to a single bit.

## 16-bit quantization

With 16-bit quantization, the Faiss scalar quantizer converts 32-bit floating-point vectors into 16-bit (FP16 or BF16) vectors and stores them in the vector index. At search time, the stored 16-bit values are typically converted to 32-bit floating-point values for distance computation. On processors with AVX-512 BF16 and AVX-512 FP16 support, distances are computed directly on the 16-bit values for BF16 inner product (using AVX-512 BF16 instructions) and FP16 cosine similarity (using AVX-512 FP16 instructions).

OpenSearch provides two 16-bit encoder types, which you select using the `type` parameter:

- `fp16` (Default): The IEEE 754 half-precision format, which uses 5 exponent bits and 10 mantissa bits. This format offers higher precision but a narrower value range ([-65504.0, 65504.0]).
- `bf16`: The bfloat16 format, which uses 8 exponent bits and 7 mantissa bits. This format offers the same value range as 32-bit floating-point numbers but lower precision. Because `bf16` retains fewer mantissa bits than `fp16`, it can cause a slightly larger drop in recall.

Both encoder types store 2 bytes per vector dimension, so they provide the same memory savings.

### The fp16 encoder

The `fp16` encoder converts 32-bit vectors into their 16-bit counterparts. For this encoder type, the vector values must be in the [-65504.0, 65504.0] range. To define how to handle out-of-range values, you can specify the `clip` parameter. By default, this parameter is `false`, and any vectors containing out-of-range values are rejected.

When `clip` is set to `true`, out-of-range vector values are rounded up or down so that they are in the supported range. For example, if the original 32-bit vector is `[65510.82, -65504.1]`, the vector will be indexed as a 16-bit vector `[65504.0, -65504.0]`.

We recommend setting `clip` to `true` only if very few vector dimensions lie outside of the supported range. Rounding the values may cause a drop in recall.
{: .note}

The following example specifies the Faiss `fp16` encoder with 16-bit quantization, which rejects any indexing request that contains out-of-range vector values (because the `clip` parameter is `false` by default):

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
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

### The bf16 encoder
**Introduced 3.9**
{: .label .label-purple }

The `bf16` encoder converts 32-bit vectors into [bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format) vectors. Because bfloat16 uses the same number of exponent bits as a 32-bit floating-point number, it covers the same value range. Any finite 32-bit floating-point value can therefore be indexed without range-based rejection or clipping. During quantization, each value is rounded to the nearest representable bfloat16 value, reducing the mantissa from 23 bits to 7 bits. As a result, `bf16` trades precision for range compared to `fp16`.

Choose the encoder type based on your data:

- Use `fp16` when all vector values fall within the [-65504.0, 65504.0] range and you want the highest 16-bit precision.
- Use `bf16` when your vectors may contain values outside of the `fp16` range, or when you want to avoid `fp16` range validation and clipping.

The following example specifies the Faiss `bf16` encoder with 16-bit quantization:

```json
PUT /test-index-bf16
{
  "settings": {
    "index": {
      "knn": true
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
                "bits": 16,
                "type": "bf16"
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

Vector values are not range restricted, so no dimension is rejected as out of range:

```json
PUT test-index-bf16/_doc/1
{
  "my_vector1": [-150000.5, 123456.75, 55.82]
}
```
{% include copy-curl.html %}

Only finite values are accepted. Indexing requests containing `NaN` or infinity are rejected.
{: .note}

Note the following limitations of the `bf16` encoder:

- Setting `clip` to `true` is not supported and causes the request to be rejected. Because `bf16` covers the full 32-bit floating-point value range, clipping has no effect.
- [Remote index build]({{site.url}}{{site.baseurl}}/vector-search/remote-index-build/) is not supported. Indexes using the `bf16` encoder are always built locally.

On Intel Sapphire Rapids or newer-generation processors, OpenSearch uses AVX-512 BF16 instructions to accelerate inner product computation for bf16 vectors and AVX-512 FP16 instructions to accelerate cosine similarity computation for fp16 vectors. For more information, see [SIMD optimization]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#simd-optimization).

## Memory estimation

In the best-case scenario, 16-bit vectors produced by the Faiss scalar quantizer require 50% of the memory that 32-bit vectors require. This applies to both the `fp16` and `bf16` encoder types.

### HNSW memory estimation

The memory required for Hierarchical Navigable Small Worlds (HNSW) is estimated to be `1.1 * (dimension * bits_per_dimension / 8 + 8 * m)` bytes per vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

For example, assume that you have 1 million vectors with a dimension of 256 and an `m` of 16. The memory requirement for each bit width can be estimated as follows.

Bits | Estimate | Result
:--- | :--- | :---
`1` | `1.1 * (256 * 1 / 8 + 8 * 16) * 1,000,000` | ~0.176 GB
`2` | `1.1 * (256 * 2 / 8 + 8 * 16) * 1,000,000` | ~0.211 GB
`4` | `1.1 * (256 * 4 / 8 + 8 * 16) * 1,000,000` | ~0.282 GB
`16` | `1.1 * (256 * 16 / 8 + 8 * 16) * 1,000,000` | ~0.656 GB

### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((bytes_per_dimension * dimension) * num_vectors) + (4 * nlist * dimension))` bytes, where `nlist` is the number of buckets to partition vectors into.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `nlist` of 128.

IVF is only supported for 16-bit Faiss scalar quantization. 1-bit, 2-bit, and 4-bit quantization are supported only for the HNSW method.
{: .note}

For 16-bit quantization, the memory requirement can be estimated as follows:

```r
1.1 * (((2 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 0.525 GB
```

## Next steps

- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
