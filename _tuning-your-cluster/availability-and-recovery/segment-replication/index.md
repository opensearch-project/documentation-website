---
layout: default
title: Segment replication 
nav_order: 70
has_children: true
parent: Availability and recovery
datatable: true
redirect_from:
  - /opensearch/segment-replication/
  - /opensearch/segment-replication/index/
---

# Segment replication

Segment replication involves copying segment files across shards instead of indexing documents on each shard copy. This approach enhances indexing throughput and reduces resource utilization but increases network utilization. Segment replication is the first feature in a series of features designed to decouple reads and writes in order to lower compute costs.

When the primary shard sends a checkpoint to replica shards on a refresh, a new segment replication event is triggered on replica shards. This happens:

- When a new replica shard is added to a cluster.
- When there are segment file changes on a primary shard refresh.
- During peer recovery, such as replica shard recovery and shard relocation (explicit allocation using the `move` allocation command or automatic shard rebalancing).

## Use cases

Segment replication can be applied in a variety of scenarios, including:

- High write loads without high search requirements and with longer refresh times.
- When experiencing very high loads, you want to add new nodes but don't want to index all data immediately.
- OpenSearch cluster deployments with low replica counts, such as those used for log analytics.

## Remote-backed storage

As of OpenSearch 2.10, you can use two methods for segment replication:

- **Remote-backed storage**, a persistent storage solution: The primary shard sends segment files to the remote-backed storage, and the replica shards source the copy from the same store. For more information about using remote-backed storage, see [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).
- Node-to-node communication: The primary shard sends segment files directly to the replica shards using node-to-node communication.

## Segment replication configuration

Setting the default replication type for a cluster affects all newly created indexes. You can, however, specify a different replication type when creating an index. Index-level settings override cluster-level settings.

### Creating an index with segment replication

To use segment replication as the replication strategy for an index, create the index with the `replication.type` parameter set to `SEGMENT` as follows:

```json
PUT /my-index1
{
  "settings": {
    "index": {
      "replication.type": "SEGMENT" 
    }
  }
}
```
{% include copy-curl.html %}

If you're using remote-backed storage, add the `remote_store` property to the index request body. 

When using node-to-node replication, the primary shard consumes more network bandwidth because it pushes segment files to all the replica shards. Thus, it's beneficial to distribute primary shards equally between the nodes. To ensure balanced primary shard distribution, set the dynamic `cluster.routing.allocation.balance.prefer_primary` setting to `true`. For more information, see [Cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).

For the best performance, it is recommended that you enable the following settings:

1. [Segment replication backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/backpressure/) 
2. Balanced primary shard allocation, using the following command:

```json
PUT /_cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.balance.prefer_primary": true,
    "segrep.pressure.enabled": true
  }
}
```
{% include copy-curl.html %}

### Setting the replication type for a cluster

You can set the default replication type for newly created cluster indexes in the `opensearch.yml` file as follows:

```yaml
cluster.indices.replication.strategy: 'SEGMENT'
```
{% include copy.html %}



### Creating an index with document replication

Even when the default replication type is set to segment replication, you can create an index that uses document replication by setting `replication.type` to `DOCUMENT` as follows:

```json
PUT /my-index1
{
  "settings": {
    "index": {
      "replication.type": "DOCUMENT" 
    }
  }
}
```
{% include copy-curl.html %}

## Considerations

When using segment replication, consider the following:

