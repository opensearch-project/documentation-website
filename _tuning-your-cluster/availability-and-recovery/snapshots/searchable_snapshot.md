---
layout: default
title: Searchable snapshots
parent: Snapshots
nav_order: 40
grand_parent: Availability and recovery
redirect_from: 
  - /opensearch/snapshots/searchable_snapshot/
---

# Searchable snapshots

A searchable snapshot index reads data from a [snapshot repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#register-repository) on demand in real time (at search time) rather than downloading all index data to cluster storage at restore time. Because the index data remains in the snapshot format in the repository, searchable snapshot indexes are inherently read-only. Any attempt to write to a searchable snapshot index results in an error.

The searchable snapshot feature incorporates techniques like caching frequently used data segments in cluster nodes and removing the least used data segment from the cluster nodes to make space for frequently used data segments. The data segments downloaded from snapshots on block storage reside alongside the general indexes of the cluster nodes. As such, the computing capacity of cluster nodes is shared between indexing, local search, and data segments on a snapshot residing on lower-cost object storage like Amazon Simple Storage Service (Amazon S3). While cluster node resources are utilized much more efficiently, the high number of tasks results in slower and longer snapshot searches. The local storage of the node is also used for caching the snapshot data.

## Configuring a node to use searchable snapshots

To configure the searchable snapshots feature, create a node in your opensearch.yml file and define the node role as `search`:

```yaml
node.name: snapshots-node
node.roles: [ search ]
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
```

## Create a searchable snapshot index

A searchable snapshot index is created by specifying the `remote_snapshot` storage type using the [restore snapshots API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#restore-snapshots).

Request Field | Description
:--- | :---
`storage_type` | `local` indicates that all snapshot metadata and index data will be downloaded to local storage. <br /><br > `remote_snapshot` indicates that snapshot metadata will be downloaded to the cluster, but the remote repository will remain the authoritative store of the index data. Data will be downloaded and cached as necessary to service queries. At least one node in the cluster must be configured with the `search` node role in order to restore a snapshot using the `remote_snapshot` type. <br /><br > Defaults to `local`.

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
