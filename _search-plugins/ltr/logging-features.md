---
layout: default
title: Logging feature scores
nav_order: 50
parent: Learning to Rank
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/ltr/logging-features/
---

# Logging feature scores

Feature values need to be logged in order to train a model. This is a crucial component of the Learning to Rank plugin---as you search, feature values from the feature sets are logged so that they can be used for training. This allows models that effectively predict relevance using that set of features to be discovered.

## `sltr` query

The `sltr` query is the primary method for running features and evaluating models. When logging, an `sltr` query is used to execute each feature query and retrieve the feature scores. A feature set structure that works with the [`hello-ltr`](https://github.com/o19s/hello-ltr) demo schema is shown in the following example request:

```json
PUT _ltr/_featureset/more_movie_features
{
    "name": "more_movie_features",
    "features": [
        {
            "name": "body_query",
            "params": [
                "keywords"
                ],
            "template": {
                "match": {
                    "overview": "{% raw %}{{keywords}}{% endraw %}"
                }
            }
        },
        {
            "name": "title_query",
            "params": [
                "keywords"
            ],
            "template": {
                "match": {
                    "title": "{% raw %}{{keywords}}{% endraw %}"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

## Common use cases

Common use cases for logging feature sets are described in the following sections.

### Joining feature values with a judgment list

If the judgment list is already available, you can join feature values for each keyword/document pair to create a complete training set. For example, consider the following judgment list:

```
grade,keywords,docId
4,rambo,7555
3,rambo,1370
3,rambo,1369
4,rocky,4241
```
{% include copy-curl.html %}

The feature values need to be retrieved for all documents that have a judgment for each search term, one search term at a time. For example, starting with a `rambo` search, a filter can be created for the associated document as follows:

```json
{
    "filter": [
        {"terms": {
                "_id": ["7555", "1370", "1369"]
        }}
    ]
}
```
{% include copy-curl.html %}

The Learning to Rank plugin must point to the features to be logged. The `sltr` query, which is part of the plugin, can be used for this purpose. The `sltr` query has a `_name` (the named queries feature) used to reference it, refers to the previously created feature set `more_movie_features`, and passes the search keyword `rambo` and any other required parameters, as shown in the following example query:

```json
{
    "sltr": {
        "_name": "logged_featureset",
        "featureset": "more_movie_features",
        "params": {
            "keywords": "rambo"
        }
    }
}
```
{% include copy-curl.html %}

[Searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/) provides an `sltr` query to use for executing a model. This `sltr` query is used as a mechanism to direct the Learning to Rank plugin to the feature set requiring logging.
{: .note}    

To avoid influencing the score, the `sltr` query is injected as a filter, as shown in the following example:

```json
{
    "query": {
        "bool": {
            "filter": [
                {
                    "terms": {
                        "_id": [
                            "7555",
                            "1370",
                            "1369"
                        ]
                    }
                },
                {
                    "sltr": {
                        "_name": "logged_featureset",
                        "featureset": "more_movie_features",
                        "params": {
                            "keywords": "rambo"
                        }
                    }
                }
            ]
        }
    }
}
```
{% include copy-curl.html %}

Executing this query returns the three expected hits. The next step is to enable feature logging to refer to the `sltr` query to be logged.

The logging identifies the `sltr` query, runs the feature set's queries, scores each document, and returns those scores as computed fields for each document, as shown in the following example logging structure:

```json
"ext": {
    "ltr_log": {
        "log_specs": {
            "name": "log_entry1",
            "named_query": "logged_featureset"
        }
    }
}
```
{% include copy-curl.html %}

The log extension supports the following arguments:

- `name`: The name of the log entry to fetch from each document.
- `named_query`: The named query that corresponds to an `sltr` query.
- `rescore_index`: If the `sltr` query is in a rescore phase, then this is the index of the query in the rescore list.
- `missing_as_zero`: Produces a `0` for missing features (when the feature does not match). Default is `false`.
  
To enable the log to locate an `sltr` query, either during the normal query phase or during rescoring, either `named_query` or `rescore_index` must be set.
{: .note}

The full example request is as follows:

```json
POST tmdb/_search
{
    "query": {
        "bool": {
            "filter": [
                {
                    "terms": {
                        "_id": ["7555", "1370", "1369"]
                    }
                },
                {
                    "sltr": {
                        "_name": "logged_featureset",
                        "featureset": "more_movie_features",
                        "params": {
                            "keywords": "rambo"
                        }
                }}
            ]
        }
    },
    "ext": {
        "ltr_log": {
            "log_specs": {
                "name": "log_entry1",
                "named_query": "logged_featureset"
            }
        }
    }
}
```
{% include copy-curl.html %}

Each document now contains a log entry, as shown in the following example:

```json
{
    "_index": "tmdb",
    "_type": "movie",
    "_id": "1370",
    "_score": 20.291,
    "_source": {
        ...
    },
    "fields": {
        "_ltrlog": [
            {
                "log_entry1": [
                    {"name": "title_query"
                     "value": 9.510193},
                    {"name": "body_query
                     "value": 10.7808075}
                ]
            }
        ]
    },
    "matched_queries": [
        "logged_featureset"
    ]
}
```
{% include copy-curl.html %}

The judgment list can be joined with the feature values to produce a training set. For the line corresponding to document `1370` with keyword `rambo`, the following can be added:

```
> 4 qid:1 1:9.510193 2:10.7808075
```
{% include copy-curl.html %}

Repeat this process for all of your queries.

For large judgment lists, it is recommended to batch the logs for multiple queries. You can use [multi-search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/) capabilities for this purpose.
{: .note}

### Logging values for a live feature set

If you are running in production with a model being executed within an `sltr` query, a live model may appear similar to the following example request:

```json
POST tmdb/_search
{
    "query": {
        "match": {
            "_all": "rambo"
        }
    },
    "rescore": {
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

See [Searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/) for information about model execution.
{: .note}

To log the feature values for the query, apply the appropriate logging spec to reference the `sltr` query, as shown in the following example: 

```json
"ext": {
    "ltr_log": {
        "log_specs": {
            "name": "log_entry1",
            "rescore_index": 0
        }
    }
}
```
{% include copy-curl.html %}

The example logs the features in the response, enabling future model retraining using the same feature set.

### Modifying and logging an existing feature set

Feature sets can be expanded. For example, as shown in the following example request, if a new feature, such as `user_rating`, needs to be incorporated, it can be added to the existing feature set `more_movie_features`:

``` json
PUT _ltr/_feature/user_rating/_addfeatures
{
    "features": [
        "name": "user_rating",
        "params": [],
        "template_language": "mustache",
        "template" : {
            "function_score": {
                "functions": {
                    "field": "vote_average"
                },
                "query": {
                    "match_all": {}
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

See [Working with features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features/) for more information.
{: .note}

When logging is performed, the new feature is included in the output, as shown in the following example:

``` json
{
    "log_entry1": [
        {
            "name": "title_query",
            "value": 9.510193
        },
        {
            "name": "body_query",
            "value": 10.7808075
        },
        {
            "name": "user_rating",
            "value": 7.8
        }
    ]
}
```
{% include copy-curl.html %}

### Logging values for a proposed feature set

You can create a completely new feature set for experimental purposes, for example, `other_movie_features`, as shown in the following example request:

```json
PUT _ltr/_featureset/other_movie_features
{
    "name": "other_movie_features",
    "features": [
        {
            "name": "cast_query",
            "params": [
                "keywords"
            ],
            "template": {
                "match": {
                    "cast.name": "{% raw %}{{keywords}}{% endraw %}"
                }
            }
        },
        {
            "name": "genre_query",
            "params": [
                "keywords"
            ],
            "template": {
                "match": {
                    "genres.name": "{% raw %}{{keywords}}{% endraw %}"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

The feature set, `other_movie_features`, can be logged alongside the live production set, `more_movie_features`, by appending it as another filter, as shown in the following example request:

```json
POST tmdb/_search
{
"query": {
    "bool": {
        "filter": [
            { "sltr": {
                "_name": "logged_featureset",
                "featureset": "other_movie_features",
                "params": {
                    "keywords": "rambo"
                }
    }},
            {"match": {
                "_all": "rambo"
            }}
        ]
    }
},
"rescore": {
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

You can continue adding as many feature sets as needed for logging.

## Logging scenarios

Once you have covered the basics, you can consider some real-life feature logging scenarios.

First, logging is used to develop judgment lists from user analytics to capture the exact value of a feature at the precise time of interaction. For instance, you may want to know the recency, title score, and other values at the precise time of a user's interaction. This would help you analyze which features or factors had relevance while training. To achieve this, you can build a comprehensive feature set for future experimentation. 

Second, logging can be used to retrain a model in which you already have confidence. You may want to keep your models up to date with a shifting index because models can lose their effectiveness over time. You may have A/B testing in place or be monitoring business metrics and notice gradual degradation in model performance. 

Third, logging is used during model development. You may have a judgment list but want to iterate heavily with a local copy of OpenSearch. This allows for extensive experimentation with new features, adding and removing them from the feature sets as needed. While this process may result in being slightly out of sync with the live index, the goal is to arrive at a set of satisfactory model parameters. Once this is achieved, the model can be trained with production data to confirm that the level of performance remains acceptable.

## Next steps

Learn more about training models in the [Uploading a trained model]({{site.url}}{{site.baseurl}}/search-plugins/ltr/training-models/) documentation.
