---
layout: default
title: Memory-optimized vectors
parent: k-NN vector
grand_parent: Supported field types
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/field-types/supported-field-types/knn-memory-optimized/
---

# Memory-optimized vectors

Vector search operations can be memory intensive, particularly when dealing with large-scale deployments. OpenSearch provides several strategies for optimizing memory usage while maintaining search performance. You can choose between different workload modes that prioritize either low latency or low cost, apply various compression levels to reduce memory footprint, or use alternative vector representations like byte or binary vectors. These optimization techniques allow you to balance memory consumption, search performance, and cost based on your specific use case requirements.

## Vector workload modes

Vector search requires balancing search performance and operational costs. While in-memory search provides the lowest latency, [disk-based search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/) offers a more cost-effective approach by reducing memory usage, though it results in slightly higher search latency. To choose between these approaches, use the `mode` mapping parameter in your `knn_vector` field configuration. This parameter sets appropriate default values for k-NN parameters based on your priority: either low latency or low cost. For additional optimization, you can override these default parameter values in your k-NN field mapping.

OpenSearch supports the following vector workload modes.

| Mode    | Default engine | Description                                                                                                                                                                                                                                             |
|:---|:---|:---|
| `in_memory` (Default) | `faiss`        | Prioritizes low-latency search. This mode uses the `faiss` engine without any quantization applied. It is configured with the default parameter values for vector search in OpenSearch.                                                                 |
| `on_disk`             | `faiss`        | Prioritizes low-cost vector search while maintaining strong recall. By default, the `on_disk` mode uses quantization and rescoring to execute a two-phase approach in order to retrieve the top neighbors. The `on_disk` mode supports only `float` vector types. |

To create a vector index that uses the `on_disk` mode for low-cost search, send the following request:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2",
        "mode": "on_disk"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Compression levels

The `compression_level` mapping parameter selects a quantization encoder that reduces vector memory consumption by the given factor. The following table lists the available `compression_level` values.

| Compression level | Supported engines                            |
|:------------------|:---------------------------------------------|
| `1x`              | `faiss`, `lucene`, and `nmslib` (deprecated) |
| `2x`              | `faiss`                                      |
| `4x`              | `lucene`                                     |
| `8x`              | `faiss`                                      |
| `16x`             | `faiss`                                      |
| `32x`             | `faiss`                                      |

For example, if a `compression_level` of `32x` is passed for a `float32` index of 768-dimensional vectors, the per-vector memory is reduced from `4 * 768 = 3072` bytes to `3072 / 32 = 846` bytes. Internally, binary quantization (which maps a `float` to a `bit`) may be used to achieve this compression.

If you set the `compression_level` parameter, then you cannot specify an `encoder` in the `method` mapping. Compression levels greater than `1x` are only supported for `float` vector types.
{: .note}

Starting with OpenSearch 3.1, enabling `on_disk` mode with a `1x` compression level activates [memory-optimized search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/memory-optimized-search/). In this mode, the engine loads data on demand during search instead of loading all data into memory at once.
{: .important}

The following table lists the default `compression_level` values for the available workload modes.

| Mode | Default compression level    |
|:------------------|:-------------------------------|
| `in_memory`       | `1x` |
| `on_disk`         | `32x` |


To create a vector field with a `compression_level` of `16x`, specify the `compression_level` parameter in the mappings. This parameter overrides the default compression level for the `on_disk` mode from `32x` to `16x`, producing higher recall and accuracy at the expense of a larger memory footprint:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2",
        "mode": "on_disk",
        "compression_level": "16x"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Rescoring quantized results to full precision

To improve recall while maintaining the memory savings of quantization, you can use a two-phase search approach. In the first phase, `oversample_factor * k` results are retrieved from an index using quantized vectors and the scores are approximated. In the second phase, the full-precision vectors of those `oversample_factor * k` results are loaded into memory from disk, and scores are recomputed against the full-precision query vector. The results are then reduced to the top k.

The default rescoring behavior is determined by the `mode` and `compression_level` of the backing k-NN vector field:

- For `in_memory` mode, no rescoring is applied by default.
- For `on_disk` mode, default rescoring is based on the configured `compression_level`. Each `compression_level` provides a default `oversample_factor`, specified in the following table.

