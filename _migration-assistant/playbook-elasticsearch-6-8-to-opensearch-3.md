---
layout: default
title: "Elasticsearch 6.8 → OpenSearch 3.5"
nav_order: 1
parent: Playbooks
permalink: /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-Kubernetes/
---

# Playbook: Elasticsearch 6.8 to OpenSearch 3.5 on EKS (existing VPC)

This playbook turns a common AWS migration pattern into one concrete runbook: moving from a self-managed Elasticsearch 6.8 cluster running on Amazon Elastic Kubernetes Service (EKS) to Amazon OpenSearch Service 3.5, with Migration Assistant deployed into an existing virtual private cloud (VPC).

This pattern applies when migrating from a self-managed search cluster with self-managed plugins, self-signed certificates, and application-owned credentials to a managed target with VPC isolation, AWS Identity and Access Management (IAM)-based access, and reduced ongoing maintenance.

The playbook is intentionally end-to-end. It includes source preparation, EKS deployment, workflow configuration, pilot migration, full migration, validation, cutover, and removal.

## Example placeholders

Replace the following placeholders with values from your environment.

| Placeholder | Meaning |
|:------------|:--------|
| `<ACCOUNT_ID>` | AWS account ID hosting the migration environment |
| `<REGION>` | AWS Region such as `us-east-2` |
| `<STAGE>` | Deployment label such as `dev` or `prod` |
| `<YOUR_VPC_ID>` | Existing VPC where Migration Assistant is deployed |
| `<SUBNET_1>,<SUBNET_2>` | At least two subnets in different Availability Zones |
| `<SOURCE_ENDPOINT>` | Elasticsearch endpoint or Network Load Balancer DNS name |
| `<TARGET_DOMAIN_NAME>` | OpenSearch Service domain name |
| `<TARGET_DOMAIN_ENDPOINT>` | OpenSearch Service domain endpoint |
| `<PILOT_INDEX_NAME>` | A small noncritical index for the pilot run |

## Estimated timing

The following table provides estimated durations for each phase of the migration.

| Phase | Typical duration |
|:------|:-----------------|
| Source preparation (plugin, S3 access, snapshot repo) | 15 to 25 minutes |
| Deploy Migration Assistant on EKS | 15 to 25 minutes |
| Build configuration and test connectivity | 5 to 10 minutes |
| Pilot migration | 15 to 20 minutes |
| Full backfill-only migration | Depends on data size and target ingest capacity |
| Full zero-downtime migration | Backfill duration plus replay catch-up time |

For zero-downtime migrations, replay duration depends on the volume of traffic accumulated during backfill and the `speedupFactor` configured for the Replayer. A typical starting value is `1.5` to `2.0`. Monitor the target cluster to confirm it can sustain the replay rate.

## Before you start

In addition to the [general playbook prerequisites]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/), verify the following before starting the migration. If your environment differs, adjust the network and identity configuration accordingly.

### Source cluster requirements

Your source cluster must meet all of the following requirements:

- It is reachable from the VPC where Migration Assistant runs.
- You know the source endpoint.
- You know the source authentication method.
- It can write snapshots to Amazon S3.
- It contains the `repository-s3` plugin.

If the source uses self-signed certificates, plan to set `allowInsecure: true` in the workflow configuration.

### Target cluster requirements

Your Amazon OpenSearch Service 3.5 domain must meet all of the following requirements:

- It already exists.
- It is reachable from the same VPC, or routable from that VPC.
- You know the domain endpoint.
- If fine-grained access control is enabled, the Migration Assistant IAM role is mapped with sufficient permissions.

### Infrastructure requirements

The following infrastructure is required:

- An existing VPC ID.
- At least two subnets in different Availability Zones.
- AWS CLI v2 and `kubectl`, or AWS CloudShell.
- Permissions to deploy EKS, AWS CloudFormation, IAM, S3, and OpenSearch resources.

## Step 1: Choose the migration style

Select one of the following migration approaches before configuring the workflow.

### Option A: Planned downtime

For a planned downtime migration, follow these steps:

1. Pause writes to Elasticsearch.
2. Create a snapshot.
3. Migrate metadata.
4. Backfill documents.
5. Validate the target.
6. Point clients to OpenSearch.

If you are unsure which approach to select, use planned downtime because it involves fewer components and lower risk.
{: .note }

### Option B: Zero downtime

For a zero-downtime migration, follow these steps:

1. Start the capture.
2. Route clients to the capture proxy.
3. Create a snapshot.
4. Migrate metadata.
5. Backfill documents.
6. Replay captured traffic until the target catches up.
7. Validate the target.
8. Switch clients to OpenSearch.

