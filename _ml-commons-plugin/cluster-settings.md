---
layout: default
title: ML Commons cluster settings
has_children: false
nav_order: 140
---

# ML cluster settings

To enhance and customize your OpenSearch cluster for machine learning (ML), you can add and modify several configuration settings for the ML Commons plugin in your `opensearch.yml` file. 

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## ML node

By default, ML tasks and models only run on ML nodes. When configured without the `data` node role, ML nodes do not store any shards and instead calculate resource requirements at runtime. To use an ML node, create a node in your `opensearch.yml` file. Give your node a custom name and define the node role as `ml`:

```yml
node.roles: [ ml ]
```

### Setting up a cluster with a dedicated ML node

To set up a cluster with a dedicated ML node, see the sample [Docker compose file](https://github.com/opensearch-project/ml-commons/blob/main/docs/docker/docker-compose.yml).

## Run tasks and models on ML nodes only

If `true`, ML Commons tasks and models run ML tasks on ML nodes only. If `false`, tasks and models run on ML nodes first. If no ML nodes exist, tasks and models run on data nodes. 

We suggest running ML workloads on a dedicated ML node rather than on data nodes. Starting with OpenSearch 2.5, ML tasks run on ML nodes only by default. To test models on a data node, set `plugins.ml_commons.only_run_on_ml_node` to `false`.

We recommend setting `plugins.ml_commons.only_run_on_ml_node` to `true` on production clusters. 
{: .tip}


### Setting

```yaml
plugins.ml_commons.only_run_on_ml_node: true
```

### Values

- Default value: `true`
- Value range: `true` or `false`

## Dispatch tasks to ML node 

`round_robin` dispatches ML tasks to ML nodes using round robin routing. `least_load` gathers runtime information from all ML nodes, like JVM heap memory usage and running tasks, and then dispatches the tasks to the ML node with the lowest load.


### Setting

```yaml
plugins.ml_commons.task_dispatch_policy: round_robin
```


### Values

- Default value: `round_robin`
- Value range: `round_robin` or `least_load`

## Set number of ML tasks per node

Sets the number of ML tasks that can run on each ML node. When set to `0`, no ML tasks run on any nodes.

### Setting

```yaml
plugins.ml_commons.max_ml_task_per_node: 10
```

### Values

- Default value: `10`
- Value range: [0, 10,000]

## Set number of ML models per node

Sets the number of ML models that can be deployed to each ML node. When set to `0`, no ML models can deploy on any node.

### Setting

```yaml
plugins.ml_commons.max_model_on_node: 10
```

### Values

- Default value: `10`
- Value range: [0, 10,000]

## Set sync job intervals 

When returning runtime information with the [Profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/profile/), ML Commons will run a regular job to sync newly deployed or undeployed models on each node. When set to `0`, ML Commons immediately stops sync-up jobs.


### Setting

```yaml
plugins.ml_commons.sync_up_job_interval_in_seconds: 3
```

### Values

- Default value: `3`
- Value range: [0, 86,400]

## Monitoring predict requests

Controls how many predict requests are monitored on one node. If set to `0`, OpenSearch clears all monitoring predict requests in cache and does not monitor for new predict requests.

### Setting

```yaml
plugins.ml_commons.monitoring_request_count: 100
```

### Value range

- Default value: `100`
- Value range: [0, 10,000,000]

## Register model tasks per node

Controls how many register model tasks can run in parallel on one node. If set to `0`, you cannot run register model tasks on any node.

### Setting

```yaml
plugins.ml_commons.max_register_model_tasks_per_node: 10
```


### Values 

- Default value: `10`
- Value range: [0, 10]


## Deploy model tasks per node

Controls how many deploy model tasks can run in parallel on one node. If set to 0, you cannot deploy models to any node.

### Setting

```yaml
plugins.ml_commons.max_deploy_model_tasks_per_node: 10
```

### Values 

- Default value: `10`
- Value range: [0, 10]

## Register models using URLs

This setting gives you the ability to register models using a URL. By default, ML Commons only allows registration of [pretrained]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) models from the OpenSearch model repository.

### Setting

```yaml
plugins.ml_commons.allow_registering_model_via_url: false
```

### Values

- Default value: false
- Valid values: `false`, `true`

## Register models using local files

This setting gives you the ability to register a model using a local file. By default, ML Commons only allows registration of [pretrained]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) models from the OpenSearch model repository.

### Setting

```yaml
plugins.ml_commons.allow_registering_model_via_local_file: false
```

### Values

- Default value: false
- Valid values: `false`, `true`

