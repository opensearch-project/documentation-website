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

With segment replication, segment files are copied across shards instead of indexing documents on each shard copy. This improves indexing throughput and lowers resource utilization at the expense of increased network utilization.

As an experimental feature, segment replication will be behind a feature flag and must be enabled on **each node** of a cluster in addition to passing a new setting during index creation.
{: .note }

### Potential use cases

- Users who have very high write loads, but do not have high search requirements and are comfortable with longer refresh times.
- Users with very high loads who want to add new nodes, as you do not need to index all nodes when adding a new node to the cluster.

This is the first step in a series of features to decouple reads and writes to lower compute cost.