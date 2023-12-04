---
layout: default
title: Remote Cluster State
nav_order: 5
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote cluster state

Introduced 2.10
{: .label .label-purple }

The _Remote Cluster State_ functionality for remote-backed storage, protects against any cluster state metadata loss resulting due to quorum loss, permanently losing the majority of cluster manager nodes, inside the cluster.

_Cluster State_ is an internal data structure which contains the metadata of the cluster, including: 
- Index settings 
- Index mappings 
- Active copies of shards in the cluster 
- Cluster level settings
- Data streams
- Templates
Cluster durability is the function of the cluster manager node's storage. The cluster state metadata is managed by the elected cluster manager node and is essential for the cluster to properly function. When the cluster loses the majority of the cluster manager nodes permanently, then the cluster can experience data loss because the latest cluster state metadata might not be present in the surviving cluster manager nodes. Persisting the state of all the cluster manager nodes in the cluster to remote back-storage provides better durability.

When the remote cluster state feature is enabled, the cluster metadata will be published to a remote repository configured in the cluster. As of OpenSearch 2.10 currently only index metadata will persist to remote-backed storage.
Any time new cluster manager nodes are launched after disaster recovery, the nodes will bootstrap using the latest index metadata stored in the remote repository automatically. Consequently, the data of the indexes will also be restored when the remote store is enabled.

## Configuring the remote cluster state

Remote cluster state settings can be enabled while bootstrapping the cluster. After the remote cluster state is enabled, it can be disabled by updating the settings and performing a rolling restart of all the nodes.

To enable remote cluster state for a given cluster, add the following cluster-level and repository settings to the cluster's `opensearch.yml`:

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

## Limitations

The remote cluster state feature has the following limitations:
- As of OpenSearch 2.10, only index metadata can uploaded and restored from remote-backed storage.
- Unsafe bootstrap script cannot be run when remote cluster state is enabled. In case a majority of cluster-manager nodes are lost and the cluster goes down, the user needs to replace any remaining cluster-manager nodes and seed the nodes again for bootstrapping a new cluster.
- The remote cluster state cannot be enabled without first configuring remote-backed storage.
