---
layout: default
title: Stats 
parent: ML APIs
nav_order: 120
---

# ML Stats API

The Stats API returns basic machine learning (ML) statistics, such as the number of running tasks. To monitor machine learning workflows using more detailed time-series metrics, see [Monitoring machine learning workflows]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/metrics/#monitoring-machine-learning-workflows).
{: .note }

The response contains cluster-level statistics, such as the ML index status and the number of models, and node-level statistics, such as the number of requests, broken down by algorithm and model.

## Endpoints

```json
GET /_plugins/_ml/stats
GET /_plugins/_ml/stats/{stat}
GET /_plugins/_ml/{nodeId}/stats/
GET /_plugins/_ml/{nodeId}/stats/{stat}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `nodeId` | String | A comma-separated list of node IDs for which to return statistics. If omitted, statistics for all nodes are returned. |
| `stat` | String | A comma-separated list of statistics to return. Valid cluster-level values are `ml_model_index_status`, `ml_connector_index_status`, `ml_config_index_status`, `ml_task_index_status`, `ml_controller_index_status`, `ml_model_count`, and `ml_connector_count`. Valid node-level values are `ml_jvm_heap_usage`, `ml_executing_task_count`, `ml_request_count`, `ml_failure_count`, `ml_deployed_model_count`, and `ml_circuit_breaker_trigger_count`. |

## Request body fields

You can also filter statistics by providing the following optional fields in the request body.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `target_stat_levels` | Array | The levels of statistics to return. Valid values are `cluster`, `node`, `algorithm`, `model`, and `action`. |
| `cluster_level_stats` | Array | The cluster-level statistics to return. For valid values, see the `stat` path parameter. |
| `node_level_stats` | Array | The node-level statistics to return. For valid values, see the `stat` path parameter. |
| `action_level_stats` | Array | The action-level statistics to return. Valid values are `ml_action_request_count` and `ml_action_failure_count`. |
| `node_ids` | Array | The IDs of the nodes for which to return statistics. |
| `algorithms` | Array | The algorithms for which to return statistics, for example, `kmeans` or `text_embedding`. |
| `models` | Array | The IDs of the models for which to return statistics. |
| `actions` | Array | The actions for which to return statistics. Valid values are `train`, `predict`, `train_predict`, `execute`, `register`, `deploy`, `undeploy`, and `batch_predict`. |

## Example request: Get all stats for all nodes

```json
GET /_plugins/_ml/stats
```
{% include copy-curl.html %}

## Example response

```json
{
  "ml_controller_index_status" : "non-existent",
  "ml_task_index_status" : "green",
  "ml_config_index_status" : "green",
  "ml_connector_index_status" : "green",
  "ml_model_count" : 13,
  "ml_connector_count" : 1,
  "ml_model_index_status" : "green",
  "nodes" : {
    "zbduvgCCSOeu6cfbQhTpnQ" : {
      "ml_jvm_heap_usage" : 77,
      "ml_failure_count" : 0,
      "ml_executing_task_count" : 0,
      "ml_request_count" : 69,
      "ml_circuit_breaker_trigger_count" : 0,
      "ml_deployed_model_count" : 3,
      "algorithms" : {
        "text_embedding" : {
          "predict" : {
            "ml_action_request_count" : 2
          },
          "deploy" : {
            "ml_action_request_count" : 3
          },
          "register" : {
            "ml_action_request_count" : 6
          }
        },
        "kmeans" : {
          "train" : {
            "ml_action_request_count" : 3
          }
        },
        ...
      },
      "models" : {
        "GtrMP6EBzLnYocCrLsvl" : {
          "predict" : {
            "ml_action_request_count" : 2
          },
          "deploy" : {
            "ml_action_request_count" : 2
          }
        },
        ...
      }
    }
  }
}
```

## Example request: Get all stats for a specific node

```json
GET /_plugins/_ml/{nodeId}/stats/
```
{% include copy-curl.html %}

## Example request: Get a specified stat for a specific node 

```json
GET /_plugins/_ml/{nodeId}/stats/{stat}
```
{% include copy-curl.html %}

## Example request: Get a specified stat for all nodes

```json
GET /_plugins/_ml/stats/{stat}
```
{% include copy-curl.html %}

## Example request: Filter statistics using the request body

```json
GET /_plugins/_ml/stats
{
  "target_stat_levels": ["node", "algorithm"],
  "node_level_stats": ["ml_request_count"],
  "algorithms": ["kmeans"],
  "actions": ["train"]
}
```
{% include copy-curl.html %}
