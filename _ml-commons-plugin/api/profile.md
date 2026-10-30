---
layout: default
title: Profile
parent: ML APIs
nav_order: 110
---

# ML Profile API

The Profile API returns runtime information about machine learning (ML) tasks and models. Use it to debug model issues at runtime.

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
{% include copy-curl.html %}

To clear all monitoring requests, set `plugins.ml_commons.monitoring_request_count` to `0`. 

## Endpoints

```json
GET /_plugins/_ml/profile
GET /_plugins/_ml/profile/models
GET /_plugins/_ml/profile/models/{model_id}
GET /_plugins/_ml/profile/tasks
GET /_plugins/_ml/profile/tasks/{task_id}
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`model_id` | String | Returns runtime data for a specific model. You can provide multiple model IDs as comma-separated values to retrieve multiple model profiles.
`task_id`| String | Returns runtime data for a specific task. You can provide multiple task IDs as comma-separated values to retrieve multiple task profiles.

### Request body fields

All profile body request fields are optional.

Field | Data type | Description
:--- | :--- | :--- 
`node_ids` | Array | Returns all tasks and profiles from the specified nodes. 
`model_ids` | Array | Returns runtime data for the specified models.
`task_ids` | Array | Returns runtime data for the specified tasks.
`return_all_tasks` | Boolean | Determines whether or not a request returns all tasks. When set to `false`, task profiles are left out of the response.
`return_all_models` | Boolean | Determines whether or not a profile request returns all models. When set to `false`, model profiles are left out of the response.

## Example request: Returning all tasks and models on a specific node

```json
GET /_plugins/_ml/profile
{
  "node_ids": ["KzONM8c8T4Od-NoUANQNGg"],
  "return_all_tasks": true,
  "return_all_models": true
}
```
{% include copy-curl.html %}

## Example response 

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
          "predictor" : "org.opensearch.ml.engine.algorithms.text_embedding.TextEmbeddingDenseModel@592814c9",
          "target_worker_nodes" : [ # nodes planned for deployment
            "KzONM8c8T4Od-NoUANQNGg"
          ],
          "worker_nodes" : [ # routing table
            "KzONM8c8T4Od-NoUANQNGg"
          ],
          "model_inference_stats" : { # model inference latency on this node
            "count" : 2,
            "max" : 88.827301,
            "min" : 4.251,
            "average" : 46.5391505,
            "p50" : 46.5391505,
            "p90" : 80.3683304,
            "p99" : 87.98140399
          },
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
