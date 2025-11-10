---
layout: default
title: Replication settings
nav_order: 40
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/settings/
---

# Replication settings

The replication plugin adds several settings to the standard OpenSearch cluster and index settings.
The settings are dynamic, so you can change the default behavior of the plugin without restarting your cluster. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

You can mark settings as `persistent` or `transient`.

For example, to update how often the follower cluster polls the leader cluster for updates:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.replication.follower.metadata_sync_interval": "30s"
  }
}
```

These settings manage the resources consumed by remote recoveries. We don't recommend changing these settings; the defaults should work well for most use cases.

## Cluster-level settings

You can specify these settings at the cluster level to control the default behavior of replication across all indexes in the cluster. These settings apply globally unless overridden by index-level settings.

Setting | Default | Description
:--- | :--- | :---
`plugins.replication.follower.concurrent_readers_per_shard` | 2 | The number of concurrent requests from the follower cluster per shard during the syncing phase of replication.
`plugins.replication.autofollow.fetch_poll_interval` | 30s | How often auto-follow tasks poll the leader cluster for new matching indexes.
`plugins.replication.follower.metadata_sync_interval` | 60s | How often the follower cluster polls the leader cluster for updated index metadata.
`plugins.replication.translog.retention_lease.pruning.enabled` | true | If enabled, prunes the translog based on retention leases on the leader index.
`plugins.replication.translog.retention_size` | 512 MB | Controls the size of the translog on the leader index.
`plugins.replication.replicate.delete_index` | false | If enabled, the follower index is automatically deleted whenever the corresponding leader index is deleted.
`plugins.replication.follower.index.ops_batch_size` | 50000 | The number of operations that can be fetched at a time during the sync phase of replication.

## Index-level settings

You can specify these settings when creating a follower index or update them for existing follower indexes. These settings control the behavior of individual indexes during replication.

Setting | Default | Description
:--- |:------| :---
`index.plugins.replication.follower.ops_batch_size` | 50000 | The number of operations that can be fetched at a time during the sync phase of replication for the specific index. This setting overrides the cluster-level setting. 
