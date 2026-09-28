---
layout: default
title: ML Commons cluster settings
has_children: false
nav_order: 120
---

# ML cluster settings

The following settings configure the ML Commons plugin. You can specify them in your `opensearch.yml` file or update them using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/). All ML Commons settings on this page are dynamic.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## ML node

By default, ML tasks and local models run only on ML nodes. When configured without the `data` node role, ML nodes do not store any shards and instead calculate resource requirements at runtime. To use an ML node, create a node in your `opensearch.yml` file. Give your node a custom name and define the node role as `ml`:

```yml
node.roles: [ ml ]
```
{% include copy.html %}

For an example of a cluster with a dedicated ML node, see the example [Docker Compose file](https://github.com/opensearch-project/ml-commons/blob/main/docs/docker/docker-compose.yml).

## Node selection settings

ML Commons supports the following settings for selecting the nodes on which ML tasks and models run:

- `plugins.ml_commons.only_run_on_ml_node` (Dynamic, Boolean): When `true`, local models run only on ML nodes. When `false`, local models run on nodes whose roles are listed in `plugins.ml_commons.task_dispatcher.eligible_node_role.local_model`. To test models on a data node, set it to `false`. Default is `true`.

- `plugins.ml_commons.task_dispatcher.eligible_node_role.local_model` (Dynamic, list): The node roles on which local models can run. This setting applies only when `plugins.ml_commons.only_run_on_ml_node` is `false`. Default is `["data", "ml"]`.

- `plugins.ml_commons.task_dispatcher.eligible_node_role.remote_model` (Dynamic, list): The node roles on which externally hosted models can run. For example, set it to `["ml"]` to run externally hosted models only on ML nodes. Default is `["data", "ml"]`.

- `plugins.ml_commons.task_dispatch_policy` (Dynamic, string): The policy for dispatching ML tasks to ML nodes. Valid values are `round_robin`, which dispatches tasks using round-robin routing, and `least_load`, which collects runtime information, such as JVM heap memory usage and running tasks, from all ML nodes and dispatches tasks to the node with the lowest load. Default is `round_robin`.

- `plugins.ml_commons.exclude_nodes._name` (Dynamic, string): A node name or a comma-separated list of node names, such as `node1, node2`, on which ML tasks don't run.

- `plugins.ml_commons.allow_custom_deployment_plan` (Dynamic, Boolean): When `true`, users can deploy models to specific ML nodes according to their permissions. Default is `false`.

We recommend setting `plugins.ml_commons.only_run_on_ml_node` to `true` on production clusters.
{: .tip}

## Task and model limit settings

ML Commons supports the following settings for limiting the number and duration of ML tasks and models on each node:

- `plugins.ml_commons.max_ml_task_per_node` (Dynamic, integer): The maximum number of ML tasks that can run on each ML node. When set to `0`, no ML tasks run on any node. Valid values are 0--10,000. Default is `10`.

- `plugins.ml_commons.max_model_on_node` (Dynamic, integer): The maximum number of models that can be deployed to each ML node. When set to `0`, no models can be deployed to any node. Valid values are 0--10,000. Default is `10`.

- `plugins.ml_commons.max_register_model_tasks_per_node` (Dynamic, integer): The maximum number of model registration tasks that can run in parallel on one node. When set to `0`, no models can be registered on any node. Valid values are 0--10. Default is `10`.

- `plugins.ml_commons.max_deploy_model_tasks_per_node` (Dynamic, integer): The maximum number of model deployment tasks that can run in parallel on one node. When set to `0`, no models can be deployed to any node. Valid values are 0--10. Default is `10`.

- `plugins.ml_commons.ml_task_timeout_in_seconds` (Dynamic, integer): The amount of time, in seconds, that an ML task can run. After the timeout, the task fails. Valid values are 1--86,400. Default is `600`.

- `plugins.ml_commons.sync_up_job_interval_in_seconds` (Dynamic, integer): The interval, in seconds, at which ML Commons runs a job that syncs newly deployed or undeployed models on each node. This job keeps the runtime information returned by the [Profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/profile/) up to date. When set to `0`, ML Commons stops the sync job. Valid values are 0--86,400. Default is `10`.

- `plugins.ml_commons.monitoring_request_count` (Dynamic, long): The number of prediction requests monitored on each node. When set to `0`, OpenSearch clears all monitored prediction requests from the cache and stops monitoring new prediction requests. Valid values are 0--10,000,000. Default is `100`.

## Model registration settings

By default, ML Commons allows registration only of [pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) from the OpenSearch model repository. ML Commons supports the following settings for registering models from other sources:

- `plugins.ml_commons.allow_registering_model_via_url` (Dynamic, Boolean): When `true`, users can register models using a URL. Default is `false`.

- `plugins.ml_commons.allow_registering_model_via_local_file` (Dynamic, Boolean): When `true`, users can register models using a local file. Default is `false`.

- `plugins.ml_commons.trusted_url_regex` (Dynamic, string): A Java regular expression that a model URL must match for the model to be registered. The default value allows registering a model file from any HTTP, HTTPS, FTP, or local file URL. Default is `"^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"`.

When registering a model from a URL, make sure the source is trusted. Loading models from untrusted sources can pose security risks. For more information, see [PyTorch security guidelines for untrusted models](https://github.com/pytorch/pytorch/blob/main/SECURITY.md#untrusted-models).
{: .warning}

The default value of `plugins.ml_commons.trusted_url_regex` is not secure. For security, set it to a regular expression that matches only the trusted repository containing your models, for example, `https://github.com/opensearch-project/ml-commons/blob/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/*`.
{: .warning }

## Circuit breaker settings

Before running an ML task, ML Commons checks memory and disk usage. If usage exceeds a threshold, OpenSearch triggers a circuit breaker, throws an exception, and doesn't run the task. ML Commons supports the following circuit breaker settings:

- `plugins.ml_commons.native_memory_threshold` (Dynamic, integer): The maximum native memory usage, as a percentage of the total system memory, at which ML tasks can run. This circuit breaker prevents out-of-memory errors when too many models are loaded. When set to `0`, no ML tasks run. When set to `100`, the circuit breaker is disabled. Valid values are 0--100. Default is `90`.

- `plugins.ml_commons.jvm_heap_memory_threshold` (Dynamic, integer): The maximum JVM heap memory usage, as a percentage of the total JVM heap, at which ML tasks can run. When set to `0`, no ML tasks run. When set to `100`, the circuit breaker is disabled. Valid values are 0--100. Default is `85`.

- `plugins.ml_commons.disk_free_space_threshold` (Dynamic, byte size): The minimum amount of free disk space required to run an ML task. If the free disk space falls below this value, the circuit breaker is triggered. To disable the circuit breaker, set this value to `-1`. Default is `5gb`.

## Model deployment settings

ML Commons supports the following settings for automatically deploying and redeploying models:

- `plugins.ml_commons.model_auto_deploy.enable` (Dynamic, Boolean): When `true`, OpenSearch automatically deploys an externally hosted model when it receives a prediction request for that model and the model is not yet deployed. Default is `true`.

- `plugins.ml_commons.model_auto_redeploy.enable` (Dynamic, Boolean): When `true`, OpenSearch automatically redeploys deployed or partially deployed models after a cluster failure. If all ML nodes in a cluster fail, the model enters the `DEPLOY_FAILED` state and must be deployed manually. Default is `true`.

- `plugins.ml_commons.model_auto_redeploy.lifetime_retry_times` (Dynamic, integer): The maximum number of times that OpenSearch attempts to redeploy a deployed or partially deployed model when ML nodes in a cluster fail or new ML nodes join the cluster. When set to `0` or a negative value, OpenSearch doesn't automatically redeploy models. Default is `3`.

- `plugins.ml_commons.model_auto_redeploy_success_ratio` (Dynamic, float): The minimum fraction of available ML nodes on which a model must be redeployed for automatic redeployment to succeed. For example, if the ratio is `0.7` and the model is redeployed on 70% of the available ML nodes, the redeployment succeeds. If the model is redeployed on fewer than 70% of the available ML nodes, OpenSearch retries the redeployment until it succeeds or reaches the `plugins.ml_commons.model_auto_redeploy.lifetime_retry_times` limit. Valid values are 0--1. Default is `0.8`.

## Dynamic batching memory settings

All models on a node share the memory available for [dynamic batching]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batching-requests/#dynamically-batching-small-prediction-requests). When this memory is exhausted, OpenSearch rejects new queue entries. Retry rejected requests using backoff, or adjust the memory settings for the workload. ML Commons supports the following settings for controlling the amount of this memory:

- `plugins.ml_commons.dynamic_batching.memory.fraction` (Dynamic, double): The fraction of the maximum JVM heap used to calculate the amount of memory available for dynamic batching on each node. The calculated value is bounded by `plugins.ml_commons.dynamic_batching.memory.min` and `plugins.ml_commons.dynamic_batching.memory.max`. Valid values are 0.0--0.1. Default is `0.01`.

- `plugins.ml_commons.dynamic_batching.memory.min` (Dynamic, byte size): The minimum amount of memory available for dynamic batching on each node. Default is `64mb`.

- `plugins.ml_commons.dynamic_batching.memory.max` (Dynamic, byte size): The maximum amount of memory available for dynamic batching on each node. This value must be greater than or equal to `plugins.ml_commons.dynamic_batching.memory.min`. Default is `512mb`.

## Feature settings

ML Commons supports the following settings for enabling and disabling features:

- `plugins.ml_commons.remote_inference.enabled` (Dynamic, Boolean): When `false`, users can't create connectors or register, deploy, or run predictions using externally hosted models. Default is `true`.

- `plugins.ml_commons.local_model.enabled` (Dynamic, Boolean): When `false`, users can't register, deploy, or run predictions using local models. Default is `true`.

- `plugins.ml_commons.connector_access_control_enabled` (Dynamic, Boolean): When `true`, admins can control access to the Connector APIs using `backend_roles`. Default is `false`.

- `plugins.ml_commons.connector.vertexai_enabled` (Dynamic, Boolean): When `true`, users can create connectors that use the `google_cloud` protocol. For more information, see [Google Cloud authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/google-cloud/). Default is `false`.

- `plugins.ml_commons.safe_delete_model` (Dynamic, Boolean): When `true`, OpenSearch checks for downstream dependencies before deleting a model. If the model is in use by agents, search pipelines, ingest pipelines, or other downstream tasks, OpenSearch returns an error and doesn't delete the model. Default is `false`.

- `plugins.ml_commons.enable_inhouse_python_model` (Dynamic, Boolean): When `true`, users can run Python-based models supported by OpenSearch, such as [metrics correlation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#metrics-correlation). Default is `false`.

- `plugins.ml_commons.agent_framework_enabled` (Dynamic, Boolean): When `true`, enables the agent framework, including agents and tools, and allows users to register, execute, delete, retrieve, and search agents. Default is `true`.

- `plugins.ml_commons.memory_feature_enabled` (Dynamic, Boolean): When `true`, enables conversational memory, which stores all messages from a conversation for conversational search. Default is `true`.

- `plugins.ml_commons.agentic_memory_enabled` (Dynamic, Boolean): When `true`, enables [agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/), which provides memory management for AI agents, including session memory, working memory, long-term memory, and memory history organized by namespace. Default is `true`.

- `plugins.ml_commons.rag_pipeline_feature_enabled` (Dynamic, Boolean): When `true`, enables the search processors for retrieval-augmented generation (RAG). RAG enhances query results by generating responses using relevant information from memory and previous conversations. Default is `true`.
