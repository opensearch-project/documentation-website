---
layout: default
title: Verifying live capture components
grand_parent: Migration phases
nav_order: 4
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/verifying-live-capture-components/
---

# Verifying live capture components

Before using Migration Assistant, take the following steps to verify that your cluster is ready for migration.

### Traffic Replayer

To stop running Traffic Replayer, use the following command:

```bash
console replay stop
```
{% include copy.html %}

### Apache Kafka 

To clear all captured traffic from the Kafka topic, you can run the following command. 

This command will result in the loss of any traffic data captured by the Capture Proxy up to this point and thus should be used with caution.
{: .warning}

```bash
console kafka delete-topic
```
{% include copy.html %}

### Target cluster 

To clear non-system indexes from the target cluster that may have been created as a result of testing, you can run the following command.

This command will result in the loss of all data in the target cluster and should be used with caution.
{: .warning}

```bash
console clusters clear-indices --cluster target
```

## Switching over client traffic

The Migration Assistant Application Load Balancer is deployed with a listener that shifts traffic between the source and target clusters through proxy services. The Application Load Balancer should start in **Source Passthrough** mode.

### Verifying that the traffic switchover is complete

Use the following steps to verify that the traffic switchover is complete:

1. In the AWS Management Console, navigate to **EC2 > Load Balancers**.
2. Select the **MigrationAssistant ALB**.
3. Examine the listener on port `9200` and verify that 100% of the traffic is directed to the **Source Proxy**.
4. Navigate to the **Migration ECS Cluster** in the AWS Management Console.
5. Select the **Target Proxy Service**.
6. Verify that the desired count for the service is running:
   * If the desired count is not met, update the service to increase it to at least 1 and wait for the service to start.
7. On the **Health and Metrics** tab under **Load balancer health**, verify that all targets are reporting as healthy:
   * This confirms that the Application Load Balancer can connect to the target cluster through the target proxy.
8. (Reset) Update the desired count for the **Target Proxy Service** back to its original value in Amazon Elastic Container Service (Amazon ECS).

### Fixing unidentified traffic patterns

When switching over traffic to the target cluster, you might encounter unidentified traffic patterns. To help identify the cause of these patterns, use the following steps:
* Verify that the target cluster allows traffic ingress from the **Target Proxy security group**.
* Navigate to **Target Proxy ECS Tasks** to investigate any failing tasks.
Set **Filter desired status** to **Any desired status** to view all tasks, then navigate to the logs for any stopped tasks.


## Verifying replication

Use the following steps to verify that replication is working once the Traffic Capture Proxy is deployed:


1. Navigate to the **Migration ECS Cluster** in the AWS Management Console.
2. Navigate to **Capture Proxy Service**.
3. Verify that the capture proxy is running with the desired proxy count. If it is not, update the service to increase it to at least 1 and wait for startup.
4. Under **Health and Metrics** > **Load balancer health**, verify that all targets are healthy. This means that the Application Load Balancer is able to connect to the source cluster through the Capture Proxy.
5. Navigate to the **Migration Console Terminal**.
6. Run `console kafka describe-topic-records`. Wait 30 seconds for another Application Load Balancer health check.
7. Run `console kafka describe-topic-records` again and verify that the number of RECORDS increased between runs.
8. Run `console replay start` to start Traffic Replayer.
9.  Run `tail -f /shared-logs-output/traffic-replayer-default/*/tuples/tuples.log  | jq '.targetResponses[]."Status-Code"'` to confirm that the Kafka requests were sent to the target and that it responded as expected. If the responses don't appear:
    * Check that the migration console can access the target cluster by running `./catIndices.sh`, which should show the indexes in the source and target.
    * Confirm that messages are still being recorded to Kafka.
    * Check for errors in the Traffic Replayer logs (`/migration/STAGE/default/traffic-replayer-default`) using Amazon CloudWatch.
10. (Reset) Update the desired count for the **Capture Proxy Service** back to its original value in Amazon ECS.

### Troubleshooting

Use this guidance to troubleshoot any of the following replication verification issues.

### Health check responses with 401/403 status code

If the source cluster is configured to require authentication, the Capture Proxy will not be able to verify replication beyond receiving a 401/403 status code for Application Load Balancer health checks. For more information, see [Failure Modes](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/trafficCaptureProxyServer/README.md#failure-modes).

### Traffic does not reach the source cluster 

Verify that the source cluster allows traffic ingress from the Capture Proxy security group.

Look for failing tasks by navigating to **Traffic Capture Proxy ECS**. Change **Filter desired status** to **Any desired status** in order to see all tasks and navigate to the logs for stopped tasks.

## Resetting before migration

After all verifications are complete, reset all resources before using Migration Assistant for an actual migration. 

The following steps outline how to reset resources with Migration Assistant before executing the actual migration. At this point all verifications are expected to have been completed. These steps can be performed after [accessing the migration console]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/accessing-the-migration-console/).

### Traffic Replayer

To stop running Traffic Replayer, use the following command:

```bash
console replay stop
```
{% include copy.html %}

### Kafka 

To clear all captured traffic from the Kafka topic, you can run the following command. 

This command will result in the loss of any traffic data captured by the Capture Proxy up to this point and thus should be used with caution.
{: .warning}

```bash
console kafka delete-topic
```
{% include copy.html %}

### Target cluster 

To clear non-system indexes from the target cluster that may have been created as a result of testing, you can run the following command. 

This command will result in the loss of all data in the target cluster and should be used with caution.
{: .warning}

```bash
console clusters clear-indices --cluster target
```
{% include copy.html %}
