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

OpenSearch supports many varieties of quantization. In general, the level of quantization will provide a trade-off between the accuracy of the nearest neighbor search and the size of the memory footprint consumed by the vector search. The supported types include byte vectors, 16-bit scalar quantization, product quantization (PQ), and binary quantization(BQ).

## Byte vectors

Starting with version 2.17, the k-NN plugin supports `byte` vectors with the `faiss` and `lucene` engines in order to reduce the amount of required memory. This requires quantizing the vectors outside of OpenSearch before ingesting them into an OpenSearch index. For more information, see [Byte vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#byte-vectors).

## Lucene scalar quantization

Starting with version 2.16, the k-NN plugin supports built-in scalar quantization for the Lucene engine. Unlike [byte vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#byte-vectors), which require you to quantize vectors before ingesting documents, the Lucene scalar quantizer quantizes input vectors in OpenSearch during ingestion. The Lucene scalar quantizer converts 32-bit floating-point input vectors into 7-bit integer vectors in each segment using the minimum and maximum quantiles computed based on the [`confidence_interval`](#confidence-interval) parameter. During search, the query vector is quantized in each segment using the segment's minimum and maximum quantiles in order to compute the distance between the query vector and the segment's quantized input vectors. 

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

### Memory estimation

In the ideal scenario, 7-bit vectors created by the Lucene scalar quantizer use only 25% of the memory required by 32-bit vectors.

#### HNSW memory estimation

The memory required for the Hierarchical Navigable Small World (HNSW) graph can be estimated as `1.1 * (dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

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
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
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
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
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

The memory required for Hierarchical Navigable Small Worlds (HNSW) is estimated to be `1.1 * (2 * dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `m` of 16. The memory requirement can be estimated as follows:

```r
1.1 * (2 * 256 + 8 * 16) * 1,000,000 ~= 0.656 GB
```

#### IVF memory estimation

The memory required for IVF is estimated to be `1.1 * (((2 * dimension) * num_vectors) + (4 * nlist * dimension))` bytes/vector, where `nlist` is the number of buckets to partition vectors into.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `nlist` of 128. The memory requirement can be estimated as follows:

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

## Binary quantization

Starting with version 2.17, OpenSearch supports BQ with binary vector support for the Faiss engine. BQ compresses vectors into a binary format (0s and 1s), making it highly efficient in terms of memory usage. You can choose to represent each vector dimension using 1, 2, or 4 bits, depending on the desired precision. One of the advantages of using BQ is that the training process is handled automatically during indexing. This means that no separate training step is required, unlike other quantization techniques such as PQ.

### Using BQ
To configure BQ for the Faiss engine, define a `knn_vector` field and specify the `mode` as `on_disk`. This configuration defaults to 1-bit BQ and both `ef_search` and `ef_construction` set to `100`:

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "l2",
        "data_type": "float",
        "mode": "on_disk"
      }
    }
  }
}
```
{% include copy-curl.html %}

To further optimize the configuration, you can specify additional parameters, such as the compression level, and fine-tune the search parameters. For example, you can override the `ef_construction` value or define the compression level, which corresponds to the number of bits used for quantization:

- **32x compression** for 1-bit quantization
- **16x compression** for 2-bit quantization
- **8x compression** for 4-bit quantization

This allows for greater control over memory usage and recall performance, providing flexibility to balance between precision and storage efficiency.

To specify the compression level, set the `compression_level` parameter:

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "l2",
        "data_type": "float",
        "mode": "on_disk",
        "compression_level": "16x",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
            "parameters": {
                "ef_construction": 16
            }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following example further fine-tunes the configuration by defining `ef_construction`, `encoder`, and the number of `bits` (which can be `1`, `2`, or `4`):

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "method": {
            "name": "hnsw",
            "engine": "faiss",
            "space_type": "l2",
            "parameters": {
              "m": 16,
              "ef_construction": 512,
              "encoder": {
                "name": "binary",
                "parameters": {
                  "bits": 1 
                }
              }
            }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Search using binary quantized vectors

You can perform a k-NN search on your index by providing a vector and specifying the number of nearest neighbors (k) to return:

```json
GET my-vector-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [1.5, 5.5, 1.5, 5.5, 1.5, 5.5, 1.5, 5.5],
        "k": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

You can also fine-tune search by providing the `ef_search` and `oversample_factor` parameters.
The `oversample_factor` parameter controls the factor by which the search oversamples the candidate vectors before ranking them. Using a higher oversample factor means that more candidates will be considered before ranking, improving accuracy but also increasing search time. When selecting the `oversample_factor` value, consider the trade-off between accuracy and efficiency. For example, setting the `oversample_factor` to `2.0` will double the number of candidates considered during the ranking phase, which may help achieve better results. 

The following request specifies the `ef_search` and `oversample_factor` parameters:

```json
GET my-vector-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [1.5, 5.5, 1.5, 5.5, 1.5, 5.5, 1.5, 5.5],
        "k": 10,
        "method_parameters": {
            "ef_search": 10
        },
        "rescore": {
            "oversample_factor": 10.0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


#### HNSW memory estimation

The memory required for the Hierarchical Navigable Small World (HNSW) graph can be estimated as `1.1 * (dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `m` of 16. The following sections provide memory requirement estimations for various compression values.

##### 1-bit quantization (32x compression)

In 1-bit quantization, each dimension is represented using 1 bit, equivalent to a 32x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 1 / 8) + 8 * 16) * 1,000,000
       ~= 0.176 GB
```

##### 2-bit quantization (16x compression)

In 2-bit quantization, each dimension is represented using 2 bits, equivalent to a 16x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 2 / 8) + 8 * 16) * 1,000,000
       ~= 0.211 GB
```

##### 4-bit quantization (8x compression)

In 4-bit quantization, each dimension is represented using 4 bits, equivalent to an 8x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 4 / 8) + 8 * 16) * 1,000,000
       ~= 0.282 GB
```
