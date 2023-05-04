---
layout: default
title: Cross-cluster replication
nav_order: 12
has_children: true
redirect_from:
  - /replication-plugin/
  - /replication-plugin/index/
---

# Cross-cluster replication

The cross-cluster replication plugin lets you replicate indexes, mappings, and metadata from one OpenSearch cluster to another. Cross-cluster replication has the following benefits:
- By replicating your indexes, you ensure that you can continue to handle search requests if there's an outage.
- Replicating data across geographically distant data centers minimizes the distance between the data and the application server. This reduces expensive latencies.
- You can replicate data from multiple smaller clusters to a centralized reporting cluster, which is useful when it's inefficient to query across a large network.

Replication follows an active-passive model where the follower index (where the data is replicated) pulls data from the leader (remote) index.

The replication plugin supports replication of indexes using wildcard pattern matching and provides commands to pause, resume, and stop replication. Once replication starts on an index, it initiates persistent background tasks on all primary shards on the follower cluster, which continuously poll corresponding shards from the leader cluster for updates.

You can use the replication plugin with the Security plugin to encrypt cross-cluster traffic with node-to-node encryption and control access to replication activities.

To start, see [Get started with cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/).