| Compression level | Default rescore `oversample_factor` |
|:------------------|:------------------------------------|
| `32x` (default)   | 3.0                                 |
| `16x`             | 2.0                                 |
| `8x`              | 2.0                                 |
| `4x`              | 1.0                                 |
| `2x`              | No default rescoring                |

To explicitly apply rescoring, provide the `rescore` parameter in a query on a quantized index and specify the `oversample_factor`:

```json
GET /my-vector-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "rescore" : {
          "oversample_factor": 1.2
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, set the `rescore` parameter to `true` to use the default `oversample_factor` of `1.0`:

```json
GET /my-vector-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "rescore" : true
      }
    }
  }
}
```
{% include copy-curl.html %}

The `oversample_factor` is a floating-point number between 1.0 and 100.0, inclusive. The number of results in the first pass is calculated as `oversample_factor * k` and is guaranteed to be between 100 and 10,000, inclusive. If the calculated number of results is smaller than 100, then the number of results is set to 100. If the calculated number of results is greater than 10,000, then the number of results is set to 10,000.

Rescoring is available only for the Faiss and Lucene engines.
{: .note}

Rescoring is not needed if quantization is not used because the scores returned are already fully precise.
{: .note}


## Byte vectors

By default, k-NN vectors are `float` vectors, in which each dimension is 4 bytes. If you want to save storage space, you can use `byte` vectors with the `faiss` or `lucene` engine. In a `byte` vector, each dimension is a signed 8-bit integer in the [-128, 127] range. 
 
Byte vectors are supported only for the `lucene` and `faiss` engines. They are not supported for the `nmslib` engine.
{: .note}

In [k-NN benchmarking tests](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/vectorsearch), the use of `byte` rather than `float` vectors resulted in a significant reduction in storage and memory usage as well as improved indexing throughput and reduced query latency. Additionally, recall precision was not greatly affected (note that recall can depend on various factors, such as the [quantization technique](#quantization-techniques) used and the data distribution). 

When using `byte` vectors, expect some loss of recall precision compared to using `float` vectors. Byte vectors are useful in large-scale applications and use cases that prioritize a reduced memory footprint in exchange for a minimal loss of recall.
{: .important}

When using `byte` vectors with the `faiss` engine, we recommend using [Single Instruction Multiple Data (SIMD) optimization]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#simd-optimization), which helps to significantly reduce search latencies and improve indexing throughput.
{: .important} 

Introduced in k-NN plugin version 2.9, the optional `data_type` parameter defines the data type of a vector. The default value of this parameter is `float`.

To use a `byte` vector, set the `data_type` parameter to `byte` when creating mappings for an index.

### Example: HNSW

The following example creates a byte vector index with the `lucene` engine and `hnsw` algorithm:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 3,
        "data_type": "byte",
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

After creating the index, ingest documents as usual. Make sure each dimension in the vector is in the supported [-128, 127] range:

```json
PUT test-index/_doc/1
{
  "my_vector": [-126, 28, 127]
}
```
{% include copy-curl.html %}

```json
PUT test-index/_doc/2
{
  "my_vector": [100, -128, 0]
}
```
{% include copy-curl.html %}

When querying, be sure to use a `byte` vector:

```json
GET test-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [26, -120, 99],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

### Example: IVF

The `ivf` method requires a training step that creates a model and trains it to initialize the native library index during segment creation. For more information, see [Building a vector index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-vector-index-from-a-model).

First, create an index that will contain byte vector training data. Specify the `faiss` engine and `ivf` algorithm and make sure that the `dimension` matches the dimension of the model you want to create:

```json
PUT train-index
{
  "mappings": {
    "properties": {
      "train-field": {
        "type": "knn_vector",
        "dimension": 4,
        "data_type": "byte"
      }
    }
  }
}
```
{% include copy-curl.html %}

First, ingest training data containing byte vectors into the training index:

