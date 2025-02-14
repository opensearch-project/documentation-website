---
layout: default
title: k-NN vector
nav_order: 20
has_children: true
parent: Supported field types
has_math: true
---

# k-NN vector
**Introduced 1.0**
{: .label .label-purple }

The `knn_vector` data type allows you to ingest vectors into an OpenSearch index and perform different kinds of vector search. The `knn_vector` field is highly configurable and can serve many different vector workloads. In general, a `knn_vector` field can be built either by [providing a method definition](#method-definitions) or [specifying a model ID](#model-ids).

## Example

For example, to map `my_vector` as a `knn_vector`, use the following request:

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

## Method definitions

[Method definitions]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/) are used when the underlying [approximate k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) algorithm does not require training. For example, the following `knn_vector` field specifies that Faiss implementation of HNSW should be used for approximate k-NN search. During indexing, Faiss builds the corresponding HNSW segment files:

```json
"my_vector": {
  "type": "knn_vector",
  "dimension": 4,
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
```

## Model IDs

Model IDs are used when the underlying approximate k-NN algorithm requires a training step. As a prerequisite, the model must be created with the [Train API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api#train-a-model). The
model contains the information needed to initialize the native library segment files.

```json
"my_vector": {
  "type": "knn_vector",
  "model_id": "my-model"
}
```

However, if you intend to use Painless scripting or a k-NN score script, you only need to pass the dimension.
 ```json
"my_vector": {
   "type": "knn_vector",
   "dimension": 128
 }
 ```

## Related articles

- [Vector search]({{site.url}}{{site.baseurl}}/vector-search/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/kNN/)