---
layout: default
title: Workload management
nav_order: 90
has_children: true
parent: Availability and recovery
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/
---

# Workload management
Introduced 2.18
{: .label .label-purple }

Workload management allows you to group search traffic and isolate network resources, preventing the overuse of network resources by specific requests. It offers the following benefits:

- Tenant-level admission control and reactive query management. When resource usage exceeds configured limits, it automatically identifies and cancels demanding queries, ensuring fair resource distribution.

- Tenant-level isolation within the cluster for search workloads, operating at the node level.

## Installing workload management

Using workload management requires installing the Workload Management plugin. To install the plugin, use the following command: 

```bash
./bin/opensearch-plugin install workload-management
```
{% include copy.html %}

Then restart your cluster. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Workload groups

A _workload group_ is a logical grouping of tasks with defined resource limits. System administrators can dynamically manage workload groups using the Workload Management APIs. These workload groups can be used to create search requests with resource limits. For more information, see [Workload groups]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/).

The following example request adds a workload group named `analytics`:

```json
PUT _wlm/workload_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  }
}
```
{% include copy-curl.html %}

When creating a workload group, make sure that the sum of the resource limits for a single resource, such as `cpu` or `memory`, does not exceed `1`.
{: .important}

OpenSearch responds with the set resource limits and the workload group ID:

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

## Using the workload group ID

You can associate a request with a workload group ID to manage and allocate resources within the limits defined by the workload group. By using this ID, request routing and tracking are associated with the workload group, ensuring resource quotas and task limits are maintained.

The following example request uses the workload group ID from the preceding response to ensure that the request does not exceed the `analytics` workload group's resource limits. Pass the workload group ID as a custom request header:

```json
curl -X GET "http://localhost:9200/testindex/_search?pretty" \
  -H "Content-Type: application/json" \
  -H "workloadGroupId: preXpc67RbKKeCyka72_Gw" \
  -d '{
    "query": {
      "range": {
        "total_amount": {
          "gte": 5,
          "lt": 15
        }
      }
    }
  }'
```
{% include copy.html %}

To avoid passing the ID in every query, you can create rules to apply the ID automatically. For more information, see [Workload group rules]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-group-rules/).

## Operating modes

The `wlm.workload_group.mode` cluster-level setting controls whether workload management is globally enabled. The following operating modes determine the operating level for workload management:

- `monitor_only` (Default): Workload management monitors tasks but does not cancel or reject any queries.

- `disabled`: Workload management is disabled, with no monitoring or enforcement.

- `enabled`: Workload management is enabled and cancels and rejects queries once the configured thresholds are reached.

To change the operating mode, update the [`wlm.workload_group.mode` setting](#mode), as described in the next section.

Additionally, each workload group defines its own `resiliency_mode`. The `resiliency_mode` defines enforcement behavior but only takes effect when `wlm.workload_group.mode` is `enabled`. For more information about `resiliency_mode`, see [Workload group parameters]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/#parameters).

## Workload management settings

You can configure workload management by updating its values using the Cluster Settings API. For more information, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

OpenSearch supports the following workload management settings:

- `wlm.workload_group.duress_streak` (Dynamic, integer): Determines the node duress threshold. Once the threshold is reached, the node is marked as in duress. Default is `3`. Minimum value is `3`.

- `wlm.workload_group.enforcement_interval` (Dynamic, long): Defines the monitoring interval in milliseconds. Default is `1000`. Minimum value is `1000`.

 <p id="mode"> </p>

- `wlm.workload_group.mode` (Dynamic, enum): Defines the operating mode. Valid values are `enabled`, `disabled`, and `monitor_only`. Default is `monitor_only`. For more information, see [Operating modes](#operating-modes).

- `wlm.workload_group.node.memory_rejection_threshold` (Dynamic, double): Defines the workload group level memory threshold. When the threshold is reached, the request is rejected. Default is `0.8`. Maximum value is `0.9`.

- `wlm.workload_group.node.cpu_rejection_threshold` (Dynamic, double): Defines the workload group level CPU threshold. When the threshold is reached, the request is rejected. Default is `0.8`. Maximum value is `0.9`.

- `wlm.workload_group.node.memory_cancellation_threshold` (Dynamic, double): Controls whether the node is considered to be in duress when the memory threshold is reached. Requests routed to nodes in duress are canceled. Default is `0.9`. Maximum value is `0.95`.

- `wlm.workload_group.node.cpu_cancellation_threshold` (Dynamic, double): Controls whether the node is considered to be in duress when the CPU threshold is reached. Requests routed to nodes in duress are canceled. Default is `0.9`. Maximum value is `0.95`.

When setting rejection and cancellation thresholds, remember that the rejection threshold for a resource must always be lower than the cancellation threshold. 
{: .important}

## Workload Management Stats API

The Workload Management Stats API provides information about the current status of the Workload Management plugin.

To receive statistics for all workload groups, use the following request:

```json
GET _wlm/stats
```
{% include copy-curl.html %}

The response returns workload management statistics for each workload group:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "XXXXXXYYYYYYYY",
  "A3L9EfBIQf2anrrUhh_goA": {
    "workload_groups": {
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
      "DEFAULT_WORKLOAD_GROUP": {
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

To filter by a specific workload group, provide its ID as a path parameter:

```json
GET _wlm/stats/wfbdJoDAS0mYiLbEAjd1sA
```
{% include copy-curl.html %}

### Response body fields 

The response contains the following fields.

| Field name | Description                                                                                                                                      |
| :--- |:-------------------------------------------------------------------------------------------------------------------------------------------------| 
| `total_completions`  | The total number of request completions in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests. |
| `total_rejections`    | The total number request rejections in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests.     |
| `total_cancellations` | The total number of cancellations in the `workload_group` at the given node. This includes all shard-level and coordinator-level requests.       |
| `cpu`   | The `cpu` resource type statistics for the `workload_group`.                                                                                     | 
| `memory`  | The `memory` resource type statistics for the `workload_group`.                                                                                  | 

### Resource type statistics

The resource type statistics objects contain the following fields.

| Field name  | Description                                                                                                                                                                                 |
| :--- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `current_usage` | The resource usage for the `workload_group` at the given node based on the last run of the monitoring thread. This value is updated based on the `wlm.workload_group.enforcement_interval`. |
| `cancellations` | The number of cancellations resulting from the cancellation threshold being reached.                                                                                                        |
| `rejections`    | The number of rejections resulting from the cancellation threshold being reached.                                                                                                           |

## Permissions

Only users with administrator-level permissions can create and update workload groups using the Workload Management APIs.