```json
PUT _bulk
{ "index": { "_index": "train-index", "_id": "1" } }
{ "train-field": [127, 100, 0, -120] }
{ "index": { "_index": "train-index", "_id": "2" } }
{ "train-field": [2, -128, -10, 50] }
{ "index": { "_index": "train-index", "_id": "3" } }
{ "train-field": [13, -100, 5, 126] }
{ "index": { "_index": "train-index", "_id": "4" } }
{ "train-field": [5, 100, -6, -125] }
```
{% include copy-curl.html %}

Then, create and train the model named `byte-vector-model`. The model will be trained using the training data from the `train-field` in the `train-index`. Specify the `byte` data type:

```json
POST _plugins/_knn/models/byte-vector-model/_train
{
  "training_index": "train-index",
  "training_field": "train-field",
  "dimension": 4,
  "description": "model with byte data",
  "data_type": "byte",
  "method": {
    "name": "ivf",
    "engine": "faiss",
    "space_type": "l2",
    "parameters": {
      "nlist": 1,
      "nprobes": 1
    }
  }
}
```
{% include copy-curl.html %}

To check the model training status, call the Get Model API:

```json
GET _plugins/_knn/models/byte-vector-model?filter_path=state
```
{% include copy-curl.html %}

Once the training is complete, the `state` changes to `created`.

Next, create an index that will initialize its native library indexes using the trained model:

```json
PUT test-byte-ivf
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "model_id": "byte-vector-model"
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest the data containing the byte vectors that you want to search into the created index:

```json
PUT _bulk?refresh=true
{"index": {"_index": "test-byte-ivf", "_id": "1"}}
{"my_vector": [7, 10, 15, -120]}
{"index": {"_index": "test-byte-ivf", "_id": "2"}}
{"my_vector": [10, -100, 120, -108]}
{"index": {"_index": "test-byte-ivf", "_id": "3"}}
{"my_vector": [1, -2, 5, -50]}
{"index": {"_index": "test-byte-ivf", "_id": "4"}}
{"my_vector": [9, -7, 45, -78]}
{"index": {"_index": "test-byte-ivf", "_id": "5"}}
{"my_vector": [80, -70, 127, -128]}
```
{% include copy-curl.html %}

Finally, search the data. Be sure to provide a byte vector in the k-NN vector field:

```json
GET test-byte-ivf/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [100, -120, 50, -45],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

### Memory estimation

In the best-case scenario, byte vectors require 25% of the memory required by 32-bit vectors.

#### HNSW memory estimation

The memory required for Hierarchical Navigable Small World (HNSW) is estimated to be `1.1 * (dimension + 8 * m)` bytes/vector, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph.

As an example, assume that you have 1 million vectors with a `dimension` of `256` and an `m` of `16`. The memory requirement can be estimated as follows:

```r
1.1 * (256 + 8 * 16) * 1,000,000 ~= 0.39 GB
```

#### IVF memory estimation

The memory required for Inverted File Index (IVF) is estimated to be `1.1 * ((dimension * num_vectors) + (4 * nlist * dimension))` bytes/vector, where `nlist` is the number of buckets into which to partition vectors.

As an example, assume that you have 1 million vectors with a `dimension` of `256` and an `nlist` of `128`. The memory requirement can be estimated as follows:

```r
1.1 * ((256 * 1,000,000) + (4 * 128 * 256))  ~= 0.27 GB
```


### Quantization techniques

If your vectors are of the type `float`, you need to first convert them to the `byte` type before ingesting documents. This conversion is accomplished by _quantizing the dataset_---reducing the precision of its vectors. The Faiss engine supports several quantization techniques, such as scalar quantization (SQ) and product quantization (PQ). The choice of quantization technique depends on the type of data you're using and can affect the accuracy of recall values. The following sections describe the scalar quantization algorithms that were used to quantize the [k-NN benchmarking test](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/vectorsearch) data for the [L2](#scalar-quantization-for-the-l2-space-type) and [cosine similarity](#scalar-quantization-for-the-cosine-similarity-space-type) space types. The provided pseudocode is for illustration purposes only.

#### Scalar quantization for the L2 space type

The following example pseudocode illustrates the scalar quantization technique used for the benchmarking tests on Euclidean datasets with the L2 space type. Euclidean distance is shift invariant. If you shift both $$x$$ and $$y$$ by the same $$z$$, then the distance remains the same ($$\lVert x-y\rVert =\lVert (x-z)-(y-z)\rVert$$).

