---
layout: default
title: Uploading trained models
nav_order: 60
parent: Learning to Rank
has_children: false
---

# Uploading trained models

While training models occurs outside of the Learning to Rank plugin, you can use the plugin for [Logging feature scores]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/). After you have trained a model, you can upload it to the plugin in the available serialization formats, such as RankLib and XGBoost, and others.

## RankLib model training

The feature logging process generates a RankLib-comsumable judgment file. In the following judgment file, the query with ID 1 `rambo` includesthe logged features 1 (a title `TF*IDF`
score) and 2 (a description `TF*IDF` score) for a set of documents:

```
4   qid:1   1:9.8376875 2:12.318446 # 7555  rambo
3   qid:1   1:10.7808075    2:9.510193 # 1370   rambo
3   qid:1   1:10.7808075    2:6.8449354 # 1369  rambo
3   qid:1   1:10.7808075    2:0.0 # 1368    rambo
```

The RankLib library can be called using the following command:
 
 ```
 cmd = "java -jar RankLib-2.8.jar -ranker %s -train%rs -save %s -frate 1.0" % (whichModel, judgmentsWithFeaturesFile, modelOutput)
```

The `judgmentsWithFeatureFile` is the input provided to RankLib for training. Additional parameters can be passed. See [RankLib documentation](https://sourceforge.net/p/lemur/wiki/RankLib/) for more information.

RankLib outputs the model in its own serialization format. For example, a LambdaMART model is an ensemble of regression trees, as shown in the following example: 

```
## LambdaMART
## No. of trees = 1000
## No. of leaves = 10
## No. of threshold candidates = 256
## Learning rate = 0.1
## Stop early = 100

    <ensemble>
       <tree id="1" weight="0.1">
           <split>
               <feature> 2 </feature>
               ...
```

Within the RankLib model, each tree in the ensemble examines the value of features, makes decisions based on these feature values, and then outputs the relevance scores. The features are referred to by their ordinal position, starting from 1, which corresponds to 0th feature in the original feature set. RankLib does not use feature names during the model training.

## XGBoost model training

Unlike the RankLib model, the XGBoost model is serialized in a format specific to gradient-boosted decision trees, as shwon in the following example:

```json
    [  { "nodeid": 0, "depth": 0, "split": "tmdb_multi", "split_condition": 11.2009, "yes": 1, "no": 2, "missing": 1, "children": [
        { "nodeid": 1, "depth": 1, "split": "tmdb_title", "split_condition": 2.20631, "yes": 3, "no": 4, "missing": 3, "children": [
        { "nodeid": 3, "leaf": -0.03125 },
        ...
```

## XGBoost parameters

Optional parameters can be specified for an XGBoost model. These parameters are specified as an object, with the decision trees specified in the `splits` field. The currently supported parameters include `objective`, which defines the model learning objective as described in the [XGBoost documentation](https://xgboost.readthedocs.io/en/latest/parameter.html#learning-task-parameters). This parameter can transform the final model prediction. The supported values include `binary:logistic`, `binary:logitraw`, `rank:ndcg`, `rank:map`, `rank:pairwise`, `reg:linear`, and `reg:logistic`.

## Simple linear models                                                 |

Many machine learning models, such as Support Vector Machines (SVMs), output linear weights for each feature. The LTR model supports representing these linear weights in a simple format, such as those learned from an SVM or linear regression model. In the following example output, the weights indicate the relative importance of the features in the model's prediction:

```json
{
    "title_query" : 0.3,
    "body_query" : 0.5,
    "recency" : 0.1
}
```

## Feature normalization

Feature normalization is used to transform feature values to a consistent range, typically between 0 and 1 or -1 to 1. This is done during the training phase to better understand the relative impact of each feature. Some models, especially linear ones such as SVMRank, rely on normalization to function correctly.

## Model upload process

After training your model, the next step is to make it available for search operations. This involves uploading the model to the Learning to Rank plugin. When uploading a model, you must provide the following information:

- The feature set used during training 
- The model type, for example, RankLib or XGBoost
- The model's content

The following example request shows how to upload a RankLib model that was trained using the `more_movie_features` feature set:

```json
    POST _ltr/_featureset/more_movie_features/_createmodel
    {
        "model": {
            "name": "my_ranklib_model",
            "model": {
                "type": "model/ranklib",
                "definition": "## LambdaMART\n
                                ## No. of trees = 1000
                                ## No. of leaves = 10
                                ## No. of threshold candidates = 256
                                ## Learning rate = 0.1
                                ## Stop early = 100

                                <ensemble>
                                    <tree id="1" weight="0.1">
                                        <split>
                                            <feature> 2 </feature>
                                            ...
                            "
            }
        }
    }
```

The following example request shows how to upload an XGBoost model that was trained using the `more_movie_features` feature set:

```json
    POST _ltr/_featureset/more_movie_features/_createmodel
    {
        "model": {
            "name": "my_xgboost_model",
            "model": {
                "type": "model/xgboost+json",
                "definition": "[  { \"nodeid\": 0, \"depth\": 0, \"split\": \"tmdb_multi\", \"split_condition\": 11.2009, \"yes\": 1, \"no\": 2, \"missing\": 1, \"children\": [
                                    { \"nodeid\": 1, \"depth\": 1, \"split\": \"tmdb_title\", \"split_condition\": 2.20631, \"yes\": 3, \"no\": 4, \"missing\": 3, \"children\": [
                                      { \"nodeid\": 3, \"leaf\": -0.03125 },
                                    ..."
            }
        }
    }
```

The following example request shows how to upload an XGBoost model that was trained using the `more_movie_features` feature set with parameters:

```json
    POST _ltr/_featureset/more_movie_features/_createmodel
    {
        "model": {
            "name": "my_xgboost_model",
            "model": {
                "type": "model/xgboost+json",
                "definition": "{
                                 \"objective\": \"reg:logistic\",
                                 \"splits\": [  { \"nodeid\": 0, \"depth\": 0, \"split\": \"tmdb_multi\", \"split_condition\": 11.2009, \"yes\": 1, \"no\": 2, \"missing\": 1, \"children\": [
                                                  { \"nodeid\": 1, \"depth\": 1, \"split\": \"tmdb_title\", \"split_condition\": 2.20631, \"yes\": 3, \"no\": 4, \"missing\": 3, \"children\": [
                                                    { \"nodeid\": 3, \"leaf\": -0.03125 },
                                                  ...
                                             ]
                               }"
            }
        }
    }
````

The following example request shows how to upload a simple linear model that was trained using the `more_movie_features` feature set:

```json
    POST _ltr/_featureset/more_movie_features/_createmodel
    {
        "model": {
            "name": "my_linear_model",
            "model": {
                "type": "model/linear",
                "definition": """
                                {
                                    "title_query" : 0.3,
                                    "body_query" : 0.5,
                                    "recency" : 0.1
                                }
                            """
            }
        }
    }
```

## Creating a model with feature normalization

Feature normalization is a crucial preprocessing step that can be applied before model evaluation. LTR supports two types of feature normalization: min-max and standard normalization.

### Standard feature normalization

Standard normalization transforms features so that:

- The mean value is mapped to 0
- One standard deviation above the mean is mapped to 1
- One standard deviation below the mean is mapped to -1

The following example request shows how to create a model with standard feature normalization:

```json
    POST _ltr/_featureset/more_movie_features/_createmodel
    {
        "model": {
            "name": "my_linear_model",
            "model": {
                "type": "model/linear",
                "feature_normalizers": {
                               "release_year": {
                                  "standard": {
                                    "mean": 1970,
                                    "standard_deviation": 30
                                  }
                               }
                            },
                "definition": """
                                {
                                    "release_year" : 0.3,
                                    "body_query" : 0.5,
                                    "recency" : 0.1
                                }
                            """
            }
        }
    }
```

In addition to standard normalization, LTR supports min-max normalization. This method scales features to a fixed range, typically between 0 and 1.

With min-max normalization:

- The specified minimum value is mapped to 0
- The specified maximum value is mapped to 1
- Values in between are linearly scaled

The following example request shows how to implement min-max normalization:

```json
    "feature_normalizers": {
        "vote_average": {
            "min_max": {
                "minimum": 0,
                "maximum": 10
            }
        }
    }
```

## Model independence from feature sets

While models are initially created with reference to a feature set, after creation, models exist as independent top-level entities. 

### Accessing models

To retrieve a model, use a GET request:

```
GET _ltr/_model/my_linear_model
```

To delete a model, use a DELETE request:

```
DELETE _ltr/_model/my_linear_model
```

Model names must be globally unique across all feature sets.
{: .note}

### Model persistence

When a model is created, the associated features are copied into the model. This ensures that modifications to the original feature set do not affect existing models or deletion of the original feature set does not impact models in production. 

For example, if the feature set used to create the model is deleted, you can still access and use the model.

### Model response

When retrieving a model, you will receive a response that includes the features used to create it, as shown in the following example response:

```json
    {
    "_index": ".ltrstore",
    "_type": "store",
    "_id": "model-my_linear_model",
    "_version": 1,
    "found": true,
    "_source": {
        "name": "my_linear_model",
        "type": "model",
        "model": {
            "name": "my_linear_model",
            "feature_set": {
                "name": "more_movie_features",
                "features": [
                {
                    "name": "body_query",
                    "params": [
                        "keywords"
                        ],
                     "template": {
                        "match": {
                            "overview": "{{keywords}}"
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
                            "title": "{{keywords}}"
                        }
                    }
                }
        ]}}}
```

## Next steps 

Learn about [Searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/).
