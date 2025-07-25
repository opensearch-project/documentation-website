---
layout: default
title: Segment replication 
nav_order: 64
has_children: true
redirect_from:
  - /opensearch/segment-replication/
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/segment-replication/index/
---

# Segment replication

Segment replication is an experimental feature with OpenSearch 2.3. Therefore, we do not recommend the use of segment replication in a production environment. For updates on the progress of segment replication or if you want leave feedback that could help improve the feature, see the [Segment replication git issue](https://github.com/opensearch-project/OpenSearch/issues/2194). 
{: .warning}

With segment replication, segment files are copied across shards instead of documents being indexed on each shard copy. This improves indexing throughput and lowers resource utilization at the expense of increased network utilization.

As an experimental feature, segment replication will be behind a feature flag and must be enabled on **each node** of a cluster and pass a new setting during index creation.
{: .note }

### Potential use cases

- Users who have high write loads but do not have high search requirements and are comfortable with longer refresh times.
- Users with very high loads who want to add new nodes, as you do not need to index all nodes when adding a new node to the cluster.

This is the first step in a series of features designed to decouple reads and writes in order to lower compute costs.