If your application depends on auto-generated document IDs, test Capture and Replay thoroughly before selecting the zero-downtime approach. Auto-generated IDs are not preserved during replay.

## Step 2: Prepare the source cluster

Prepare the source cluster, including installing the `repository-s3` plugin and registering a snapshot repository.

### Install the repository-s3 plugin

Migration Assistant uses snapshots for backfill, so the source must support S3 snapshots. For general information about the `repository-s3` plugin, see [Snapshot and restore]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3).

Verify the current plugin state:

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> https://<SOURCE_ENDPOINT>:9200/_cat/plugins?v
```
{% include copy.html %}

If `repository-s3` is missing and your source is running in Kubernetes, a common pattern is to install it using an init container so it persists across pod restarts:

```bash
kubectl patch statefulset elasticsearch-master -n elasticsearch --type=strategic -p '{
  "spec": {
    "template": {
      "spec": {
        "initContainers": [
          {
            "name": "install-plugins",
            "image": "docker.elastic.co/elasticsearch/elasticsearch:6.8.22",
            "command": ["sh", "-c", "bin/elasticsearch-plugin install --batch repository-s3 && cp -r /usr/share/elasticsearch/plugins/* /plugins/"],
            "volumeMounts": [{"name": "plugins", "mountPath": "/plugins"}]
          }
        ],
        "containers": [
          {
            "name": "elasticsearch",
            "volumeMounts": [
              {"name": "plugins", "mountPath": "/usr/share/elasticsearch/plugins"}
            ]
          }
        ],
        "volumes": [
          {"name": "plugins", "emptyDir": {}}
        ]
      }
    }
  }
}'
```
{% include copy.html %}

Then wait for the rollout:

```bash
kubectl rollout status statefulset/elasticsearch-master -n elasticsearch --timeout=300s
```
{% include copy.html %}

Verify that the plugin is loaded:

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> https://<SOURCE_ENDPOINT>:9200/_cat/plugins?v
```
{% include copy.html %}

### Grant S3 access to the source cluster

The source cluster needs AWS credentials to write snapshots.

For a self-managed Elasticsearch cluster in EKS, configure S3 access by performing the following steps:

1. Add an inline S3 policy to the IAM role:

   ```bash
   aws iam put-role-policy \
     --role-name <ES_EKS_NODE_ROLE_NAME> \
     --policy-name es-snapshot-s3-access \
     --policy-document '{
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
           "Resource": "arn:aws:s3:::migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>"
         },
         {
           "Effect": "Allow",
           "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
           "Resource": "arn:aws:s3:::migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>/*"
         }
       ]
     }'
   ```
   {% include copy.html %}

1. Create a temporary helper pod:

   ```bash
   kubectl apply -f - <<'EOF'
   apiVersion: v1
   kind: Pod
   metadata:
     name: creds-helper
     namespace: elasticsearch
   spec:
     hostNetwork: true
     containers:
     - name: helper
       image: amazon/aws-cli:latest
       command: ["sh", "-c", "sleep 300"]
     restartPolicy: Never
   EOF

   kubectl wait --for=condition=ready pod/creds-helper -n elasticsearch --timeout=60s
   ```
   {% include copy.html %}

1. Extract the temporary credentials:

   ```bash
   ACCESS_KEY=$(kubectl exec creds-helper -n elasticsearch -- \
     sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"AccessKeyId\"])"')

   SECRET_KEY=$(kubectl exec creds-helper -n elasticsearch -- \
     sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"SecretAccessKey\"])"')

   SESSION_TOKEN=$(kubectl exec creds-helper -n elasticsearch -- \
     sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"Token\"])"')
   ```
   {% include copy.html %}

1. Load the credentials into the Elasticsearch keystore on each pod:

   ```bash
   for pod in elasticsearch-master-0 elasticsearch-master-1 elasticsearch-master-2; do
     kubectl exec $pod -n elasticsearch -c elasticsearch -- \
       sh -c "echo '${ACCESS_KEY}' | bin/elasticsearch-keystore add -f s3.client.default.access_key"
     kubectl exec $pod -n elasticsearch -c elasticsearch -- \
       sh -c "echo '${SECRET_KEY}' | bin/elasticsearch-keystore add -f s3.client.default.secret_key"
     kubectl exec $pod -n elasticsearch -c elasticsearch -- \
       sh -c "echo '${SESSION_TOKEN}' | bin/elasticsearch-keystore add -f s3.client.default.session_token"
   done
   ```
   {% include copy.html %}

