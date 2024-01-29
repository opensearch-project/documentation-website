---
layout: default
title: Workflow steps
nav_order: 10
---

# Workflow steps

_Workflow steps_ form basic "building blocks" for process automation. Most steps directly correspond to OpenSearch or plugin API operations, such as CRUD operations on machine learning (ML) connectors, models, and agents. Some steps simplify the configuration by reusing the body expected by these APIs across multiple steps. For example, once you configure a _tool_, you can use it with multiple _agents_.  

## Workflow step fields

Workflow steps are actively being developed to expand automation capabilities. Workflow step (graph node) configuration includes the following fields.

|Field	|Data type	|Required/Optional	|Description	|
|:---	|:---	|:---	|:---	|
|`id`	|String	|Required	| A user-provided ID for the step. The ID must be unique within a given workflow and is useful for identifying resources created by the step. For example, a `register_agent` step may return an `agent_id` that has been registered. Using this ID, you can determine which step produced which resource.	|
|`type`	|String	|Required	|The type of action to take, such as `deploy_model`, which corresponds to the API for which the step is used. Multiple steps may share the same type but must each have their own unique ID. For a list of supported types, see [Workflow step types](#workflow-step-types).	|
|`previous_node_inputs`	|Object	|Optional	| A key-value map specifying user inputs that are produced by a previous step in the workflow. For each key-value pair, the key is the previous step's `id` and the value is an API body field name (such as `model_id`) that will be produced as an output of a previous step in the workflow. For example, `register_remote_model` (key) may produce a `model_id` (value) that is required for a subsequent `deploy_model` step. <br> A graph edge is automatically added to the workflow connecting the previous step's key as the source and the current node as the destination. <br>In some cases, you can include [additional inputs](#additional-fields) in this field.	|
|`user_inputs`	|Object	|Optional	| A key-value map of inputs supported by the corresponding API for this specific step. Some inputs are required for an API, while others are optional. Required inputs may be specified here, if known, or in the `previous_node_inputs` field. The [Get Workflow Steps API]({{site.url}}{{site.baseurl}}/automating-workflows/api/get-workflow-steps/) identifies required inputs and step outputs. <br> Substitutions are supported in string values, lists of strings, and maps with string values. The pattern `{% raw %}${{previous_step_id.output_key}}{% endraw %}` will be replaced by the value in the previous step's output with the given key.  For example, if a parameter map in the user inputs includes a key `embedding_model_id` with a value `{% raw %}${{deploy_embedding_model.model_id}}{% endraw %}`, then the `model_id` output of the `deploy_embedding_model` step will be substituted here. This performs a similar function to the `previous_node_input` map but is not validated and does not automatically infer edges. <br>In some cases, you can include [additional inputs](#additional-fields) in this field.	|

## Workflow step types

The following table lists the workflow step types. The `user_inputs` fields for these steps correspond directly to the linked APIs.

|Step type	|Corresponding API	|Description	|
|---	|---	|---	|
|`noop`	|No API	| A no-operation (no-op) step that does nothing. It may be useful in some cases for synchronizing parallel steps.	|
|`create_connector`	|[Create Connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/)	|Creates a connector to a model hosted on a third-party platform.	|
|`delete_connector`	|[Delete Connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/delete-connector/)	|Deletes a connector to a model hosted on a third-party platform.	|
|`register_model_group`	|[Register Model Group]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/register-model-group/)	|Registers a model group. The model group will be deleted automatically once no model is present in the group.	|
|`register_remote_model`	|[Register Model (remote)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-model-hosted-on-a-third-party-platform)	|Registers a model hosted on a third-party platform. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.	| 
|`register_local_pretrained_model`	|[Register Model (pretrained)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-pretrained-text-embedding-model)	| Registers an OpenSearch-provided pretrained text embedding model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.	|
|`register_local_sparse_encoding_model`	|[Register Model (sparse)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-pretrained-sparse-encoding-model)	| Registers an OpenSearch-provided pretrained sparse encoding model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.	|
|`register_local_custom_model`	|[Register Model (custom)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-custom-model)	| Registers a custom model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.		|
|`delete_model`	|[Delete Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/delete-model/)	|Unregisters and deletes a model.	|
|`deploy_model`	|[Deploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/)	|Deploys a registered model into memory.	|
|`undeploy_model`	|[Undeploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/)	|Undeploys a deployed model from memory.	|
|`register_agent`	|[Register Agent API](link TBD)	|Registers an agent as part of the ML Commons Agent Framework.	|
|`delete_agent`	|[Delete Agent API](link TBD)	|Deletes an agent.	|
|`create_tool`	|No API	| A special-case non-API step encapsulating the specification of a tool for an agent in the ML Commons Agent Framework. These will be listed as `previous_node_inputs` for the appropriate register agent step, with the value set to `tools`.	|

## Additional fields

You can include the following additional fields in the `user_inputs` field when indicated.

|Field	|Data type	|Description	|
|---	|---	|---	|
|`node_timeout`	|Time units	|A user-provided timeout for this step. For example, `20s` for a 20-second timeout.	|
|`deploy`	|Boolean	|Applicable to the Register Model step type. If set to `true`, also executes the Deploy Model step.	|
|`tools_order`	|List	|Applicable only to the Register Agent step type. Specifies the ordering of `tools`. For example, specify `["foo_tool", "bar_tool"]` to sequence those tools in that order.	|

You can include the following additional fields in the `previous_node_inputs` field when indicated.

|Field	|Data type	|Description	|
|---	|---	|---	|
|`model_id`	|String	|The `model_id` is used as input for several steps. As a special case for the Register Agent step type, if an `llm.model_id` field is not present in the `user_inputs` and not present in `previous_node_inputs`, the `model_id` field from the previous node may be used as a backup for model ID.	|

## Example workflow steps

For example workflow step implementations, see the [Workflow tutorial]({{site.url}}{{site.baseurl}}/automating-workflows/workflow-tutorial/).