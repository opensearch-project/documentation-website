---
layout: default
title: Segregating Indexing and Search Workloads
nav_order: 42
has_children: false
---

# Segregating Indexing and Search Workloads

In a Remote Store enabled cluster with a Segment Replication enabled index, indexing and search workloads can be segregated across different hardware by utilizing the specialized `search` node role and provisioning corresponding search replicas in the index.

We introduce refined terminology to distinguish between two types of replicas:

- **Write-Replica**: Acts as a redundant copy of the primary shard. In the event of a primary shard failure (e.g., due to node drop or hardware issues), a write-replica is eligible to be promoted as the new primary, ensuring high availability for write operations.
- **Search-Replica**: Dedicated exclusively to serving search queries. Search replicas cannot be promoted as primaries.

## Benefits of segregating Workloads

1. Parallel and Isolated Processing: Indexing and search workloads can be processed in parallel and isolated from each other, improving overall system throughput and ensuring predictable performance for each workload.
2. Independent Scalability: Indexing and search can be scaled independently by adding more data nodes (for write-replicas) or search nodes (for search-replicas), without affecting each other’s throughput.
3. Failure Resilience: Failures in indexing or search do not affect the other, improving overall system availability.
4. Cost Efficiency and Performance: Use specialized hardware — e.g., compute-optimized instances for indexing and memory-optimized for search — to reduce costs and enhance performance.
5. Tuning Flexibility: Performance settings like buffers and caches can be optimized separately for indexing and search workloads.

## Configuring Search Nodes

To configure a node for search-only workloads, update `opensearch.yml`:

```yaml
node.name: searcher-node1
node.roles: [ search ]
```

## Enabling Remote Store

To enable a remote store (e.g., Amazon S3), set the repository configuration in `opensearch.yml`:

```yaml
node.attr.remote_store.segment.repository: "my-repository"
node.attr.remote_store.translog.repository: "my-repository"
node.attr.remote_store.state.repository: "my-repository"
node.attr.remote_store.repository.my-repository.type: s3
node.attr.remote_store.repository.my-repository.settings.bucket: <Bucket Name 1>
node.attr.remote_store.repository.my-repository.settings.base_path: <Bucket Base Path 1>
node.attr.remote_store.repository.my-repository.settings.region: <Region>
```

For more details, please check [remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).

## Adding Search Replicas to an Index

By default, indexes created in a remote-store-enabled cluster use segment replication (i.e., replication type as SEGMENT). For more details, please check [segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/index/)

Search replicas can be added for an index using index settings `number_of_search_replicas`(default is 0) in the following ways.  

- Option 1: Create an Index with Search Replicas:

The following request creates the index `my-index` with 1 primary, 1 replica and 2 search replicas.

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

- Option 2: Update the search replica count for an existing index

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

- Option 3: Restoring index from a snapshot with search replicas

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

## Enforcing cluster-level search request routing

When search replicas are enabled, all search traffic is routed to them by default. 
To enforce or relax this routing behavior, use the following setting:

```json
PUT /_cluster/settings
{ 
    "persistent": {
        "cluster.routing.search_replica.strict": "true"
    }
}
```
{% include copy-curl.html %}

- `true` (default): Route only to search replicas.
- `false`: Allow fallback to primary/write-replicas if needed.

## Auto-Scaling Search Replicas

Use `auto_expand_search_replicas` index setting to automatically scale search replicas based on the number of available search nodes in the cluster.
For more details, please check [index-settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings)


## Turn off Write Workloads

By using `_scale` API user can choose to turn off primary shards and write-replicas in case they don’t expect any writing to that index.
In write-once, read-many scenarios (like log analytics), you can scale down primary and write replicas, leaving only search replicas active. This will free up the resources.

Turn Off Writers:

```json
POST my_index/_scale 
{
   "search_only": true
}
```
{% include copy-curl.html %}

Turn On Writers:

```json
POST my_index/_scale 
{
   "search_only":false
}
```
{% include copy-curl.html %}
