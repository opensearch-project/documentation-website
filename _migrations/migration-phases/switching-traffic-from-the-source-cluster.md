---
layout: default
title: Switching traffic from the source cluster
nav_order: 110
parent: Migration phases
---

# Switching traffic from the source cluster

After the source and target clusters are in sync traffic needs to be switched to the target cluster so the source cluster can be taken offline.

## Assumptions

This page assumes the following has occured before making the switch:

- All client traffic is being routed through switchover listener in [MigrationAssistant ALB]({{site.url}}{{site.baseurl}}/migrations/migration-phases/backfill/).
- Client traffic has been verified to be compatible with target cluster.
- Target cluster is in a good state to accept client traffic.
- The target proxy service is deployed.

## Switching traffic

Use the following steps to switch traffic from the source cluster to the target cluster:

1. In the AWS Console, navigate to **ECS** > **Migration Assistant Cluster**. Note down the desired count of the capture proxy, which should be greater than 1.

2. Update the **ECS Service** of the Target Proxy to be at least as large as the Traffic Capture Proxy. Wait for tasks to startup and verify all targets are healthy within the Target Proxy Service's "Load balancer health".

3. Within the AWS Console, navigate to **EC2** > **Load Balancers** > **Migration Assistant ALB**.

4. Navigate to **ALB Metrics** and examine any useful information, specifically looking at Active Connection Count and New Connection Count. Note any big discrepancies, which can indicate reused connections affecting traffic switchover.

5. Navigate to the **Capture Proxy Target Group** (`ALBSourceProxy-<STAGE>-TG`) > **Monitoring**.

6. Examine **Metrics Requests**, **Target (2XX, 3XX, 4XX, 5XX)**, and **Target Response Time** Metrics. Verify that this looks as expected and includes all traffic expected to be included in the switchover. Note details that would help identify anomalies during the switchover, including expected response time and response code rate.

7. Navigate back to ALB and click on **Target Proxy Target Group** (`ALBTargetProxy-<STAGE>-TG`). Verify all expected targets are healthy and none are in draining state.

8. Navigate back to ALB and to the **Listener** on port `9200`.

9. Click on the **Default rule** and **Edit**.

10. Modify the weights of the targets to shift desired traffic over to the target proxy. To perform a full switchover, modify the weight to `1` on the **Target Proxy** and `0` on the **Source Proxy**.

11. Click **Save Changes**.

12. Navigate to both **SourceProxy** and **TargetProxy TG Monitoring** metrics and verify traffic is shifting over as expected. If connections are being reused by clients, perform any actions if needed to terminate those to get the clients to shift over. Monitor until SourceProxy TG shows 0 requests when it is known all clients have switched over.


## Fallback

If you need to fallback to the source cluster at any point during the switch, revert the **Default rule** to have the ALB route to the **SourceProxy Target Group**.