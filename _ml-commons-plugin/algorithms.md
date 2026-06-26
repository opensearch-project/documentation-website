---
layout: default
title: Supported Algorithms 
has_children: false
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/algorithms/
---

# Supported Algorithms

ML Commons supports various algorithms to help train and predict machine learning (ML) models or test data-driven predictions without a model. This page outlines the algorithms supported by the ML Commons plugin and the API operations they support.

## Common limitation

Except for the Localization algorithm, all of the following algorithms can only support retrieving 10,000 documents from an index as an input.

## K-Means

K-Means is a simple and popular unsupervised clustering ML algorithm built on top of [Tribuo](https://tribuo.org/) library. K-Means will randomly choose centroids, then calculate iteratively to optimize the position of the centroids until each observation belongs to the cluster with the nearest mean.

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

The following example uses the Iris Data index to train K-Means synchronously. 

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
learningRate | Double | The rate of speed at which the gradient moves during descent | 0.01
momentumFactor | Double | The medium-term from which the regressor rises or falls | 0
epsilon | Double | The criteria used to identify a linear model | 1.00E-06 
beta1 | Double | The estimated exponential decay for the moment |  0.9
beta2 | Double | The estimated exponential decay for the moment |  0.99
decayRate | Double | The rate at which the model decays exponentially | 0.9
momentumType | MomentumType | The defined Stochastic Gradient Descent (SDG) momentum type that helps accelerate gradient vectors in the right directions, leading to a fast convergence| STANDARD
optimizerType | OptimizerType | The optimizer used in the model | SIMPLE_SGD


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
number_of_trees | integer | The number of trees in the forest | 30
sample_size | integer | The same size used by the stream samplers in the forest | 256
output_after | integer | The number of points required by stream samplers before results return | 32
training_data_size | integer | The size of your training data | Dataset size
anomaly_score_threshold | double | The threshold of the anomaly score | 1.0 

#### Fit RCF

All parameters are optional except `time_field`.

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---
number_of_trees | integer | The number of trees in the forest | 30
shingle_size | integer | A shingle, or a consecutive sequence of the most recent records | 8
sample_size | integer | The sample size used by stream samplers in the forest | 256
output_after | integer | The number of points required by stream samplers before results return | 32
time_decay | double | The decay factor used by stream samplers in the forest | 0.0001 
anomaly_rate | double | The anomaly rate | 0.005
time_field | string | (**Required**) The time filed for RCF to use as time series data | N/A
date_format | string | The date and time format for the time_field field | "yyyy-MM-ddHH:mm:ss"
time_zone | string | The time zone for the time_field field | "UTC" 


### APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-model)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#predict)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#train-and-predict)


### Limitations

For FIT RCF, you can train the model with historical data and store the trained model in your index. The model will be deserialized and predict new data points when using the Predict API. However, the model in the index will not be refreshed with new data, because the model is fixed in time.

## Anomaly Localization 

The Anomaly Localization algorithm finds subset level-information for aggregate data (for example, aggregated over time) that demonstrates the activity of interest, such as spikes, drops, changes, or anomalies. Localization can be applied in different scenarios, such as data exploration or root cause analysis, to expose the contributors driving the activity of interest in the aggregate data.

### Parameters

All parameters are required except `filter_query` and `anomaly_start`.

Parameter | Type   | Description | Default Value
:--- | :--- | :--- | :---
index_name | String | The data collection to analyze | N/A
attribute_field_names | List<String> | The fields for entity keys | N/A
aggregations | List<AggregationBuilder> | The fields and aggregation for values | N/A
time_field_name | String | The timestamp field | null
start_time | Long | The beginning of the time range | 0 
end_time | Long | The end of the time range | 0
min_time_interval | Long | The minimum time interval/scale for analysis | 0
num_outputs | integer | The maximum number of values from localization/slicing | 0
filter_query | Long | (Optional) Reduces the collection of data for analysis | Optional.empty()
anomaly_star | QueryBuilder | (Optional) The time after which the data will be analyzed | Optional.empty()

### Example

The following example executes Anomaly Localization against an RCA index.

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