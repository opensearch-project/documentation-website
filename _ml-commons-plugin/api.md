---
layout: default
title: API
has_children: false
nav_order: 99
---

# ML Commons API 

---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

The ML Commons API lets you train machine learning (ML) algorithms synchronously and asynchronously, make predictions with that trained model, and train and predict with the same dataset.

To train tasks through the API, three inputs are required: 

- Algorithm name: Must be one of a [FunctionName](https://github.com/opensearch-project/ml-commons/blob/1.3/common/src/main/java/org/opensearch/ml/common/parameter/FunctionName.java). This determines what algorithm the ML Engine runs. To add a new function, see [How To Add a New Function](https://github.com/opensearch-project/ml-commons/blob/main/docs/how-to-add-new-function.md).
- Model hyperparameters: Adjust these parameters to improve model accuracy.  
- Input data: The data that trains the ML model, or applies the ML models to predictions. You can input data in two ways, query against your index or use a data frame.

## Model access control considerations

For clusters with model access control enabled, users can perform API operations on models in model groups with specified access levels as follows:

- `public` model group: Any user.
- `restricted` model group: Only the model owner or users who share at least one backend role with the model group.
- `private` model group: Only the model owner. 

For clusters with model access control disabled, any user can perform API operations on models in any model group. 

Admin users can perform API operations for models in any model group. 

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).


## Training the model

The train API operation trains a model based on a selected algorithm. Training can occur both synchronously and asynchronously.

### Request 

The following examples use the k-means algorithm to train index data.

**Train with k-means synchronously** 

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
{% include copy-curl.html %}

**Train with k-means asynchronously**

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
{% include copy-curl.html %}

### Response

**Synchronous**

For synchronous responses, the API returns the `model_id`, which can be used to get or delete a model.

```json
{
  "model_id" : "lblVmX8BO5w8y8RaYYvN",
  "status" : "COMPLETED"
}
```

**Asynchronous**

For asynchronous responses, the API returns the `task_id`, which can be used to get or delete a task.

```json
{
  "task_id" : "lrlamX8BO5w8y8Ra2otd",
  "status" : "CREATED"
}
```

## Getting model information

You can retrieve model information using the `model_id`.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

```json
GET /_plugins/_ml/models/<model-id>
```
{% include copy-curl.html %}

The response contains the following model information:

```json
{
"name" : "all-MiniLM-L6-v2_onnx",
"algorithm" : "TEXT_EMBEDDING",
"version" : "1",
"model_format" : "TORCH_SCRIPT",
"model_state" : "LOADED",
"model_content_size_in_bytes" : 83408741,
"model_content_hash_value" : "9376c2ebd7c83f99ec2526323786c348d2382e6d86576f750c89ea544d6bbb14",
"model_config" : {
    "model_type" : "bert",
    "embedding_dimension" : 384,
    "framework_type" : "SENTENCE_TRANSFORMERS",
    "all_config" : """{"_name_or_path":"nreimers/MiniLM-L6-H384-uncased","architectures":["BertModel"],"attention_probs_dropout_prob":0.1,"gradient_checkpointing":false,"hidden_act":"gelu","hidden_dropout_prob":0.1,"hidden_size":384,"initializer_range":0.02,"intermediate_size":1536,"layer_norm_eps":1e-12,"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6,"pad_token_id":0,"position_embedding_type":"absolute","transformers_version":"4.8.2","type_vocab_size":2,"use_cache":true,"vocab_size":30522}"""
},
"created_time" : 1665961344044,
"last_uploaded_time" : 1665961373000,
"last_loaded_time" : 1665961815959,
"total_chunks" : 9
}
```

## Registering a model

Before you register a model, you must [register a model group]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#registering-a-model-group) for the model.
{: .important} 

All versions of a particular model are held in a model group. After you register a model group, you can register a model to the model group. ML Commons splits the model into smaller chunks and saves those chunks in the model's index.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

```json
POST /_plugins/_ml/models/_register
```
{% include copy-curl.html %}

### Request fields

All request fields are required. 

Field | Data type | Description
:---  | :--- | :--- 
`name`| String | The model's name. |
`version` | Integer | The model's version number. |
`model_format` | String | The portable format of the model file. Currently only supports `TORCH_SCRIPT`. |
`model_group_id` | String | The model group ID for the model. 
`model_content_hash_value` | String | The model content hash generated using the SHA-256 hashing algorithm.
`model_config`  | JSON object | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. `all_config` is an optional JSON string that contains all model configurations. |
`url` | String | The URL that contains the model. |

### Example

The following example request registers a version `1.0.0` of an NLP sentence transformation model named `all-MiniLM-L6-v2`.

