---
layout: default
title: k-NN vector
nav_order: 58
has_children: false
parent: Supported field types
has_math: true
---

# k-NN vector 

The [k-NN plugin]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/) introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors into an OpenSearch index and perform different kinds of k-NN search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. In general, a `knn_vector` field can be built either by providing a method definition or specifying a model id.

## Example

For example, to map `my_vector1` as a `knn_vector`, use the following request:

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
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 3,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Method definitions

[Method definitions]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index#method-definitions) are used when the underlying [approximate k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) algorithm does not require training. For example, the following `knn_vector` field specifies that *nmslib*'s implementation of *hnsw* should be used for approximate k-NN search. During indexing, *nmslib* will build the corresponding *hnsw* segment files.

```json
"my_vector": {
  "type": "knn_vector",
  "dimension": 4,
  "method": {
    "name": "hnsw",
    "space_type": "l2",
    "engine": "nmslib",
    "parameters": {
      "ef_construction": 128,
      "m": 24
    }
  }
}
```

## Model IDs

Model IDs are used when the underlying Approximate k-NN algorithm requires a training step. As a prerequisite, the
model has to be created with the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-model). The
model contains the information needed to initialize the native library segment files.

```json
  "type": "knn_vector",
  "model_id": "my-model"
}
```

However, if you intend to use Painless scripting or a k-NN score script, you only need to pass the dimension.
 ```json
   "type": "knn_vector",
   "dimension": 128
 }
 ```

## Lucene byte vector

By default, k-NN vectors are `float` vectors, where each dimension is 4 bytes. If you want to save storage space, you can use `byte` vectors with the `lucene` engine. In a `byte` vector, each dimension is a signed 8-bit integer in the [-128, 127] range. 
 
Byte vectors are supported only for the `lucene` engine. They are not supported for the `nmslib` and `faiss` engines.
{: .note}

In [k-NN benchmarking tests](https://github.com/opensearch-project/k-NN/tree/main/benchmarks/perf-tool), the use of `byte` rather than `float` vectors resulted in a significant reduction in storage and memory usage as well as improved indexing throughput and reduced query latency. Additionally, precision on recall was not greatly affected (note that recall can depend on various factors, such as the [quantization technique](#quantization-techniques) and data distribution). 

When using `byte` vectors, expect some loss of precision in the recall compared to using `float` vectors. Byte vectors are useful in large-scale applications and use cases that prioritize a reduced memory footprint in exchange for a minimal loss of recall.
{: .important}
 
Introduced in k-NN plugin version 2.9, the optional `data_type` parameter defines the data type of a vector. The default value of this parameter is `float`.

To use a `byte` vector, set the `data_type` parameter to `byte` when creating mappings for an index:

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
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 3,
        "data_type": "byte",
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Then ingest documents as usual. Make sure each dimension in the vector is in the supported [-128, 127] range:

```json
PUT test-index/_doc/1
{
  "my_vector1": [-126, 28, 127]
}
```
{% include copy-curl.html %}

```json
PUT test-index/_doc/2
{
  "my_vector1": [100, -128, 0]
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
      "my_vector1": {
        "vector": [26, -120, 99],
        "k": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

### Quantization techniques

If your vectors are of the type `float`, you need to first convert them to the `byte` type before ingesting the documents. This conversion is accomplished by _quantizing the dataset_---reducing the precision of its vectors. There are many quantization techniques, such as scalar quantization or product quantization (PQ), which is used in the Faiss engine. The choice of quantization technique depends on the type of data you're using and can affect the accuracy of recall values. The following sections describe the scalar quantization algorithms that were used to quantize the [k-NN benchmarking test](https://github.com/opensearch-project/k-NN/tree/main/benchmarks/perf-tool) data for the [L2](#scalar-quantization-for-the-l2-space-type) and [cosine similarity](#scalar-quantization-for-the-cosine-similarity-space-type) space types. The provided pseudocode is for illustration purposes only.

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