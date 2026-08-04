---
layout: default
title: Separate index and search workloads
nav_order: 42
has_children: false
redirect_from: 
   - /tuning-your-cluster/seperate-index-and-search-workloads/
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/separate-index-and-search-workloads/
---

# Separate index and search workloads

In a remote-store-enabled cluster with a segment-replication-enabled index, you can segregate indexing and search workloads across different hardware by using the specialized `search` node role and provisioning corresponding search replicas in the index.

OpenSearch uses two types of replicas:

- **Write replicas**: Act as redundant copies of the primary shard. If a primary shard fails (for example, due to node drop or hardware issues), a write replica can be promoted as the new primary to ensure high availability for write operations.
- **Search replicas**: Work for search queries exclusively. Search replicas cannot be promoted as primaries.

## Benefits of separating workloads

Separating index and search workloads provides the following benefits:

1. **Parallel and isolated processing**: Process indexing and search workloads in parallel and isolate them from each other to improve overall system throughput and ensure predictable performance.
2. **Independent scalability**: Scale indexing and search independently by adding more data nodes (for write replicas) or search nodes (for search replicas).
3. **Failure resilience**: Prevent failures in indexing or search from affecting each other to improve overall system availability.
4. **Cost efficiency and performance**: Use specialized hardware (for example, compute-optimized instances for indexing and memory-optimized instances for search) to reduce costs and enhance performance.
5. **Tuning flexibility**: Separately optimize performance settings, like buffers and caches, for indexing and search workloads.

## Setting up workload separation

To separate indexing and search workloads, you need to configure search nodes, enable the remote store, and add search replicas to your index. Follow these steps to set up workload separation in your cluster.

### Step 1: Configure search nodes

Before you can separate your workloads, you need to designate specific nodes for search operations. Search nodes are dedicated to serving search requests and can help optimize your cluster's search performance.

The following request configures a node for search-only workloads in `opensearch.yml`:

```yaml
node.name: searcher-node1
node.roles: [ search ]
```

### Step 2: Enable the remote store

The remote store provides a centralized storage location for your index data. This configuration is essential for segment replication and ensures that all nodes can access the same data, regardless of their role. Remote storage is particularly useful in cloud environments where you want to separate storage from compute resources.

The following request sets the repository configuration for a remote store (for example, Amazon Simple Storage Service [Amazon S3]) in `opensearch.yml`:

```yaml
node.attr.remote_store.segment.repository: "my-repository"
node.attr.remote_store.translog.repository: "my-repository"
node.attr.remote_store.state.repository: "my-repository"
node.attr.remote_store.repository.my-repository.type: s3
node.attr.remote_store.repository.my-repository.settings.bucket: <Bucket Name 1>
node.attr.remote_store.repository.my-repository.settings.base_path: <Bucket Base Path 1>
node.attr.remote_store.repository.my-repository.settings.region: <Region>
```

For more information, see [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).

