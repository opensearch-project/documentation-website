---
layout: default
title: Deprovision a workflow
parent: Workflow APIs
nav_order: 70
---

# Deprovision a workflow

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/flow-framework/issues/475).    
{: .warning}

When you no longer need a workflow, you can deprovision its resources. Most workflow steps that create a resource have corresponding workflow steps to reverse that action. To retrieve all resources currently created for a workflow, call the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/). When you call the Deprovision Workflow API, resources included in the `resources_created` field of the Get Workflow Status API response will be removed using a workflow step corresponding to the one that provisioned them.

The workflow executes the provisioning workflow steps in reverse order. If failures occur because of resource dependencies, such as preventing deletion of a registered model if it is still deployed, the workflow attempts retries.

## Path and HTTP methods

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_deprovision
``` 

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be deprovisioned. Required. |

### Example request

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_deprovision
``` 
{% include copy-curl.html %}

### Example response

If deprovisioning is successful, OpenSearch responds with the same `workflow_id` that was used in the request: 

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

If deprovisioning did not completely remove all resources, OpenSearch responds with a `202 (ACCEPTED)` status and identifies the resources that were not deprovisioned:

```json
{
    "error": "Failed to deprovision some resources: [connector_id Lw7PX4wBfVtHp98y06wV]."
}
```

In some cases, the failure happens because of another dependent resource that took some time to be removed. In this case, you can attempt to send the same request again.
{: .tip}

To obtain a more detailed deprovisioning status than is provided by the summary in the error response, query the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/). 

On success, the workflow returns to a `NOT_STARTED` state. If some resources have not yet been removed, they are provided in the response.