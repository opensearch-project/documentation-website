---
layout: default
title: IAM and security groups for existing clusters
nav_order: 20
parent: Deploying migration assistant
---

# IAM and security groups for existing clusters

This page outlines scenarios for using the migration tools with existing clusters, including any necessary configuration changes to ensure proper communication between them.

## Importing an OpenSearch Service or OpenSearch Serverless Target Cluster

### OpenSearch Service

For an OpenSearch Domain, two main configurations are typically required to ensure proper functioning of the migration solution:

1. **Security Group Configuration**:  
   The Domain should have a security group that allows communication from the applicable Migration services (Traffic Replayer, Migration Console, Reindex-from-Snapshot). The CDK will automatically create an `osClusterAccessSG` security group, which is applied to the Migration services. The user should then add this security group to their existing Domain to allow access.

2. **Access Policy Configuration**:  
   The Domain’s access policy should either:
   - Be an open access policy that allows all access, or
   - Be configured to allow at least the IAM task roles for the applicable Migration services (Traffic Replayer, Migration Console, Reindex-from-Snapshot) to access the Domain.

### OpenSearch Serverless

For an OpenSearch Serverless Collection, you will need to configure both Network and Data Access policies:

1. **Network Policy Configuration**:  
   The Collection should have a network policy that uses the `VPC` access type. This requires creating a VPC endpoint on the VPC used for the solution. The VPC endpoint should be configured for the private subnets of the VPC and should attach the `osClusterAccessSG` security group.

2. **Data Access Policy Configuration**:  
   The data access policy should grant permission to perform all [index operations](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html#serverless-data-supported-permissions) ↗ (`aoss:*`) for all indexes in the Collection. The IAM task roles of the applicable Migration services (Traffic Replayer, Migration Console, Reindex-from-Snapshot) should be used as the principals for this data access policy.

## Capture Proxy on Coordinator Nodes of Source Cluster

Although the CDK does not automatically set up the Capture Proxy on source cluster nodes (except in the demo solution), the Capture Proxy instances must communicate with the resources deployed by the CDK (e.g., Kafka). This section outlines the necessary steps.

Before [setting up Capture Proxy instances](https://github.com/opensearch-project/opensearch-migrations/tree/main/TrafficCapture/trafficCaptureProxyServer#installing-capture-proxy-on-coordinator-nodes) on the source cluster, ensure the following configurations are in place:

1. **Security Group Configuration**:  
   The coordinator nodes should add the `trafficStreamSourceSG` security group to allow sending captured traffic to Kafka.

2. **IAM Policy Configuration**:  
   The IAM role used by the coordinator nodes should have permissions to publish captured traffic to Kafka. You can add the following template policy through the AWS Console (IAM Role → Add permissions → Create inline policy → JSON view):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "kafka-cluster:Connect",
            "Resource": "arn:aws:kafka:<REGION>:<ACCOUNT-ID>:cluster/migration-msk-cluster-<STAGE>/*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "kafka-cluster:CreateTopic",
                "kafka-cluster:DescribeTopic",
                "kafka-cluster:WriteData"
            ],
            "Resource": "arn:aws:kafka:<REGION>:<ACCOUNT-ID>:topic/migration-msk-cluster-<STAGE>/*",
            "Effect": "Allow"
        }
    ]
}
```

## Related Links

- [OpenSearch Traffic Capture Setup](https://github.com/opensearch-project/opensearch-migrations/tree/main/TrafficCapture/trafficCaptureProxyServer#installing-capture-proxy-on-coordinator-nodes) ↗