---
layout: default
title: Provision a workflow
parent: Workflow APIs
nav_order: 30
---

# Provision Workflow API

Provisioning a workflow is a one-time setup process usually performed by a cluster administrator to create resources that will be used by end users.  

The `workflows` template field may contain multiple workflows. The workflow with the `provision` key can be executed with this API. This API is also executed when the [Create or Update Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/) is called with the `provision` parameter set to `true`.

You can only provision a workflow if it has not yet been provisioned. Deprovision the workflow if you need to repeat provisioning.
{: .note}

## Endpoints

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_provision
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be provisioned. Required. |

## Query parameters

If you have included a substitution expression in the template, you may pass it as a query parameter or as a string value of a request body field. For example, if you specified a credential field in a template as {% raw %}`openAI_key: '${{ openai_key }}'`{% endraw %}, then you can include the `openai_key` parameter as a query parameter or body field so it can be substituted during provisioning. For example, the following request provides a query parameter:

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_provision?<parameter>=<value>
```

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| User-provided substitution expressions | String | Parameters matching substitution expressions in the template. Optional. |
| `wait_for_completion_timeout`          | TimeValue | Specifies the maximum wait time for synchronous provisioning. If the timeout is exceeded, the request returns the current workflow status while execution continues asynchronously.|

## Example requests

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_provision
```
{% include copy-curl.html %}

The following request performs a synchronous provisioning call, waiting for up to 2 seconds for completion:

```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_provision?wait_for_completion_timeout=2s
```
{% include copy-curl.html %}

The following request substitutes the expression {% raw %}`${{ openai_key }}`{% endraw %} with the value "12345" using a query parameter:

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_provision?openai_key=12345
```
{% include copy-curl.html %}

The following request substitutes the expression {% raw %}`${{ openai_key }}`{% endraw %} with the value "12345" using the request body:

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_provision
{
  "openai_key" : "12345"
}
```
{% include copy-curl.html %}

## Example response

OpenSearch responds with the same `workflow_id` that was used in the request:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

To obtain the provisioning status, call the [Get Workflow State API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/).

## Example response with wait_for_completion_timeout enabled

```json
{
    "workflow_id": "K13IR5QBEpCfUu_-AQdU",
    "state": "COMPLETED",
    "resources_created": [
        {
            "workflow_step_name": "create_connector",
            "workflow_step_id": "create_connector_1",
            "resource_id": "LF3IR5QBEpCfUu_-Awd_",
            "resource_type": "connector_id"
        },
        {
            "workflow_step_id": "register_model_2",
            "workflow_step_name": "register_remote_model",
            "resource_id": "L13IR5QBEpCfUu_-BQdI",
            "resource_type": "model_id"
        },
        {
            "workflow_step_name": "deploy_model",
            "workflow_step_id": "deploy_model_3",
            "resource_id": "L13IR5QBEpCfUu_-BQdI",
            "resource_type": "model_id"
        }
    ]
}
```
