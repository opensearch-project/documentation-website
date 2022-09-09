---
layout: default
title: Segment Replication Feature
nav_order: 122
parent: Opensearch
has_children: true
redirect_from:
  - /opensearch/segment-replication/
---

## Segment Replication

Opensearch 2.3 contains an experimental version of segment replication.

With segment replication, segment files are copied across shards instead of indexing each shard copy across nodes. This eliminates needing to wait for every shard to get copied to act back to the original request. This improves indexing throughput, lowering resource utilization, at the expense of increased network utilization. In this configuration if the cluster manager fails without a segment being fully copied, the artifact can be pulled from the transaction log.

As an experimental feature, segment replication is behind a feature flag and must be enabled on **each node** of a cluster in addition to setting replication strategy to segment replication during indexing.
{: .note }