---
layout: default
title: "Amazon OpenSearch Service → Amazon OpenSearch Serverless"
nav_order: 2
parent: Playbooks
permalink: /migration-assistant/playbook-amazon-opensearch-service-to-serverless/
---

# Playbook: Amazon OpenSearch Service to Amazon OpenSearch Serverless (vector search)

This playbook walks through migrating an Amazon OpenSearch Service domain running Elasticsearch 7.10 to an Amazon OpenSearch Serverless vector search collection using Migration Assistant. Every command is copy-paste ready for the following example environment:

The account IDs, domain names, and endpoints in this playbook are examples. Replace them with your own values.
{: .note }

| Setting | Value |
|---------|-------|
| AWS account | `111122223333` |
| Region | `us-east-2` |
| IAM role | Admin |
| Source | Amazon OpenSearch Service domain (`my-source-domain`, Elasticsearch 7.10) |
| Target | Amazon OpenSearch Serverless collection (`my-target-collection`, VECTORSEARCH) |
| Deployment | "Launch into existing VPC" CloudFormation template |
| Stage | `dev` |

If your environment differs, replace the preceding values in every command.

### Why OpenSearch Serverless vector search
OpenSearch Serverless with the VECTORSEARCH collection type gives you:

- **No cluster management** — no nodes to size, patch, or scale. AWS manages capacity automatically.
- **Built-in vector engine** — purpose-built for k-NN search, semantic search, and RAG (retrieval-augmented generation) workloads.
- **Pay-per-use pricing** — OCU-based billing means you pay for what you use, not for idle capacity.
- **Automatic scaling** — scales indexing and search capacity independently based on demand.
- **Built-in encryption and access control** — encryption at rest, in transit, and fine-grained data access policies without managing security plugins.

If you are running vector/k-NN workloads on a managed OpenSearch Service domain today, Serverless eliminates the operational overhead of right-sizing instances for vector workloads, which are memory- and compute-intensive.
{: .note }

### Key differences from managed OpenSearch Service

Before migrating, understand these Serverless limitations:

| Feature | Managed OpenSearch Service | OpenSearch Serverless |
|---------|---------------------------|----------------------|
| Cluster settings | Full `_cluster/settings` API | Not supported |
| Snapshot/restore | Supported | Not supported (use Migration Assistant backfill) |
| ISM/ILM policies | Supported | Not supported |
| Ingest pipelines | Supported | Not supported |
| Custom plugins | Supported | Not supported |
| Security model | Fine-grained access control (FGAC) | Data access policies (IAM-based) |
| Authentication | Basic auth, SAML, IAM | IAM AWS Signature Version 4 only |
| Index templates | Supported | Supported (with limitations) |
| Aliases | Supported | Supported |
| Max index size | No hard limit | 1 TB per index |

Migration Assistant handles the data migration (metadata + documents + live traffic). You must manually recreate ISM policies, ingest pipelines, and dashboards on the target after migration.
{: .warning }

### Estimated timing

| Phase | Duration |
|-------|----------|
| Prerequisites (AOSS collection, policies, IAM, VPC peering) | 15–20 min |
| Step 3: Deploy Migration Assistant (CFN + Helm) | 15–25 min |
| Steps 4–9: Configure and test connectivity | 5–10 min |
| Step 10: Pilot migration (small index) | 15–20 min |
| Step 11: Full migration with CDC | 20–30 min + replay catch-up time |
| Total end-to-end | ~90 min for a small cluster |

---

## Before you start

Before starting the migration, verify the prerequisites in the following sections.

### Source cluster requirements

Your Amazon OpenSearch Service domain must meet all of the following before you begin:

- The domain is running Elasticsearch 7.10 (or any [supported source version]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)).
- The domain is in a VPC and reachable from the VPC you will deploy Migration Assistant into.
- You know the domain's VPC endpoint (for example, `https://vpc-my-source-domain-abc123example.us-east-2.es.amazonaws.com`).
- If fine-grained access control (FGAC) is enabled, you will map the Migration Assistant IAM role as a `master user`.

Confirm the source domain details:

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

