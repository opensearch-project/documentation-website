---
layout: default
title: Create or update a workflow
parent: Workflow APIs
nav_order: 10
canonical_url: https://docs.opensearch.org/docs/latest/automating-configurations/api/create-workflow/
---

# Create or update a workflow

Creating a workflow adds the content of a workflow template to the flow framework system index. You can provide workflows in JSON format (by specifying `Content-Type: application/json`) or YAML format (by specifying `Content-Type: application/yaml`). By default, the workflow is validated to help identify invalid configurations, including:

* Workflow steps requiring an OpenSearch plugin that is not installed.
* Workflow steps relying on previous node input that is provided by those steps.
* Workflow step fields with invalid values.
* Workflow graph (node/edge) configurations containing cycles or with duplicate IDs.

To obtain the validation template for workflow steps, call the [Get Workflow Steps API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-steps/).

You can include placeholder expressions in the value of workflow step fields. For example, you can specify a credential field in a template as {% raw %}`openAI_key: '${{ openai_key }}'`{% endraw %}. The expression will be substituted with the user-provided value during provisioning, using the format {% raw %}`${{ <value> }}`{% endraw %}. You can pass the actual key as a parameter by using the [Provision Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/) or by using this API with the `provision` parameter set to `true`.

Once a workflow is created, provide its `workflow_id` to other APIs.

The `POST` method creates a new workflow. The `PUT` method updates an existing workflow. You can specify the `update_fields` parameter to update specific fields.

You can only update a complete workflow if it has not yet been provisioned.
{: .note}

## Endpoints

