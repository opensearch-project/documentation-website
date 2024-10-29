---
layout: default
title: Snapshot creation
nav_order: 90
parent: Metadata
grand_parent: Migration phases
---


# Snapshot creation

Creating a snapshot of the source cluster capture all the metadata and documents to migrate onto a new target cluster.

## Limitations

Incremental or "delta" snapshots are not yet supported. For more information, refer to the [tracking issue MIGRATIONS-1624](https://opensearch.atlassian.net/browse/MIGRATIONS-1624). A single snapshot must be used for a backfill.

## Snapshot Creation from the Console

Create the initial snapshot on the source cluster with the following command:

```shell
console snapshot create
```

To check the progress of the snapshot in real-time, use the following command:

```shell
console snapshot status --deep-check
```

<details>
<summary><b>Example Output When a Snapshot is Completed</b></summary>

```shell
console snapshot status --deep-check

SUCCESS
Snapshot is SUCCESS.
Percent completed: 100.00%
Data GiB done: 29.211/29.211
Total shards: 40
Successful shards: 40
Failed shards: 0
Start time: 2024-07-22 18:21:42
Duration: 0h 13m 4s
Anticipated duration remaining: 0h 0m 0s
Throughput: 38.13 MiB/sec
```
</details>

## Troubleshooting

### Slow Snapshot Speed

Depending on the size of the data on the source cluster and the bandwidth allocated for snapshots, the process can take some time. Adjust the maximum rate at which the source cluster's nodes create the snapshot using the `--max-snapshot-rate-mb-per-node` option. Increasing the snapshot rate will consume more node resources, which may affect the cluster's ability to handle normal traffic. If not specified, the default rate for the source cluster's version will be used. For more details, refer to the [Elasticsearch 7.10 snapshot documentation](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/put-snapshot-repo-api.html#put-snapshot-repo-api-request-body) ↗.