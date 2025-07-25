---
layout: default
title: Provision a workflow
parent: Workflow APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/automating-configurations/api/provision-workflow/
---

# Provision a workflow

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

#### Example requests

```json
POST /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_provision
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

#### Example response

OpenSearch responds with the same `workflow_id` that was used in the request:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

To obtain the provisioning status, query the [Get Workflow State API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/).