---
layout: default
title: k-NN
parent: Specialized queries
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/query-dsl/specialized/k-nn/
---

# k-NN query

Use the `knn` query for running nearest neighbor searches on vector fields. 

## Request body fields

Provide a vector field in the `knn` query and specify additional request fields in the vector field object:

```json
"knn": {
  "<vector_field>": {
    "vector": [<vector_values>],
    "k": <k_value>,
    ...
  }
}
```

The top-level `vector_field` specifies the vector field against which to run a search query. The following table lists all supported request fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`vector` | Array of floats or bytes | Required | The query vector to use for vector search. The data type of the vector elements must match the data type of vectors indexed in the [`knn_vector` field]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) searched.
`k` | Integer | Optional | The number of nearest neighbors to return. Valid values are in the [1, 10,000] range. Required if either `max_distance` or `min_score` is not specified.
`max_distance` | Float | Optional | The maximum distance threshold for search results. Only one of `k`, `max_distance`, or `min_score` can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/).
`min_score` | Float | Optional | The minimum score threshold for search results. Only one of `k`, `max_distance`, or `min_score` can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/).
`filter` | Object | Optional | A filter to apply to the k-NN search. For more information, see [Vector search with filters]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/). **Important**: A filter can only be used with the `faiss` or `lucene` engines.
`method_parameters` | Object | Optional | Additional parameters for fine-tuning the search:<br>- `ef_search` (Integer): The number of vectors to examine (for the `hnsw` method)<br>- `nprobes` (Integer): The number of buckets to examine (for the `ivf` method). For more information, see [Specifying method parameters in the query](#specifying-method-parameters-in-the-query).
`rescore` | Object or Boolean | Optional | Parameters for configuring rescoring functionality:<br>- `oversample_factor` (Float): Controls how many candidate vectors are retrieved before rescoring. Valid values are in the `[1.0, 100.0]` range. Default is `false` for fields with `in_memory` mode (no rescoring) and enabled (with dynamic values) for fields with `on_disk` mode. In `on_disk` mode, the default `oversample_factor` is determined by the `compression_level`. For more information, see the [compression level table]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized/#rescoring-quantized-results-to-full-precision). To explicitly enable rescoring with the default `oversample_factor` of `1.0`, set `rescore` to `true`. For more information, see [Rescoring results](#rescoring-results).
`expand_nested_docs` | Boolean | Optional | When `true`, retrieves scores for all nested field documents within each parent document. Used with nested queries. For more information, see [Vector search with nested fields]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/nested-search-knn/).

## Example request

```json
GET /my-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [1.5, 2.5],
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example request: Nested fields

```json
GET /my-vector-index/_search
{
  "_source": false,
  "query": {
    "nested": {
      "path": "nested_field",
      "query": {
        "knn": {
          "nested_field.my_vector": {
            "vector": [1,1,1],
            "k": 2,
            "expand_nested_docs": true
          }
        }
      },
      "inner_hits": {
        "_source": false,
        "fields":["nested_field.color"]
      },
      "score_mode": "max"
    }
  }
}
```
{% include copy-curl.html %}

## Example request: Radial search with max_distance

The following example shows a radial search performed with `max_distance`:

```json
GET /my-vector-index/_search
{
    "query": {
        "knn": {
            "my_vector": {
                "vector": [
                    7.1,
                    8.3
                ],
                "max_distance": 2
            }
        }
    }
}
```
{% include copy-curl.html %}


## Example request: Radial search with min_score

The following example shows a radial search performed with `min_score`:

```json
GET /my-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector": {
        "vector": [7.1, 8.3],
        "min_score": 0.95
      }
    }
  }
}
```
{% include copy-curl.html %}

## Specifying method parameters in the query

Starting with version 2.16, you can provide `method_parameters` in a search request:

```json
GET /my-vector-index/_search
{
  "size": 2,
  "query": {
    "knn": {
      "target-field": {
        "vector": [2, 3, 5, 6],
        "k": 2,
        "method_parameters" : {
          "ef_search": 100
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

These parameters are dependent on the combination of engine and method used to create the index. The following sections provide information about the supported `method_parameters`.

### ef_search

You can provide the `ef_search` parameter when searching an index created using the `hnsw` method. The `ef_search` parameter specifies the number of vectors to examine in order to find the top k nearest neighbors. Higher `ef_search` values improve recall at the cost of increased search latency. The value must be positive.

The following table provides information about the `ef_search` parameter for the supported engines.

Engine | Radial query support | Notes
:--- | :--- | :---
`nmslib` (Deprecated) | No | If `ef_search` is present in a query, it overrides the `index.knn.algo_param.ef_search` index setting.
`faiss` | Yes | If `ef_search` is present in a query, it overrides the `index.knn.algo_param.ef_search` index setting.
`lucene` | No | When creating a search query, you must specify `k`. If you provide both `k` and `ef_search`, then the larger value is passed to the engine. If `ef_search` is larger than `k`, you can provide the `size` parameter to limit the final number of results to `k`. 

<!-- vale off -->
### nprobes
<!-- vale on -->

You can provide the `nprobes` parameter when searching an index created using the `ivf` method. The `nprobes` parameter specifies the number of buckets to examine in order to find the top k nearest neighbors. Higher `nprobes` values improve recall at the cost of increased search latency. The value must be positive.

The following table provides information about the `nprobes` parameter for the supported engines.

Engine | Notes
:--- | :--- 
`faiss` | If `nprobes` is present in a query, it overrides the value provided when creating the index.

## Rescoring results

You can fine-tune search by providing the `ef_search` and `oversample_factor` parameters.

The `oversample_factor` parameter controls the factor by which the search oversamples the candidate vectors before ranking them. Using a higher oversample factor means that more candidates will be considered before ranking, improving accuracy but also increasing search time. When selecting the `oversample_factor` value, consider the trade-off between accuracy and efficiency. For example, setting the `oversample_factor` to `2.0` will double the number of candidates considered during the ranking phase, which may help achieve better results. 

The following request specifies the `ef_search` and `oversample_factor` parameters:

```json
GET /my-vector-index/_search
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

## Next steps

- [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)
- [Rescoring quantized results to full precision]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized/#rescoring-quantized-results-to-full-precision)