## Add trusted URL

The default value allows you to register a model file from any http/https/ftp/local file. You can change this value to restrict trusted model URLs.


### Setting

The default URL value for this trusted URL setting is not secure. For security, use you own regex string to the trusted repository that contains your models, for example `https://github.com/opensearch-project/ml-commons/blob/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/*`.
{: .warning }


```yaml
plugins.ml_commons.trusted_url_regex: <model-repository-url>
```

### Values

- Default value: `"^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"`
- Value range: Java regular expression (regex) string

## Assign task timeout

Assigns how long in seconds an ML task will live. After the timeout, the task will fail.

### Setting

```yaml
plugins.ml_commons.ml_task_timeout_in_seconds: 600
```

### Values

- Default value: 600
- Value range: [1, 86,400]

## Set native memory threshold 

Sets a circuit breaker that checks all system memory usage before running an ML task. If the native memory exceeds the threshold, OpenSearch throws an exception and stops running any ML task. 

Values are based on the percentage of memory available. When set to `0`, no ML tasks will run. When set to `100`, the circuit breaker closes and no threshold exists.

Starting with OpenSearch 2.5, ML Commons runs a native memory circuit breaker to avoid an out-of-memory error when loading too many models. By default, the native memory threshold is 90%. If memory usage exceeds the threshold, ML Commons returns an error. For testing purposes, you can disable the circuit breaker by setting `plugins.ml_commons.native_memory_threshold` to 100.

### Setting

```yaml
plugins.ml_commons.native_memory_threshold: 90
```

### Values

- Default value: 90
- Value range: [0, 100]

## Set JVM heap memory threshold

Sets a circuit breaker that checks JVM heap memory usage before running an ML task. If the heap usage exceeds the threshold, OpenSearch triggers a circuit breaker and throws an exception to maintain optimal performance.

Values are based on the percentage of JVM heap memory available. When set to `0`, no ML tasks will run. When set to `100`, the circuit breaker closes and no threshold exists.

### Setting

```yaml
plugins.ml_commons.jvm_heap_memory_threshold: 85
```

### Values

- Default value: 85
- Value range: [0, 100]

## Set a disk free space threshold

Sets a disk circuit breaker that checks disk usage before running an ML task. If the amount of disk free space exceeds the threshold, then OpenSearch triggers a circuit breaker and throws an exception to maintain optimal performance.

Valid values are in byte units. To disable the circuit breaker, set this value to -1.

### Setting

```yaml
plugins.ml_commons.disk_free_space_threshold: 5G
```

### Values

- Default value: 5G
- Value range: [-1, Long.MAX_VALUE]

## Exclude node names

Use this setting to specify the names of nodes on which you don't want to run ML tasks. The value should be a valid node name or a comma-separated node name list.

### Setting

```yaml
plugins.ml_commons.exclude_nodes._name: node1, node2
```

## Allow custom deployment plans

When enabled, this setting grants users the ability to deploy models to specific ML nodes according to that user's permissions.

### Setting

```yaml
plugins.ml_commons.allow_custom_deployment_plan: false
```

### Values

- Default value: false
- Valid values: `false`, `true`

## Enable auto deploy

This setting is applicable when you send a prediction request for an externally hosted model that has not been deployed. When set to `true`, this setting automatically deploys the model to the cluster if the model has not been deployed already. 

### Setting

```yaml
plugins.ml_commons.model_auto_deploy.enable: false
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Enable auto redeploy

This setting automatically redeploys deployed or partially deployed models upon cluster failure. If all ML nodes inside a cluster crash, the model switches to the `DEPLOYED_FAILED` state, and the model must be deployed manually.

### Setting

```yaml
plugins.ml_commons.model_auto_redeploy.enable: true 
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Set retires for auto redeploy

This setting sets the limit for the number of times a deployed or partially deployed model will try and redeploy when ML nodes in a cluster fail or new ML nodes join the cluster.

### Setting

```yaml
plugins.ml_commons.model_auto_redeploy.lifetime_retry_times: 3
```

### Values

- Default value: 3
- Value range: [0, 100]

## Set auto redeploy success ratio

