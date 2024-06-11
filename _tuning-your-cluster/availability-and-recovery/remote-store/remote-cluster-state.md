---
layout: default
title: Remote cluster state
nav_order: 5
parent: Remote-backed storage
grand_parent: Availability and recovery
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
`cluster.remote_store.state.global_metadata.upload_timeout` | 20s | The amount of time to wait for cluster state upload to complete.
`cluster.remote_store.state.metadata_manifest.upload_timeout` | 20s | The amount of time to wait for the manifest file upload to complete. The manifest file contains the details of each of the files uploaded for a single cluster state, both index metadata files and global metadata files.
`cluster.remote_store.state.cleanup_interval` | 300s | The interval for remote state clean-up async task to run. This task deletes the old remote state files. 


## Limitations

The remote cluster state functionality has the following limitations:
- Unsafe bootstrap scripts cannot be run when the remote cluster state is enabled. When a majority of cluster-manager nodes are lost and the cluster goes down, the user needs to replace any remaining cluster manager nodes and reseed the nodes in order to bootstrap a new cluster.

## Remote Cluster State Publication
The cluster state published to remote-backed storage can be used for publication. Currently, the active cluster manager
sends the cluster state object over the transport layer to the follower nodes. This flow can be changed to fetch the
cluster state from remote store. This can be done by enabling the experimental remote publication feature. 
Enable the feature flag for `remote_store.publication` feature by following the [experiment feature flag documentation]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
When remote publication is enabled, the cluster manager node uploads the cluster state to remote store and then sends the 
remote path of the cluster state to the follower nodes. The follower nodes then download the cluster state from remote store.

The routing table is an object within the cluster state which contains the shard allocation details for each index.
This object can become large in case of large number of shards in the cluster. Routing table is required to be stored in
remote store for the remote publication to work. In order to enable remote persistence of routing table, the repository must
be configured as below:

```yml
# Remote routing table repository settings
node.attr.remote_store.routing_table.repository: my-remote-routing-table-repo
node.attr.remote_store.repository.my-remote-routing-table-repo.type: s3
node.attr.remote_store.repository.my-remote-routing-table-repo.settings.bucket: <Bucket Name 3>
node.attr.remote_store.repository.my-remote-routing-table-repo.settings.region: <Bucket region>
```
You do not have to use different remote store repositories for state and routing. 
These stores can share the same repository.

The relevant cluster settings for remote publication are listed below:

Setting | Default | Description
:--- | :--- | :---
`cluster.remote_store.state.read_timeout` | 20s | The amount of time to wait for remote state download to complete on the follower node.
`cluster.remote_store.routing_table.path_type` | HASHED_PREFIX | Path type to be used for creating index routing path in blob store. Valid values are "FIXED", "HASHED_PREFIX", "HASHED_INFIX"
`cluster.remote_store.routing_table.path_hash_algo` | FNV_1A_BASE64 | Algorithm to be used for constructing prefix or infix of blob store path. This setting comes into effect into if cluster.remote_store.routing_table.path_type is "hashed_prefix" or "hashed_infix". Valid values of algo are "FNV_1A_BASE64" or "FNV_1A_COMPOSITE_1"
