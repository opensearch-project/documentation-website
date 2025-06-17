---
layout: default
title: Neural
parent: Specialized queries
nav_order: 50
---

# Neural query

Use the `neural` query for vector field search by text or image in [vector search]({{site.url}}{{site.baseurl}}/vector-search/). 

## Request body fields

Include the following request fields in the `neural` query:

```json
"neural": {
  "<vector_field>": {
    "query_text": "<query_text>",
    "query_image": "<image_binary>",
    "model_id": "<model_id>",
    "k": 100
  }
}
```

The top-level `vector_field` specifies the vector or semantic field against which to run a search query. The following table lists the other neural query fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- 
`query_text` | String | Optional | The query text from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`query_image` | String | Optional | A base-64 encoded string that corresponds to the query image from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`model_id` | String | Optional if the target field is a semantic field. Required if the target field is a `knn_vector` field and the default model ID is not set. For more information, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/#setting-a-default-model-on-an-index-or-field). | The ID of the model that will be used to generate vector embeddings from the query text. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/). Cannot be provided together with the `semantic_field_search_analyzer`. 
`k` | Integer | Optional | The number of results returned by the k-NN search. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. If a variable is not specified, the default is `k` with a value of `10`.
`min_score` | Float | Optional | The minimum score threshold for the search results. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).
`max_distance` | Float | Optional | The maximum distance threshold for the search results. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. For more information, see [Radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).
`filter` | Object | Optional | A query that can be used to reduce the number of documents considered. For more information about filter usage, see [Vector search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).
`method_parameters` | Object | Optional | Additional parameters for fine-tuning the search:<br>- `ef_search` (Integer): The number of vectors to examine (for the `hnsw` method)<br>- `nprobes` (Integer): The number of buckets to examine (for the `ivf` method). For more information, see [Specifying method parameters in the query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/index/#specifying-method-parameters-in-the-query).
`rescore` | Object or Boolean | Optional | Parameters for configuring rescoring functionality:<br>- `oversample_factor` (Float): Controls how many candidate vectors are retrieved before rescoring. Valid values are in the `[1.0, 100.0]` range. Default is `false` for fields with `in_memory` mode (no rescoring) and `enabled` (with dynamic values) for fields with `on_disk` mode. In `on_disk` mode, the default `oversample_factor` is determined by the `compression_level`. For more information, see the [compression level table]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized/#rescoring-quantized-results-to-full-precision). To explicitly enable rescoring with the default `oversample_factor` of `1.0`, set `rescore` to `true`. For more information, see [Rescoring results]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/index/#rescoring-results).
`expand_nested_docs` | Boolean | Optional | When `true`, retrieves scores for all nested field documents within each parent document. Used with nested queries. For more information, see [Vector search with nested fields]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/nested-search-knn/).
`semantic_field_search_analyzer` | String | Optional | Specifies an analyzer for tokenizing the `query_text` when using a sparse encoding model. Valid values are `standard`, `bert-uncased`, and `mbert-uncased`. Cannot be used together with `model_id`. For more information, see [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/).
`query_tokens` | Map of token (string) to weight (float) | Optional | A raw sparse vector in the form of tokens and their weights. Used as an alternative to `query_text` for direct vector input. Either `query_text` or `query_tokens` must be specified.

#### Example request

The following example shows a search with a `k` value of `100` and a filter that includes a range query and a term query:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "query_image": "iVBORw0KGgoAAAAN...",
        "k": 100,
        "filter": {
          "bool": {
            "must": [
              {
                "range": {
                  "rating": {
                    "gte": 8,
                    "lte": 10
                  }
                }
              },
              {
                "term": {
                  "parking": "true"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following search query includes a k-NN radial search `min_score` of `0.95` and a filter that includes a range query and a term query:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "query_image": "iVBORw0KGgoAAAAN...",
        "min_score": 0.95,
        "filter": {
          "bool": {
            "must": [
              {
                "range": {
                  "rating": {
                    "gte": 8,
                    "lte": 10
                  }
                }
              },
              {
                "term": {
                  "parking": "true"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following search query includes a k-NN radial search `max_distance` of `10` and a filter that includes a range query and a term query:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "query_image": "iVBORw0KGgoAAAAN...",
        "max_distance": 10,
        "filter": {
          "bool": {
            "must": [
              {
                "range": {
                  "rating": {
                    "gte": 8,
                    "lte": 10
                  }
                }
              },
              {
                "term": {
                  "parking": "true"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following example shows a search against a `semantic` field using a dense model. A `semantic` field stores model information in its configuration. The `neural` query automatically retrieves the `model_id` from the `semantic` field's configuration in the index mapping and rewrites the query to target the corresponding embedding field:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage": {
        "query_text": "Hi world"
        "k": 100
      }
    }
  }
}
```
{% include copy-curl.html %}

The following example shows a search against a `semantic` field using a sparse encoding model. This search uses sparse embeddings:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage": {
        "query_tokens": {
          "worlds": 0.57605183
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information, see [Semantic field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/semantic/).