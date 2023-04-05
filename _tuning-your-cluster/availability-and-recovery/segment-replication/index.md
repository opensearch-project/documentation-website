---
layout: default
title: Segment replication 
nav_order: 70
has_children: true
parent: Availability and Recovery
redirect_from:
  - /opensearch/segment-replication/
  - /opensearch/segment-replication/index/
---

# Segment replication

With segment replication, segment files are copied across shards instead of documents being indexed on each shard copy. This improves indexing throughput and lowers resource utilization at the expense of increased network utilization.

## Use cases

- Users who have high write loads but do not have high search requirements and are comfortable with longer refresh times.
- Users with very high loads who want to add new nodes, as you do not need to index all nodes when adding a new node to the cluster.

This is the first step in a series of features designed to decouple reads and writes in order to lower compute costs.

## Segment replication configuration

To enable the segment replication type, reference the steps below.

### Enabling the feature flag

There are several methods for enabling segment replication, depending on the install type. You will also need to set the replication strategy to `SEGMENT` when creating the index.

### Enable on a node using a tarball install

The flag is toggled using a new jvm parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in config/jvm.options.

1. Option 1: Update config/jvm.options by adding the following line:

    ````json
    -Dopensearch.experimental.feature.replication_type.enabled=true
    ````

1. Option 2: Use the `OPENSEARCH_JAVA_OPTS` environment variable:

    ````json
    export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true"
    ````
1. Option 3: Add the request body parameter when creating an index.

### Enable with Docker containers

If you're running Docker, add the following line to docker-compose.yml underneath the `opensearch-node` and `environment` section:

````json
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true" # Enables segment replication
````

### Setting the replication strategy on the index

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

## Further resources regarding segment replication

1. [Known issues](https://github.com/opensearch-project/OpenSearch/issues/2194).
1. [Segment replication blog post](https://github.com/opensearch-project/project-website/pull/1504/files).

## Benchmarking

During experimental testing, our experimental release users have reported up to 40% higher throughput with segment replication than with document replication for the same cluster setup.

Additionally, the following benchmarks were collected with [OpenSearch-benchmark](https://github.com/opensearch-project/opensearch-benchmark) using the [`stackoverflow`](https://www.kaggle.com/datasets/stackoverflow/stackoverflow) and [`nyc_taxi`](https://github.com/topics/nyc-taxi-dataset) datasets.  

Your results may vary based on cluster topology, hardware used, shard count, and merge settings. 
{: .note }

## Known limitations

1. Enabling segment replication for an existing index requires [reindexing](https://github.com/opensearch-project/OpenSearch/issues/3685).
1. Rolling upgrades are currently not supported. Full cluster restarts are required when upgrading indexes using segment replication. [Issue 3881](https://github.com/opensearch-project/OpenSearch/issues/3881).
1. [Cross-cluster replication](https://github.com/opensearch-project/OpenSearch/issues/4090) does not currently use segment replication to copy between clusters.
1. Increased network congestion on primary shards. [Issue - Optimize network bandwidth on primary shards](https://github.com/opensearch-project/OpenSearch/issues/4245).
1. Shard allocation algorithms have not been updated to evenly spread primary shards across nodes.
1. Integration with remote-backed storage as the source of replication is [currently unsupported](https://github.com/opensearch-project/OpenSearch/issues/4448).