---
layout: default
title: Backfill
nav_order: 6
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-phases/backfill/
redirect_from:
  - /migration-phases/backfill/
---

# Using backfill

After the [metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/) for your cluster has been migrated, you can use Capture Proxy data replication and snapshots to backfill your data into the next cluster.

## Migrate documents with RFS

You can now use RFS to migrate documents from your original cluster:

### Starting the backfill

To start the migration from RFS, start a `backfill` using the following command:

```bash
console backfill start
```
{% include copy.html %}

You should receive a response similar to the following:

```shell
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

The status will be `Running` even if all the shards have been migrated.

### Scaling up the fleet

_(Optional)_ To speed up the migration, increase the number of documents processed simultaneously by using the following command:

```bash
console backfill scale <NUM_WORKERS>
```
{% include copy.html %}

To speed up the transfer, you can scale the number of workers. It may take a few minutes for these additional workers to come online. The following command will update the worker fleet to a size of 10:

```shell
console backfill scale 5
```
{% include copy.html %}

We recommend slowly scaling up the fleet while monitoring the health metrics of the target cluster to avoid oversaturating it. [Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring.html) provide a number of metrics and logs that can be used for this monitoring.

### Monitoring the backfill

To check the status of the documentation backfill, use the following command:

```bash
console backfill status
```
{% include copy.html %}

Use the following command to perform detailed monitoring of the backfill process:

```bash
console backfill status --deep-check
```
{% include copy.html %}

You should receive the following output:

```json
BackfillStatus.RUNNING
Running=9
Pending=1
Desired=10
Shards total: 62
Shards completed: 46
Shards incomplete: 16
Shards in progress: 11
Shards unclaimed: 5
```

Logs and metrics are available in Amazon CloudWatch in the `OpenSearchMigrations` log group.

If you need to stop the backfill process, use the following command:

```bash
console backfill stop
```
{% include copy.html %}

### Pausing the migration

To pause a migration, use the following command:

```shell
console backfill pause
```

This will stop all existing workers from running while leaving the backfill operation in a state from which it can be restarted. When you want to restart the migration, perform one of the following actions:

- Run `console backfill start`.
- Scale up the worker count by running `console backfill scale <worker_count>`.

### Stopping the migration

Completing the backfill process requires manually stopping the migration. Stopping the migration shuts down all workers and cleans up all metadata used to track and coordinate the migration. Once the status checks report that your data has been completely migrated, you can stop the migration with the following command:

```shell
console backfill stop
```
{% include copy.html %}

Migration Assistant should return the following response:

```shell
Backfill stopped successfully.
Service migration-aws-integ-reindex-from-snapshot set to 0 desired count. Currently 0 running and 5 pending.
Archiving the working state of the backfill operation...
RFS Workers are still running, waiting for them to complete...
Backfill working state archived to: /shared-logs-output/migration-console-default/backfill_working_state/working_state_backup_20241115174822.json
```

You cannot restart a stopped migration. Instead, you can pause the backfill process using `console backfill pause`.

### Amazon CloudWatch metrics and dashboard

Migration Assistant creates an Amazon CloudWatch dashboard, named `MigrationAssistant_ReindexFromSnapshot_Dashboard`, that you can use to visualize the health and performance of the backfill process. It combines the metrics for the backfill workers and, for those migrating to Amazon OpenSearch Service, the target cluster.

You can find the backfill dashboard in the CloudWatch console based on the AWS Region in which you have deployed Migration Assistant. The metric graphs for your target cluster will be blank until you select the OpenSearch domain you're migrating to from the dropdown menu at the top of the dashboard.

## Validating the backfill

After the backfill is complete and the workers have stopped, examine the contents of your cluster using the [Refresh API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/) and the [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/). The following example uses the console CLI with the Refresh API to check the backfill status:

```shell
console clusters cat-indices --refresh
```
{% include copy.html %}

This will display the number of documents in each of the indexes in the target cluster, as shown in the following example response:

```shell
SOURCE CLUSTER
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   my-index             -DqPQDrATw25hhe5Ss34bQ   1   0          3            0     12.7kb         12.7kb

TARGET CLUSTER
health status index                     uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opensearch-observability 8HOComzdSlSWCwqWIOGRbQ   1   1          0            0       416b           208b
green  open   .plugins-ml-config        9tld-PCJToSUsMiyDhlyhQ   5   1          1            0      9.5kb          4.7kb
green  open   my-index                  bGfGtYoeSU6U6p8leR5NAQ   1   0          3            0      5.5kb          5.5kb
green  open   .migrations_working_state lopd47ReQ9OEhw4ZuJGZOg   1   1          2            0     18.6kb          6.4kb
green  open   .kibana_1
```

You can run additional queries against the target cluster to mimic your production workflow and closely examine the results.

## Verify that all documents were migrated

Use the following query in CloudWatch Logs Insights to identify failed documents:

```bash
fields @message
| filter @message like "Bulk request succeeded, but some operations failed."
| sort @timestamp desc
| limit 10000
```
{% include copy.html %}

If any failed documents are identified, you can index the failed documents directly as opposed to using RFS.
