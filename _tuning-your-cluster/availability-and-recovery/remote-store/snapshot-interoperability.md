---
layout: default
title: Shallow snapshots
nav_order: 15
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Shallow snapshots

Shallow copy snapshots allow you to reference data from an entire remote-backed segment instead of storing all of the data from the segment in a snapshot. This makes accessing segment data faster than normal snapshots, because segment data is not stored in the snapshot repository.

## Enabling shallow snapshots

Use the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/) to enable the `remote_store_index_shallow_copy` repository setting, as shown in the following example:

```bash
PUT _cluster/settings
{
   "persistent":{
      "remote_store_index_shallow_copy": true
   }
}
```
{% include copy-curl.html %}

Once enabled, all requests using the [Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/) will remain the same for all snapshots. After the setting is enabled, we recommend not disabling the setting. Doing so could affect data durability. 

## Considerations

Consider the following before using shallow copy snapshots:

- Shallow copy snapshots only work for remote-backed indexes.
- All nodes in the cluster must use OpenSearch 2.10 or later to take advantage of shallow copy snapshots.
- There is no difference in file size between standard (regular, normal, primary or replica???) shards and shallow copy snapshot shards because no segment data is stored in the snapshot itself.
- Searchable snapshots are not supported inside shallow copy snapshots.