1. Reload the secure settings:

   ```bash
   curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
     "https://<SOURCE_ENDPOINT>:9200/_nodes/reload_secure_settings"
   ```
   {% include copy.html %}

1. Remove the helper pod:

   ```bash
   kubectl delete pod creds-helper -n elasticsearch --force
   ```
   {% include copy.html %}

For permanent production setups, prefer a durable identity approach for the source cluster rather than temporary credential injection.
{: .note }

### Register a snapshot repository

Register a repository on the source cluster with a dedicated `base_path` for this migration:

```bash
curl -sk -X PUT -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_snapshot/migration-repo" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "s3",
    "settings": {
      "bucket": "migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>",
      "region": "<REGION>",
      "base_path": "es68-snapshots"
    }
  }'
```
{% include copy.html %}

Verify the repository:

```bash
curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_snapshot/migration-repo/_verify?pretty"
```
{% include copy.html %}

Although the workflow supports externally managed snapshots, the recommended approach for production migrations is to let Migration Assistant create the snapshot. This ensures that snapshot creation, metadata migration, and backfill remain in a single repeatable workflow with consistent approval, validation, and recovery steps. Externally managed snapshots are appropriate for test migrations, troubleshooting, or recovery scenarios.
{: .note }

## Step 3: Gather your VPC information

Find your VPC:

```bash
aws ec2 describe-vpcs \
  --region <REGION> \
  --query "Vpcs[*].{VpcId:VpcId,Name:Tags[?Key=='Name']|[0].Value,CidrBlock:CidrBlock}" \
  --output table
```
{% include copy.html %}

To find the subnets in the VPC, run the following command:

```bash
aws ec2 describe-subnets \
  --region <REGION> \
  --filters "Name=vpc-id,Values=<YOUR_VPC_ID>" \
  --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,CidrBlock:CidrBlock,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table
```
{% include copy.html %}

Choose at least two subnets in different Availability Zones.

## Step 4: Deploy Migration Assistant on EKS

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

Deploy Migration Assistant into the existing VPC:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage <STAGE> \
  --vpc-id <YOUR_VPC_ID> \
  --subnet-ids <SUBNET_1>,<SUBNET_2> \
  --region <REGION>
```
{% include copy.html %}

<details markdown="block">
<summary><strong>For isolated subnets</strong></summary>

If the subnets do not have direct internet egress, add the VPC endpoint flag:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage <STAGE> \
  --vpc-id <YOUR_VPC_ID> \
  --subnet-ids <SUBNET_1>,<SUBNET_2> \
  --create-vpc-endpoints \
  --region <REGION>
```
{% include copy.html %}

</details>

Verify the deployment:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
kubectl get pods -n ma
```
{% include copy.html %}

All core pods should be running.

## Step 5: Confirm outputs and map target access

Read the CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --region <REGION> \
  --stack-name MA \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

The output contains the following values:

- The EKS cluster name
- The snapshot role ARN
- The migration IAM role information
- The EKS cluster security group

If your target domain uses fine-grained access control, map the Migration Assistant IAM role with sufficient permissions. One option is to set it as the `MasterUserARN`:

```bash
aws opensearch update-domain-config \
  --region <REGION> \
  --domain-name <TARGET_DOMAIN_NAME> \
  --advanced-security-options '{
    "Enabled": true,
    "MasterUserOptions": {
      "MasterUserARN": "arn:aws:iam::<ACCOUNT_ID>:role/migration-eks-cluster-<STAGE>-<REGION>-migrations-role"
    }
  }'
```
{% include copy.html %}

Wait until domain processing returns `false` before continuing. To verify the status, run the following command:

```bash
aws opensearch describe-domain \
  --region <REGION> \
  --domain-name <TARGET_DOMAIN_NAME> \
  --query "DomainStatus.Processing"
```
{% include copy.html %}

To preserve an existing `MasterUserARN` configuration, map the role to an appropriate backend role instead of replacing it.
{: .warning }

## Step 6: Allow network access

Find the EKS cluster security group:

```bash
aws eks describe-cluster \
  --region <REGION> \
  --name migration-eks-cluster-<STAGE>-<REGION> \
  --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" \
  --output text
```
{% include copy.html %}

Then add inbound rules so Migration Assistant can reach the source and target clusters:

```bash
aws ec2 authorize-security-group-ingress \
  --region <REGION> \
  --group-id <SOURCE_CLUSTER_SG> \
  --protocol tcp \
  --port 9200 \
  --source-group <MA_EKS_CLUSTER_SG>

