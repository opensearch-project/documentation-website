---
layout: default
title: IAM and security groups for existing clusters
nav_order: 20
nav_exclude: true
permalink: /migration-assistant/deploying-migration-assistant/iam-and-security-groups-for-existing-clusters/
---

# IAM and security groups for existing clusters

This page outlines security scenarios for using the migration tools with existing clusters, including any necessary configuration changes to ensure proper communication between them.

## Importing an Amazon OpenSearch Service or Amazon OpenSearch Serverless target cluster

Use the following scenarios for Amazon OpenSearch Service or Amazon OpenSearch Serverless target clusters.

### OpenSearch Service

For an OpenSearch Domain, two main configurations are typically required to ensure proper functioning of the migration solution:

1. **Security Group Configuration**

   The domain should have a security group that allows communication from the applicable migration services (Traffic Replayer, Migration Console, `Reindex-from-Snapshot`). The CDK automatically creates an `osClusterAccessSG` security group, which is applied to the migration services. The user should then add this security group to their existing domain to allow access.

2. **Access Policy Configuration** should be one of the following:
   - An open access policy that allows all access.
   - Configured to allow at least the AWS Identity and Access Management (IAM) task roles for the applicable migration services (Traffic Replayer, Migration Console, `Reindex-from-Snapshot`) to access the domain.
  
### Managed service role mapping (Cross-managed-cluster migrations)

When migrating between two managed clusters, for example, when both domains were created using Amazon OpenSearch Service, provide Migration Assistant components with sufficient permissions to modify both the source and target clusters.

Use the following steps to grant the required permissions:

1. In the AWS Management Console, navigate to **CloudFormation** > **Stacks**.
2. Locate the stack that starts with `OSMigrations-<state>-<region>` (created during CDK deployment).
3. Go to the **Resources** tab and locate the following IAM roles:

   ```bash
   arn:aws:iam::****:role/OSMigrations-<state>-<region>-MigrationServiceTaskRoleC-
   arn:aws:iam::****:role/OSMigrations-<state>-<region>-reindexfromsnapshotTaskRo-
   arn:aws:iam::****:role/OSMigrations-<state>-<region>-trafficreplayerdefaultTas-
   ```
   
4. In both the source and target clusters, map users to each Amazon Resource Name (ARN) using the following steps:
    A. Access OpenSearch Dashboards. If you're using Elasticsearch, access Kibana.
    B. Navigate to **Security -> Roles -> all_access**.
    C. In the "Mapped users" section, add each ARN as a backend role.
    D. Save your changes.
   
### OpenSearch Serverless

For an OpenSearch Serverless Collection, you will need to configure both network and data access policies:

1. **Network Policy Configuration**:  
   The Collection should have a network policy that uses the `VPC` access type. This requires creating a VPC endpoint on the VPC used for the solution. The VPC endpoint should be configured for the private subnets of the VPC and should attach the `osClusterAccessSG` security group.

2. **Data Access Policy Configuration**:  
   The data access policy should grant permission to perform all [index operations](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html#serverless-data-supported-permissions) (`aoss:*`) for all indexes in the Collection. The IAM task roles of the applicable Migration services (Traffic Replayer, migration console, `Reindex-from-Snapshot`) should be used as the principals for this data access policy.

## Capture Proxy on Coordinator Nodes of Source Cluster

Although the CDK does not automatically set up the Capture Proxy on source cluster nodes (except in the demo solution), the Capture Proxy instances must communicate with the resources deployed by the CDK, such as Kafka. This section outlines the necessary steps to set up communication.

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