```json
POST /_plugins/_flow_framework/workflow
PUT /_plugins/_flow_framework/workflow/<workflow_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be updated. Required for the `PUT` method. |

## Query parameters

Workflows are normally created and provisioned in separate steps. However, once you have thoroughly tested the workflow, you can combine the create and provision steps by including the `provision` query parameter:

```json
POST /_plugins/_flow_framework/workflow?provision=true
```
{% include copy-curl.html %}

When set to `true`, the [Provision Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/) is executed immediately following creation. 

By default, workflows are validated when they are created to ensure that the syntax is valid and that the graph does not contain cycles. This behavior can be controlled with the `validation` query parameter. If `validation` is set to `all`, OpenSearch performs a complete template validation. Any other value of the `validation` parameter suppresses validation, allowing an incomplete/work-in-progress template to be saved. To disable template validation, set `validation` to `none`:

```json
POST /_plugins/_flow_framework/workflow?validation=none
```
{% include copy-curl.html %}

In a workflow that has not been provisioned, you can update fields other than the `workflows` field. For example, you can update the `name` and `description` fields as follows:

```json
PUT /_plugins/_flow_framework/workflow/<workflow_id>?update_fields=true
{
  "name": "new-template-name",
  "description": "A new description for the existing template"
}
```
{% include copy-curl.html %}

You cannot specify both the `provision` and `update_fields` parameters at the same time.
{: .note}

If a workflow has been provisioned, you can update and reprovision the full template:

```json
PUT /_plugins/_flow_framework/workflow/<workflow_id>?reprovision=true
{
  <updated complete template>
}
```

You can add new steps to the workflow but cannot delete them. Only index setting, search pipeline, and ingest pipeline steps can currently be updated.
{: .note}

To control how long the request waits for the provisioning and reprovisioning process to complete, use the `wait_for_completion_timeout` parameter:

```json
POST /_plugins/_flow_framework/workflow/?provision=true&wait_for_completion_timeout=2s
```
{% include copy-curl.html %}

```json
PUT /_plugins/_flow_framework/workflow/<workflow_id>/?reprovision=true&wait_for_completion_timeout=2s
```
{% include copy-curl.html %}

If the operation does not complete within the specified amount of time, the response returns the current workflow status while execution continues asynchronously.

The `wait_for_completion_timeout` parameter can only be used when either `provision` or `reprovision` is set to `true`
{: .note}

For example, the following request provisions a workflow and waits for up to 2 seconds for completion:
You can create and provision a workflow using a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/) as follows:

```json
POST /_plugins/_flow_framework/workflow?use_case=<use_case>&provision=true
{
    "create_connector.credential.key" : "<YOUR API KEY>"
}
```
{% include copy-curl.html %}

The following table lists the available query parameters. All query parameters are optional. User-provided parameters are only allowed if the `provision` parameter is set to `true`.

| Parameter                              | Data type | Description                                                                                                                                                                                                                                                                                                                               |
|:---------------------------------------|:----------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provision`                            | Boolean   | Whether to provision the workflow as part of the request. Default is `false`.                                                                                                                                                                                                                                                             |
| `update_fields`                        | Boolean   | Whether to update only the fields included in the request body. Default is `false`.                                                                                                                                                                                                                                                       |
| `reprovision`                          | Boolean   | Whether to reprovision the entire template if it has already been provisioned. A complete template must be provided in the request body. Default is `false`.                                                                                                                                                                              |
| `validation`                           | String    | Whether to validate the workflow. Valid values are `all` (validate the template) and `none` (do not validate the template). Default is `all`.                                                                                                                                                                                             |
| `use_case`                             | String    | The name of the [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/#supported-workflow-templates) to use when creating the workflow.                                                                                                                                                           |
| `wait_for_completion_timeout`          | Time value | Specifies the maximum wait time for synchronous provisioning or reprovisioning. If the timeout is exceeded, the request returns the current workflow status while execution continues asynchronously.|
| User-provided substitution expressions | String    | Parameters matching substitution expressions in the template. Only allowed if `provision` is set to `true`. Optional. If `provision` is set to `false`, you can pass these parameters in the [Provision Workflow API query parameters]({{site.url}}{{site.baseurl}}/automating-configurations/api/provision-workflow/#query-parameters).  |

## Request body fields

The following table lists the available request fields.

|Field	|Data type	|Required/Optional	|Description	|
|:---	|:---	|:---	|:---	|
|`name`	|String	|Required	|The name of the workflow.	|
|`description`	|String	|Optional	|A description of the workflow.	|
|`use_case`	|String	|Optional	| A user-provided use case, which can be used with the [Search Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/search-workflow/) to find related workflows. You can use this field to specify custom values. This is distinct from the `use_case` query parameter. |
|`version`	|Object	|Optional	| A key-value map with two fields: `template`, which identifies the template version, and `compatibility`, which identifies a list of minimum required OpenSearch versions.	|
|`workflows`	|Object	|Optional	|A map of workflows. Presently, only the `provision` key is supported. The value for the workflow key is a key-value map that includes fields for `user_params` and lists of `nodes` and `edges`.	|

#### Example request: Register and deploy an externally hosted model (YAML)

To provide a template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XPOST "http://localhost:9200/_plugins/_flow_framework/workflow" -H 'Content-Type: application/yaml'
```

YAML templates permit comments. 
{: .tip}

The following is an example YAML template for registering and deploying an externally hosted model:

```yaml
# This name is required
name: createconnector-registerremotemodel-deploymodel
# Other fields are optional but useful
description: This template creates a connector to a remote model, registers it, and
  deploys that model
# Other templates with a similar use case can be searched
use_case: REMOTE_MODEL_DEPLOYMENT
version:
  # Templates may be versioned by their authors
  template: 1.0.0
  # Compatibility with OpenSearch 2.12.0 and higher and 3.0.0 and higher
  compatibility:
  - 2.12.0
  - 3.0.0
# One or more workflows can be included, presently only provision is supported
workflows:
  provision:
    # These nodes are the workflow steps corresponding to ML Commons APIs
    nodes:
    # This ID must be unique to this workflow
    - id: create_connector_1
      # There may be multiple steps with the same type
      type: create_connector
      # These inputs match the Create Connector API body
      user_inputs:
        name: OpenAI Chat Connector
        description: The connector to public OpenAI model service for GPT 3.5
        version: '1'
        protocol: http
        parameters:
          endpoint: api.openai.com
          model: gpt-3.5-turbo
        credential:
          openAI_key: '12345'
        actions:
        - action_type: predict
          method: POST
          url: https://${parameters.endpoint}/v1/chat/completions
    # This ID must be unique to this workflow
    - id: register_model_2
      type: register_remote_model
      # This step needs the connector_id produced as an output of the previous step
      previous_node_inputs:
        create_connector_1: connector_id
      # These inputs match the Register Model API body
      user_inputs:
        name: openAI-gpt-3.5-turbo
        function_name: remote
        description: test model
    # This ID must be unique to this workflow
    - id: deploy_model_3
      type: deploy_model
      # This step needs the model_id produced as an output of the previous step
      previous_node_inputs:
        register_model_2: model_id
    # Since the nodes include previous_node_inputs these are optional to define
    # They will be added automatically and included in the stored template
    # Additional edges may also be added here if required for sequencing
    edges:
    - source: create_connector_1
      dest: register_model_2
    - source: register_model_2
      dest: deploy_model_3
```
{% include copy-curl.html %}

#### Example request: Register and deploy a remote model (JSON)

To provide a template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XPOST "http://localhost:9200/_plugins/_flow_framework/workflow" -H 'Content-Type: application/json'
```
The following JSON template is equivalent to the YAML template provided in the previous section: 

```json
{
  "name": "createconnector-registerremotemodel-deploymodel",
  "description": "This template creates a connector to a remote model, registers it, and deploys that model",
  "use_case": "REMOTE_MODEL_DEPLOYMENT",
  "version": {
    "template": "1.0.0",
    "compatibility": [
      "2.12.0",
      "3.0.0"
    ]
  },
  "workflows": {
    "provision": {
      "nodes": [
        {
          "id": "create_connector_1",
          "type": "create_connector",
          "user_inputs": {
            "name": "OpenAI Chat Connector",
            "description": "The connector to public OpenAI model service for GPT 3.5",
            "version": "1",
            "protocol": "http",
            "parameters": {
              "endpoint": "api.openai.com",
              "model": "gpt-3.5-turbo"
            },
            "credential": {
              "openAI_key": "12345"
            },
            "actions": [
              {
                "action_type": "predict",
                "method": "POST",
                "url": "https://${parameters.endpoint}/v1/chat/completions"
              }
            ]
          }
        },
        {
          "id": "register_model_2",
          "type": "register_remote_model",
          "previous_node_inputs": {
            "create_connector_1": "connector_id"
          },
          "user_inputs": {
            "name": "openAI-gpt-3.5-turbo",
            "function_name": "remote",
            "description": "test model"
          }
        },
        {
          "id": "deploy_model_3",
          "type": "deploy_model",
          "previous_node_inputs": {
            "register_model_2": "model_id"
          }
        }
      ],
      "edges": [
        {
          "source": "create_connector_1",
          "dest": "register_model_2"
        },
        {
          "source": "register_model_2",
          "dest": "deploy_model_3"
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with the `workflow_id`:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

Once you have created a workflow, you can use other workflow APIs with the `workflow_id`.

#### Example response with wait_for_completion_timeout enabled

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