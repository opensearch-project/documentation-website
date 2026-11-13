---
layout: default
title: Undeploy model
parent: Model APIs
grand_parent: ML APIs
nav_order: 45
---

# Undeploy Model API

To undeploy a model from memory, use the undeploy operation.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
POST /_plugins/_ml/models/{model_id}/_undeploy
POST /_plugins/_ml/models/_undeploy
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The ID of the model to undeploy. If you use the `/_plugins/_ml/models/_undeploy` endpoint, provide the model IDs in the `model_ids` request body field. |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `model_ids` | Array | A list of IDs of the models to undeploy. Required if you use the `/_plugins/_ml/models/_undeploy` endpoint. If model access control is enabled, you can specify only one model ID per request. |
| `node_ids` | Array | A list of node IDs from which to undeploy the models. If omitted, the models are undeployed from all nodes. Requires `plugins.ml_commons.allow_custom_deployment_plan` to be set to `true`. |

## Example request: Undeploying a model from all ML nodes

```json
POST /_plugins/_ml/models/MGqJhYMBbbh0ushjm8p_/_undeploy
```
{% include copy-curl.html %}

## Example request: Undeploying specific models from specific nodes

```json
POST /_plugins/_ml/models/_undeploy
{
  "node_ids": ["sv7-3CbwQW-4PiIsDOfLxQ"],
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

## Example request: Undeploying specific models from all nodes

```json
POST /_plugins/_ml/models/_undeploy
{
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "sv7-3CbwQW-4PiIsDOfLxQ" : {
    "stats" : {
      "KDo2ZYQB-v9VEDwdjkZ4" : "undeployed"
    }
  }
}
```

If a model is not deployed on a node, the status for that model is `not_found`.

## Automatically undeploy a model based on TTL

Models can be automatically undeployed from memory based on the predefined time-to-live (TTL) when the model was last accessed or used. To define a TTL that automatically undeploys a model, include the following `ModelDeploySetting` in your machine learning (ML) model. Note that model TTLs are checked periodically by a `sync_up` cron job, so the maximum time that a model lives in memory could be TTL + the `sync_up` job interval. The default cron job interval is 10 seconds. To update the cron job internally, use the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.sync_up_job_interval_in_seconds": 10
    }
}
```
{% include copy-curl.html %}

## Example request: Creating a model with a TTL
```json
POST /_plugins/_ml/models/_register
 {
   "name": "Sample Model Name",
   "function_name": "remote",
   "description": "test model",
   "connector_id": "-g1nOo8BOaAC5MIJ3_4R",
   "deploy_setting": {"model_ttl_minutes": 100}
 }
```
{% include copy-curl.html %}

## Example request: Updating a model with a TTL when the model is undeployed
```json
PUT /_plugins/_ml/models/COj7K48BZzNMh1sWedLK
{
    "deploy_setting": {"model_ttl_minutes" : 100}
}
```
{% include copy-curl.html %}
