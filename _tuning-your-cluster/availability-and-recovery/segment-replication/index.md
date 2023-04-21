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
{% include copy-curl.html %}

In segment replication, the primary shard is usually generating more network traffic than the replicas because it copies segment files to the replicas. Thus, it's beneficial to distribute primary shards equally between the nodes. To ensure balanced primary shard distribution, set the dynamic `cluster.routing.allocation.balance.prefer_primary` setting to `true`. For more information, see [Cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).

Segment replication currently does not support the `wait_for` value in the `refresh` query parameter.
{: .important }

For the best performance, we recommend enabling both of the following settings:

1. [Segment replication backpressure]({{site.url}}{{site.baseurl}}tuning-your-cluster/availability-and-recovery/segment-replication/backpressure/). 
2. Balanced primary shard allocation:

```json
curl -X PUT "$host/_cluster/settings?pretty" -H 'Content-Type: application/json' -d'
  {
    "persistent": {
    "cluster.routing.allocation.balance.prefer_primary": true,
    "segrep.pressure.enabled": true
   }
  }
```
{% include copy-curl.html %}

## Comparing replication benchmarks

During initial benchmarks, segment replication users reported 40% higher throughput than when using document replication with the same cluster setup.

The following benchmarks were collected with [OpenSearch-benchmark](https://github.com/opensearch-project/opensearch-benchmark) using the [`nyc_taxi`](https://github.com/topics/nyc-taxi-dataset) dataset.  

The test run was performed on a 10-node (m5.xlarge) cluster with 10 shards and 5 replicas. Each shard was about 3.2GBs in size.

The benchmarking results are listed in the following table.

<table>
    <tr>
        <td></td>
        <td></td>
        <td><b>Document Replication</b></td>
        <td><b>Segment Replication</b></td>
        <td><b>Percent difference</b></td>
    </tr>
    <tr>
        <td><b>Test execution time (minutes)</b></td>
        <td></td>
        <td>118.00</td>
        <td>98.00</td>
        <td>27%</td>
    </tr>
    <tr>
        <td rowspan="3"><b>Index Throughput (number of requests per second)</b></td>
        <td>p0</td>
        <td>71917.20</td>
        <td>105740.70</td>
        <td>47.03%</td>
    </tr>
    <tr>
        <td>p50</td>
        <td>77392.90</td>
        <td>110988.70</td>
        <td>43.41%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>93032.90</td>
        <td>123131.50</td>
        <td>32.35%</td>
    </tr>
     <tr>
        <td rowspan="3"><b>Query Throughput (number of requests per second)</b></td>
        <td>p0</td>
        <td>1.748</td>
        <td>1.744</td>
        <td>-0.23%</td>
    </tr>
    <tr>
        <td>p50</td>
        <td>1.754</td>
        <td>1.753</td>
        <td>0%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>1.769</td>
        <td>1.768</td>
        <td>-0.06%</td>
    </tr>
    <tr>
        <td rowspan="4"><b>CPU (%)</b></td>
        <td>p50</td>
        <td>37.19</td>
        <td>25.579</td>
        <td>-31.22%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>94.00</td>
        <td>88.00</td>
        <td>-6.38%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>100</td>
        <td>100</td>
        <td>0%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>100.00</td>
        <td>100.00</td>
        <td>0%</td>
    </tr>
    <tr>
        <td rowspan="4"><b>Memory (%)</b></td>
        <td>p50</td>
        <td>30</td>
        <td>24.241</td>
        <td>-19.20%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>61.00</td>
        <td>55.00</td>
        <td>-9.84%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>72</td>
        <td>62</td>
        <td>-13.89%%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>80.00</td>
        <td>67.00</td>
        <td>-16.25%</td>
    </tr>
    <tr>
        <td rowspan="4"><b>Index Latency (ms)</b></td>
        <td>p50</td>
        <td>803</td>
        <td>647.90</td>
        <td>-19.32%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>1215.50</td>
        <td>908.60</td>
        <td>-25.25%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>9738.70</td>
        <td>1565</td>
        <td>-83.93%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>21559.60</td>
        <td>2747.70</td>
        <td>-87.26%</td>
    </tr>
    <tr>
        <td rowspan="4"><b>Query Latency (ms)</b></td>
        <td>p50</td>
        <td>36.209</td>
        <td>37.799</td>
        <td>4.39%</td>
    </tr>
    <tr>
        <td>p90</td>
        <td>42.971</td>
        <td>60.823</td>
        <td>41.54%</td>
    </tr>
    <tr>
        <td>p99</td>
        <td>50.604</td>
        <td>70.072</td>
        <td>38.47%</td>
    </tr>
    <tr>
        <td>p100</td>
        <td>52.883</td>
        <td>73.911</td>
        <td>39.76%</td>
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