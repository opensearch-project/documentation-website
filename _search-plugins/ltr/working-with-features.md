---
layout: default
title: Working with features
nav_order: 30
parent: Learning to Rank
has_children: false
---

# Working with features

The following sections describe the specific functionality provided by the Learning to Rank plugin. This information will help you build and upload features for your learning to rank (LTR) system. See [ML ranking core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/) and [Scope of the plugin]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) for more information about the Learning to Rank plugin's roles and functionality. 

## Understanding the role of features in the Learning to Rank plugin

The Learning to Rank plugin defines a _feature_ as an _OpenSearch query_. When you execute an OpenSearch query using your search terms and other relevant parameters, the resulting score is the value that can be used in your training data. For example, a feature may include basic `match` queries on fields such as `title`:  

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

In addition to simple query-based features, you can also use document properties, such as `popularity`, as features. For example, you can use a function score query to get the average movie rating: 

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

Another example is a query based on location, such as a geodistance filter:

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

These types of queries are the building blocks that the ranking `f` function you are training combines mathematically to determine a relevance score.

## Using Mustache templates in LTR queries

The features in LTR queries use Mustache templates. This allows you to insert variables into your search queries. For example, you could have a query that uses `{% raw %}{{keywords}}{% endraw %}` to insert your search terms. Or you could use `{% raw %}{{users_lat}}{% endraw %}` and `{% raw %}{{users_lon}}{% endraw %}` to include the location. This gives you the flexibility to personalize your search. 

## Uploading and naming features

The Learning to Rank plugin enables you to create and modify features. After you define your features, you can log them for use in model training. By combining the logged feature data with your judgment list, you can train a model. Once the model is ready, you can upload it and then apply it to your search queries.

## Initializing the default feature store

The Learning to Rank plugin uses a feature store to store metadata about your features and models. Typically, there is one feature store per major search implementation, for example, [Wikipedia](http://wikipedia.org) as compared to [Wikitravel](http://wikitravel.org).

For most uses cases, you can use the default feature store and avoid managing multiple feature stores. To initialize the default feature store, run the following request:

```
PUT _ltr
```
{% include copy-curl.html %}

If you need to start again from the beginning, you can delete the default feature store by using the following operation:

```
DELETE _ltr
```
{% include copy-curl.html %}

Deleting the feature store removes all existing feature and model data.
{: .warning}

The default feature store is used throughout the rest of this guide.

## Working with features and feature sets

A _feature set_ is a collection of features that have been grouped together. You can use feature sets to log multiple feature values for offline training. When creating a new model, you copy the relevant feature set into the model definition. 

## Creating feature sets

To create a feature set, you can send a POST request. When creating the feature set, you provide a name and an optional list of features, as shown in the following example request:

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

To see a list of all defined feature sets, you can use the following request: 

```
GET _ltr/_featureset
```
{% include copy-curl.html %}

If you have many feature sets, you can filter the list by using a prefix, as shown in the following example request:

```
GET _ltr/_featureset?prefix=mor
```
{% include copy-curl.html %}

This returns only the feature sets with names starting with `mor`.

If you need to start over, you can delete a feature set using the following request:

```
DELETE _ltr/_featureset/more_movie_features
```
{% include copy-curl.html %}

## Validating features

When adding new features, you should validate that the features work as expected. You can do this by adding a `validation` block in your feature creation request. This allows the Learning to Rank plugin to run the query before adding the feature, catching any issues early. If you do not run this validation, you may not discover until later that the query, while valid JSON, contains a malformed OpenSearch query.

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

Place the validation block alongside your feature set definition. In the following example, the `match` query is malformed (curly brackets are missing in the Mustache template). The validation fails, returning an error:

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
                        "title": "{% raw %}{{keywords{% endraw %}"
                    }
                }
            }
        ]
    }
}
```
{% include copy-curl.html %}

## Expanding feature sets

You may not initially know which features are the most useful. In these cases, you can later add new features to an existing feature set for logging and model evaluation. For example, if you want to create a `user_rating` feature, you can use the Feature Set Append API, as shown in the following example request:

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

The Learning to Rank plugin enforces unique names for each feature. This is because some model training libraries refer to features by name. In the preceding example, you could not add a new `user_rating` feature without causing an error because that feature name is already in use.

## Treating feature sets as lists

Feature sets are more like ordered lists than simple sets. Each feature has both a name and an ordinal position. Some LTR training applications, such as RankLib, refer to features by their ordinal position (for example, 1st feature, 2nd feature). Others may use the feature name. When working with logged features, you may need to handle both the ordinal and the name because the ordinal is preserved to maintain the list order. 

## Next steps

Learn about [feature engineering]({{site.url}}{{site.baseurl}}/search-plugins/ltr/feature-engineering/) and [advanced functionality]({{site.url}}{{site.baseurl}}/search-plugins/ltr/advanced-functionality/).
