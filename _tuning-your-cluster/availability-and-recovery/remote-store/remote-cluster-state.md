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

Remote Cluster State protects against any cluster state metadata loss resulting due to quorum loss (permanently losing majority of cluster manager nodes) in the cluster.

Cluster State is an internal data structure which contains the metadata of the cluster along with other information. 
The metadata includes details about index metadata like settings, mappings, active copies of the shards, cluster level settings, aliases, templates and data streams. 
This metadata is managed by the elected cluster manager node and is essential for proper functioning of the cluster. When the cluster loses majority of the cluster manager nodes permanently, lets say 2 out of 3 cluster manager nodes are lost, then the cluster can experience data loss as there are no guarantees that latest cluster state metadata is present in the surviving nodes. Today, cluster durability is the function of the cluster manager node storage. And, persisting the state to remote provides better durability guarantees.

When remote cluster state feature is enabled, the cluster metadata will be published to a remote repository configured in the cluster. Note that, currently only index metadata will be persisted to remote store in OpenSearch 2.10.
Any time, the new cluster manager nodes are launched after disaster recovery, they will bootstrap using the latest index metadata stored in the remote repository automatically. Consequently, the data of the indexes will also be restored when remote store is enabled.

## Configuring remote cluster state

Remote cluster state settings are cluster level settings and can be enabled while bootstrapping the cluster. Once the remote cluster state is enabled, it can be disabled by updating the settings and performing a rolling restart of all the nodes.

To enable remote cluster state for a given cluster, provide the remote cluster state enabled setting and repository settings in `opensearch.yml` as show in the following example:

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

- Currently, only index metadata is supported for upload and restore from remote store.
- Unsafe bootstrap script cannot be run when remote cluster state is enabled. In case a majority of cluster-manager nodes are lost and the cluster goes down, the user needs to replace any remaining cluster-manager nodes and seed the nodes again for bootstrapping a new cluster.
- Remote cluster state cannot be enabled without remote store being configured
