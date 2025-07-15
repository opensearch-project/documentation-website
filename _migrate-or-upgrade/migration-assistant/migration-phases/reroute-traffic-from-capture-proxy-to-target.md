---
layout: default
title: Cutover
nav_order: 7
parent: Migration phases
permalink: /migration-assistant/migration-phases/switching-traffic-from-the-source-cluster/
---

# Switching traffic from the source cluster

After the source and target clusters are synchronized, traffic needs to be switched to the target cluster so that the source cluster can be taken offline.

## Assumptions

This page assumes that the following has occurred before making the switch:

- All client traffic is being routed through a switchover listener in the [MigrationAssistant Application Load Balancer]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).
- Client traffic has been verified as compatible with the target cluster.
- The target cluster is in a good state to accept client traffic.
- The target proxy service is deployed.

## Switching traffic

Use the following steps to switch traffic from the source cluster to the target cluster:

1. In the AWS Management Console, navigate to **ECS** > **Migration Assistant Cluster**. Note the desired count of the capture proxy, which should be greater than 1.

2. Update the **ECS Service** of the target proxy to be at least as large as the traffic capture proxy. Wait for tasks to start up, and verify that all targets are healthy in the target proxy service's **Load balancer health** section.

3. Navigate to **EC2** > **Load Balancers** > **Migration Assistant ALB**.

4. Navigate to **ALB Metrics** and examine any useful information, specifically looking at **Active Connection Count** and **New Connection Count**. Note any large discrepancies, which can indicate reused connections affecting traffic switchover.

5. Navigate to **Capture Proxy Target Group** (`ALBSourceProxy-<STAGE>-TG`) > **Monitoring**.

6. Examine the **Metrics Requests**, **Target (2XX, 3XX, 4XX, 5XX)**, and **Target Response Time** metrics. Verify that this appears as expected and includes all traffic expected to be included in the switchover. Note details that could help identify anomalies during the switchover, including the expected response time and response code rate.

7. Navigate back to **ALB Metrics** and choose **Target Proxy Target Group** (`ALBTargetProxy-<STAGE>-TG`). Verify that all expected targets are healthy and that none are in a draining state.

8. Navigate back to **ALB Metrics** and to the **Listener** on port `9200`.

9. Choose the **Default rule** and **Edit**.

10. Modify the weights of the targets to switch the desired traffic to the target proxy. To perform a full switchover, modify the **Target Proxy** weight to `1` and the **Source Proxy** weight to `0`.

11. Choose **Save Changes**.

12. Navigate to both **SourceProxy** and **TargetProxy TG Monitoring** metrics and verify that traffic is switching over as expected. If connections are being reused by clients, perform any necessary actions to terminate them. Monitor these metrics until **SourceProxy TG** shows 0 requests when all clients have switched over.


## Fallback

If you need to fall back to the source cluster at any point during the switchover, revert the **Default rule** so that the Application Load Balancer routes to the **SourceProxy Target Group**.