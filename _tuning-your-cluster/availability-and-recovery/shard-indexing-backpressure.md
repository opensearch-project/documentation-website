---
layout: default
title: Shard indexing backpressure
nav_order: 62
has_children: true
parent: Availability and recovery
redirect_from: 
  - /opensearch/shard-indexing-backpressure/
---

# Shard indexing backpressure

Shard indexing backpressure is a smart rejection mechanism at a per-shard level that dynamically rejects indexing requests when your cluster is under strain. It propagates a backpressure that transfers requests from an overwhelmed node or shard to other nodes or shards that are still healthy.

With shard indexing backpressure, you can prevent nodes in your cluster from running into cascading failures due to performance degradation caused by slow nodes, stuck tasks, resource-intensive requests, traffic surges, skewed shard allocations, and so on.

Shard indexing backpressure comes into effect only when one primary and one secondary parameter is breached.

## Primary parameters

Primary parameters are early indicators that a cluster is under strain:

- Shard memory limit breach: If the memory usage of a shard exceeds 95% of its allocated memory, this limit is breached.
- Node memory limit breach: If the memory usage of a node exceeds 70% of its allocated memory, this limit is breached.

The breach of primary parameters doesn’t cause any actual request rejections, it just triggers an evaluation of the secondary parameters.

## Secondary parameters

Secondary parameters check the performance at the shard level to confirm that the cluster is under strain:

- Throughput: If the throughput at the shard level decreases significantly in its historic view, this limit is breached.
- Successful Request: If the number of pending requests increases significantly in its historic view, this limit is breached.
