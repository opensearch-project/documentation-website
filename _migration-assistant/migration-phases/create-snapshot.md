---
layout: default
title: Creating a snapshot
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
nav_order: 4
permalink: /migration-assistant/migration-phases/create-snapshot/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/create-snapshot/
---

# Creating a snapshot

Creating a snapshot of the source cluster captures all the metadata and documents to be migrated to a new target cluster.

## Create a snapshot

Run the following command to initiate snapshot creation from the source cluster:

```bash
console snapshot create [...]
```
{% include copy.html %}

**Note**: Migration Assistant will automatically generate a snapshot name and configure the necessary Amazon Simple Storage Service (Amazon S3) repository. You only need to specify `--snapshot-name` if you are using an existing snapshot that you created outside of Migration Assistant.

**For existing snapshots**:
If you have an existing snapshot, you can specify it during the RFS configuration in your `cdk.context.json` file using the `reindexFromSnapshotExtraArgs` parameter:
```json
"reindexFromSnapshotExtraArgs": "--s3-repo-uri s3://your-bucket/repo --s3-region us-west-2 --snapshot-name your-existing-snapshot"
```

To check the snapshot creation status, run the following command:

```bash
console snapshot status
```
{% include copy.html %}

To retrieve more information about the snapshot, run the following command:

```bash
console snapshot status --deep-check
```
{% include copy.html %}

Wait for snapshot creation to complete before proceeding to the next migration phase.

To check the progress of the snapshot in real time, use the following command:

```shell
console snapshot status --deep-check
```
{% include copy.html %}

You should receive the following response when the snapshot is created:

```shell
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

## Managing slow snapshot speeds

Depending on the size of the data in the source cluster and the bandwidth allocated for snapshots, the process can take some time. Adjust the maximum rate at which the source cluster's nodes create the snapshot using the `--max-snapshot-rate-mb-per-node` option. Increasing the snapshot rate will consume more node resources, which may affect the cluster's ability to handle normal traffic.
