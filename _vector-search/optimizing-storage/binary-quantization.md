---
layout: default
title: Binary quantization
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 40
has_children: false
has_math: true
---

# Binary quantization

Starting with version 2.17, OpenSearch supports binary quantization (BQ) with binary vector support for the Faiss engine. BQ compresses vectors into a binary format (0s and 1s), making it highly efficient in terms of memory usage. You can choose to represent each vector dimension using 1, 2, or 4 bits, depending on the desired precision. One of the advantages of using BQ is that the training process is handled automatically during indexing. This means that no separate training step is required, unlike other quantization techniques such as PQ.

## Using BQ

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

## Enhancing search quality with ADC and RR

If the recall is lacking, you can specify asymmetric distance computation (ADC) or random rotation (RR) in the index mapping to apply enhanced search capabilities. These techniques are available in OpenSearch 3.2 and later versions.

ADC maintains a full-precision query vector while rescaling it to have meaningful distance computations against binary-quantized document vectors. This asymmetric approach preserves more information about the query vector, boosting search quality without significant memory penalty. ADC is supported for 1-bit quantization only.

Random rotation addresses the issue where binary quantization gives equal weight to each vector dimension during the quantization process. By rotating the distribution, RR can "smooth" variance (information) from high-variance dimensions into low-variance dimensions, preserving more information during the 32x compression process. RR is supported for 1-bit, 2-bit, and 4-bit quantization.

For optimal performance and recall enhancement, use both ADC and RR together:

```json
PUT vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "method": {
            "name": "hnsw",
            "engine": "faiss",
            "space_type": "l2",
            "parameters": {
              "encoder": {
                "name": "binary",
                "parameters": {
                  "bits": 1,
                  "random_rotation": true,
                  "enable_adc": true
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

**Note:** ADC and RR impact search or indexing performance, so they are opt-in features. ADC may introduce a moderate latency increase due to full-precision distance computations, while RR primarily affects indexing latency as vectors must be rotated during the process.

## Search using binary quantized vectors

You can perform a vector search on your index by providing a vector and specifying the number of nearest neighbors (k) to return:

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


## HNSW memory estimation

The memory required for the Hierarchical Navigable Small World (HNSW) graph can be estimated as `1.1 * (dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a dimension of 256 and an `m` of 16. The following sections provide memory requirement estimations for various compression values.

### 1-bit quantization (32x compression)

In 1-bit quantization, each dimension is represented using 1 bit, equivalent to a 32x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 1 / 8) + 8 * 16) * 1,000,000
       ~= 0.176 GB
```

### 2-bit quantization (16x compression)

In 2-bit quantization, each dimension is represented using 2 bits, equivalent to a 16x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 2 / 8) + 8 * 16) * 1,000,000
       ~= 0.211 GB
```

### 4-bit quantization (8x compression)

In 4-bit quantization, each dimension is represented using 4 bits, equivalent to an 8x compression factor. The memory requirement can be estimated as follows:

```r
Memory = 1.1 * ((256 * 4 / 8) + 8 * 16) * 1,000,000
       ~= 0.282 GB
```

## Next steps

- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)