aws ec2 authorize-security-group-ingress \
  --region <REGION> \
  --group-id <TARGET_DOMAIN_SG> \
  --protocol tcp \
  --port 443 \
  --source-group <MA_EKS_CLUSTER_SG>
```
{% include copy.html %}

If the source and target clusters are in different VPCs, verify that routing and security policies allow cross-VPC communication.

## Step 7: Connect to the Migration Console and create secrets

Open the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Verify the installed version:

```bash
console --version
```
{% include copy.html %}

If the source uses basic authentication, create the Kubernetes secret:

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<SOURCE_USERNAME> \
  --from-literal=password='<SOURCE_PASSWORD>' \
  -n ma
```
{% include copy.html %}

For an OpenSearch Service target using AWS Signature Version 4, you do not need a target credential secret. The Migration Assistant pods use AWS identity.

## Step 8: Build the pilot workflow configuration

Start from the current schema sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

For an interactive reference of all available fields, their types, defaults, and descriptions, see the [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/).

Use a pilot configuration similar to the following:

```json
{
  "sourceClusters": {
    "source": {
      "endpoint": "https://<SOURCE_ENDPOINT>:9200",
      "allowInsecure": true,
      "version": "ES 6.8",
      "authConfig": {
        "basic": {
          "secretName": "source-credentials"
        }
      },
      "snapshotInfo": {
        "repos": {
          "migration-repo": {
            "awsRegion": "<REGION>",
            "s3RepoPathUri": "s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>/es68-snapshots"
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
      "endpoint": "https://<TARGET_DOMAIN_ENDPOINT>",
      "authConfig": {
        "sigv4": {
          "region": "<REGION>",
          "service": "es"
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
              "indexAllowlist": ["<PILOT_INDEX_NAME>"],
              "multiTypeBehavior": "UNION"
            },
            "documentBackfillConfig": {
              "indexAllowlist": ["<PILOT_INDEX_NAME>"],
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

The following are notable configuration details in this example:

- The source uses HTTPS with `allowInsecure: true` because self-managed Elasticsearch on EKS often uses self-signed certificates.
- The source version is `ES 6.8`.
- The target uses AWS Signature Version 4 with service `es`.
- The `multiTypeBehavior` set to `UNION` is a practical starting point for Elasticsearch 6.8 sources.
- The pilot limits snapshot creation, metadata migration, and backfill to one small index.

## Step 9: Test connectivity

Run the built-in connectivity tests:

```bash
console clusters connection-check
console clusters curl source /
console clusters curl target /
```
{% include copy.html %}

Both source and target cluster should connect successfully. If the target cluster returns a `403`, then the target IAM mapping has not completed.

## Step 10: Run the pilot migration

Submit the workflow:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Use `workflow manage` as the primary interface. If approvals appear, validate and approve the output, or use the CLI directly:

```bash
workflow approve step "*.evaluateMetadata"
workflow approve step "*.migrateMetadata"
```
{% include copy.html %}

After the pilot completes, validate the target cluster:

```bash
console clusters curl target /_cat/indices?v
console clusters curl target /<PILOT_INDEX_NAME>/_mapping
console clusters curl target /<PILOT_INDEX_NAME>/_count
console clusters curl target /<PILOT_INDEX_NAME>/_search?size=5&pretty
```
{% include copy.html %}

Do not start the full migration until the pilot looks clean.
{: .note }

## Step 11: Run the full migration

To expand the migration to all indexes, edit the workflow configuration:

```bash
workflow configure edit
```
{% include copy.html %}

For a full-cluster backfill-only migration, update the configuration as follows:

```json
"config": {
  "createSnapshotConfig": {
    "indexAllowlist": [],
    "includeGlobalState": true
  }
}
```
{% include copy.html %}

```json
"metadataMigrationConfig": {
  "indexAllowlist": [],
  "multiTypeBehavior": "UNION"
}
```
{% include copy.html %}

```json
"documentBackfillConfig": {
  "indexAllowlist": [],
  "podReplicas": 4
}
```
{% include copy.html %}

An empty metadata or RFS `indexAllowlist` specifies all eligible indexes from the snapshot.

The following sections describe the steps for each migration approach. Follow the section that corresponds to the approach you selected in Step 1.

### Planned downtime path

For a planned downtime migration, follow these steps:

1. Stop writes to Elasticsearch.
2. Submit the workflow.
3. Monitor and approve gates as needed.
4. Validate the target.
5. Recreate anything Migration Assistant does not move automatically, such as security configuration, ISM or ILM, dashboards, pipelines, and cluster tuning.
6. Point clients to the target.
7. Resume writes.

### Zero-downtime path

For a zero-downtime migration, add a traffic section to the workflow configuration. This section configures the capture proxy and Replayer:

```json
"traffic": {
  "proxies": {
    "capture": {
      "source": "source",
      "proxyConfig": {
        "listenPort": 9200,
        "podReplicas": 2,
        "internetFacing": false
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

To expose the proxy outside the VPC, set `internetFacing` to `true` in the workflow configuration before submitting. Do not modify the Kubernetes Service resource after submission.

Then follow these steps:

1. Submit the workflow.
2. Wait for the capture proxy Kubernetes Service to become available.
3. Route clients to the proxy before the snapshot and backfill window begins.
4. Allow snapshot, metadata migration, and backfill to complete.
5. Wait for replay to reach the live edge.
6. Validate the target.
7. Switch clients from the proxy to the target endpoint.

Find the proxy endpoint:

```bash
kubectl get svc -n ma
```
{% include copy.html %}

Replay duration depends on the volume of traffic accumulated during backfill and the configured `speedupFactor`.

## Step 12: Validate and switch traffic

Before switching traffic, validate the following:

- Target cluster health.
- Target index list.
- Document counts.
- Representative search results.
- Mapping behavior for migrated multi-type data.

To validate, run the following commands:

```bash
console clusters curl source /_cat/indices?v
console clusters curl target /_cat/indices?v
console clusters curl target /_cat/aliases?v
console clusters curl target /_cluster/health
```
{% include copy.html %}

<details markdown="block">
<summary><strong>Optional: advanced validation on EKS</strong></summary>

On EKS, you can review additional replay and comparison telemetry in Amazon CloudWatch. Inspect the following:

- Replay heartbeat logs to confirm replay is progressing.
- `tupleComparison` metrics to compare source and target response behavior.
- Target-side errors for write mismatches.

This validation is particularly important for zero-downtime migrations that require more thorough verification than document-count comparison alone.

</details>

After validation confirms the target is correct, redirect clients to the OpenSearch Service domain endpoint.

## Step 13: Keep the source available as a fallback

Do not remove the source cluster immediately after switching traffic. Keep the source available until you confirm the following:

- Production traffic is stable on the target.
- Application error rates are within expected ranges.
- Dashboards and operational tooling function correctly.
- All clients are redirected away from the capture proxy.

A rollback window of 24 to 72 hours is recommended.

## Step 14: Remove the migration infrastructure

Only remove infrastructure after the rollback window has passed.

Remove the Helm release and namespace:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma --timeout=120s
```
{% include copy.html %}

Delete the CloudFormation stack:

```bash
aws cloudformation delete-stack --region <REGION> --stack-name MA
aws cloudformation wait stack-delete-complete --region <REGION> --stack-name MA
```
{% include copy.html %}

This removes the Migration Assistant EKS environment. It does not remove your source cluster, target domain, or snapshot data automatically.

If you no longer need the snapshot bucket, delete it by running the following command:

```bash
aws s3 rb s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION> --force
```
{% include copy.html %}

## Troubleshooting

The following are common issues and their resolutions.

### Bootstrap fails during CloudFormation

To verify the CloudFormation stack status, run the following command:

```bash
aws cloudformation describe-stacks --region <REGION> --stack-name MA --query "Stacks[0].StackStatus"
```
{% include copy.html %}

If the stack status is `ROLLBACK_COMPLETE` or `CREATE_FAILED`, delete the stack and rerun the bootstrap script.

### Bootstrap fails after CloudFormation but before Helm deployment

Rerun the bootstrap script:

```bash
./aws-bootstrap.sh --skip-cfn-deploy --stage <STAGE> --region <REGION>
```
{% include copy.html %}

### Target returns 403

The Migration Assistant IAM role does not have sufficient permissions on the target domain. Map the role to an appropriate backend role in the target cluster security configuration.

### Snapshot creation fails with ExpiredToken

The temporary S3 credentials on the source cluster have expired. Refresh the credentials and reload the secure settings:

```bash
curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_nodes/reload_secure_settings"
```
{% include copy.html %}

### Pilot succeeds from console but workflow fails

This issue indicates a difference between console pod access and workflow executor pod access. On EKS, verify that the workflow executor service accounts have the required AWS identity and network access.

## Related documentation

For more information, see the following resources:

- [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/)
- [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
- [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/)
- [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/)
