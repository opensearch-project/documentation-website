---
layout: default
title: API
has_children: false
nav_order: 99
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/index/
---

# ML Commons API 

---

#### Table of contents
- TOC
{:toc}


---

The Machine Learning (ML) commons API lets you train ML algorithms synchronously and asynchronously, make predictions with that trained model, and train and predict with the same data set.

In order to train tasks through the API, three inputs are required. 

- Algorithm name: Must be one of a [FunctionName](https://github.com/opensearch-project/ml-commons/blob/1.3/common/src/main/java/org/opensearch/ml/common/parameter/FunctionName.java). This determines what algorithm the ML Engine runs. To add a new function, see [How To Add a New Function](https://github.com/opensearch-project/ml-commons/blob/main/docs/how-to-add-new-function.md).
- Model hyper parameters: Adjust these parameters to make the model train better.  
- Input data: The data input that trains the ML model, or applies the ML models to predictions. You can input data in two ways, query against your index or use data frame.

## Train model

Training can occur both synchronously and asynchronously.

### Request 

The following examples use the kmeans algorithm to train index data.

**Train with kmeans synchronously** 

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

**Train with kmeans asynchronously**

```json
POST /_plugins/_ml/_train/kmeans?async=true
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

### Response

**Synchronously**

For synchronous responses, the API returns the model_id, which can be used to get or delete a model.

```json
{
  "model_id" : "lblVmX8BO5w8y8RaYYvN",
  "status" : "COMPLETED"
}
```

**Asynchronously**

For asynchronous responses, the API returns the task_id, which can be used to get or delete a task.

```json
{
  "task_id" : "lrlamX8BO5w8y8Ra2otd",
  "status" : "CREATED"
}
```

## Get model information

You can retrieve information on your model using the model_id.

```json
GET /_plugins/_ml/models/<model-id>
```

The API returns information on the model, the algorithm used, and the content found within the model.

```json
{
  "name" : "KMEANS",
  "algorithm" : "KMEANS",
  "version" : 1,
  "content" : ""
}
```

## Search model

Use this command to search models you're already created.


```json
POST /_plugins/_ml/models/_search
{query}
```

### Example: Query all models

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```

### Example: Query models with algorithm "FIT_RCF"

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "term": {
      "algorithm": {
        "value": "FIT_RCF"
      }
    }
  }
}
```

### Response

```json
{
    "took" : 8,
    "timed_out" : false,
    "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
    },
    "hits" : {
      "total" : {
        "value" : 2,
        "relation" : "eq"
      },
      "max_score" : 2.4159138,
      "hits" : [
        {
          "_index" : ".plugins-ml-model",
          "_id" : "-QkKJX8BvytMh9aUeuLD",
          "_version" : 1,
          "_seq_no" : 12,
          "_primary_term" : 15,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        },
        {
          "_index" : ".plugins-ml-model",
          "_id" : "OxkvHn8BNJ65KnIpck8x",
          "_version" : 1,
          "_seq_no" : 2,
          "_primary_term" : 8,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        }
      ]
    }
  }
```

## Delete model

Deletes a model based on the model_id

```json
DELETE /_plugins/_ml/models/<model_id>
```

The API returns the following:

```json
{
  "_index" : ".plugins-ml-model",
  "_id" : "MzcIJX8BA7mbufL6DOwl",
  "_version" : 2,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 27,
  "_primary_term" : 18
}
```

## Predict

ML Commons can predict new data with your trained model either from indexed data or a data frame. To use the Predict API, the `model_id` is required.

```json
POST /_plugins/_ml/_predict/<algorithm_name>/<model_id>
```

### Request

```json
POST /_plugins/_ml/_predict/kmeans/<model-id>
{
    "input_query": {
        "_source": ["petal_length_in_cm", "petal_width_in_cm"],
        "size": 10000
    },
    "input_index": [
        "iris_data"
    ]
}
```

### Response

```json
{
  "status" : "COMPLETED",
  "prediction_result" : {
    "column_metas" : [
      {
        "name" : "ClusterID",
        "column_type" : "INTEGER"
      }
    ],
    "rows" : [
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      }
    ]
  }
