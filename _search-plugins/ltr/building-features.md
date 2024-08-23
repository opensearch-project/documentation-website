---
layout: default
title: Working with Features
nav_order: 30
parent: LTR search
has_children: false
---

# Working with Features

In [core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/), we mentioned the main
roles you undertake building a learning to rank system. In
[fits in]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) we discussed at a high level
what this plugin does to help you use OpenSearch as a learning to
rank system.

This section covers the functionality built into the OpenSearch LTR
plugin to build & upload features with the plugin.

## What is a feature in OpenSearch LTR

OpenSearch LTR features correspond to OpenSearch queries. The
score of an OpenSearch query, when run using the user's search terms
(and other parameters), are the values you use in your training set.

Obvious features might include traditional search queries, like a simple
"match" query on title:

```json
{
    "query": {
        "match": {
            "title": "{% raw %}{{keywords}}{% endraw %}"
        }
    }
}
```

Of course, properties of documents such as popularity can also be a
feature. Function score queries can help access these values. For
example, to access the average user rating of a movie:

```json
{
    "query": {
        "function_score": {
            "functions": {
                "field": "vote_average"
            },
            "query": {
                "match_all": {}
            }
        }
    }
}
```

One could also imagine a query based on the user's location:

```json
{
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_distance" : {
                    "distance" : "200km",
                    "pin.location" : {
                        "lat" : "{% raw %}{{users_lat}}{% endraw %}",
                        "lon" : "{% raw %}{{users_lon}}{% endraw %}"
                    }
                }
            }
        }
    }
}
```

Similar to how you would develop queries like these to manually improve
search relevance, the ranking function `f` you're training also
combines these queries mathematically to arrive at a relevance score.

## Features are Mustache Templated OpenSearch Queries

You'll notice the `{% raw %}{{keywords}}{% endraw %}`, `{% raw %}{{users_lat}}{% endraw %}`, and `{% raw %}{{users_lon}}{% endraw %}`
above. This syntax is the mustache templating system used in other parts of
[OpenSearch]({{site.url}}{{site.baseurl}}/api-reference/search-template/).
This lets you inject various query or user-specific variables into the
search template. Perhaps information about the user for personalization?
Or the location of the searcher's phone?

For now, we'll simply focus on typical keyword searches.

## Uploading and Naming Features

OpenSearch LTR gives you an interface for creating and manipulating
features. Once created, then you can have access to a set of feature for
logging. Logged features when combined with your judgment list, can be
trained into a model. Finally, that model can then be uploaded to
OpenSearch LTR and executed as a search.

Let's look how to work with sets of features.

## Initialize the default feature store

A *feature store* corresponds to an OpenSearch index used to store
metadata about the features and models. Typically, one feature store
corresponds to a major search site/implementation. For example,
[wikipedia](http://wikipedia.org) vs [wikitravel](http://wikitravel.org)

For most use cases, you can simply get by with the single, default
feature store and never think about feature stores ever again. This
needs to be initialized the first time you use OpenSearch Learning to
Rank:

    PUT _ltr

You can restart from scratch by deleting the default feature store:

    DELETE _ltr

(WARNING this will blow everything away, use with caution!)

In the rest of this guide, we'll work with the default feature store.

## Features and feature sets

Feature sets are where the action really happens in OpenSearch LTR.

A *feature set* is a set of features that has been grouped together for
logging & model evaluation. You'll refer to feature sets when you want
to log multiple feature values for offline training. You'll also create
a model from a feature set, copying the feature set into model.

## Create a feature set

You can create a feature set simply by using a POST. To create it, you
give a feature set a name and optionally a list of features:

```json
POST _ltr/_featureset/more_movie_features
{
    "featureset": {
        "features": [
            {
                "name": "title_query",
                "params": [
                    "keywords"
                ],
                "template_language": "mustache",
                "template": {
                    "match": {
                        "title": "{% raw %}{{keywords}}{% endraw %}"
                    }
                }
            },
            {
                "name": "title_query_boost",
                "params": [
                    "some_multiplier"
                ],
                "template_language": "derived_expression",
                "template": "title_query * some_multiplier"
            },
            {
                "name": "custom_title_query_boost",
                "params": [
                    "some_multiplier"
                ],
                "template_language": "script_feature",
                "template": {
                    "lang": "painless",
                    "source": "params.feature_vector.get('title_query') * (long)params.some_multiplier",
                    "params": {
                        "some_multiplier": "some_multiplier"
                    }
                }
            }
        ]
    }
}
```

## Feature set CRUD

Fetching a feature set works as you'd expect:

    GET _ltr/_featureset/more_movie_features

You can list all your feature sets:

    GET _ltr/_featureset

Or filter by prefix in case you have many feature sets:

    GET _ltr/_featureset?prefix=mor

You can also delete a featureset to start over:

    DELETE _ltr/_featureset/more_movie_features

## Validating features

When adding features, we recommend sanity checking that the features
work as expected. Adding a "validation" block to your feature creation
let's OpenSearch LTR run the query before adding it. If you don't
run this validation, you may find out only much later that the query,
while valid JSON, was a malformed OpenSearch query. You can imagine,
batching dozens of features to log, only to have one of them fail in
production can be quite annoying!

To run validation, you simply specify test parameters and a test index
to run:

```json
"validation": {
    "params": {
        "keywords": "rambo"
    },
    "index": "tmdb"
},
```
Place this alongside the feature set. You'll see below we have a
malformed `match` query. The example below should return an error that
validation failed. An indicator you should take a closer look at the
query:

```json
{
    "validation": {
      "params": {
          "keywords": "rambo"
      },
      "index": "tmdb"
    },
    "featureset": {
        "features": [
            {
                "name": "title_query",
                "params": [
                    "keywords"
                ],
                "template_language": "mustache",
                "template": {
                    "match": {
                        "title": "{% raw %}{{keywords}}{% endraw %}"
                    }
                }
            }
        ]
    }
}
```

## Adding to an existing feature set

Of course you may not know upfront what features could be useful. You
may wish to append a new feature later for logging and model evaluation.
For example, creating the *user_rating* feature, we could
create it using the feature set append API, like below:

```json
POST /_ltr/_featureset/my_featureset/_addfeatures
{
    "features": [{
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
    }]
}
```

## Feature Names are Unique

Because some model training libraries refer to features by name,
OpenSearch LTR enforces unique names for each features. In the
example above, we could not add a new *user_rating* feature
without creating an error.

## Feature Sets are Lists

You'll notice we *appended* to the feature set. Feature sets perhaps
ought to be really called "lists". Each feature has an ordinal (its
place in the list) in addition to a name. Some LTR training
applications, such as Ranklib, refer to a feature by ordinal (the
"1st" feature, the "2nd" feature). Others more conveniently refer to
the name. So you may need both/either. You'll see that when features
are logged, they give you a list of features back to preserve the
ordinal.

## But wait there's more

Feature engineering is a complex part of OpenSearch Learning to Rank,
and additional features (such as features that can be derived from other
features) are listed in `advanced-functionality`{.interpreted-text
role="doc"}.

Next-up, we'll talk about some specific use cases you\'ll run into when
`feature-engineering`{.interpreted-text role="doc"}.
