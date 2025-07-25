---
layout: default
title: Advanced functionality
nav_order: 80
parent: Learning to Rank
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/ltr/advanced-functionality/
---

# Advanced functionality

OpenSearch Learning to Rank (LTR) offers additional functionality. It is recommended that you have a foundational understanding of OpenSearch LTR before working with these features.

## Reusable features

[Building features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features/) involves uploading a list of features. To avoid repeating common features across multiple sets, you can maintain a library of reusable features.
	
For example, if a title field query is frequently used in your feature sets, then you can create a reusable title query using the feature API:

```json
    POST _ltr/_feature/titleSearch
    {
        "feature":
        {
            "params": [
            "keywords"
            ],
            "template": {
            "match": {
                "title": "{{keywords}}"
            }
            }
        }
    }
```
{% include copy-curl.html %}

Normal CRUD operations apply, so you can delete a feature by using the following operation: 

```json
DELETE _ltr/_feature/titleSearch
```
{% include copy-curl.html %}


To fetch an individual feature, you can use the following request:

```json
GET _ltr/_feature/titleSearch
```
{% include copy-curl.html %}

To view a list of all features filtered by name prefix, you can use the following request:

```json
GET /_ltr/_feature?prefix=t
```
{% include copy-curl.html %}

To create or update a feature set, you can refer to the `titleSearch` feature by using the following request:

```json
POST /_ltr/_featureset/my_featureset/_addfeatures/titleSearch
```
{% include copy-curl.html %}

This adds the `titleSearch` feature to the next ordinal position within the `my_featureset` feature set.

## Derived features

