---
layout: default
title: Deprovision a workflow
parent: Workflow APIs
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/automating-configurations/api/deprovision-workflow/
---

# Deprovision a workflow

When you no longer need a workflow, you can deprovision its resources. Most workflow steps that create a resource have corresponding workflow steps to reverse that action. To retrieve all resources currently created for a workflow, call the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/). When you call the Deprovision Workflow API, resources included in the `resources_created` field of the Get Workflow Status API response will be removed using a workflow step corresponding to the one that provisioned them.

The workflow executes the provisioning steps in reverse order. If a failure occurs because of a resource dependency, such as trying to delete a registered model that is still deployed, then the workflow retries the failing step as long as at least one resource was deleted.

To prevent data loss, resources created using the `create_index`, `create_search_pipeline`, and `create_ingest_pipeline` steps require the resource ID to be included in the `allow_delete` parameter.

## Endpoints

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_deprovision
``` 

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be deprovisioned. Required. |
| `allow-delete` | String | A comma-separated list of resource IDs to be deprovisioned. Required if deleting resources of type `index_name` or `pipeline_id`. |

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

If deprovisioning required the `allow_delete` parameter, then OpenSearch responds with a `403 (FORBIDDEN)` status and identifies the resources that were not deprovisioned:

```json
{
    "error": "These resources require the allow_delete parameter to deprovision: [index_name my-index]."
}
```

To obtain a more detailed deprovisioning status than is provided by the summary in the error response, query the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/). 

On success, the workflow returns to a `NOT_STARTED` state. If some resources have not yet been removed, they are provided in the response.