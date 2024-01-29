---
layout: default
title: Get a workflow status
parent: Workflow APIs
nav_order: 40
---

# Get a workflow status

[Provisioning a workflow]({{site.url}}{{site.baseurl}}/automating-workflows/api/provision-workflow/) may take a significant amount of time, particularly when the action is associated with OpenSearch indexing operations. The Get Workflow State API permits monitoring of the provisioning deployment status until it is complete.

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/<workflow_id>/_status
``` 

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow from which to obtain the status. Required for the `PUT` method. |

## Query parameters

The `all` parameter specifies whether the response should return all fields. 

When set to `false` (the default), the response contains the following fields:

- `workflow_id`
- any `error` state
- `state`
- a list of `resources_created`

When set to `true`, the response contains the following additional fields:

- `provisioning_progress`
- `provision_start_time`
- `provision_end_time`
- `user`
- `user_outputs`

To receive all available fields in the response, set `all` to `true`:

```json
GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_status?all=true
``` 
{% include copy-curl.html %}

#### Example request

```json
GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_status
```
{% include copy-curl.html %}


#### Example response

OpenSearch responds with a summary of the provisioning status and a list of created resources. 

Before provisioning has begun, OpenSearch does not return any resources:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50",
  "state": "NOT_STARTED"
}
```

While provisioning is in progress, OpenSearch returns a partial resource list:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50",
  "state": "PROVISIONING",
  "resources_created": [
    {
      "workflow_step_name": "create_connector",
      "workflow_step_id": "create_connector_1",
      "connector_id": "NdjCQYwBLmvn802B0IwE"
    }
  ]
}
```

Upon provisioning completion, OpenSearch returns the full resource list:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50",
  "state": "COMPLETED",
  "resources_created": [
    {
      "workflow_step_name": "create_connector",
      "workflow_step_id": "create_connector_1",
      "connector_id": "NdjCQYwBLmvn802B0IwE"
    },
    {
      "workflow_step_name": "register_remote_model",
      "workflow_step_id": "register_model_2",
      "model_id": "N9jCQYwBLmvn802B0oyh"
    }
  ]
}
```