```python
# Random dataset (Example to create a random dataset)
dataset = np.random.uniform(-300, 300, (100, 10))
# Random query set (Example to create a random queryset)
queryset = np.random.uniform(-350, 350, (100, 10))
# Number of values
B = 256

# INDEXING:
# Get min and max
dataset_min = np.min(dataset)
dataset_max = np.max(dataset)
# Shift coordinates to be non-negative
dataset -= dataset_min
# Normalize into [0, 1]
dataset *= 1. / (dataset_max - dataset_min)
# Bucket into 256 values
dataset = np.floor(dataset * (B - 1)) - int(B / 2)

# QUERYING:
# Clip (if queryset range is out of datset range)
queryset = queryset.clip(dataset_min, dataset_max)
# Shift coordinates to be non-negative
queryset -= dataset_min
# Normalize
queryset *= 1. / (dataset_max - dataset_min)
# Bucket into 256 values
queryset = np.floor(queryset * (B - 1)) - int(B / 2)
```
{% include copy.html %}

#### Scalar quantization for the cosine similarity space type

The following example pseudocode illustrates the scalar quantization technique used for the benchmarking tests on angular datasets with the cosine similarity space type. Cosine similarity is not shift invariant ($$cos(x, y) \neq cos(x-z, y-z)$$). 

The following pseudocode is for positive numbers:

```python
# For Positive Numbers

# INDEXING and QUERYING:

# Get Max of train dataset
max = np.max(dataset)
min = 0
B = 127

# Normalize into [0,1]
val = (val - min) / (max - min)
val = (val * B)

# Get int and fraction values
int_part = floor(val)
frac_part = val - int_part

if 0.5 < frac_part:
 bval = int_part + 1
else:
 bval = int_part

return Byte(bval)
```
{% include copy.html %}

The following pseudocode is for negative numbers:

```python
# For Negative Numbers

# INDEXING and QUERYING:

# Get Min of train dataset
min = 0
max = -np.min(dataset)
B = 128

# Normalize into [0,1]
val = (val - min) / (max - min)
val = (val * B)

# Get int and fraction values
int_part = floor(var)
frac_part = val - int_part

if 0.5 < frac_part:
 bval = int_part + 1
else:
 bval = int_part

return Byte(bval)
```
{% include copy.html %}

## Binary vectors

You can reduce memory costs by a factor of 32 by switching from float to binary vectors. Using binary vector indexes can lower operational costs while maintaining high recall performance, making large-scale deployment more economical and efficient.

Binary format is available for the following k-NN search types:

