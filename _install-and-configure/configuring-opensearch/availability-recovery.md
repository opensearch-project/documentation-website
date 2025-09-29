---
layout: default
title: Availability and recovery settings
parent: Configuring OpenSearch
nav_order: 80
---

# Availability and recovery settings

Availability and recovery settings include settings for the following:

- [General recovery settings](#general-recovery-settings)
- [Snapshots](#snapshot-settings)
- [Cluster manager task throttling](#cluster-manager-task-throttling-settings)
- [Remote-backed storage](#remote-backed-storage-settings)
- [Search backpressure](#search-backpressure-settings)
- [Shard indexing backpressure](#shard-indexing-backpressure-settings)
- [Segment replication](#segment-replication-settings)
- [Cross-cluster replication](#cross-cluster-replication-settings)

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## General recovery settings

OpenSearch supports the following general recovery settings:

- `indices.recovery.chunk_size` (Dynamic, byte unit): Controls the chunk size used when transferring data during index recovery operations. This setting affects the amount of data transferred in each network request during shard recovery. Larger chunk sizes can improve recovery speed but may increase memory usage. Default is `512kb`.

- `indices.recovery.recovery_activity_timeout` (Dynamic, time unit): Sets the timeout for individual recovery activities during shard recovery operations. If a recovery activity (such as transferring a file chunk) takes longer than this timeout, the recovery operation is considered failed and will be retried. Default is `30s`.

## Snapshot settings

OpenSearch supports the following snapshot settings:

- `snapshot.max_concurrent_operations`(Dynamic, integer): The maximum number of concurrent snapshot operations. Default is `1000`. 

### Security-related snapshot settings

For security-related snapshot settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).

### Shared file system

For information about using a shared file system, see [Shared file system]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#shared-file-system).

### Amazon S3 settings

For information about Amazon S3 repository settings, see [Amazon S3]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3).

## Cluster manager task throttling settings

For information about cluster manager task throttling settings, see [Setting throttling limits]({{site.url}}{{site.baseurl}}/tuning-your-cluster/cluster-manager-task-throttling/#setting-throttling-limits).

## Remote-backed storage settings

OpenSearch supports the following cluster-level remote-backed storage settings:

- `cluster.remote_store.translog.buffer_interval` (Dynamic, time unit): The default value of the translog buffer interval used when performing periodic translog updates. This setting is only effective when the index setting `index.remote_store.translog.buffer_interval` is not present. 

For more remote-backed storage settings, see [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/) and [Configuring remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/#configuring-remote-backed-storage).

For remote segment backpressure settings, see [Remote segment backpressure settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/#remote-segment-backpressure-settings).

## Search backpressure settings

Search backpressure is a mechanism used to identify resource-intensive search requests and cancel them when the node is under duress. For more information, see [Search backpressure settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/search-backpressure/#search-backpressure-settings).

## Shard indexing backpressure settings

Shard indexing backpressure is a smart rejection mechanism at a per-shard level that dynamically rejects indexing requests when your cluster is under strain. For more information, see shard indexing backpressure [settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/shard-indexing-settings/).

## Segment replication settings

For information about segment replication settings, see [Segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/index/).

For information about segment replication backpressure settings, see [Segment replication backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/backpressure/).

## Cross-cluster replication settings

For information about cross-cluster replication settings, see [Replication settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/settings/).
