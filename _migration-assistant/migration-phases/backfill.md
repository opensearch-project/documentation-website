---
layout: default
title: Backfill
nav_order: 90
parent: Migration phases
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/backfill/
---

# Backfill

After the [metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/) for your cluster has been migrated, you can use capture proxy data replication and snapshots to backfill your data into the next cluster.

## Capture proxy data replication

If you're interested in capturing live traffic during your migration, Migration Assistant includes an Application Load Balancer for routing traffic to the capture proxy and the target cluster. Upstream client traffic must be routed through the capture proxy in order to replay the requests later. Before using the capture proxy, remember the following:

* The layer upstream from the Application Load Balancer is compatible with the certificate on the Application Load Balancer listener, whether it's for clients or a Network Load Balancer. The `albAcmCertArn` in the `cdk.context.json` may need to be provided to ensure that clients trust the Application Load Balancer certificate.
* If a Network Load Balancer is used directly upstream of the Application Load Balancer, it must use a TLS listener.
* Upstream resources and security groups must allow network access to the Migration Assistant Application Load Balancer.

To set up the capture proxy, go to the AWS Management Console and navigate to **EC2 > Load Balancers > Migration Assistant Application Load Balancer**. Copy the Application Load Balancer URL. With the URL copied, you can use one of the following options.


### If you are using **Network Load Balancer → Application Load Balancer → Cluster**

1. Ensure that ingress is provided directly to the Application Load Balancer for the capture proxy.
2. Create a target group for the Migration Assistant Application Load Balancer on port `9200`, and set the health check to `HTTPS`.
3. Associate this target group with your existing Network Load Balancer on a new listener for testing.
4. Verify that the health check is successful, and perform smoke testing with some clients through the new listener port.
5. Once you are ready to migrate all clients, detach the Migration Assistant Application Load Balancer target group from the testing Network Load Balancer listener and modify the existing Network Load Balancer listener to direct traffic to this target group.
6. Now client requests will be routed through the proxy (once they establish a new connection). Verify the application metrics.

### If you are using **Network Load Balancer → Cluster**

If you do not want to modify application logic, add an Application Load Balancer in front of your cluster and follow the **Network Load Balancer → Application Load Balancer → Cluster** steps. Otherwise:

1. Create a target group for the Application Load Balancer on port `9200` and set the health check to `HTTPS`.
2. Associate this target group with your existing Network Load Balancer on a new listener.
3. Verify that the health check is successful, and perform smoke testing with some clients through the new listener port.
4. Once you are ready to migrate all clients, deploy a change so that clients hit the new listener.
   

### If you are **not using an Network Load Balancer**

If you're only using backfill as your migration technique, make a client/DNS change to route clients to the Migration Assistant Application Load Balancer on port `9200`.


### Kafka connection

After you have routed the client based on your use case, test adding records against HTTP requests using the following steps:

In the migration console, run the following command:

   ```bash
   console kafka describe-topic-records
   ```
   {% include copy.html %}
   
   Note the records in the logging topic.
   
After a short period, execute the same command again and compare the increased number of records against the expected HTTP requests.


## Creating a snapshot

Create a snapshot for your backfill using the following command:

```bash
console snapshot create
```
{% include copy.html %}

To check the progress of your snapshot, use the following command:

```bash
console snapshot status --deep-check
```
{% include copy.html %}

Depending on the size of the data in the source cluster and the bandwidth allocated for snapshots, the process can take some time. Adjust the maximum rate at which the source cluster's nodes create the snapshot using the `--max-snapshot-rate-mb-per-node` option. Increasing the snapshot rate will consume more node resources, which may affect the cluster's ability to handle normal traffic.

## Backfilling documents to the source cluster

From the snapshot you created of your source cluster, you can begin backfilling documents into the target cluster. Once you have started this process, a fleet of workers will spin up to read the snapshot and reindex documents into the target cluster. This fleet of workers can be scaled to increased the speed at which documents are reindexed into the target cluster.

### Checking the starting state of the clusters

You can check the indexes and document counts of the source and target clusters by running the `cat-indices` command. This can be used to monitor the difference between the source and target for any migration scenario. Check the indexes of both clusters using the following command:

```shell
console clusters cat-indices
```
{% include copy.html %}

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

To speed up the transfer, you can scale the number of workers. It may take a few minutes for these additional workers to come online. The following command will update the worker fleet to a size of 10:

```shell
console backfill scale 5
```
{% include copy.html %}

We recommend slowly scaling up the fleet while monitoring the health metrics of the target cluster to avoid over-saturating it. [Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring.html) provide a number of metrics and logs that can provide this insight.

### Stopping the migration

Backfill requires manually stopping the fleet. Once all the data has been migrated, you can shut down the fleet and all its workers using the following command:
Backfill requires manually stopping the fleet. Once all the data has been migrated, you can shut down the fleet and all its workers using the following command:
```shell
console backfill stop
```

### Amazon CloudWatch metrics and dashboard

Migration Assistant creates an Amazon CloudWatch dashboard that you can use to visualize the health and performance of the backfill process. It combines the metrics for the backfill workers and, for those migrating to Amazon OpenSearch Service, the target cluster.

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
