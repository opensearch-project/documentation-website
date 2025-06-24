---
layout: default
title: Workflow steps
nav_order: 10
canonical_url: https://docs.opensearch.org/docs/latest/automating-configurations/workflow-steps/
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
|`user_inputs`	|Object	|Optional	| A key-value map of inputs supported by the corresponding API for this specific step. Some inputs are required for an API, while others are optional. Required inputs may be specified here, if known, or in the `previous_node_inputs` field. The [Get Workflow Steps API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-steps/) identifies required inputs and step outputs. <br> Substitutions are supported in string values, lists of strings, and maps with string values. The pattern `{% raw %}${{previous_step_id.output_key}}{% endraw %}` will be replaced by the value in the previous step's output with the given key.  For example, if a parameter map in the user inputs includes a key `embedding_model_id` with a value `{% raw %}${{deploy_embedding_model.model_id}}{% endraw %}`, then the `model_id` output of the `deploy_embedding_model` step will be substituted here. This performs a similar function to the `previous_node_input` map but is not validated and does not automatically infer edges. <br>In some cases, you can include [additional inputs](#additional-fields) in this field.	|

## Workflow step types

The following table lists the workflow step types. The `user_inputs` fields for these steps correspond directly to the linked APIs.

|Step type	|Corresponding API	|Description	|
|---	|---	|---	|
| `noop` | No API | A no-operation (no-op) step that does nothing, which is useful for synchronizing parallel steps. If the `user_inputs` field contains a `delay` key, this step will wait for the specified amount of time.	|
|`create_connector`	|[Create Connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/)	|Creates a connector to a model hosted on a third-party platform.	|
|`delete_connector`	|[Delete Connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/delete-connector/)	|Deletes a connector to a model hosted on a third-party platform.	|
|`register_model_group`	|[Register Model Group]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/register-model-group/)	|Registers a model group. The model group will be deleted automatically once no model is present in the group.	|
|`register_remote_model`	|[Register Model (remote)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-model-hosted-on-a-third-party-platform)	| Registers a model hosted on a third-party platform. If the `user_inputs` field contains a `deploy` key that is set to `true`, the model is also deployed.	| 
|`register_local_pretrained_model`	|[Register Model (pretrained)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-pretrained-text-embedding-model)	| Registers an OpenSearch-provided pretrained text embedding model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.	|
|`register_local_sparse_encoding_model`	|[Register Model (sparse)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-pretrained-sparse-encoding-model)	| Registers an OpenSearch-provided pretrained sparse encoding model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.	|
|`register_local_custom_model`	|[Register Model (custom)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#register-a-custom-model)	| Registers a custom model that is hosted on your OpenSearch cluster. If the `user_inputs` field contains a `deploy` key that is set to `true`, also deploys the model.		|
|`delete_model`	|[Delete Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/delete-model/)	|Unregisters and deletes a model.	|
|`deploy_model`	|[Deploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/)	|Deploys a registered model into memory.	|
|`undeploy_model`	|[Undeploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/)	|Undeploys a deployed model from memory.	|
|`register_agent`	|[Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/)	|Registers an agent as part of the ML Commons Agent Framework.	|
|`delete_agent`	|[Delete Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/)	|Deletes an agent.	|
|`create_tool`	|No API	| A special-case non-API step encapsulating the specification of a tool for an agent in the ML Commons Agent Framework. These will be listed as `previous_node_inputs` for the appropriate register agent step, with the value set to `tools`.	|
|`create_index`|[Create Index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/)     | Creates a new OpenSearch index. The inputs include `index_name`, which should be the name of the index to be created, and `configurations`, which contains the payload body of a regular REST request for creating an index.
|`create_ingest_pipeline`|[Create Ingest Pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/) | Creates or updates an ingest pipeline. The inputs include `pipeline_id`, which should be the ID of the pipeline, and `configurations`, which contains the payload body of a regular REST request for creating an ingest pipeline.
|`create_search_pipeline`|[Create Search Pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/) | Creates or updates a search pipeline. The inputs include `pipeline_id`, which should be the ID of the pipeline, and `configurations`, which contains the payload body of a regular REST request for creating a search pipeline.
|`reindex`|[Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/)  | The reindex document API operation lets you copy all or a subset of your data from a source index into a destination index. The input includes source_index, destination_index, and the following optional parameters from the document reindex API: `refresh`, `requests_per_second`, `require_alias`, `slices`, and `max_docs`. For more information, see [Reindexing considerations](#reindexing-considerations).

## Reindexing considerations

Reindexing can be a resource-intensive operation, and if not managed properly, it can potentially destabilize your cluster. 

When using a `reindex` step, follow these best practices to ensure a smooth reindexing process and prevent cluster instability:

- **Cluster scaling**: Before initiating a reindexing operation, ensure that your OpenSearch cluster is properly scaled to handle the additional workload. Increase the number of nodes and adjust resource allocation (CPU, memory, and disk) as needed to accommodate the reindexing process without impacting other operations.

- **Request rate control**: Use the `requests_per_second` parameter to control the rate at which the reindexing requests are sent to the cluster. This helps to regulate the load on the cluster and prevent resource exhaustion. Start with a lower value and gradually increase it based on your cluster's capacity and performance.

- **Slicing and parallelization**: The `slices` parameter allows you to divide the reindexing process into smaller, parallel tasks. This can help distribute the workload across multiple nodes and improve overall performance. However, be cautious when increasing the number of slices because adding slices can increase resource consumption.

- **Monitoring and adjustments**: Closely monitor your cluster performance metrics (such as CPU, memory, disk usage, and thread pools) during the reindexing process. If you notice any signs of resource contention or performance degradation, adjust the reindexing parameters accordingly or consider pausing the operation until the cluster stabilizes.

- **Prioritization and scheduling**: If possible, schedule reindexing operations during off-peak hours or periods of lower cluster utilization to minimize the impact on other operations and user traffic.

By following these best practices and carefully managing the reindexing process, you can ensure that your OpenSearch cluster remains stable and performant while efficiently copying data between indexes.

## Additional fields

You can include the following additional fields in the `user_inputs` field if the field is supported by the indicated step type.

|Field	|Data type	| Step type | Description	|
|---	|---	|---	|
|`node_timeout`	| Time units	| All | A user-provided timeout for this step. For example, `20s` for a 20-second timeout.	|
|`deploy`	| Boolean	| Register model | If set to `true`, also deploys the model.	|
|`tools_order`	| List	| Register agent | Specifies the ordering of `tools`. For example, specify `["foo_tool", "bar_tool"]` to sequence those tools in that order.	|
|`delay`	| Time units	| No-op | Waits for the specified amount of time. For example, `250ms` specifies to wait for 250 milliseconds before continuing the workflow.	|

You can include the following additional fields in the `previous_node_inputs` field when indicated.

| Field	          |Data type	| Description	                                                                                                                                                                                                                                                                                                                                                                                                           |
|-----------------|---	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `model_id`	     |String	| The `model_id` is used as an input for several steps. As a special case for the `register_agent` step type, if an `llm.model_id` field is not present in the `user_inputs` and not present in `previous_node_inputs`, then the `model_id` field from the previous node may be used as a backup for the model ID. The `model_id` will also be included in the `parameters` input of the `create_tool` step for the `MLModelTool`.	 |
| `agent_id`	     |String	| The `agent_id` is used as an input for several steps. The `agent_id` will also be included in the `parameters` input of the `create_tool` step for the `AgentTool`.                                                                                                                                                                                                                                                          |
| `connector_id`	 |String	| The `connector_id` is used as an input for several steps. The `connector_id` will also be included in the `parameters` input of the `create_tool` step for the `ConnectorTool`.                                                                                                                                                                                                                                              |

## Example workflow steps

For example workflow step implementations, see the [Workflow tutorial]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-tutorial/).
