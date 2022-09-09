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

With segment replication, segment files are copied across shards instead of indexing documents on each shard copy. This improves indexing throughput at the expense of increased network utilization.

As an experimental feature, segment replication will be behind a feature flag and must be enabled on **each node** of a cluster in addition to passing a new setting during index creation.
{: .note }