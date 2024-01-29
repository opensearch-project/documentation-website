---
layout: default
title: Provision a workflow
parent: Workflow APIs
nav_order: 30
---

# Provision a workflow

Provisioning a workflow is a one-time setup process usually performed by a cluster administrator to create resources that will be used by end users.  

The `workflows` template field may contain multiple workflows. The workflow with the `provision` key can be executed with this API. This API is also executed when the [Create or Update Workflow API]({{site.url}}{{site.baseurl}}/automating-workflows/api/create-workflow/) is called with the `provision` parameter set to `true`.

## Path and HTTP methods

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_provision
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be provisioned. Required. |

#### Example request

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_provision
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with the same `workflow_id` that was used in the request:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

To obtain the provisioning status, query the [Get Workflow State API]({{site.url}}{{site.baseurl}}/automating-workflows/api/get-workflow-status/).