- [Approximate k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/): Supports binary vectors only for the Faiss engine with the HNSW and IVF algorithms.
- [Script score k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Enables the use of binary vectors in script scoring.
- [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Allows the use of binary vectors with Painless scripting extensions.

### Requirements 

There are several requirements for using binary vectors in the OpenSearch k-NN plugin:

- The `data_type` of the binary vector index must be `binary`.
- The `space_type` of the binary vector index must be `hamming`.
- The `dimension` of the binary vector index must be a multiple of 8.
- You must convert your binary data into 8-bit signed integers (`int8`) in the [-128, 127] range. For example, the binary sequence of 8 bits `0, 1, 1, 0, 0, 0, 1, 1` must be converted into its equivalent byte value of `99` in order to be used as a binary vector input.

### Example: HNSW

To create a binary vector index with the Faiss engine and HNSW algorithm, send the following request:

```json
PUT /test-binary-hnsw
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 8,
        "data_type": "binary",
        "space_type": "hamming",
        "method": {
          "name": "hnsw",
          "engine": "faiss"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Then ingest some documents containing binary vectors:

```json
PUT _bulk
{"index": {"_index": "test-binary-hnsw", "_id": "1"}}
{"my_vector": [7], "price": 4.4}
{"index": {"_index": "test-binary-hnsw", "_id": "2"}}
{"my_vector": [10], "price": 14.2}
{"index": {"_index": "test-binary-hnsw", "_id": "3"}}
{"my_vector": [15], "price": 19.1}
{"index": {"_index": "test-binary-hnsw", "_id": "4"}}
{"my_vector": [99], "price": 1.2}
{"index": {"_index": "test-binary-hnsw", "_id": "5"}}
{"my_vector": [80], "price": 16.5}
```
{% include copy-curl.html %}

When querying, be sure to use a binary vector:

```json
GET /test-binary-hnsw/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [9],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two vectors closest to the query vector:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.5,
    "hits": [
      {
        "_index": "test-binary-hnsw",
        "_id": "2",
        "_score": 0.5,
        "_source": {
          "my_vector": [
            10
          ],
          "price": 14.2
        }
      },
      {
        "_index": "test-binary-hnsw",
        "_id": "5",
        "_score": 0.25,
        "_source": {
          "my_vector": [
            80
          ],
          "price": 16.5
        }
      }
    ]
  }
}
```
</details>

### Example: IVF

The IVF method requires a training step that creates a model and trains it to initialize the native library index during segment creation. For more information, see [Building a vector index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-vector-index-from-a-model). 

First, create an index that will contain binary vector training data. Specify the Faiss engine and IVF algorithm and make sure that the `dimension` matches the dimension of the model you want to create:

```json
PUT train-index
{
  "mappings": {
    "properties": {
      "train-field": {
        "type": "knn_vector",
        "dimension": 8,
        "data_type": "binary"
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest training data containing binary vectors into the training index:

<details markdown="block">
  <summary>
    Bulk ingest request
  </summary>
  {: .text-delta}

```json
PUT _bulk
{ "index": { "_index": "train-index", "_id": "1" } }
{ "train-field": [1] }
{ "index": { "_index": "train-index", "_id": "2" } }
{ "train-field": [2] }
{ "index": { "_index": "train-index", "_id": "3" } }
{ "train-field": [3] }
{ "index": { "_index": "train-index", "_id": "4" } }
{ "train-field": [4] }
{ "index": { "_index": "train-index", "_id": "5" } }
{ "train-field": [5] }
{ "index": { "_index": "train-index", "_id": "6" } }
{ "train-field": [6] }
{ "index": { "_index": "train-index", "_id": "7" } }
{ "train-field": [7] }
{ "index": { "_index": "train-index", "_id": "8" } }
{ "train-field": [8] }
{ "index": { "_index": "train-index", "_id": "9" } }
{ "train-field": [9] }
{ "index": { "_index": "train-index", "_id": "10" } }
{ "train-field": [10] }
{ "index": { "_index": "train-index", "_id": "11" } }
{ "train-field": [11] }
{ "index": { "_index": "train-index", "_id": "12" } }
{ "train-field": [12] }
{ "index": { "_index": "train-index", "_id": "13" } }
{ "train-field": [13] }
{ "index": { "_index": "train-index", "_id": "14" } }
{ "train-field": [14] }
{ "index": { "_index": "train-index", "_id": "15" } }
{ "train-field": [15] }
{ "index": { "_index": "train-index", "_id": "16" } }
{ "train-field": [16] }
{ "index": { "_index": "train-index", "_id": "17" } }
{ "train-field": [17] }
{ "index": { "_index": "train-index", "_id": "18" } }
{ "train-field": [18] }
{ "index": { "_index": "train-index", "_id": "19" } }
{ "train-field": [19] }
{ "index": { "_index": "train-index", "_id": "20" } }
{ "train-field": [20] }
{ "index": { "_index": "train-index", "_id": "21" } }
{ "train-field": [21] }
{ "index": { "_index": "train-index", "_id": "22" } }
{ "train-field": [22] }
{ "index": { "_index": "train-index", "_id": "23" } }
{ "train-field": [23] }
{ "index": { "_index": "train-index", "_id": "24" } }
{ "train-field": [24] }
{ "index": { "_index": "train-index", "_id": "25" } }
{ "train-field": [25] }
{ "index": { "_index": "train-index", "_id": "26" } }
{ "train-field": [26] }
{ "index": { "_index": "train-index", "_id": "27" } }
{ "train-field": [27] }
{ "index": { "_index": "train-index", "_id": "28" } }
{ "train-field": [28] }
{ "index": { "_index": "train-index", "_id": "29" } }
{ "train-field": [29] }
{ "index": { "_index": "train-index", "_id": "30" } }
{ "train-field": [30] }
{ "index": { "_index": "train-index", "_id": "31" } }
{ "train-field": [31] }
{ "index": { "_index": "train-index", "_id": "32" } }
{ "train-field": [32] }
{ "index": { "_index": "train-index", "_id": "33" } }
{ "train-field": [33] }
{ "index": { "_index": "train-index", "_id": "34" } }
{ "train-field": [34] }
{ "index": { "_index": "train-index", "_id": "35" } }
{ "train-field": [35] }
{ "index": { "_index": "train-index", "_id": "36" } }
{ "train-field": [36] }
{ "index": { "_index": "train-index", "_id": "37" } }
{ "train-field": [37] }
{ "index": { "_index": "train-index", "_id": "38" } }
{ "train-field": [38] }
{ "index": { "_index": "train-index", "_id": "39" } }
{ "train-field": [39] }
{ "index": { "_index": "train-index", "_id": "40" } }
{ "train-field": [40] }
```
{% include copy-curl.html %}
</details>

Then, create and train the model named `test-binary-model`. The model will be trained using the training data from the `train_field` in the `train-index`. Specify the `binary` data type and `hamming` space type:

```json
POST _plugins/_knn/models/test-binary-model/_train
{
  "training_index": "train-index",
  "training_field": "train-field",
  "dimension": 8,
  "description": "model with binary data",
  "data_type": "binary",
  "space_type": "hamming",
  "method": {
    "name": "ivf",
    "engine": "faiss",
    "parameters": {
      "nlist": 16,
      "nprobes": 1
    }
  }
}
```
{% include copy-curl.html %}

To check the model training status, call the Get Model API:

```json
GET _plugins/_knn/models/test-binary-model?filter_path=state
```
{% include copy-curl.html %}

Once the training is complete, the `state` changes to `created`.

Next, create an index that will initialize its native library indexes using the trained model:

```json
PUT test-binary-ivf
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "model_id": "test-binary-model"
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest the data containing the binary vectors that you want to search into the created index:

```json
PUT _bulk?refresh=true
{"index": {"_index": "test-binary-ivf", "_id": "1"}}
{"my_vector": [7], "price": 4.4}
{"index": {"_index": "test-binary-ivf", "_id": "2"}}
{"my_vector": [10], "price": 14.2}
{"index": {"_index": "test-binary-ivf", "_id": "3"}}
{"my_vector": [15], "price": 19.1}
{"index": {"_index": "test-binary-ivf", "_id": "4"}}
{"my_vector": [99], "price": 1.2}
{"index": {"_index": "test-binary-ivf", "_id": "5"}}
{"my_vector": [80], "price": 16.5}
```
{% include copy-curl.html %}

Finally, search the data. Be sure to provide a binary vector in the k-NN vector field:

```json
GET test-binary-ivf/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [8],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two vectors closest to the query vector:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
GET /_plugins/_knn/models/my-model?filter_path=state
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.5,
    "hits": [
      {
        "_index": "test-binary-ivf",
        "_id": "2",
        "_score": 0.5,
        "_source": {
          "my_vector": [
            10
          ],
          "price": 14.2
        }
      },
      {
        "_index": "test-binary-ivf",
        "_id": "3",
        "_score": 0.25,
        "_source": {
          "my_vector": [
            15
          ],
          "price": 19.1
        }
      }
    ]
  }
}
```
</details>

### Memory estimation

Use the following formulas to estimate the amount of memory required for binary vectors.

#### HNSW memory estimation

The memory required for HNSW can be estimated using the following formula, where `m` is the maximum number of bidirectional links created for each element during the construction of the graph:

```r
1.1 * (dimension / 8 + 8 * m) bytes/vector
```

#### IVF memory estimation

The memory required for IVF can be estimated using the following formula, where `nlist` is the number of buckets into which to partition vectors:

```r
1.1 * (((dimension / 8) * num_vectors) + (nlist * dimension / 8))
```

## Next steps

- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
- [Disk-based vector search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/)
- [Vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/)
