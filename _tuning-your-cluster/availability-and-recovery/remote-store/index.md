---
layout: default
title: Remote-backed storage
nav_order: 40
has_children: true
parent: Availability and recovery
redirect_from: 
  - /opensearch/remote/
  - /tuning-your-cluster/availability-and-recovery/remote/
---

# Remote-backed storage

Introduced 2.10
{: .label .label-purple }


Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

With remote-backed storage, when a write request lands on the primary shard, the request is indexed to Lucene on the primary shard only. The corresponding translog is then uploaded to remote store. OpenSearch does not send the write request to the replicas, but rather performs a primary term validation to confirm that the request originator shard is still the primary shard. Primary term validation ensures that the acting primary shard fails if it becomes isolated and is unaware of the cluster manager electing a new primary.

After segments are created on the primary shard as part of the refresh, flush, and merge flow, segments are uploaded to remote segment store and the replica shards source the copy from the same store. This frees up the primary shard from data copying operation.

## Configuration

Remote-backed storage is a cluster level setting. It can only be enabled when bootstrapping to the cluster. After bootstrapping completes, the remote-backed storage cannot be enabled or disabled. This provides durability at the cluster level.

Communication to the configured remote cluster happens inside the repository plugin interface. All the existing implementations of the Repository plugin, such as Azure Blob Storage, Google Cloud Store, and AWS S3, are compatible with remote-backed storage.

Make sure remote store settings are configured the same across all nodes in the cluster. If not, bootstrapping will fail for nodes with different attributes from the elected cluster manager node.
{: .note}

To enable remote-backed storage for a given cluster, provide the remote store repository details as node attributes in `opensearch.yml`, as shown in the following example:

```yml
# Repository name
node.attr.remote_store.segment.repository: my-repo-1
node.attr.remote_store.translog.repository: my-repo-2
node.attr.remote_store.state.repository: my-repo-3

# Segment repository settings
node.attr.remote_store.repository.my-repo-1.type: s3
node.attr.remote_store.repository.my-repo-1.settings.bucket: <Bucket Name 1>
node.attr.remote_store.repository.my-repo-1.settings.base_path: <Bucket Base Path 1>
node.attr.remote_store.repository.my-repo-1.settings.region: us-east-1

# Translog repository settings
node.attr.remote_store.repository.my-repo-2.type: s3
node.attr.remote_store.repository.my-repo-2.settings.bucket: <Bucket Name 2>
node.attr.remote_store.repository.my-repo-2.settings.base_path: <Bucket Base Path 2>
node.attr.remote_store.repository.my-repo-2.settings.region: us-east-1

# Cluster state repository settings
node.attr.remote_store.repository.my-repo-3.type: s3
node.attr.remote_store.repository.my-repo-3.settings.bucket: <Bucket Name 3>
node.attr.remote_store.repository.my-repo-3.settings.base_path: <Bucket Base Path 3>
node.attr.remote_store.repository.my-repo-3.settings.region: us-east-1
```
{% include copy-curl.html %}

You do not have the use three different remote store repositories for segment, translog, and state. All three stores can share the same repository. 

After the cluster is created with the `remote_store` settings, all indexes created in that cluster will start uploading data to the configured remote store.

## Related cluster settings

