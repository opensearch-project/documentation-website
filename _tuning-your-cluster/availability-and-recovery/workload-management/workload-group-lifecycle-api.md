---
layout: default
title: Workload Group Lifecycle API
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Workload Group Lifecycle API

The Workload Group Lifecycle API creates, updates, retrieves, and deletes workload groups. The API categorizes queries into specific groups, called _workload groups_, based on desired resource limits.

## Endpoints


### Create a workload group

<!-- spec_insert_start
api: wlm.create_query_group
component: endpoints
omit_header: true
-->
```json
PUT /_wlm/query_group
```
<!-- spec_insert_end -->

### Update a workload group

<!-- spec_insert_start
api: wlm.create_query_group
component: endpoints
omit_header: true
-->
```json
PUT /_wlm/query_group
```
<!-- spec_insert_end -->

### Get a workload group

<!-- spec_insert_start
api: wlm.get_query_group
component: endpoints
omit_header: true
-->
```json
GET /_wlm/query_group
GET /_wlm/query_group/{name}
```
<!-- spec_insert_end -->

### Delete a workload group

<!-- spec_insert_start
api: wlm.create_query_group
component: endpoints
omit_header: true
-->
```json
PUT /_wlm/query_group
```
<!-- spec_insert_end -->


## Request body fields

| Field | Description	 |
| :--- | :--- |
| `_id`  | The ID of the workload group, which can be used to associate query requests with the group and enforce the group's resource limits.  |
| `name`  | The name of the workload group. |
| `resiliency_mode`  | The resiliency mode of the workload group. Valid modes are `enforced`, `soft`, and `monitor`. For more information about resiliency modes, see [Operating modes]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#operating-modes). |
| `resource_limits` | The resource limits for query requests in the workload group. Valid resources are `cpu` and `memory`.  |

When creating a workload group, make sure that the sum of the resource limits for a single resource, either `cpu` or `memory`, does not exceed 1.

## Example requests

The following example requests show how to use the Workload Group Lifecycle API.

### Create a workload group

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

### Update a workload group

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


## Example responses

OpenSearch returns responses similar to the following.

### Creating a workload group

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

### Updating a workload group

```json
{
  "_id":"preXpc67RbKKeCyka72_Gw",
  "name":"analytics",
  "resiliency_mode":"monitor",
  "resource_limits":{
    "cpu":0.41,
    "memory":0.21
  },
  "updated_at":1726270333804
}
```

## Response body fields

| Field | Description	 |
| :--- | :--- |
| `_id`  | The ID of the workload group. |
| `name`  | The name of the workload group. Required when creating a new workload group. |
| `resiliency_mode`  | The resiliency mode of the workload group. |
| `resource_limits` | The resource limits of the workload group. |
| `updated_at` | The time at which the workload group was last updated. |


