---
layout: default
title: Workload Management
nav_order: 62
has_children: false
parent: workload-management
redirect_from: 
  - /opensearch/workload-management/
---

### Overview
Workload management allows users to group search traffic and isolate system resources, preventing resource hogging by specific requests. This ensures fair resource allocation, even for short-lived, low-intensity queries.
This feature offers tenant-level admission control and reactive query management. It can identify and cancel resource-intensive queries when configured thresholds are exceeded, ensuring fair resource allocation.
This feature provides tenant-level isolation within the cluster for search workloads, operating at a node level.

Admins can dynamically manage these QueryGroups (create, update, delete) using REST APIs. User can use a query group id to make search request, currently we are supporting this value as an HTTP Header called `queryGroupId`.

### QueryGroup
This construct enables us to define the groups/tenants. It has the following schema

```json
{
  "_id" : "16YGxFlPRdqIO7K4EACJlw",
  "name" : "ping",
  "resiliency_mode" : "soft",
  "resource_limits" : {
    "cpu" : 0.3,
    "memory": 0.2
  },
  "updated_at" : 1729814077916
}
```
Admins can dynamically manage these QueryGroups (create, update, delete) using REST APIs.

### Feature operating modes
Query group mode determines the operating level of the feature and it has the following operating modes.
- **Disabled mode** -- It means the feature will not work at all.
- **Enabled mode** -- It means the feature is enabled and will cause cancellations and rejection once the query group's configured thresholds are breached.
- **Monitor_only mode**(Default) -- It means the feature will run and monitor the tasks but it will not cancel/reject the queries .

These modes can be controlled and changed using `_cluster/settings` endpoint with `wlm.query_group.mode` setting.

### Workload management settings
There are following settings which dictates the workload management feature behavior.

| **setting name**                                     | **description**                                                                                                                                                                 |
|:-----------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `wlm.query_group.duress_streak`                      | This setting is used to determine the node duress threshold breaches consecutively to mark the node duress                                                                      |
| `wlm.query_group.enforcement_interval`               | This setting defines the monitoring interval for the feature                                                                                                                    |
| `wlm.query_group.mode`                               | defines the feature operating mode                                                                                                                                              |
| `wlm.query_group.node.memory_rejection_threshold`    | defines the value with which query group level `memory` threshold be normalised to decide whether to reject new incoming requests or not                                        |
| `wlm.query_group.node.cpu_rejection_threshold`       | defines the value with which query group level `cpu` threshold be normalised to decide whether to reject new incoming requests or not                                           |
| `wlm.query_group.node.memory_cancellation_threshold` | this value controls two things  1. Whether the node is in duress for `memory` resource type for WLM feature 2. Determine the query group level effective cancellation threshold |
| `wlm.query_group.node.cpu_cancellation_threshold`    | this value controls two things  1. Whether the node is in duress for `cpu` resource type for WLM feature 2. Determine the query group level effective cancellation threshold     |

All of these settings can be updated using `_cluster/settings` api. One more thing to be aware of regarding rejection/cancellation settings is that the rejection thresholds for a resource should always be less than the cancellation thresholds.
Because we want to give some extra headroom for running requests to complete.

### Workload management stats
The stats API is useful to gather current workload management metrices at query group level. The stats API looks like following

```json
GET _wlm/stats
```

#### Example response body
```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "XXXXXXYYYYYYYY",
  "A3L9EfBIQf2anrrUhh_goA": {
    "query_groups": {
      "16YGxFlPRdqIO7K4EACJlw": {
        "total_completions": 33570,
        "total_rejections": 0,
        "total_cancellations": 0,
        "cpu": {
          "current_usage": 0.03319935314357281,
          "cancellations": 0,
          "rejections": 0
        },
        "memory": {
          "current_usage": 0.002306486276211217,
          "cancellations": 0,
          "rejections": 0
        }
      },
      "DEFAULT_QUERY_GROUP": {
        "total_completions": 42572,
        "total_rejections": 0,
        "total_cancellations": 0,
        "cpu": {
          "current_usage": 0,
          "cancellations": 0,
          "rejections": 0
        },
        "memory": {
          "current_usage": 0,
          "cancellations": 0,
          "rejections": 0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Response body fields definitions
| Field name            | Description                                                                                                              |
|:----------------------|:-------------------------------------------------------------------------------------------------------------------------| 
| `total_completions`   | total request completions in this query_group at the given node. this includes the shard and co-ordinator level requests |
| `total_rejections`    | total rejections for the given query_group at the given node. this includes the shard and co-ordinator level requests    |
| `total_cancellations` | total cancellations for the given query_group at the given node. this includes the shard and co-ordinator level requests |
| `cpu`                 | `cpu` resource type stats for the query_group                                                                            | 
| `memory`              | `memory` resource type stats for the query_group                                                                          | 

#### Resource type stats
| Field name      | Description                                                                                                                                                                            |
|:----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `current_usage` | Resource usage for the given query group at the given node based on last run of the monitoring thread. This value is updated every `wlm.query_group.enforcement_interval` milliseconds |
| `cancellations` | Cancellation count due to this resource cancellation threshold breach                                                                                                                  |
| `rejections`    | Rejection count due to this resource cancellation threshold breach                                                                                                                     |



