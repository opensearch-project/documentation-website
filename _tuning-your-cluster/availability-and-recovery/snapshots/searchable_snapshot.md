---
layout: default
title: Searchable snapshots
parent: Snapshots
nav_order: 40
grand_parent: Availability and Recovery
redirect_from: 
  - /opensearch/snapshots/searchable_snapshot/
---

# Searchable snapshots

Searchable snapshots is an experimental feature released in OpenSearch 2.4. Therefore, we do not recommend the use of this feature in a production environment. For updates on progress, follow us on [GitHub](https://github.com/opensearch-project/OpenSearch/issues/3739). If you have any feedback please [submit a new issue](https://github.com/opensearch-project/OpenSearch/issues/new/choose).
{: .warning }

A searchable snapshot is an index where data is read from a [snapshot repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#register-repository) on demand at search time rather than all index data being downloaded to cluster storage at restore time. Because the index data remains in the snapshot format in the repository, searchable snapshot indexes are inherently read-only. Any attempt to write to a searchable snapshot index will result in an error.

To enable the searchable snapshots feature, reference the following steps.

## Enabling the feature flag

There are several methods for enabling searchable snapshots, depending on the installation type.

### Enable on a node using a tarball installation

The flag is toggled using a new jvm parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in config/jvm.options:

- Option 1: Update config/jvm.options by adding the following line:

    ```json
    -Dopensearch.experimental.feature.searchable_snapshot.enabled=true
    ```

- Option 2: Use the `OPENSEARCH_JAVA_OPTS` environment variable:

    ```json
    export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.searchable_snapshot.enabled=true"
    ```
- Option 3: For developers using Gradle, update run.gradle by adding the following lines:

    ```json
    testClusters {
      runTask {
        testDistribution = 'archive'
        if (numZones > 1) numberOfZones = numZones
        if (numNodes > 1) numberOfNodes = numNodes
        systemProperty 'opensearch.experimental.feature.searchable_snapshot.enabled', 'true'
      }
    }
    ```

- Finally, create a node in your opensearch.yml file and define the node role as `search`:

    ```bash
    node.name: snapshots-node
    node.roles: [ search ]
    ```

### Enable with Docker containers

If you're running Docker, add the following line to docker-compose.yml underneath the `opensearch-node` and `environment` sections:

```json
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.searchable_snapshot.enabled=true" # Enables searchable snapshot
```

To create a node with the `search` node role, add the line `- node.roles: [ search ]` to your docker-compose.yml file:

```bash
version: '3'
services:
  opensearch-node1:
    image: opensearchproject/opensearch:2.4.0
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node1
      - node.roles: [ search ]
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
- Data is discarded immediately after being read. Subsequent searches for the same data will have to be downloaded again. This will be addressed in the future by implementing a disk-based cache for storing frequently accessed data.
- Many remote object stores charge on a per-request basis for retrieval, so users should closely monitor any costs incurred.
- Searching remote data can impact the performance of other queries running on the same node. We recommend that users provision dedicated nodes with the `search` role for performance-critical applications.