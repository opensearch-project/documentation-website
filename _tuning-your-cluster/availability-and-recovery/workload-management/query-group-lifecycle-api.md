---
layout: default
title: Query group lifecycle API
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---
# Query Group Lifecycle API

The Query Group Lifecycle API in creates, updates, retrieves, and deletes query groups. The API categorizes queries into specific groups, called _query groups_ based on desired resource limits.

## Paths and HTTP method

<!-- spec_insert_start
api: wlm.get_query_group
component: paths_and_http_methods
-->
<!-- spec_insert_end -->



## Request body fields

<!-- spec_insert_start
api: wlm.get_query_group
component: query_parameters
-->
<!-- spec_insert_end -->

| Field | Description	 |
| :--- | :--- |
| `_id`  | The id of the query group. Optional.  |
| `name`  | The name of the query group. Required when creating a new query group. |
| `resiliency_mode`  | The resiliency mode of the query group. Valid modes are `enforced`, `soft`, and `monitor`. For more information about resiliency modes, see [Operating modes](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#operating-modes). |
| `resource_limits` | The resource limits of the query group. Valid resources are `cpu` and `memory`.  |

When creating a query group, make sure that the sum of the resource limits for a single resource, either `cpu` or `memory`, does not exceed 1.

## Example requests

The following requests show how to use the Query Group Lifecycle API.

### Creating a query group

```json
PUT _wlm/query_group
{
  "name": "analytics",
  "resiliency_mode": "enforced",
  "resource_limits": {
    "cpu": 0.4,
    "memory": 0.2
  }
}
```

### Updating a query group

```json
PUT _wlm/query_group/analytics
{
  "resiliency_mode": "monitor",
  "resource_limits": {
    "cpu": 0.41,
    "memory": 0.21
  }
}
```

### Getting a query group

```json
GET _wlm/query_group/analytics
```

### Deleting a query group

```json
DELETE _wlm/query_group/analytics
```

## Example responses

OpenSearch returns responses similar to the following.

### Creating a query group

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

### Updating query group

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


