---
layout: default
title: Deploy model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Deploy Model API

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

## Example request: Deploying to all available ML nodes

In this example request, OpenSearch deploys the model to any available OpenSearch ML node:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
```
{% include copy-curl.html %}

## Example request: Deploying to a specific node

If you want to reserve the memory of other ML nodes within your cluster, you can deploy your model to a specific node(s) by specifying the `node_ids` in the request body:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
{
    "node_ids": ["4PLK7KJWReyX0oWKnBA8nA"]
}
```
{% include copy-curl.html %}

## Example response

The Deploy Model API returns a `task_id` that you can use to monitor the deployment progress:

```json
{
  "task_id": "hA8P44MBhyWuIwnfvTKP",
  "task_type": "DEPLOY_MODEL",
  "status": "CREATED"
}
```

## Monitoring deployment status

To check the status of your model deployment and retrieve the model ID when deployment completes, use the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) and provide the returned `task_id` as a path parameter:

```json
GET /_plugins/_ml/tasks/hA8P44MBhyWuIwnfvTKP
```
{% include copy-curl.html %}

The Get ML Task API returns different response formats depending on whether the deployment is in progress or completed. For detailed information about all possible response formats, see [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/#example-responses).

If a cluster or node is restarted, then you need to redeploy the model. To learn how to set up automatic redeployment, see [Enable auto redeploy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#enable-auto-redeploy).
{: .tip} 