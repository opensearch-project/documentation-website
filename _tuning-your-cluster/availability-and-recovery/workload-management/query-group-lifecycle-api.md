---
layout: default
title: Query Group Lifecycle API
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Query Group Lifecycle API

The Query Group Lifecycle API creates, updates, retrieves, and deletes query groups. The API categorizes queries into specific groups, called _query groups_, based on desired resource limits.

## Path and HTTP methods

```json
PUT _wlm/query_group
PUT _wlm/query_group/<name>
GET _wlm/query_group
GET _wlm/query_group/<name>
DELETE _wlm/query_group/<name>
```

## Request body fields

| Field | Description	 |
| :--- | :--- |
| `_id`  | The ID of the query group, which can be used to associate query requests with the group and enforce the group's resource limits.  |
| `name`  | The name of the query group. |
| `resiliency_mode`  | The resiliency mode of the query group. Valid modes are `enforced`, `soft`, and `monitor`. For more information about resiliency modes, see [Operating modes](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#operating-modes). |
| `resource_limits` | The resource limits for query requests in the query group. Valid resources are `cpu` and `memory`.  |

When creating a query group, make sure that the sum of the resource limits for a single resource, either `cpu` or `memory`, does not exceed 1.

## Example requests

The following example requests show how to use the Query Group Lifecycle API.

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

### Getting a query group

```json
GET _wlm/query_group/analytics
```
{% include copy-curl.html %}

### Deleting a query group

```json
DELETE _wlm/query_group/analytics
```
{% include copy-curl.html %}

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

### Updating a query group

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
| `_id`  | The ID of the query group. |
| `name`  | The name of the query group. Required when creating a new query group. |
| `resiliency_mode`  | The resiliency mode of the query group. |
| `resource_limits` | The resource limits of the query group. |
| `updated_at` | The time at which the query group was last updated. |


