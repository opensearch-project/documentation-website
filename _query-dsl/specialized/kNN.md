---
layout: default
title: k-NN
parent: Specialized queries
nav_order: 10
---

# k-NN query

Use the `knn` query for searching fields containing raw vectors in [vector search]({{site.url}}{{site.baseurl}}/vector-search/). 

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
`vector` | Array of floats | Required | The query vector to use for vector search.
`k` | Integer | Optional | The number of nearest neighbors to return. Required if `max_distance` or `min_score` is not specified.
`max_distance` | Float | Optional | The maximum distance threshold for search results. Only one of `k`, `max_distance`, or `min_score` can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/).
`min_score` | Float | Optional | The minimum score threshold for search results. Only one of `k`, `max_distance`, or `min_score` can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/radial-search-knn/).
`filter` | Object | Optional | A filter to apply to the k-NN search. For more information, see [Vector search with filters]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/filter-search-knn/). **Important**: Filter can only be used with the `faiss` or `lucene` engines.
`method_parameters` | Object | Optional | Additional parameters for fine-tuning the search:<br>- `ef_search` (Integer): The number of vectors to examine (for `hnsw` method)<br>- `nprobes` (Integer): The number of buckets to examine (for `ivf` method). For more information, see [Specifying method parameters in the query](#specifying-method-parameters-in-the-query).
`rescore` | Object or Boolean | Optional | Parameters for configuring rescoring functionality:<br>- `oversample_factor` (Float): Controls the oversampling of candidate vectors before ranking. Valid values are in the `[1.0, 100.0]` range. Default is `1.0` (no rescoring). To use the default `oversample_factor` of `1.0`, set `rescore` to `true`. For more information, see [Rescoring results](#rescoring-results).
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

## Rescoring quantized results to full precision

[Disk-based search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/) uses [vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/) in order to reduce memory usage by compressing vectors, but this compression can impact search accuracy. To improve recall while maintaining the memory savings of quantization, you can use a two-phase search approach. In the first phase, `oversample_factor * k` results are retrieved from an index using quantized vectors and the scores are approximated. In the second phase, the full-precision vectors of those `oversample_factor * k` results are loaded into memory from disk, and scores are recomputed against the full-precision query vector. The results are then reduced to the top k.

The default rescoring behavior is determined by the `mode` and `compression_level` of the backing k-NN vector field:

- For `in_memory` mode, no rescoring is applied by default.
- For `on_disk` mode, default rescoring is based on the configured `compression_level`. Each `compression_level` provides a default `oversample_factor`, specified in the following table.

| Compression level | Default rescore `oversample_factor` |
|:------------------|:----------------------------------|
| `32x` (default)   | 3.0                               |
| `16x`             | 2.0                               |
| `8x`              | 2.0                               |
| `4x`              | No default rescoring             |
| `2x`              | No default rescoring             |

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

Rescoring is only supported for the `faiss` engine.

Rescoring is not needed if quantization is not used because the scores returned are already fully precise.
{: .note}
