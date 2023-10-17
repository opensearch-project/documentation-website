---
layout: default
title: Remote-backed storage
nav_order: 40
has_children: true
parent: Availability and recovery
redirect_from: 
  - /opensearch/remote/
  - /tuning-your-cluster/availability-and-recovery/remote/
---

# Remote-backed storage

Introduced 2.10
{: .label .label-purple }


Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

With remote-backed storage, when a write request lands on the primary shard, the request is indexed to Lucene on the primary shard only. The corresponding translog is then uploaded to remote store. OpenSearch does not send the write request to the replicas, but rather performs a primary term validation to confirm that the request originator shard is still the primary shard. Primary term validation ensures that the acting primary shard fails if it becomes isolated and is unaware of the cluster manager electing a new primary.

After segments are created on the primary shard as part of the refresh, flush, and merge flow, the segments are uploaded to remote segment store and the replica shards source a copy from the same remote segment store. This prevents the primary shard from having to perform any write operations.

## Configuring remote-backed storage

Remote-backed storage is a cluster level setting. It can only be enabled when bootstrapping to the cluster. After bootstrapping completes, the remote-backed storage cannot be enabled or disabled. This provides durability at the cluster level.

Communication with the configured remote cluster happens in the Repository plugin interface. All the existing implementations of the Repository plugin, such as Azure Blob Storage, Google Cloud Storage, and Amazon Simple Storage Service (Amazon S3), are compatible with remote-backed storage.

Make sure remote store settings are configured the same way across all nodes in the cluster. If not, bootstrapping will fail for nodes whose attributes are different from the elected cluster manager node.
{: .note}

To enable remote-backed storage for a given cluster, provide the remote store repository details as node attributes in `opensearch.yml`, as shown in the following example:

```yml
# Repository name
node.attr.remote_store.segment.repository: my-repo-1
node.attr.remote_store.translog.repository: my-repo-2
node.attr.remote_store.state.repository: my-repo-3

# Segment repository settings
node.attr.remote_store.repository.my-repo-1.type: s3
node.attr.remote_store.repository.my-repo-1.settings.bucket: <Bucket Name 1>
node.attr.remote_store.repository.my-repo-1.settings.base_path: <Bucket Base Path 1>
node.attr.remote_store.repository.my-repo-1.settings.region: us-east-1

# Translog repository settings
node.attr.remote_store.repository.my-repo-2.type: s3
node.attr.remote_store.repository.my-repo-2.settings.bucket: <Bucket Name 2>
node.attr.remote_store.repository.my-repo-2.settings.base_path: <Bucket Base Path 2>
node.attr.remote_store.repository.my-repo-2.settings.region: us-east-1

# Cluster state repository settings
node.attr.remote_store.repository.my-repo-3.type: s3
node.attr.remote_store.repository.my-repo-3.settings.bucket: <Bucket Name 3>
node.attr.remote_store.repository.my-repo-3.settings.base_path: <Bucket Base Path 3>
node.attr.remote_store.repository.my-repo-3.settings.region: us-east-1
```
{% include copy-curl.html %}

You do not have to use three different remote store repositories for segment, translog, and state. All three stores can share the same repository. 

During the bootstrapping process, the remote-backed repositories listed in `opensearch.yml` are automatically registered. After the cluster is created with the `remote_store` settings, all indexes created in that cluster will start uploading data to the configured remote store.

## Related cluster settings

