


The Migrations ALB is deployed with a listener that shifts traffic between the source and target clusters through proxy services. The ALB should start in **Source Passthrough** mode.

## Verify traffic switchover has completed
1. In the AWS Console, navigate to **EC2 > Load Balancers**.
2. Select the **MigrationAssistant ALB**.
3. Examine the listener on port 9200 and verify that 100% of traffic is directed to the **Source Proxy**.
4. Navigate to the **Migration ECS Cluster** in the AWS Console.
5. Select the **Target Proxy Service**.
6. Verify that the desired count for the service is running:
   * If the desired count is not met, update the service to increase it to at least 1 and wait for the service to start.
7. In the **Health and Metrics** tab under **Load balancer health**, verify that all targets are reporting as healthy:
   * This confirms the ALB can connect to the target cluster through the target proxy.
8. (Reset) Update the desired count for the **Target Proxy Service** back to its original value in ECS.

## Troubleshooting

### Unexpected traffic patterns
* Verify that the target cluster allows traffic ingress from the **Target Proxy Security Group**.
* Navigate to the **Target Proxy ECS Tasks** to investigate any failing tasks:
   * Set the "Filter desired status" to "Any desired status" to view all tasks, then navigate to the logs for any stopped tasks.