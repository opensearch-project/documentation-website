---
layout: default
title: k-NN vector
nav_order: 58
has_children: false
parent: Supported field types
---

# k-NN vector 

The k-NN plugin introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors
into an OpenSearch index and perform different kinds of k-NN search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. In general, a `knn_vector` field can be built either by providing a method definition or specifying a model id.

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

Method definitions are used when the underlying Approximate k-NN algorithm does not require training. For example, the following `knn_vector` field specifies that *nmslib*'s implementation of *hnsw* should be used for Approximate k-NN search. During indexing, *nmslib* will build the corresponding *hnsw* segment files.

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

However, if you intend to just use painless scripting or a k-NN score script, you only need to pass the dimension.
 ```json
   "type": "knn_vector",
   "dimension": 128
 }
 ```

## Lucene byte vector

By default, k-NN vectors are `float` vectors, where each dimension is 4 bytes. If you want to save storage space, you can use `byte` vectors with the `lucene` engine. In a `byte` vector, each dimension is a signed 8-bit integer in the [-128, 127] range. 
 
Byte vectors are supported only for the `lucene` engine. They are not supported for the `nmslib` and `faiss` engines.
{: .note}

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