```json
POST /_plugins/_ml/models/_register
{
    "name": "all-MiniLM-L6-v2",
    "version": "1.0.0",
    "description": "test model",
    "model_format": "TORCH_SCRIPT",
    "model_group_id": "FTNlQ4gBYW0Qyy5ZoxfR",
    "model_content_hash_value": "c15f0d2e62d872be5b5bc6c84d2e0f4921541e29fefbef51d59cc10a8ae30e0f",
    "model_config": {
        "model_type": "bert",
        "embedding_dimension": 384,
        "framework_type": "sentence_transformers",
       "all_config": "{\"_name_or_path\":\"nreimers/MiniLM-L6-H384-uncased\",\"architectures\":[\"BertModel\"],\"attention_probs_dropout_prob\":0.1,\"gradient_checkpointing\":false,\"hidden_act\":\"gelu\",\"hidden_dropout_prob\":0.1,\"hidden_size\":384,\"initializer_range\":0.02,\"intermediate_size\":1536,\"layer_norm_eps\":1e-12,\"max_position_embeddings\":512,\"model_type\":\"bert\",\"num_attention_heads\":12,\"num_hidden_layers\":6,\"pad_token_id\":0,\"position_embedding_type\":\"absolute\",\"transformers_version\":\"4.8.2\",\"type_vocab_size\":2,\"use_cache\":true,\"vocab_size\":30522}"
    },
    "url": "https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L6-v2-1.0.1-torch_script.zip"
}
```
{% include copy-curl.html %}

### Response

OpenSearch responds with the `task_id` and task `status`.

```json
{
  "task_id" : "ew8I44MBhyWuIwnfvDIH", 
  "status" : "CREATED"
}
```

To see the status of your model registration and retrieve the model ID created for the new model version, pass the `task_id` as a path parameter to the Tasks API:

```json
GET /_plugins/_ml/tasks/<task_id>
```
{% include copy-curl.html %}

The response contains the model ID of the model version:

```json
{
  "model_id": "Qr1YbogBYOqeeqR7sI9L",
  "task_type": "DEPLOY_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "N77RInqjTSq_UaLh1k0BUg"
  ],
  "create_time": 1685478486057,
  "last_update_time": 1685478491090,
  "is_async": true
}
```

## Deploying a model

The deploy model operation reads the model's chunks from the model index and then creates an instance of the model to cache into memory. This operation requires the `model_id`.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

```json
POST /_plugins/_ml/models/<model_id>/_deploy
```

### Example: Deploying to all available ML nodes

In this example request, OpenSearch deploys the model to any available OpenSearch ML node:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
```
{% include copy-curl.html %}

### Example: Deploying to a specific node

If you want to reserve the memory of other ML nodes within your cluster, you can deploy your model to a specific node(s) by specifying the `node_ids` in the request body:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
{
    "node_ids": ["4PLK7KJWReyX0oWKnBA8nA"]
}
```
{% include copy-curl.html %}

### Response

```json
{
  "task_id" : "hA8P44MBhyWuIwnfvTKP",
  "status" : "DEPLOYING"
}
```

## Undeploying a model

To undeploy a model from memory, use the undeploy operation.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

```json
POST /_plugins/_ml/models/<model_id>/_undeploy
```

### Example: Undeploying model from all ML nodes

```json
POST /_plugins/_ml/models/MGqJhYMBbbh0ushjm8p_/_undeploy
```
{% include copy-curl.html %}

### Response: Undeploying a model from all ML nodes

```json
{
    "s5JwjZRqTY6nOT0EvFwVdA": {
        "stats": {
            "MGqJhYMBbbh0ushjm8p_": "UNDEPLOYED"
        }
    }
}
```

### Example: Undeploying specific models from specific nodes