```


## Train and predict

Use to train and then immediately predict against the same training data set. Can only be used with unsupervised learning models and the following algorithms:

- BATCH_RCF
- FIT_RCF
- kmeans

### Example: Train and predict with indexed data


```json
POST /_plugins/_ml/_train_predict/kmeans
{
    "parameters": {
        "centroids": 2,
        "iterations": 10,
        "distance_type": "COSINE"
    },
    "input_query": {
        "query": {
            "bool": {
                "filter": [
                    {
                        "range": {
                            "k1": {
                                "gte": 0
                            }
                        }
                    }
                ]
            }
        },
        "size": 10
    },
    "input_index": [
        "test_data"
    ]
}
```

### Example: Train and predict with data directly

```json
POST /_plugins/_ml/_train_predict/kmeans
{
    "parameters": {
        "centroids": 2,
        "iterations": 1,
        "distance_type": "EUCLIDEAN"
    },
    "input_data": {
        "column_metas": [
            {
                "name": "k1",
                "column_type": "DOUBLE"
            },
            {
                "name": "k2",
                "column_type": "DOUBLE"
            }
        ],
        "rows": [
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 2.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 4.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 0.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 2.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 4.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 0.00
                    }
                ]
            }
        ]
    }
}
```

### Response

```json
{
  "status" : "COMPLETED",
  "prediction_result" : {
    "column_metas" : [
      {
        "name" : "ClusterID",
        "column_type" : "INTEGER"
      }
    ],
    "rows" : [
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      }
    ]
  }
}
```

## Get task information

You can retrieve information about a task using the task_id.

```json
GET /_plugins/_ml/tasks/<task_id>
```

The response includes information about the task.

```json
{
  "model_id" : "l7lamX8BO5w8y8Ra2oty",
  "task_type" : "TRAINING",
  "function_name" : "KMEANS",
  "state" : "COMPLETED",
  "input_type" : "SEARCH_QUERY",
  "worker_node" : "54xOe0w8Qjyze00UuLDfdA",
  "create_time" : 1647545342556,
  "last_update_time" : 1647545342587,
  "is_async" : true
}
```

## Search task

Search tasks based on parameters indicated in the request body.

```json
GET /_plugins/_ml/tasks/_search
{query body}
```


### Example: Search task which "function_name" is "KMEANS"

```json
GET /_plugins/_ml/tasks/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "function_name": "KMEANS"
          }
        }
      ]
    }
  }
}
```

### Response

```json
{
  "took" : 12,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : ".plugins-ml-task",
        "_id" : "_wnLJ38BvytMh9aUi-Ia",
        "_version" : 4,
        "_seq_no" : 29,
        "_primary_term" : 4,
        "_score" : 0.0,
        "_source" : {
          "last_update_time" : 1645640125267,
          "create_time" : 1645640125209,
          "is_async" : true,
          "function_name" : "KMEANS",
          "input_type" : "SEARCH_QUERY",
          "worker_node" : "jjqFrlW7QWmni1tRnb_7Dg",
          "state" : "COMPLETED",
          "model_id" : "AAnLJ38BvytMh9aUi-M2",
          "task_type" : "TRAINING"
        }
      },
      {
        "_index" : ".plugins-ml-task",
        "_id" : "wwRRLX8BydmmU1x6I-AI",
        "_version" : 3,
        "_seq_no" : 38,
        "_primary_term" : 7,
        "_score" : 0.0,
        "_source" : {
          "last_update_time" : 1645732766656,
          "create_time" : 1645732766472,
          "is_async" : true,
          "function_name" : "KMEANS",
          "input_type" : "SEARCH_QUERY",
          "worker_node" : "A_IiqoloTDK01uZvCjREaA",
          "state" : "COMPLETED",
          "model_id" : "xARRLX8BydmmU1x6I-CG",
          "task_type" : "TRAINING"
        }
      }
    ]
  }
}
```

## Delete task

Delete a task based on the task_id.

ML Commons does not check the task status when running the `Delete` request. There is a risk that a currently running task could be deleted before the task completes. To check the status of a task, run `GET /_plugins/_ml/tasks/<task_id>` before task deletion.
{: .note}

```json
DELETE /_plugins/_ml/tasks/{task_id}
```

The API returns the following:

```json
{
  "_index" : ".plugins-ml-task",
  "_id" : "xQRYLX8BydmmU1x6nuD3",
  "_version" : 4,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 42,
  "_primary_term" : 7
}
```

## Stats

Get statistics related to the number of tasks. 

To receive all stats, use:

```json
GET /_plugins/_ml/stats
```

To receive stats for a specific node, use:

```json
GET /_plugins/_ml/<nodeId>/stats/
```

To receive stats for a specific node and  return a specified stat, use:

```json
GET /_plugins/_ml/<nodeId>/stats/<stat>
```

To receive information on a specific stat from all nodes, use:

```json
GET /_plugins/_ml/stats/<stat>
```


### Example: Get all stats

```json
GET /_plugins/_ml/stats
```

### Response

```json
{
  "zbduvgCCSOeu6cfbQhTpnQ" : {
    "ml_executing_task_count" : 0
  },
  "54xOe0w8Qjyze00UuLDfdA" : {
    "ml_executing_task_count" : 0
  },
  "UJiykI7bTKiCpR-rqLYHyw" : {
    "ml_executing_task_count" : 0
  },
  "zj2_NgIbTP-StNlGZJlxdg" : {
    "ml_executing_task_count" : 0
  },
  "jjqFrlW7QWmni1tRnb_7Dg" : {
    "ml_executing_task_count" : 0
  },
  "3pSSjl5PSVqzv5-hBdFqyA" : {
    "ml_executing_task_count" : 0
  },
  "A_IiqoloTDK01uZvCjREaA" : {
    "ml_executing_task_count" : 0
  }
}
```

## Execute

Some algorithms, such as [Localization]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms#localization), don't require trained models. You can run no-model-based algorithms using the `execute` API.

```json
POST _plugins/_ml/_execute/<algorithm_name>
```

### Example: Execute localization 

The following example uses the Localization algorithm to find subset-level information for aggregate data (for example, aggregated over time) that demonstrates the activity of interest, such as spikes, drops, changes, or anomalies.

```json
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

