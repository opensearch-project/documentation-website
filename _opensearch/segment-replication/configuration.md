---
layout: default
title: Segment Replication Configuration
nav_order: 12
parent: Segment Replication Feature
grand_parent: Opensearch
---

## Segment Replication Configuration

To enable the segment replication type, reference the steps below.

### Enabling the feature flag

There are several methods to enable segment replication depending on install type. You will also need to set replication strategy to `SEGMENT` when creating the index.

#### Enable on a node using a tarball install

The flag is toggled using a new jvm parameter that is set in either `OPENSEARCH_JAVA_OPTS` or in config/jvm.options.

1. Option 1. Update config/jvm.options with:

    ````json
    -Dopensearch.experimental.feature.replication_type.enabled=true
    ````

1. Option 2: Use the `OPENSEARCH_JAVA_OPTS` environment variable:

    ````json
    export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true"
    ````
1. Option 3: For developers using Gradle, update run.gradle with:

    ````json
    testClusters {
      runTask {
        testDistribution = 'archive'
        if (numZones > 1) numberOfZones = numZones
        if (numNodes > 1) numberOfNodes = numNodes
        systemProperty 'opensearch.experimental.feature.replication_type.enabled', 'true'
      }
    }
    ````

#### Enable with Docker containers

If you're running Docker, add the following line to docker-compose.yml underneath the `opensearch-node` and `environment` section:

````json
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true" # Enables segment replication
````

#### Setting replication strategy on the index

To set the replication strategy to segment replication, create an index with replication.type set to `SEGMENT`:

````json
PUT /my-index1
{
  "settings": {
    "index": {
      "replication.type": "SEGMENT" 
    }
  }
}
````

### Known Limitations

Segment replication is an experimental feature. Therefore, we do not recommend the use of segment replication in a production environment. For updates on the progress of segment replication or if you want leave feedback that could help improve the feature, see the [Segment Replication Git Issue](https://github.com/opensearch-project/OpenSearch/issues/2229).
{: .note }

1. Enabling segment replication for an existing index requires [reindexing](https://github.com/opensearch-project/OpenSearch/issues/3685).
1. Rolling upgrades are currently not supported. Full cluster restarts are required to upgrade indexes using segment replication. [Issue 3881](https://github.com/opensearch-project/OpenSearch/issues/3881).
1. [Cross-cluster replication](https://github.com/opensearch-project/OpenSearch/issues/4090) does not currently use segment replication to copy between clusters.
1. Network congestion on primary shards. [Issue - Optimize network bandwidth on primary shards](https://github.com/opensearch-project/OpenSearch/issues/4245).
1. Shard allocation algorithms have not been updated to evenly spread primary shards across nodes.
1. Integration with a remote backed storage as the source of replication is [currently unsupported](https://github.com/opensearch-project/OpenSearch/issues/4448).

### Further resources regarding segment replication:

1. [Known issues](https://github.com/opensearch-project/OpenSearch/issues/2194).
1. Steps for testing. (link coming soon).
1. Segment replication blog post. (link coming soon).