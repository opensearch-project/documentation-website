---
layout: default
title: Workflow settings
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/automating-configurations/workflow-settings/
---

# Workflow settings

The following keys represent configurable workflow settings.

|Setting	|Data type	|Default value	|Description	|
|:---	|:---	|:---	|:---	|
|`plugins.flow_framework.enabled`	|Boolean	|`false`	|Whether the Flow Framework API is enabled.	|
|`plugins.flow_framework.max_workflows`	|Integer	|`1000`	| The maximum number of workflows that you can create. When the limit is above 1,000, the number of existing workflows is defined as a lower bound for performance reasons, so the actual maximum may slightly exceed this value.	|
|`plugins.flow_framework.max_workflow_steps`	|Integer	|`50`	|The maximum number of steps a workflow can have.	|
|`plugins.flow_framework.request_timeout`	|Time units	|`10s`	|The default timeout for REST requests, which applies to internal search queries.	|
|`plugins.flow_framework.task_request_retry_duration`	|Time units	|`5s`	| When steps correspond to an API that produces a `task_id`, OpenSearch will retry them at this interval until completion.	|
