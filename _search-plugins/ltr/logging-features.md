---
layout: default
title: Logging Feature Scores
nav_order: 50
parent: LTR search
has_children: false
---

# Logging Feature Scores

To train a model, you need to log feature values. This is a major
component of the learning to rank plugin: as users search, we log
feature values from our feature sets so we can then train. Then we can
discover models that work well to predict relevance with that set of
features.

## Sltr Query

The `sltr` query is the primary way features are run and models are
evaluated. When logging, we'll just use an `sltr` query for executing
every feature-query to retrieve the scores of features.

For the sake of discussing logging, let's say we created a feature set
like so that works with the TMDB data set from the
[demo](http://github.com/opensearch-project/opensearch-learning-to-rank-base/tree/main/demo/):

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

Next, let's see how to log this feature set in a couple common use
cases.

## Joining feature values with a judgement list

Let’s assume, in the simplest case, we have a judgement list already. 
We simply want to join feature values for each keyword/document pair to form a complete training set. 
For example, assume we have experts in our company, and they’ve arrived at this judgement list:

```
grade,keywords,docId
4,rambo,7555
3,rambo,1370
3,rambo,1369
4,rocky,4241
```

We want to get feature values for all documents that have judgement for each search term, one search term at a time.
If we start with “rambo”, we can create a filter for the ids associated with the “rambo” search:

```json
{
    "filter": [
        {"terms": {
                "_id": ["7555", "1370", "1369"]
        }}
    ]
}
```

We also need to point OpenSearch LTR at the features to log. 
To do this we use the sltr OpenSearch query, included with OpenSearch LTR. 
We construct this query such that it:

  - Has a `_name` (the OpenSearch named queries feature) to refer to it
  - Refers to the featureset we created above `more_movie_features`
  - Passes our search keywords "rambo" and whatever other parameters our features need

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

In [searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/) you'll see us use *sltr* for executing a model. 
Here we're just using it as a hook to point OpenSearch LTR at the feature set we want to log.
{: .note}    

You might be thinking, wait if we inject `sltr` query into the OpenSearch query, won’t it influence the score? 
The sneaky trick is to inject it as a filter. 
As a filter that doesn’t actually filter anything, but injects our feature-logging only `sltr` query into our OpenSearch query:

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

Running this, you’ll see the three hits you’d expect. The next step is to turn on feature logging, referring to the `sltr` query we want to log.

This is what the logging extension gives you. It finds an OpenSearch _sltr_ query, runs the feature set’s queries, scores each document, then returns those as computed fields on each document:

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


This log extension comes with several arguments:
  - `name`: The name of this log entry to fetch from each document
  - `named_query` the named query which corresponds to an *sltr* query
  - `rescore_index`: if `sltr` is in a rescore phase, this is the index of the query in the rescore list
  - `missing_as_zero`: produce a 0 for missing features (when the feature does not match) (defaults to \`false\`)
  
Either `named_query` or `rescore_index` must be set so that logging can locate an *sltr* query for logging either in the normal query phase or during rescoring.
{: .note}



Finally the full request:

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

And now each document contains a log entry:

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

Now you can join your judgement list with feature values to produce a training set! For the line that corresponds to document 1370 for keywords “Rambo” we can now add:

```
> 4 qid:1 1:9.510193 2:10.7808075
```

Rinse and repeat for all your queries.

For large judgement lists, batch up logging for multiple queries,
use OpenSearch’s [multi search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/) capabilities.
{: .note}

## Logging values for a live feature set

Let's say you're running in production with a model being executed in
an `sltr` query. We'll get more into model execution in
[searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/). But for our
purposes, a sneak peak, a live model might look something like:

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

Simply applying the correct logging spec to refer to the `sltr` query
does the trick to let us log feature values for our query:

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

This will log features to the OpenSearch response, giving you an
ability to retrain a model with the same featureset later.

## Modifying an existing feature set and logging

Feature sets can be appended to. As mentioned in
[Working with Features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/building-features/), you saw if you want
to incorporate a new feature, such as `user_rating`, we can append that
query to our featureset `more_movie_features`:

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

Then finally, when we log as the examples above, we\'ll have our new
feature in our output:

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

## Logging values for a proposed feature set

You might create a completely new feature set for experimental purposes.
For example, let's say you create a brand new feature set,
`other_movie_features`:

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

We can log *other_movie_features* alongside a live
production *more_movie_features* by simply appending it as
another filter, just like the first example above:

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

Continue with as many feature sets as you care to log!

## \'Logging\' serves multiple purposes

With the tour done, it's worth point out real-life feature logging
scenarios to think through.

First, you might develop judgement lists from user analytics. You want to
have the exact value of a feature at the precise time a user interaction
happened. If they clicked, you want to know the recency, title score,
and every other value at that exact moment. This way you can study later
what correlated with relevance when training. To do this, you may build
a large comprehensive feature set for later experimentation.

Second, you may simply want to keep your models up to date with a
shifting index. Trends come and go, and models lose their effectiveness.
You may have A/B testing in place, or monitoring business metrics, and
you notice gradual degredation in model performance. In these cases,
"logging" is used to retrain a model you're already relatively
confident in.

Third, there's the "logging" that happens in model development. You
may have a judgement list, but want to iterate heavily with a local copy
of OpenSearch. You're heavily experimenting with new features,
scrapping and adding to feature sets. You of course are a bit out of
sync with the live index, but you do your best to keep up. Once you've
arrived at a set of model parameters that you're happy with, you can
train with production data and confirm the performance is still
satisfactory.

Next up, let's briefly talk about training a model in
[Uploading A Trained Model]({{site.url}}{{site.baseurl}}/search-plugins/ltr/training-models/) in tools outside
OpenSearch LTR.
