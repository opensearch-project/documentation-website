---
layout: default
title: Settings
nav_order: 40
---

# Replication settings

The replication plugin adds several settings to the standard OpenSearch cluster settings.
The settings are dynamic, so you can change the default behavior of the plugin without restarting your cluster.
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

These settings manage the resources consumed by remote recoveries. We don’t recommend changing these settings; the defaults should work well for most use cases.

Setting | Default | Description
:--- | :--- | :---
`plugins.replication.follower.index.recovery.chunk_size` | 10MB | The chunk size requested by the follower cluster during file transfer. Specify the chunk size as a value and unit, for example, 10MB, 5KB. See [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).
`plugins.replication.follower.index.recovery.max_concurrent_file_chunks` | 4 | The number of file chunk requests that can be sent in parallel for each recovery. 
`plugins.replication.follower.index.ops_batch_size` | 5000 | The number of operations that can be fetched at a time during the syncing phase of replication.
`plugins.replication.follower.concurrent_readers_per_shard` | 2 | The number of concurrent requests from the follower cluster per shard during the syncing phase of replication.
`plugins.replication.autofollow.fetch_poll_interval` | 30s | How often auto-follow tasks poll the leader cluster for new matching indices.
`plugins.replication.follower.metadata_sync_interval` | 60s | How often the follower cluster polls the leader cluster for updated index metadata.
`plugins.replication.translog.retention_lease.pruning.enabled` | TBD | If enabled, prunes the translog based on retention leases on the leader index.
`plugins.replication.translog.retention_size` | TBD | Controls the size of the translog on the leader index.

