---
layout: default
title: Delete task
parent: Tasks APIs
grand_parent: ML Commons API
nav_order: 20
---

# Delete a task

Deletes a task based on the `task_id`.

ML Commons does not check the task status when running the delete request. There is a risk that a currently running task could be deleted before the task completes. To check the status of a task, run `GET /_plugins/_ml/tasks/<task_id>` before task deletion.
{: .note}

### Path and HTTP methods

```json
DELETE /_plugins/_ml/tasks/<task_id>
```

#### Example request

```json
DELETE /_plugins/_ml/tasks/xQRYLX8BydmmU1x6nuD3
```
{% include copy-curl.html %}

#### Example response

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