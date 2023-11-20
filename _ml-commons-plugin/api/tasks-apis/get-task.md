---
layout: default
title: Get task
parent: Tasks APIs
grand_parent: ML Commons API
nav_order: 10
---

# Get task

To retrieve information about a model, you can:

- [Get a task by ID](#get-a-task-by-id)
- [Search for a task](#search-for-a-task)

## Get a task by ID

You can retrieve information about a task using the `task_id`.

### Path and HTTP methods

```json
GET /_plugins/_ml/tasks/<task_id>
```

#### Example request

```json
GET /_plugins/_ml/tasks/MsBi1YsB0jLkkocYjD5f
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

## Search for a task

Searches tasks based on parameters indicated in the request body.

### Path and HTTP methods

```json
GET /_plugins/_ml/tasks/_search
```

#### Example request: Search for a task in which `function_name` is `KMEANS`

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

#### Example response

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