---
layout: default
title: k-NN vector quantization
nav_order: 27
parent: k-NN search
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/knn-vector-quantization/
---

# k-NN vector quantization

By default, the k-NN plugin supports the indexing and querying of vectors of type `float`, where each dimension of the vector occupies 4 bytes of memory. For use cases that require ingestion on a large scale, keeping `float` vectors can be expensive because OpenSearch needs to construct, load, save, and search graphs (for native `nmslib` and `faiss` engines). To reduce the memory footprint, you can use vector quantization.

OpenSearch supports many varieties of quantization. In general, the level of quantization will provide a trade-off between the accuracy of the nearest neighbor search and the size of the memory footprint consumed by the vector search. The supported types include byte vectors, 16-bit scalar quantization, and product quantization (PQ).

## Lucene byte vector

Starting with k-NN plugin version 2.9, you can use `byte` vectors with the Lucene engine in order to reduce the amount of required memory. This requires quantizing the vectors outside of OpenSearch before ingesting them into an OpenSearch index. For more information, see [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector).

## Lucene scalar quantization

Starting with version 2.16, the k-NN plugin supports built-in scalar quantization for the Lucene engine. Unlike the [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector), which requires you to quantize vectors before ingesting the documents, the Lucene scalar quantizer quantizes input vectors in OpenSearch during ingestion. The Lucene scalar quantizer converts 32-bit floating-point input vectors into 7-bit integer vectors in each segment using the minimum and maximum quantiles computed based on the [`confidence_interval`](#confidence-interval) parameter. During search, the query vector is quantized in each segment using the segment's minimum and maximum quantiles in order to compute the distance between the query vector and the segment's quantized input vectors. 

Quantization can decrease the memory footprint by a factor of 4 in exchange for some loss in recall. Additionally, quantization slightly increases disk usage because it requires storing both the raw input vectors and the quantized vectors.

### Using Lucene scalar quantization

To use the Lucene scalar quantizer, set the k-NN vector field's `method.parameters.encoder.name` to `sq` when creating a k-NN index:

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
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "space_type": "l2",
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

### Confidence interval

Optionally, you can specify the `confidence_interval` parameter in the `method.parameters.encoder` object.
The `confidence_interval` is used to compute the minimum and maximum quantiles in order to quantize the vectors:
- If you set the `confidence_interval` to a value in the `0.9` to `1.0` range, inclusive, then the quantiles are calculated statically. For example, setting the `confidence_interval` to `0.9` specifies to compute the minimum and maximum quantiles based on the middle 90% of the vector values, excluding the minimum 5% and maximum 5% of the values. 
- Setting `confidence_interval` to `0` specifies to compute the quantiles dynamically, which involves oversampling and additional computations performed on the input data.
- When `confidence_interval` is not set, it is computed based on the vector dimension $$d$$ using the formula $$max(0.9, 1 - \frac{1}{1 + d})$$.

Lucene scalar quantization is applied only to `float` vectors. If you change the default value of the `data_type` parameter from `float` to `byte` or any other type when mapping a [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/), then the request is rejected.
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
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "space_type": "l2",
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

### Memory estimation

In the ideal scenario, 7-bit vectors created by the Lucene scalar quantizer use only 25% of the memory required by 32-bit vectors.

#### HNSW memory estimation

The memory required for the Hierarchical Navigable Small World (HNSW) graph can be estimated as `1.1 * (dimension + 8 * M)` bytes/vector, where `M` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```r
1.1 * (256 + 8 * 16) * 1,000,000 ~= 0.4 GB
```

## Faiss 16-bit scalar quantization 
 
Starting with version 2.13, the k-NN plugin supports performing scalar quantization for the Faiss engine within OpenSearch. Within the Faiss engine, a scalar quantizer (SQfp16) performs the conversion between 32-bit and 16-bit vectors. At ingestion time, when you upload 32-bit floating-point vectors to OpenSearch, SQfp16 quantizes them into 16-bit floating-point vectors and stores the quantized vectors in a k-NN index. 

At search time, SQfp16 decodes the vector values back into 32-bit floating-point values for distance computation. The SQfp16 quantization can decrease the memory footprint by a factor of 2. Additionally, it leads to a minimal loss in recall when differences between vector values are large compared to the error introduced by eliminating their two least significant bits. When used with [SIMD optimization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#simd-optimization-for-the-faiss-engine), SQfp16 quantization can also significantly reduce search latencies and improve indexing throughput. 

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

Optionally, you can specify the parameters in `method.parameters.encoder`. For more information about `encoder` object parameters, see [SQ parameters]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#sq-parameters).

The `fp16` encoder converts 32-bit vectors into their 16-bit counterparts. For this encoder type, the vector values must be in the [-65504.0, 65504.0] range. To define how to handle out-of-range values, the preceding request specifies the `clip` parameter. By default, this parameter is `false`, and any vectors containing out-of-range values are rejected. 

When `clip` is set to `true` (as in the preceding request), out-of-range vector values are rounded up or down so that they are in the supported range. For example, if the original 32-bit vector is `[65510.82, -65504.1]`, the vector will be indexed as a 16-bit vector `[65504.0, -65504.0]`.

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

During ingestion, make sure each vector dimension is in the supported range ([-65504.0, 65504.0]).

```json
PUT test-index/_doc/1
{
  "my_vector1": [-65504.0, 65503.845, 55.82]
}
```
{% include copy-curl.html %}

During querying, the query vector has no range limitation:

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

### Memory estimation

In the best-case scenario, 16-bit vectors produced by the Faiss SQfp16 quantizer require 50% of the memory that 32-bit vectors require. 

#### HNSW memory estimation

The memory required for Hierarchical Navigable Small Worlds (HNSW) is estimated to be `1.1 * (2 * dimension + 8 * M)` bytes/vector.

As an example, assume that you have 1 million vectors with a dimension of 256 and M of 16. The memory requirement can be estimated as follows:

```r
1.1 * (2 * 256 + 8 * 16) * 1,000,000 ~= 0.656 GB
```

#### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((2 * dimension) * num_vectors) + (4 * nlist * d))` bytes/vector.

As an example, assume that you have 1 million vectors with a dimension of 256 and `nlist` of 128. The memory requirement can be estimated as follows:

```r
1.1 * (((2 * 256) * 1,000,000) + (4 * 128 * 256))  ~= 0.525 GB
```

## Faiss product quantization

PQ is a technique used to represent a vector in a configurable amount of bits. In general, it can be used to achieve a higher level of compression as compared to byte or scalar quantization. PQ works by separating vectors into _m_ subvectors and encoding each subvector with _code_size_ bits. Thus, the total amount of memory for the vector is `m*code_size` bits, plus overhead. For details about the parameters, see [PQ parameters]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#pq-parameters). PQ is only supported for the _Faiss_ engine and can be used with either the _HNSW_ or _IVF_ approximate nearest neighbor (ANN) algorithms.

### Using Faiss product quantization

To minimize loss in accuracy, PQ requires a _training_ step that builds a model based on the distribution of the data that will be searched.

The product quantizer is trained by running k-means clustering on a set of training vectors for each subvector space and extracts the centroids to be used for encoding. The training vectors can be either a subset of the vectors to be ingested or vectors that have the same distribution and dimension as the vectors to be ingested.

In OpenSearch, the training vectors need to be present in an index. In general, the amount of training data will depend on which ANN algorithm is used and how much data will be stored in the index. For IVF-based indexes, a recommended number of training vectors is `max(1000*nlist, 2^code_size * 1000)`. For HNSW-based indexes, a recommended number is `2^code_size*1000`. See the [Faiss documentation](https://github.com/facebookresearch/faiss/wiki/FAQ#how-many-training-points-do-i-need-for-k-means) for more information about the methodology used to calculate these figures.

For PQ, both _m_ and _code_size_ need to be selected. _m_ determines the number of subvectors into which vectors should be split for separate encoding. Consequently, the _dimension_ needs to be divisible by _m_. _code_size_ determines the number of bits used to encode each subvector. In general, we recommend a setting of `code_size = 8` and then tuning _m_ to get the desired trade-off between memory footprint and recall.

For an example of setting up an index with PQ, see the [Building a k-NN index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model) tutorial.

### Memory estimation

While PQ is meant to represent individual vectors with `m*code_size` bits, in reality, the indexes consume more space. This is mainly due to the overhead of storing certain code tables and auxiliary data structures.

Some of the memory formulas depend on the number of segments present. This is not typically known beforehand, but a recommended default value is 300.
{: .note}

#### HNSW memory estimation

The memory required for HNSW with PQ is estimated to be `1.1*(((pq_code_size / 8) * pq_m + 24 + 8 * hnsw_m) * num_vectors + num_segments * (2^pq_code_size * 4 * d))` bytes.

As an example, assume that you have 1 million vectors with a dimension of 256, `hnsw_m` of 16, `pq_m` of 32, `pq_code_size` of 8, and 100 segments. The memory requirement can be estimated as follows:

```r
1.1 * ((8 / 8 * 32 + 24 + 8 * 16) * 1000000 + 100 * (2^8 * 4 * 256)) ~= 0.215 GB
```

#### IVF memory estimation

The memory required for IVF with PQ is estimated to be `1.1*(((pq_code_size / 8) * pq_m + 24) * num_vectors  + num_segments * (2^code_size * 4 * d + 4 * ivf_nlist * d))` bytes.

For example, assume that you have 1 million vectors with a dimension of 256, `ivf_nlist` of 512, `pq_m` of 32, `pq_code_size` of 8, and 100 segments. The memory requirement can be estimated as follows:

```r
1.1*((8 / 8 * 64 + 24) * 1000000  + 100 * (2^8 * 4 * 256 + 4 * 512 * 256))  ~= 0.171 GB
```