Derived features are those that build upon other features. These can be expressed as [Lucene expressions](http://lucene.apache.org/core/7_1_0/expressions/index.html?org/apache/lucene/expressions/js/package-summary.html) and are identified by the `"template_language": "derived_expression"`. 

Additionally, derived features can accept query-time variables of type [`Number`](https://docs.oracle.com/javase/8/docs/api/java/lang/Number.html), as described in [Creating feature sets]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features#creating-feature-sets).

### Script features

Script features are a type of [derived feature](#derived-features). These features have access to the `feature_vector`, but they are implemented as native or Painless OpenSearch scripts rather than as [Lucene
expressions](http://lucene.apache.org/core/7_1_0/expressions/index.html?org/apache/lucene/expressions/js/package-summary.html). 

To identify these features, set the `"template_language": "script_feature""`. The custom script can access the `feature_vector` through the [Java Map](https://docs.oracle.com/javase/8/docs/api/java/util/Map.html), as described in [Create a feature set]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features#creating-feature-sets).

Script-based features may impact the performance of your OpenSearch cluster, so it is best to avoid them if you require highly performant queries.
{: .warning}

### Script feature parameters

Script features are native or Painless scripts within the context of LTR. These script features can accept parameters as described in the [OpenSearch script documentation]({{site.url}}{{site.baseurl}}/api-reference/script-apis/index/). When working with LTR scripts, you can override parameter values and names. The priority for parameterization, in increasing order, is as follows:

- The parameter name and value are passed directly to the source script, but not in the LTR script parameters. These cannot be configured at query time. 
- The parameter name is passed to both the `sltr` query and the source script, allowing the script parameter values to be overridden at query time.
- The LTR script parameter name to native script parameter name indirection allows you to use different parameter names in your LTR feature definition than those in the underlying native script. This gives you flexibility in how you define and use scripts within the LTR context.

For example, to set up a customizable way to rank movies in search results, considering both the title match and other adjustable factors, you can use the following request:

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
            "title": "{{keywords}}"
          }
        }
      },
      {
        "name": "custom_title_query_boost",
        "params": [
          "some_multiplier",
          "ltr_param_foo"
        ],
        "template_language": "script_feature",
        "template": {
          "lang": "painless",
          "source": "(long)params.default_param * params.feature_vector.get('title_query') * (long)params.some_multiplier * (long) params.param_foo",
          "params": {
            "default_param": 10,
            "some_multiplier": "some_multiplier",
            "extra_script_params": {
              "ltr_param_foo": "param_foo"
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Multiple feature stores

A feature store corresponds to an independent LTR system, including features, feature sets, and models backed by a single index and cache. A feature store typically represents a single search problem or application, like Wikipedia or Wiktionary. To use multiple feature stores in your OpenSearch cluster, you can create and manage them using the provided API. For example, you can create a feature set for the `wikipedia` feature store as follows:

```json
PUT _ltr/wikipedia

POST _ltr/wikipedia/_featureset/attempt_1
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
            "title": "{{keywords}}"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

When logging features, you can specify the feature store using the `store` parameter in the `sltr` section of your query, as shown in the following example structure. If you do not provide a `store` parameter, the default store is used to look up the feature set.

```json
{
  "sltr": {
    "_name": "logged_featureset",
    "featureset": "attempt_1",
    "store": "wikipedia",
    "params": {
      "keywords": "star"
    }
  }
}
```
{% include copy-curl.html %}

To delete the feature set, you can use the following operation:

```json
DELETE _ltr/wikipedia/_featureset/attempt_1
```
{% include copy-curl.html %}

## Model caching

The Model Caching plugin uses an internal cache for compiled models. To force the models to be recompiled, you can clear the cache for a feature store:

```json
POST /_ltr/_clearcache
```
{% include copy-curl.html %}

To get cluster-wide cache statistics for a specific store, use the following request:

```json
GET /_ltr/_cachestats
```
{% include copy-curl.html %}

You can control the characteristics of the internal cache by using the following node settings:

```
# limit cache usage to 12 megabytes (defaults to 10mb or max_heap/10 if lower) ltr.caches.max_mem: 12mb
# Evict cache entries 10 minutes after insertion (defaults to 1hour, set to 0 to disable) ltr.caches.expire_after_write: 10m
# Evict cache entries 10 minutes after access (defaults to 1hour, set to 0 to disable) ltr.caches.expire_after_read: 10m
```
{% include copy.html %}

## Extra logging

As described in [Logging features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/), you can use the logging extension to return feature values with each document. For native scripts, you can also return additional arbitrary information along with the logged features. 

For native scripts, the `extra_logging` parameter is injected into the script parameters. This parameter is a [`Supplier<Map<String,Object>>`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Supplier.html), which provides a non-null `Map<String,Object>` only during the logging fetch phase. Any values you add to this map are returned alongside the logged features:

```java
{
    @Override
    public double runAsDouble() {
    ...
        Map<String,Object> extraLoggingMap = ((Supplier<Map<String,Object>>) getParams().get("extra_logging")).get();
        if (extraLoggingMap != null) {
            extraLoggingMap.put("extra_float", 10.0f);
            extraLoggingMap.put("extra_string", "additional_info");
        }
    ...
    }
}
```
{% include copy-curl.html %}

If the extra logging map is accessed, it is returned as an additional entry with the logged features. The format of the logged features, including the extra logging information, will appear similar to the following example:

```json
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
        },
        {
            "name": "extra_logging",
            "value": {
                "extra_float": 10.0,
                "extra_string": "additional_info"
            }
        }
    ]
}
```
{% include copy-curl.html %}

## Feature score caching

By default, the Feature Score Caching plugin calculates feature scores for both model inference and feature score logging. For example, if you write a query to rescore the top 100 documents and return the top 10 with feature scores, then the plugin calculates the feature scores of the top 100 documents for model inference and then calculates and logs the scores for the top 10 documents.

The following query shows this behavior: 

```json
POST tmdb/_search
{
    "size": 10,
    "query": {
        "match": {
            "_all": "rambo"
        }
    },
    "rescore": {
        "window_size" : 100,
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
    },
    "ext": {
        "ltr_log": {
            "log_specs": {
                "name": "log_entry1",
                "rescore_index": 0
            }
        }
    }
}
```
{% include copy-curl.html %}

In some environments, it may be faster to cache the feature scores for model inference and reuse them for logging. To enable feature score caching, add the `cache: "true"`
flag to the `sltr` query that is the target of feature score logging, as shown in the following example:

```json
{
   "sltr":{
      "cache":true,
      "params":{
         "keywords":"rambo"
      },
      "model":"my_model"
   }
}
```
{% include copy-curl.html %}

## Stats

You can use the Stats API to retrieve the plugin's overall status and statistics. To do this, send the following request:

```json
GET /_ltr/_stats
```
{% include copy-curl.html %}

The response includes information about the cluster, configured stores, and cache statistics for various plugin components:

```json
{
   "_nodes":{
      "total":1,
      "successful":1,
      "failed":0
   },
   "cluster_name":"es-cluster",
   "stores":{
      "_default_":{
         "model_count":10,
         "featureset_count":1,
         "feature_count":0,
         "status":"green"
      }
   },
   "status":"green",
   "nodes":{
      "2QtMvxMvRoOTymAsoQbxhw":{
         "cache":{
            "feature":{
               "eviction_count":0,
               "miss_count":0,
               "hit_count":0,
               "entry_count":0,
               "memory_usage_in_bytes":0
            },
            "featureset":{
               "eviction_count":0,
               "miss_count":0,
               "hit_count":0,
               "entry_count":0,
               "memory_usage_in_bytes":0
            },
            "model":{
               "eviction_count":0,
               "miss_count":0,
               "hit_count":0,
               "entry_count":0,
               "memory_usage_in_bytes":0
            }
         }
      }
   }
}
```
{% include copy-curl.html %}

You can use filters to retrieve a single statistic by sending the following request:

```json
GET /_ltr/_stats/{stat}
```
{% include copy-curl.html %}

You can limit the information to a single node in the cluster by sending the following requests:

```json
GET /_ltr/_stats/nodes/{nodeId}
GET /_ltr/_stats/{stat}/nodes/{nodeId}
```
{% include copy-curl.html %}

## TermStat query
Experimental
{: .label .label-red }

The `TermStatQuery` is in an experimental stage, and the Domain-Specific Language (DSL) may change as the code advances. For stable term-statistic access, see [ExplorerQuery]{.title-ref}.

The `TermStatQuery` is a reimagined version of the legacy `ExplorerQuery`. It provides a clearer way to specify terms and offers more flexibility for experimentation. This query surfaces the same data as the [ExplorerQuery]{.title-ref}, but it allows you to specify a custom Lucene expression to retrieve the desired data, such as in the following example:

```json
POST tmdb/_search
{
    "query": {
        "term_stat": {
            "expr": "df",
            "aggr": "max",
            "terms": ["rambo", "rocky"],
            "fields": ["title"]
        }
    }
}
```
{% include copy-curl.html %}

The `expr` parameter is used to specify a Lucene expression. This expression is run on a per-term basis. The expression can be a simple stat type or a custom formula with multiple stat types, such as `(tf * idf) / 2`. Available stat types in the Lucene expression context are listed in the following table.

Type | Description
:---| :---
`df` | The direct document frequency for a term. For example, if `rambo` occurs in three movie titles across multiple documents, then the value would be `3`.
`idf` | The inverse document frequency (IDF) calculation using the formula `log((NUM_DOCS+1)/(raw_df+1)) + 1`.
`tf` | The term frequency for a document. For example, if `rambo` occurs three times in a movie synopsis in the same document, then the value would be `3`.
`tp` | The term positions for a document. Multiple positions can be returned for a single term, so you should review the behavior of the `pos_aggr` parameter.
`ttf` | The total term frequency for a term across an index. For example, if `rambo` is mentioned a total of 100 times in the `overview` field across all documents, then the value would be `100`.

The `aggr` parameter specifies the type of aggregation to be applied to the collected statistics from the `expr`. For example, if you specify the terms `rambo` and `rocky`, then the query gathers statistics for both terms. Because you can only return a single value, you need to decide which statistical calculation to use. The available aggregation types are `min`, `max`, `avg`, `sum`, and `stddev`. The query also provides the following counts: `matches` (the number of terms that matched in the current document) and `unique` (the unique number of terms that were passed in the query).

The `terms` parameter specifies an array of terms for which you want to gather statistics. Only single terms are supported, with no support for phrases or span queries. If your field is tokenized, you can pass multiple terms in one string in the array.

The `fields` parameter specifies the fields to check for the specified `terms`. If no `analyzer` is specified, then the configured `search_analyzer` for each field is used.

The optional parameters are listed in the following table.

Type | Description
:---| :---
`analyzer` | If specified, this analyzer is used instead of the configured `search_analyzer` for each field.
`pos_aggr` | Because each term can have multiple positions, you can use this parameter to specify the aggregation to apply to the term positions. This supports the same values as the `aggr` parameter and defaults to `avg`.

### Script injection

Script injection provides the ability to inject term statistics into a scripting context. When working with `ScriptFeatures`, you can pass a `term_stat` object with the `terms`, `fields`, and `analyzer` parameters. An injected variable named `termStats` then provides access to the raw values in your custom script. This enables advanced feature engineering by giving you access to all the underlying data.

To access the count of matched tokens, use [`params.matchCount.get`]{.title-ref}. To access the unique token count, use [`params.uniqueTerms`]{.title-ref}.

You can either hardcode the `term_stat` parameter in your script definition or pass the parameter to be set at query time. For example, the following example query defines a feature set with a script feature that uses hardcoded `term_stat` parameters:

```json
POST _ltr/_featureset/test
{
   "featureset": {
     "features": [
       {
         "name": "injection",
         "template_language": "script_feature",
         "template": {
           "lang": "painless",
           "source": "params.termStats['df'].size()",
           "params": {
             "term_stat": {
                "analyzer": "!standard",
                "terms": ["rambo rocky"],
                "fields": ["overview"]
             }
           }
         }
       }
     ]
   }
}
```
{% include copy-curl.html %}

Analyzer names must be prefixed with a bang(!) when specifying them locally. Otherwise, they are treated as the parameter lookup value.
{: .note}

To set parameter lookups, you can pass the name of the parameter from which you want to pull the value, as shown in the following example request:

```json
POST _ltr/_featureset/test
{
   "featureset": {
     "features": [
       {
         "name": "injection",
         "template_language": "script_feature",
         "template": {
           "lang": "painless",
           "source": "params.termStats['df'].size()",
           "params": {
             "term_stat": {
                "analyzer": "analyzerParam",
                "terms": "termsParam",
                "fields": "fieldsParam"
             }
           }
         }
       }
     ]
   }
}
```
{% include copy-curl.html %}

Alternatively, you can pass the `term_stat` parameters as query-time parameters, as shown in the following request:

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
                        "featureset": "test",
                        "params": {
                          "analyzerParam": "standard",
                          "termsParam": ["troutman"],
                          "fieldsParam": ["overview"]
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
