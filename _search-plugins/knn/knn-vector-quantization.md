---
layout: default
title: k-NN vector quantization
nav_order: 27
parent: k-NN search
grand_parent: Search methods
has_children: false
has_math: true
---

# k-NN vector quantization

By default, the k-NN plugin supports the indexing and querying of vectors of type `float`, where each dimension of the vector occupies 4 bytes of memory. For use cases that require ingestion on a large scale, keeping `float` vectors can be expensive because OpenSearch needs to construct, load, save, and search graphs (for native `nmslib` and `faiss` engines). To reduce the memory footprint, you can use vector quantization.

## Lucene byte vector

Starting with k-NN plugin version 2.9, you can use `byte` vectors with the `lucene` engine in order to reduce the amount of required memory. This requires quantizing the vectors outside of OpenSearch before ingesting them into an OpenSearch index. For more information, see [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector).

## Faiss scalar quantization 
 
Starting with version 2.13, the k-NN plugin supports performing scalar quantization for the Faiss engine within OpenSearch. Within the Faiss engine, a scalar quantizer (SQfp16) performs the conversion between 32-bit and 16-bit vectors. At ingestion time, when you upload 32-bit floating-point vectors to OpenSearch, SQfp16 quantizes them into 16-bit floating-point vectors and stores the quantized vectors in a k-NN index. At search time, SQfp16 decodes the vector values back into 32-bit floating-point values for distance computation. The SQfp16 quantization can decrease the memory footprint by a factor of 2. Additionally, it leads to a minimal loss in recall when differences between vector values are large compared to the error introduced by eliminating their two least significant bits. When used with [SIMD optimization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#simd-optimization-for-the-faiss-engine), SQfp16 quantization can also significantly reduce search latencies and improve indexing throughput. 

SIMD optimization is not supported on Windows. Using Faiss scalar quantization on Windows can lead to a significant drop in performance, including decreased indexing throughput and increased search latencies.
{: .warning} 

### Using Faiss scalar quantization

To use Faiss scalar quantization, set the k-NN vector field's `method.parameters.encoder.name` to `sq` when creating a k-NN index:

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
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "l2",
          "parameters": {
            "encoder": {
              "name": "sq",
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

Optionally, you can specify the parameters in `method.parameters.encoder`. For more information about `encoder` object parameters, see [SQ parameters]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#sq-parameters).

The `fp16` encoder converts 32-bit vectors into their 16-bit counterparts. For this encoder type, the vector values must be in the [-65504.0, 65504.0] range. To define how to handle out-of-range values, the preceding request specifies the `clip` parameter. By default, this parameter is `false`, and any vectors containing out-of-range values are rejected. When `clip` is set to `true` (as in the preceding request), out-of-range vector values are rounded up or down so that they are in the supported range. For example, if the original 32-bit vector is `[65510.82, -65504.1]`, the vector will be indexed as a 16-bit vector `[65504.0, -65504.0]`.

We recommend setting `clip` to `true` only if very few elements lie outside of the supported range. Rounding the values may cause a drop in recall.
{: .note}

The following example method definition specifies the Faiss SQfp16 encoder, which rejects any indexing request that contains out-of-range vector values (because the `clip` parameter is `false` by default):

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
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "l2",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "type": "fp16"
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

During ingestion, make sure each dimension of the vector is in the supported range ([-65504.0, 65504.0]):

```json
PUT test-index/_doc/1
{
  "my_vector1": [-65504.0, 65503.845, 55.82]
}
```
{% include copy-curl.html %}

During querying, there is no range limitation for the query vector:

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

#### HNSW memory estimation

The memory required for HNSW is estimated to be `1.1 * (2 * dimension + 8 * M)` bytes/vector.

As an example, assume that you have 1 million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```bash
1.1 * (2 * 256 + 8 * 16) * 1,000,000 ~= 0.656 GB
```

#### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((2 * dimension) * num_vectors) + (4 * nlist * d))` bytes/vector.

As an example, assume that you have 1 million vectors with a dimension of 256 and `nlist` of 128. The memory requirement can be estimated as follows:

```bash
1.1 * (((2 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 0.525 GB
```

