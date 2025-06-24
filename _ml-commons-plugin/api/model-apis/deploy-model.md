---
layout: default
title: Deploy model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/model-apis/deploy-model/
---

# Deploy a model

The deploy model operation reads the model's chunks from the model index and then creates an instance of the model to cache in memory. This operation requires the `model_id`. 

Starting with OpenSearch version 2.13, [externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index) are deployed automatically by default when you send a Predict API request for the first time. To disable automatic deployment for an externally hosted model, set `plugins.ml_commons.model_auto_deploy.enable` to `false`:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.model_auto_deploy.enable": "false"
  }
}
```
{% include copy-curl.html %}

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
POST /_plugins/_ml/models/<model_id>/_deploy
```

#### Example request: Deploying to all available ML nodes

In this example request, OpenSearch deploys the model to any available OpenSearch ML node:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
```
{% include copy-curl.html %}

#### Example request: Deploying to a specific node

If you want to reserve the memory of other ML nodes within your cluster, you can deploy your model to a specific node(s) by specifying the `node_ids` in the request body:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
{
    "node_ids": ["4PLK7KJWReyX0oWKnBA8nA"]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "task_id" : "hA8P44MBhyWuIwnfvTKP",
  "status" : "DEPLOYING"
}
```

## Check the status of model deployment

To see the status of your model deployment and retrieve the model ID created for the new model version, pass the `task_id` as a path parameter to the Tasks API:

```json
GET /_plugins/_ml/tasks/hA8P44MBhyWuIwnfvTKP
```
{% include copy-curl.html %}

The response contains the model ID of the model version:

```json
{
  "model_id": "Qr1YbogBYOqeeqR7sI9L",
  "task_type": "DEPLOY_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "N77RInqjTSq_UaLh1k0BUg"
  ],
  "create_time": 1685478486057,
  "last_update_time": 1685478491090,
  "is_async": true
}
```

If a cluster or node is restarted, then you need to redeploy the model. To learn how to set up automatic redeployment, see [Enable auto redeploy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#enable-auto-redeploy).
{: .tip} 