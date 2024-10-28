---
layout: default
title: Query Group Lifecycle API
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---
# Query Group Lifecycle API

The Query Group Lifecycle API in OpenSearch provides functionality to create, update, get, and delete query groups, enabling users to organize and control sets of related queries under specific groups. 

## Create query group
Creates a new Query group with the specified properties.

#### Path and HTTP method
```json
PUT _wlm/query_group
```
#### Example request
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
#### Example response
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

## Update query group
Updates the properties of an existing Query Group.

#### Path and HTTP method
```json
PUT _wlm/query_group/<name>
```
#### Example request
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
#### Example response
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
## Get query group
Retrieves the properties of the provided Query Group.

#### Path and HTTP method
```json
GET _wlm/query_group/<name>
```
#### Example request
```json
GET _wlm/query_group/analytics
```
#### Example response
```json
{
  "query_groups": [
    {
      "_id": "preXpc67RbKKeCyka72_Gw",
      "name": "analytics",
      "resiliency_mode": "monitor",
      "resource_limits": {
        "cpu": 0.41,
        "memory": 0.21
      },
      "updated_at": 1726270333804
    }
  ]
}
```
## Get all query groups
Retrieves the properties of all Query groups in the cluster.

#### Path and HTTP method
```json
GET _wlm/query_group
```
#### Example request
```json
GET _wlm/query_group
```
#### Example response
```json
{
  "query_groups": [
    {
      "_id": "preXpc67RbKKeCyka72_Gw",
      "name": "analytics",
      "resiliency_mode": "monitor",
      "resource_limits": {
        "cpu": 0.41,
        "memory": 0.21
      },
      "updated_at": 1726270333804
    },
    {
      "_id": "pviC2vuep2Kc84yka43_Np",
      "name": "analytics_2",
      "resiliency_mode": "monitor",
      "resource_limits": {
        "cpu": 0.15,
        "memory": 0.3
      },
      "updated_at": 1726270840583
    }
  ]
}
```
## Delete query group
Delete the provided Query group.

#### Path and HTTP method
```json
DELETE _wlm/query_group/<name>
```
#### Example request
```json
DELETE _wlm/query_group/analytics
```
#### Example response
```json
{
  "acknowledged":true
}
```

## Fields
The query group lifecycle API contains the following fields.

| Field	                 | Description	                                                                               |
|:-----------------------|:-------------------------------------------------------------------------------------------|
| `_id`                  | The id of the query group.                                                                 |
| `name`                 | The name of the query group.                                                               |
| `resiliency_mode`      | The resiliency mode of the query group. Valid modes are `enforced`, `soft`, and `monitor`. |
| `resource_limits`      | The resource limits of the query group. Valid resources are `cpu` and `memory`.            |
| `updated_at`           | The last updated time of the query group.                                                  |
