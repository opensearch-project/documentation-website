---
layout: default
title: Get task
parent: Tasks APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Get Task API

You can retrieve information about a task using the `task_id`.

## Endpoints

```json
GET /_plugins/_ml/tasks/<task_id>
```

## Example request

```json
GET /_plugins/_ml/tasks/MsBi1YsB0jLkkocYjD5f
```
{% include copy-curl.html %}

## Example response

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
