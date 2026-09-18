---
layout: default
title: Exact search using scalar quantization
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 15
has_children: false
has_math: true
---

# Exact search using scalar quantization
**Introduced 3.6**
{: .label .label-purple }

OpenSearch supports the `flat` quantization method, which performs scalar quantization on 32-bit floating-point vectors. Unlike HNSW scalar quantization for the [Faiss]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-scalar-quantization/) and [Lucene]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/) engines, which builds a navigable graph for approximate nearest neighbor search, the `flat` method performs exact (brute-force) k-NN search on quantized vectors. This provides perfect recall at the cost of higher search latency for large datasets.

Starting with OpenSearch 3.9, `method: flat` is engine-agnostic and does not accept the `engine` parameter, specifying `engine` fails index creation. In OpenSearch 3.9 and later, `flat` also supports the `32x`, `16x`, and `8x` compression levels (mapped to 1-bit, 2-bit, and 4-bit scalar quantization, respectively). In earlier versions, `flat` only supported 1-bit quantization (`32x`).
{: .important}

The `flat` method does not support any encoder or method parameters. The compression level is selected through the `compression_level` field on the `knn_vector` mapping.
{: .note}

The `flat` method is best suited for smaller datasets or use cases with restrictive filters where exact search results are required. For larger datasets where approximate results are acceptable, consider using HNSW scalar quantization for the [Faiss]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-scalar-quantization/) or [Lucene]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/) engines.
{: .tip}

## Running an exact search using scalar quantization

To perform an exact search using scalar quantization, set the k-NN vector field's `method.name` to `flat` when creating a vector index. Optionally, set `compression_level` to select the number of bits per dimension: `32x` (1-bit), `16x` (2-bit, added in 3.9), or `8x` (4-bit, added in 3.9). If `compression_level` is not specified, `flat` defaults to 1-bit quantization (`32x`):

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
        "dimension": 4,
        "space_type": "l2",
        "compression_level": "16x",
        "method": {
          "name": "flat"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Scalar quantization is applied only to `float` vectors. If you change the default value of the `data_type` parameter from `float` to `byte` or any other type when mapping a [k-NN vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/), then the request is rejected.
{: .warning}

## Search

The `flat` method searches over quantized vectors, so rescoring is enabled by default to preserve search recall. The search runs in two phases: the quantized index is searched first, and then the results are rescored using full-precision vectors. The default `oversample_factor` depends on the `compression_level`. For more information, see [Rescoring quantized results to full precision]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#rescoring-quantized-results-to-full-precision).

To search a flat-quantized index, send the following request:

```json
GET /test-index/_search
{
  "query": {
    "knn": {
      "my_vector1": {
        "vector": [1.5, 2.5, 3.5, 4.5],
        "k": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

To customize the `oversample_factor`, provide the `rescore` parameter in the query. The `oversample_factor` is a floating-point number between `1.0` and `100.0`, inclusive. A higher value retrieves more candidates in the first phase, which can improve recall at the cost of higher search latency:

```json
GET /test-index/_search
{
  "query": {
    "knn": {
      "my_vector1": {
        "vector": [1.5, 2.5, 3.5, 4.5],
        "k": 5,
        "rescore": {
          "oversample_factor": 5.0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about rescoring, see [Rescoring quantized results to full precision]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#rescoring-quantized-results-to-full-precision).

## Next steps

- [Faiss scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-scalar-quantization/)
- [Lucene scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/)
- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