When separating index and search workloads, set `cluster.remote_store.state.enabled` to `true` during initial setup. This setting ensures that OpenSearch stores index metadata in the remote store, enabling seamless recovery of search replicas in [search-only mode](#turn-off-write-workloads-with-search-only-mode). For more information, see [Search replica recovery scenarios](#search-replica-recovery-scenarios).
{: .note}


### Step 3: Add search replicas to an index

After configuring your nodes and the remote store, you need to set up search replicas for your indexes. Search replicas are copies of your index that are dedicated to handling search requests, allowing you to scale your search capacity independently of your indexing capacity.

By default, indexes created in a remote-store-enabled cluster use segment replication. For more information, see [Segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/index/).

You can add search replicas for an index using the `number_of_search_replicas` setting (default is 0) in one the following ways.

#### Option 1: Create an index with search replicas

Use this option when you're creating a new index and want to configure search replicas at the beginning of the process. This approach is ideal for planning your workload separation strategy before indexing data.

The following request creates an index with one primary, one replica, and two search replicas:

```json
PUT /my-index
{
    "settings": {
        "index": {
            "number_of_shards": 1,
            "number_of_replicas": 1,
            "number_of_search_replicas": 2,
        }
  }
}
```
{% include copy-curl.html %}

#### Option 2: Update the search replica count for an existing index

Use this option when you have an existing index and want to add or modify search replicas. This is useful when you need to adjust your search capacity based on changing workload demands.

The following request updates the search replica count:

```json
PUT /my-index/_settings
{
  "settings": {
    "index": {
      "number_of_search_replicas": 1
    }
  }
}
```
{% include copy-curl.html %}

#### Option 3: Restore an index from a snapshot with search replicas

Use this option when you're restoring an index from a snapshot and want to configure search replicas during the restore process. This is particularly useful for disaster recovery scenarios or when migrating indexes between clusters.

The following request restores an index from a snapshot with search replicas:

```json
POST /_snapshot/my-repository/my-snapshot/_restore
{ 
    "indices": "my-index", 
    "index_settings": { 
        "index.number_of_search_replicas": 2,
        "index.replication.type": "SEGMENT"
     } 
}'
```
{% include copy-curl.html %}

## Additional configuration

After setting up basic workload separation, you can fine-tune your configuration to optimize performance and resource utilization. The following settings allow you to control search routing, automatically scale replicas, and manage write workloads based on your specific needs.

### Enforce cluster-level search request routing

When search replicas are enabled, all search traffic is routed to them by default. The following request enforces or relaxes this routing behavior:

```json
PUT /_cluster/settings
{ 
    "persistent": {
        "cluster.routing.search_replica.strict": "true"
    }
}
```
{% include copy-curl.html %}

The `cluster.routing.search_replica.strict` setting supports the following options:

- `true` (default): Route only to search replicas.
- `false`: Allow fallback to primary/write replicas if needed.

### Automatically scale search replicas

Use the `auto_expand_search_replicas` index setting to automatically scale search replicas based on the number of available search nodes in the cluster. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings).

### Turn off write workloads with search-only mode

You can use the `_scale` API to turn off primary shards and write replicas for an index when you don't need to write to it. This approach works well for write-once, read-many scenarios like log analytics, where you can reduce resource usage by keeping only search replicas active.

The following request turns on search-only mode by deactivating write replicas:

```json
POST my_index/_scale 
{
   "search_only": true
}
```
{% include copy-curl.html %}

The following request turns off search-only mode by activating write replicas:

```json
POST my_index/_scale 
{
   "search_only": false
}
```
{% include copy-curl.html %}

#### Search replica recovery scenarios

OpenSearch handles recovery of search replicas in search-only mode differently depending on the configuration.

##### Scenario 1: Persistent data directory with remote store state disabled

When you use a persistent data directory and set `cluster.remote_store.state.enabled` to `false`, search replicas recover automatically after node restarts.

##### Scenario 2: Remote store state enabled without a persistent data directory

When `cluster.remote_store.state.enabled` is set to `true` and there is no persistent data directory, OpenSearch recovers search replicas without requiring primaries or write replicas. Because remote store state is enabled, OpenSearch retains the index metadata after a restart. The allocation logic skips the active primary check for search replicas, allowing them to be allocated so that search queries remain functional.

##### Scenario 3: Remote store state enabled with a persistent data directory

This configuration provides seamless recovery. In search-only mode, with both a persistent data directory and `cluster.remote_store.state.enabled` set to `true`, OpenSearch starts only search replicas—excluding primaries and write replicas—ensuring the index can be queried after restart.

##### Scenario 4: No persistent data directory and remote store state disabled

When both the persistent data directory is missing and `cluster.remote_store.state.enabled` is set to `false`, all local state is lost on restart. OpenSearch has no metadata reference, so the index becomes unrecoverable.

