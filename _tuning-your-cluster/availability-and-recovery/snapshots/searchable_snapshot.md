---
layout: default
title: Searchable snapshots
parent: Snapshots
nav_order: 40
grand_parent: Availability and recovery
redirect_from: 
  - /opensearch/snapshots/searchable_snapshot/
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/snapshots/searchable_snapshot/
---

# Searchable snapshots

A searchable snapshot index reads data from a [snapshot repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#register-repository) on demand in real time (at search time) rather than downloading all index data to cluster storage at restore time. Because the index data remains in the snapshot format in the repository, searchable snapshot indexes are inherently read-only. Any attempt to write to a searchable snapshot index results in an error.

The searchable snapshot feature incorporates techniques like caching frequently used data segments in cluster nodes and removing the least used data segment from the cluster nodes to make space for frequently used data segments. The data segments downloaded from snapshots on block storage reside alongside the general indexes of the cluster nodes. As such, the computing capacity of cluster nodes is shared between indexing, local search, and data segments on a snapshot residing on lower-cost object storage like Amazon Simple Storage Service (Amazon S3). While cluster node resources are utilized much more efficiently, the high number of tasks results in slower and longer snapshot searches. The local storage of the node is also used for caching the snapshot data.

## Configuring a node to use searchable snapshots

To configure the searchable snapshots feature, create a node in your `opensearch.yml file` and define the node role as `search`. Optionally, you can also configure the `cache.size` property for the node.

A `search` node reserves storage for the cache to perform searchable snapshot queries. In the case of a dedicated search node where the node exclusively has the `search` role, this value defaults to a fixed percentage (80%) of available storage. In other cases, the value needs to be configured by the user using the `node.search.cache.size` setting.

Parameter | Type | Description
:--- | :--- | :---
`node.search.cache.size` | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/)..


```yaml
node.name: snapshots-node
node.roles: [ search ]
node.search.cache.size: 50gb
```

If you're running Docker, you can create a node with the `search` node role by adding the line `- node.roles=search` to your `docker-compose.yml` file:

```yaml
version: '3'
services:
  opensearch-node1:
    image: opensearchproject/opensearch:2.7.0
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node1
      - node.roles=search
      - node.search.cache.size=50gb
```



## Create a searchable snapshot index

A searchable snapshot index is created by specifying the `remote_snapshot` storage type using the [restore snapshots API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#restore-snapshots).

Request Field | Description
:--- | :---
`storage_type` | `local` indicates that all snapshot metadata and index data will be downloaded to local storage. <br /><br > `remote_snapshot` indicates that snapshot metadata will be downloaded to the cluster, but the remote repository will remain the authoritative store of the index data. Data will be downloaded and cached as necessary to service queries. At least one node in the cluster must be configured with the `search` node role in order to restore a snapshot using the `remote_snapshot` type. <br /><br > Defaults to `local`.

#### Example request

The following request restores the index `my-index` from the snapshot `my-snapshot` as a searchable snapshot:

````json
POST /_snapshot/my-repository/my-snapshot/_restore
{
  "storage_type": "remote_snapshot",
  "indices": "my-index"
}
````

Similar to all snapshot restore requests, you can include or exclude certain indexes or specify additional snapshot settings. For more information, see the [restore snapshots API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#restore-snapshots).


## Listing indexes

To determine whether an index is a searchable snapshot index, look for a store type with the value of `remote_snapshot`:

```
GET /my-index/_settings?pretty
```

```json
{
  "my-index": {
    "settings": {
      "index": {
        "store": {
          "type": "remote_snapshot"
        }
      }
    }
  }
}
```

## Potential use cases

The following are potential use cases for the searchable snapshots feature:

- The ability to offload indexes from cluster-based storage but retain the ability to search them.
- The ability to have a large number of searchable indexes in lower-cost media.

## Known limitations

The following are known limitations of the searchable snapshots feature:

- Accessing data from a remote repository is slower than local disk reads, so higher latencies on search queries are expected.
- Many remote object stores charge on a per-request basis for retrieval, so users should closely monitor any costs incurred.
- Searching remote data can impact the performance of other queries running on the same node. We recommend that users provision dedicated nodes with the `search` role for performance-critical applications.
- For better search performance, consider [force merging]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/) indexes into a smaller number of segments before taking a snapshot. For the best performance, at the cost of using compute resources prior to snapshotting, force merge your index into one segment.
- We recommend configuring a maximum ratio of remote data to local disk cache size using the `cluster.filecache.remote_data_ratio` setting. A ratio of 5 is a good starting point for most workloads to ensure good query performance. If the ratio is too large, then there may not be sufficient disk space to handle the search workload. For more details on the maximum ratio of remote data, see issue [#11676](https://github.com/opensearch-project/OpenSearch/issues/11676).
- k-NN native-engine-based indexes using `faiss` and `nmslib` engines are incompatible with searchable snapshots.
