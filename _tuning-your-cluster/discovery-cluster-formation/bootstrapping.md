---
layout: default
title: Cluster bootstrapping
parent: Discovery and cluster formation
nav_order: 40
---

# Cluster bootstrapping

When starting an OpenSearch cluster for the very first time, you must explicitly define the initial set of cluster-manager-eligible nodes that will participate in the first cluster manager election. This process is called _cluster bootstrapping_ and is critical for preventing split-brain scenarios during initial cluster formation.

Cluster bootstrapping is required in the following situations:

- Starting a brand-new cluster for the very first time
- No existing cluster state exists on any node
- Initial cluster manager election needs to take place

Bootstrapping is not required in the following situations:

- Nodes joining an existing cluster - they get configuration from the current cluster manager
- Cluster restarts - nodes that have previously joined a cluster store the necessary information
- Full cluster restarts - existing cluster state is preserved and used for recovery

## Configuring the bootstrap nodes

Use the `cluster.initial_cluster_manager_nodes` setting to define which nodes should participate in the initial cluster manager election. Set this configuration in `opensearch.yml` on each cluster-manager-eligible node:

```yaml
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3
```
{% include copy.html %}

Alternatively, you can specify the bootstrap configuration when starting OpenSearch:

```bash
./bin/opensearch -Ecluster.initial_cluster_manager_nodes=cluster-manager-1,cluster-manager-2,cluster-manager-3
```
{% include copy.html %}

You can identify nodes in the bootstrap configuration using any of these methods:

1. Use the value of `node.name` (recommended): 

   ```yaml
   cluster.initial_cluster_manager_nodes:
     - cluster-manager-1
     - cluster-manager-2
   ```
   {% include copy.html %}

2. Use the node's hostname if `node.name` is not explicitly set:

   ```yaml
   cluster.initial_cluster_manager_nodes:
     - server1.example.com
     - server2.example.com
   ```
   {% include copy.html %}

3. Use the node's publish IP address:

   ```yaml
   cluster.initial_cluster_manager_nodes:
     - 192.168.1.10
     - 192.168.1.11
   ```
   {% include copy.html %}

4. Use the node's IP address and port when multiple nodes share the same IP:

   ```yaml
   cluster.initial_cluster_manager_nodes:
     - 192.168.1.10:9300
     - 192.168.1.10:9301
   ```
   {% include copy.html %}

## Critical bootstrapping requirements

Proper bootstrapping ensures that all cluster-manager-eligible nodes start with a consistent and accurate configuration, preventing cluster splits and ensuring a stable initial election process.

### Identical configuration across all nodes

All cluster-manager-eligible nodes must have the same `cluster.initial_cluster_manager_nodes` setting. This ensures that only one cluster forms during bootstrapping.

**Correct configuration**:

```yaml
# Node 1
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3

# Node 2
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3

# Node 3
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2
  - cluster-manager-3
```
{% include copy.html %}

**Incorrect configuration**:

```yaml
# Node 1 – different list
cluster.initial_cluster_manager_nodes:
  - cluster-manager-1
  - cluster-manager-2

# Node 2 – different list
cluster.initial_cluster_manager_nodes:
  - cluster-manager-2
  - cluster-manager-3
```

When nodes have inconsistent bootstrap lists, multiple independent clusters may form.

### Exact name matching

Node names in the bootstrap configuration must exactly match each node's `node.name` value.

**Common naming issues**:

* If a node's name is `server1.example.com`, the bootstrap list must also use `server1.example.com`, not `server1`.
* Node names are case-sensitive.
* The names must match exactly, with no added characters or whitespace.

If a node's name does not exactly match an entry in the bootstrap configuration, the log will contain an error message. In this example, the node name `cluster-manager-1.example.com` does not match the bootstrap entry `cluster-manager-1`:

```
[cluster-manager-1.example.com] cluster manager not discovered yet, this node has
not previously joined a bootstrapped cluster, and this node must discover
cluster-manager-eligible nodes [cluster-manager-1, cluster-manager-2] to
bootstrap a cluster: have discovered [{cluster-manager-2.example.com}...]
```

## Naming your cluster

Choose a descriptive cluster name to distinguish your cluster from others:

```yaml
cluster.name: production-search-cluster
```
{% include copy.html %}

When naming your cluster, follow these guidelines:

- Each cluster must have a unique name to avoid conflicts.

- Ensure that all nodes verify that the cluster name matches before joining.

- Avoid the default `opensearch` name in production environments.

- Choose descriptive names that reflect the cluster's purpose.

## Development mode auto-bootstrapping

OpenSearch can automatically bootstrap clusters in development environments under the following conditions:

- No discovery settings are explicitly configured.
- Multiple nodes are running on the same machine.
- OpenSearch detects that it is running in a development environment.

### Settings that disable auto-bootstrapping

If any of these settings are configured, you must explicitly configure `cluster.initial_cluster_manager_nodes`:

- `discovery.seed_providers`
- `discovery.seed_hosts`
- `cluster.initial_cluster_manager_nodes`

### Auto-bootstrapping limitations

Auto-bootstrapping is intended only for development. Do not use it in production because:

- Nodes may not discover each other quickly enough, leading to delays.

- Network conditions can cause discovery to fail.

- Behavior can be unpredictable and is not guaranteed.

- There is a risk of forming multiple clusters, resulting in split-brain scenarios.

## Troubleshooting bootstrap issues

If you accidentally start nodes on different hosts without proper configuration, they may form separate clusters. You can detect this by checking cluster UUIDs:

```bash
curl -X GET "localhost:9200/"
```
{% include copy.html %}

If each node reports a different `cluster_uuid`, they belong to separate clusters. To correct this and form a single cluster, use the following steps:

1. Stop all nodes.
2. Delete all data from each node's data directory.
3. Configure proper bootstrap settings.
4. Restart all nodes and verify single cluster formation.

## Bootstrap verification

After starting your cluster, verify successful bootstrap using the [monitoring commands]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/#monitoring-discovery-and-cluster-formation) for checking cluster health and formation:

- Verify cluster health status and node count.
- Confirm that one node is elected as cluster manager.
- Ensure that all nodes report the same cluster UUID.

## Related documentation

- [Voting configuration management]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/voting-configuration/): How OpenSearch manages voting after bootstrap
- [Discovery and cluster formation settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/discovery-cluster-formation/settings/): Complete settings reference
- [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/): Step-by-step cluster setup guide