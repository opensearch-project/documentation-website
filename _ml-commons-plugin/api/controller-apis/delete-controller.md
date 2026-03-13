---
layout: default
title: Delete controller
parent: Controller APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Delete Controller API
**Introduced 2.12**
{: .label .label-purple }

Use this API to delete a controller for a model based on the `model_id`.

## Endpoints

```json
DELETE /_plugins/_ml/controllers/<model_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The model ID of the model for which to delete the controller. |

## Example request

```json
DELETE /_plugins/_ml/controllers/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

## Example response

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

## Error responses

If you attempt to delete a controller when the controller index doesn't exist, OpenSearch returns a 404 Not Found error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "index_not_found_exception",
        "reason": "no such index [.plugins-ml-controller]",
        "index": ".plugins-ml-controller",
        "resource.id": ".plugins-ml-controller",
        "resource.type": "index_expression",
        "index_uuid": "_na_"
      }
    ],
    "type": "index_not_found_exception",
    "reason": "no such index [.plugins-ml-controller]",
    "index": ".plugins-ml-controller",
    "resource.id": ".plugins-ml-controller",
    "resource.type": "index_expression",
    "index_uuid": "_na_"
  },
  "status": 404
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/controllers/delete`.