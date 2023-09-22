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

## Configuring remote-backed storage

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


## Restoring from a backup

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


## Next steps

To track future enhancements to remote-backed storage, see [Issue #10181](https://github.com/opensearch-project/OpenSearch/issues/10181).