You need an OpenSearch Serverless collection with:

- **Type**: VECTORSEARCH (or SEARCH/TIMESERIES depending on your workload)
- **Encryption policy**: At least one encryption policy covering the collection
- **Network policy**: Public or VPC access depending on your needs
- **Data access policy**: Granting the Migration Assistant IAM role full index read/write access

If you already have a collection, skip to [Map the Migration Assistant IAM role](#map-the-migration-assistant-iam-role). Otherwise, create one now.

#### Create the encryption policy

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

#### Create the network policy

For this playbook, we use public access. For production, consider VPC access.

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

#### Create the data access policy

This grants the account root, Admin role, and (later) the Migration Assistant roles access to the collection:

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

#### Create the collection

```bash
aws opensearchserverless create-collection \
  --region us-east-2 \
  --name my-target-collection \
  --type VECTORSEARCH
```
{% include copy.html %}

Wait for the collection to become ACTIVE (typically 2–3 minutes):

```bash
watch -n 10 "aws opensearchserverless batch-get-collection \
  --region us-east-2 \
  --names my-target-collection \
  --query 'collectionDetails[0].{Status:status,Endpoint:collectionEndpoint}' \
  --output table"
```
{% include copy.html %}

When `Status` shows `ACTIVE`, record the endpoint. For this playbook:

```
https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com
```

#### Verify you can reach the collection

```bash
awscurl --service aoss --region us-east-2 \
  "https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com/"
```
{% include copy.html %}

If you do not have `awscurl`, install it with `pip install awscurl`. You should see a JSON response with the OpenSearch version.

### Infrastructure requirements

- You have the VPC ID and at least two subnet IDs (each in a different Availability Zone) for the VPC where the source domain lives.
- The subnets have NAT gateway access (or you will use the `--create-vpc-endpoints` flag).
- You have AWS CLI 2.x and `kubectl` installed, or you are using AWS CloudShell.
- Your AWS credentials have Admin permissions in account `111122223333`.

If any item above is not ready, stop and prepare it first.
{: .warning }

---

## Step 1: Choose the migration style

Pick one path before you do anything else.

### Option A: Planned downtime (simplest)

1. Stop writes to the source domain.
2. Take a snapshot.
3. Migrate metadata.
4. Backfill documents.
5. Validate the target.
6. Point clients to the Serverless collection endpoint.

If you are not sure which option to choose, choose **planned downtime**. It is the safest and easiest path for a first migration.
{: .note }

### Option B: Zero downtime

1. Start capture first.
2. Route clients to the capture proxy.
3. Take a snapshot.
4. Migrate metadata.
5. Backfill documents.
6. Replay captured traffic until the target catches up.
7. Validate the target.
8. Switch clients to the Serverless collection endpoint.

If you choose this path, your clients must send **explicit document IDs** for index and update operations. If your application depends on auto-generated IDs, do not use Capture and Replay.
{: .warning }

---

## Step 2: Gather your VPC information

This step gathers the VPC and subnet information that the Migration Assistant deployment will reuse.

### Find the source domain's VPC

```bash
aws opensearch describe-domain \
  --region us-east-2 \
  --domain-name my-source-domain \
  --query 'DomainStatus.VPCOptions.{VPCId:VPCId,SubnetIds:SubnetIds,SecurityGroupIds:SecurityGroupIds}' \
  --output json
```
{% include copy.html %}

Record the VPC ID (`vpc-009ea0f461cc426c6`) and subnet IDs.

### Find subnet details

```bash
aws ec2 describe-subnets \
  --region us-east-2 \
  --filters "Name=vpc-id,Values=vpc-009ea0f461cc426c6" \
  --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,CidrBlock:CidrBlock,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table
```
{% include copy.html %}

Pick at least two private subnets, each in a different Availability Zone. Record them as a comma-separated string.

You can deploy Migration Assistant into the **same VPC** as the source domain (simplest) or into a **different VPC** with VPC peering. If you deploy into a different VPC, see the [VPC peering section](#source-and-target-are-in-different-vpcs) in Troubleshooting.
{: .note }

---

## Step 3: Deploy Migration Assistant on EKS

This step deploys Migration Assistant on Amazon EKS using the bootstrap script.

### Download the bootstrap script

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

### Run the bootstrap script

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

This deploys a CloudFormation stack that creates an EKS cluster, ECR repository, IAM roles, and then installs the Migration Assistant Helm chart. The deployment takes approximately 15–25 minutes.

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

### Verify the deployment

```bash
aws eks update-kubeconfig --region us-east-2 --name migration-eks-cluster-dev-us-east-2
kubectl get pods -n ma
```
{% include copy.html %}

All pods should show `Running` with `1/1` ready.

---

## Step 4: Confirm CloudFormation outputs

```bash
aws cloudformation describe-stacks \
  --region us-east-2 \
  --stack-name MA \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

Key values:

| Variable | Expected value |
|----------|---------------|
| `MIGRATIONS_EKS_CLUSTER_NAME` | `migration-eks-cluster-dev-us-east-2` |
| `SNAPSHOT_ROLE` | `arn:aws:iam::111122223333:role/migration-eks-cluster-dev-us-east-2-snapshot-role` |
| `EKS_CLUSTER_SECURITY_GROUP` | The security group ID for the new EKS cluster |

The default S3 bucket is `s3://migrations-default-111122223333-dev-us-east-2`.

---

## Step 5: Map the Migration Assistant IAM role
{:#map-the-migration-assistant-iam-role}

### Update the AOSS data access policy

After deploying Migration Assistant, add the migrations role and snapshot role to the AOSS data access policy:

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

### Map the Migration Assistant role as `master user` on the source domain

If the source domain has fine-grained access control (FGAC) enabled, the Migration Assistant role must be mapped as a `master user`:

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

This replaces any existing `master user`. If you need to preserve an existing `master user`, map the Migration Assistant role to the `all_access` backend role through the OpenSearch Security API instead.
{: .warning }

---

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

The target is an OpenSearch Serverless collection with public network access, so no security group rule is needed for the target. If you configured VPC access on the collection, add a rule for the collection's VPC endpoint security group as well.
{: .note }

---

## Step 7: Connect to the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Check the installed version:

```bash
console --version
```
{% include copy.html %}

Expected output: `Migration Assistant 3.1.1` (or later).

### Register the S3 snapshot repository on the source domain

Amazon OpenSearch Service requires a snapshot role to write to S3. Register the repository using the snapshot role from the CloudFormation outputs:

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

Unlike self-managed Elasticsearch, Amazon OpenSearch Service uses an IAM `role_arn` for S3 access instead of keystore credentials. The snapshot role must have a trust policy that allows the OpenSearch Service principal (`es.amazonaws.com`) to assume it.
{: .note }

---

## Step 8: Build the workflow configuration

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Replace the contents with:

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

| Placeholder | Example value |
|-------------|---------------|
| `<PILOT_INDEX_NAME>` | `test-index` (pick one small, noncritical index) |

Key differences from domain-to-domain migrations:

- **Source** uses `sigv4` with `service: "es"` — Amazon OpenSearch Service uses IAM authentication, not basic auth.
- **Target** uses `sigv4` with `service: "aoss"` — OpenSearch Serverless requires the `aoss` service name for AWS Signature Version 4 signing.
- **`s3RoleArn`** is required — Amazon OpenSearch Service needs an IAM role to write snapshots to S3 (unlike self-managed Elasticsearch which uses keystore credentials).
- **No `multiTypeBehavior`** — Elasticsearch 7.10 already uses single-type indexes, so no type mapping transformation is needed.

Verify the configuration:

```bash
workflow configure view
```
{% include copy.html %}

---

## Step 9: Test connectivity

```bash
console clusters connection-check
```
{% include copy.html %}

Both source and target should show `Successfully connected!`.

If the source returns a connection timeout, verify:
1. Migration Assistant is deployed in the same VPC as the source domain (or VPC peering is configured).
2. The source domain's security group allows inbound TCP 443 from the MA EKS security group.

If the target returns 403, verify:
1. The AOSS data access policy includes the Migration Assistant migrations role.
2. The network policy allows access from the Migration Assistant pods.

You can also test manually:

```bash
console clusters curl source /
console clusters curl target /
```
{% include copy.html %}

---

## Step 10: Run a pilot migration

Do **not** start with every index. Run a pilot on one small index first.

### Submit the workflow

```bash
workflow submit
workflow manage
```
{% include copy.html %}

The `workflow manage` command opens an interactive TUI. Use it to watch progress, view logs, and approve gates.

### Approve gates

When the workflow pauses at an approval gate (shown as `⟳`), review the output and approve:

```bash
# Approve metadata evaluation
workflow approve step "*.evaluatemetadata"

# Approve metadata migration
workflow approve step "*.migratemetadata"
```
{% include copy.html %}

Gate names are **lowercase**. You can also approve from within the `workflow manage` TUI.
{: .note }

### Verify the pilot on the target

After the workflow completes, verify metadata and documents:

```bash
console clusters curl target /_cat/indexes?v
console clusters curl target /<PILOT_INDEX_NAME>/_mapping
console clusters curl target /<PILOT_INDEX_NAME>/_count
console clusters curl target /<PILOT_INDEX_NAME>/_search?size=5&pretty
```
{% include copy.html %}

Compare document counts between source and target. They should match.

If the pilot fails, edit the config and resubmit:

```bash
workflow configure edit
workflow submit
workflow manage
```
{% include copy.html %}

Do not start the full migration until the pilot looks clean.
{: .note }

---

## Step 11: Run the full migration

Edit the configuration to widen the allowlist:

```bash
workflow configure edit
```
{% include copy.html %}

Change the `indexAllowlist` to migrate all indexes:

```json
"metadataMigrationConfig": {
  "indexAllowlist": []
}
```

An empty `indexAllowlist` means "migrate all indexes".

Also update the `createSnapshotConfig`:

```json
"createSnapshotConfig": {
  "indexAllowlist": [],
  "includeGlobalState": true
}
```

### Planned downtime path

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
   console clusters curl target /_cat/indexes?v
   console clusters curl target /_cat/aliases?v
   ```
   {% include copy.html %}

5. Recreate items that Migration Assistant does not migrate: ISM/ILM policies, ingest pipelines, dashboards, cluster settings. These are **not supported** on OpenSearch Serverless — evaluate whether your workload depends on them.
6. Point clients to the Serverless collection endpoint: `https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com`.
7. Update client authentication from basic auth or IAM AWS Signature Version 4 with `service: es` to IAM AWS Signature Version 4 with `service: aoss`.

### Zero-downtime path

Add a `traffic` section to your configuration:

```bash
workflow configure edit
```
{% include copy.html %}

Add this block at the top level alongside `sourceClusters`, `targetClusters`, and `snapshotMigrationConfigs`:

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

Also widen the `indexAllowlist` to migrate all indexes:

```json
"metadataMigrationConfig": {
  "indexAllowlist": []
}
```

Submit the workflow:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

The workflow creates five parallel tracks: Kafka cluster, capture proxy, snapshot, snapshot migration, and Traffic Replayer. The snapshot waits for the capture proxy to be ready before proceeding.

#### Find the capture proxy endpoint

The capture proxy uses the source domain's port (443 for Amazon OpenSearch Service):

```bash
kubectl get svc capture -n ma
```
{% include copy.html %}

The `EXTERNAL-IP` column shows the NLB endpoint. Redirect your application clients to this endpoint.

The capture proxy forwards all requests to the source domain and simultaneously records them to Kafka for replay. The proxy uses AWS Signature Version 4 to authenticate to the source, so your clients can continue using their existing authentication method.
{: .note }

#### Approve gates

```bash
workflow approve step "*.evaluatemetadata"
workflow approve step "*.migratemetadata"
```
{% include copy.html %}

#### Monitor replay progress

After backfill completes, the Replayer starts processing captured traffic:

```bash
kubectl logs deployment/capture-target-replay -n ma --tail=5
```
{% include copy.html %}

Look for the `ReplayHeartbeat` line:

```
ReplayHeartbeat - tasksOutstanding=437 schedulingLag=1s lastCompletedSourceTime=2026-05-03T16:01:16.565Z targetResponses={}
```

| Field | Meaning |
|-------|---------|
| `tasksOutstanding` | Captured requests still being replayed. Should decrease toward 0. |
| `lastCompletedSourceTime` | Timestamp of the most recently replayed request. Should approach current time. |
| `targetResponses` | HTTP response codes from the target. Empty `{}` means no write requests replayed yet. |
| `schedulingLag` | How far behind the Replayer is. Should be close to 0 when caught up. |

#### Verify document counts converge

```bash
console clusters curl source /_cat/indexes?v
console clusters curl target /_cat/indexes?v
```
{% include copy.html %}

When the Replayer has caught up, document counts on the target should match the source.

#### Switch traffic to the target

When you are satisfied that the target is caught up and validated, switch your application clients from the capture proxy to the Serverless collection endpoint directly:

```
https://3nbrhts7rv9jxatilz9e.us-east-2.aoss.amazonaws.com
```

Update your client's AWS Signature Version 4 signing from `service: es` to `service: aoss`.

---

## Step 12: Keep the source available as a fallback

Do not delete the source domain immediately after cutover. Keep it available for at least 24 to 72 hours while you watch target collection health, application error rates, and operational tooling.

---

## Step 13: Remove migration infrastructure

Before removing Migration Assistant, confirm all of the following:

1. All client traffic is pointing directly at the Serverless collection — not at the capture proxy.
2. The capture proxy and Replayer are no longer needed.
3. You have kept the source domain available as a fallback for at least 24–72 hours.
4. Target collection is healthy and application error rates are normal.

If any client is still sending traffic to the capture proxy endpoint, that traffic will be lost when you remove Migration Assistant. Verify that all clients have been redirected to the target before proceeding.
{: .warning }

### Remove the Helm release and namespace

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma --timeout=120s
```
{% include copy.html %}

### Delete the CloudFormation stack

```bash
aws cloudformation delete-stack --region us-east-2 --stack-name MA
aws cloudformation wait stack-delete-complete --region us-east-2 --stack-name MA
```
{% include copy.html %}

This deletes the EKS cluster, ECR repository, IAM roles, and VPC endpoints created by Migration Assistant. It does **not** delete the source domain, the Serverless collection, or the S3 snapshot bucket.

### Optional: Delete the snapshot bucket

```bash
aws s3 rb s3://migrations-default-111122223333-dev-us-east-2 --force
```
{% include copy.html %}

### Optional: Delete the AOSS collection

If you created the collection for testing and no longer need it:

```bash
aws opensearchserverless delete-collection \
  --region us-east-2 \
  --id 3nbrhts7rv9jxatilz9e
```
{% include copy.html %}

Then clean up the policies:

```bash
aws opensearchserverless delete-access-policy \
  --region us-east-2 --name vector-search-access --type data

aws opensearchserverless delete-security-policy \
  --region us-east-2 --name vector-search-net --type network

aws opensearchserverless delete-security-policy \
  --region us-east-2 --name vector-search-enc --type encryption
```
{% include copy.html %}

---

## Validation

After the workflow completes, validate the migration at three levels.

### Level 1: Document count comparison

Compare document counts between source and target for every user index:

```bash
console clusters curl source /_cat/indexes?v
console clusters curl target /_cat/indexes?v
```
{% include copy.html %}

For each user index, verify the count matches:

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

Wait a few seconds, then get the results:

```bash
aws logs get-query-results --region us-east-2 --query-id <QUERY_ID>
```
{% include copy.html %}

Investigate mismatches that involve `POST` or `PUT` methods — those are write operations where a mismatch could indicate data loss.

### Level 3: Sample query comparison

Run a representative query on both clusters and compare results:

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

---

## Troubleshooting

This section covers common troubleshooting symptoms and resolutions.

### Target returns 403 forbidden

The Migration Assistant IAM role is not included in the AOSS data access policy. Update the policy:

```bash
POLICY_VERSION=$(aws opensearchserverless get-access-policy \
  --region us-east-2 --name vector-search-access --type data \
  --query 'accessPolicyDetail.policyVersion' --output text)

echo "Current policy version: $POLICY_VERSION"
```
{% include copy.html %}

Then re-run the `update-access-policy` command from Step 5 with the correct policy version.

### Source returns connection timeout

1. Verify Migration Assistant is in the same VPC as the source domain:

   ```bash
   aws eks describe-cluster \
     --region us-east-2 \
     --name migration-eks-cluster-dev-us-east-2 \
     --query 'cluster.resourcesVpcConfig.vpcId' \
     --output text
   ```
   {% include copy.html %}

2. Verify the source domain's security group allows the MA EKS security group on port 443.

### Source and target are in different VPCs

If Migration Assistant is in a different VPC than the source domain, create VPC peering:

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

Then add the MA EKS security group to the source domain's security group inbound rules (Step 6). Use the MA VPC CIDR instead of a security group reference since cross-VPC SG references require the peering connection.

### Snapshot repository registration fails

For Amazon OpenSearch Service, the snapshot role must:
1. Have an IAM policy allowing `s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` on the snapshot bucket.
2. Have a trust policy allowing `es.amazonaws.com` to assume it.
3. Be passed to the `_snapshot` API through the `role_arn` setting.

Verify the snapshot role trust policy:

```bash
aws iam get-role \
  --role-name migration-eks-cluster-dev-us-east-2-snapshot-role \
  --query 'Role.AssumeRolePolicyDocument' \
  --output json
```
{% include copy.html %}

### Workflow hits a "consistency guard" error on resubmit

Delete stale custom resources before resubmitting:

```bash
kubectl delete snapshotmigration --all -n ma
kubectl delete datasnapshot --all -n ma
kubectl delete capturedtraffic --all -n ma
kubectl delete captureproxy --all -n ma
kubectl delete trafficreplay --all -n ma
kubectl delete kafkacluster --all -n ma
```
{% include copy.html %}

Then resubmit:

```bash
workflow submit
```
{% include copy.html %}

### AOSS-specific errors

This section covers common aoss-specific errors symptoms and resolutions.

#### Index-not-found exception on the target

OpenSearch Serverless does not support the `_cluster/settings` API or automatic index creation through templates in the same way as managed OpenSearch. Verify that metadata migration completed successfully before backfill:

```bash
console clusters curl target /_cat/indexes?v
```
{% include copy.html %}

#### Security exception with a permissions error

The AOSS data access policy is missing permissions. Ensure the policy includes both `collection` and `index` level permissions for the Migration Assistant role.

#### Bulk indexing returns 413 request too large

OpenSearch Serverless has a 10 MB request payload limit. If your documents are large, reduce the bulk batch size in the workflow configuration:

```json
"documentBackfillConfig": {
  "podReplicas": 4,
  "maxBulkSizeBytes": 5242880
}
```

---

## Reconnecting to the Migration Console

```bash
aws eks update-kubeconfig --region us-east-2 --name migration-eks-cluster-dev-us-east-2
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

---

## Quick reference

| Command | Purpose |
|---------|---------|
| `console --version` | Check installed version |
| `console clusters connection-check` | Test connectivity to source and target |
| `console clusters curl source /<path>` | HTTP request to source domain |
| `console clusters curl target /<path>` | HTTP request to target collection |
| `workflow configure sample --load` | Load sample config as starting point |
| `workflow configure edit` | Edit the workflow configuration |
| `workflow configure view` | Display current configuration |
| `workflow submit` | Submit the workflow |
| `workflow manage` | Interactive TUI for monitoring and approvals |
| `workflow status` | Show workflow progress |
| `workflow approve step <step>` | Approve a blocked step |
| `workflow log all` | View workflow logs |

---

## See also

- [Is Migration Assistant right for you?]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
- [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/)
- [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/)
- [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Removing Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/)
- [Elasticsearch 6.8 → OpenSearch 3.5 playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/)
