---
layout: default
title: Optimizing search with LTR
nav_order: 70
parent: Learning to Rank
has_children: false
---

# Optimizing search with LTR

After you have trained a model, you can use the `sltr` query to execute it. However, directly running the query on the entire index is not recommended because it can be CPU intensive and impact the performance of your OpenSearch cluster. The query allows you to apply your trained model to search results, as shown in the following example:

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

To execute your model more efficiently, you can use the built-in rescore functionality to apply your model to the top N results of a baseline relevance query, as shown in the following example query:

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

A `match` is first executed for the term `rambo` and then `my_model` is applied to the top 1,000 results. This baseline query is used to generate an initial set of results that are then scored using the default similarity BM25 probabilistic ranking framework to calculate relevance scores.

## Rescoring a subset of features

You can selectively score a subset of features by specifying the `active_features` in the `sltr` query, as shown in the following example. This allows you to focus the model's scoring on the selected features, while any unspecified features are marked as missing. You only need to specify the `params` relevant to the `active_features`. If you request a feature name that is not part of the assigned feature set, then the query throws an error.

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

The `my_model` model is applied but only scores the `title_query` feature. 

## Combining `sltr` with other OpenSearch features

The `sltr` query can be integrated with the following OpenSearch features and functionalities to create more sophisticated and tailored search solutions that go beyond applying a model to your results:

-   Filtering out results based on business rules using OpenSearch filters before applying the model
-   Chaining multiple rescores to refine the relevance of your results
-   Rescoring once to address relevance with `sltr` and a second time for business concerns
-   Downboosting relevant but low-quality content in the baseline query to prevent it from being rescored

## Next steps

Learn about [advanced functionality]({{site.url}}{{site.baseurl}}/search-plugins/ltr/advanced-functionality/).
