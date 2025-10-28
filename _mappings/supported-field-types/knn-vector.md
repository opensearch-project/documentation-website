---
layout: default
title: k-NN vector
nav_order: 90
has_children: true
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/knn-vector/
  - /mappings/supported-field-types/vector-field-types/
has_math: true
---

# k-NN vector
**Introduced 1.0**
{: .label .label-purple }

The `knn_vector` data type allows you to ingest vectors into an OpenSearch index and perform different kinds of vector search. The `knn_vector` field is highly configurable and can serve many different vector workloads. In general, a `knn_vector` field can be built either by [providing a method definition](#method-definitions) or [specifying a model ID](#model-ids).

## Example

To map `my_vector` as a `knn_vector`, use the following request:

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
      "my_vector": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Optimizing vector storage

To optimize vector storage, you can specify a [vector workload mode]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#vector-workload-modes) as `in_memory` (which optimizes for lowest latency) or `on_disk` (which optimizes for lowest cost). The `on_disk` mode reduces memory usage. Optionally, you can specify a [`compression_level`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#compression-levels) to fine-tune the vector memory consumption:


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


## Method definitions

[Method definitions]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/) are used when the underlying [approximate k-NN (ANN)]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) algorithm does not require training. For example, the following `knn_vector` field specifies that a Faiss implementation of HNSW should be used for ANN search. During indexing, Faiss builds the corresponding HNSW segment files:

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
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "faiss",
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

You can also specify the `space_type` at the top level:

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
        "dimension": 1024,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "faiss",
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

## Model IDs

Model IDs are used when the underlying ANN algorithm requires a training step. As a prerequisite, the model must be created using the [Train API]({{site.url}}{{site.baseurl}}/vector-search/api/knn#train-a-model). The model contains the information needed to initialize the native library segment files. To configure a model for a vector field, specify the `model_id`:

```json
"my_vector": {
  "type": "knn_vector",
  "model_id": "my-model"
}
```

However, if you intend to use Painless scripting or a k-NN score script, you only need to pass the `dimension`:

```json
"my_vector": {
   "type": "knn_vector",
   "dimension": 128
 }
```

For more information, see [Building a vector index from a model]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/#building-a-vector-index-from-a-model).

### Parameters

The following table lists the parameters accepted by k-NN vector field types. 

Parameter | Data type | Description 
:--- | :--- 
`type` | String | The vector field type. Must be `knn_vector`. Required.
`dimension` | Integer | The size of the vectors used. Valid values are in the [1, 16,000] range. Required.
`data_type` | String | The data type of the vector elements. Valid values are `binary`, `byte`, and `float`. Optional. Default is `float`.
`space_type` | String | The vector space used to calculate the distance between vectors. Valid values are `l1`, `l2`, `linf`, `cosinesimil`, `innerproduct`, `hamming`, and `hammingbit`. Not every method/engine combination supports each of the spaces. For a list of supported spaces, see the section for a specific engine. Note: This value can also be specified within the `method`. Optional. For more information, see [Spaces]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-spaces/). 
`mode` | String | Sets appropriate default values for k-NN parameters based on your priority: either low latency or low cost. Valid values are `in_memory` and `on_disk`. Optional. Default is `in_memory`. For more information, see [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/). 
`compression_level` | String | Selects a quantization encoder that reduces vector memory consumption by the given factor. Valid values are `1x`, `2x`, `4x`, `8x`, `16x`, and `32x`. Optional. For more information, see [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/). 
`method` | Object | The algorithm used for organizing vector data at indexing time and searching it at search time. Used when the ANN algorithm does not require training. Optional. For more information, see [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/). 
`model_id` | String | The model ID of a trained model. Used when the ANN algorithm requires training. See [Model IDs](#model-ids). Optional.

## Next steps

- [Spaces]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-spaces/)
- [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/)
- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [Vector search]({{site.url}}{{site.baseurl}}/vector-search/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)