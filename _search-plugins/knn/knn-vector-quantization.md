---
layout: default
title: k-NN vector quantization
nav_order: 50
parent: k-NN search
grand_parent: Search methods
has_children: false
has_math: true
---

# k-NN vector quantization

The OpenSearch k-NN plugin by default supports the indexing and querying of vectors of type float where each dimension of the vector occupies 4 bytes of memory. This is getting expensive in terms of memory for use cases that requires ingestion on a large scale where we need to construct, load, save and search graphs(for native engines `nmslib` and `faiss`) which is getting even more costlier. To reduce these memory footprints, we can use these vector quantization features supported by k-NN plugin.

## Lucene byte vector

Starting with k-NN plugin version 2.9, you can use `byte` vectors with the `lucene` engine in order to reduce the amount of memory needed. For more information, see [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector).

## Faiss scalar quantization fp16

Starting with k-NN plugin version 2.13, users can ingest `fp16` vectors with `faiss` engine where when user provides the 32 bit float vectors, the Faiss engine quantize the vector into FP16 using scalar quantization (users don’t need to do any quantization on their end), stores it and decodes it back to FP32 for distance computation during search operations. Using this feature, users can
reduce memory footprints by a factor of 2, significant reduction in search latencies (with [SIMD Optimization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#simd-optimization-for-faiss)), with a very minimal loss in recall(depends on distribution of vectors).

To use this feature, users needs to set `encoder` name as `sq` and to know the type of quantization in SQ, we are introducing a new optional field, `type` in the encoder parameters. The data indexed by users should be within the FP16 range of [-65504.0, 65504.0]. If the data lies out of this range then an exception is thrown and the request is rejected.

We also introduced another optional encoder parameter `clip`  and if this is set to `true`(by default `false`) in the index mapping, then if the data lies out of FP16 range it will be clipped to the MIN(`-65504.0`) and MAX(`65504.0`) of FP16 range and ingested into the index without throwing any exception. But, clipping the values might cause a drop in recall.

For Example - when `clip` is set to `true`, `65510.82` will be clipped and indexed as `65504.0` and `-65504.1` will be clipped and indexed as `-65504.0`.

Ideally, `clip` parameter is recommended to be set as `true` only when most of the vector elements are within the fp16 range and very few elements lies outside of the range.
{: .note}

* `type`  - Set this as `fp16` if we want to quantize the indexed vectors into fp16 using Faiss SQFP16; Default value is `fp16`.
* `clip` - Set this as `true` if you want to skip the FP16 validation check and clip vector value to bring it into FP16 MIN or MAX range. If it is `false` and any vector element is out of range, then it rejects the request and throws an exception; Default value is `false`.

This is an example of a method definition using Faiss SQfp16 with `clip` as `true`
```json
"method": {
  "name":"hnsw",
  "engine":"faiss",
  "space_type": "l2",
  "parameters":{
    "encoder":{
      "name":"sq",
      "parameters":{
        "type": "fp16",
        "clip": true
      }
    }
  }
}

```

During ingestion, make sure each dimension of the vector is in the supported range [-65504.0, 65504.0] if `clip` is set as `false`:
```json
PUT test-index/_doc/1
{
  "my_vector1": [-65504.0, 65503.845, 55.82]
}
```

During querying, there is no range limitation for query vector:
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

### Memory estimation

Ideally, Faiss SQfp16 requires 50% of the memory consumed by FP32 vectors. 

#### HNSW memory estimation

The memory required for HNSW is estimated to be `1.1 * (2 * dimension + 8 * M)` bytes/vector.

As an example, assume you have a million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```
1.1 * (2 * 256 + 8 * 16) * 1,000,000 ~= 0.656 GB
```

#### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((2 * dimension) * num_vectors) + (4 * nlist * d))` bytes.

As an example, assume you have a million vectors with a dimension of 256 and `nlist` of 128. The memory requirement can be estimated as follows:

```
1.1 * (((2 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 0.525 GB

```

