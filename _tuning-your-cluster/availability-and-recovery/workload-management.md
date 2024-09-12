---
layout: default
title: Workload management
nav_order: 60
has_children: false
parent: Availability and recovery
redirect_from: 
  - /opensearch/workload-management/
---

# Workload management

Workload management is a mechanism that allows administrators to organize queries into distinct groups, referred to as Query Groups. These Query Groups enable admins to limit the cumulative resource usage of each group, ensuring more balanced and fair resource distribution. This mechanism provides greater control over resource consumption, helping ensure that no single group can monopolize cluster resources at the expense of others.

## Query group

A Query Group is a logical construct designed to manage search requests within defined virtual resource limits. The Query Group service tracks and aggregates resource usage at the node level for different groups, enforcing restrictions to ensure that no group exceeds its allocated resources. Depending on the configured containment mode, the system can limit or terminate tasks that surpass these predefined thresholds.

Since the definition of a Query Group is stored in the cluster state, these resource limits are enforced consistently across all nodes in the cluster.

### Schema

```json
{
  "_id": "fafjafjkaf9ag8a9ga9g7ag0aagaga",
  "resource_limits": {
    "memory": 0.4,
    "cpu": 0.2
  },
  "resiliency_mode": "enforced",
  "name": "analytics",
  "updated_at": 4513232415
}
```

### Resource type

Resource type represents the various system resources that are monitored and managed across different query groups. The following Resource Types are supported:
- CPU usage
- JVM memory usage

### Resiliency mode

Resiliency mode determines how the assigned resource limits relate to the actual allowed resource usage
- Soft mode - query group can consume more than query group resource limits if node is not in duress
- Enforced mode - query group will never breach the assigned limits and will cancel as soon as the limits are breached
- Monitor mode - query group will not cause any cancellation and only log the eligible task cancellations

## Workload management settings
Workload management setting allows you to define thresholds for rejecting or canceling tasks based on resource usage. Adjusting these settings helps maintain optimal performance and stability within your OpenSearch cluster.

Setting | Default | Description
:--- | :--- | :---
`wlm.query_group.node.memory_rejection_threshold` | `0.8` | The memory-based rejection threshold for query groups at the node level. Tasks that exceed this threshold will be rejected. The maximum allowed value is `0.9`.  
`wlm.query_group.node.memory_cancellation_threshold` | `0.9` | The memory-based cancellation threshold for query groups at the node level. Tasks that exceed this threshold will be canceled. The maximum allowed value is `0.95`.  
`wlm.query_group.node.cpu_rejection_threshold` | `0.8` | The CPU-based rejection threshold for query groups at the node level. Tasks that exceed this threshold will be rejected. The maximum allowed value is `0.9`.  
`wlm.query_group.node.cpu_cancellation_threshold` | `0.9` | The CPU-based cancellation threshold for query groups at the node level. Tasks that exceed this threshold will be canceled. The maximum allowed value is `0.95`.

## QueryGroup Lifecycle APIs
Below are the APIs that can be used to manage the lifecycle of Query Groups

### Create Query Group
Creates a new Query Group with the specified properties.

#### Example request
```json
PUT _query_group
{
  "name": "analytics",
  "jvm": 0.4,
  "resiliency_mode": "monitor"
}
```
#### Example response
```json
{
  "name": "analytics",
  "jvm": 0.4,
  "resiliency_mode": "monitor",
  "updatedAt": 1718922703953
}
```
### Update Query Group
Updates the properties of an existing Query Group.

#### Example request
```json
PUT _query_group/analytics
{
  "jvm": 0.3,
  "resiliency_mode": "enforced"
}
```
#### Example response
```json
{
  "name": "analytics",
  "jvm": 0.3,
  "resiliency_mode": "enforced",
  "updatedAt": 1718922977093
}
```
### Get Query Group
Retrieves the properties of the provided Query Group.

#### Example request
```json
GET _query_group/analytics
```
#### Example response
```json
{
  "name": "analytics",
  "jvm": 0.3,
  "resiliency_mode": "enforced",
  "updatedAt": 1718922977093
}
```
### Get All Query Groups
Retrieves the properties of all Query Groups in the cluster.

#### Example request
```json
GET _query_group
```
#### Example response
```json
{
  "query_groups": [
    {
      "name": "analytics",
      "jvm": 0.3,
      "resiliency_mode": "enforced",
      "updatedAt": 1718922977093
    }
  ]
}
```
### Delete Query Group
Delete the provided Query Group.

#### Example request
```json
DELETE _query_group/analytics
```
#### Example response
```json
{
  "name": "analytics",
  "jvm": 0.3,
  "resiliency_mode": "enforced",
  "updatedAt": 1718922977093
}
```
### Delete All Query Groups
Delete all the Query Groups in the cluster.

#### Example request
```json
DELETE _query_group
```
#### Example response
```json
{
  "deleted": [
    {
      "name": "analytics",
      "jvm": 0.3,
      "resiliency_mode": "enforced",
      "updatedAt": 1718922977093
    }
  ]
}
```