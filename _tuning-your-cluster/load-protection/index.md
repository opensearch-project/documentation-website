---
layout: default
title: Load protection
nav_order: 50
has_children: true
has_toc: true
redirect_from:
  - /tuning-your-cluster/load-protection/
---

# Load protection

OpenSearch can reject or cancel requests when a node or the cluster manager receives more work than it can complete. Search backpressure cancels resource-intensive search requests, shard indexing backpressure rejects indexing requests on overloaded shards, concurrency limits cap the number of in-flight requests for an action, and cluster manager task throttling limits the tasks that nodes submit to the cluster manager.