```json
POST /_plugins/_ml/models/_undeploy
{
  "node_ids": ["sv7-3CbwQW-4PiIsDOfLxQ"],
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

### Response: Undeploying specific models from specific nodes

```json
{
  "sv7-3CbwQW-4PiIsDOfLxQ" : {
    "stats" : {
      "KDo2ZYQB-v9VEDwdjkZ4" : "UNDEPLOYED"
    }
  }
}
```

### Response: Undeploying all models from specific nodes

```json
{
  "sv7-3CbwQW-4PiIsDOfLxQ" : {
    "stats" : {
      "KDo2ZYQB-v9VEDwdjkZ4" : "UNDEPLOYED",
      "-8o8ZYQBvrLMaN0vtwzN" : "UNDEPLOYED"
    }
  }
}
```

### Example: Undeploying specific models from all nodes

```json
{
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

### Response: Undeploying specific models from all nodes

```json
{
  "sv7-3CbwQW-4PiIsDOfLxQ" : {
    "stats" : {
      "KDo2ZYQB-v9VEDwdjkZ4" : "UNDEPLOYED"
    }
  }
}
```

## Searching for a model

Use this command to search for models you've already created.

The response will contain only those model versions to which you have access. For example, if you send a match all query, model versions for the following model group types will be returned:

- All public model groups in the index.
- Private model groups for which you are the model owner.
- Model groups that share at least one backend role with your backend roles.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

### Path and HTTP methods

```json
POST /_plugins/_ml/models/_search
{query}
```

### Example: Searching for all models

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

### Example: Searching for models with algorithm "FIT_RCF"

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
{% include copy-curl.html %}

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

## Deleting a model

Deletes a model based on the `model_id`.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

```json
DELETE /_plugins/_ml/models/<model_id>
```
{% include copy-curl.html %}

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

## Profile

The profile operation returns runtime information on ML tasks and models. The profile operation can help debug issues with models at runtime.


```json
GET /_plugins/_ml/profile
GET /_plugins/_ml/profile/models
GET /_plugins/_ml/profile/tasks
```

### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`model_id` | String | Returns runtime data for a specific model. You can string together multiple `model_id`s to return multiple model profiles.
`tasks`| String | Returns runtime data for a specific task. You can string together multiple `task_id`s to return multiple task profiles.

### Request fields

All profile body request fields are optional.

Field | Data type | Description
:--- | :--- | :--- 
`node_ids` | String | Returns all tasks and profiles from a specific node. 
`model_ids` | String | Returns runtime data for a specific model. You can string together multiple model IDs to return multiple model profiles.
`task_ids` | String | Returns runtime data for a specific task. You can string together multiple task IDs to return multiple task profiles.
`return_all_tasks` | Boolean | Determines whether or not a request returns all tasks. When set to `false`, task profiles are left out of the response.
`return_all_models` | Boolean | Determines whether or not a profile request returns all models. When set to `false`, model profiles are left out of the response.

### Example: Returning all tasks and models on a specific node

```json
GET /_plugins/_ml/profile
{
  "node_ids": ["KzONM8c8T4Od-NoUANQNGg"],
  "return_all_tasks": true,
  "return_all_models": true
}
```
{% include copy-curl.html %}

### Response: Returning all tasks and models on a specific node

```json
{
  "nodes" : {
    "qTduw0FJTrmGrqMrxH0dcA" : { # node id
      "models" : {
        "WWQI44MBbzI2oUKAvNUt" : { # model id
          "worker_nodes" : [ # routing table
            "KzONM8c8T4Od-NoUANQNGg"
          ]
        }
      }
    },
...
    "KzONM8c8T4Od-NoUANQNGg" : { # node id
      "models" : {
        "WWQI44MBbzI2oUKAvNUt" : { # model id
          "model_state" : "DEPLOYED", # model status
          "predictor" : "org.opensearch.ml.engine.algorithms.text_embedding.TextEmbeddingModel@592814c9",
          "worker_nodes" : [ # routing table
            "KzONM8c8T4Od-NoUANQNGg"
          ],
          "predict_request_stats" : { # predict request stats on this node
            "count" : 2, # total predict requests on this node
            "max" : 89.978681, # max latency in milliseconds
            "min" : 5.402,
            "average" : 47.6903405,
            "p50" : 47.6903405,
            "p90" : 81.5210129,
            "p99" : 89.13291418999998
          }
        }
      }
    },
...
}
```


## Predict

ML Commons can predict new data with your trained model either from indexed data or a data frame. To use the Predict API, the `model_id` is required.

For information about user access for this API, see [Model access control considerations](#model-access-control-considerations).

### Path and HTTP methods

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
{% include copy-curl.html %}

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

Use to train and then immediately predict against the same training dataset. Can only be used with unsupervised learning models and the following algorithms:

- BATCH_RCF
- FIT_RCF
- k-means

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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

## Getting task information

You can retrieve information about a task using the task_id.

```json
GET /_plugins/_ml/tasks/<task_id>
```
{% include copy-curl.html %}

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

## Searching for a task

Search tasks based on parameters indicated in the request body.

```json
GET /_plugins/_ml/tasks/_search
{query body}
```


### Example: Search task which `function_name` is `KMEANS`

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
{% include copy-curl.html %}

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

## Deleting a task

Delete a task based on the task_id.

ML Commons does not check the task status when running the `Delete` request. There is a risk that a currently running task could be deleted before the task completes. To check the status of a task, run `GET /_plugins/_ml/tasks/<task_id>` before task deletion.
{: .note}

```json
DELETE /_plugins/_ml/tasks/{task_id}
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

To receive stats for a specific node, use:

```json
GET /_plugins/_ml/<nodeId>/stats/
```
{% include copy-curl.html %}

To receive stats for a specific node and return a specified stat, use:

```json
GET /_plugins/_ml/<nodeId>/stats/<stat>
```
{% include copy-curl.html %}

To receive information on a specific stat from all nodes, use:

```json
GET /_plugins/_ml/stats/<stat>
```
{% include copy-curl.html %}


### Example: Get all stats

```json
GET /_plugins/_ml/stats
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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

