


After the [[Metadata Migration]] has been completed; begin the backfill of documents from the snapshot of the source cluster.

## Document Migration
Once started a fleet of workers will spin up to read the snapshot and reindex documents on the target cluster. This fleet of workers can be scaled to increased the speed that documents are reindexed onto target cluster.

### Check the starting state of the clusters

You can see the indices and rough document counts of the source and target cluster by running the cat-indices command.  This can be used to monitor the difference between the source and target for any migration scenario.  Check the indices of both clusters with the following command:

```shell
console clusters cat-indices
```

<details>
<summary>
<b>Example cat-indices command output</b>
</summary>

```shell
SOURCE CLUSTER
health status index       uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   my-index WJPVdHNyQ1KMKol84Cy72Q   1   0          8            0     44.7kb         44.7kb

TARGET CLUSTER
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opendistro_security         N3uy88FGT9eAO7FTbLqqqA   1   0         10            0     78.3kb         78.3kb
```
</details>

### Start the backfill

By starting the backfill by running the following command, which creates a fleet with a single worker:

```shell
console backfill start
```

### Monitor the status

You can use the status check command to see more detail about things like the number of shards completed, in progress, remaining, and the overall status of the operation:

```shell
console backfill status --deep-check
```

<details>
<summary>
<b>Example status output</b>
</summary>

```
BackfillStatus.RUNNING
Running=1
Pending=0
Desired=1
Shards total: 48
Shards completed: 48
Shards incomplete: 0
Shards in progress: 0
Shards unclaimed: 0
```
</details>

>[!Note]
> The status will be "RUNNING" even if all the shards have been migrated.

### Scale up the fleet

To speed up the transfer, you can scale the number of workers. It may take a few minutes for these additional workers to come online.  The following command will update the worker fleet to a size of ten:

```shell
console backfill scale 5
```

### Stopping the migration
Backfill requires manually stopping the fleet.  Once all the data has been migrated using by checking the status.  You can spin down the fleet and all its workers with the command:

```shell
console backfill stop
```


## Troubleshooting

### How to scaling the fleet

It is recommended to scale up the fleet slowly while monitoring the health metrics of the Target Cluster to avoid over-saturating it.  Amazon OpenSearch Domains provide a number of metrics and logs that can provide this insight; refer to [the official documentation on the subject](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring.html) ↗.  The AWS Console for Amazon Opensearch Service surfaces details that can be useful for this as well.

## Related Links

- [Technical details for RFS](https://github.com/opensearch-project/opensearch-migrations/blob/main/RFS/docs/DESIGN.md)
