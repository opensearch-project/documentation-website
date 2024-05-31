---
layout: default
title: Delete a workflow
parent: Workflow APIs
nav_order: 80
---

# Delete a workflow

When you no longer need a workflow template, you can delete it by calling the Delete Workflow API.

Note that deleting a workflow only deletes the stored template but does not deprovision its resources.

When a workflow is deleted, its corresponding status (returned by the [Workflow State API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/) is also deleted unless either the provisioning status is `IN_PROGRESS` or resources have been provisioned.

## Path and HTTP methods

```json
DELETE /_plugins/_flow_framework/workflow/<workflow_id>
``` 

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be retrieved. Required. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `clear_status` | Boolean | Determines whether to delete the workflow state (without deprovisioning resources) after deleting the template, if the provisioning status is in any state other than IN_PROGRESS. The default value is false. |

#### Example request

```
DELETE /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50
```
{% include copy-curl.html %}

```
DELETE /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50?clear_status=true
```
{% include copy-curl.html %}

#### Example response

If the workflow exists, a delete response contains the status of the deletion, where the `result` field is set to `deleted` on success or `not_found` if the workflow does not exist (it may have already been deleted):

```json
{
  "_index": ".plugins-flow_framework-templates",
  "_id": "8xL8bowB8y25Tqfenm50",
  "_version": 2,
  "result": "deleted",
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 2,
  "_primary_term": 1
}
```

If the `clear_status` parameter was `true`, also deletes the Workflow State if the provisioning status is any state other than `IN_PROGRESS`.