1. Enabling segment replication for an existing index requires [reindexing](https://github.com/opensearch-project/OpenSearch/issues/3685).
1. [Cross-cluster replication](https://github.com/opensearch-project/OpenSearch/issues/4090) does not currently use segment replication to copy between clusters.
1. Segment replication leads to increased network congestion on primary shards using node-to-node replication because replica shards fetch updates from the primary shard. With remote-backed storage, the primary shard can upload segments to, and the replicas can fetch updates from, the remote-backed storage. This helps offload responsibilities from the primary shard to the remote-backed storage.
1. Read-after-write guarantees: Segment replication does not currently support setting the refresh policy to `wait_for` or `true`. If you set the `refresh` query parameter to `wait_for` or `true` and then ingest documents, you'll get a response only after the primary node has refreshed and made those documents searchable. Replica shards will respond only after having written to their local translog. If real-time reads are needed, consider using the [`get`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/) or [`mget`]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/) API operations. 
1. As of OpenSearch 2.10, system indexes support segment replication. 
1. Get, MultiGet, TermVector, and MultiTermVector requests serve strong reads by routing requests to the primary shards. Routing more requests to the primary shards may degrade performance as compared to distributing requests across primary and replica shards. To improve performance in read-heavy clusters, we recommend setting the `realtime` parameter in these requests to `false`. For more information, see [Issue #8700](https://github.com/opensearch-project/OpenSearch/issues/8700).

## Benchmarks

During initial benchmarks, segment replication users reported 40% higher throughput than when using document replication with the same cluster setup.

The following benchmarks were collected with [OpenSearch-benchmark]({{site.url}}{{site.baseurl}}/benchmark/index/) using the [`stackoverflow`](https://www.kaggle.com/datasets/stackoverflow/stackoverflow) and [`nyc_taxi`](https://github.com/topics/nyc-taxi-dataset) datasets.  

The benchmarks demonstrate the effect of the following configurations on segment replication:

- [The workload size](#increasing-the-workload-size)
- [The number of primary shards](#increasing-the-number-of-primary-shards)
- [The number of replicas](#increasing-the-number-of-replicas)

Your results may vary based on the cluster topology, hardware used, shard count, and merge settings. 
{: .note }

### Increasing the workload size

The following table lists benchmarking results for the `nyc_taxi` dataset with the following configuration:

- 10 m5.xlarge data nodes
- 40 primary shards, 1 replica each (80 shards total)
- 4 primary shards and 4 replica shards per node

<table>
    <th colspan="2" ></th>
    <th colspan="3" >40 GB primary shard, 80 GB total</th>
    <th colspan="3">240 GB primary shard, 480 GB total</th>
    <tr>
        <td></td>
        <td></td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
    </tr>
    <tr>
        <td>Store size</td>
        <td ></td>
        <td>85.2781</td>
        <td>91.2268</td>
        <td>N/A</td>
        <td>515.726</td>
        <td>558.039</td>
        <td>N/A</td>
    </tr>
    <tr>
        <td rowspan="3">Index throughput (number of requests per second)</td>
        <td>Minimum</td>
        <td>148,134</td>
        <td>185,092</td>
        <td>24.95%</td>
        <td>100,140</td>
        <td>168,335</td>
        <td>68.10%</td>
    </tr>
    <tr>
        <td class="td-custom">Median</td>
        <td>160,110</td>
        <td>189,799</td>
        <td>18.54%</td>
        <td>106,642</td>
        <td>170,573</td>
        <td>59.95%</td>
    </tr>
    <tr>
        <td class="td-custom">Maximum</td>
        <td>175,196</td>
        <td>190,757</td>
        <td>8.88%</td>
        <td>108,583</td>
        <td>172,507</td>
        <td>58.87%</td>
    </tr>
    <tr>
        <td>Error rate</td>
        <td ></td>
        <td>0.00%</td>
        <td>0.00%</td>
        <td >0.00%</td>
        <td>0.00%</td>
        <td>0.00%</td>
        <td>0.00%</td>
    </tr>
</table>

As the size of the workload increases, the benefits of segment replication are amplified because the replicas are not required to index the larger dataset. In general, segment replication leads to higher throughput at lower resource costs than document replication in all cluster configurations, not accounting for replication lag. 

### Increasing the number of primary shards

The following table lists benchmarking results for the `nyc_taxi` dataset for 40 and 100 primary shards.

{::nomarkdown}
<table>
    <th colspan="2"></th>
    <th colspan="3">40 primary shards, 1 replica</th>
    <th colspan="3">100 primary shards, 1 replica</th>
    <tr>
        <td></td>
        <td></td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
    </tr>
    <tr>
        <td rowspan="3">Index throughput (number of requests per second)</td>
        <td>Minimum</td>
        <td>148,134</td>
        <td>185,092</td>
        <td>24.95%</td>
        <td>151,404</td>
        <td>167,391</td>
        <td>9.55%</td>
    </tr>
    <tr>
        <td class="td-custom">Median</td>
        <td>160,110</td>
        <td>189,799</td>
        <td>18.54%</td>
        <td>154,796</td>
        <td>172,995</td>
        <td>10.52%</td>
    </tr>
    <tr>
        <td class="td-custom">Maximum</td>
        <td>175,196</td>
        <td>190,757</td>
        <td>8.88%</td>
        <td>166,173</td>
        <td>174,655</td>
        <td>4.86%</td>
    </tr>
    <tr>
        <td>Error rate</td>
        <td ></td>
        <td>0.00%</td>
        <td>0.00%</td>
        <td >0.00%</td>
        <td>0.00%</td>
        <td>0.00%</td>
        <td>0.00%</td>
    </tr>
</table>
{:/}

As the number of primary shards increases, the benefits of segment replication over document replication decrease. While segment replication is still beneficial with a larger number of primary shards, the difference in performance becomes less pronounced because there are more primary shards per node that must copy segment files across the cluster. 

### Increasing the number of replicas

The following table lists benchmarking results for the `stackoverflow` dataset for 1 and 9 replicas.

{::nomarkdown}
<table>
    <th colspan="2"  ></th>
    <th colspan="3"  >10 primary shards, 1 replica</th>
    <th colspan="3">10 primary shards, 9 replicas</th>
    <tr>
        <td></td>
        <td></td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
        <td>Document Replication</td>
        <td>Segment Replication</td>
        <td>Percent difference</td>
    </tr>
    <tr>
        <td rowspan="2">Index throughput (number of requests per second)</td>
        <td >Median</td>
        <td>72,598.10</td>
        <td>90,776.10</td>
        <td>25.04%</td>
        <td>16,537.00</td> 
        <td>14,429.80</td> 
        <td>&minus;12.74%</td>
    </tr>
    <tr>
        <td class="td-custom">Maximum</td>
        <td>86,130.80</td>
        <td>96,471.00</td>
        <td>12.01%</td>
        <td>21,472.40</td>
        <td>38,235.00</td>
        <td>78.07%</td>
    </tr>
    <tr>
        <td rowspan="4">CPU usage (%)</td>
        <td >p50</td>
        <td>17</td>
        <td>18.857</td>
        <td>10.92%</td>
        <td>69.857</td>
        <td>8.833</td>
        <td>&minus;87.36%</td>
    </tr>
    <tr>
        <td class="td-custom">p90</td>
        <td>76</td>
        <td>82.133</td>
        <td>8.07%</td>
        <td>99</td>
        <td>86.4</td>
        <td>&minus;12.73%</td>
    </tr>
    <tr>
        <td class="td-custom">p99</td>
        <td>100</td>
        <td>100</td>
        <td >0%</td>
        <td>100</td>
        <td>100</td>
        <td>0%</td>
    </tr>
    <tr>
        <td class="td-custom">p100</td>
        <td>100</td>
        <td>100</td>
        <td >0%</td>
        <td>100</td>
        <td>100</td>
        <td>0%</td>
    </tr>
    <tr>
        <td rowspan="4">Memory usage (%)</td>
        <td >p50</td>
        <td>35</td>
        <td>23</td>
        <td>&minus;34.29%</td>
        <td>42</td>
        <td>40</td>
        <td>&minus;4.76%</td>
    </tr>
    <tr>
        <td class="td-custom">p90</td>
        <td>59</td>
        <td>57</td>
        <td>&minus;3.39%</td>
        <td>59</td>
        <td>63</td>
        <td>6.78%</td>
    </tr>
    <tr>
        <td class="td-custom">p99</td>
        <td>69</td>
        <td>61</td>
        <td>&minus;11.59%</td>
        <td>66</td>
        <td>70</td>
        <td>6.06%</td>
    </tr>
    <tr>
        <td class="td-custom">p100</td>
        <td>72</td>
        <td>62</td>
        <td>&minus;13.89%</td>
        <td>69</td>
        <td>72</td>
        <td>4.35%</td>
    </tr>
    <tr>
        <td>Error rate</td>
        <td ></td>
        <td>0.00%</td>
        <td>0.00%</td>
        <td >0.00%</td>
        <td>0.00%</td>
        <td>2.30%</td>
        <td>2.30%</td>
    </tr>
</table>
{:/}

As the number of replicas increases, the amount of time required for primary shards to keep replicas up to date (known as the _replication lag_) also increases. This is because segment replication copies the segment files directly from primary shards to replicas. 

The benchmarking results show a non-zero error rate as the number of replicas increases. The error rate indicates that the [segment replication backpressure]({{site.urs}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/backpressure/) mechanism is initiated when replicas cannot keep up with the primary shard. However, the error rate is offset by the significant CPU and memory gains that segment replication provides.

## Next steps

1. Track [future enhancements to segment replication](https://github.com/orgs/opensearch-project/projects/99).
1. Read [this blog post about segment replication](https://opensearch.org/blog/segment-replication/).
