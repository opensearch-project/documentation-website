---
layout: default
title: Remote cluster state
nav_order: 5
parent: Remote-backed storage
grand_parent: Availability and recovery
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-cluster-state/
---

# Remote cluster state

Introduced 2.10
{: .label .label-purple }

The _remote cluster state_ functionality for remote-backed storage protects against any cluster state metadata loss resulting due to the permanent loss of the majority of cluster manager nodes inside the cluster.

_Cluster state_ is an internal data structure that contains the metadata of the cluster, including the following: 
- Index settings 
- Index mappings 
- Active copies of shards in the cluster 
- Cluster-level settings
- Data streams
- Templates

The cluster state metadata is managed by the elected cluster manager node and is essential for the cluster to properly function. When the cluster loses the majority of the cluster manager nodes permanently, then the cluster may experience data loss because the latest cluster state metadata might not be present in the surviving cluster manager nodes. Persisting the state of all the cluster manager nodes in the cluster to remote-backed storage provides better durability.

When the remote cluster state feature is enabled, the cluster metadata will be published to a remote repository configured in the cluster.
Any time new cluster manager nodes are launched after disaster recovery, the nodes will automatically bootstrap using the latest metadata stored in the remote repository. This provides metadata durability. 

You can enable remote cluster state independently of remote-backed data storage.
{: .note}

If you require data durability, you must enable remote-backed data storage as described in the [remote store documentation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).

## Configuring the remote cluster state

Remote cluster state settings can be enabled while bootstrapping the cluster. After the remote cluster state is enabled, it can be disabled by updating the settings and performing a rolling restart of all the nodes.

To enable the remote cluster state for a given cluster, add the following cluster-level and repository settings to the cluster's `opensearch.yml` file:

```yml
# Enable Remote cluster state cluster setting
cluster.remote_store.state.enabled: true

# Remote cluster state repository settings
node.attr.remote_store.state.repository: my-remote-state-repo
node.attr.remote_store.repository.my-remote-state-repo.type: s3
node.attr.remote_store.repository.my-remote-state-repo.settings.bucket: <Bucket Name 3>
node.attr.remote_store.repository.my-remote-state-repo.settings.base_path: <Bucket Base Path 3>
node.attr.remote_store.repository.my-remote-state-repo.settings.region: <Bucket region>
```
{% include copy-curl.html %}

In addition to the mandatory static settings, you can configure the following dynamic settings based on your cluster's requirements:

Setting | Default | Description
:--- | :--- | :---
`cluster.remote_store.state.index_metadata.upload_timeout` | 20s | Deprecated. Use `cluster.remote_store.state.global_metadata.upload_timeout` instead.
`cluster.remote_store.state.global_metadata.upload_timeout` | 20s | The amount of time to wait for the cluster state upload to complete.
`cluster.remote_store.state.metadata_manifest.upload_timeout` | 20s | The amount of time to wait for the manifest file upload to complete. The manifest file contains the details of each of the files uploaded for a single cluster state, both index metadata files and global metadata files.
`cluster.remote_store.state.cleanup_interval` | 300s | The interval at which the asynchronous remote state clean-up task runs. This task deletes any old remote state files. 


## Limitations

The remote cluster state functionality has the following limitations:
- Unsafe bootstrap scripts cannot be run when the remote cluster state is enabled. When a majority of cluster-manager nodes are lost and the cluster goes down, the user needs to replace any remaining cluster manager nodes and reseed the nodes in order to bootstrap a new cluster.

## Remote cluster state publication


The cluster manager node processes updates to the cluster state. It then publishes the updated cluster state through the local transport layer to all of the follower nodes. With the `remote_store.publication` feature enabled, the cluster state is backed up to the remote store during every state update. The follower nodes can then fetch the state from the remote store directly, which reduces the overhead on the cluster manager node for publication. 

To enable the feature flag for the `remote_store.publication` feature, follow the steps in the [experimental feature flag documentation]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

Enabling the setting does not change the publication flow, and follower nodes will not send acknowledgements back to the cluster manager node
until they download the updated cluster state from the remote store.

You must enable the remote cluster state feature in order for remote publication to work. To modify the remote publication behavior, the following routing table repository settings can be used, which contain the shard allocation details for each index in the remote cluster state:

```yml
# Remote routing table repository settings
node.attr.remote_store.routing_table.repository: my-remote-routing-table-repo
node.attr.remote_store.repository.my-remote-routing-table-repo.type: s3
node.attr.remote_store.repository.my-remote-routing-table-repo.settings.bucket: <Bucket Name 3>
node.attr.remote_store.repository.my-remote-routing-table-repo.settings.region: <Bucket region>
```

You do not have to use different remote store repositories for state and routing because both state and routing can use the same repository settings.

To configure remote publication, use the following cluster settings.

Setting | Default | Description
:--- | :--- | :---
`cluster.remote_store.state.read_timeout` | 20s | The amount of time to wait for remote state download to complete on the follower node.
`cluster.remote_store.routing_table.path_type` | HASHED_PREFIX | The path type to be used for creating an index routing path in the blob store. Valid values are `FIXED`, `HASHED_PREFIX`, and `HASHED_INFIX`.
`cluster.remote_store.routing_table.path_hash_algo` | FNV_1A_BASE64 | The algorithm to be used for constructing the prefix or infix of the blob store path. This setting is applied if `cluster.remote_store.routing_table.path_type` is `hashed_prefix` or `hashed_infix`. Valid algorithm values are `FNV_1A_BASE64` and `FNV_1A_COMPOSITE_1`.
