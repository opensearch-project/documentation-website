---
layout: default
title: Undeploy model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/model-apis/undeploy-model/
---

# Undeploy a model

To undeploy a model from memory, use the undeploy operation.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

### Endpoints

```json
POST /_plugins/_ml/models/<model_id>/_undeploy
```

#### Example request: Undeploying a model from all ML nodes

```json
POST /_plugins/_ml/models/MGqJhYMBbbh0ushjm8p_/_undeploy
```
{% include copy-curl.html %}

#### Example request: Undeploying specific models from specific nodes

```json
POST /_plugins/_ml/models/_undeploy
{
  "node_ids": ["sv7-3CbwQW-4PiIsDOfLxQ"],
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

#### Example request: Undeploying specific models from all nodes

```json
{
  "model_ids": ["KDo2ZYQB-v9VEDwdjkZ4"]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "sv7-3CbwQW-4PiIsDOfLxQ" : {
    "stats" : {
      "KDo2ZYQB-v9VEDwdjkZ4" : "UNDEPLOYED"
    }
  }
}
```
### Automatically undeploy a model based on TTL

Starting with OpenSearch  2.14, models can be automatically undeployed from memory based on the predefined time-to-live (TTL) when the model was last accessed or used. To define a TTL that automatically undeploys a model, include the following `ModelDeploySetting` in your machine learning (ML) model. Note that model TTLs are checked periodically by a `syn_up` cron job, so the maximum time that a model lives in memory could be TTL + the `sync_up_job_` interval. The default cron job interval is 10 seconds. To update the cron job internally, use the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.sync_up_job_interval_in_seconds": 10
    }
}
```

#### Example request: Creating a model with a TTL
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

#### Example request: Updating a model with a TTL when the model is undeployed
```json
PUT /_plugins/_ml/models/COj7K48BZzNMh1sWedLK
{
    "deploy_setting": {"model_ttl_minutes" : 100}
}
```
