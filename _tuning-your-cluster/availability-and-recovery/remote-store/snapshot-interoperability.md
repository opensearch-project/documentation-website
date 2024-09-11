---
layout: default
title: Shallow snapshots
nav_order: 15
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Shallow snapshots

Shallow copy snapshots allow you to reference data from an entire remote-backed repository instead of storing all of the data from the segment in a snapshot repository. This makes accessing segment data faster than using normal snapshots because segment data is not stored in the snapshot repository.

## Enabling shallow snapshots

Use the [Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/) and set the `remote_store_index_shallow_copy` repository setting to `true` to enable shallow snapshot copies, as shown in the following example:

```bash
PUT /_snapshot/snap_repo
{
        "type": "s3",
        "settings": {
            "bucket": "test-bucket",
            "base_path": "daily-snaps",
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
- The `incremental` file count and size between the current snapshot and the last snapshot is `0` when using shallow copy snapshots.
- Searchable snapshots are not supported inside shallow copy snapshots.

## Shallow snapshot v2 

Starting with OpenSearch version 2.17, the shallow snapshot feature has been improved with a new version called shallow snapshot v2. This improvement aims to make snapshot operations more efficient and scalable by introducing the following enhancements:

* Deterministic Snapshot Operations: Shallow snapshot v2 makes snapshot operations more deterministic, ensuring consistent and predictable behavior.
* Minimized Cluster State Updates: The improvement minimizes the number of cluster state updates required during snapshot operations, reducing overhead and improving performance.
* Scalability: Shallow snapshot v2 allows snapshot operations to scale independently of the number of shards in the cluster, enabling better performance and efficiency for large datasets.

## Enabling Shallow Snapshot v2

To enable the shallow snapshot v2, you need to set two repository settings:

1. remote_store_index_shallow_copy: Set this to true to enable the existing shallow snapshot feature.
2. shallow_snapshot_v2: Set this to true to enable the shallow snapshot v2 improvement.

Here's an example of how to create a repository with both settings enabled:

```bash
PUT /_snapshot/snap_repo
{
"type": "s3",
"settings": {
"bucket": "test-bucket",
"base_path": "daily-snaps",
"remote_store_index_shallow_copy": true,
"shallow_snapshot_v2": true
}
}
```
{% include copy-curl.html %}

## Limitations and Caveats

* Shallow snapshot v2 only work for remote-backed indexes.
* All nodes in the cluster must use OpenSearch 2.17 or later to take advantage of shallow snapshot v2.
