---
layout: default
title: Cross-cluster replication
nav_order: 1
has_children: false

---

# Cross-cluster replication

The cross-cluster replication plugin lets you replicate indices, mappings, and metadata from one OpenSearch cluster to another. It follows an active-passive replication model where the follower index (where the data is replicated) pulls data from the leader (source) index.

The replication plugin supports replication of indices using wildcard pattern matching and provides commands to pause, resume, and stop replication. Once replication starts on an index, it initiates a persistent background task on the primary shard on the follower cluster that continuously polls corresponding shards from the leader cluster for updates.

The replication plugin integrates with the security plugin so you can encrypt cross-cluster traffic with node-to-node encryption and control access to replication activities.

To start, see [Get started with cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/).