You can use the following [cluster settings]({{site.url}}{{site.baseurl}}//api-reference/cluster-api/cluster-settings/) to tune how remote-backed clusters handle each workload.

| Field | Data type | Description |
| :--- | :--- | :--- |
| cluster.default.index.refresh_interval | Time unit | Sets the refresh interval when the `index.refresh_interval` setting is not provided. This setting can be useful when you want to set a default refresh interval across all indexes in a cluster and also support the `searchIdle` setting. You cannot set the interval lower than the `cluster.minimum.index.refresh_interval` setting. |
| cluster.minimum.index.refresh_interval | Time unit | Sets the minimum refresh interval and applies it to all indexes in the cluster. The `cluster.default.index.refresh_interval` setting should be higher than this setting's value. If, during index creation, the `index.refresh_interval` setting is lower than the minimum, index creation fails. |
| cluster.remote_store.translog.buffer_interval | Time unit | The default value of the translog buffer interval used when performing periodic translog updates. This setting is only effective when the index setting `index.remote_store.translog.buffer_interval` is not present. |


## Restoring from a backup

To restore an index from a remote backup, such as in the event of a node failure, use one of the following options:

**Restore only unassigned shards**

```bash
curl -X POST "https://localhost:9200/_remotestore/_restore" -H 'Content-Type: application/json' -d'
{
  "indices": ["my-index-1", "my-index-2"]
}
'
```

**Restore all shards of a given index**

```bash
curl -X POST "https://localhost:9200/_remotestore/_restore?restore_all_shards=true" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "indices": ["my-index"]
}
'
```

If the Security plugin is enabled, a user must have the `cluster:admin/remotestore/restore` permission. See [Access control](/security-plugin/access-control/index/) for information about configuring user permissions.
{: .note}

## Potential use cases

You can use remote-backed storage to:

- Restore red clusters or indexes.
- Recover all data up to the last acknowledged write, regardless of replica count, if `index.translog.durability` is set to `request`.

## Benchmarks

The OpenSearch Project has run remote store using multiple workload options available within the [OpenSearch Benchmark](https://opensearch.org/docs/latest/benchmark/index/) tool. This section summarizes the benchmark results for the following workloads: 

- [StackOverflow](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/so)
- [HTTP logs](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/http_logs)
- [NYC taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis),

Each workload was tested against multiple bulk indexing client configurations in order to simulate varying degrees of request concurrency.

Your results may vary based on your cluster topology, hardware, shard count, and merge settings.

### Cluster, shard, and test configuration

For these benchmarks, we used the following cluster, shard, and test configuration:

* Nodes: Three nodes, each using the data, ingest, and cluster manager roles
* Node instance: Amazon EC2 r6g.xlarge
* OpenSearch Benchmark host: Single Amazon EC2 m5.2xlarge instance
* Shard configuration: Three shards with one replica
* The `repository-s3` plugin installed with the default S3 settings 

### StackOverflow

The following table lists the benchmarking results for the `so` workload with a remote translog buffer interval of 250 ms.

|	|	| 8 bulk indexing clients (Default)	| | | 16 bulk indexing clients	| | | 24 bulk indexing clients	| | |
|---	|---	|---	|---	|---	| --- | --- | --- | --- | --- | --- |
|	|	| Document replication	| Remote enabled	| Percent difference	| Document replication	| Remote enabled	| Percent difference	| Document replication	| Remote enabled	| Percent difference	|
|Indexing throughput	|Mean	|29582.5	| 40667.4	|37.47	|31154.9	|47862.3	|53.63	|31777.2	|51123.2	|60.88	|
|Indexing throughput	|P50	|28915.4	|40343.4	|39.52	|30406.4	|47472.5	|56.13	|30852.1	|50547.2	|63.84	|
|Indexing latency	|P90	|1716.34	|1469.5	|-14.38	|3709.77	|2799.82	|-24.53	|5768.68	|3794.13	|-34.23	|

### HTTP logs

The following table lists the benchmarking results for the `http_logs` workload with a remote translog buffer interval of 200 ms.

|	|	| 8 bulk indexing clients (Default)	| | | 16 bulk indexing clients	| | | 24 bulk indexing clients	| | |
|---	|---	|---	|---	|---	| --- | --- | --- | --- | --- | --- |
|	|	| Document replication	| Remote enabled	|Percent difference	| Document replication	| Remote enabled	| Percent difference	|Document replication	| Remote enabled	| Percent difference	|
|Indexing throughput	|Mean	|149062	|82198.7	|-44.86	|134696	|148749	|10.43	|133050	|197239	|48.24	|
|Indexing throughput	|P50	|148123	|81656.1	|-44.87	|133591	|148859	|11.43	|132872	|197455	|48.61	|
|Indexing latency	|P90	|327.011	|610.036	|86.55	|751.705	|669.073	|-10.99	|1145.19	|817.185	|-28.64	|

### NYC taxis

The following table lists the benchmarking results for the `http_logs` workload with a remote translog buffer interval of 250 ms.

|	|	| 8 bulk indexing clients (Default)	| | | 16 bulk indexing clients	| | | 24 bulk indexing clients	| | |
|---	|---	|---	|---	|---	| --- | --- | --- | --- | --- | --- |
|	|	| Document replication	| Remote enabled	|Percent difference	| Document replication	| Remote enabled	| Percent difference	|Document replication	| Remote enabled	| Percent difference	|
|Indexing throughput	|Mean	|93383.9	|94186.1	|0.86	|91624.8	|125770	|37.27	|93627.7	|132006	|40.99	|
|Indexing throughput	|P50	|91645.1	|93906.7	|2.47	|89659.8	|125443	|39.91	|91120.3	|132166	|45.05	|
|Indexing latency	|P90	|995.217	|1014.01	|1.89	|2236.33	|1750.06	|-21.74	|3353.45	|2472	|-26.28	|

As shown by the results, there are consistent gains in cases where the indexing latency is more than the average remote upload time. When you increase the number of bulk indexing clients, a remote-enabled configuration provides indexing throughput gains of up to 60--65%. For more detailed results, see [Issue #9790](https://github.com/opensearch-project/OpenSearch/issues/9790).

## Next steps

To track future enhancements to remote-backed storage, see [Issue #10181](https://github.com/opensearch-project/OpenSearch/issues/10181).

