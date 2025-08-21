---
layout: default
title: Creating a snapshot
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
nav_order: 4
permalink: /migration-assistant/migration-phases/create-snapshot/
---

# Creating a snapshot

Once you have your change data capture solution in place or have disabled indexing to your source cluster you are ready to create a snapshot. Creating a snapshot of the source cluster captures all the metadata and documents to be migrated to a new target cluster.

## Create a snapshot

Run the following command to initiate snapshot creation from the source cluster:

```bash
console snapshot create [...]
```
{% include copy.html %}

**Note**: Migration Assistant will automatically generate a snapshot name and configure the necessary Amazon Simple Storage Service (Amazon S3) repository. Alternatively, you have the option to bring your own existing snapshot. 

For more details on using an existing snapshot refer to [Bring your own snapshot]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/#bring-your-own-snapshot) configuration.

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

Wait for snapshot creation to complete before proceeding to the metadata migration phase.

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

{% include migration-phase-navigation.html %}
