---
layout: default
title: Reroute client traffic
nav_order: 3
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-phases/reroute-source-to-proxy/
---

# Reroute client traffic to the Traffic Capture Proxy

**Note**: This page is only relevant if you are using Capture and Replay to avoid downtime during a migration. If you are only performing backfill migration you can skip this step.
{: .note}

## Capture Proxy data replication

If you're interested in capturing live traffic during your migration, Migration Assistant includes an Application Load Balancer for routing traffic to the Capture Proxy and target cluster. Upstream client traffic must be routed through the Capture Proxy in order to replay the requests later. Before using the Capture Proxy, remember the following:

* The layer upstream from the Application Load Balancer is compatible with the certificate for the Application Load Balancer listener, whether it's for clients or a Network Load Balancer. The `albAcmCertArn` in the `cdk.context.json` may need to be provided to ensure that clients trust the Application Load Balancer certificate.
* If a Network Load Balancer is used directly upstream of the Application Load Balancer, it must use a TLS listener.
* Upstream resources and security groups must allow network access to the Migration Assistant Application Load Balancer.

To set up the Capture Proxy, go to the AWS Management Console and navigate to **EC2 > Load Balancers > Migration Assistant Application Load Balancer**. Copy the Application Load Balancer URL. With the URL copied, you can use one of the following options.



### If you are using **Network Load Balancer → Application Load Balancer → Cluster**

1. Ensure that ingress is provided directly to the Application Load Balancer for the Capture Proxy.
2. Create a target group for the Migration Assistant Application Load Balancer on port `9200` and set the health check to `HTTPS`.
3. Associate this target group with your existing Network Load Balancer on a new listener for testing.
4. Verify that the health check is successful and perform smoke testing with some clients through the new listener port.
5. Once you are ready to migrate all clients, detach the Migration Assistant Application Load Balancer target group from the testing Network Load Balancer listener and modify the existing Network Load Balancer listener to direct traffic to this target group.
6. Now client requests will be routed through the proxy (once they establish a new connection). Verify the application metrics.

### If you are using **Network Load Balancer → Cluster**

If you do not want to modify application logic, add an Application Load Balancer in front of your cluster and follow the **Network Load Balancer → Application Load Balancer → Cluster** steps. Otherwise:

1. Create a target group for the Application Load Balancer on port `9200` and set the health check to `HTTPS`.
2. Associate this target group with your existing Network Load Balancer on a new listener.
3. Verify that the health check is successful, and perform smoke testing with some clients through the new listener port.
4. Once you are ready to migrate all clients, deploy a change so that clients hit the new listener.
   

### If you are **not using a Network Load Balancer**

If you're only using backfill as your migration technique, make a client/DNS change to route clients to the Migration Assistant Application Load Balancer on port `9200`.


### Apache Kafka connection

After you have routed the client based on your use case, test adding records against HTTP requests using the following steps.

In the migration console, run the following command:

```bash
console kafka describe-topic-records
```
{% include copy.html %}
   
Note the records in the logging topic.
   
After a short period, re-execute the same command again and compare the increased number of records against the expected HTTP requests.

TODO: Check if the following sections are located in the backfill page
## Backfilling documents to the source cluster

From your source cluster snapshot, you can begin backfilling documents into the target cluster. Once you have started this process, a fleet of workers will spin up to read the snapshot and reindex documents into the target cluster. This fleet of workers can be scaled to increase the speed at which documents are reindexed into the target cluster.

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
