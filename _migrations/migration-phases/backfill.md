---
layout: default
title: Backfill
nav_order: 90
parent: Migration phases
---

# Backfill

After the [metadata]({{site.url}}{{site.baseurl}}/migrations/migration-phases/migrating-metadata) for your cluster has been migrated, you can use capture proxy data replication and snapshots to backfill your data into the next cluster.

## Capture proxy data replication

The Migration Assistant includes an Application Load Balancer (ALB) for routing traffic to the capture proxy and the target cluster. Upstream client traffic must be routed through the capture proxy in order to replay the requests later. Before using the capture proxy, remember the following:

* The upstream layer from the ALB is compatible with the certificate on the ALB listener, whether it’s for clients or a Network Load Balancer (NLB). The `albAcmCertArn` in the `cdk.context.json` may need to be provided to ensure that clients trust the ALB certificate.
* If an NLB is used directly upstream of the ALB, it must use a TLS listener.
* Upstream resources and security groups must allow network access to the Migration Assistant ALB.

To set up the capture proxy, go to your AWS console and navigate to **EC2 > Load Balancers > Migration Assistant ALB**. Copy the ALB URL. With the URL copied, you can use one of the following options.


### If you are using **NLB → ALB → Cluster**

1. Ensure that ingress is provided directly to the ALB for the capture proxy.
2. Create a target group for the Migration Assistant ALB on port `9200`, and set the health check to `HTTPS`.
3. Associate this target group with your existing NLB on a new listener for testing.
4. Verify the health check is successful, and perform smoke testing with some clients through the new listener port.
5. Once ready to migrate all clients, detach the Migration Assistant ALB target group from the testing NLB listener and modify the existing NLB listener to direct traffic to this target group.
6. Now, client requests will be routed through the proxy (once they establish a new connection). Verify application metrics.

### If you are using **NLB → Cluster**

1. If you do not wish to modify application logic, add an ALB in front of your cluster and follow the **NLB → ALB → Cluster** steps. Otherwise:
2. Create a target group for the ALB on port 9200 and set the health check to HTTPS.
3. Associate this target group with your existing NLB on a new listener.
4. Verify the health check is successful, and perform smoke testing with some clients through the new listener port.
5. Once ready to migrate all clients, deploy a change so that clients hit the new listener.
   

### If you are **not using an NLB**

Make a client/DNS change to route clients to the Migration Assistant ALB on port `9200`.


### Kafka connection

After you have routed the client based on your use case, test adding records against HTTP requests using the following steps:

1. In the Migration Console, execute the following command:
   ```shell
   console kafka describe-topic-records
   ```
   Note the records in the logging topic.
2. After a short period, execute the same command again and compare the increase in records against the expected HTTP requests.


## Creating a snapshot

Create a snapshot for your backfill using the following command:

```bash
console snapshot create
```

To check the progress of your snapshot in realtime, use the following command:

```bash
console snapshot status --deep-check
```

Depending on the size of the data on the source cluster and the bandwidth allocated for snapshots, the process can take some time. Adjust the maximum rate at which the source cluster's nodes create the snapshot using the `--max-snapshot-rate-mb-per-node` option. Increasing the snapshot rate will consume more node resources, which may affect the cluster's ability to handle normal traffic.

## Backfilling documents to the source cluster

From the snapshot you created of your source cluster, you can begin backfilling documents to the target cluster. Once starting this process, a fleet of workers will spin up to read the snapshot and reindex documents on the target cluster. This fleet of workers can be scaled to increased the speed that documents are reindexed onto the target cluster.

### Checking the starting state of the clusters

You can see the indices and rough document counts of the source and target cluster by running the cat-indices command.  This can be used to monitor the difference between the source and target for any migration scenario.  Check the indices of both clusters with the following command:

```shell
console clusters cat-indices
```

You should receive the following response:

```shell
SOURCE CLUSTER
health status index       uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   my-index WJPVdHNyQ1KMKol84Cy72Q   1   0          8            0     44.7kb         44.7kb

TARGET CLUSTER
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opendistro_security         N3uy88FGT9eAO7FTbLqqqA   1   0         10            0     78.3kb         78.3kb
```

### Starting the backfill

Use the following command to start the backfill and deploy the workers:

```shell
console backfill start
```

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

The status will list as `Running` even if all the shards have been migrated.


### Scaling up the fleet

To speed up the transfer, you can scale the number of workers. It may take a few minutes for these additional workers to come online.  The following command will update the worker fleet to a size of ten:

```shell
console backfill scale 5
```

It is recommended to scale up the fleet slowly while monitoring the health metrics of the Target Cluster to avoid over-saturating it. [Amazon OpenSearch Domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring.html) provide a number of metrics and logs that can provide this insight. The AWS Console for Amazon Opensearch Service surfaces details that can be useful for this as well.

### Stopping the migration

Backfill requires manually stopping the fleet.  Once all the data has been migrated using by checking the status.  You can spin down the fleet and all its workers with the command:

```shell
console backfill stop
```

### CloudWatch metrics and dashboard

The Migration Assistant creates a CloudWatch Dashboard you can use to visualize the health and performance of the backfill process. It brings together the metrics for the backfill workers and, for those migrating to Amazon OpenSearch Service, the target cluster.

You can find the Backfill dashboard in the AWS Console for CloudWatch Dashboards based on the region you have deployed the Migration Assistant. The metric graphs for your target cluster will be blank until you select the OpenSearch Domain you're migrating to from the drop-down menu at the top of the Dashboard.

## Validating the backfill

After the backfill is complete and the workers have stopped, examine the contents of your cluster the [Refresh API](https://opensearch.org/docs/latest/api-reference/index-apis/refresh/) and [Flush API](https://opensearch.org/docs/latest/api-reference/index-apis/flush/). The following example uses the Console CLI with the Refresh API to check the backfill status:

```shell
console clusters cat-indices --refresh
```

This will display the number of documents on each of the indexes on the target cluster, as shown in the following example response:

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

You can run additional queries against the target cluster to mimic your production workflow and closely examine the results returned.