---
layout: default
title: Delete controller
parent: Controller APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Delete a controller
**Introduced 2.12**
{: .label .label-purple }

Deletes a controller for a model based on the `model_id`.

## Path and HTTP methods

```json
DELETE /_plugins/_ml/controllers/<model_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The model ID of the model for which to delete the controller. |

#### Example request

```json
DELETE /_plugins/_ml/controllers/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index" : ".plugins-ml-controller",
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