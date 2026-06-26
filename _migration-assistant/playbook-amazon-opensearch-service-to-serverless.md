---
layout: default
title: "Amazon OpenSearch Service → Amazon OpenSearch Serverless"
nav_order: 2
parent: Playbooks
permalink: /migration-assistant/playbook-amazon-opensearch-service-to-serverless/
---

# Playbook: Amazon OpenSearch Service to Amazon OpenSearch Serverless (vector search)

This playbook describes migrating an Amazon OpenSearch Service domain running Elasticsearch 7.10 to an Amazon OpenSearch Serverless vector search collection using Migration Assistant. 

OpenSearch Serverless with the `VECTORSEARCH` collection type provides the following benefits:

- **No cluster management** -- No nodes to size, patch, or scale. AWS manages capacity automatically.
- **Built-in vector engine** -- Designed for k-NN search, semantic search, and retrieval-augmented generation (RAG) workloads.
- **Pay-per-use pricing** -- OpenSearch Compute Unit (OCU)-based billing means you pay for what you use rather than for idle capacity.
- **Automatic scaling** -- Scales indexing and search capacity independently based on demand.
- **Built-in encryption and access control** -- Encryption at rest, in transit, and fine-grained data access policies without managing security plugins.

If you are running vector or k-NN workloads on an Amazon OpenSearch Service domain, Serverless eliminates the need to manually select and scale instance types for vector workloads, which are memory- and compute-intensive.
{: .note }

## OpenSearch Service compared to OpenSearch Serverless

The following table lists key differences between Amazon OpenSearch Service and OpenSearch Serverless.

| Feature | Amazon OpenSearch Service | OpenSearch Serverless |
|:---------|:---------------------------|:----------------------|
| Cluster settings | Full `_cluster/settings` API | Not supported |
| Snapshot/restore | Supported | Not supported (use Migration Assistant backfill) |
| ISM/ILM policies | Supported | Not supported |
| Ingest pipelines | Supported | Not supported |
| Custom plugins | Supported | Not supported |
| Security model | Fine-grained access control (FGAC) | Data access policies (IAM-based) |
| Authentication | Basic authentication, Security Assertion Markup Language (SAML), IAM | IAM AWS Signature Version 4 only |
| Index templates | Supported | Supported (with limitations) |
| Aliases | Supported | Supported |
| Max index size | No hard limit | 1 TB per index |

Migration Assistant migrates data only (metadata, documents, and live traffic). You must manually recreate ISM policies, ingest pipelines, and dashboards on the target after migration.
{: .warning }

## Example placeholders

The following table lists the example values used in this playbook.

| Setting | Value |
|---------|-------|
| AWS account | `111122223333` |
| Region | `us-east-2` |
| AWS Identity and Access Management (IAM) role | Admin |
| Source | Amazon OpenSearch Service domain (`my-source-domain`, Elasticsearch 7.10) |
| Target | Amazon OpenSearch Serverless collection (`my-target-collection`, VECTORSEARCH) |
| Deployment | "Launch into existing virtual private cloud (VPC)" CloudFormation template |
| Stage | `dev` |

The account IDs, domain names, and endpoints in this playbook are examples. Replace them with values from your environment.
{: .note }

## Estimated timing

The following table provides approximate durations for each phase of the migration.

| Phase | Duration |
|-------|----------|
| Prerequisites (Amazon OpenSearch Serverless collection, policies, IAM, VPC peering) | 15--20 min |
| Step 3: Deploy Migration Assistant (CloudFormation + Helm) | 15--25 min |
| Steps 4--9: Configure and test connectivity | 5--10 min |
| Step 10: Pilot migration (small index) | 15--20 min |
| Step 11: Full migration with change data capture (CDC) | 20--30 min + replay catch-up time |
| Total end-to-end | ~90 min for a small cluster |


## Before you start

In addition to the [general playbook prerequisites]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/), verify the following before starting the migration. 

### Source cluster requirements

Your Amazon OpenSearch Service domain must meet all of the following requirements:

- The domain is running Elasticsearch 7.10 (or any [supported source version]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)).
- The domain is in a VPC and is reachable from the VPC where you deploy Migration Assistant.
- You know the domain's VPC endpoint (for example, `https://vpc-my-source-domain-abc123example.us-east-2.es.amazonaws.com`).
- If fine-grained access control (FGAC) is enabled, map the Migration Assistant IAM role as the `MasterUserARN`.

Confirm the source domain details by running the following command:

```bash
aws opensearch describe-domain \
  --region us-east-2 \
  --domain-name my-source-domain \
  --query 'DomainStatus.{EngineVersion:EngineVersion,Endpoint:Endpoints.vpc,VPC:VPCOptions.VPCId,Subnets:VPCOptions.SubnetIds,SGs:VPCOptions.SecurityGroupIds,FGAC:AdvancedSecurityOptions.Enabled}' \
  --output table
```
{% include copy.html %}

Expected output:

```
-----------------------------------------------------------
|                     DescribeDomain                      |
+-----------------+---------------------------------------+
| EngineVersion   | Elasticsearch_7.10                    |
| Endpoint        | vpc-my-source-domain-...    |
| FGAC            | True                                  |
| VPC             | vpc-009ea0f461cc426c6                 |
+-----------------+---------------------------------------+
```

### Target collection requirements

The target OpenSearch Serverless collection must be configured as follows:

- **Type** -- `VECTORSEARCH` for this playbook. For other workloads, use `SEARCH` or `TIMESERIES`.
- **Encryption policy** -- At least one encryption policy covering the collection.
- **Network policy** -- Public or VPC access depending on your requirements.
- **Data access policy** -- Grants the Migration Assistant IAM role full index read and write access.

If you already have a collection, skip to [Step 5: Map the Migration Assistant IAM role](#step-5-map-the-migration-assistant-iam-role). Otherwise, [create a collection](#prerequisite-create-a-collection). 

### Infrastructure requirements

The following infrastructure is required:

- You have the VPC ID and at least two subnet IDs (each in a different Availability Zone) for the VPC where the source domain resides.
- The subnets have NAT gateway access (or you will use the `--create-vpc-endpoints` flag).
- You have AWS CLI 2.x and `kubectl` installed, or you are using AWS CloudShell.
- Your AWS credentials have Admin permissions in account `111122223333`.

If any of the preceding items is not ready, complete the preparation before continuing.
{: .warning }

## Prerequisite: Create a collection

Create a collection by completing the following steps.

### Step 1: Create the encryption policy

To create the encryption policy, run the following command:

```bash
aws opensearchserverless create-security-policy \
  --region us-east-2 \
  --name vector-search-enc \
  --type encryption \
  --policy '{
    "Rules": [
      {
        "ResourceType": "collection",
        "Resource": ["collection/my-target-collection"]
      }
    ],
    "AWSOwnedKey": true
  }'
```
{% include copy.html %}

### Step 2: Create the network policy

This playbook uses public access. For production environments, consider VPC access. To create the network policy, run the following command:

```bash
aws opensearchserverless create-security-policy \
  --region us-east-2 \
  --name vector-search-net \
  --type network \
  --policy '[{
    "Rules": [
      {
        "ResourceType": "collection",
        "Resource": ["collection/my-target-collection"]
      },
      {
        "ResourceType": "dashboard",
        "Resource": ["collection/my-target-collection"]
      }
    ],
    "AllowFromPublic": true
  }]'
```
{% include copy.html %}

### Step 3: Create the data access policy

This policy grants the account root, Admin role, and the Migration Assistant roles access to the collection. To create the data access policy, run the following command:

```bash
aws opensearchserverless create-access-policy \
  --region us-east-2 \
  --name vector-search-access \
  --type data \
  --policy '[{
    "Rules": [
      {
        "ResourceType": "collection",
        "Resource": ["collection/my-target-collection"],
        "Permission": [
          "aoss:CreateCollectionItems",
          "aoss:DeleteCollectionItems",
          "aoss:UpdateCollectionItems",
          "aoss:DescribeCollectionItems"
        ]
      },
      {
        "ResourceType": "index",
        "Resource": ["index/my-target-collection/*"],
        "Permission": [
          "aoss:CreateIndex",
          "aoss:DeleteIndex",
          "aoss:UpdateIndex",
          "aoss:DescribeIndex",
          "aoss:ReadDocument",
          "aoss:WriteDocument"
        ]
      }
    ],
    "Principal": [
      "arn:aws:iam::111122223333:role/Admin",
      "arn:aws:iam::111122223333:root"
    ]
  }]'
```
{% include copy.html %}

### Step 4: Create the collection

To create the collection, run the following command:

```bash
aws opensearchserverless create-collection \
  --region us-east-2 \
  --name my-target-collection \
  --type VECTORSEARCH
```
{% include copy.html %}

Wait for the collection to become ACTIVE (about 2--3 minutes):

```bash
watch -n 10 "aws opensearchserverless batch-get-collection \
  --region us-east-2 \
  --names my-target-collection \
  --query 'collectionDetails[0].{Status:status,Endpoint:collectionEndpoint}' \
  --output table"
```
{% include copy.html %}

When `Status` shows `ACTIVE`, record the endpoint. The following example shows the expected output for this playbook:

```
https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com
```

### Step 5: Verify that you can reach the collection

If you do not have `awscurl` installed, install it by running the following command: 

```bash
pip install awscurl
```
{% include copy.html %} 

To verify that you can reach the collection, run the following command:

```bash
awscurl --service aoss --region us-east-2 \
  "https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com/"
```
{% include copy.html %}

You should see a JSON response containing the OpenSearch version.

## Step 1: Choose the migration style

Select one of the following migration approaches before configuring the workflow.

### Option A: Planned downtime

For a planned downtime migration, follow these steps:

1. Stop writes to the source domain.
2. Take a snapshot.
3. Migrate metadata.
4. Backfill documents.
5. Validate the target.
6. Point clients to the Serverless collection endpoint.

If you are unsure which approach to select, use planned downtime because it involves fewer components and lower risk.
{: .note }

### Option B: Zero downtime

For a zero-downtime migration, follow these steps:

1. Start capture first.
2. Route clients to the capture proxy.
3. Take a snapshot.
4. Migrate metadata.
5. Backfill documents.
6. Replay captured traffic until the target catches up.
7. Validate the target.
8. Switch clients to the Serverless collection endpoint.

If you choose this option, your clients must send **explicit document IDs** for index and update operations. If your application depends on autogenerated IDs, do not use Capture and Replay.
{: .warning }


## Step 2: Gather your VPC information

Gather the VPC and subnet information that the Migration Assistant deployment reuses.

Find the source domain's VPC:

```bash
aws opensearch describe-domain \
  --region us-east-2 \
  --domain-name my-source-domain \
  --query 'DomainStatus.VPCOptions.{VPCId:VPCId,SubnetIds:SubnetIds,SecurityGroupIds:SecurityGroupIds}' \
  --output json
```
{% include copy.html %}

Record the VPC ID (`vpc-009ea0f461cc426c6`) and subnet IDs.

Find subnet details:

```bash
aws ec2 describe-subnets \
  --region us-east-2 \
  --filters "Name=vpc-id,Values=vpc-009ea0f461cc426c6" \
  --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,CidrBlock:CidrBlock,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table
```
{% include copy.html %}

Select at least two private subnets, each in a different Availability Zone. Record them as a comma-separated string.

You can deploy Migration Assistant into the **same VPC** as the source domain or into a **different VPC** using VPC peering. Deploying Migration Assistant into the same VPC requires less configuration. If you deploy into a different VPC, see the [troubleshooting section](#source-and-target-are-in-different-vpcs).
{: .note }


## Step 3: Deploy Migration Assistant on EKS

This step deploys Migration Assistant on Amazon Elastic Kubernetes Service (EKS) using the bootstrap script.

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

Deploy into the **same VPC** as the source domain:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --vpc-id vpc-009ea0f461cc426c6 \
  --subnet-ids subnet-055497d9551cc298a,subnet-0a776b7d7724f22ae \
  --region us-east-2
```
{% include copy.html %}

This deploys a CloudFormation stack that creates an Amazon EKS cluster, Amazon Elastic Container Registry (Amazon ECR) repository, IAM roles, and then installs the Migration Assistant Helm chart. The deployment takes approximately 15--25 minutes.

<details>
<summary><strong>For isolated subnets (no NAT gateway/no internet)</strong></summary>

Add the `--create-vpc-endpoints` flag:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --vpc-id vpc-009ea0f461cc426c6 \
  --subnet-ids subnet-055497d9551cc298a,subnet-0a776b7d7724f22ae \
  --create-vpc-endpoints \
  --region us-east-2
```
{% include copy.html %}

</details>

Verify the deployment:

```bash
aws eks update-kubeconfig --region us-east-2 --name migration-eks-cluster-dev-us-east-2
kubectl get pods -n ma
```
{% include copy.html %}

All pods should show `Running` with `1/1` ready.


## Step 4: Confirm CloudFormation output

To confirm CloudFormation output, run the following command:

```bash
aws cloudformation describe-stacks \
  --region us-east-2 \
  --stack-name MA \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

The following table lists the key output values.

| Variable | Expected value |
|----------|---------------|
| `MIGRATIONS_EKS_CLUSTER_NAME` | `migration-eks-cluster-dev-us-east-2` |
| `SNAPSHOT_ROLE` | `arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-snapshot-role` |
| `EKS_CLUSTER_SECURITY_GROUP` | The security group ID for the new EKS cluster |

The default Amazon Simple Storage Service (Amazon S3) bucket is `s3://migrations-default-111122223333-dev-us-east-2`.


## Step 5: Map the Migration Assistant IAM role

After deployment, grant the Migration Assistant IAM role access to both the source and target by completing the following steps.

### Step 1: Update the OpenSearch Serverless data access policy

After deploying Migration Assistant, add the `migrations-role` and `snapshot-role` to the OpenSearch Serverless data access policy:

```bash
# Get the current policy version
POLICY_VERSION=$(aws opensearchserverless get-access-policy \
  --region us-east-2 \
  --name vector-search-access \
  --type data \
  --query 'accessPolicyDetail.policyVersion' \
  --output text)

aws opensearchserverless update-access-policy \
  --region us-east-2 \
  --name vector-search-access \
  --type data \
  --policy-version "$POLICY_VERSION" \
  --policy '[{
    "Rules": [
      {
        "ResourceType": "collection",
        "Resource": ["collection/my-target-collection"],
        "Permission": [
          "aoss:CreateCollectionItems",
          "aoss:DeleteCollectionItems",
          "aoss:UpdateCollectionItems",
          "aoss:DescribeCollectionItems"
        ]
      },
      {
        "ResourceType": "index",
        "Resource": ["index/my-target-collection/*"],
        "Permission": [
          "aoss:CreateIndex",
          "aoss:DeleteIndex",
          "aoss:UpdateIndex",
          "aoss:DescribeIndex",
          "aoss:ReadDocument",
          "aoss:WriteDocument"
        ]
      }
    ],
    "Principal": [
      "arn:aws:iam::111122223333:role/Admin",
      "arn:aws:iam::111122223333:root",
      "arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-migrations-role",
      "arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-snapshot-role"
    ]
  }]'
```
{% include copy.html %}

### Step 2: Map the Migration Assistant role on the source domain

If the source domain has fine-grained access control (FGAC) enabled, the Migration Assistant role must be configured as the `MasterUserARN`:

```bash
aws opensearch update-domain-config \
  --region us-east-2 \
  --domain-name my-source-domain \
  --advanced-security-options '{
    "Enabled": true,
    "MasterUserOptions": {
      "MasterUserARN": "arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-migrations-role"
    }
  }'
```
{% include copy.html %}

Wait for the domain update to finish:

```bash
watch -n 10 "aws opensearch describe-domain \
  --region us-east-2 \
  --domain-name my-source-domain \
  --query 'DomainStatus.Processing'"
```
{% include copy.html %}

When `Processing` returns `False`, the domain is ready.

This replaces any existing `MasterUserARN`. If you need to preserve the existing configuration, map the Migration Assistant role to the `all_access` backend role through the OpenSearch Security API instead.
{: .warning }


## Step 6: Configure security group access

Find the Migration Assistant EKS cluster security group:

```bash
MA_SG=$(aws eks describe-cluster \
  --region us-east-2 \
  --name migration-eks-cluster-dev-us-east-2 \
  --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" \
  --output text)
echo "MA EKS Security Group: $MA_SG"
```
{% include copy.html %}

Add an inbound rule so Migration Assistant can reach the source domain on port 443:

```bash
aws ec2 authorize-security-group-ingress \
  --region us-east-2 \
  --group-id sg-07dcc2b6423c745a0 \
  --protocol tcp \
  --port 443 \
  --source-group "$MA_SG"
```
{% include copy.html %}

The target is an OpenSearch Serverless collection with public network access, so no security group rule is needed for the target. If you configured VPC access for the collection, add an inbound rule to the collection's VPC endpoint security group as well.
{: .note }


## Step 7: Connect to the Migration Console

Connect to the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Verify the installed version:

```bash
console --version
```
{% include copy.html %}

Expected output: `Migration Assistant 3.1.1` (or later).

### Register the Amazon S3 snapshot repository on the source domain

Amazon OpenSearch Service requires a `snapshot-role` to write to Amazon S3. Register the repository using the `snapshot-role` from the CloudFormation outputs:

```bash
console clusters curl source /_snapshot/migration-repo \
  -XPUT -H "Content-Type: application/json" \
  -d '{
    "type": "s3",
    "settings": {
      "bucket": "migrations-default-111122223333-dev-us-east-2",
      "region": "us-east-2",
      "role_arn": "arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-snapshot-role",
      "base_path": "aos-to-aoss-snapshots"
    }
  }'
```
{% include copy.html %}

Verify the repository:

```bash
console clusters curl source /_snapshot/migration-repo/_verify?pretty
```
{% include copy.html %}

All nodes should appear in the output.

Unlike self-managed Elasticsearch, Amazon OpenSearch Service uses an IAM `role_arn` for Amazon S3 access instead of keystore credentials. The `snapshot-role` must have a trust policy that allows the OpenSearch Service `Principal` (`es.amazonaws.com`) to assume it.
{: .note }


## Step 8: Build the workflow configuration

To load the version-matched sample and open the editor, run the following commands:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

For an interactive reference of all available fields, their types, defaults, and descriptions, see the [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/).

Replace the workflow configuration file contents with the following configuration. Replace `<PILOT_INDEX_NAME>` with the name of one small, noncritical index (for example, `test-index`):

```json
{
  "sourceClusters": {
    "source": {
      "endpoint": "https://vpc-my-source-domain-abc123example.us-east-2.es.amazonaws.com",
      "allowInsecure": false,
      "version": "ES 7.10",
      "authConfig": {
        "sigv4": {
          "region": "us-east-2",
          "service": "es"
        }
      },
      "snapshotInfo": {
        "repos": {
          "migration-repo": {
            "awsRegion": "us-east-2",
            "s3RepoPathUri": "s3://migrations-default-111122223333-dev-us-east-2/aos-to-aoss-snapshots",
            "s3RoleArn": "arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-snapshot-role"
          }
        },
        "snapshots": {
          "migration-snapshot": {
            "repoName": "migration-repo",
            "config": {
              "createSnapshotConfig": {
                "indexAllowlist": ["<PILOT_INDEX_NAME>"],
                "includeGlobalState": true
              }
            }
          }
        }
      }
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com",
      "allowInsecure": false,
      "authConfig": {
        "sigv4": {
          "region": "us-east-2",
          "service": "aoss"
        }
      }
    }
  },
  "snapshotMigrationConfigs": [
    {
      "fromSource": "source",
      "toTarget": "target",
      "perSnapshotConfig": {
        "migration-snapshot": [
          {
            "metadataMigrationConfig": {
              "indexAllowlist": ["<PILOT_INDEX_NAME>"]
            },
            "documentBackfillConfig": {
              "podReplicas": 4
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy.html %}

The following are key differences from domain-to-domain migrations:

- **Source** uses `sigv4` with `service: "es"`: Amazon OpenSearch Service uses IAM authentication rather than basic authentication.
- **Target** uses `sigv4` with `service: "aoss"`: OpenSearch Serverless requires the `aoss` service name for AWS Signature Version 4 signing.
- **`s3RoleArn`** is required: Amazon OpenSearch Service needs an IAM role to write snapshots to Amazon S3 (unlike self-managed Elasticsearch which uses keystore credentials).
- **No `multiTypeBehavior`**: Elasticsearch 7.10 already uses single-type indexes, so no type mapping transformation is needed.

Verify the configuration:

```bash
workflow configure view
```
{% include copy.html %}


## Step 9: Test connectivity

To verify that the Migration Console can reach both the source and target, run the following command:

```bash
console clusters connection-check
```
{% include copy.html %}

Both source and target should show `Successfully connected!`.

If the source returns a connection timeout, verify the following:

1. Migration Assistant is deployed in the same VPC as the source domain (or VPC peering is configured).
2. The source domain's security group allows inbound TCP 443 from the Migration Assistant EKS cluster security group.

If the target returns 403, verify the following:

1. The OpenSearch Serverless data access policy includes the Migration Assistant migrations role.
2. The network policy allows access from the Migration Assistant pods.

To test connectivity manually, run the following commands:

```bash
console clusters curl source /
console clusters curl target /
```
{% include copy.html %}


## Step 10: Run a pilot migration

Run a pilot migration on one small index before migrating all indexes.

Submit the workflow:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

The `workflow manage` command opens an interactive text-based user interface (TUI). Use it to monitor progress, view logs, and approve gates.

When the workflow pauses at an approval gate (shown as `⟳`), review and approve the output:

```bash
# Approve metadata evaluation
workflow approve step "*.evaluatemetadata"

# Approve metadata migration
workflow approve step "*.migratemetadata"
```
{% include copy.html %}

Gate names are **lowercase**. Alternatively, approve gates directly in the `workflow manage` TUI.
{: .note }

After the workflow completes, verify metadata and documents:

```bash
console clusters curl target /_cat/indices?v
console clusters curl target /<PILOT_INDEX_NAME>/_mapping
console clusters curl target /<PILOT_INDEX_NAME>/_count
console clusters curl target /<PILOT_INDEX_NAME>/_search?size=5&pretty
```
{% include copy.html %}

Verify that the document counts on the source and target match.

If the pilot migration fails, edit the configuration and resubmit:

```bash
workflow configure edit
workflow submit
workflow manage
```
{% include copy.html %}

Do not start the full migration until the pilot migration completes successfully.
{: .note }


## Step 11: Run the full migration

Edit the configuration to expand the allow list:

```bash
workflow configure edit
```
{% include copy.html %}

Set `indexAllowlist` to an empty array to migrate all indexes:

```json
"metadataMigrationConfig": {
  "indexAllowlist": []
}
```
{% include copy.html %}

Update the `createSnapshotConfig`:

```json
"createSnapshotConfig": {
  "indexAllowlist": [],
  "includeGlobalState": true
}
```
{% include copy.html %}

The following sections describe the steps for each migration approach. Follow the section that corresponds to the approach you selected in Step 1.

### Planned downtime path

For a planned downtime migration, follow these steps:

1. **Stop writes to the source domain.**
2. Submit the workflow:

   ```bash
   workflow submit
   workflow manage
   ```
   {% include copy.html %}

3. Approve gates after verifying each phase.
4. After backfill completes, verify the target:

   ```bash
   console clusters curl target /_cat/indices?v
   console clusters curl target /_cat/aliases?v
   ```
   {% include copy.html %}

5. Review components that Migration Assistant does not migrate (ISM or ILM policies, ingest pipelines, dashboards, cluster settings). OpenSearch Serverless does not support these features. Determine whether your workload requires alternatives before proceeding.
6. Point clients to the Serverless collection endpoint: `https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com`.
7. Update client authentication from basic authentication or IAM AWS Signature Version 4 with `service: es` to IAM AWS Signature Version 4 with `service: aoss`.

### Zero-downtime path

For a zero-downtime migration, complete the following sections in order.

#### Step 1: Configure the traffic section

To add a `traffic` section to the workflow configuration, open the editor:

```bash
workflow configure edit
```
{% include copy.html %}

Add the following `traffic` block at the same level as `sourceClusters`, `targetClusters`, and `snapshotMigrationConfigs`:

```json
"traffic": {
  "proxies": {
    "capture": {
      "source": "source",
      "proxyConfig": {
        "listenPort": 443,
        "podReplicas": 2
      }
    }
  },
  "replayers": {
    "replay": {
      "fromProxy": "capture",
      "toTarget": "target",
      "dependsOnSnapshotMigrations": [
        {
          "source": "source",
          "snapshot": "migration-snapshot"
        }
      ],
      "replayerConfig": {
        "podReplicas": 2,
        "speedupFactor": 2.0
      }
    }
  }
}
```
{% include copy.html %}

Set `indexAllowlist` to an empty array to migrate all indexes:

```json
"metadataMigrationConfig": {
  "indexAllowlist": []
}
```
{% include copy.html %}

#### Step 2: Submit the workflow

To submit the workflow and open the monitoring interface, run the following commands:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

The workflow creates five parallel tracks: an Apache Kafka cluster, a capture proxy, a snapshot, a snapshot migration, and a Traffic Replayer. The snapshot waits for the capture proxy to be ready before proceeding.

#### Step 3: Find the capture proxy endpoint

The capture proxy uses the source domain's port (443 for Amazon OpenSearch Service). To find the endpoint, run the following command:

```bash
kubectl get svc capture -n ma
```
{% include copy.html %}

The `EXTERNAL-IP` column shows the Network Load Balancer endpoint. Redirect your application clients to this endpoint.

The capture proxy forwards all requests to the source domain and simultaneously records them to Kafka for replay. The proxy uses AWS Signature Version 4 to authenticate to the source, so your clients can continue using their existing authentication method.
{: .note }

#### Step 4: Approve workflow steps

To perform the approve action, run the following commands:

```bash
workflow approve step "*.evaluatemetadata"
workflow approve step "*.migratemetadata"
```
{% include copy.html %}

#### Step 5: Monitor replay progress

After backfill completes, the Replayer starts processing captured traffic:

```bash
kubectl logs deployment/capture-target-replay -n ma --tail=5
```
{% include copy.html %}

Locate the `ReplayHeartbeat` line:

```log
ReplayHeartbeat - tasksOutstanding=437 schedulingLag=1s lastCompletedSourceTime=2026-05-03T16:01:16.565Z targetResponses={}
```

The following table describes the fields in the heartbeat output.

| Field | Meaning |
|-------|---------|
| `tasksOutstanding` | Captured requests still being replayed. Should decrease toward 0. |
| `lastCompletedSourceTime` | Timestamp of the most recently replayed request. Should approach current time. |
| `targetResponses` | HTTP response codes from the target. Empty `{}` means no write requests replayed yet. |
| `schedulingLag` | The delay between the Replayer and live traffic. Should approach 0 when replay is complete. |

#### Step 6: Verify that document counts match

To compare document counts between the source and target, run the following commands:

```bash
console clusters curl source /_cat/indices?v
console clusters curl target /_cat/indices?v
```
{% include copy.html %}

When the replay is complete, document counts on the target should match the source.

#### Step 7: Switch traffic to the target

When replay is complete and validation confirms the target is correct, switch your application clients from the capture proxy to the Serverless collection endpoint directly:

```
https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com
```

Update your client's AWS Signature Version 4 signing from `service: es` to `service: aoss`.


## Step 12: Keep the source available as a fallback

Do not delete the source domain immediately after cutover. Keep it available for at least 24 to 72 hours while you watch target collection health, application error rates, and operational tooling.


## Step 13: Remove migration infrastructure

Before removing Migration Assistant, confirm all of the following:

1. All client traffic is pointing directly at the Serverless collection and no longer at the capture proxy.
2. The capture proxy and Replayer are no longer needed.
3. You have kept the source domain available as a fallback for at least 24--72 hours.
4. The target collection is healthy and application error rates are normal.

If any client is still sending traffic to the capture proxy endpoint, that traffic will be lost when you remove Migration Assistant. Verify that all clients have been redirected to the target before proceeding.
{: .warning }

### Step 1: Remove the Helm release and namespace

To remove the Migration Assistant Helm release and delete the namespace, run the following commands:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma --timeout=120s
```
{% include copy.html %}

### Step 2: Delete the CloudFormation stack

To delete the CloudFormation stack and all associated resources, run the following commands:

```bash
aws cloudformation delete-stack --region us-east-2 --stack-name MA
aws cloudformation wait stack-delete-complete --region us-east-2 --stack-name MA
```
{% include copy.html %}

This deletes the Amazon EKS cluster, Amazon ECR repository, IAM roles, and VPC endpoints created by Migration Assistant. It does **not** delete the source domain, the Serverless collection, or the Amazon S3 snapshot bucket.

### Step 3 (Optional): Delete the snapshot bucket

To delete the snapshot bucket, run the following command:

```bash
aws s3 rb s3://migrations-default-111122223333-dev-us-east-2 --force
```
{% include copy.html %}

### Step 4 (Optional): Delete the OpenSearch Serverless collection

If you created the collection for testing and no longer need it, run the following command:

```bash
aws opensearchserverless delete-collection \
  --region us-east-2 \
  --id 3nbrhts7rv9jxatilz9e
```
{% include copy.html %}

Then remove the policies:

```bash
aws opensearchserverless delete-access-policy \
  --region us-east-2 --name vector-search-access --type data

aws opensearchserverless delete-security-policy \
  --region us-east-2 --name vector-search-net --type network

aws opensearchserverless delete-security-policy \
  --region us-east-2 --name vector-search-enc --type encryption
```
{% include copy.html %}


## Validation

After the workflow completes, validate the migration at three levels.

### Level 1: Document count comparison

Compare document counts between source and target for every user index:

```bash
console clusters curl source /_cat/indices?v
console clusters curl target /_cat/indices?v
```
{% include copy.html %}

For each user index, verify that the count matches:

```bash
console clusters curl source /<INDEX_NAME>/_count
console clusters curl target /<INDEX_NAME>/_count
```
{% include copy.html %}

### Level 2: Status code comparison (tuple metrics)

If you used the zero-downtime path, the Replayer writes `tupleComparison` metrics to CloudWatch:

```bash
aws logs start-query \
  --region us-east-2 \
  --log-group-name "/metrics/OpenSearchMigrations" \
  --start-time $(date -u -v-3H +%s) \
  --end-time $(date -u +%s) \
  --query-string 'fields @message
    | filter @message like /tupleComparison/
    | parse @message /\"method\":\"(?<method>[^\"]+)\".*\"sourceStatusCode\":\"(?<srcCode>[^\"]+)\".*\"statusCodesMatch\":\"(?<match>[^\"]+)\".*\"targetStatusCode\":\"(?<tgtCode>[^\"]+)\"/
    | stats count() as requests by method, srcCode, tgtCode, match
    | sort requests desc'
```
{% include copy.html %}

Wait a few seconds, then retrieve the results:

```bash
aws logs get-query-results --region us-east-2 --query-id <QUERY_ID>
```
{% include copy.html %}

Investigate mismatches that involve `POST` or `PUT` methods---those are write operations for which a mismatch could indicate data loss.

### Level 3: Sample query comparison

Run a representative query on both clusters and compare the results:

```bash
console clusters curl source /<INDEX_NAME>/_search?size=5&pretty
console clusters curl target /<INDEX_NAME>/_search?size=5&pretty
```
{% include copy.html %}

### Mapping verification

Verify that index mappings were migrated correctly:

```bash
console clusters curl target /<INDEX_NAME>/_mapping
```
{% include copy.html %}

## Reconnecting to the Migration Console

If you need to reconnect to the Migration Console in a new shell session, run the following commands:

```bash
aws eks update-kubeconfig --region us-east-2 --name migration-eks-cluster-dev-us-east-2
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Troubleshooting

The following are common issues and their resolutions.

### Target returns 403 forbidden

The Migration Assistant IAM role is not included in the OpenSearch Serverless data access policy. Update the policy:

```bash
POLICY_VERSION=$(aws opensearchserverless get-access-policy \
  --region us-east-2 --name vector-search-access --type data \
  --query 'accessPolicyDetail.policyVersion' --output text)

echo "Current policy version: $POLICY_VERSION"
```
{% include copy.html %}

Then rerun the `update-access-policy` command from [Step 5: Map the Migration Assistant IAM role](#step-5-map-the-migration-assistant-iam-role) with the correct policy version.

### Source returns a connection timeout

1. Verify that Migration Assistant is in the same VPC as the source domain:

   ```bash
   aws eks describe-cluster \
     --region us-east-2 \
     --name migration-eks-cluster-dev-us-east-2 \
     --query 'cluster.resourcesVpcConfig.vpcId' \
     --output text
   ```
   {% include copy.html %}

2. Verify that the source domain's security group allows the Migration Assistant EKS cluster security group on port 443.

### Source and target are in different VPCs

If Migration Assistant is in a different VPC than the source domain, create a VPC peering connection:

```bash
PEERING_ID=$(aws ec2 create-vpc-peering-connection \
  --region us-east-2 \
  --vpc-id <MA_VPC_ID> \
  --peer-vpc-id <SOURCE_VPC_ID> \
  --query "VpcPeeringConnection.VpcPeeringConnectionId" \
  --output text)

aws ec2 accept-vpc-peering-connection \
  --region us-east-2 \
  --vpc-peering-connection-id "$PEERING_ID"

# Add routes in both directions
aws ec2 create-route \
  --region us-east-2 \
  --route-table-id <MA_PRIVATE_ROUTE_TABLE> \
  --destination-cidr-block <SOURCE_VPC_CIDR> \
  --vpc-peering-connection-id "$PEERING_ID"

aws ec2 create-route \
  --region us-east-2 \
  --route-table-id <SOURCE_ROUTE_TABLE> \
  --destination-cidr-block <MA_VPC_CIDR> \
  --vpc-peering-connection-id "$PEERING_ID"
```
{% include copy.html %}

Then add the Migration Assistant EKS cluster security group to the source domain's security group inbound rules ([Step 6: Configure security group access](#step-6-configure-security-group-access)). Use the Migration Assistant VPC CIDR instead of a security group reference because cross-VPC security group references require the peering connection.

### Snapshot repository registration fails

For Amazon OpenSearch Service, the snapshot role must:
1. Include an IAM policy allowing `s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` on the snapshot bucket.
2. Include a trust policy allowing `es.amazonaws.com` to assume it.
3. Be passed to the `_snapshot` API through the `role_arn` setting.

Verify the snapshot role trust policy:

```bash
aws iam get-role \
  --role-name migration-eks-cluster-dev-us-east-2-snapshot-role \
  --query 'Role.AssumeRolePolicyDocument' \
  --output json
```
{% include copy.html %}

### Consistency guard error on resubmit

First, delete stale custom resources:

```bash
kubectl delete snapshotmigration --all -n ma
kubectl delete datasnapshot --all -n ma
kubectl delete capturedtraffic --all -n ma
kubectl delete captureproxy --all -n ma
kubectl delete trafficreplay --all -n ma
kubectl delete kafkacluster --all -n ma
```
{% include copy.html %}

Then resubmit the workflow:

```bash
workflow submit
```
{% include copy.html %}

### OpenSearch Serverless errors

The following errors are specific to OpenSearch Serverless targets.

#### Index not found exception on the target

OpenSearch Serverless does not support the `_cluster/settings` API or automatic index creation through templates in the same way as Amazon OpenSearch Service. Verify that metadata migration completed successfully before backfill:

```bash
console clusters curl target /_cat/indices?v
```
{% include copy.html %}

#### Security exception with a permissions error

The OpenSearch Serverless data access policy is missing permissions. Ensure that the policy includes both collection- and index-level permissions for the Migration Assistant role.

#### Bulk indexing returns 413: Request too large

OpenSearch Serverless has a 10-MB request payload limit. If your documents are large, reduce the bulk batch size in the workflow configuration:

```json
"documentBackfillConfig": {
  "podReplicas": 4,
  "maxBulkSizeBytes": 5242880
}
```
{% include copy.html %}



## Related documentation

For more information, see the following resources:

- [Is Migration Assistant right for you?]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
- [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/)
- [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/)
- [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Removing Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/)
- [Elasticsearch 6.8 → OpenSearch 3.5 playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/)
- [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/)