This setting sets the ratio of success for the auto-redeployment of a model based on the available ML nodes in a cluster. For example, if ML nodes crash inside a cluster, the auto redeploy protocol adds another node or retires a crashed node. If the ratio is `0.7` and 70% of all ML nodes successfully redeploy the model on auto-redeploy activation, the redeployment is a success. If the model redeploys on fewer than 70% of available ML nodes, the auto-redeploy retries until the redeployment succeeds or OpenSearch reaches [the maximum number of retries](#set-retires-for-auto-redeploy).

### Setting

```yaml
plugins.ml_commons.model_auto_redeploy_success_ratio: 0.8
```

### Values

- Default value: 0.8
- Value range: [0, 1]

## Run Python-based models

When set to `true`, this setting enables the ability to run Python-based models supported by OpenSearch, such as [Metrics correlation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#metrics-correlation).

### Setting

```yaml
plugins.ml_commons.enable_inhouse_python_model: false
```

### Values

- Default value: `false`
- Valid values: `false`, `true`

## Safely delete models
Introduced 2.19
{: .label .label-purple }

When set to `true`, this setting enables a safety feature that checks for downstream dependencies before deleting a model. This helps prevent accidental deletion of models in active use by agents, search pipelines, ingest pipelines, and other downstream tasks. If this setting is enabled and you attempt to delete a model that has active downstream dependencies, you'll receive an error message and the model will not be deleted.

### Setting

```yaml
plugins.ml_commons.safe_delete_model: true
```

### Values

- Default value: `false`
- Valid values: `false`, `true`


## Enable access control for connectors

When set to `true`, the setting allows admins to control access and permissions to the connector API using `backend_roles`.

### Setting

```yaml
plugins.ml_commons.connector_access_control_enabled: true
```

### Values

- Default value: `false`
- Valid values: `false`, `true`

## Enable a local model

This setting allows a cluster admin to enable running local models on the cluster. When this setting is `false`, users will not be able to run register, deploy, or predict operations on any local model.

### Setting

```yaml
plugins.ml_commons.local_model.enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Node roles that can run externally hosted models

This setting allows a cluster admin to control the types of nodes on which externally hosted models can run.  

### Setting

```yaml
plugins.ml_commons.task_dispatcher.eligible_node_role.remote_model: ["ml"]
```

### Values

- Default value: `["data", "ml"]`, which allows externally hosted models to run on data nodes and ML nodes.


## Node roles that can run local models

This setting allows a cluster admin to control the types of nodes on which local models can run. The `plugins.ml_commons.only_run_on_ml_node` setting only allows the model to run on ML nodes. For a local model, if `plugins.ml_commons.only_run_on_ml_node` is set to `true`, then the model will always run on ML nodes. If `plugins.ml_commons.only_run_on_ml_node` is set to `false`, then the model will run on nodes defined in the `plugins.ml_commons.task_dispatcher.eligible_node_role.local_model` setting.

### Setting

```yaml
plugins.ml_commons.task_dispatcher.eligible_node_role.remote_model: ["ml"]
```

### Values

- Default value: `["data", "ml"]`

## Enable remote inference

This setting allows a cluster admin to enable remote inference on the cluster. If this setting is `false`, users will not be able to run register, deploy, or predict operations on any externally hosted model or create a connector for remote inference.

### Setting

```yaml
plugins.ml_commons.remote_inference.enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Enable agent framework

When set to `true`, this setting enables the agent framework (including agents and tools) on the cluster and allows users to run register, execute, delete, get, and search operations on an agent.

### Setting

```yaml
plugins.ml_commons.agent_framework_enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Enable memory

When set to `true`, this setting enables conversational memory, which stores all messages from a conversation for conversational search.

### Setting

```yaml
plugins.ml_commons.memory_feature_enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Enable agentic memory

When set to `true`, this setting enables agentic memory functionality, which provides advanced memory management for AI agents including session memory, working memory, long-term memory, and memory history with namespace-based organization.

### Setting

```yaml
plugins.ml_commons.agentic_memory_enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`

## Set maximum memory containers per user

Controls the maximum number of memory containers that can be created per user. When set to `0`, no memory containers can be created.

### Setting

```yaml
plugins.ml_commons.max_memory_containers_per_user: 100
```

### Values

- Default value: `100`
- Value range: [0, 10,000]

## Set maximum memories per container

Controls the maximum number of memories that can be stored in a single memory container. When set to `0`, no memories can be added to any container.

### Setting

```yaml
plugins.ml_commons.max_memories_per_container: 10000
```

### Values

- Default value: `10,000`
- Value range: [0, 1,000,000]


## Enable RAG pipeline

When set to `true`, this setting enables the search processors for retrieval-augmented generation (RAG). RAG enhances query results by generating responses using relevant information from memory and previous conversations.

### Setting

```yaml
plugins.ml_commons.rag_pipeline_feature_enabled: true
```

### Values

- Default value: `true`
- Valid values: `false`, `true`
