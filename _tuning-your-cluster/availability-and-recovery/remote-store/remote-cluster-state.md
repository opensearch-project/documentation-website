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
Any time new cluster manager nodes are launched after disaster recovery, the nodes will automatically bootstrap using the latest metadata stored in the remote repository. 
After the metadata is restored automatically from the latest metadata stored and if the data nodes are unchanged in the index data, the metadata lost will be automatically recovered. However, if the data nodes have been replaced, then you can restore the index data by invoking `_remotestore/_restore` API as described in the [remote store documentation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).

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
`cluster.remote_store.state.index_metadata.upload_timeout` | 20s | The amount of time to wait for index metadata upload to complete. Note that index metadata for separate indexes is uploaded in parallel.
`cluster.remote_store.state.global_metadata.upload_timeout` | 20s | The amount of time to wait for global metadata upload to complete. Global metadata contains metadata that applies on a global-level, such as templates, cluster settings, data stream metadata and repository metadata.
`cluster.remote_store.state.metadata_manifest.upload_timeout` | 20s | The amount of time to wait for the manifest file upload to complete. The manifest file contains the details for each of the files uploaded about a single cluster state, both index metadata files and global metadata files. 


## Limitations

The remote cluster state functionality has the following limitations:
- Unsafe bootstrap scripts cannot be run when the remote cluster state is enabled. When a majority of cluster-manager nodes are lost and the cluster goes down, the user needs to replace any remaining cluster manager nodes and reseed the nodes in order to bootstrap a new cluster.
- The remote cluster state cannot be enabled without first configuring remote-backed storage.
