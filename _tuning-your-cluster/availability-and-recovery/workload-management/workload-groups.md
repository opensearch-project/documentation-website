---
layout: default
title: Workload groups
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
redirect_from:
  - /tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/
---

# Workload groups

A _workload group_ is a logical grouping of tasks with defined resource limits. You can create, update, retrieve, and delete workload groups using the Workload Group API. 


## Creating a workload group

To create a workload group, send the following request:

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


OpenSearch returns a response containing a workload group ID, which can be used to associate query requests with the group and enforce the group's resource limits:

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

For more information, see [Using the workload group ID]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#using-the-workload-group-id).

## Parameters

When creating or updating a workload group, you can specify the following parameters.

| Parameter | Operation | Description	 |
| :--- | :--- | :--- |
| `name`  | Create | The name of the workload group. |
| `resiliency_mode`  | Create or update | The resiliency mode of the workload group. Valid values are:<br>- `enforced` (queries are rejected if thresholds are exceeded). <br>- `soft` (queries can exceed thresholds if resources are available). <br>- `monitor` (queries are monitored but not canceled or rejected). <br> **Note**: These settings take effect only if the cluster-level `wlm.workload_group.mode` setting is `enabled`. See [Operating modes]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#operating-modes). |
| `resource_limits` | Create or update | The resource limits for query requests in the workload group. Valid resources are `cpu` and `memory`. When creating a workload group, make sure that the sum of the resource limits for a single resource, either `cpu` or `memory`, does not exceed 1. |

## Updating a workload group

To update a workload group, provide the workload group name as a path parameter and the [parameters](#parameters) that you want to update as request body fields. When you update a workload group, only the parameters you specify are changed; all others stay the same:

```json
PUT _wlm/workload_group/analytics
{
  "resiliency_mode": "monitor",
  "resource_limits": {
    "cpu": 0.41,
    "memory": 0.21
  }
}
```
{% include copy-curl.html %}

## Retrieving a workload group

To retrieve all workload groups, use the following request:

```json
GET /_wlm/workload_group
```
{% include copy-curl.html %}

To retrieve a specific workload group, provide its ID as a path parameter: 

```json
GET /_wlm/workload_group/{name}
```
{% include copy-curl.html %}

 
## Deleting a workload group

To delete a workload group, specify its name as a path parameter:

```json
DELETE /_wlm/workload_group/{name}
```
{% include copy-curl.html %}

