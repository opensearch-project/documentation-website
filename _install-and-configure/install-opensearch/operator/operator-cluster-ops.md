---
layout: default
title: Cluster operations
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 50
---

# Cluster operations

The operator automates common management tasks during the cluster lifecycle, including failure recovery, rolling upgrades, configuration changes, and volume expansion.

## Cluster recovery

The operator automatically handles common failure scenarios and restarts crashed pods. Normally, the operator restarts pods one by one to maintain quorum and cluster stability.

If the operator detects multiple crashed or missing pods for a node pool at the same time, it switches into a special recovery mode that starts all pods at once and allows the cluster to form a new quorum. This parallel recovery mode is currently experimental and only works with PVC-based storage, as it uses the number of existing PVCs to determine the number of missing pods.

The recovery is done by temporarily changing the `StatefulSet` underlying each node pool and setting the `podManagementPolicy` to `Parallel`. If you encounter problems, disable parallel recovery by redeploying the operator and adding `manager.parallelRecoveryEnabled: false` to your `values.yaml`. Report any issues by opening a GitHub issue in the operator project.

The recovery mode also activates if you delete your cluster but keep the PVCs and then reinstall the cluster.

If every node pool uses `emptyDir` storage, the operator starts recovery in the following failure scenarios:

1. More than half the cluster manager nodes are missing or crashed, breaking the quorum.
2. All data nodes are missing or crashed, leaving no data node available.

Because `emptyDir` storage is ephemeral, data is lost and not recoverable when pods are deleted. The operator deletes and recreates the entire OpenSearch cluster in this scenario.

## Rolling upgrades

The operator supports automatic rolling version upgrades. To upgrade, change the `general.version` in your cluster `spec` and reapply it:

```yaml
spec:
  general:
    version: 3.0.0
```
{% include copy.html %}

The operator then performs a rolling upgrade, restarting nodes one by one and waiting after each node for the cluster to stabilize and reach a green status. Depending on the number of nodes and the size of the data stored, this can take some time.

Downgrades and upgrades spanning more than one major version are not supported, as they put the OpenSearch cluster in an unsupported state. If you use `emptyDir` storage for data nodes, set `general.drainDataNodes` to `true` to avoid data loss.

## Configuration changes

If you change the OpenSearch configuration on an already installed cluster, the operator detects it and performs a rolling restart of all cluster nodes to apply the new configuration. For more information about adding OpenSearch configuration, see [Configuring opensearch.yml]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-opensearch-config/#configuring-opensearchyml). The same applies to node-pool-specific configuration such as `resources`, `annotations`, or `labels`.

## Volume expansion

If your underlying storage supports online volume expansion, the operator can orchestrate that action for you.

To increase the disk volume size, set the `diskSize` of a node pool to the desired value and reapply the cluster `spec` YAML. This operation has no downtime, and the cluster remains operational.

Consider the following when increasing the disk size:

- This only works for PVC-based persistence.
- Before expanding the cluster disk, back up the volumes and data so that any failure can be recovered by restoring from the backup.
- Ensure the cluster storage class has `allowVolumeExpansion: true` before applying the new `diskSize`. For more information, see [Kubernetes storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/).
- After verifying the storage class configuration, apply the cluster YAML with the new `diskSize` value to all node pools or to a single node pool.
- Do not apply any other changes to the cluster at the same time as volume expansion.
- Ensure the size unit is consistent. For example, if the `diskSize` is `30G`, use `G` for expansion (such as `50G`). Do not switch between `G` and `Gi` during expansion.

To change the `diskSize` unit from `G` to `Gi` or vice versa, first back up the data and calculate the correct conversion so that the underlying volume size remains the same. Then reapply the cluster YAML. This ensures the `StatefulSet` is re-created with the correct value in `VolumeClaimTemplates`. This operation has no downtime.
{: .note}
