---
layout: default
title: Snapshots
nav_order: 5
has_children: true
parent: Availability and recovery
redirect_from: 
  - /opensearch/snapshots/
  - /opensearch/snapshots/index/
has_toc: false
---

# Snapshots

Snapshots are backups of a cluster's indexes and state. State includes cluster settings, node information, index metadata (mappings, settings, or templates), and shard allocation.

Snapshots have two main uses:

- **Recovering from failure**

  For example, if cluster health goes red, you might restore the red indexes from a snapshot.

- **Migrating from one cluster to another**

  For example, if you're moving from a proof-of-concept to a production cluster, you might take a snapshot of the former and restore it on the latter.


You can take and restore snapshots using the [snapshot API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/). 

If you need to automate snapshot creation, you can use the [snapshot management]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-management/) feature.
