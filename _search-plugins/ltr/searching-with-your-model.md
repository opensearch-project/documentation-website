---
layout: default
title: Optimizing search with LTR
nav_order: 70
parent: LTR search
has_children: false
---

# Optimizing search with LTR

After you have trained a model, you can use the `sltr` query to execute it. However, directly running the query on the entire index is not recommended because it can be CPU-intensive and impact your OpenSearch cluster's performance. The query allows you to apply your trained model to search results, for example, as shown in the following example query:

```json
    POST tmdb/_search
    {
        "query": {
            "sltr": {
                    "params": {
                        "keywords": "rambo"
                    },
                    "model": "my_model"
                }
        }
    }
```
{% include copy-curl.html %}

## Rescoring top N

To execute your model more efficiently, you can use the built-in [rescore functionality]((https://www.elastic.co/guide/en/OpenSearch/reference/current/search-request-rescore.html). This allows you to apply your model to the top N results of a baseline relevance query, for example, as shown in the following example query:

```json
    POST tmdb/_search
    {
        "query": {
            "match": {
                "_all": "rambo"
            }
        },
        "rescore": {
            "window_size": 1000,
            "query": {
                "rescore_query": {
                    "sltr": {
                        "params": {
                            "keywords": "rambo"
                        },
                        "model": "my_model"
                    }
                }
            }
        }
    }
```
{% include copy-curl.html %}

In this example, a `match` is first executed for the term `rambo` and then `my_model` is applied to the top 1,000 results. This baseline query is used to generate an initial set of results, which are then scored using the OpenSearch default similarity (BM25).

## Rescoring on a subset of features

You can selectively score a subset of features by specifying the `active_features` in the `sltr` query, as shown in the following example query. This allows you to focus the model's scoring on the selected features, while any unspecified features will be marked as missing. You only need to specify the `params` relevant to the `active_features`. If you request a feature name that is not a part of the feature set assigned, the query throws an error.

```json
    POST tmdb/_search
    {
        "query": {
            "match": {
                "_all": "rambo"
            }
        },
        "rescore": {
            "window_size": 1000,
            "query": {
                "rescore_query": {
                    "sltr": {
                        "params": {
                            "keywords": "rambo"
                        },
                        "model": "my_model",
                        "active_features": ["title_query"]
                    }
                }
            }
        }
    }
```
{% include copy-curl.html %}

In this example, the `my_model` model is applied, but only scores the `title_query` feature. 

## Combining `sltr` with other OpenSearch features

One of the key advantages of the `sltr` query provided by the Learning to Rank plugin is its ability to be integrated with other OpenSearch features and functionalities, such as the following. This allows you to create more sophisticated and tailored search solutions that go beyond applying a model to your results.

-   Filtering out results based on business rules using OpenSearch filters before applying the model
-   Chaining multiple rescores to refine the relevance of your results
-   Rescoring once for relevance with `sltr`, and a second time for business concerns
-   Downboosting "bad" but relevant content in the baseline query to force it out of the rescore window
