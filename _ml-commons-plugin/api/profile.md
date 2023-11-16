---
layout: default
title: Profile
parent: ML Commons API
nav_order: 40
---

# Profile

The profile API operation returns runtime information about ML tasks and models. The profile operation can help debug model issues at runtime. 

## The number of requests returned

By default, the Profile API monitors the last 100 requests. To change the number of monitoring requests, update the following cluster setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.ml_commons.monitoring_request_count" : 1000000 
  }
}
```

To clear all monitoring requests, set `plugins.ml_commons.monitoring_request_count` to `0`. 

## Path and HTTP methods

```json
GET /_plugins/_ml/profile
GET /_plugins/_ml/profile/models
GET /_plugins/_ml/profile/tasks
```

## Path parameters

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

#### Example request: Returning all tasks and models on a specific node

```json
GET /_plugins/_ml/profile
{
  "node_ids": ["KzONM8c8T4Od-NoUANQNGg"],
  "return_all_tasks": true,
  "return_all_models": true
}
```
{% include copy-curl.html %}

#### Example response 

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
}
```