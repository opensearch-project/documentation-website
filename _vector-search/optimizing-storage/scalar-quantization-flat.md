---
layout: default
title: Lucene flat scalar quantization
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 15
has_children: false
has_math: true
---

# Lucene flat scalar quantization
**Introduced 3.6**
{: .label .label-purple }

OpenSearch supports the `flat` method for the Lucene engine, which performs scalar quantization on 32-bit floating-point vectors. Unlike [Lucene HNSW scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/), which builds a navigable graph for approximate nearest neighbor search, the `flat` method performs exact (brute-force) k-NN search on quantized vectors. This provides perfect recall at the cost of higher search latency for large datasets.

The `flat` method quantizes vectors to 1 bit per dimension and does not support any encoder or method parameters.
{: .note}

The `flat` method is best suited for smaller datasets or use cases with restrictive filters where exact search results are required. For larger datasets where approximate results are acceptable, consider using [Lucene HNSW scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/).
{: .tip}

## Using Lucene flat scalar quantization

To use scalar quantization with the `flat` method, set the k-NN vector field's `method.name` to `flat` when creating a vector index:

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
        "method": {
          "name": "flat"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Lucene scalar quantization is applied only to `float` vectors. If you change the default value of the `data_type` parameter from `float` to `byte` or any other type when mapping a [k-NN vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/), then the request is rejected.
{: .warning}

## Search

Because the `flat` method uses 1-bit quantized vectors, rescoring is enabled by default to preserve search recall. The search runs in two phases: the quantized index is searched first, and then the results are rescored using full-precision vectors. The default `oversample_factor` is `2.0`.

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

- [Lucene HNSW scalar quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/lucene-scalar-quantization/)
- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
