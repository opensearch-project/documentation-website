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

However, if you intend to use [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/) scripting or a k-NN score script, you only need to pass the `dimension`:

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
`data_type` | String | The data type of the vector elements. Valid values are `binary`, `byte`, `float`, and `half_float`. Optional. Default is `float`.
`space_type` | String | The vector space used to calculate the distance between vectors. Valid values are `l1`, `l2`, `linf`, `cosinesimil`, `innerproduct`, `hamming`, and `hammingbit`. Not every method/engine combination supports each of the spaces. For a list of supported spaces, see the section for a specific engine. Note: This value can also be specified within the `method`. Optional. For more information, see [Spaces]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-spaces/). 
`mode` | String | Sets appropriate default values for k-NN parameters based on your priority: either low latency or low cost. Valid values are `in_memory` and `on_disk`. Optional. Default is `in_memory`. For more information, see [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/). 
`compression_level` | String | Selects a quantization encoder that reduces vector memory consumption by the given factor. Valid values are `1x`, `2x`, `4x`, `8x`, `16x`, and `32x`. Optional. For more information, see [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/). 
`method` | Object | The algorithm used for organizing vector data at indexing time and searching it at search time. Used when the ANN algorithm does not require training. Optional. For more information, see [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/). 
`model_id` | String | The model ID of a trained model. Used when the ANN algorithm requires training. See [Model IDs](#model-ids). Optional.

## Dynamic mapping
**Introduced 3.9**
{: .label .label-purple }

OpenSearch can map a field as a `knn_vector` automatically, without an explicit mapping. Dynamic mapping works in two ways: a dynamic template that uses `knn_vector` as a `match_mapping_type`, or auto-inference from the first indexed value.

Dynamic mapping applies to any field that is not already mapped, on both new and existing indexes. An explicit mapping always takes precedence: if a field is already mapped, dynamic mapping does not apply to it.

`knn_vector` fields follow the same [`dynamic`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/dynamic/) mapping parameter as all other dynamically mapped fields. If `dynamic` is set to `strict` for the index or the parent object, OpenSearch rejects any document containing an unmapped field, so no `knn_vector` field is created.

Dynamic mapping is disabled by default. To enable it, set the [`knn.dynamic_mapping.enabled`]({{site.url}}{{site.baseurl}}/vector-search/settings/#cluster-settings) cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "knn.dynamic_mapping.enabled": true
  }
}
```
{% include copy-curl.html %}

Dynamic mapping only creates the `knn_vector` field. It does not enable approximate k-NN (ANN) search. The supported search types depend on the value of the [`index.knn`]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings) setting when you create the index:

- If `index.knn` is `true`, OpenSearch builds the data structures required for the field, and both exact and approximate k-NN search are supported.
- If `index.knn` is unset or `false`, the field is still mapped as `knn_vector`, but only exact k-NN search is supported.

If you plan to run ANN search on dynamically mapped vector fields, set `index.knn` to `true` when you create the index. You cannot enable ANN search on an existing index. To use ANN search, reindex your data into a new index created with `index.knn: true`.
{: .warning}

### Dynamic templates

You can reference `knn_vector` as the `match_mapping_type` in a [dynamic template]({{site.url}}{{site.baseurl}}/mappings/#dynamic-mapping). When OpenSearch first encounters a matching field, it maps the field as a `knn_vector` using the mapping block you provide:

```json
PUT /knn-dyn-template
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "dynamic_templates": [
      {
        "vectors": {
          "match_mapping_type": "knn_vector",
          "mapping": {
            "type": "knn_vector"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

This template specifies no match criteria, so it applies to every unmapped field in the index, not only to vector fields. If a field's value is not an array of numbers, OpenSearch cannot infer a dimension for it and rejects the document with a `Dimension value missing` error. To limit a template to your vector fields, add a `match`, `match_pattern`, or `path_match` criterion, such as `"match": "*_vector"`.
{: .warning}

Until a matching field is indexed, the mapping contains only the dynamic template and no `properties` object. Index a document containing an 8-dimensional vector:

```json
POST /knn-dyn-template/_doc/1?refresh=true
{
  "vec_tmpl": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
}
```
{% include copy-curl.html %}

Retrieve the mapping to confirm that `vec_tmpl` was mapped as a `knn_vector` with a dimension of 8:

```json
GET /knn-dyn-template/_mapping
```
{% include copy-curl.html %}

The response now includes the `vec_tmpl` field:

```json
{
  "knn-dyn-template": {
    "mappings": {
      "dynamic_templates": [
        {
          "vectors": {
            "match_mapping_type": "knn_vector",
            "mapping": {
              "type": "knn_vector"
            }
          }
        }
      ],
      "properties": {
        "vec_tmpl": {
          "type": "knn_vector",
          "dimension": 8
        }
      }
    }
  }
}
```

You can specify any `knn_vector` parameters (such as `dimension`, `space_type`, `method`, or `model_id`) in the `mapping` block. If you specify `dimension` or a `model_id` that supplies the dimension, OpenSearch uses that value. If you omit both, OpenSearch infers the dimension from the length of the first indexed vector.

Because `match_mapping_type: "knn_vector"` already implies the field type, `type: knn_vector` is optional inside the `mapping` block and is injected automatically if you omit it. For example, the following template is equivalent to the `dynamic_templates` block shown previously:

```json
"dynamic_templates": [
  {
    "vectors": {
      "match_mapping_type": "knn_vector",
      "mapping": {}
    }
  }
]
```
{% include copy.html %}

Because the template establishes the field type, the array-length heuristic used by auto-inference (described in the following section) does not apply. Any flat numeric array that matches the template is mapped as a `knn_vector`, regardless of its length.

### Auto-inference

When no dynamic template matches, OpenSearch can still infer a `knn_vector` mapping from the field value. An unmapped field is mapped as a `knn_vector` when its value is a flat array of numbers whose length is a multiple of 8 and falls within the range from 128 to the maximum dimension supported by the default k-NN engine (16,000 for Faiss). This bound is applied at inference time regardless of which engine the field ultimately uses. The dimension is set to the array length. An array whose length falls outside this range or is not a multiple of 8 is mapped as a numeric array.

Auto-inference specifies only `type` and `dimension`. All remaining parameters take their default values: the `faiss` engine, the `hnsw` method, the `l2` space type, and the `float` data type.

For example, create an index with no mapping for `embedding` and no dynamic template. Because auto-inference does not enable ANN search, set `index.knn` to `true` if you plan to run ANN search on the inferred field:

```json
PUT /knn-auto-infer
{
  "settings": {
    "index": {
      "knn": true
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing a 768-dimensional vector. The array is truncated in this example:

```json
POST /knn-auto-infer/_doc/1?refresh=true
{
  "embedding": [0.1, 0.2, 0.3, ..., 0.9]
}
```

Retrieve the mapping to confirm that `embedding` was mapped as a `knn_vector` with a dimension of 768:

```json
GET /knn-auto-infer/_mapping
```
{% include copy-curl.html %}

The response contains the inferred field:

```json
{
  "knn-auto-infer": {
    "mappings": {
      "properties": {
        "embedding": {
          "type": "knn_vector",
          "dimension": 768
        }
      }
    }
  }
}
```

Auto-inference is a shape-based heuristic, so a numeric array that is not a vector (for example, a large list of IDs or measurements) may be mapped as a `knn_vector` if its length happens to meet these conditions. Because the dimension is fixed after the first document, later documents whose array has a different length are rejected. To prevent a field from being auto-inferred as a `knn_vector`, declare an explicit mapping for it or use a dynamic template that maps the field to a different type.

### Limitations

Auto-inference and dynamic templates apply only to individual `knn_vector` fields; they never create a [`nested`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) parent. If you index an array of objects into an unmapped field (for example, per-chunk embeddings), the document is rejected because the inner vector array cannot be flattened into a single `knn_vector` value under a plain `object` parent:

```json
{
  "chunks": [
    { "my_vector": [0.1, 0.2, ...], "text": "..." },
    { "my_vector": [0.3, 0.4, ...], "text": "..." }
  ]
}
```

To search the vectors in individual nested objects, declare the parent field explicitly as `type: nested` when you create the index. Dynamic mapping still maps the inner `knn_vector` fields under a `nested` parent. For example, create the index with `chunks` declared as `nested`:

```json
PUT /knn-nested-dyn
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "chunks": { "type": "nested" }
    }
  }
}
```
{% include copy-curl.html %}

Index a document whose inner `embedding` field is a flat numeric array that meets the [auto-inference](#auto-inference) requirements. The arrays are truncated in this example:

```json
POST /knn-nested-dyn/_doc/1?refresh=true
{
  "chunks": [
    { "embedding": [0.1, 0.1, ..., 0.1] },
    { "embedding": [0.2, 0.2, ..., 0.2] }
  ]
}
```

Retrieve the mapping to confirm how `chunks.embedding` was mapped:

```json
GET /knn-nested-dyn/_mapping
```
{% include copy-curl.html %}

The response confirms that `chunks` remains `nested` and that `chunks.embedding` was mapped as a `knn_vector`:

```json
{
  "knn-nested-dyn": {
    "mappings": {
      "properties": {
        "chunks": {
          "type": "nested",
          "properties": {
            "embedding": {
              "type": "knn_vector",
              "dimension": 128
            }
          }
        }
      }
    }
  }
}
```

## Next steps

- [Spaces]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-spaces/)
- [Methods and engines]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/)
- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/)
- [Vector search]({{site.url}}{{site.baseurl}}/vector-search/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)