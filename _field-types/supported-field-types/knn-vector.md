---
layout: default
title: k-NN vector
nav_order: 58
has_children: false
parent: Supported field types
has_math: true
canonical_url: https://docs.opensearch.org/latest/field-types/supported-field-types/knn-vector/
---

# k-NN vector field type
**Introduced 1.0**
{: .label .label-purple }

The [k-NN plugin]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/) introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors into an OpenSearch index and perform different kinds of k-NN search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. In general, a `knn_vector` field can be built either by providing a method definition or specifying a model id.

## Example

For example, to map `my_vector` as a `knn_vector`, use the following request:

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

Model IDs are used when the underlying Approximate k-NN algorithm requires a training step. As a prerequisite, the model must be created with the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-a-model). The
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
      "my_vector": {
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

## Binary k-NN vectors

You can reduce memory costs by a factor of 32 by switching from float to binary vectors.
Using binary vector indexes can lower operational costs while maintaining high recall performance, making large-scale deployment more economical and efficient.

Binary format is available for the following k-NN search types:

- [Approximate k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/): Supports binary vectors only for the Faiss engine with the HNSW and IVF algorithms.
- [Script score k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Enables the use of binary vectors in script scoring.
- [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Allows the use of binary vectors with Painless scripting extensions.

### Requirements 

There are several requirements for using binary vectors in the OpenSearch k-NN plugin:

- The `data_type` of the binary vector index must be `binary`.
- The `space_type` of the binary vector index must be `hamming`.
- The `dimension` of the binary vector index must be a multiple of 8.
- You must convert your binary data into 8-bit signed integers (`int8`) in the [-128, 127] range. For example, the binary sequence of 8 bits `0, 1, 1, 0, 0, 0, 1, 1` must be converted into its equivalent byte value of `99` to be used as a binary vector input.

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
        "method": {
          "name": "hnsw",
          "space_type": "hamming",
          "engine": "faiss",
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

The IVF method requires a training step that creates and trains the model used to initialize the native library index during segment creation. For more information, see [Building a k-NN index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model). 

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
  "method": {
    "name": "ivf",
    "engine": "faiss",
    "space_type": "hamming",
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
