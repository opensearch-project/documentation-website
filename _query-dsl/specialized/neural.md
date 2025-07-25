---
layout: default
title: Neural
parent: Specialized queries
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/query-dsl/specialized/neural/
---

# Neural query

Use the `neural` query for vector field search in [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/). 

## Request fields

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

The top-level `vector_field` specifies the vector field against which to run a search query. The following table lists the other neural query fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- 
`query_text` | String | Optional | The query text from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`query_image` | String | Optional | A base-64 encoded string that corresponds to the query image from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`model_id` | String | Required if the default model ID is not set. For more information, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/#setting-a-default-model-on-an-index-or-field). | The ID of the model that will be used to generate vector embeddings from the query text. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/).
`k` | Integer | Optional | The number of results returned by the k-NN search. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. If a variable is not specified, the default is `k` with a value of `10`.
`min_score` | Float | Optional | The minimum score threshold for the search results. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. For more information, see [k-NN radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).
`max_distance` | Float | Optional | The maximum distance threshold for the search results. Only one variable, either `k`, `min_score`, or `max_distance`, can be specified. For more information, see [k-NN radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/).
`filter` | Object | Optional | A query that can be used to reduce the number of documents considered. For more information about filter usage, see [k-NN search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/). **Important**: Filter can only be used with the `faiss` or `lucene` engines.

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
