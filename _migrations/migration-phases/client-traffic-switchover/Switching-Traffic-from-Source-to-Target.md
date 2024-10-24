

After the source and target clusters are in sync traffic needs to be switched to the target cluster so the source cluster can be taken offline.

## Assumptions
- All client traffic is being routed through switchover listener in MigrationAssistant ALB
- Client traffic has been verified to be compatible with Target Cluster
- Target cluster is in a good state to accept client traffic (i.e. backfill/replay is complete as needed)
- Target Proxy Service is deployed

## Switch Traffic to the Source Cluster
1. Within the AWS Console, navigate to ECS > Migration Assistant Cluster
1. Note down the desired count of the Capture Proxy (it should be > 1)
1. Update the ECS Service of the Target Proxy to be at least as large as the Traffic Capture Proxy
1. Wait for tasks to startup, verify all targets healthy within Target Proxy Service "Load balancer health" 
1. Within the AWS Console, navigate to EC2 > Load Balancers > Migration Assistant ALB
1. Navigate to ALB Metrics and examine any information which may be useful
    1. Specifically look at Active Connection Count and New Connection Count and note if theres a big discrepancy, this can indicate a reused connections which affect how traffic will switchover. Once an ALB is re-routed, existing connections will still be routed to the capture proxy until the client/source cluster terminates those.
1. Navigate to the Capture Proxy Target Group (ALBSourceProxy-<STAGE>-TG) > Monitoring
1. Examine Metrics Requests, Target (2XX, 3XX, 4XX, 5XX), and Target Response Time, Metrics
    1. Verify that this looks as expected and includes all traffic expected to be included in the switchover
    1. Note details that would help identify anomalies during the switchover including expected response time and response code rate.  
1. Navigate back to ALB and click on Target Proxy Target Group (ALBTargetProxy-<STAGE>-TG)
1. Verify all expected targets are healthy and none are in draining state
1. Navigate back to ALB and to the Listener on port 9200
1. Click on the Default rule and Edit
1. Modify the weights of the targets to shift desired traffic over to the target proxy
   1. To perform a full switchover, modify the weight to 1 on Target Proxy and 0 on Source Proxy
1. Click Save Changes
1. Navigate to both SourceProxy and TargetProxy TG Monitoring metrics and verify traffic is shifting over as expected
   1. If connections are being reused by clients, perform any actions if needed to terminate those to get the clients to shift over.
   1. Monitor until SourceProxy TG shows 0 requests when it is known all clients have switchover

## Troubleshooting

### Fallback
If needed to fallback, revert the Default rule to have the ALB route to the SourceProxy Target Group