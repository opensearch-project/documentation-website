---
layout: default
title: Settings
nav_order: 40
---

# Replication settings

The replication plugin adds several settings to the standard OpenSearch cluster settings.
The settings are dynamic, so you can change the default behavior of the plugin without restarting your cluster.
You can mark settings as `persistent` or `transient`.

For example, to update the retention period of the result index:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.replication.indices.recovery.parallel_chunks": "8"
  }
}
```

These settings manage the resources consumed by remote recoveries. We don’t recommend changing these settings; the defaults should work well for most use cases.

Setting | Default | Description
:--- | :--- | :---
`plugins.replication.indices.recovery.chunk_size` | 1MB | The chunk size requested by the follower cluster during file transfer. Specify the chunk size as a value and unit, for example, 10MB, 5KB. 
`plugins.replication.indices.recovery.parallel_chunks` | 5 | The number of file chunk requests that can be sent in parallel for each recovery. 
`plugins.replication.indices.recovery.request_timeout` | 60s | The amount of time to wait for individual network requests during the remote recovery process. A single action timeout can cause recovery to fail.
`plugins.replication.indices.recovery.activity_timeout` | 5m | The amount of time to wait for recovery activity. If the leader cluster doesn't receive recovery requests from the follower for this amount of time, it closes the in-memory resources needed to supply data to the follower during recovery.