Upon execution, the API returns the following:

```json
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
                "key" : [
                  "attr2"
                ],
                "contribution_value" : 1.0,
                "base_value" : 4.0,
                "new_value" : 5.0
              },
              {
                "key" : [
                  "attr3"
                ],
                "contribution_value" : 1.0,
                "base_value" : 5.0,
                "new_value" : 6.0
              },
              {
                "key" : [
                  "attr4"
                ],
                "contribution_value" : 1.0,
                "base_value" : 6.0,
                "new_value" : 7.0
              },
              {
                "key" : [
                  "attr5"
                ],
                "contribution_value" : 1.0,
                "base_value" : 7.0,
                "new_value" : 8.0
              },
              {
                "key" : [
                  "attr6"
                ],
                "contribution_value" : 1.0,
                "base_value" : 8.0,
                "new_value" : 9.0
              },
              {
                "key" : [
                  "attr7"
                ],
                "contribution_value" : 1.0,
                "base_value" : 9.0,
                "new_value" : 10.0
              },
              {
                "key" : [
                  "attr8"
                ],
                "contribution_value" : 1.0,
                "base_value" : 10.0,
                "new_value" : 11.0
              },
              {
                "key" : [
                  "attr9"
                ],
                "contribution_value" : 1.0,
                "base_value" : 11.0,
                "new_value" : 12.0
              }
            ]
          },
          ...
        ]
      }
    }
  ]
}
```

