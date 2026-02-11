---
layout: default
title: Uploading trained models
nav_order: 60
parent: Learning to Rank
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/ltr/training-models/
---

# Uploading trained models

While model training occurs outside of the Learning to Rank plugin, you can use the plugin for [logging feature scores]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/). After you have trained a model, you can upload it to the plugin in the available serialization formats, such as RankLib and XGBoost.

## RankLib model training

The feature logging process generates a RankLib-comsumable judgment file. In the following judgment file, the query with ID 1 `rambo` includes the logged features 1 (a title `TF*IDF`
score) and 2 (a description `TF*IDF` score) for a set of documents:

```
4   qid:1   1:9.8376875     2:12.318446     # 7555 rambo
3   qid:1   1:10.7808075    2:9.510193      # 1370 rambo
3   qid:1   1:10.7808075    2:6.8449354     # 1369 rambo
3   qid:1   1:10.7808075    2:0.0           # 1368 rambo
```

The RankLib library can be called using the following command:
 
 ```
 cmd = "java -jar RankLib-2.8.jar -ranker %s -train%rs -save %s -frate 1.0" % (whichModel, judgmentsWithFeaturesFile, modelOutput)
```

The `judgmentsWithFeatureFile` is the input provided to RankLib for training. Additional parameters can be passed. See the [RankLib documentation](https://sourceforge.net/p/lemur/wiki/RankLib/) for more information.

RankLib outputs the model in its own serialization format. As shown in the following example, a LambdaMART model is an ensemble of regression trees: 

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

Within the RankLib model, each tree in the ensemble examines feature values, makes decisions based on these feature values, and outputs the relevance scores. The features are referred to by their ordinal position, starting from 1, which corresponds to the 0th feature in the original feature set. RankLib does not use feature names during model training.

### Other RankLib models

RankLib is a library that implements several other model types in addition to LambdaMART, such as MART,
RankNet, RankBoost, AdaRank, Coordinate Ascent, ListNet, and Random Forests. Each of these models has its own set of parameters and training process.

For example, the RankNet model is a neural network that learns to predict the probability of a document being more relevant than another document. The model is trained using a pairwise loss function that compares the predicted relevance of two documents with the actual relevance. The model is serialized in a format similar to the following example:

```
## RankNet
## Epochs = 100
## No. of features = 5
## No. of hidden layers = 1
...
## Layer 1: 10 neurons
1 2
1
10
0 0 -0.013491530393429608 0.031183180961270988 0.06558792020112071 -0.006024092627087733 0.05729619574181734 -0.0017010373987742411 0.07684848696852313 -0.06570387602230028 0.04390491141617467 0.013371636736099578
...
```

All these models can be used with the Learning to Rank plugin, provided that the model is serialized in the RankLib format.

## XGBoost model training

Unlike the RankLib model, the XGBoost model is serialized in a format specific to gradient-boosted decision trees, as shown in the following example:

```json
    [  { "nodeid": 0, "depth": 0, "split": "tmdb_multi", "split_condition": 11.2009, "yes": 1, "no": 2, "missing": 1, "children": [
        { "nodeid": 1, "depth": 1, "split": "tmdb_title", "split_condition": 2.20631, "yes": 3, "no": 4, "missing": 3, "children": [
        { "nodeid": 3, "leaf": -0.03125 },
        ...
```

## XGBoost parameters

Optional parameters can be specified for an XGBoost model. These parameters are specified as an object, with the decision trees specified in the `splits` field. The supported parameters include `objective`, which defines the model learning objective as described in the [XGBoost documentation](https://xgboost.readthedocs.io/en/latest/parameter.html#learning-task-parameters). This parameter can transform the final model prediction. The supported values include `binary:logistic`, `binary:logitraw`, `rank:ndcg`, `rank:map`, `rank:pairwise`, `reg:linear`, and `reg:logistic`.

## Simple linear models

Machine learning (ML) models, such as Support Vector Machines (SVMs), output linear weights for each feature. The LTR model supports representing these linear weights in a simple format, such as those learned from an SVM or linear regression model. In the following example output, the weights indicate the relative importance of the features in the model's prediction:

```json
{
    "title_query" : 0.3,
    "body_query" : 0.5,
    "recency" : 0.1
}
```

## Feature normalization

Feature normalization is used to convert feature values to a consistent range, typically between 0 and 1 or -1 and 1. This is done during the training phase to better understand the relative impact of each feature. Some models, especially linear ones such as SVMRank, rely on normalization to function correctly.

## Model upload process

After training your model, the next step is to make it available for search operations. This involves uploading the model to the Learning to Rank plugin. When uploading a model, you must provide the following information:

- Feature set used during training 
- Model type, for example, RankLib or XGBoost
- Model content

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

### Standard normalization

Standard normalization transforms features as follows:

- Maps the mean value to 0
- Maps one standard deviation above the mean to 1
- Maps one standard deviation below the mean to -1

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

### Min-max normalization 

Min-max normalization scales features to a fixed range, typically between 0 and 1. Min-max normalization transforms features as follows:

- Maps the specified minimum value to 0
- Maps the specified maximum value to 1
- Scales the values between 0 and 1 linearly

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

Models are initially created with reference to a feature set. After their creation, they exist as independent top-level entities. 

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

When a model is created, its features are copied. This prevents changes to the original features from affecting existing models or model production. For example, if the feature set used to create the model is deleted, you can still access and use the model.

### Model response

When retrieving a model, you receive a response that includes the features used to create it, as shown in the following example:

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

Learn about [searching with LTR]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/).