You can use the following [cluster settings]({{site.url}}{{site.baseurl}}//api-reference/cluster-api/cluster-settings/) to tune how remote-backed clusters handle each workload.

| Field | Data type | Description |
| :--- | :--- | :--- |
| cluster.default.index.refresh_interval | Time unit | Sets the refresh interval when the `index.refresh_interval` setting is not provided. This setting can be useful when you want to set a default refresh interval across all indexes in a cluster and also support the `searchIdle` setting. You cannot set the interval lower than the `cluster.minimum.index.refresh_interval` setting. |
| cluster.minimum.index.refresh_interval | Time unit | Sets the minimum refresh interval and applies it to all indexes in the cluster. The `cluster.default.index.refresh_interval` setting should be higher than this setting's value. If, during index creation, the `index.refresh_interval` setting is lower than the minimum set, index creation fails. |
| cluster.remote_store.translog.buffer_interval | Time unit | The default value of the translog buffer interval used when performing periodic translog updates. This setting is only effective when the index setting `index.remote_store.translog.buffer_interval` is not present. |



## Translog

Any index changes, such as indexing or deleting documents, are written to disk during a Lucene commit. However, Lucene commits are expensive operations, so they cannot be performed after every change to the index. Instead, each shard records every indexing operation in a transaction log called *translog*. When a document is indexed, it is added to the memory buffer and recorded in the translog. Frequent refresh operations write the documents in the memory buffer to a segment and then clear the memory buffer. Periodically, a flush performs a Lucene commit, which includes writing the segments to disk using fsync, purging the old translog, and starting a new translog. Thus, a translog contains all operations that have not yet been flushed. 

when a write request lands on the primary shard, the request is indexed to Lucene and stored in the translog. After this, the request is sent to the replicas, where, in turn, it is indexed to Lucene and stored in the translog for durability. 

With segment replication, segments are created on the primary shard only and then copied to all replicas. The replicas do not index requests to Lucene, but they do create and maintain a translog.



## The `index.translog.durability` translog setting

Without remote-backed storage, indexing operations are only persisted to disk when the translog is fsynced. Therefore, any data that has not been written to disk can potentially be lost. 

The `index.translog.durability` setting controls how frequently OpenSearch fsyncs the translog to disk:

- By default, `index.translog.durability` is set to `request`. This means that fsync happens after every request, and all acknowledged write requests persist in case of failure.

- If you set `index.translog.durability` to `async`, fsync happens periodically at the specified `sync_interval` (5 seconds by default). The fsync operation is asynchronous, so acknowledge is sent without waiting for fsync. Consequently, all acknowledged writes since the last commit are lost in case of failure.

With remote-backed storage, the translog is uploaded to a remote store for durability.

`index.translog.durability` is a dynamic setting. To update it, use the following query:

```json
PUT my_index/_settings
{
  "index" : {
    "translog.durability" : "request"
  }
}
```

## Refresh-level and request-level durability

The remote store feature supports two levels of durability:

- Refresh-level durability: Segment files are uploaded to remote store after every refresh. Set the `remote_store` flag to `true` to achieve refresh-level durability. Commit-level durability is inherent, and uploads are asynchronous.

  If you need to refresh an index manually, you can use the `_refresh` API. For example, to refresh the `my_index` index, use the following request:
   
  ```json
  POST my_index/_refresh
  ```

- Request-level durability: Translogs are uploaded before acknowledging the request. Set the `translog` flag to `true` to achieve request-level durability. In this scenario, we recommend to batch as many requests as possible in a bulk request. Batching requests will improve indexing throughput and latency compared to sending individual write requests.



## Register a remote repository

Now that your deployment is running with the feature flags enabled, the next step is to register a remote repository where backups will be stored. See [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository) for more information.

## Create an index

Remote-backed storage is enabled for an index when it is created. This feature cannot be enabled for indexes that already exist.

For refresh-level durability, include the `remote_store` property to enable the feature and specify a segment repository:

```bash
curl -X PUT "https://localhost:9200/my-index?pretty" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0,
      "replication": {
        "type": "SEGMENT"
      },
      "remote_store": {
        "enabled": true,
        "repository": "segment-repo"
      }
    }
  }
}
'
```

For request-level durability, in addition to the `remote_store` and segment repository, include the `translog` property and specify a translog repository:

```bash
curl -X PUT "https://localhost:9200/my-index?pretty" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "replication": {
        "type": "SEGMENT"
      },
      "remote_store": {
        "enabled": true,
        "repository": "segment-repo",
        "translog": {
          "enabled": true,
          "repository": "translog-repo",
          "buffer_interval": "300ms"
        }
      }
    }
  }
}
'
```

You can have the same repository serve as both the segment repository and translog repository. 
{: .note}

As data is added to the index, it also will be continuously uploaded to remote storage in the form of segment and translog files because of refreshes, flushes, and translog fsyncs to disk. Along with data, other metadata files will be uploaded.
The `buffer_interval` setting specifies the time interval during which translog operations are buffered. Instead of uploading individual translog files, OpenSearch creates a single translog file with all the write operations received during the configured interval. Bundling translog files leads to higher throughput but also increases latency. The default `buffer_interval` value is 100 ms.

Setting `translog.enabled` to `true` is currently an irreversible operation.
{: .warning}

### Restoring from a backup

To restore an index from a remote backup, such as in the event of a node failure, use one of the following options:

**Restore only unassigned shards**

```bash
curl -X POST "https://localhost:9200/_remotestore/_restore" -H 'Content-Type: application/json' -d'
{
  "indices": ["my-index-1", "my-index-2"]
}
'
```

**Remote all shards of a given index**

```bash
curl -X POST "https://localhost:9200/_remotestore/_restore" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "indices": ["my-index"]
}
'
```

If the Security plugin is enabled, a user must have the `cluster:admin/remotestore/restore` permission. See [Access control](/security-plugin/access-control/index/) for information about configuring user permissions.
{: .note}

## Potential use cases

You can use remote-backed storage for the following purposes:

- To restore red clusters or indexes
- To recover all data up to the last acknowledged write, regardless of replica count, if `index.translog.durability` is set to `request`

## Known limitations

The following are known limitations of the remote-backed storage feature:

- Writing data to a remote store can be a high-latency operation when compared to writing data on the local file system. This may impact the indexing throughput and latency. For performance benchmarking results, see [issue #6376](https://github.com/opensearch-project/OpenSearch/issues/6376).

## Next steps

To track future enhancements to remote-backed storage, see [Issue #10181](https://github.com/opensearch-project/OpenSearch/issues/10181).

