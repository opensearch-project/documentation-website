---
layout: default
title: Workload management
nav_order: 60
has_children: false
parent: Availability and recovery
---

# Workload management

Workload management is a mechanism that allows administrators to organize queries into distinct groups, referred to as _query groups_. These query groups enable admins to limit the cumulative resource usage of each group, ensuring more balanced and fair resource distribution between them. This mechanism provides greater control over resource consumption so that no single group can monopolize cluster resources at the expense of others.

## Query group

A query group is a logical construct designed to manage search requests within defined virtual resource limits. The query group service tracks and aggregates resource usage at the node level for different groups, enforcing restrictions to ensure that no group exceeds its allocated resources. Depending on the configured containment mode, the system can limit or terminate tasks that surpass these predefined thresholds.

Because the definition of a query group is stored in the cluster state, these resource limits are enforced consistently across all nodes in the cluster.

### Schema

Query groups use the following schema:

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

Resource types represent the various system resources that are monitored and managed across different query groups. The following resource types are supported:

- CPU usage
- JVM memory usage

### Resiliency mode

Resiliency mode determines how the assigned resource limits relate to the actual allowed resource usage. The following resiliency modes are supported:

- **Soft mode** -- The query group can exceed the query group resource limits if the node is not under duress.
- **Enforced mode** -- The query group will never exceed the assigned limits and will be canceled as soon as the limits are exceeded.
- **Monitor mode** -- The query group will not cause any cancellations and will only log the eligible task cancellations.

## Workload management settings

Workload management settings allow you to define thresholds for rejecting or canceling tasks based on resource usage. Adjusting the following settings can help to maintain optimal performance and stability within your OpenSearch cluster.

Setting | Default | Description
:--- | :--- | :---
`wlm.query_group.node.memory_rejection_threshold` | `0.8` | The memory-based rejection threshold for query groups at the node level. Tasks that exceed this threshold will be rejected. The maximum allowed value is `0.9`.  
`wlm.query_group.node.memory_cancellation_threshold` | `0.9` | The memory-based cancellation threshold for query groups at the node level. Tasks that exceed this threshold will be canceled. The maximum allowed value is `0.95`.  
`wlm.query_group.node.cpu_rejection_threshold` | `0.8` | The CPU-based rejection threshold for query groups at the node level. Tasks that exceed this threshold will be rejected. The maximum allowed value is `0.9`.  
`wlm.query_group.node.cpu_cancellation_threshold` | `0.9` | The CPU-based cancellation threshold for query groups at the node level. Tasks that exceed this threshold will be canceled. The maximum allowed value is `0.95`.
