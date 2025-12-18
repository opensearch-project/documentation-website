---
layout: default
title: IAM and security groups for existing clusters
nav_order: 2
grand_parent: Migration phases
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/
redirect_from:
  - /migration-assistant/deploying-migration-assistant/iam-and-security-groups-for-existing-clusters/
  - /deploying-migration-assistant/iam-and-security-groups-for-existing-clusters/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/deploy/iam-and-security-groups-for-existing-clusters/
---

# IAM and security groups for existing clusters

This page outlines security scenarios for using the migration tools with existing clusters, including any necessary configuration changes to ensure proper communication between them.

## Importing Amazon OpenSearch Service

Use the following configuration for Amazon OpenSearch Service.

### OpenSearch Service

For an OpenSearch Domain, two main configurations are typically required to ensure proper functioning of the migration solution:

1. **Security group configuration**

   The domain should have a security group that allows communication from the applicable migration services (Traffic Replayer, Migration Console, `Reindex-from-Snapshot`). The CDK automatically creates an `osClusterAccessSG` security group, which is applied to the migration services. The user should then add this security group to their existing domain to allow access.

2. **Access Policy Configuration** should be one of the following:
   - An open access policy that allows all access.
   - Configured to allow at least the AWS Identity and Access Management (IAM) task roles for the applicable migration services (Traffic Replayer, Migration Console, `Reindex-from-Snapshot`) to access the domain.
  
### Managed service role mapping (Cross-managed-cluster migrations)

When migrating between two managed clusters, for example, when both domains were created using Amazon OpenSearch Service, provide Migration Assistant components with sufficient permissions to modify both the source and target clusters.

Use the following steps to grant the required permissions:

1. In the AWS Management Console, navigate to **CloudFormation** > **Stacks**.
2. Locate the stack that starts with `OSMigrations-<stage>-<region>` (created during CDK deployment).
3. Go to the **Resources** tab and locate the following IAM roles:

   ```bash
   arn:aws:iam::****:role/OSMigrations-<stage>-<region>-migration-console-task
   arn:aws:iam::****:role/OSMigrations-<stage>-<region>-reindex-from-snapshot-task
   arn:aws:iam::****:role/OSMigrations-<stage>-<region>-traffic-replayer-default-task
   ```
   
4. In both the source and target clusters, map users to each Amazon Resource Name (ARN) using the following steps:
    A. Access OpenSearch Dashboards. If you're using Elasticsearch, access Kibana.
    B. Navigate to **Security -> Roles -> all_access**.
    C. In the "Mapped users" section, add each ARN as a backend role.
    D. Save your changes.