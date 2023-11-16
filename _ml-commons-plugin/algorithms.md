---
layout: default
title: Supported Algorithms 
has_children: false
nav_order: 30
---

# Supported algorithms

ML Commons supports various algorithms to help train and predict machine learning (ML) models or test data-driven predictions without a model. This page outlines the algorithms supported by the ML Commons plugin and the API operations they support.

## Common limitations

Except for the Localization algorithm, all of the following algorithms can only support retrieving 10,000 documents from an index as an input.

## K-means

K-means is a simple and popular unsupervised clustering ML algorithm built on top of [Tribuo](https://tribuo.org/) library. K-means will randomly choose centroids, then calculate iteratively to optimize the position of the centroids until each observation belongs to the cluster with the nearest mean.

### Parameters

Parameter | Type   | Description | Default value
:--- |:--- | :--- | :---
`centroids` | integer | The number of clusters in which to group the generated data | `2` 
`iterations` | integer | The number of iterations to perform against the data until a mean generates | `10`
`distance_type` | enum, such as `EUCLIDEAN`, `COSINE`, or `L1` | The type of measurement from which to measure the distance between centroids | `EUCLIDEAN`

### Supported APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/)

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

The training process supports multithreading, but the number of threads must be less than half of the number of CPUs.

## Linear regression

Linear regression maps the linear relationship between inputs and outputs. In ML Commons, the linear regression algorithm is adopted from the public machine learning library [Tribuo](https://tribuo.org/), which offers multidimensional linear regression models. The model supports the linear optimizer in training, including popular approaches like Linear Decay, SQRT_DECAY, [ADA](https://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf), [ADAM](https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/Adam.html), and [RMS_DROP](https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/RMSProp.html). 

### Parameters

Parameter | Type   | Description | Default value
:--- |:--- | :--- | :---
`learningRate` | Double | The initial step size used in an iterative optimization algorithm. | `0.01`
`momentumFactor` | Double | The extra weight factors that accelerate the rate at which the weight is adjusted. This helps move the minimization routine out of local minima.  | `0`
`epsilon` | Double | The value for stabilizing gradient inversion. | `1.00E-06`
`beta1` | Double | The exponential decay rates for the moment estimates. |  `0.9`
`beta2` | Double | The exponential decay rates for the moment estimates. |  `0.99`
`decayRate` | Double | The Root Mean Squared Propagation (RMSProp). | `0.9`
`momentumType` | String | The defined Stochastic Gradient Descent (SGD) momentum type that helps accelerate gradient vectors in the right directions, leading to a fast convergence.| `STANDARD`
`optimizerType` | String | The optimizer used in the model. | `SIMPLE_SGD`


### Supported APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)

### Example

The following example creates a new prediction based on the previously trained linear regression model.

#### Example request

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

#### Example response

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

* Batch RCF: Detects anomalies in non-time-series data. 
* Fixed in time (FIT) RCF: Detects anomalies in time-series data.

### Parameters

RCF supports the following parameters.

#### Batch RCF

Parameter | Type   | Description | Default value
:--- |:--- | :--- | :---
`number_of_trees` | integer | The number of trees in the forest. | `30`
`sample_size` | integer | The same size used by the stream samplers in the forest. | `256`
`output_after` | integer | The number of points required by stream samplers before results return. | `32`
`training_data_size` | integer | The size of your training data. | Dataset size
`anomaly_score_threshold` | double | The threshold of the anomaly score. | `1.0` 

#### Fit RCF

All parameters are optional except `time_field`.

Parameter | Type   | Description | Default value
:--- |:--- | :--- | :---
`number_of_trees` | integer | The number of trees in the forest. | `30`
`shingle_size` | integer | A shingle, or a consecutive sequence of the most recent records. | `8`
`sample_size` | integer | The sample size used by stream samplers in the forest. | `256`
`output_after` | integer | The number of points required by stream samplers before results return. | `32`
`time_decay` | double | The decay factor used by stream samplers in the forest. | `0.0001` 
`anomaly_rate` | double | The anomaly rate. | `0.005`
`time_field` | string | (**Required**) The time field for RCF to use as time-series data. | N/A
`date_format` | string | The date and time format for the `time_field` field. | `yyyy-MM-ddHH:mm:ss`
`time_zone` | string | The time zone for the `time_field` field. | `UTC` 


### Supported APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/)

### Limitations

For FIT RCF, you can train the model with historical data and store the trained model in your index. The model will be deserialized and predict new data points when using the Predict API. However, the model in the index will not be refreshed with new data, because the model is fixed in time.

## RCF Summarize

RCF Summarize is a clustering algorithm based on the Clustering Using Representatives (CURE) algorithm. Compared to [k-means](#k-means), which uses random iterations to cluster, RCF Summarize uses a hierarchical clustering technique. The algorithm starts, with a set of randomly selected centroids larger than the centroids' ground truth distribution. During iteration, centroid pairs too close to each other automatically merge. Therefore, the number of centroids (`max_k`) converge to a rational number of clusters that fits ground truth, as opposed to a fixed `k` number of clusters.  

### Parameters

| Parameter | Type | Description | Default value |
|---|---|---|---|
| `max_k` | Integer | The max allowed number of centroids. | 2 |
| `distance_type` | String. Valid values are `EUCLIDEAN`, `L1`, `L2`, and `LInfinity` | The type of measurement used to measure the distance between centroids. | `EUCLIDEAN` |

### Supported APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)
* [Train and predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/)

### Example: Train and predict

The following example estimates cluster centers and provides cluster labels for each sample in a given data frame.

#### Example request

```json
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

#### Example response

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

Parameter | Type   | Description | Default value
:--- | :--- | :--- | :---
`index_name` | String | The data collection to analyze. | N/A
`attribute_field_names` | List | The fields for entity keys. | N/A
`aggregations` | List  | The fields and aggregation for values. | N/A
`time_field_name` | String | The timestamp field. | `null`
`start_time` | Long | The beginning of the time range. | `0` 
`end_time` | Long | The end of the time range. | 0``
`min_time_interval` | Long | The minimum time interval/scale for analysis. | `0`
`num_outputs` | Integer | The maximum number of values from localization/slicing. | `0`
`filter_query` | Long | (Optional) Reduces the collection of data for analysis. | N/A
anomal`y_star | Time units | (Optional) The time after which the data will be analyzed. | N/A

### Example: Execute localization

The following example executes Localization against an RCA index.

#### Example request

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

#### Example response

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

| Parameter | Type | Description | Default value |
|---|---|---|---|
| `learningRate` | Double | The initial step size used in an iterative optimization algorithm. | `1` |
| `momentumFactor` | Double | The extra weight factors that accelerate the rate at which the weight is adjusted. This helps move the minimization routine out of local minima. | `0` |
| `epsilon` | Double | The value for stabilizing gradient inversion. | `0.1` |
| `beta1` | Double | The exponential decay rates for the moment estimates. | `0.9` |
| `beta2` | Double | The exponential decay rates for the moment estimates. | `0.99` |
| `decayRate` | Double | The Root Mean Squared Propagation (RMSProp). | `0.9` |
| `momentumType` | String | The Stochastic Gradient Descent (SGD) momentum that helps accelerate gradient vectors in the right direction, leading to faster convergence between vectors. | `STANDARD` |
| `optimizerType` | String | The optimizer used in the model.  | `AdaGrad` |
| `target` | String | The target field. | null |
| `objectiveType` | String | The objective function type. | `LogMulticlass` |
| `epochs` | Integer | The number of iterations. | `5` |
| `batchSize` | Integer | The size of min batches. | `1` |
| `loggingInterval` | Integer | The interval of logs lost after many iterations. The interval is `1` if the algorithm contains no logs. | `1000` |

### Supported APIs

* [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
* [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)

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

#### Example response

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

#### Example response

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

## Metrics correlation

The metrics correlation feature is an experimental feature released in OpenSearch 2.7. It can't be used in a production environment. To leave feedback on improving the feature, create an issue in the [ML Commons repository](https://github.com/opensearch-project/ml-commons).
{: .warning }

The metrics correlation algorithm finds events in a set of metrics data. The algorithm defines events as a window in time in which multiple metrics simultaneously display anomalous behavior. When given a set of metrics, the algorithm counts the number of events that occurred, when each event occurred, and determines which metrics were involved in each event.

To enable the metrics correlation algorithm, update the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent" : {
    "plugins.ml_commons.enable_inhouse_python_model": true
  }
}
```

### Parameters

To use the metrics correlation algorithm, include the following parameters.

| Parameter | Type | Description | Default value |
|---|---|---|---|
metrics | Array | A list of metrics within the time series that can be correlated to anomalous behavior | N/A

### Input

The metrics correlation input is an M x T array of metrics data, where M is the number of metrics and T is the length of each individual sequence of metric values. 

When inputting metrics into the algorithm, assume the following:

1. For each metric, the input sequence has the same length, T.
2. All input metrics should have the same corresponding set of timestamps.
3. The total number of data points are M * T <= 10000.

### Example: Simple metrics correlation

The following example inputs the number of metrics (M) as 3 and the number of time steps (T) as 128:

```json
POST /_plugins/_ml/_execute/METRICS_CORRELATION
{"metrics": [[-1.1635416, -1.5003631, 0.46138194, 0.5308311, -0.83149344, -3.7009873, -3.5463789, 0.22571462, -5.0380244, 0.76588845, 1.236113, 1.8460795, 1.7576948, 0.44893077, 0.7363948, 0.70440894, 0.89451003, 4.2006273, 0.3697659, 2.2458954, -2.302939, -1.7706926, 1.7445002, -1.5246059, 0.07985192, -2.7756078, 1.0002468, 1.5977372, 2.9152713, 1.4172368, -0.26551363, -2.2883027, 1.5882446, 2.0145164, 3.4862874, -1.2486862, -2.4811826, -0.17609037, -2.1095612, -1.2184235, 0.63118523, -1.8909532, 2.039797, -0.5317177, -2.2922578, -2.0179775, -0.07992507, -0.12554549, -0.2553092, 1.1450123, -0.4640453, -2.190223, -4.671612, -1.5076426, 1.635445, -1.1394824, -0.7503817, 0.98424894, -0.38896716, 1.0328646, 1.9543738, -0.5236269, 0.14298044, 3.2963762, 8.1641035, 5.717064, 7.4869685, 2.5987444, 11.018798, 9.151356, 5.7354255, 6.862203, 3.0524514, 4.431755, 5.1481285, 7.9548607, 7.4519925, 6.09533, 7.634116, 8.898271, 3.898491, 9.447067, 8.197385, 5.8284273, 5.804283, 7.7688456, 10.574343, 7.5679493, 7.1888094, 7.1107903, 8.454468, 8.066334, 8.83665, 7.11204, 4.4898267, 8.614764, 6.336754, 11.577503, 3.3998494, 9.501525, 13.17289, 6.1116023, 5.143777, 2.7813284, 3.7917604, 7.1683135, 7.627272, 7.290255, 3.1299121, 7.089733, 9.140584, 8.844729, 9.403275, 10.220029, 8.039719, 8.85549, 4.034555, 4.412663, 7.54451, 7.2116737, 4.6346946, 7.0044127, 9.7557, 10.982841, 5.897937, 6.870126, 3.5638695, 5.7872133], [1.3037996, 2.7976995, -0.12042701, 1.3688855, 1.6955005, -2.2575269, 0.080582514, 3.011721, -0.4320283, 3.2440786, -1.0321085, 1.2346085, -2.3152106, -0.9783513, 0.6837618, 1.5320586, -1.6148578, -0.94538075, 0.55978125, -4.7430468, 3.466028, 2.3792691, 1.3269067, -0.35359794, -1.5547276, 0.5202475, 1.0269136, -1.7531714, 0.43987304, -0.18845831, 2.3086758, 2.519588, 2.0116413, 0.019745048, -0.010070452, 2.496933, 1.1557871, 0.08433053, 1.375894, -1.2135965, -1.2588277, -0.31454003, 0.045949124, -1.7518936, -2.3533764, -2.0125146, 0.10255043, 1.1782314, 2.4579153, -0.8780899, -4.1442213, 3.8300152, 2.772975, 2.6803262, 0.9867382, 0.77618766, 0.46541777, 3.8959959, -2.1713195, 0.10609512, -0.26438138, -2.145317, 3.6734529, 1.4830295, -5.3445525, -10.6427765, -8.300354, -1.9608921, -6.6779685, -10.019544, -8.341513, -9.607174, -7.2441607, -3.411102, -6.180552, -8.318714, -6.060591, -7.790343, -5.9695, -7.9429936, -3.775652, -5.2827606, -3.7168224, -6.729588, -9.761094, -7.4683576, -7.2595067, -6.6790915, -9.832726, -8.352172, -6.936336, -8.252518, -6.787475, -9.091013, -11.465944, -6.712504, -8.987438, -6.946672, -8.877166, -6.7854185, -3.6417139, -6.1036086, -5.360772, -4.0435786, -4.5864973, -6.971063, -10.522461, -6.3692527, -4.387658, -9.723745, -4.7020173, -5.097396, -9.903703, -4.882414, -4.1999683, -6.7829437, -6.2555966, -8.121125, -5.334131, -9.174302, -3.9752126, -4.179469, -8.335524, -9.359406, -6.4938803, -6.794677, -8.382997, -9.879416], [1.8792984, -3.1561708, -0.8443318, -1.998743, -0.6319316, 2.4614046, -0.44511616, 0.82785237, 1.7911717, -1.8172283, 0.46574894, -1.8691323, 3.9586513, 0.8078605, 0.9049874, 5.4086914, -0.7425967, -0.20115769, -1.197923, 2.741789, 0.85432875, -1.1688408, -1.7771784, 1.615249, -4.1103697, 0.4721327, -2.75669, -0.38393462, -3.1137516, -2.2572582, 0.9580673, -3.7139492, -0.68303126, 1.6007807, 0.6313973, -2.5115106, 0.703251, 2.4844077, -1.7405633, -3.007687, 2.372802, 2.4684637, 0.6443977, -3.1433117, 0.05976736, -1.9809214, 3.514713, 2.1880944, 1.242541, 1.8236228, 0.8642841, -0.17313614, 1.7042321, 0.8298376, 4.2443194, 0.13983983, 1.1940852, 2.5076652, 39.285202, 82.73858, 44.707516, -4.267148, 0.25930226, 0.20799652, -3.7213502, 1.475217, -1.2394199, -0.0034497892, 1.1413965, 55.18923, -2.2969518, -4.1400924, -2.4707043, 43.193188, -0.19258368, 3.471275, 1.1374166, 1.2147579, 4.13017, -2.0576499, 2.1529694, -0.28360432, 0.8477302, -0.63012695, 1.2569811, 1.943168, 0.17070436, 3.2358394, -2.3737662, 0.77060974, 4.99065, 3.1079204, 3.6347675, 0.6801177, -2.2205186, 1.0961101, -2.4445753, -2.0919478, -2.895031, 2.5458927, 0.38599384, 1.0492333, -0.081834644, -7.4079595, -2.1785216, -0.7277175, -2.7413428, -3.2083786, 3.2958643, -1.1839997, 5.4849496, 2.0259023, 5.607272, -1.0125756, 3.721461, 2.5715313, 0.7741753, -0.55034757, 0.7526307, -2.6758716, -2.964664, -0.57379586, -0.28817406, -3.2334063, -0.22387607, -2.0793931, -6.4562697, 0.80134094]]}
```

#### Example response

The API returns the following information:

- `event_window`: The event interval
- `event_pattern`: The intensity score across the time window and the overall severity of the event
- `suspected_metrics`: The set of metrics involved

In the following example response, each item corresponds to an event discovered in the metrics data. The algorithm finds one event in the input data of the request, as indicated by the output in `event_pattern` having a length of `1`. `event_window` shows that the event occurred between time point $t$ = 52 and $t$ = 72. Lastly, `suspected_metrics` shows that the event involved all three metrics.

```json
{
  "function_name": "METRICS_CORRELATION",
  "output": {
    "inference_results": [
      {
        "event_window": [
          52,
          72
        ],
        "event_pattern": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.99625e-05, 0.0001052875, 0.0002605894, 0.00064648513, 0.0014303402, 0.002980127, 0.005871893, 0.010885878, 0.01904726, 0.031481907, 0.04920215, 0.07283493, 0.10219432, 0.1361888, 0.17257516, 0.20853643, 0.24082609, 0.26901975, 0.28376183, 0.29364157, 0.29541212, 0.2832976, 0.29041746, 0.2574534, 0.2610143, 0.22938538, 0.19999361, 0.18074994, 0.15539801, 0.13064545, 0.10544432, 0.081248805, 0.05965102, 0.041305058, 0.027082501, 0.01676033, 0.009760197, 0.005362286, 0.0027713624, 0.0013381141, 0.0006126331, 0.0002634901, 0.000106459476, 4.0407333e-05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "suspected_metrics": [0,1,2]
      }
    ]
  }
}
```


