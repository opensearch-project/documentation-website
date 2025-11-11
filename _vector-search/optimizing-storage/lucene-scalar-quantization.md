---
layout: default
title: Lucene scalar quantization
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 10
has_children: false
has_math: true
---

# Lucene scalar quantization

Starting with version 2.16, OpenSearch supports built-in scalar quantization for the Lucene engine. Unlike [byte vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#byte-vectors), which require you to quantize vectors before ingesting documents, the Lucene scalar quantizer quantizes input vectors in OpenSearch during ingestion. The Lucene scalar quantizer converts 32-bit floating-point input vectors into 7-bit integer vectors in each segment using the minimum and maximum quantiles computed based on the [`confidence_interval`](#confidence-interval) parameter. During search, the query vector is quantized in each segment using the segment's minimum and maximum quantiles in order to compute the distance between the query vector and the segment's quantized input vectors. 

Quantization can decrease the memory footprint by a factor of 4 in exchange for some loss in recall. Additionally, quantization slightly increases disk usage because it requires storing both the raw input vectors and the quantized vectors.

## Using Lucene scalar quantization

To use the Lucene scalar quantizer, set the k-NN vector field's `method.parameters.encoder.name` to `sq` when creating a vector index:

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
        "dimension": 2,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "encoder": {
              "name": "sq"
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

## Confidence interval

Optionally, you can specify the `confidence_interval` parameter in the `method.parameters.encoder` object.
The `confidence_interval` is used to compute the minimum and maximum quantiles in order to quantize the vectors:
- If you set the `confidence_interval` to a value in the `0.9` to `1.0` range, inclusive, then the quantiles are calculated statically. For example, setting the `confidence_interval` to `0.9` specifies to compute the minimum and maximum quantiles based on the middle 90% of the vector values, excluding the minimum 5% and maximum 5% of the values. 
- Setting `confidence_interval` to `0` specifies to compute the quantiles dynamically, which involves oversampling and additional computations performed on the input data.
- When `confidence_interval` is not set, it is computed based on the vector dimension $$d$$ using the formula $$max(0.9, 1 - \frac{1}{1 + d})$$.

Lucene scalar quantization is applied only to `float` vectors. If you change the default value of the `data_type` parameter from `float` to `byte` or any other type when mapping a [k-NN vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/), then the request is rejected.
{: .warning}

The following example method definition specifies the Lucene `sq` encoder with the `confidence_interval` set to `1.0`. This `confidence_interval` specifies to consider all the input vectors when computing the minimum and maximum quantiles. Vectors are quantized to 7 bits by default:

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
        "dimension": 2,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "encoder": {
              "name": "sq",
              "parameters": {
                "confidence_interval": 1.0
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

There are no changes to ingestion or query mapping and no range limitations for the input vectors. 

# Memory estimation

In the ideal scenario, 7-bit vectors created by the Lucene scalar quantizer use only 25% of the memory required by 32-bit vectors.

### HNSW memory estimation

The memory required for the Hierarchical Navigable Small World (HNSW) graph can be estimated as `1.1 * (dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```r
1.1 * (256 + 8 * 16) * 1,000,000 ~= 0.4 GB
```

## Next steps

- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)