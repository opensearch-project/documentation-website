---
layout: default
title: Supported Algorithms 
has_children: false
nav_order: 100
---

# Supported Algorithms

ML Commons supports various algorithms to help train and predict machine learning (ML) models or test data-driven predictions without a model. This page outlines the algorithms supported by the ML Commons plugin and the API operations they support.

## Common limitation

Except for the Localization algorithm, all of the following algorithms can only support retrieving 10,000 documents from an index as an input.

## K-means

K-means is a simple and popular unsupervised clustering ML algorithm built on top of [Tribuo](https://tribuo.org/) library. K-means will randomly choose centroids, then calculate iteratively to optimize the position of the centroids until each observation belongs to the cluster with the nearest mean.

### Parameters

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---
centroids | integer | The number of clusters in which to group the generated data | `2` 
iterations | integer | The number of iterations to perform against the data until a mean generates | `10`
distance_type | enum, such as `EUCLIDEAN`, `COSINE`, or `L1` | The type of measurement from which to measure the distance between centroids | `EUCLIDEAN`

### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-and-predict)

### Example

The following example uses the Iris Data index to train k-means synchronously. 

```json
POST /_plugins/_ml/_train/kmeans
{
    "parameters": {
        "centroids": 3,
        "iterations": 10,
        "distance_type": "COSINE"
    },
    "input_query": {
        "_source": ["petal_length_in_cm", "petal_width_in_cm"],
        "size": 10000
    },
    "input_index": [
        "iris_data"
    ]
}
```

### Limitations

The training process supports multi-threads, but the number of threads should be less than half of the number of CPUs.

## Linear regression

Linear regression maps the linear relationship between inputs and outputs. In ML Commons, the linear regression algorithm is adopted from the public machine learning library [Tribuo](https://tribuo.org/), which offers multidimensional linear regression models. The model supports the linear optimizer in training, including popular approaches like Linear Decay, SQRT_DECAY, [ADA](https://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf), [ADAM](https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/Adam.html), and [RMS_DROP](https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/RMSProp.html). 

### Parameters

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---
learningRate | Double | The initial step size used in an iterative optimization algorithm. | 0.01
momentumFactor | Double | The extra weight factors that accelerate the rate at which the weight is adjusted. This helps move the minimization routine out of local minima.  | 0
epsilon | Double | The value for stabilizing gradient inversion. | 1.00E-06 
beta1 | Double | The exponential decay rates for the moment estimates. |  0.9
beta2 | Double | The exponential decay rates for the moment estimates. |  0.99
decayRate | Double | The Root Mean Squared Propagation (RMSProp). | 0.9
momentumType | MomentumType | The defined Stochastic Gradient Descent (SGD) momentum type that helps accelerate gradient vectors in the right directions, leading to a fast convergence.| STANDARD
optimizerType | OptimizerType | The optimizer used in the model. | SIMPLE_SGD


### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)

### Example

The following example creates a new prediction based on the previously trained linear regression model.

**Request**

```json
POST _plugins/_ml/_predict/LINEAR_REGRESSION/ROZs-38Br5eVE0lTsoD9
{
  "parameters": {
    "target": "price"
  },
  "input_data": {
    "column_metas": [
      {
        "name": "A",
        "column_type": "DOUBLE"
      },
      {
        "name": "B",
        "column_type": "DOUBLE"
      }
    ],
    "rows": [
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 3
          },
          {
            "column_type": "DOUBLE",
            "value": 5
          }
        ]
      }
    ]
  }
}
```

**Response**

```json
{
  "status": "COMPLETED",
  "prediction_result": {
    "column_metas": [
      {
        "name": "price",
        "column_type": "DOUBLE"
      }
    ],
    "rows": [
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 17.25701855310131
          }
        ]
      }
    ]
  }
}
```

### Limitations

ML Commons only supports the linear Stochastic gradient trainer or optimizer, which cannot effectively map the non-linear relationships in trained data. When used with complicated datasets, the linear Stochastic trainer might cause some convergence problems and inaccurate results. 

## RCF

[Random Cut Forest](https://github.com/aws/random-cut-forest-by-aws) (RCF) is a probabilistic data structure used primarily for unsupervised anomaly detection. Its use also extends to density estimation and forecasting. OpenSearch leverages RCF for anomaly detection. ML Commons supports two new variants of RCF for different use cases:

* Batch RCF: Detects anomalies in non-time series data. 
* Fixed in time (FIT) RCF: Detects anomalies in time series data.

### Parameters

#### Batch RCF

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---
number_of_trees | integer | The number of trees in the forest. | 30
sample_size | integer | The same size used by the stream samplers in the forest. | 256
output_after | integer | The number of points required by stream samplers before results return. | 32
training_data_size | integer | The size of your training data. | Dataset size
anomaly_score_threshold | double | The threshold of the anomaly score. | 1.0 

#### Fit RCF

All parameters are optional except `time_field`.

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---
number_of_trees | integer | The number of trees in the forest. | 30
shingle_size | integer | A shingle, or a consecutive sequence of the most recent records. | 8
sample_size | integer | The sample size used by stream samplers in the forest. | 256
output_after | integer | The number of points required by stream samplers before results return. | 32
time_decay | double | The decay factor used by stream samplers in the forest. | 0.0001 
anomaly_rate | double | The anomaly rate. | 0.005
time_field | string | (**Required**) The time field for RCF to use as time series data. | N/A
date_format | string | The date and time format for the `time_field` field. | "yyyy-MM-ddHH:mm:ss"
time_zone | string | The time zone for the `time_field` field. | "UTC" 


### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-and-predict)


### Limitations

For FIT RCF, you can train the model with historical data and store the trained model in your index. The model will be deserialized and predict new data points when using the Predict API. However, the model in the index will not be refreshed with new data, because the model is fixed in time.

## RCFSummarize

RCFSummarize is a clustering algorithm based on the Clustering Using REpresentatives (CURE) algorithm. Compared to [k-means](#k-means), which uses random iterations to cluster, RCFSummarize uses a hierarchical clustering technique. The algorithm starts, with a set of randomly selected centroids larger than the centroids' ground truth distribution. During iteration, centroid pairs too close to each other automatically merge. Therefore, the number of centroids (`max_k`) converge to a rational number of clusters that fits ground truth, as opposed to a fixed `k` number of clusters.  

### Parameters

| Parameter | Type | Description | Default Value |
|---|---|---|---|
| max_k | integer | The max allowed number of centroids. | 2 |
| distance_type | enum, such as `EUCLIDEAN`, `L1`, `L2`, or `LInfinity` | The type of measurement used to measure the distance between centroids. | EUCLIDEAN |

### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-and-predict)

### Example: Train and predict

The following example estimates cluster centers and provides cluster labels for each sample in a given data frame.

```bash
POST _plugins/_ml/_train_predict/RCF_SUMMARIZE
{
  "parameters": {
    "centroids": 3,
    "max_k": 15,
    "distance_type": "L2"
  },
  "input_data": {
    "column_metas": [
      {
        "name": "d0",
        "column_type": "DOUBLE"
      },
      {
        "name": "d1",
        "column_type": "DOUBLE"
      }
    ],
    "rows": [
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 6.2
          },
          {
            "column_type": "DOUBLE",
            "value": 3.4
          }
        ]
      }
    ]
  }
}
```

**Response**

The `rows` parameter within the prediction result has been modified for length. In your response, expect more rows and columns to be contained within the response body.

```json
{
  "status": "COMPLETED",
  "prediction_result": {
    "column_metas": [
      {
        "name": "ClusterID",
        "column_type": "INTEGER"
      }
    ],
    "rows": [
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 0
          }
        ]
      }
    ]
  }
}
```
  

## Localization 

The Localization algorithm finds subset-level information for aggregate data (for example, aggregated over time) that demonstrates the activity of interest, such as spikes, drops, changes, or anomalies. Localization can be applied in different scenarios, such as data exploration or root cause analysis, to expose the contributors driving the activity of interest in the aggregate data.

### Parameters

All parameters are required except `filter_query` and `anomaly_start`.

Parameter | Type   | Description | Default Value
:--- | :--- | :--- | :---
index_name | String | The data collection to analyze. | N/A
attribute_field_names | List<String> | The fields for entity keys. | N/A
aggregations | List<AggregationBuilder> | The fields and aggregation for values. | N/A
time_field_name | String | The timestamp field. | null
start_time | Long | The beginning of the time range. | 0 
end_time | Long | The end of the time range. | 0
min_time_interval | Long | The minimum time interval/scale for analysis. | 0
num_outputs | integer | The maximum number of values from localization/slicing. | 0
filter_query | Long | (Optional) Reduces the collection of data for analysis. | Optional.empty()
anomaly_star | QueryBuilder | (Optional) The time after which the data will be analyzed. | Optional.empty()

### Example: Execute localization

The following example executes Localization against an RCA index.

**Request**

```bash
POST /_plugins/_ml/_execute/anomaly_localization
{
  "index_name": "rca-index",
  "attribute_field_names": [
    "attribute"
  ],
  "aggregations": [
    {
      "sum": {
        "sum": {
          "field": "value"
        }
      }
    }
  ],
  "time_field_name": "timestamp",
  "start_time": 1620630000000,
  "end_time": 1621234800000,
  "min_time_interval": 86400000,
  "num_outputs": 10
}
```

**Response**

The API responds with the sum of the contribution and base values per aggregation, every time the algorithm executes in the specified time interval.

```json
{
  "results" : [
    {
      "name" : "sum",
      "result" : {
        "buckets" : [
          {
            "start_time" : 1620630000000,
            "end_time" : 1620716400000,
            "overall_aggregate_value" : 65.0
          },
          {
            "start_time" : 1620716400000,
            "end_time" : 1620802800000,
            "overall_aggregate_value" : 75.0,
            "entities" : [
              {
                "key" : [
                  "attr0"
                ],
                "contribution_value" : 1.0,
                "base_value" : 2.0,
                "new_value" : 3.0
              },
              {
                "key" : [
                  "attr1"
                ],
                "contribution_value" : 1.0,
                "base_value" : 3.0,
                "new_value" : 4.0
              },
              {
                ...
              },
             {
                "key" : [
                  "attr8"
                ],
                "contribution_value" : 6.0,
                "base_value" : 10.0,
                "new_value" : 16.0
              },
              {
                "key" : [
                  "attr9"
                ],
                "contribution_value" : 6.0,
                "base_value" : 11.0,
                "new_value" : 17.0
              }
            ]
          }
        ]
      }
    }
  ]
}
```  

### Limitations

The Localization algorithm can only be executed directly. Therefore, it cannot be used with the ML Commons Train and Predict APIs.

## Logistic regression

A classification algorithm, logistic regression models the probability of a discrete outcome given an input variable. In ML Commons, these classifications include both binary and multi-class. The most common is the binary classification, which takes two values, such as "true/false" or "yes/no", and predicts the outcome based on the values specified. Alternatively, a multi-class output can categorize different inputs based on type. This makes logistic regression most useful for situations where you are trying to determine how your inputs fit best into a specified category. 

### Parameters

| Parameter | Type | Description | Default Value |
|---|---|---|---|
| learningRate | Double | The initial step size used in an iterative optimization algorithm. | 1 |
| momentumFactor | Double | The extra weight factors that accelerate the rate at which the weight is adjusted. This helps move the minimization routine out of local minima. | 0 |
| epsilon | Double | The value for stabilizing gradient inversion. | 0.1 |
| beta1 | Double | The exponential decay rates for the moment estimates. | 0.9 |
| beta2 | Double | The exponential decay rates for the moment estimates. | 0.99 |
| decayRate | Double | The Root Mean Squared Propagation (RMSProp). | 0.9 |
| momentumType | MomentumType | The Stochastic Gradient Descent (SGD) momentum that helps accelerate gradient vectors in the right direction, leading to faster convergence between vectors. | STANDARD |
| optimizerType | OptimizerType | The optimizer used in the model.  | AdaGrad |
| target | String | The target field. | null |
| objectiveType | ObjectiveType | The objective function type. | LogMulticlass |
| epochs | Integer | The number of iterations. | 5 |
| batchSize | Integer | The size of minbatches. | 1 |
| loggingInterval | Integer | The interval of logs lost after many iterations. The interval is `1` if the algorithm contains no logs. | 1000 |

### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)

### Example: Train/Predict with Iris data

The following example creates an index in OpenSearch with the [Iris dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set), then trains the data using logistic regression. Lastly, it uses the trained model to predict Iris types separated by row.

#### Create an Iris index

Before using this request, make sure that you have downloaded [Iris data](https://archive.ics.uci.edu/dataset/53/iris).

```bash
PUT /iris_data
{
  "mappings": {
    "properties": {
      "sepal_length_in_cm": {
        "type": "double"
      },
      "sepal_width_in_cm": {
        "type": "double"
      },
      "petal_length_in_cm": {
        "type": "double"
      },
      "petal_width_in_cm": {
        "type": "double"
      },
      "class": {
        "type": "keyword"
      }
    }
  }
}
```

#### Ingest data from IRIS_data.txt

```bash
POST _bulk
{ "index" : { "_index" : "iris_data" } }
{"sepal_length_in_cm":5.1,"sepal_width_in_cm":3.5,"petal_length_in_cm":1.4,"petal_width_in_cm":0.2,"class":"Iris-setosa"}
{ "index" : { "_index" : "iris_data" } }
{"sepal_length_in_cm":4.9,"sepal_width_in_cm":3.0,"petal_length_in_cm":1.4,"petal_width_in_cm":0.2,"class":"Iris-setosa"}
...
...
```

#### Train the logistic regression model

This example uses a multi-class logistic regression categorization methodology. Here, the inputs of sepal and petal length and width are used to train the model to categorize centroids based on the `class`, as indicated by the `target` parameter.

**Request**

```bash
{
  "parameters": {
    "target": "class"
  },
  "input_query": {
    "query": {
      "match_all": {}
    },
    "_source": [
      "sepal_length_in_cm",
      "sepal_width_in_cm",
      "petal_length_in_cm",
      "petal_width_in_cm",
      "class"
    ],
    "size": 200
  },
  "input_index": [
    "iris_data"
  ]
}
```

**Response**

The `model_id` will be used to predict the class of the Iris.

```json
{
  "model_id" : "TOgsf4IByBqD7FK_FQGc",
  "status" : "COMPLETED"
}
```

#### Predict results

Using the `model_id` of the trained Iris dataset, logistic regression will predict the class of the Iris based on the input data.

```bash
POST _plugins/_ml/_predict/logistic_regression/SsfQaoIBEoC4g4joZiyD
{
  "parameters": {
    "target": "class"
  },
  "input_data": {
    "column_metas": [
      {
        "name": "sepal_length_in_cm",
        "column_type": "DOUBLE"
      },
      {
        "name": "sepal_width_in_cm",
        "column_type": "DOUBLE"
      },
      {
        "name": "petal_length_in_cm",
        "column_type": "DOUBLE"
      },
      {
        "name": "petal_width_in_cm",
        "column_type": "DOUBLE"
      }
    ],
    "rows": [
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 6.2
          },
          {
            "column_type": "DOUBLE",
            "value": 3.4
          },
          {
            "column_type": "DOUBLE",
            "value": 5.4
          },
          {
            "column_type": "DOUBLE",
            "value": 2.3
          }
        ]
      },
      {
        "values": [
          {
            "column_type": "DOUBLE",
            "value": 5.9
          },
          {
            "column_type": "DOUBLE",
            "value": 3.0
          },
          {
            "column_type": "DOUBLE",
            "value": 5.1
          },
          {
            "column_type": "DOUBLE",
            "value": 1.8
          }
        ]
      }
    ]
  }
}
```

**Response**

```json
{
  "status" : "COMPLETED",
  "prediction_result" : {
    "column_metas" : [
      {
        "name" : "result",
        "column_type" : "STRING"
      }
    ],
    "rows" : [
      {
        "values" : [
          {
            "column_type" : "STRING",
            "value" : "Iris-virginica"
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "STRING",
            "value" : "Iris-virginica"
          }
        ]
      }
    ]
  }
}
```

### Limitations

Convergence metrics are not built into Tribuo's trainers. Therefore, ML Commons cannot indicate the convergence status through the ML Commons API.