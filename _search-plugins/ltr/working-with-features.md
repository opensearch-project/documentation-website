---
layout: default
title: Working with features
nav_order: 30
parent: Learning to Rank
has_children: false
---

# Working with features

[Core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/) and [Fits in]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) discuss the main roles and high-level functionality of the OpenSearch LTR plugin. The following sections cover the specific functionality the plugin provides to help you build and upload features for your learning to rank (LTR) system.

## Understanding features in OpenSearch LTR

In the OpenSearch LTR plugin, a feature is an OpenSearch query. When you execute an OpenSearch query using your search terms and other relevant parameters, the resulting score is the value you can use as part of your training data. For example, a feature may include basic `match` queries on fields such as the document title:  

```json
{
    "query": {
        "match": {
            "title": "{% raw %}{{keywords}}{% endraw %}"
        }
    }
}
```
{% include copy-curl.html %}

In addition to simple query-based features, you can also use document properties, such as popularity, as features. For example, you can use a function score query to access the average using rating of a movie: 

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
{% include copy-curl.html %}

Another example is a query based on the location, such as a geo-distance filter:

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
{% include copy-curl.html %}

These types of queries, which you might develop manually to improve search relevance, are the building blocks that the ranking `f` function you are training will combine these queries mathematically to arrive at a relevance score. 

## Using Mustache templates in OpenSearch LTR queries

The features in OpenSearch LTR use Mustache templates. This allows you to insert variables in to your search queries. For example, you could have a query that uses the `{% raw %}{{keywords}}{% endraw %}` to insert your search terms. Or you could use `{% raw %}{{users_lat}}{% endraw %}` and `{% raw %}{{users_lon}}{% endraw %}` to include the location. This gives you the flexibility to personalize your search experience. 

## Uploading and naming features

OpenSearch LTR gives you an interface for creating and manipulating features. After you define your features, you can log them fo use in training a model. By combining the logged feature data with your judgment list, you can train a model. Once the model is ready, you can upload it to OpenSearch LTR, and it will be applied to search queries.

## Initializing the default feature store

The OpenSearch LTR pluing uses a *feature store* to store metadata about your features and models. Typically, you will have one feature store per major search implementation, for example, [wikipedia](http://wikipedia.org) compared to [wikitravel](http://wikitravel.org).

For most uses cases, you can use the default feature store and not worry about managing multiple feature stores. To initialize this default feature store, run the following request:

```
PUT _ltr
```
{% include copy-curl.html %}

If you need to start fresh, you can delete the default feature store by using the following operation:

```
DELETE _ltr
```
{% include copy-curl.html %}

Deleting the feature store will remove all your existing feature and model data.
{: .warning}

The default feature store is used throughout the rest of this guide.

## Working with features and feature sets

A *feature set* is a collection of features that has been grouped together. You can use feature sets to log multiple feature values for offline training. When creating a new model, you will copy the relevant feature set into the model definition. 

## Creating feature sets

To create a feature set, you can send a POST request. When creating the feature set, you will provide a name and an optional list of features. A example POST request is shown as follows:

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
{% include copy-curl.html %}

## Managing feature sets

To fetch a specific feature set, you can use the following request:

```
GET _ltr/_featureset/more_movie_features
```
{% include copy-curl.html %}

To see a list of all your defined feature sets, you can use the following request: 

```
GET _ltr/_featureset
```
{% include copy-curl.html %}

If you have many feature sets, you can filter the list by using a prefix:

```
GET _ltr/_featureset?prefix=mor
```
{% include copy-curl.html %}

This will return only the feature sets whose names start with `mor`.

If you need to start over with a feature set, you can delete it using the following request:

```
DELETE _ltr/_featureset/more_movie_features
```
{% include copy-curl.html %}

## Validating features

When adding new features, you should validate that the features work as expected. You can do this by adding a `"validation"` block in your feature creation request. This allows OpenSearch LTR to run the query before adding the feature, catching any issues early. If you do not run this validation, you may not discover until later that the query, while valid JSON, contains a malformed OpenSearch query.

To run validation, you can specify the test parameters and the index to use, as shown in the following example validation block:

```json
"validation": {
    "params": {
        "keywords": "rambo"
    },
    "index": "tmdb"
},
```
{% include copy-curl.html %}

Place the validation block alongside your feature set definition. In the following example, the `match` query is malformed, so the validation will fail and return an error:

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
{% include copy-curl.html %}

## Expanding feature sets

You may not know upfront which features will be most useful. In those cases, you can add new features to an existing feature set later for the purposes of logging and model evaluation. For example, if you want to create a `user_rating` feature, you can use the Feature Set Append API, as shown in the following example request:

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
{% include copy-curl.html %}

## Enforcing unique feature names

OpenSearch LTR enforces unique names for each feature. This is because some model training libraries refer to features by name. In the preceding example, you could not add a new `user_ratin` feature without creating an error because that feature name is already in use.

## Treating feature sets as lists

In OpenSearch LTR, feature sets are more like ordered lists than simple sets. Each feature has both a name and an ordinal position. Some LTR training applications, such as RankLib, refer to features by their ordinal position (for example, the 1st feature, the 2nd feature). Other may prefer to use the feature name. When working with logged features, you may need to handle both the ordinal and the name, as the ordinal is preserved to maintain the list order. 

## Next steps

Learn about [Feature engineering]({{site.url}}{{site.baseurl}}/search-plugins/ltr/feature-engineering/), as it can be a complex part of OpenSearch LTR.

Additional advanced features, such as those derived from other features, are described in [Advanced functionality]({{site.url}}{{site.baseurl}}/search-plugins/ltr/advanced-functionality/).
