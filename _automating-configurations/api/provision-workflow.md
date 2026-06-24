---
layout: default
title: Provision a workflow
parent: Workflow APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/automating-configurations/api/provision-workflow/
---

# Provision a workflow

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/flow-framework/issues/475).    
{: .warning}

Provisioning a workflow is a one-time setup process usually performed by a cluster administrator to create resources that will be used by end users.  

The `workflows` template field may contain multiple workflows. The workflow with the `provision` key can be executed with this API. This API is also executed when the [Create or Update Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/) is called with the `provision` parameter set to `true`.

You can only provision a workflow if it has not yet been provisioned. Deprovision the workflow if you need to repeat provisioning.
{: .note}

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

To obtain the provisioning status, query the [Get Workflow State API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/).