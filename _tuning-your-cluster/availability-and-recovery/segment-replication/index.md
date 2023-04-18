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

When the primary shard sends a checkpoint to replica shards on a refresh, a new segment replication event is triggered on replica shards. This happens:

- When a new replica shard is added to a cluster.
- When there are segment file changes on a primary shard refresh.
- During peer recovery, such as replica shard recovery and shard relocation (explicit allocation using the `move` allocation command or automatic shard rebalancing).

Segment replication is the first feature in a series of features designed to decouple reads and writes in order to lower compute costs.

## Use cases

- Users who have high write loads but do not have high search requirements and are comfortable with longer refresh times.
- Users with very high loads who want to add new nodes, as you do not need to index all nodes when adding a new node to the cluster.
- OpenSearch cluster deployments with low replica counts, such as those used for log analytics.

## Segment replication configuration

To set segment replication as the replication strategy, create an index with replication.type set to `SEGMENT`:

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

In segment replication, the primary shard is usually generating more network traffic than the replicas because it copies segment files to the replicas. Thus, it's beneficial to distribute primary shards equally between the nodes. To ensure balanced primary shard distribution, set the dynamic `cluster.routing.allocation.balance.prefer_primary` setting to `true`. For more information, see [Cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).

## Comparing replication benchmarks

During initial benchmarks, segment replication users reported 40% higher throughput than when using document replication with the same cluster setup.

The following benchmarks were collected with [OpenSearch-benchmark](https://github.com/opensearch-project/opensearch-benchmark) using the [`stackoverflow`](https://www.kaggle.com/datasets/stackoverflow/stackoverflow) and [`nyc_taxi`](https://github.com/topics/nyc-taxi-dataset) datasets.  

Both test runs were performed on a 10-node (m5.xlarge) cluster with 10 shards and 5 replicas. Each shard was about 3.2GBs in size. The tests were run with the following settings:

- `indices.recovery.max_bytes_per_sec`: 10gb
- `indices.recovery.max_concurrent_file_chunks`: 5

The benchmarking results are listed in the following table.

<table>
    <tr>
        <td></td>
        <td></td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
    </tr>
    <tr>
        <td>Test execution time (minutes)</td>
        <td></td>
        <td>40.00</td>
        <td>22.00</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="3">Throughput (number of requests per second)</td>
        <td>p0</td>
        <td>17553.90</td>
        <td>28584.30</td>
        <td>63%</td>
    </tr>
    <tr>
        <td>p50</td>
        <td>20647.20</td>
        <td>32790.20</td>
        <td>59%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>23209.00</td>
        <td>34286.00</td>
        <td>48%</td>
    </tr>
    <tr>
        <td rowspan="4">CPU (%)</td>
        <td>p50</td>
        <td>65.00</td>
        <td>30.00</td>
        <td>-54%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>79.00</td>
        <td>35.00</td>
        <td>-56%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>98.00</td>
        <td>45.08</td>
        <td>-54%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>98.00</td>
        <td>59.00</td>
        <td>-40%</td>
    </tr>
    <tr>
        <td rowspan="4">Memory (%)</td>
        <td>p50</td>
        <td>48.20</td>
        <td>39.00</td>
        <td>-19%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>62.00</td>
        <td>61.00</td>
        <td>-2%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>66.21</td>
        <td>68.00</td>
        <td>3%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>71.00</td>
        <td>69.00</td>
        <td>-3%</td>
    </tr>
    <tr>
        <td rowspan="4">IOPS</td>
        <td>p50</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p90</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p99</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p100</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="4">Latency</td>
        <td>p50</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p90</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p99</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>p100</td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

Your results may vary based on the cluster topology, hardware used, shard count, and merge settings. 
{: .note }

## Other considerations

When using segment replication, consider the following:

1. Enabling segment replication for an existing index requires [reindexing](https://github.com/opensearch-project/OpenSearch/issues/3685).
1. Rolling upgrades are not currently supported. Full cluster restarts are required when upgrading indexes using segment replication. See [Issue 3881](https://github.com/opensearch-project/OpenSearch/issues/3881).
1. [Cross-cluster replication](https://github.com/opensearch-project/OpenSearch/issues/4090) does not currently use segment replication to copy between clusters.
1. Increased network congestion on primary shards. See [Issue - Optimize network bandwidth on primary shards](https://github.com/opensearch-project/OpenSearch/issues/4245).
1. Integration with remote-backed storage as the source of replication is [currently unsupported](https://github.com/opensearch-project/OpenSearch/issues/4448). 
1. Read-after-write guarantees: The `wait_until` refresh policy is not compatible with segment replication. If you use the `wait_until` refresh policy while ingesting documents, you'll get a response only after the primary node has refreshed and made those documents searchable. Replica shards will respond only after having written to their local translog. We are exploring other mechanisms for providing read-after-write guarantees. For more information, see the corresponding [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6046).  
1. System indexes will continue to use document replication internally until read-after-write guarantees are available. In this case, document replication does not hinder the overall performance because there are few system indexes.

## Next steps

1. Track [future enhancements to segment replication](https://github.com/orgs/opensearch-project/projects/99).
1. Read [this blog post about segment replication](https://opensearch.org/blog).