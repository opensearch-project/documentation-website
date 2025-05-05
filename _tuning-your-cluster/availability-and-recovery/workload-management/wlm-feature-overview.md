---
layout: default
title: Workload management
nav_order: 70
has_children: true
parent: Availability and recovery
---

Introduced 2.18
{: .label .label-purple }

# Workload management

Workload management allows you to group search traffic and isolate network resources, preventing the overuse of network resources by specific requests. It offers the following benefits:

- Tenant-level admission control and reactive query management. When resource usage exceeds configured limits, it automatically identifies and cancels demanding queries, ensuring fair resource distribution.

- Tenant-level isolation within the cluster for search workloads, operating at the node level.

## Installing workload management

To install workload management, use the following command: 

```json
./bin/opensearch-plugin install workload-management
```
{% include copy-curl.html %}

## Workload groups

A _workload group_ is a logical grouping of tasks with defined resource limits. System administrators can dynamically manage workload groups using the Workload Management APIs. These workload groups can be used to create search requests with resource limits. 

### Permissions

Only users with administrator-level permissions can create and update workload groups using the Workload Management APIs.

### Operating modes

The following operating modes determine the operating level for a workload group:

- **Disabled mode**: Workload management is disabled.

- **Enabled mode**: Workload management is enabled and will cancel and reject queries once the workload group's configured thresholds are reached.

- **Monitor_only mode** (Default): Workload management will monitor tasks but will not cancel or reject any queries.

### Example request

The following example request adds a workload group named `analytics`:

```json
PUT _wlm/workload_group
{
  “name”: “analytics”,
  “resiliency_mode”: “enforced”,
  “resource_limits”: {
    “cpu”: 0.4,
    “memory”: 0.2
  }
}
```
{% include copy-curl.html %}

When creating a workload group, make sure that the sum of the resource limits for a single resource, such as `cpu` or `memory`, does not exceed `1`.

### Example response

OpenSearch responds with the set resource limits and the `_id` for the workload group:

```json
{
  "_id":"preXpc67RbKKeCyka72_Gw",
  "name":"analytics",
  "resiliency_mode":"enforced",
  "resource_limits":{
    "cpu":0.4,
    "memory":0.2
  },
  "updated_at":1726270184642
}
```

## Using `workloadGroupID`

You can associate a query request with a `workloadGroupID` to manage and allocate resources within the limits defined by the workload group. By using this ID, request routing and tracking are associated with the workload group, ensuring resource quotas and task limits are maintained.

The following example query uses the `workloadGroupID` to ensure that the query does not exceed that workload group's resource limits:

```json
GET testindex/_search
Host: localhost:9200
Content-Type: application/json
workloadGroupId: preXpc67RbKKeCyka72_Gw
{
  "query": {
    "match": {
      "field_name": "value"
    }
  }
}
```
{% include copy-curl.html %}

## Workload management settings

The following settings can be used to customize workload management using the `_cluster/settings` API.

| **Setting name**                                           | **Description**  |
|:-----------------------------------------------------------| :--- |
| `wlm.workload_group.duress_streak`                         | Determines the node duress threshold. Once the threshold is reached, the node is marked as `in duress`. |
| `wlm.workload_group.enforcement_interval`                  | Defines the monitoring interval. |
| `wlm.workload_group.mode`                                  | Defines the [operating mode](#operating-modes). |
| `wlm.workload_group.node.memory_rejection_threshold`       | Defines the workload group level `memory` threshold. When the threshold is reached, the request is rejected. |
| `wlm.workload_group.node.cpu_rejection_threshold`          | Defines the workload group level `cpu` threshold. When the threshold is reached, the request is rejected. |
| `wlm.workload_group.node.memory_cancellation_threshold`    | Controls whether the node is considered to be in duress when the `memory` threshold is reached. Requests routed to nodes in duress are canceled. |
| `wlm.workload_group.node.cpu_cancellation_threshold`               | Controls whether the node is considered to be in duress when the `cpu` threshold is reached. Requests routed to nodes in duress are canceled. |

When setting rejection and cancellation thresholds, remember that the rejection threshold for a resource should always be lower than the cancellation threshold. 

## Workload Management Stats API

The Workload Management Stats API returns workload management metrics for a workload group, using the following method:

```json
GET _wlm/stats
```
{% include copy-curl.html %}

### Example response 

```json
{
  “_nodes”: {
    “total”: 1,
    “successful”: 1,
    “failed”: 0
  },
  “cluster_name”: “XXXXXXYYYYYYYY”,
  “A3L9EfBIQf2anrrUhh_goA”: {
    “workload_groups”: {
      “16YGxFlPRdqIO7K4EACJlw”: {
        “total_completions”: 33570,
        “total_rejections”: 0,
        “total_cancellations”: 0,
        “cpu”: {
          “current_usage”: 0.03319935314357281,
          “cancellations”: 0,
          “rejections”: 0
        },
        “memory”: {
          “current_usage”: 0.002306486276211217,
          “cancellations”: 0,
          “rejections”: 0
        }
      },
      “DEFAULT_WORKLOAD_GROUP”: {
        “total_completions”: 42572,
        “total_rejections”: 0,
        “total_cancellations”: 0,
        “cpu”: {
          “current_usage”: 0,
          “cancellations”: 0,
          “rejections”: 0
        },
        “memory”: {
          “current_usage”: 0,
          “cancellations”: 0,
          “rejections”: 0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Response body fields 

| Field name | Description                                                                                                                                      |
| :--- |:-------------------------------------------------------------------------------------------------------------------------------------------------| 
| `total_completions`  | The total number of request completions in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests. |
| `total_rejections`    | The total number request rejections in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests.     |
| `total_cancellations` | The total number of cancellations in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests.       |
| `cpu`   | The `cpu` resource type statistics for the `workload_group`.                                                                                     | 
| `memory`  | The `memory` resource type statistics for the `workload_group`.                                                                                  | 

### Resource type statistics

| Field name  | Description                                                                                                                                                                                 |
| :--- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `current_usage` | The resource usage for the `workload_group` at the given node based on the last run of the monitoring thread. This value is updated based on the `wlm.workload_group.enforcement_interval`. |
| `cancellations` | The number of cancellations resulting from the cancellation threshold being reached.                                                                                                        |
| `rejections`    | The number of rejections resulting from the cancellation threshold being reached.                                                                                                           |

